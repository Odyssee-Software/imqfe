import { flowed } from '@depts';
import { ActionRegistry } from './registry';

export async function ExecuteWorkflow( flow : flowed.FlowSpec , outputKeys : string[] , context : any ){
  let { use , ...actions } = ActionRegistry;
  console.log({ actions })
  return flowed.FlowManager.run( flow , {} , outputKeys || [] , actions , context || {} );
};