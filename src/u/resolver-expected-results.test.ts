import { resolverExpectedResults } from './resolver-expected-results';

describe('resolverExpectedResults', () => {

  it('should return empty object if data is falsy', () => {
    expect(resolverExpectedResults(null as any, {})).toEqual({});
    expect(resolverExpectedResults(undefined as any, {})).toEqual({});
  });

  it('should return data as-is if expected is falsy or not an object', () => {
    const data = { foo: 'bar' };
    expect(resolverExpectedResults(data, null as any)).toEqual(data);
    expect(resolverExpectedResults(data, undefined as any)).toEqual(data);
    expect(resolverExpectedResults(data, 'string' as any)).toEqual(data);
  });

  it('should rename simple key-value pairs', () => {
    const data = { foo: 'bar', baz: 'qux' };
    const expected = { foo: 'newFoo', baz: 'newBaz' };
    const result = resolverExpectedResults(data, expected);
    expect(result).toEqual({
      newFoo: 'bar',
      newBaz: 'qux'
    });
  });

  it('should handle nested objects', () => {
    const data = {
      foo: 'bar',
      nested: {
        a: 1,
        b: 2
      }
    };
    const expected = {
      foo: 'newFoo',
      nested: {
        a: 'newA',
        b: 'newB'
      }
    };
    const result = resolverExpectedResults(data, expected);
    expect(result).toEqual({
      newFoo: 'bar',
      nested: {
        newA: 1,
        newB: 2
      }
    });
  });

  it('should handle deeply nested objects', () => {
    const data = {
      level1: {
        level2: {
          level3: 'value'
        }
      }
    };
    const expected = {
      level1: {
        level2: {
          level3: 'newKey'
        }
      }
    };
    const result = resolverExpectedResults(data, expected);
    expect(result).toEqual({
      level1: {
        level2: {
          newKey: 'value'
        }
      }
    });
  });

});