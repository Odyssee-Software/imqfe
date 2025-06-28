/**
 * Exemple : Tâche Echo ajoutée dynamiquement
 * -------------------------------------------
 * Ajoute une tâche à la volée dans un flow, qui retourne simplement la valeur passée en entrée ('Hello World!').
 * Objectif : Montrer comment créer et exécuter un flow minimal dynamiquement.
 */
const { FlowProducer } = require('../../dist');

(async () => {
  const flow = new FlowProducer();

  flow.add('echoTask', {
    provides: ['output'],
    requires: [],
    resolver: {
      name: 'imqfe::Echo',
      params: { in: 'Hello World!' },
      results: { out: 'output' }
    }
  });

  const result = await flow.run({}, ['output'], {});
  console.log('Résultat attendu :', result.output); // "Hello World!"
})();