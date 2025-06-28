/**
 * Exemple : Tâche Echo déclarée dans le flow
 * ------------------------------------------
 * Déclare la tâche 'echo' directement dans la définition du flow, puis exécute le flow pour obtenir le résultat.
 * Objectif : Illustrer la déclaration statique d'un flow.
 */
const { FlowProducer } = require('../../dist');

(async () => {
  const flow = new FlowProducer({
    tasks: {
      echo: {
        provides: ['output'],
        requires: [],
        resolver: {
          name: 'imqfe::Echo',
          params: { in: 'Bonjour depuis un flow statique !' },
          results: { out: 'output' }
        }
      }
    }
  });

  const result = await flow.run({}, ['output'], {});
  console.log('Résultat attendu :', result.output); // "Bonjour depuis un flow statique !"
})();