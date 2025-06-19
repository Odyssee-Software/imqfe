const { FlowProducer } = require('../dist');

(async () => {
  let flow = new FlowProducer();

  flow.add('echoTask', {
    provides: ['output1'],
    requires: [],
    resolver: {
      name: 'flowher::Echo',
      params: { in: 'test' },
      results: { out: 'output1' }
    }
  });

  const result = await flow.run(
    {}, // params  
    ['output1'], // expectedOutputs
    {} // context
  );

  console.log({ result })
})()