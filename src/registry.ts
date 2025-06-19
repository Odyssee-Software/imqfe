export type ActionContext = {

};

export type ActionConstructor = new () => ActionInterface;

export interface ActionInterface< Input extends any = any , Output extends any = any > {
  exec( input:Input , context:ActionContext ):Promise<Output>;
}

export type ActionRegistry = Record< string , ActionInterface > & {
  use( name : string , action : ActionInterface ):any;
}

export const ActionRegistry = Object.assign( {} , {
  use( name : string , action : ActionConstructor ){
    (this as any)[name] = action;
    return (this as any)[name];
  }
} );