/**
 * Exemple : Tâche Echo conditionnelle
 * -----------------------------------
 * Ajoute et exécute une tâche 'echoTask' pour illustrer l’utilisation d’une tâche simple, pouvant servir de base à des conditions.
 * Objectif : Montrer la simplicité d'une tâche Echo, base pour des flows conditionnels.
 */
const { FlowProducer } = require('../../dist');

(async () => {
  const flow = new FlowProducer();

  flow.add('echoTask', {
    provides: ['output'],
    requires: [],
    resolver: {
      name: 'imqfe::Echo',
      params: { in: 'Condition test' },
      results: { out: 'output' }
    }
  });

  const result = await flow.run({}, ['output'], {});
  console.log('Résultat attendu :', result.output); // "Condition test"
})();