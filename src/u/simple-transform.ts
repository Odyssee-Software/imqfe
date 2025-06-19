const ST = require('stjs');

export type TransformPatern = {
  transform : Record< string , any > 
};

/**
 * Performs a simple transformation on a data object using a specified transform pattern.
 * @param data - The input data object to transform
 * @param patern - The transform pattern to apply to the data
 * @returns The transformed data object
 */
export function simpleTransform( data : Record< string , any > , patern : TransformPatern ){
  return ST.select( data )
  .transformWith( patern.transform )
  .root();
}