export interface ExpectedMapResult {
  [key: string]: string | ExpectedMapResult;
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
export function resolverExpectedResults( data:Record<string , any> , expected : ExpectedMapResult ):Record< string , any >{

  if( !data )return {};

  function resolveKeys( data:Record<string , any> , expected : ExpectedMapResult ): [ string , string | Record< string , any > ][] {

    return Object.keys( expected ).map(( key ) => {
      let newKey = expected[key];
      if( typeof expected[key] == 'object' )return [ newKey , Object.fromEntries( resolveKeys( data[key] , expected[key] ) )];
      return [ newKey , data[key] ];
    }) as [ string , string | Record< string , any > ][]
  }

  return Object.fromEntries( resolveKeys( data , expected ) );

}