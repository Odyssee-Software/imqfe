import { Server , http , HTTPSServer , Http2SecureServer , Http2Server } from '@depts';
import { PORT } from '@envs';

import { IMQ , MQ } from './qm';
import { ActionRegistry , ActionContext } from './registry';

IMQ.set('main' , new MQ({ results : [] , name : 'main-queue' }));

ActionRegistry.use(
  'DateNow',
  class DateNow {
    public async exec() {
      const now = Date.now();
      let result = { date: now };
      console.log('👉 DateNow executed with:', result);
      return result;
    }
  }
);

ActionRegistry.use(
  'Print',
  class Print {
    public exec(payload: any, context: ActionContext): any {
      console.log({ payload, context });

      return { finalResult: `La date est : ${payload.date}` };
    }
  }
);

type ServerInstance = http.Server | HTTPSServer | Http2SecureServer | Http2Server;

type TWServer = {
  io : Server;
  listen : (( port : number , callback? : () => void ) => void) & (( callback? : () => void ) => void)
}

function CreateServer( httpServer : ServerInstance ){

  return {
    io : null,
    listen( this : TWServer , callbackOrPort:number | (() => void) , callback:() => void ){

      let port = PORT;
      let cb = null;
      if( typeof callbackOrPort == "number" ){
        port = callbackOrPort;
        cb = callback;
      }
      else cb = callbackOrPort;

      this.io = new Server(
        httpServer || port,
        {
          cors : {
            origin : "*"
          }
        }
      );

      this.io.on("connection" , ( socket ) => {

        socket.onAny(async (event , { name , payload } : { name : string , payload : any }) => {
          console.log({ event , name , payload })
        })

        // socket.emit(`wire_job_status:${jobId}`, { jobId: jobNode.job.id, status: "PENDING" });

      })

      this.io.on('error' , () => {

      })

      if(cb)cb();

      return this.io;

    }
  }

}

export { 
  MQ, 
  IMQ,
  WorkerController , 
} from './qm';

export {
  FlowProducer,
} from './qm-flow';

export {
  TWServer,
  ServerInstance,
  CreateServer,
  ActionRegistry
};

export {
  ExecuteWorkflow
} from './flow';

export default CreateServer;


