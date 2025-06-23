const { FlowProducer } = require('../dist');

// Exemple d'ajout programatique d'une tâche
// (async () => {

//   let flow = new FlowProducer();

//   flow.add('echoTask', {
//     provides: ['output'],
//     requires: [],
//     resolver: {
//       name: 'flowher::Echo',
//       params: { in: 'test' },
//       results: { out: 'output' }
//     }
//   });

//   const result = await flow.run(
//     {}, // params  
//     ['output'], // expectedOutputs
//     {} // context
//   );

//   console.log({ echo_result : result.output })

// })();

// (async () => {

//   let flow = new FlowProducer({
//     tasks : {
//       echo : {
//         provides: ['output'],
//         requires: [],
//         resolver: {
//           name: 'flowher::Echo',
//           params: { in: 'test' },
//           results: { out: 'output' }
//         }
//       }
//     }
//   });

//   const result = await flow.run(
//     {}, // params  
//     ['output'], // expectedOutputs
//     {} // context
//   );

//   console.log({ throw_error_result : result.output })

// })();

(async () => {

  let flow = new FlowProducer({
    tasks : {
      getDate : {
        provides: ['date'],
        resolver: {
          name: 'flowher::Echo',
          params: { in: { value: new Date() } },
          results: { out: 'result' }
        }
      },
      wait1000ms : {
        requires: ['date'],
        provides: ['wait1000ms'],
        resolver : {
          name: 'flowher::Wait',
          params : {
            ms : 1000,
            result : null,
          }
        }
      },
      delta : {
        requires: ['date', 'wait1000ms'],
        provides: ['output'],
        resolver : {
          name: 'flowher::Echo',
          params: {
            transform: {
              in: {
                delta: '{{this.wait1000ms.value - this.date.value}}',
                date: '{{this.date.value}}',
                wait: '{{this.wait1000ms.value}}'
              }
            }
          },
          results: { out: 'output' }
        }
      }
    }
  });

  const result = await flow.run(
    {}, // params  
    ['date', 'wait1000ms' , 'output'], // expectedOutputs
    {} // context
  );

  console.log({ wait_result : result.output })

})();

// (async () => {

//   let flow = new FlowProducer();

//   flow.add('echoTask', {
//     provides: ['output'],
//     requires: [],
//     resolver: {
//       name: 'flowher::Echo',
//       params: { in: 'test' },
//       results: { out: 'output' }
//     }
//   });

//   const result = await flow.run(
//     {}, // params  
//     ['output'], // expectedOutputs
//     {} // context
//   );

//   console.log({ conditional_result : result.output })

// })();

// (async () => {

//   let flow = new FlowProducer({
//     tasks: {
//       'step-a': {
//         provides: ['A'],
//         resolver: {
//           name: 'flowher::Echo',
//           params : { in : { value : 'a' } },
//           results: { out : 'A' }
//         },
//       },
//       'step-b': {
//         provides: ['B'],
//         resolver: {
//           name: 'flowher::Echo',
//           params : { in : { value : 'b' } },
//           results: { out : 'B' }
//         },
//       },
//       'step-c': {
//         requires: ['A', 'B'],
//         provides: ['C'],
//         resolver: {
//           name: 'flowher::Echo',
//           params : {
//             transform : {
//               in : {
//                 'step-1' : '{{this.A}}',
//                 'step-2' : '{{this.B}}',
//               }
//             }
//           },
//           results: { out : 'C' }
//         },
//       },
//     }
//   });

//   let result = await flow.run( { } , [ 'C' ] , { } , { } )
//   console.log({ parallel_result : result.C });

// })();

// (async () => {

//   let flow = new FlowProducer({
//     tasks: {
//       getFullDate: {
//         provides: ['full-date'],
//         resolver: { 
//           name: 'flowher::SubFlow',
//           params: {
//             flowSpec : {
//               tasks : {
//                 getDate: {
//                   provides: ['date'],
//                   resolver: {
//                     name: 'flowher::Echo',
//                     params : { in : { value : new Date() } },
//                     results: { out: 'date' }
//                   }
//                 },
//                 formatDate : {
//                   requires: ['date'],
//                   provides: ['formatted-date'],
//                   resolver: {
//                     name: 'flowher::Echo',
//                     params : {
//                       transform : {
//                         in : {
//                           year : '{{this.date.value.getDate()}}',
//                           month : '{{this.date.value.getMonth() + 1}}',
//                           day : '{{this.date.value.getFullYear()}}',
//                         },
//                       }
//                     },
//                     results: { out: 'formatted-date' }
//                   }
//                 }
//               }
//             },
//             flowExpectedResults : [ 'formatted-date'],
//           }
//         },
//       }
//     }
//   });

//   let result = await flow.run( { } , [ 'full-date' ] , { } , { } )
//   console.log({ subflow_result : result['formatted-date'] });

// })();

// (() => {

// })();