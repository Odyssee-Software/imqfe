# MQ – File d’attente en mémoire

Le module **MQ** fournit une file d’attente (queue) en mémoire pour orchestrer l’exécution de tâches asynchrones ou synchrones, suivre leur état, gérer les événements et récupérer les résultats. Il est conçu pour être simple à utiliser, extensible et adapté à l’orchestration de jobs complexes.

---

## Concepts clés

- **Job** : Un travail à exécuter, représenté par une fonction contrôlée (WorkerController).
- **Worker** : Instance d’un job, avec suivi d’état (`waiting`, `success`, `error`), résultats, erreurs, etc.
- **Queue** : La file d’attente qui gère l’ordre d’exécution, les événements et le suivi des jobs.
- **Événements** : Possibilité d’écouter le début, la réussite, l’échec ou la fin d’un job ou de la queue.

---

## Création d’une queue et ajout de jobs

```ts
import { MQ, WorkerController } from '@odyssee-software/imqfe';

// Création d’une queue nommée
const queue = new MQ({ name: 'ma-queue' });

// Définition d’un worker (job)
const workerFactory = WorkerController(async ({ value }) => {
  // Traitement asynchrone ici
  return value * 2;
}, { value: 21 });

// Ajout du job à la queue
queue.enqueue(workerFactory);
```

---

## Démarrage et suivi de la queue

```typescript
queue.start(() => {
  console.log('Tous les jobs sont terminés');
});
```

---

## Suivi des jobs et gestion des événements

Chaque worker/job peut être suivi individuellement :

```typescript
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

Vous pouvez aussi écouter les événements globaux de la queue :

```typescript
queue.on('success', (job) => {
  console.log('Succès global:', job.id);
});
queue.on('error', (job) => {
  console.error('Erreur globale:', job.id);
});
queue.on('end', () => {
  console.log('Queue terminée');
});
```

---

## API Principale

MQ

- `enqueue(...workers)` : Ajoute un ou plusieurs jobs à la file.
- `dequeue(jobId)` : Retire un job de la file par son identifiant.
- `job(jobId)` : Récupère un job (en cours ou terminé) par son identifiant.
- `start(callback?)` : Démarre l’exécution de la file.
- `on(event, callback)` : Écoute les événements globaux (`start`, `success`, `error`, `end`).

WorkerController
Permet de créer des jobs personnalisés avec gestion des propriétés, du suivi, des événements et des dépendances.

---

## Gestion des dépendances entre jobs

Un worker peut dépendre des résultats d’autres jobs (par exemple, pour chaîner des traitements). Utilisez les propriétés `requires` et `provides` pour déclarer les dépendances, et le système MQ s’occupe de la résolution.

---

## Exemples avancés

Chaînage de jobs

```typescript
const workerA = WorkerController(async () => 42, {});
const workerB = WorkerController(async ({ 0: resultA }) => resultA + 1, {});
queue.enqueue(workerA, workerB);
```

---

## Bonnes pratiques

- Utilisez `follow` pour suivre l’évolution d’un job.
- Utilisez `on` pour réagir aux événements de la queue ou d’un job.
- Nettoyez les callbacks avec la méthode `dispose` si besoin.

---

## Pour aller plus loin

- Voir le code source : [src/qm.ts](../src/mq.ts)
- Consultez la documentation sur les flows pour l’intégration avec le moteur de workflows.

---

## Licence

Distribué sous licence GNU GPL v3.
