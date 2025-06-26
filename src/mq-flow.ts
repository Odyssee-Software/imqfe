import { crypto ,yaml } from '@depts';
import { ValueMap } from '@types';
import { IMQ , MQ , WorkerController } from './mq';

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

namespace FlowProducer{

  /**
   * Represents a worker resolver configuration in the task execution flow.
   *
   * @interface WorkerResolver
   * @property {string} name - The identifier or name of the worker resolver
   * @property {Record<string, string>} [params] - Optional key-value pairs of parameters for the worker
   * @property {Record<string, string>} [results] - Optional key-value pairs of expected results from the worker
   */
  export interface WorkerResolver{
    name : string;
    params? : ValueMap;
    results? : ValueMap;
  }

  /**
   * Represents a worker that can process tasks in a workflow.
   *
   * @interface TaskWorker
   * @property {string[]} provides - Array of outputs this worker can produce
   * @property {string[]} requires - Array of inputs this worker needs to function
   * @property {WorkerResolver} resolver - Function that implements the worker's logic
   */
  export interface TaskWorker{
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
  export interface FlowSpec{
    tasks : Record<string , TaskWorker>;
  }

}

class FlowProducer{

  queue : MQ = null as any;
  specs : FlowProducer.FlowSpec = { tasks : {} };
  resolverRegistry = ResolversRegistry;

  constructor( specs? : { tasks : Record< string , FlowProducer.TaskWorker > } ){

    let queuename = crypto.randomUUID();
    IMQ.set( queuename , new MQ({ results : [] , name : queuename }) )
    this.queue = IMQ.get( queuename ) as MQ;

    this.specs = specs || { tasks : {} };

  }

  add( taskname:string , task : FlowProducer.TaskWorker ){

    if( ResolversRegistry[task.resolver.name as keyof typeof ResolversRegistry] ){
      let callback = ResolversRegistry[task.resolver.name as keyof typeof ResolversRegistry];
      return this.queue.enqueue( WorkerController( callback , task.resolver?.params || {} , {
        taskname : taskname,
        ...task
      } ));
    }
    else throw "";

  }

  run( params : ValueMap , expectedOutputs : string[] , actions : ValueMap , context : ValueMap ){

    this.resolverRegistry = Object.assign( ResolversRegistry , actions || {} );

    if( this.specs && this.specs.tasks ){
      Object.keys( this.specs.tasks ).forEach(( taskName:string ) => {
        this.add( taskName , this.specs.tasks[taskName] );
      })
    }

    return FlowProducer.run( this , params , expectedOutputs , context );
  }

  static run( flow : FlowProducer , params : ValueMap , expectedOutputs : string[] , context : ValueMap ):Promise<ValueMap>{

    console.log({ params , expectedOutputs , actions : flow.resolverRegistry , context })

    return new Promise(( next ) => {
      flow.queue.start(() => {

        let resolved = [...flow.queue.jobs , ...flow.queue.results].flat(1);

        let outputs = resolved
        .filter( x => x )
        .filter((result) => {
          let x : any = result;
          return (x?.provides || []).map(( provideKey:string ) => {
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

        next( 
          outputs.flat().reduce(( acc , current ) => {
            return Object.assign( acc , current );
          } , {} )
        )
      });
    })

  } 

  static runFromString( str : string ){
    try{
      return new FlowProducer( JSON.parse( str ) );
    }
    catch( error ){
      try{
        return new FlowProducer( yaml.parse( str ) );
      }
      catch( error ){
        throw new Error(`Error parsing flow from string` , { cause : error });
      }
    }
  }

  static runFromFile( absolutePath : string ){

    return new Promise(( next , reject ) => {
      import('fs').then( fs => {
        fs.readFile( absolutePath , 'utf8' , ( error , data ) => {
          if( error ) return reject( error );
          try{
            next( FlowProducer.runFromString( data ) );
          }
          catch( error ){
            reject( error );
          }
        })
      }).catch( error => {
        reject( new Error(`Error importing 'fs' module to read file: ${absolutePath}` , { cause : error }) );
      })
    })

  }

  static runFromUrl( url : string | URL ){
    return new Promise(( next , reject ) => {
      import('node-fetch').then( fetch => {
        fetch.default( url )
        .then( response => {
          if( !response.ok ) throw new Error(`Error fetching URL: ${url} - Status: ${response.status}`);
          return response.text();
        })
        .then( data => {
          try{
            next( FlowProducer.runFromString( data ) );
          }
          catch( error ){
            reject( error );
          }
        })
        .catch( error => {
          reject( new Error(`Error fetching URL: ${url}` , { cause : error }) );
        });
      }).catch( error => {
        reject( new Error(`Error importing 'node-fetch' module to fetch URL: ${url}` , { cause : error }) );
      })
    })
  }

}

export {
  FlowProducer
}