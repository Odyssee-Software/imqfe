/**
 * Exemple : Sous-flow (SubFlow) imbriqué
 * --------------------------------------
 * Définit une tâche qui exécute un sous-flow interne pour obtenir et formater une date, illustrant la composition de flows.
 * Objectif : Montrer la puissance de la composition de flows avec SubFlow.
 */
const { FlowProducer } = require('../../dist');

(async () => {
  const flow = new FlowProducer({
    tasks: {
      getFullDate: {
        provides: ['full-date'],
        resolver: {
          name: 'imqfe::SubFlow',
          params: {
            flowSpec: {
              tasks: {
                getDate: {
                  provides: ['date'],
                  resolver: {
                    name: 'imqfe::Echo',
                    params: { in: { value: new Date() } },
                    results: { out: 'date' }
                  }
                },
                formatDate: {
                  requires: ['date'],
                  provides: ['formatted-date'],
                  resolver: {
                    name: 'imqfe::Echo',
                    params: {
                      transform: {
                        in: {
                          year: '{{this.requires.date.value.getDate()}}',
                          month: '{{this.requires.date.value.getMonth() + 1}}',
                          day: '{{this.requires.date.value.getFullYear()}}'
                        }
                      }
                    },
                    results: { out: 'formatted-date' }
                  }
                }
              }
            },
            flowExpectedResults: ['formatted-date']
          }
        }
      }
    }
  });

  const result = await flow.run({}, ['full-date'], {});
  console.log('Date formatée par le subflow :', result['formatted-date']);
})();