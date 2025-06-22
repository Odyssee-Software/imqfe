const {  WorkerController , MQ } = require('../dist');

// (async () => {

//   const queue = new MQ({ name: 'test-queue' });

//   //
//   let callBack_success = async ( props ) => props.message;
//   let callBack_error = async ( props ) => {throw new Error("Error")};

//   let [ task_1 , task_2 , task_3 ] = queue.enqueue( 
//     WorkerController( callBack_success , { message : "Hello from task controller" } ),
//     WorkerController( callBack_success , { message : "Hello from task controller 2" } ),
//     WorkerController( callBack_error , { message : "Hello from task controller 3" } ),
//   );

//   task_1.on('start' , ( job ) => console.log(`${job.id} start`))
//   task_1.on('success' , ( job ) => console.log(job))
//   task_1.on('error' , ( job ) => console.log(`${job.id} error`))

//   task_1.follow(( step , error , result ) => {
//     console.log(`${task_1.id} follow [${step}]`);
//   })

//   queue.dequeue( task_3.id );

//   queue.start();

// })();

// (async () => {

//   const queue = new MQ({ name: 'test-queue' });

//   let [ dumy_job_1 ] = queue.enqueue(
//     WorkerController( async ( props ) => {
//       console.log(props.message);
//       return props.message;
//     }, { message : "Hello from dumy task 1" } )
//   );

//   let [ realJob ] = queue.enqueue(
//     WorkerController( async ( props ) => {
//       console.log(props.message);
//       return props.message;
//     }, { message : "I'm the goal" } )
//   );

//   let [ dumy_job_2 ] = queue.enqueue(
//     WorkerController( async ( props ) => {
//       console.log(props.message);
//       return props.message;
//     }, { message : "Hello from dumy task 2" } )
//   );

//   await realJob.start(( error , result ) => {
//     console.log(`Real job finished with result: ${result}`);
//   });

//   console.log({ queue })

// })();

(async () => {

  const queue = new MQ({ name: 'test-queue' });

  let [ getDate ] = queue.enqueue(
    WorkerController( async ( props ) => {
      return new Date();
    }, 
    null,
    {
      provides : [ 'date' ]
    } 
  ));

  let [ formatDate ] = queue.enqueue(
    WorkerController( async ( { '0' : date } ) => {
      return {
        year : date.getFullYear(),
        month : date.getMonth() + 1, // Months are zero-based
        day : date.getDate(),
      };
    }, 
    null,
    {
      requires : [ 'date' ],
    } 
  ));

  queue.start(() => {
    console.log({
      getDate,
      formatDate,
    })
  });

})();