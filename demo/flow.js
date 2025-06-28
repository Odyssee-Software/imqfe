const { transform } = require('zod/v4');
const { FlowProducer } = require('../dist');

// // Exemple 1 : Tâche Echo ajoutée dynamiquement
// // // Ajoute une tâche à la volée dans un flow, qui retourne simplement la valeur passée en entrée ('test').
// (async () => {

//   let flow = new FlowProducer();

//   flow.add('echoTask', {
//     provides: ['output'],
//     requires: [],
//     resolver: {
//       name: 'imqfe::Echo',
//       params: { in: 'test' },
//       results: { out: 'output' }
//     }
//   });

//   const result = await flow.run(
//     {}, // params  
//     ['output'], // expectedOutputs
//     {} // context
//   );

//   console.log({ queue : flow.queue , echo_result : result })

// })();

// (async () => {

//   let flow = new FlowProducer();

//   flow.add('echoTask', {
//     provides: ['output'],
//     requires: [],
//     resolver: {
//       name: 'imqfe::Echo',
//       params: {
//         transform : {
//           in : `{{$flow.properties.in}}`
//         }
//       },
//       results: { out: 'output' }
//     }
//   });

//   const result = await flow.run(
//     { in : { value : 'test' } }, // params  
//     ['output'], // expectedOutputs
//     {} // context
//   );

//   console.log({ queue : flow.queue , echo_result : result })

// })();

// // Exemple 2 : Tâche Echo déclarée dans le flow
// // Déclare la tâche 'echo' directement dans la définition du flow, puis exécute le flow pour obtenir le résultat.
// (async () => {

//   let flow = new FlowProducer({
//     tasks : {
//       echo : {
//         provides: ['output'],
//         requires: [],
//         resolver: {
//           name: 'imqfe::Echo',
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

// // Exemple 3 : Chaînage avec attente (Wait)
// // Enchaîne trois tâches : obtention de la date, attente de 1000ms, puis calcul d’un delta basé sur la date et l’attente.
// (async () => {

//   let flow = new FlowProducer({
//     tasks : {
//       getDate : {
//         provides: ['date'],
//         resolver: {
//           name: 'imqfe::Echo',
//           params: { in: { value: new Date() } },
//           results: { out: 'date' }
//         }
//       },
//       wait1000ms : {
//         requires: ['date'],
//         provides: ['wait1000ms'],
//         resolver : {
//           name: 'imqfe::Wait',
//           params : {
//             ms : 1000,
//             result : { value : 1000 }
//           },
//           results: { result: 'wait1000ms' }
//         }
//       },
//       delta : {
//         requires: ['date', 'wait1000ms'],
//         provides: ['delta'],
//         resolver : {
//           name: 'imqfe::Echo',
//           params: {
//             transform: {
//               in: {
//                 delta: '{{new Date(this.date.value.getTime() + this.wait1000ms.value)}}',
//                 date: '{{this.date.value}}',
//                 wait: '{{this.wait1000ms.value}}'
//               }
//             }
//           },
//           results: { out: 'delta' }
//         }
//       }
//     }
//   });

//   const result = await flow.run(
//     {}, // params  
//     ['delta'], // expectedOutputs
//     {} // context
//   );

//   console.log({ wait_result : result.delta })

// })();

// // Exemple 4 : Tâche Echo conditionnelle
// // Ajoute et exécute une tâche 'echoTask' pour illustrer l’utilisation d’une tâche simple, pouvant servir de base à des conditions.
// (async () => {

//   let flow = new FlowProducer();

//   flow.add('echoTask', {
//     provides: ['output'],
//     requires: [],
//     resolver: {
//       name: 'imqfe::Echo',
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

// // Exemple 5 : Exécution parallèle et agrégation de résultats
// // Exécute deux tâches en parallèle ('step-a' et 'step-b'), puis une troisième ('step-c') qui dépend des résultats des deux premières.
// (async () => {

//   let flow = new FlowProducer({
//     tasks: {
//       'step-a': {
//         provides: ['A'],
//         resolver: {
//           name: 'imqfe::Echo',
//           params : { in : { value : 'a' } },
//           results: { out : 'A' }
//         },
//       },
//       'step-b': {
//         provides: ['B'],
//         resolver: {
//           name: 'imqfe::Echo',
//           params : { in : { value : 'b' } },
//           results: { out : 'B' }
//         },
//       },
//       'step-c': {
//         requires: ['A', 'B'],
//         provides: ['C'],
//         resolver: {
//           name: 'imqfe::Echo',
//           params : {
//             transform : {
//               in : {
//                 'step-1' : '{{this.requires.A}}',
//                 'step-2' : '{{this.requires.B}}',
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

// // // Exemple 6 : Sous-flow (SubFlow) imbriqué
// // // Définit une tâche qui exécute un sous-flow interne pour obtenir et formater une date, illustrant la composition de flows.
// (async () => {

//   let flow = new FlowProducer({
//     tasks: {
//       getFullDate: {
//         provides: ['full-date'],
//         resolver: { 
//           name: 'imqfe::SubFlow',
//           params: {
//             flowSpec : {
//               tasks : {
//                 getDate: {
//                   provides: ['date'],
//                   resolver: {
//                     name: 'imqfe::Echo',
//                     params : { in : { value : new Date() } },
//                     results: { out: 'date' }
//                   }
//                 },
//                 formatDate : {
//                   requires: ['date'],
//                   provides: ['formatted-date'],
//                   resolver: {
//                     name: 'imqfe::Echo',
//                     params : {
//                       transform : {
//                         in : {
//                           year : '{{this.requires.date.value.getDate()}}',
//                           month : '{{this.requires.date.value.getMonth() + 1}}',
//                           day : '{{this.requires.date.value.getFullYear()}}',
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

// (async () => {

//   let flow = new FlowProducer({
//     tasks: {
//       wait100ms: {
//         provides: ['stop'],
//         requires: [],
//         resolver: {
//           name: "imqfe::Stop",
//         }
//       },
//       pauseTask: {
//         provides: [ 'echo' ],
//         requires: ['stop'],
//         resolver: {
//           name: "imqfe::Echo",
//           params: {
//             in : { value : 'test' }
//           }
//         }
//       }
//     }
//   });
  
//   let result = await flow.run( {} , ['echo'] , {} , {} );
//   // will be empty because the flow is stopped before the echoTask can run
//   console.log({ result });

//   flow.queue.results.flat(1).forEach(( result ) => {
//     // here we can see the results of the flow execution
//     console.log({result})
//   })

// })();

// (async () => {

//   let flow = new FlowProducer({
//     tasks: {
//       repeat: {
//         provides: ['repeat-echo'],
//         resolver: {
//           name: "imqfe::Repeater",
//           params: {
//             count: 330,
//             resolver : 'imqfe::Echo',
//             parallel : false,
//             taskParams: {
//               in : { value : 'echo' },
//               transform : {
//                 in : { value : '{{this.in.value}} {{count}}' }
//               }
//             },
//           }
//         }
//       }
//     }
//   });
  
//   let result = await flow.run( {} , ['repeat-echo'] , {} , {} );
//   // will be empty because the flow is stopped before the echoTask can run
//   console.log({ result : result.results });

//   result.results.forEach(( result ) => {
//     // here we can see the results of the flow execution
//     console.log({result})
//   })

// })();

(async () => {

  let flow = new FlowProducer({
    tasks: {
      loop: {
        requires: ['data'],
        provides: ['results'],
        resolver: {
          name: 'imqfe::Loop',
          params: {
            inCollection: Array.from({ length : 10 } , (_ , i) => i ),
            inItemName: "in",
            outItemName: "result",
            subtask: {
              multiply: {
                provides: ["result"],
                resolver: {
                  name: "imqfe::Echo",
                  params: {
                    transform: {
                      in: {
                        value: '{{$flow.properties.in}}',
                      }
                    }
                  },
                  results: { out: "echo" },
                },
              },
            },
            parallel: true,
          },
        },
        results: { out: 'echo' }
      }
    }
  });

  let result = await flow.run( {} , ['results'] , {} , {} );

  result.outCollection.forEach(( result ) => {
    console.log(result);
  });
  
})()