import type { ValueMap } from '@types';

import type { MQ } from './mq';
import { FlowProducer } from './mq-flow';
// import { simpleTransform } from '@u/simple-transform';
import { handleTransformProperties } from '@u/handle-transform-properties';

namespace ResolversRegistry {

  export namespace Echo{

    export type Input = { 
      /** Input value to echo back. */
      in : any 
    };

    export type Output = { 
      /** Output value that is the same as input. */
      out : any 
    };

    export type Fn = (params: Input , context?: MQ.WorkerContext) => Output;

  }

  export namespace Noop{

    export type Input = ValueMap;

    export type Output = ValueMap;

    export type Fn = (params: Input) => Output;

  }

  export namespace ThrowError {
    
    export type Input = { message?: string };

    export type Output = ValueMap;

    export type Fn = (params: Input , context?: MQ.WorkerContext) => Output;

  }

  export namespace Conditional {

    export type Input = {
      /** Condition to evaluate. */
      condition: boolean;
      /** Result to return if condition is true. */
      trueResult: ValueMap;
      /** Result to return if condition is false. */
      falseResult: ValueMap;
    };

    export type Output = {
      /** Result to return if condition is true. */
      onTrue?: ValueMap;
      /** Result to return if condition is false. */
      onFalse?: ValueMap;
    };

    export type Fn = (params: Input , context?: MQ.WorkerContext) => Output;

  }

  export namespace Wait {

    export type Input = {
      /** Number of milliseconds to wait. */
      ms: number;
      /** Result to return after waiting. */
      result?: ValueMap;
    };

    export type Output = {
      /** Result after waiting. */
      result?: ValueMap;
    };

    export type Fn = (params: Input , context?: MQ.WorkerContext) => Promise<Output>;

  }

  export namespace SubFlow {

    export type Input = {
      /** Specification of the flow to run. */
      flowSpec: FlowProducer.FlowSpec;
      flowExpectedResults?: string[];
    };

    export type Output = ValueMap;

    export type Fn = (params: Input, context?: MQ.WorkerContext) => Promise<Output>;

  }

  export namespace Repeater {

    export type Input = {
      count: number;
      /** Resolver to run the task. */
      resolver: string;
      /** Specification of the task to run. */
      taskSpec: FlowProducer.FlowSpec["tasks"];
      /** Parameters to supply to the task. */
      taskParams?: ValueMap;
      /** Whether to run tasks in parallel. */
      parallel?: boolean;
      /** Whether to automatically map parameters to task. */
      resolverAutomapParams?: boolean;
      /** Whether to automatically map results from task. */
      resolverAutomapResults?: boolean;
    };

    export type Output = ValueMap;

    export type Fn = (params: Input, context?: MQ.WorkerContext) => Output;

  }

  export namespace Loop {

    export type Input = {
      /** Input collection to iterate over. */
      inCollection: any[];
      /** Name of the input item in the collection. */
      inItemName: string;
      /** Name of the output item in the collection. */
      outItemName: string;
      /** Specification of the subtask to run for each item. */
      subtask: ValueMap;
      /** Whether to run tasks in parallel. */
      parallel?: boolean;
      /** Whether to automatically map parameters to task. */
      automapParams?: boolean;
      /** Whether to automatically map results from task. */
      automapResults?: boolean;
    };

    export type Output = {
      /** Collection of results from the task executions. */
      outCollection: any[];
    };

    export type Fn = (params: Input, context?: MQ.WorkerContext) => Promise<Output>;

  }

  export namespace ArrayMap {

    export type Input = {
      /** Array of Key-Value objects with params. */
      params: any[];
      /** Resolver to run the task. */
      resolver: string;
      /** Specification of the task to run. */
      taskParams: ValueMap;
      /** Whether to run tasks in parallel. */
      parallel?: boolean;
      /** Whether to automatically map parameters to task. */
      automapParams?: boolean;
      /** Whether to automatically map results from task. */
      automapResults?: boolean;
    };

    export type Output = {
      /** Array of results from the task executions. */
      results: any[];
    };

    export type Fn = (params: Input, context?: MQ.WorkerContext) => Promise<Output>;

  }

  export namespace Stop {

    export type Input = ValueMap;

    export type Output = {
      /** Promise that resolves when the flow stops. */
      promise?: Promise<void>;
    };

    export type Fn = (params: Input, context?: MQ.WorkerContext) => Output;

  }

}

/**
 * Registry of built-in flow resolvers.
 * Each resolver is a function that takes parameters and returns a result.
 * @namespace ResolversRegistry
 */
interface ResolversRegistry {

  /**
   * Returns the input value or its transformation as the result.
   * @param {ValueMap} params - Parameters object containing 'in' value to echo
   * @returns {ValueMap} Object containing 'out' property with the input value
   */
  'imqfe::Echo': ResolversRegistry.Echo.Fn;

  /**
   * Does nothing and returns an empty object.
   * @returns {ValueMap} Empty object
   */
  'imqfe::Noop': ResolversRegistry.Noop.Fn;

  /**
   * Throws an error with a specified message.
   * @param {ValueMap} params - Parameters object containing optional 'message' string
   * @throws {Error} Always throws with either specified message or default message
   */
  'imqfe::ThrowError': ResolversRegistry.ThrowError.Fn;

  /**
   * Provides one of two possible results depending on a given condition.
   * @param {ValueMap} params - Parameters containing 'condition', 'trueResult', and 'falseResult'
   * @returns {ValueMap} Object with either 'onTrue' or 'onFalse' property based on condition
   */
  'imqfe::Conditional': ResolversRegistry.Conditional.Fn;

  /**
   * Waits for specified milliseconds and returns the specified result.
   * @param {ValueMap} params - Parameters containing 'ms' for delay and 'result' for return value
   * @returns {Promise<ValueMap>} Promise resolving to object with 'result' property after delay
   */
  'imqfe::Wait': ResolversRegistry.Wait.Fn;

  /** Executes a sub-flow within the current flow. */
  'imqfe::SubFlow': ResolversRegistry.SubFlow.Fn;

  /** Repeats execution of a flow segment. */
  'imqfe::Repeater': ResolversRegistry.Repeater.Fn;

  'imqfe::Loop': ResolversRegistry.Loop.Fn;

  /** Maps over an array applying a flow to each element. */
  'imqfe::ArrayMap': ResolversRegistry.ArrayMap.Fn;

  /** Stops the current flow execution. */
  'imqfe::Stop': ResolversRegistry.Stop.Fn;
}

const ResolversRegistry:ResolversRegistry = {
  // Returns the input value or its transformation as the result.
  'imqfe::Echo' : function(params : ResolversRegistry.Echo.Input ): ResolversRegistry.Echo.Output{
    return { out: params.in };
  },
  // Does nothing.
  'imqfe::Noop' : function(params : ResolversRegistry.Noop.Input ): ResolversRegistry.Noop.Output{
    return params;
  },
  // Throws an error with a specified message.
  'imqfe::ThrowError' : function(params: ResolversRegistry.ThrowError.Input ): ResolversRegistry.ThrowError.Output {
    throw new Error(typeof params.message !== 'undefined' ? params.message : 'ThrowErrorResolver resolver has thrown an error');
  },
  // Provides one of two possible results depending of a given condition.
  'imqfe::Conditional' : function(params: ResolversRegistry.Conditional.Input ): ResolversRegistry.Conditional.Output {
    return params.condition ? { onTrue: params.trueResult } : { onFalse: params.falseResult };
  },
  // Waits for ms milliseconds and finish returning the specified result.
  'imqfe::Wait' : function(params: ResolversRegistry.Wait.Input ): Promise<ResolversRegistry.Wait.Output> {
    return new Promise<ValueMap>(resolve => {
      setTimeout(() => {
        resolve({ result: params?.result || null });
      }, params.ms);
    });
  },
  'imqfe::SubFlow' : function(params: ResolversRegistry.SubFlow.Input, context?: MQ.WorkerContext ):Promise<ResolversRegistry.SubFlow.Output>{
    return new Promise(( resolve , reject ) => {
      let flow = new FlowProducer(params.flowSpec);

      flow.run(
        params.flowSpec,
        params.flowExpectedResults || [],
        {},
        context || {},
      )
      .then((flowResult:any) => {
        resolve( flowResult );
      })
      .catch((error) => {
        reject({ error: error.message });
      });
      
    })
  },
  'imqfe::Repeater'(params : ResolversRegistry.Repeater.Input , context?: MQ.WorkerContext ):Promise<ResolversRegistry.Repeater.Output>{

    return new Promise(async (resolve, reject) => {
      try{

        if( !params.resolver ){
          return reject(new Error('Repeater resolver requires a resolver name.'));
        }

        if( params.resolver in ResolversRegistry === false || typeof (ResolversRegistry as any)[params.resolver] !== 'function' ){
          return reject(new Error(`Repeater resolver '${params.resolver}' not found.`));
        }

        let resolverFn = (ResolversRegistry as any)[params.resolver] as Function;
        let results = [];

        if( params.parallel ){
          results = await Promise.all(
            Array.from(
              { length : params.count },
              ( _ , i ) => {
                try{
                  let _p = handleTransformProperties( params.taskParams || {} , { count : String(i) } );
                  return resolverFn( _p , context)
                }
                catch( error ){
                  return Promise.reject(error);
                }
              }
            )
          )
        }
        else for await ( let i of Array.from({ length : params.count } , ( _ , i ) => i ) ){
          try{
            let _p = handleTransformProperties( params.taskParams || {} , { count : String(i) } );
            results.push(resolverFn( _p , context));
          }
          catch( error ){
            return Promise.reject(error);
          }
        }

        if( params.resolverAutomapResults ){

        }

        resolve({ results });
      }catch( error ){
        console.error('Error in Repeater resolver:', error);
        reject(error);
      }
    })
  },
  /// TODO : LOOP resolver
  'imqfe::Loop' : function(params : ResolversRegistry.Loop.Input, context?: MQ.WorkerContext ):Promise<ResolversRegistry.Loop.Output>{
    return new Promise(async (resolve) => {

      let outCollection:ResolversRegistry.Loop.Output["outCollection"] = [];

      if( params.parallel ){
        outCollection = await Promise.all(
          Array.from( params.inCollection , async ( item ) => {
            try{
              let taskParams = { [params.inItemName] : item };
              return await new FlowProducer( { tasks : params.subtask } ).run( taskParams , [params.outItemName] , {} , context || {} as any )
            }
            catch( error ){
              return Promise.reject(error);
            }
          })
        )
      }
      else {
        for await ( let item of params.inCollection ){
          try{
            let taskParams = { [params.inItemName] : item };
            let taskResult = await new FlowProducer( { tasks : params.subtask } ).run( taskParams , [params.outItemName] , {} , context || {} as any );
            outCollection.push( taskResult );
          }
          catch( error ){
            return Promise.reject(error);
          }
        }
      }

      resolve({ outCollection });
    });
  },
  /// TODO : ArrayMap resolver
  'imqfe::ArrayMap' : function(params : ResolversRegistry.ArrayMap.Input, context?: MQ.WorkerContext ):Promise<ResolversRegistry.ArrayMap.Output>{
    return new Promise(async (resolve) => {

      let results:ResolversRegistry.ArrayMap.Output["results"] = [];
      let resolverFn = (ResolversRegistry as any)[params.resolver] as Function;

      if( params.parallel ){
        results = await Promise.all(
          Array.from(
            params.params,
            ( values , i  ) => {
              try{
                let taskParams = Object.assign( params.taskParams || {} , values );
                let _p = handleTransformProperties( taskParams || {} , { count : String(i) } );
                return resolverFn( _p , context)
              }
              catch( error ){
                return Promise.reject(error);
              }
            }
          )
        )
      }
      else{
        for await ( let i of Array.from( { length : params.params.length } , ( _ , i ) => i ) ){
          let values = params.params[i];
          try{
            let taskParams = Object.assign( params.taskParams || {} , values );
            let _p = handleTransformProperties( taskParams || {} , { count : String(i) } );
            results.push(resolverFn( _p , context));
          }
          catch( error ){
            return Promise.reject(error);
          }
        }
      }

      resolve({ results });
    });
  },
  'imqfe::Stop' : function( params : ResolversRegistry.Stop.Input, context?: MQ.WorkerContext ):ResolversRegistry.Stop.Output {
    console.log({ params, context });
    return { promise : Promise.resolve( context?.$queue.stop() ) };
  }
}

export { ResolversRegistry };

// // Run a flow and finish
// export class SubFlowResolver {
//   public async exec(params: ValueMap, context: MQ.WorkerContext): Promise<ValueMap> {

//     let flow = new FlowProducer(params.flowSpec);

//     let flowResult = await flow.run(
//       params.flowSpec,
//       params.flowExpectedResults,
//       {},
//       context,
//     );

//     return { flowResult };
//   }
// }

// // Run a task multiple times and finishes returning an array with all results.
// // If one execution fails, the repeater resolver ends with an exception (this is valid for both parallel and not parallel modes).
// export class RepeaterResolver {
//   public async exec(params: ValueMap, context: ValueMap, task: Task, debug: Debugger, log: LoggerFn): Promise<ValueMap> {
//     const resolver = context.$flowed.getResolverByName(params.resolver);
//     if (resolver === null) {
//       throw new Error(`Task resolver '${params.resolver}' for inner flowed::Repeater task has no definition.`);
//     }

//     const innerTask = new Task('task-repeat-model', params.taskSpec);

//     const resultPromises = [];
//     let results = [];
//     for (let i = 0; i < params.count; i++) {
//       innerTask.resetRunStatus();
//       innerTask.supplyReqs(params.taskParams);

//       // @todo add test with repeater task with taskContext

//       const process = new TaskProcess(
//         context.$flowed.processManager,
//         0,
//         innerTask,
//         resolver,
//         context,
//         !!params.resolverAutomapParams,
//         !!params.resolverAutomapResults,
//         params.flowId,
//         debug,
//         log,
//       );

//       const result = process.run();

//       if (params.parallel) {
//         resultPromises.push(result);
//       } else {
//         results.push(await result); // If rejected, exception is not thrown here, it is delegated
//       }
//     }

//     if (params.parallel) {
//       results = await Promise.all(resultPromises); // If rejected, exception is not thrown here, it is delegated
//     }

//     return { results };
//   }
// }

// export class ArrayMapResolver {
//   public async exec(params: ValueMap, context: ValueMap, task: Task, debug: Debugger, log: LoggerFn): Promise<ValueMap> {
//     const resolver = context.$flowed.getResolverByName(params.resolver);
//     if (resolver === null) {
//       throw new Error(`Task resolver '${params.resolver}' for inner flowed::ArrayMap task has no definition.`);
//     }

//     const innerTask = new Task('task-loop-model', params.spec);

//     const resultPromises = [];
//     let results = [];
//     for (const taskParams of params.params) {
//       innerTask.resetRunStatus();
//       innerTask.supplyReqs(taskParams);

//       // @todo add test with loop task with context

//       const process = new TaskProcess(
//         context.$flowed.processManager,
//         0,
//         innerTask,
//         resolver,
//         context,
//         !!params.automapParams,
//         !!params.automapResults,
//         params.flowId,
//         debug,
//         log,
//       );

//       const result = process.run();

//       if (params.parallel) {
//         resultPromises.push(result);
//       } else {
//         results.push(await result); // If rejected, exception is not thrown here, it is delegated
//       }
//     }

//     if (params.parallel) {
//       results = await Promise.all(resultPromises); // If rejected, exception is not thrown here, it is delegated
//     }

//     return { results };
//   }
// }

// // @todo document Loop resolver
// export class LoopResolver {
//   public async exec(params: ValueMap, context: ValueMap, task: Task, debug: Debugger, log: LoggerFn): Promise<ValueMap> {
//     const resolverName = params.subtask.resolver.name;
//     const resolver = context.$flowed.getResolverByName(resolverName);
//     if (resolver === null) {
//       throw new Error(`Task resolver '${resolverName}' for inner flowed::Loop task has no definition.`);
//     }

//     const innerTask = new Task('task-loop-model', params.subtask);

//     const resultPromises = [];
//     let outCollection = [];
//     for (const item of params.inCollection) {
//       const taskParams = { [params.inItemName]: item };

//       innerTask.resetRunStatus();
//       innerTask.supplyReqs(taskParams);

//       // @todo add test with loop task with context

//       const process = new TaskProcess(
//         context.$flowed.processManager,
//         0,
//         innerTask,
//         resolver,
//         context,
//         !!params.automapParams,
//         !!params.automapResults,
//         params.flowId,
//         debug,
//         log,
//       );

//       const itemResultPromise = process.run();

//       if (params.parallel) {
//         resultPromises.push(itemResultPromise);
//       } else {
//         const itemResult = await itemResultPromise;
//         outCollection.push(itemResult[params.outItemName]); // If rejected, exception is not thrown here, it is delegated
//       }
//     }

//     if (params.parallel) {
//       const outCollectionResults = await Promise.all(resultPromises); // If rejected, exception is not thrown here, it is delegated
//       outCollection = outCollectionResults.map(itemResult => itemResult[params.outItemName]);
//     }

//     return { outCollection };
//   }
// }

// export class StopResolver {
//   public exec(params: ValueMap, context: ValueMap): ValueMap {
//     return { promise: context.$flowed.flow.stop() };
//   }
// }

// export class PauseResolver {
//   public exec(params: ValueMap, context: ValueMap): ValueMap {
//     return { promise: context.$flowed.flow.pause() };
//   }
// }