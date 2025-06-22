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

## Lancement individuel d’un job

Chaque worker (job) ajouté à la queue peut être lancé individuellement grâce à la méthode `start()`. Cela permet de contrôler précisément quand un job est exécuté, indépendamment du traitement automatique de la file d’attente.

### Pourquoi utiliser `worker.start()` ?

- **Contrôle fin** : Exécuter un job à la demande, sans attendre le cycle global de la queue.
- **Rejouer un job** : Relancer un job déjà défini, par exemple pour rejouer une opération ou tester un scénario.
- **Audit et historique** : Utiliser la queue comme un historique d’exécutions, où chaque job peut être consulté ou relancé.

### Exemple

```typescript
const queue = new MQ({ name: 'historique' });
const workerFactory = WorkerController(async () => 'résultat', {});
const [worker] = queue.enqueue(workerFactory);

// Lancement manuel du job
await worker.start();

console.log(worker.status); // 'success'
console.log(worker.data);   // 'résultat'
```

Vous pouvez aussi passer un callback à `start()` pour gérer le résultat ou l’erreur :

```typescript
worker.start((error, result) => {
  if (error) {
    console.error('Erreur lors de l’exécution du job', error);
  } else {
    console.log('Résultat du job', result);
  }
});
```

### Historique des exécutions

Tous les jobs exécutés (manuellement ou via la queue) sont conservés dans `queue.results`. Vous pouvez ainsi :

- Parcourir l’historique des jobs exécutés
- Relancer un job spécifique
- Auditer les statuts, erreurs et résultats

```typescript
queue.results.forEach(job => {
  console.log(job.id, job.status, job.data);
});
```

> **Astuce :** Cette approche permet d’utiliser MQ comme un « journal » ou un « log » d’exécution, et pas seulement comme une simple file FIFO.

---

## Exemples avancés

### Chaînage de jobs

Le chaînage de jobs permet de faire dépendre l’exécution d’un worker des résultats d’un ou plusieurs jobs précédents. Cela permet de construire des pipelines de traitement, où chaque étape utilise les résultats des étapes précédentes.

### Gestion des dépendances entre jobs

Un worker peut dépendre des résultats d’autres jobs (par exemple, pour chaîner des traitements). Utilisez les propriétés `requires` et `provides` pour déclarer les dépendances, et le système MQ s’occupe de la résolution.

#### Exemple : chaînage simple

Dans cet exemple, le premier worker (`getDate`) fournit une date, et le second (`formatDate`) dépend de ce résultat pour formater la date :

```typescript
const queue = new MQ({ name: 'test-queue' });

const getDate = WorkerController(
  async () => new Date(),
  {},
  { provides: ['date'] }
);

const formatDate = WorkerController(
  async ({ '0': date }: { '0': Date }) => ({
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate()
  }),
  {},
  { requires: ['date'] }
);

const [worker1, worker2] = queue.enqueue(getDate, formatDate);

queue.start(() => {
  // worker1 a exécuté et fourni la date
  // worker2 a reçu la date et l’a formatée
  console.log({ result : worker2.data })
});
```

#### Dépendances explicites

- Le worker `getDate` déclare `provides: ['date']` : il expose la donnée `date` à la suite du pipeline.
- Le worker `formatDate` déclare `requires: ['date']` : il attend que la donnée `date` soit disponible avant de s’exécuter.

Le système MQ s’occupe de résoudre ces dépendances et d’exécuter les jobs dans le bon ordre.

---

### Pourquoi utiliser les flows ?

Pour des scénarios de chaînage plus complexes (branches, conditions, parallélisme, etc.), il est recommandé d’utiliser le moteur de flows fourni par le package. Les flows permettent de :

- Définir des graphes de dépendances complexes entre jobs
- Orchestrer des exécutions conditionnelles ou parallèles
- Réutiliser des modèles de pipelines
- Gérer dynamiquement les entrées/sorties et les résolveurs

**En résumé :**  
Le chaînage de jobs avec MQ est idéal pour des pipelines simples ou linéaires. Pour des orchestrations avancées, utilisez les flows qui sont conçus pour cela.

---

## Bonnes pratiques

- Utilisez `follow` pour suivre l’évolution d’un job.
- Utilisez `on` pour réagir aux événements de la queue ou d’un job.
- Nettoyez les callbacks avec la méthode `dispose` si besoin.

---

## API Principale

MQ

- `enqueue(...workers)` : Ajoute un ou plusieurs jobs à la file.
- `dequeue(jobId)` : Retire un job de la file par son identifiant.
- `job(jobId)` : Récupère un job (en cours ou terminé) par son identifiant.
- `start(callback?)` : Démarre l’exécution de la file.
- `on(event, callback)` : Écoute les événements globaux (`start`, `success`, `error`, `end`).

- `WorkerController` : Permet de créer des jobs personnalisés avec gestion des propriétés, du suivi, des événements et des dépendances.

---

## Pour aller plus loin

- Voir le code source : [src/qm.ts](../src/mq.ts)
- Consultez la documentation sur les flows pour l’intégration avec le moteur de workflows.

---

## Licence

Distribué sous licence GNU GPL v3.
