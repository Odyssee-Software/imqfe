import { ValueMap } from '@types';

import { simpleTransform } from '@u/simple-transform';

/**
 * Handles transformation of properties based on a transform configuration.
 * If a transform object is present in the properties, applies the transformation to the combined input and remaining properties.
 * Otherwise, returns the original properties unchanged.
 * 
 * @param properties - Object containing potential transform configuration and other properties
 * @param input - Optional input values to be included in the transformation dataset
 * @returns Transformed or original properties depending on presence of transform configuration
 */
export function handleTransformProperties( properties : ValueMap & { transform ? : ValueMap } , input? : ValueMap ): ValueMap {

  if( !properties || typeof properties !== 'object' ){
    console.warn( 'Invalid properties provided, returning input unchanged.' );
    return Object.assign( input || {} , properties );
  }
  if( 'transform' in properties === false ){
    console.warn( 'No transform property found, returning input unchanged.' );
    return Object.assign( input || {} , properties );
  }
  
  let { transform ,  ...rest } = properties;

  if( typeof transform == 'object' ){
    let dataset = Object.assign( input || {} , rest );
    return simpleTransform( dataset , { transform } );
  }
  else return Object.assign( input || {} , properties );

}