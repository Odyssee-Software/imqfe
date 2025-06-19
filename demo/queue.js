const { InMemoryQueues , WorkerController , ActionRegistry } = require('../dist');

let mainQueue = InMemoryQueues.get('main');

// mainQueue.push(async function( cb ){
//   cb( null , 'coucou' )
// })

//
// mainQueue.enqueue(( cb ) => {
//   let message = "Hello World";
//   cb( null , message );
// })

//
let callBack_success = async ( props ) => props.message;
let callBack_error = async ( props ) => {throw new Error("Error")};

let [ task_1 , task_2 , task_3 ] = mainQueue.enqueue( 
  WorkerController( callBack_success , { message : "Hello from task controller" } ),
  WorkerController( callBack_success , { message : "Hello from task controller 2" } ),
  WorkerController( callBack_error , { message : "Hello from task controller 3" } ),
);

// mainQueue.on('success' , ( job ) => {
//   if( job.success )console.log(`Success with job execution [${job.id}]`);
//   else console.log(`Error with job execution [${job.id}]`);
// })

task_1.on('start' , ( job ) => console.log(`${job.id} start`))
task_1.on('success' , ( job ) => console.log(job))
task_1.on('error' , ( job ) => console.log(`${job.id} error`))

task_1.follow(( step , error , result ) => {
  console.log(`${task_1.id} follow [${step}]`);
})

mainQueue.dequeue( task_3.id );

mainQueue.start();

// setTimeout(() => {
//   mainQueue.results.forEach(( result ) => {
//     console.log({ result })
//   })
// } , 500)

console.log({ mainQueue })