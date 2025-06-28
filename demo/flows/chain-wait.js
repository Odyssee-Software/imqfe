/**
 * Exemple : Chaînage avec attente (Wait)
 * --------------------------------------
 * Enchaîne trois tâches : obtention de la date, attente de 1000ms, puis calcul d’un delta basé sur la date et l’attente.
 * Objectif : Illustrer le chaînage de tâches et l'utilisation d'une tâche asynchrone.
 */
const { FlowProducer } = require('../../dist');

(async () => {
  const flow = new FlowProducer({
    tasks: {
      getDate: {
        provides: ['date'],
        resolver: {
          name: 'imqfe::Echo',
          params: { in: { value: new Date() } },
          results: { out: 'date' }
        }
      },
      wait1000ms: {
        requires: ['date'],
        provides: ['wait1000ms'],
        resolver: {
          name: 'imqfe::Wait',
          params: { ms: 1000, result: { value: 1000 } },
          results: { result: 'wait1000ms' }
        }
      },
      delta: {
        requires: ['date', 'wait1000ms'],
        provides: ['delta'],
        resolver: {
          name: 'imqfe::Echo',
          params: {
            transform: {
              in: {
                delta: '{{new Date(this.requires.date.value.getTime() + this.requires.wait1000ms.value)}}',
                date: '{{this.requires.date.value}}',
                wait: '{{this.requires.wait1000ms.value}}'
              }
            }
          },
          results: { out: 'delta' }
        }
      }
    }
  });

  const result = await flow.run({}, ['delta'], {});
  console.log('Date après attente :', result.delta);
})();