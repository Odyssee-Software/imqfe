import { ValueMap } from '@types';

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
  'flowher::Echo': (params: ValueMap) => ValueMap;

  /**
   * Does nothing and returns an empty object.
   * @returns {ValueMap} Empty object
   */
  'flowher::Noop': () => ValueMap;

  /**
   * Throws an error with a specified message.
   * @param {ValueMap} params - Parameters object containing optional 'message' string
   * @throws {Error} Always throws with either specified message or default message
   */
  'flowher::ThrowError': (params: ValueMap) => ValueMap;

  /**
   * Provides one of two possible results depending on a given condition.
   * @param {ValueMap} params - Parameters containing 'condition', 'trueResult', and 'falseResult'
   * @returns {ValueMap} Object with either 'onTrue' or 'onFalse' property based on condition
   */
  'flowher::Conditional': (params: ValueMap) => ValueMap;

  /**
   * Waits for specified milliseconds and returns the specified result.
   * @param {ValueMap} params - Parameters containing 'ms' for delay and 'result' for return value
   * @returns {Promise<ValueMap>} Promise resolving to object with 'result' property after delay
   */
  'flowher::Wait': (params: ValueMap) => Promise<ValueMap>;

  /**
   * Executes a sub-flow within the current flow.
   */
  'flowher::SubFlow': () => void;

  /**
   * Repeats execution of a flow segment.
   */
  'flowher::Repeater': () => void;

  /**
   * Maps over an array applying a flow to each element.
   */
  'flowher::ArrayMap': () => void;

  /**
   * Stops the current flow execution.
   */
  'flowher::Stop': () => void;

  /**
   * Pauses the current flow execution.
   */
  'flowher::Pause': () => void;
}

const ResolversRegistry:ResolversRegistry = {
  // Returns the input value or its transformation as the result.
  'flowher::Echo' : function(params: ValueMap): ValueMap {
    return { out: params.in };
  },
  // Does nothing.
  'flowher::Noop' : function(): ValueMap {
    return {};
  },
  // Throws an error with a specified message.
  'flowher::ThrowError' : function(params: ValueMap): ValueMap {
    throw new Error(typeof params.message !== 'undefined' ? params.message : 'ThrowErrorResolver resolver has thrown an error');
  },
  // Provides one of two possible results depending of a given condition.
  'flowher::Conditional' : function(params: ValueMap): ValueMap {
    return params.condition ? { onTrue: params.trueResult } : { onFalse: params.falseResult };
  },
  // Waits for ms milliseconds and finish returning the specified result.
  'flowher::Wait' : function(params: ValueMap): Promise<ValueMap> {
    return new Promise<ValueMap>(resolve => {
      setTimeout(() => {
        resolve({ result: params.result });
      }, params.ms);
    });
  },
  'flowher::SubFlow' : function(){},
  'flowher::Repeater' : function(){},
  'flowher::ArrayMap' : function(){},
  'flowher::Stop' : function(){},
  'flowher::Pause' : function(){},
}

export { ResolversRegistry };

// // Do nothing and finish
// export class NoopResolver {
//   public exec(): ValueMap {
//     return {};
//   }
// }

// export class EchoResolver {
//   public exec(params: ValueMap): ValueMap {
//     return { out: params.in };
//   }
// }

// export class ThrowErrorResolver {
//   public exec(params: ValueMap): ValueMap {
//     throw new Error(typeof params.message !== 'undefined' ? params.message : 'ThrowErrorResolver resolver has thrown an error');
//   }
// }

// export class ConditionalResolver {
//   public exec(params: ValueMap): ValueMap {
//     return params.condition ? { onTrue: params.trueResult } : { onFalse: params.falseResult };
//   }
// }

// Wait for 'ms' milliseconds and finish
// export class WaitResolver {
//   public exec(params: ValueMap): ValueMap {
//     return new Promise<ValueMap>(resolve => {
//       setTimeout(() => {
//         resolve({ result: params.result });
//       }, params.ms);
//     });
//   }
// }

// // Run a flow and finish
// export class SubFlowResolver {
//   public async exec(params: ValueMap, context: ValueMap): Promise<ValueMap> {
//     // @todo add test with subflow task with flowContext
//     // @todo document $flowed

//     // If no resolvers specified as parameter, inherit from global scope
//     let flowResolvers = params.flowResolvers;
//     if (typeof flowResolvers === 'undefined') {
//       flowResolvers = context.$flowed.getResolvers();
//     }

//     let flowResult = await FlowManager.run(
//       params.flowSpec,
//       params.flowParams,
//       params.flowExpectedResults,
//       flowResolvers,
//       context,
//       context.$flowed.flow.runStatus.runOptions,
//     );

//     // @todo document param uniqueResult
//     if (typeof params.uniqueResult === 'string') {
//       flowResult = flowResult[params.uniqueResult];
//     }

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