import { crypto } from '@depts';
import { InMemoryQueues , MQ , WorkerController } from './qm';

import { ResolversRegistry } from './resolver-registry';

import { resolverExpectedResults } from './u/resolver-expected-results';

/**
 * Objectives :
 * 
 * Main features of this module:
 * - Parallel execution
 * - Dependency management
 * - Asynchronous and synchronous tasks
 * - JSON based flows
 * - Parametrized running
 * - Scoped visibility for tasks
 * - Run flows from string, object, file or URL
 * - Pause/Resume and Stop/Reset functions
 * - Inline parameters transformation
 * - Cyclic flows
 * - Library with reusable frequently used tasks
 * * - Echo
 * * - Noop
 * * - ThrowError
 * * - Conditional
 * * - SubFlow
 * * - Repeater
 * * - ArrayMap
 * * - Stop
 * * - Pause
 * - Plugin system
 * - Debugging
*/

/**
 * Represents a worker resolver configuration in the task execution flow.
 *
 * @interface WorkerResolver
 * @property {string} name - The identifier or name of the worker resolver
 * @property {Record<string, string>} [params] - Optional key-value pairs of parameters for the worker
 * @property {Record<string, string>} [results] - Optional key-value pairs of expected results from the worker
 */
interface WorkerResolver{
  name : string;
  params? : Record<string , string>;
  results? : Record<string , string>;
}

/**
 * Represents a worker that can process tasks in a workflow.
 *
 * @interface TaskWorker
 * @property {string[]} provides - Array of outputs this worker can produce
 * @property {string[]} requires - Array of inputs this worker needs to function
 * @property {WorkerResolver} resolver - Function that implements the worker's logic
 */
interface TaskWorker{
  provides : string[];
  requires : string[];
  resolver : WorkerResolver
}

/**
 * Represents the specification of a flow within the system.
 * 
 * @interface FlowSpec
 * @property {Record<string, TaskWorker>} tasks - A mapping of task identifiers to their corresponding TaskWorker implementations.
 *                                                Each key represents a unique task identifier, and the value is the associated worker.
 */
interface FlowSpec{
  tasks : Record<string , TaskWorker>;
}

class FlowProducer{

  queue : MQ = null as any;
  specs : FlowSpec = { tasks : {} };
  resolverRegistry = ResolversRegistry;

  constructor( specs? : { tasks : Record< string , TaskWorker > } ){

    let queuename = crypto.randomUUID();
    InMemoryQueues.set( queuename , new MQ({ results : [] , name : queuename }) )
    this.queue = InMemoryQueues.get( queuename ) as MQ;

    this.specs = specs || { tasks : {} };

    // if( specs && specs.tasks ){
    //   Object.keys( specs.tasks ).forEach(( taskName:string ) => {
    //     this.add( taskName , specs.tasks[taskName] );
    //   })
    // }

  }

  add( taskname:string , task : TaskWorker ){

    if( ResolversRegistry[task.resolver.name as keyof typeof ResolversRegistry] ){
      let callback = ResolversRegistry[task.resolver.name as keyof typeof ResolversRegistry];
      return this.queue.enqueue( WorkerController( callback , task.resolver?.params || {} , {
        taskname : taskname,
        ...task
      } ));
    }
    else throw "";

  }

  run( params : Record<string , any> , expectedOutputs : string[] , actions : Record<string , any> , context : Record<string , any> ){

    this.resolverRegistry = Object.assign( ResolversRegistry , actions || {} );

    if( this.specs && this.specs.tasks ){
      Object.keys( this.specs.tasks ).forEach(( taskName:string ) => {
        this.add( taskName , this.specs.tasks[taskName] );
      })
    }

    return FlowProducer.run( this , params , expectedOutputs , context );
  }

  static run( flow : FlowProducer , params : Record<string , any> , expectedOutputs : string[] , context : Record<string , any> ){

    console.log({ params , expectedOutputs , actions : flow.resolverRegistry , context })

    return new Promise(( next ) => {
      flow.queue.start(() => {

        let resolved = [...flow.queue.jobs , ...flow.queue.results].flat(1);

        let outputs = resolved
        .filter( x => x )
        .filter((result) => {
          let x : any = result;
          return (x?.provides || []).map(( provideKey:string ) => {
            // if( expectedOutputs.includes(provideKey) && x.resolver.results[provideKey] )return true;
            if( expectedOutputs.includes(provideKey))return true;
            else return false;
          }).includes( true )
        })

        .map(( result ) => {

          if( result.resolver?.results ){
            return resolverExpectedResults( result.data , result.resolver.results )
          }
          else{
            return result.data;
          }

        })

        // .map(( result ) => {

        //   let x : any = result;
        //   let keysValue : [string , any][];

        //   if( x.resolver.results ){

        //     let resolverResults = x.resolver.results;
        //     keysValue = Object.keys(x.data).map(( dataKey ) => {
        //       if( dataKey in resolverResults )return [ resolverResults[dataKey] , x.data[dataKey] ];
        //       return null;
        //     }).filter( (x:any) => x ) as [string , any][];
            
        //   }
        //   else keysValue = Object.keys(x.data).map(( dataKey ) => [ dataKey , x.data[dataKey] ]) as [string , any][];

        //   return keysValue;

        // })
        // .flat(1)
        // .reduce(( obj , [ key , value ] ) => {
        //   obj[key] = value;
        //   return obj;
        // } , {  } as Record<string , any>);

        console.log({ outputs })

        next( outputs )
      });
    })

  } 
  static runFromString(){}
  static runFromFile(){}
  static runFromUrl(){}

}

// function FlowManager(){

// }

export {
  WorkerResolver,
  TaskWorker,
  FlowSpec,
  FlowProducer
}