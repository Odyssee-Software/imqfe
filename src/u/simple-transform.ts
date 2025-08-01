import { ValueMap } from '@types';
const ST = require('stjs');

namespace simpleTransform {

  export type Data = ValueMap;

  export type Patern = {
    transform : ValueMap 
  };

}


/**
 * Performs a simple transformation on a data object using a specified transform pattern.
 * @param data - The input data object to transform
 * @param patern - The transform pattern to apply to the data
 * @returns The transformed data object
 */
function simpleTransform( data : simpleTransform.Data , patern : simpleTransform.Patern ){
  return ST.select( data )
  .transformWith( patern.transform )
  .root();
};

export { simpleTransform };