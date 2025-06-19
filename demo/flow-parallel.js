const { FlowProducer } = require('../dist');

let flow1 = new FlowProducer({
  tasks: {
    'step-a': {
      provides: ['A'],
      resolver: {
        name: 'flowher::Echo',
        params : { in : { value : 'a' } },
        results: { out : 'A' }
      },
    },
    'step-b': {
      provides: ['B'],
      resolver: {
        name: 'flowher::Echo',
        params : { in : { value : 'b' } },
        results: { out : 'B' }
      },
    },
    'step-c': {
      requires: ['A', 'B'],
      provides: ['C'],
      resolver: {
        name: 'flowher::Echo',
        params : {
          transform : {
            in : {
              'step-1' : '{{this["0"].A}}',
              'step-2' : '{{this["1"].B}}',
            }
          }
        },
        results: { out : 'C' }
      },
    },
  }
});

flow1.run( { } , [ 'C' ] , { } , { } )
.then(( results ) => {
  console.log({ result : results[0]["C"] })
})