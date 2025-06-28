import { handleTransformProperties } from './handle-transform-properties';
import { simpleTransform } from './simple-transform';

jest.mock('./simple-transform');

describe('handleTransformProperties', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'warn');
    (simpleTransform as jest.Mock).mockReset();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should return merged input and properties when properties is invalid', () => {
    const result = handleTransformProperties(null as any, { foo: 'bar' });
    expect(result).toEqual({ foo: 'bar' });
    expect(consoleSpy).toHaveBeenCalledWith('Invalid properties provided, returning input unchanged.');
  });

  it('should return merged input and properties when no transform property exists', () => {
    const result = handleTransformProperties({ foo: 'bar' }, { baz: 'qux' });
    expect(result).toEqual({ foo: 'bar', baz: 'qux' });
    expect(consoleSpy).toHaveBeenCalledWith('No transform property found, returning input unchanged.');
  });

  it('should call simpleTransform when transform is an object', () => {
    const properties = { transform: { rule: 'test' }, foo: 'bar' };
    const input = { baz: 'qux' };
    (simpleTransform as jest.Mock).mockReturnValue({ transformed: true });

    const result = handleTransformProperties(properties, input);

    expect(simpleTransform).toHaveBeenCalledWith(
      { foo: 'bar', baz: 'qux' },
      { transform: { rule: 'test' } }
    );
    expect(result).toEqual({ transformed: true });
  });

  it('should return merged input and properties when transform is not an object', () => {
    const properties = { transform: 'not-an-object' as any, foo: 'bar' };
    const input = { baz: 'qux' };
    
    const result = handleTransformProperties(properties, input);
    expect(result).toEqual({ transform: 'not-an-object', foo: 'bar', baz: 'qux' });
  });
});