# Guide d’utilisation des Flows – IMQFE

Le moteur de flows d’IMQFE permet d’orchestrer des tâches synchrones et asynchrones, de gérer des dépendances complexes, de paralléliser des traitements et de composer des pipelines réutilisables, le tout en JSON ou en JavaScript. Ce guide vous explique comment concevoir, exécuter et étendre vos flows.

---

## Sommaire

- [Introduction](#introduction)
- [Principes de base](#principes-de-base)
- [Définition d’un flow](#définition-dun-flow)
- [Résolveurs intégrés](#résolveurs-intégrés)
- [Exécution d’un flow](#exécution-dun-flow)
- [Gestion des dépendances](#gestion-des-dépendances)
- [Chaînage, parallélisme et sous-flows](#chaînage-parallélisme-et-sous-flows)
- [Personnalisation et actions](#personnalisation-et-actions)
- [Bonnes pratiques et astuces](#bonnes-pratiques-et-astuces)
- [Annexes : API et exemples](#annexes--api-et-exemples)

---

## Introduction

Le flow engine d’IMQFE s’inspire de la philosophie de [flowed](https://danielduarte.github.io/flowed/) : il permet de décrire des pipelines de tâches sous forme de graphes de dépendances, en maximisant le parallélisme et la réutilisabilité.  
Contrairement à flowed, IMQFE repose sur une file d’attente en mémoire (MQ) pour piloter l’exécution, ce qui permet une orchestration fine, un suivi d’état et une intégration native avec la MQ.

---

## Principes de base

- **Flow** : Un ensemble de tâches (tasks) reliées par leurs entrées/sorties (requires/provides).
- **Task** : Une unité de travail, associée à un résolveur (resolver) qui exécute la logique.
- **Resolver** : Fonction qui réalise le traitement (ex : Echo, Wait, Conditional…).
- **Dépendances** : Les tâches peuvent dépendre des résultats d’autres tâches.
- **Paramétrage** : Les flows sont définis en JSON ou JS, et peuvent être paramétrés à l’exécution.

---

## Définition d’un flow

Un flow se définit comme un objet contenant une clé `tasks`, chaque tâche ayant :

- `provides` : les sorties produites
- `requires` : les entrées nécessaires
- `resolver` : la logique à exécuter

**Exemple minimal :**

```js
const flowSpec = {
  tasks: {
    echoTask: {
      provides: ['output'],
      requires: [],
      resolver: {
        name: 'imqfe::Echo',
        params: { in: 'Hello World!' },
        results: { out: 'output' }
      }
    }
  }
};
```

---

## Résolveurs intégrés

IMQFE propose une bibliothèque de résolveurs prêts à l’emploi :

- **imqfe::Echo** : Retourne la valeur passée en entrée (`in` → `out`)
- **imqfe::Noop** : Ne fait rien, retourne un objet vide
- **imqfe::ThrowError** : Lève une erreur personnalisée
- **imqfe::Conditional** : Retourne un résultat selon une condition
- **imqfe::Wait** : Attend un délai avant de retourner un résultat
- **imqfe::SubFlow** : Exécute un sous-flow imbriqué
- **imqfe::Repeater** : Répète une tâche un certain nombre de fois
- **imqfe::Loop** : Applique une tâche sur une collection (for/foreach)
- **imqfe::ArrayMap** : Mappe un tableau de paramètres sur une tâche
- **imqfe::Stop** : Arrête l’exécution du flow

Voir [`src/resolver-registry.ts`](../src/resolver-registry.ts) pour la liste complète et la documentation de chaque résolveur.

---

## Exécution d’un flow

### 1. Instanciation

```js
const { FlowProducer } = require('@odyssee-software/imqfe');

const flow = new FlowProducer(flowSpec);
```

### 2. Ajout dynamique de tâches

```js
flow.add('echoTask', {
  provides: ['output'],
  requires: [],
  resolver: {
    name: 'imqfe::Echo',
    params: { in: 'test' },
    results: { out: 'output' }
  }
});
```

### 3. Exécution

```js
const result = await flow.run(
  {},                // paramètres d’entrée
  ['output'],        // outputs attendus
  {},                // actions personnalisées (optionnel)
  {}                 // contexte (optionnel)
);

console.log(result); // { output: 'test' }
```

### 4. Exécution statique

```js
const result = await FlowProducer.run(
  flow,
  {},                // paramètres d’entrée
  ['output'],        // outputs attendus
  {}                 // contexte (optionnel)
);
```

---

## Gestion des dépendances

Les dépendances sont gérées automatiquement via les propriétés `requires` et `provides` de chaque tâche.  
Le moteur exécute chaque tâche dès que ses dépendances sont satisfaites, maximisant ainsi le parallélisme.

**Exemple :**

```js
const flowSpec = {
  tasks: {
    A: {
      provides: ['resultA'],
      resolver: { name: 'imqfe::Echo', params: { in: 1 }, results: { out: 'resultA' } }
    },
    B: {
      requires: ['resultA'],
      provides: ['resultB'],
      resolver: { name: 'imqfe::Echo', params: { in: 2 }, results: { out: 'resultB' } }
    },
    C: {
      requires: ['resultB'],
      provides: ['resultC'],
      resolver: { name: 'imqfe::Echo', params: { in: 3 }, results: { out: 'resultC' } }
    }
  }
};
```

---

## Chaînage, parallélisme et sous-flows

### Chaînage de tâches

Les tâches peuvent être chaînées : la sortie d’une tâche devient l’entrée d’une autre.

### Parallélisme

Si deux tâches n’ont pas de dépendance entre elles, elles sont exécutées en parallèle.

### Sous-flows (SubFlow)

Vous pouvez exécuter un flow imbriqué dans une tâche grâce au résolveur `imqfe::SubFlow`.

**Exemple :**

```js
{
  tasks: {
    main: {
      provides: ['result'],
      resolver: {
        name: 'imqfe::SubFlow',
        params: {
          flowSpec: {
            tasks: {
              sub: {
                provides: ['subResult'],
                resolver: { name: 'imqfe::Echo', params: { in: 42 }, results: { out: 'subResult' } }
              }
            }
          },
          flowExpectedResults: ['subResult']
        }
      }
    }
  }
}
```

---

## Personnalisation et actions

Vous pouvez injecter des actions personnalisées (résolveurs) lors de l’exécution du flow :

```js
const customResolvers = {
  'custom::UpperCase': ({ in }) => ({ out: String(in).toUpperCase() })
};

const result = await flow.run(
  { in: 'hello' },
  ['output'],
  customResolvers,
  {}
);
```

---

## Bonnes pratiques et astuces

- **Utilisez `provides` et `requires`** pour décrire clairement les dépendances.
- **Privilégiez les flows pour les orchestrations complexes** : conditions, parallélisme, sous-flows, répétitions…
- **Utilisez les résolveurs intégrés** pour accélérer le développement.
- **Déboguez vos flows** en inspectant la propriété `queue` du flow pour voir l’état des jobs.
- **Pour des pipelines très simples**, la MQ seule peut suffire (voir [guide MQ](./mq.md)).

---

## Annexes : API et exemples

### API principale

Voir [`src/mq-flow.ts`](../src/mq-flow.ts) pour la documentation complète.

- `FlowProducer` : classe principale pour créer et exécuter des flows.
- `add(taskName, taskSpec)` : ajoute une tâche dynamiquement.
- `run(params, expectedOutputs, actions?, context?)` : exécute le flow.
- `static run(flow, params, expectedOutputs, context?)` : exécution statique.

### Exemples avancés

#### 1. Chaînage de tâches avec attente

```js
const flow = new FlowProducer({
  tasks: {
    getDate: {
      provides: ['date'],
      resolver: { name: 'imqfe::Echo', params: { in: new Date() }, results: { out: 'date' } }
    },
    wait: {
      requires: ['date'],
      provides: ['waited'],
      resolver: { name: 'imqfe::Wait', params: { ms: 1000, result: { value: 1000 } }, results: { result: 'waited' } }
    },
    delta: {
      requires: ['date', 'waited'],
      provides: ['delta'],
      resolver: {
        name: 'imqfe::Echo',
        params: {
          transform: {
            in: {
              delta: '{{new Date(this.requires.date.value.getTime() + this.requires.waited.value)}}'
            }
          }
        },
        results: { out: 'delta' }
      }
    }
  }
});

const result = await flow.run({}, ['delta'], {}, {});
console.log(result.delta);
```

#### 2. Exécution parallèle et agrégation

```js
const flow = new FlowProducer({
  tasks: {
    A: {
      provides: ['A'],
      resolver: { name: 'imqfe::Echo', params: { in: 'a' }, results: { out: 'A' } }
    },
    B: {
      provides: ['B'],
      resolver: { name: 'imqfe::Echo', params: { in: 'b' }, results: { out: 'B' } }
    },
    C: {
      requires: ['A', 'B'],
      provides: ['C'],
      resolver: {
        name: 'imqfe::Echo',
        params: {
          transform: {
            in: {
              step1: '{{this.requires.A}}',
              step2: '{{this.requires.B}}'
            }
          }
        },
        results: { out: 'C' }
      }
    }
  }
});

const result = await flow.run({}, ['C'], {}, {});
console.log(result.C);
```

#### 3. Utilisation de Loop et ArrayMap

```js
const flow = new FlowProducer({
  tasks: {
    loop: {
      provides: ['results'],
      resolver: {
        name: 'imqfe::Loop',
        params: {
          inCollection: [1, 2, 3],
          inItemName: 'item',
          outItemName: 'result',
          subtask: {
            multiply: {
              provides: ['result'],
              resolver: {
                name: 'imqfe::Echo',
                params: {
                  transform: { in: { value: '{{$flow.properties.item}}' } }
                },
                results: { out: 'result' }
              }
            }
          },
          parallel: true
        }
      }
    }
  }
});

const result = await flow.run({}, ['results'], {}, {});
console.log(result.outCollection);
```

---

## Pour aller plus loin

- [Guide MQ](./mq.md) : pour comprendre la file d’attente et l’exécution de jobs simples.
- [Code source des résolveurs](../src/resolver-registry.ts)
- [Tests unitaires](../src/mq-flow.test.ts)
- [Exemples dans `demo/flows/`](../demo/flows)

---

## Licence

Distribué sous licence
