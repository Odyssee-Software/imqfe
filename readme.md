# @odyssee-software/imqfe

**Flow Engine & In-Memory Queue**  
Un moteur de workflows JSON et une file d’attente en mémoire pour orchestrer des tâches synchrones et asynchrones avec gestion des dépendances.

---

## Fonctionnalités principales

- Exécution parallèle et séquentielle de tâches
- Gestion des dépendances entre tâches (inputs/outputs)
- Flows JSON paramétrables et réutilisables
- Résolveurs intégrés (Echo, Noop, ThrowError, Conditional, Wait, etc.)
- Ajout de tâches dynamiquement
- Système de plugins et d’actions personnalisées
- File d’attente en mémoire (MQ) pour la gestion des jobs, résultats, événements et callbacks
- API simple pour l’intégration et les tests

---

## Installation

```sh
npm install @odyssee-software/imqfe
```

---

## Utilisation rapide

### 1. Création d’un flow simple

```ts
import { FlowProducer } from '@odyssee-software/imqfe';

const flow = new FlowProducer();

flow.add('echoTask', {
  provides: ['output1'],
  requires: [],
  resolver: {
    name: 'flowher::Echo',
    params: { in: 'Hello World!' },
    results: { out: 'output1' }
  }
});

const result = await flow.run(
  {},                // paramètres d’entrée
  ['output1'],       // outputs attendus
  {},                // actions personnalisées (optionnel)
  {}                 // contexte (optionnel)
);

console.log(result); // [{ output1: 'Hello World!' }]
```

### 2. Utilisation des résolveurs intégrés

- `flowher::Echo` : Retourne la valeur passée en entrée
- `flowher::Noop` : Ne fait rien, retourne un objet vide
- `flowher::ThrowError` : Lève une erreur personnalisée
- `flowher::Conditional` : Retourne un résultat selon une condition
- `flowher::Wait` : Attend un délai avant de retourner un résultat

Voir [`src/resolver-registry.ts`](src/resolver-registry.ts) pour la liste complète.

---

## File d’attente en mémoire (MQ)

Le module MQ permet de gérer des files de jobs, leur exécution, le suivi d’état, les événements et les résultats, le tout en mémoire.

### Exemple minimal

```ts
import { MQ, WorkerController } from '@odyssee-software/imqfe';

const queue = new MQ({ name: 'ma-queue' });

const workerFactory = WorkerController(async ({ value }) => {
  // Traitement asynchrone ici
  return value * 2;
}, { value: 21 });

queue.enqueue(workerFactory);

queue.start(() => {
  // Callback à la fin de la queue
  console.log('Tous les jobs sont terminés');
});
```

### Suivi des jobs et gestion des événements

```ts
const [worker] = queue.enqueue(workerFactory);

worker.on('success', (job) => {
  console.log('Job terminé avec succès:', job.data);
});

worker.on('error', (job) => {
  console.error('Erreur dans le job:', job.error);
});

worker.follow((step, error, result) => {
  console.log('Étape:', step, 'Résultat:', result, 'Erreur:', error);
});
```

Pour plus de détails, voir [`src/qm.ts`](src/qm.ts).

---

## API Principale

### FlowProducer ([`src/qm-flow.ts`](src/qm-flow.ts))

- `constructor(specs?)` : Initialise un flow avec des tâches optionnelles
- `add(taskName, taskSpec)` : Ajoute une tâche au flow
- `run(params, expectedOutputs, actions?, context?)` : Exécute le flow et retourne les résultats attendus

### MQ ([`src/qm.ts`](src/qm.ts))

- `enqueue(...workers)` : Ajoute un ou plusieurs jobs à la file
- `dequeue(jobId)` : Retire un job de la file par son identifiant
- `job(jobId)` : Récupère un job par son identifiant
- `start(callback?)` : Démarre l’exécution de la file
- Gestion des événements : `on('success'|'error'|'start'|'end', callback)`
- Suivi d’un job : `worker.follow(callback)`

### WorkerController ([`src/qm.ts`](src/qm.ts))

- Permet de créer des workers personnalisés avec gestion des propriétés, du suivi, des événements et des dépendances.

---

## Tests

Lance tous les tests unitaires :

```sh
npm test
```

Un rapport Markdown est généré dans [`test-reports/test-report.md`](test-reports/test-report.md).

---

## Documentation

- [guide/flow.md](guide/flow.md) : Introduction aux flows
- [guide/mq.md](guide/mq.md) : Introduction à la file d’attente

---

## Licence

Distribué sous licence GNU GPL v3. Voir le fichier [LICENSE](LICENSE).

---

## Auteur