const { FlowProducer } = require('../dist');

// Exemple 1 : Tâche Echo ajoutée dynamiquement
// Ajoute une tâche à la volée dans un flow, qui retourne simplement la valeur passée en entrée ('test').
(async () => {

  let flow = new FlowProducer();

  flow.add('echoTask', {
    provides: ['output'],
    requires: [],
    resolver: {
      name: 'flowher::Echo',
      params: { in: 'test' },
      results: { out: 'output' }
    }
  });

  const result = await flow.run(
    {}, // params  
    ['output'], // expectedOutputs
    {} // context
  );

  console.log({ echo_result : result.output })

})();

// Exemple 2 : Tâche Echo déclarée dans le flow
// Déclare la tâche 'echo' directement dans la définition du flow, puis exécute le flow pour obtenir le résultat.
(async () => {

  let flow = new FlowProducer({
    tasks : {
      echo : {
        provides: ['output'],
        requires: [],
        resolver: {
          name: 'flowher::Echo',
          params: { in: 'test' },
          results: { out: 'output' }
        }
      }
    }
  });

  const result = await flow.run(
    {}, // params  
    ['output'], // expectedOutputs
    {} // context
  );

  console.log({ throw_error_result : result.output })

})();

// Exemple 3 : Chaînage avec attente (Wait)
// Enchaîne trois tâches : obtention de la date, attente de 1000ms, puis calcul d’un delta basé sur la date et l’attente.
(async () => {

  let flow = new FlowProducer({
    tasks : {
      getDate : {
        provides: ['date'],
        resolver: {
          name: 'flowher::Echo',
          params: { in: { value: new Date() } },
          results: { out: 'date' }
        }
      },
      wait1000ms : {
        requires: ['date'],
        provides: ['wait1000ms'],
        resolver : {
          name: 'flowher::Wait',
          params : {
            ms : 1000,
            result : { value : 1000 }
          },
          results: { result: 'wait1000ms' }
        }
      },
      delta : {
        requires: ['date', 'wait1000ms'],
        provides: ['delta'],
        resolver : {
          name: 'flowher::Echo',
          params: {
            transform: {
              in: {
                delta: '{{new Date(this.date.value.getTime() + this.wait1000ms.value)}}',
                date: '{{this.date.value}}',
                wait: '{{this.wait1000ms.value}}'
              }
            }
          },
          results: { out: 'delta' }
        }
      }
    }
  });

  const result = await flow.run(
    {}, // params  
    ['delta'], // expectedOutputs
    {} // context
  );

  console.log({ wait_result : result.delta })

})();

// Exemple 4 : Tâche Echo conditionnelle
// Ajoute et exécute une tâche 'echoTask' pour illustrer l’utilisation d’une tâche simple, pouvant servir de base à des conditions.
(async () => {

  let flow = new FlowProducer();

  flow.add('echoTask', {
    provides: ['output'],
    requires: [],
    resolver: {
      name: 'flowher::Echo',
      params: { in: 'test' },
      results: { out: 'output' }
    }
  });

  const result = await flow.run(
    {}, // params  
    ['output'], // expectedOutputs
    {} // context
  );

  console.log({ conditional_result : result.output })

})();

// Exemple 5 : Exécution parallèle et agrégation de résultats
// Exécute deux tâches en parallèle ('step-a' et 'step-b'), puis une troisième ('step-c') qui dépend des résultats des deux premières.
(async () => {

  let flow = new FlowProducer({
    tasks: {
      'step-a': {
        provides: ['A'],
        resolver: {
          name: 'flowher::Echo',
          params : { in : { value : 'a' } },
          results: { out : 'A' }
        },
      },
      'step-b': {
        provides: ['B'],
        resolver: {
          name: 'flowher::Echo',
          params : { in : { value : 'b' } },
          results: { out : 'B' }
        },
      },
      'step-c': {
        requires: ['A', 'B'],
        provides: ['C'],
        resolver: {
          name: 'flowher::Echo',
          params : {
            transform : {
              in : {
                'step-1' : '{{this.A}}',
                'step-2' : '{{this.B}}',
              }
            }
          },
          results: { out : 'C' }
        },
      },
    }
  });

  let result = await flow.run( { } , [ 'C' ] , { } , { } )
  console.log({ parallel_result : result.C });

})();

// Exemple 6 : Sous-flow (SubFlow) imbriqué
// Définit une tâche qui exécute un sous-flow interne pour obtenir et formater une date, illustrant la composition de flows.
(async () => {

  let flow = new FlowProducer({
    tasks: {
      getFullDate: {
        provides: ['full-date'],
        resolver: { 
          name: 'flowher::SubFlow',
          params: {
            flowSpec : {
              tasks : {
                getDate: {
                  provides: ['date'],
                  resolver: {
                    name: 'flowher::Echo',
                    params : { in : { value : new Date() } },
                    results: { out: 'date' }
                  }
                },
                formatDate : {
                  requires: ['date'],
                  provides: ['formatted-date'],
                  resolver: {
                    name: 'flowher::Echo',
                    params : {
                      transform : {
                        in : {
                          year : '{{this.date.value.getDate()}}',
                          month : '{{this.date.value.getMonth() + 1}}',
                          day : '{{this.date.value.getFullYear()}}',
                        },
                      }
                    },
                    results: { out: 'formatted-date' }
                  }
                }
              }
            },
            flowExpectedResults : [ 'formatted-date'],
          }
        },
      }
    }
  });

  let result = await flow.run( { } , [ 'full-date' ] , { } , { } )
  console.log({ subflow_result : result['formatted-date'] });

})();

// (() => {
// })();