import { simpleTransform } from './simple-transform';

describe('simpleTransform', () => {
  it('should transform data according to the pattern', () => {
    const data = {
      name: 'John',
      age: 30,
      address: {
        street: 'Main St',
        city: 'Boston'
      }
    };

    const pattern = {
      transform: {
        person : {
          fullName: '{{name}}',
          years: '{{age}}',
          location: {
            street: '{{address.street}}',
            city: '{{address.city}}'
          }
        }
      }
    };

    const expected = {
      person: {
        fullName: 'John',
        years: 30,
        location: {
          street: 'Main St',
          city: 'Boston'
        }
      }
    };

    const result = simpleTransform(data, pattern);
    expect(result).toEqual(expected);
  });

  it('should handle empty data and pattern', () => {
    const data = {};
    const pattern = {
      transform: {}
    };

    const result = simpleTransform(data, pattern);
    expect(result).toEqual({});
  });
});