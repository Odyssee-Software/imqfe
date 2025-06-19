import { Queue , QueueWorker , crypto , z , logger , yaml , CreateQueueOptions } from '@depts';

import { resolverExpectedResults } from './u/resolver-expected-results';
import { simpleTransform } from './u/simple-transform';

/**
 * Zod schema for validating WorkerCallback functions.
 * 
 * This schema verifies that:
 * - The value is a function
 * - The function has a 'controller' property that is also a function
 * - The controller function has a 'name' property that is a string
 * 
 * @see WorkerCallback
 * @see WorkerController
 * 
 * @example
 * ```ts
 * const myCallback = WorkerController((job) => {
 *   // Worker logic here
 * });
 * WorkerCallbackSchema.parse(myCallback); // Validates the callback
 * ```
 */
const WorkerCallbackSchema = z.custom<WorkerCallback>((val:any) => {
  return (
    typeof val === 'function' &&
    typeof (val as any).controller === 'function' &&
    typeof (val as any).controller.name === 'string' // ou autre validation logique
  );
}, {
  message: "Invalid WorkerController function object. Ensure to use 'WorkerController' function."
});

/**
 * Schema for an array of worker callbacks.
 * @type {z.ZodArray<typeof WorkerCallbackSchema>}
 */
const WorkersSchema = z.array(WorkerCallbackSchema);

/**
 * Represents an in-memory queue structure for managing worker callbacks.
 * 
 * @interface MemoryQueue
 * @extends {MQ}
 * 
 * @property {WorkerCallback[]} results - Array storing callback results from workers
 * @property {WorkerCallback[]} jobs - Array storing pending worker callback jobs
 */
type MemoryQueue = {
  results : WorkerCallback[];
  jobs : WorkerCallback[];
} & typeof MQ;

/**
 * Extends the native Map class to provide specialized callback management for the message queue system.
 * This class handles the storage and lifecycle management of queue-related callbacks.
 * 
 * @class MQCallbackMap
 * @extends {Map}
 * 
 * @description
 * MQCallbackMap is designed to store and manage callbacks associated with various queue events.
 * It provides additional functionality for cleaning up resources when callbacks are no longer needed.
 * 
 * @example
 * ```typescript
 * const callbacks = new MQCallbackMap();
 * callbacks.set('event:id', () => console.log('Callback executed'));
 * // When done
 * callbacks.dispose();
 * ```
 */
class MQCallbackMap extends Map{

  /**
   * Removes all entries from the queue by deleting each key-value pair.
   * This method cleans up all resources held by the queue callbacks map.
   * 
   * @remarks
   * This operation is irreversible and will empty the entire queue callbacks map.
   */
  dispose(){
    [...this.keys()].forEach(( key ) => this.delete( key ))
  }

}

type Options = CreateQueueOptions & {
  name : string;
};

/**
 * Represents a memory-based message queue implementation.
 * Extends the base Queue class to provide in-memory job processing capabilities.
 * 
 * @class MQ
 * @extends {Queue}
 * 
 * @property {WorkerCallback[]} jobs - Array of pending worker callbacks to be executed
 * @property {WorkerCallback[]} results - Array of completed worker callback results
 * @property {MQCallbackMap} callbacks - Map storing event callbacks for queue operations
 * 
 * @description
 * The MQ class implements an in-memory message queue system that:
 * - Manages worker jobs and their execution results
 * - Handles job lifecycle events (start, success, error, end)
 * - Provides callback registration for job monitoring
 * - Supports job enqueueing and validation
 * 
 * @example
 * ```typescript
 * const queue = new MQ({ name: 'myQueue' });
 * 
 * // Register event handlers
 * queue.on('success', (job) => console.log('Job completed:', job.id));
 * 
 * // Enqueue workers
 * queue.enqueue((queue) => new Worker(queue));
 * ```
*/
class MQ extends Queue{

  name : string = "";

  /**
   * An array of worker callback functions.
   * Each callback represents a job that can be executed by the worker.
   */
  jobs: WorkerCallback[] = [];
  /**
   * Array storing worker callback functions.
   * Each callback represents a completed task's result handler.
   */
  results: WorkerCallback[] = [];
  /**
   * A map storing callback functions for the message queue system.
   * Each callback is associated with a specific message or event type.
   */
  callbacks = new MQCallbackMap();

  currents:Set<WorkerCallback> = new Set();

  constructor( options : Options ){

    super( options );
    let queueId = crypto.randomUUID();
    Object.assign(
      this,
      {
        id : queueId,
        name : options.name || queueId,
      }
    )

    this.on('start' , async ( job:WorkerCallback ) => {

      if( !job )return ;

      if( this.callbacks.has( `on:${job.id}:start` ) ){
        await this.callbacks.get( `on:${job.id}:start` )( job );
        this.callbacks.delete( `on:${job.id}:start` )
      }

      if( this.callbacks.has( `follow:${job.id}` ) ){
        await this.callbacks.get( `follow:${job.id}` ).bind(job)( 'start' , null , null );
      }

      this.currents.add( job );

    });

    this.on('success' , async ( job:WorkerCallback ) => {

      if( !job )return ;

      if( this.callbacks.has( `on:${job.id}:success` ) ){
        await this.callbacks.get( `on:${job.id}:success` )( job );
        this.callbacks.delete( `on:${job.id}:success` )
      }

      if( this.callbacks.has( `follow:${job.id}` ) ){
        await this.callbacks.get( `follow:${job.id}` ).bind(job)( 'success' , null , job );
        this.callbacks.delete( `follow:${job.id}` )
      }

      this.currents.delete( job );

    });

    this.on('error' , async ( job:WorkerCallback ) => {

      if( !job )return ;

      if( this.callbacks.has( `on:${job.id}:error` ) ){
        await this.callbacks.get( `on:${job.id}:error` )( job );
        this.callbacks.delete( `on:${job.id}:error` )
      }

      if( this.callbacks.has( `follow:${job.id}` ) ){
        await this.callbacks.get( `follow:${job.id}` ).bind(job)( 'error' , job , null );
        this.callbacks.delete( `follow:${job.id}` )
      }

      this.currents.delete( job );

    })

    this.on('end' , async () => {

      for await( let key of [...this.callbacks.keys()] ){
        if( key.startsWith('on:') && key.endsWith(':end') )await this.callbacks.get(key)();
      }

      this.callbacks.dispose();
    })

  }

  /**
   * Enqueues one or more worker factory functions into the queue.
   * Each factory is bound to the queue context and validated against the WorkersSchema.
   * 
   * @param tasks - Array of WorkerFactory functions to be enqueued
   * @returns Array of instantiated worker tasks after being processed through their factories
   * @throws Logs validation errors if the created workers don't match the WorkersSchema
   * 
   * @example
   * ```typescript
   * queue.enqueue(
   *   (queue) => new Worker(queue),
   *   (queue) => new OtherWorker(queue)
   * );
   * ```
   */
  enqueue( ...tasks : WorkerFactory[] ){
    let factorized_tasks = tasks.map(( task ) => task.bind( this )( this ) );

    let { success , error} = WorkersSchema.safeParse( factorized_tasks );

    if( !success ){
      error?.errors.forEach(( error:any ) => {
        logger.child({ name : error.code }).error( `\n${yaml.stringify(error).red}` );
      });
    }
    else this.push( ...factorized_tasks );

    return factorized_tasks;
  }

  /**
   * Removes and returns a job from the queue based on its ID.
   * @param jobId - The unique identifier of the job to remove (string or UUID)
   * @returns The removed job object if found, null otherwise
   * @memberof MemoryQueue
   */
  dequeue( jobId: string | crypto.UUID) {
    const index = this.jobs.findIndex(job => job.id === jobId);
    if (index !== -1) {
      const [removed] = this.jobs.splice(index, 1);
      return removed;
    }
    return null;
  }

  /**
   * Retrieves a job by its ID from both active jobs and completed results
   * @param jobId - The unique identifier of the job to find
   * @returns The job object if found, undefined otherwise
   */
  job( jobId : string | crypto.UUID ){
    return [...this.jobs , ...this.results].find( (job) => job.id == jobId );
  }

  start(callback?: ((error?: Error) => void) | undefined){ return super.start( callback ) }

}

/**
 * Represents the result of a worker operation in a message queue system.
 * @interface WorkerResult
 * @property {string | crypto.UUID} id - Unique identifier for the worker result
 * @property {boolean | null} success - Indicates if the operation was successful
 * @property {'waiting' | 'success' | 'error'} status - Current status of the worker
 * @property {any} data - Output data from the worker operation
 * @property {any} error - Error information if the operation failed
 * @property {Function} controller - Controller function for managing the worker
 * @property {WorkerControllerProperties} properties - Configuration properties for the worker controller
 * @property {MQ} queue - Reference to the message queue instance
 * @property {function(cb: (error: any, result: any) => void): void} follow - Method to track worker progress
 * @property {function(event: 'start' | 'error' | 'success', cb: (job: WorkerResult) => void): void} on - Event handler for worker lifecycle events
 * @property {function(event: 'end', cb: () => void): void} on - Event handler for worker completion
 */
type WorkerResult = { 
  id : string | crypto.UUID;
  success : boolean | null;
  status : 'waiting' | 'success' | 'error';
  data : any;
  error : any;
  controller : Function;
  properties : WorkerControllerProperties;
  createdDt : number;
  executionDt : number | null;
  completedDt : number | null;
  queue:MQ;
  /** Method to track worker progress */
  follow( cb:( step : string , error:any , result:any ) => void ):void;
  /** Event handler for worker lifecycle events */
  on:(( event : 'start' | 'error' | 'success' , cb:( job:WorkerResult ) => void ) => void) & (( event : 'end' , cb:() => void ) => void);
  /**
  * Attempts to resolve required dependencies by searching through jobs and results in the queue.
  * Will retry multiple times with delays if no matches are found initially.
  * 
  * @param requires - Array of string identifiers representing required dependencies
  * @returns Array of WorkerCallback matches that provide the required dependencies
  * @remarks Uses exponential backoff retry pattern with max 4 attempts and 100ms delay between attempts
  * @this WorkerResult - Method must be called in context of a WorkerResult instance
  */
  resolveRequiresByName(this: WorkerResult, requires: string[]):WorkerCallback[];
  awaitResolveRequire(this: WorkerResult, requires : WorkerCallback[] ):Promise<WorkerCallback[]>;
};

/**
 * Represents a record of worker controller properties where keys are strings and values can be of any type.
 * This type is used to store arbitrary configuration or state data associated with a worker controller.
 * @typedef {Record<string, any>} WorkerControllerProperties
 */
type WorkerControllerProperties = Record<string , any>;

/**
 * Represents a combined type that merges QueueWorker and WorkerResult interfaces.
 * This type is used to define a callback function for queue workers that includes
 * both worker functionality and result handling capabilities.
 * 
 * @typedef {QueueWorker & WorkerResult} WorkerCallback
 */
type WorkerCallback< T extends Record< string , any > = Record< string , any > > = (QueueWorker & WorkerResult & T);

/**
 * A factory function that creates a worker callback for processing queue items.
 * @param queue - The message queue instance to associate with the worker
 * @returns A callback function that will be executed for each queue item
 */
type WorkerFactory = ( queue:MQ ) => WorkerCallback;

/**
 * A function type that creates a worker factory with control capabilities.
 * @param controller - A function used to control the worker behavior
 * @param properties - A record of key-value pairs representing the worker properties
 * @returns A WorkerFactory instance that can create new workers
 */
type WorkerController = (( controller:Function , properties : Record<string , any> ) => WorkerFactory );

/**
 * Creates a worker controller function that manages asynchronous task execution.
 * 
 * @param controller - The main controller function that performs the actual task
 * @param properties - A record of properties to be passed to the controller
 * 
 * @returns A function that when called with a queue context, returns a WorkerResult object with the following capabilities:
 * - Tracks execution status ('waiting', 'success', 'error')
 * - Unique ID generation
 * - Access to original controller and queue
 * - Custom properties storage
 * - Follow callback registration for monitoring
 * - Event handling for 'start', 'error', 'success', and 'end' events
 * 
 * The returned WorkerResult also includes execution results (success/error states and data)
 * when the worker completes its task.
 * 
 * @example
 * ```typescript
 * const worker = WorkerController(async (props) => {
 *   // Perform task
 * }, { someProperty: 'value' });
 * 
 * const result = worker(queue);
 * result.follow((status) => console.log(status));
 * result.on('success', (data) => console.log(data));
 * ```
 */
function WorkerController( controller:any , properties : Record<string , any> , options ? : Record<string , any> ) : WorkerFactory{

  return function( this:MQ , queue:MQ ){

    const self = this;

    const workerController = Object.assign( worker_ctr ,
      {
        success : null,
        status : 'waiting',
        id : crypto.randomUUID(),
        properties,
        get controller(){ return worker_ctr },
        data : null,
        error : null,
        get queue(){return self || queue},
        createdDt : Date.now(),
        executionDt : null,
        completedDt : null,
        follow( cb ) {
          this.queue.callbacks.set( `follow:${this.id}` , cb );
        },
        on( event : 'start' | 'error' | 'success' | 'end' , cb ){
          this.queue.callbacks.set( `on:${this.id}:${event}` , cb );
        },
        resolveRequiresByName( requires: string[] ):WorkerCallback[]{

          let _j = [...this.queue.jobs, ...Array.from( this.queue.currents ) ,  ...this.queue.results].flat(1);
          const matches = _j.filter((job: any) => {
            if (!job) return false;
            let _matches = (job.provides || []).filter((key: string) => requires.includes(key));
            return _matches.length > 0;
          });

          if (matches.length > 0) {
            return matches;
          }
          else return [];
        },
        async awaitResolveRequire( requires : WorkerCallback[] ):Promise<WorkerCallback[]>{
          return Promise.all(
            Array.from(
              requires,
              ( worker ) => {
                return new Promise(( next , reject ) => {
                  worker.on('success' , ( job ) => next( job ));
                  worker.on('error' , ( job ) => reject( job ));
                })
              }
            )
          ) as Promise<WorkerCallback[]>
        }
      } as WorkerResult,
      options || {},
    ) as WorkerCallback;

    async function worker_ctr (){

      return new Promise(async ( next ) => {

        let executionDt = Date.now();

        /**
         * Executes a worker controller without handling dependencies.
         * Updates the worker controller state with the execution results.
         * 
         * @remarks
         * This function wraps the controller execution and formats its response
         * into a standardized worker controller output format.
         * 
         * @async
         * @internal
         * @returns {Promise<void>} A promise that resolves when the controller execution is complete
         * @throws {Error} Any error that occurs during controller execution will be propagated
         */
        async function workerExecNoDependencies(){
          next(Object.assign( workerController , {
              status : 'success',
              success : true,
              executionDt,
              completedDt : Date.now(),
              data : await controller( properties ),
          }))
        }

        /**
         * Executes a worker controller with dependencies from previous job results
         * @param jobs - Array of WorkerResult objects containing data from previous executions
         * @returns Promise<void>
         * @throws {Error} Propagates any error caught during controller execution
         * @remarks
         * This function:
         * 1. Maps job results to an object using array indices as keys
         * 2. Passes the mapped data to a controller function
         * 3. Updates the worker controller state with the execution result
         */
        async function workerExecWithDependencies( jobs:WorkerCallback[] ){

          let properties = Object.fromEntries( 
            new Map(
              jobs.map(( job , i ) => {
                return [ 
                  i , 
                  job.resolver?.results 
                  ? resolverExpectedResults( job.data , job.resolver?.results ) 
                  : (job.data || null)
                ];
              } ) 
            ) 
          );
          try{

            if( 'transform' in workerController.resolver?.params ){
              console.log({ properties })
              properties = simpleTransform( 
                properties,
                { transform : workerController.resolver?.params.transform }
              )
              console.log({ properties })
            }
            
            let data = await controller( properties );
            next(Object.assign( workerController , {
              status : 'success',
              success : true,
              executionDt,
              completedDt : Date.now(),
              data : data
            }))
          }
          catch(error){
            workerError( error );
          }

        }

        /**
         * Handles worker errors by updating the worker controller with error status
         * and forwarding the result to the next handler.
         * 
         * @param {any} error - The error object to be attached to the worker result
         * @returns {void}
         */
        function workerError( error:any){
          next(Object.assign( workerController , {
            status : 'error',
            success : false,
            executionDt,
            completedDt : Date.now(),
            error : error
          }) as WorkerResult );
        }

        /**
         * Executes worker dependencies resolution and handles potential errors
         * @param requires - Array of worker callbacks to be resolved
         * @returns Result of worker dependencies execution or error handler result
         * @throws {Error} Propagates any error to the worker error handler
         */
        function workerExecResolveRequire( requires:WorkerCallback[] ){

          try{
            return workerExecWithDependencies( requires );
          }
          catch(error){
            return workerError( error );
          }
        }

        if( !workerController.requires || workerController.requires == 0 ){
          try{
            await workerExecNoDependencies();
          }
          catch(error){
            workerError( error );
          }
        }
        else{

          let requires = workerController.resolveRequiresByName( workerController.requires || [] );

          let isSuccess = !requires.map(( worker ) => worker.success == true ? true : false ).includes( false );
          let isErrored = requires.map(( worker ) => worker.status == 'error' ? true : false).includes( true );
          let isWaiting = !isSuccess && !isErrored ? true : false;

          if( isWaiting )workerController.awaitResolveRequire( requires ).then(async ( requires ) => {
            await workerExecResolveRequire( requires as WorkerCallback[] );
          })
          else if( isSuccess )await workerExecResolveRequire( requires );
          else await workerExecResolveRequire( [] );

        }

      })

    }

    return workerController;

  } as unknown as WorkerFactory;

}

/**
 * Type representing a mapping of queue names to their corresponding message queue instances.
 * Uses JavaScript's built-in Map data structure to store queue name strings as keys and
 * MQ (Message Queue) instances as values.
 * 
 * @typedef {Map<string, MQ>} InMemoryQueues
 */
type InMemoryQueues = Map< string , MQ >;

/**
 * Global map storing in-memory message queues.
 * @type {Map<string, MQ>}
 * The key is a unique queue identifier string.
 * The value is a message queue instance of type MQ.
 */
const InMemoryQueues:Map< string , MQ > = new Map();

export { 
  MQ , 
  Options ,
  WorkerController , 
  InMemoryQueues , 
  MemoryQueue , 
  MQCallbackMap , 
  WorkerResult , 
  WorkerControllerProperties , 
  WorkerCallback , 
  WorkerFactory 
};