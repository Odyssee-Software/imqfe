/**
 * Exemple : Exécution parallèle et agrégation de résultats
 * --------------------------------------------------------
 * Exécute deux tâches en parallèle ('step-a' et 'step-b'), puis une troisième ('step-c') qui dépend des résultats des deux premières.
 * Objectif : Illustrer le parallélisme et l'agrégation de résultats dans un flow.
 */
const { FlowProducer } = require('../../dist');

(async () => {
  const flow = new FlowProducer({
    tasks: {
      'step-a': {
        provides: ['A'],
        resolver: {
          name: 'imqfe::Echo',
          params: { in: { value: 'a' } },
          results: { out: 'A' }
        }
      },
      'step-b': {
        provides: ['B'],
        resolver: {
          name: 'imqfe::Echo',
          params: { in: { value: 'b' } },
          results: { out: 'B' }
        }
      },
      'step-c': {
        requires: ['A', 'B'],
        provides: ['C'],
        resolver: {
          name: 'imqfe::Echo',
          params: {
            transform: {
              in: {
                'step-1': '{{this.requires.A}}',
                'step-2': '{{this.requires.B}}'
              }
            }
          },
          results: { out: 'C' }
        }
      }
    }
  });

  const result = await flow.run({}, ['C'], {});
  console.log('Résultat agrégé :', result.C);
})();