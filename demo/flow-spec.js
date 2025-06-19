const { FlowProducer } = require('../dist');

const Controllers = {
  'internal::GetDate' : function(){
    return { date : new Date( ) };
  },
  'internal::Fetch' : function( input ){
    console.log({ input });
    return input;
  }
}

let flow1 = new FlowProducer({
  tasks : {
    a : {
      provides : [ 'date' ],
      resolver : {
        name : 'flowher::Echo',
        params: { in: { value: new Date() } },
        results : { out : 'date' }
      }
    }
  }
});

console.log({ flow1 });

// let flow2 = new FlowProducer();

// flow2.add( 'printDate' , {
//   requires : [ 'date' ],
//   resolver : {
//     name : 'Print',
//   }
// })

// flow2.add( 'getDate' , {
//   provides : [ 'date' ],
//   resolver : {
//     name : 'GetDate',
//     results : { date : 'date' }
//   }
// })

// console.log({ flow2 });

flow1.run( { } , [ 'date' ] , Controllers , { } )
.then(( result ) => {
  console.log({ 
    flow1 : flow1.queue.results.flat(1)[0],
    resolver : flow1.queue.results.flat(1)[0].resolver,
  })
  console.log({ final_result : result })
})

// flow2.run( { } , [ 'date' ] , Controllers , { } )
// .then(( result ) => {
//   console.log({ finalResult : result })
// })