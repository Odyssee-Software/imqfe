import { ValueMap } from '@types';

namespace resolverExpectedResults{

  export type Input = ValueMap;

  export interface Expected {
    [key: string]: string | Expected;
  }

  export type Output = ValueMap;

}

/**
 * Transforms an object by mapping its keys according to an expected result map.
 * 
 * @param data - The source object to transform
 * @param expected - A mapping object that defines how to rename/restructure the keys
 * @returns A new object with keys renamed according to the expected map
 * 
 * @example
 * ```ts
 * const data = { foo: 'bar', nested: { a: 1 } };
 * const expected = { foo: 'newFoo', nested: { a: 'newA' } };
 * resolverExpectedResults(data, expected);
 * // Returns: { newFoo: 'bar', nested: { newA: 1 } }
 * ```
 */
function resolverExpectedResults( data:resolverExpectedResults.Input , expected : resolverExpectedResults.Expected ):resolverExpectedResults.Output{

  if( !data )return {};
  if( !expected || typeof expected !== 'object' )return data as resolverExpectedResults.Output;

  function resolveKeys( data:ValueMap , expected : resolverExpectedResults.Expected ): [ string , string | ValueMap ][] {

    return Object.keys( expected ).map(( key ) => {
      let newKey = expected[key];
      if( typeof expected[key] == 'object' )return [ key , Object.fromEntries( resolveKeys( data[key] , expected[key] as resolverExpectedResults.Expected ) )];
      return [ newKey , data[key] ];
    }) as [ string , string | ValueMap ][]
  }

  return Object.fromEntries( resolveKeys( data , expected ) );

}

export { resolverExpectedResults }