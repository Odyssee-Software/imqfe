import { FlowProducer } from './mq-flow';

describe('FlowProducer', () => {

  let flowProducer: FlowProducer;

  beforeEach(() => {
    flowProducer = new FlowProducer();
  });

  describe('constructor', () => {

    it('should initialize with empty specs if none provided', () => {
      expect(flowProducer.specs.tasks).toEqual({});
    });

    it('should initialize with provided specs', () => {
      const specs = {
        tasks: {
          task1: {
            provides: ['output1'],
            requires: ['input1'],
            resolver: {
              name: 'echo',
              params: { value: 'test' }
            }
          }
        }
      };
      flowProducer = new FlowProducer(specs);
      expect(flowProducer.specs).toStrictEqual(specs);
    });

  });

  describe('add()', () => {

    it('should throw error for invalid resolver name', () => {
      expect(() => flowProducer.add('task1', {
        provides: ['output1'],
        requires: [],
        resolver: {
          name: 'invalidResolver'
        }
      })).toThrow();
    });

    it('should add valid task to queue', () => {
      const result = flowProducer.add('echoTask', {
        provides: ['output'],
        requires: [],
        resolver: {
          name: 'imqfe::Echo',
          params: { in: 'test' }
        }
      });

      expect(result).toBeDefined();
    });

  });

  describe('run()', () => {

    it('should run flow and return expected outputs', async () => {
      const specs = {
        tasks: {
          echoTask: {
            provides: ['output'],
            requires: [],
            resolver: {
              name: 'imqfe::Echo',
              params: { in: 'test' },
              results: { out: 'output' }
            }
          }
        }
      };
      
      flowProducer = new FlowProducer(specs);
      const result = await flowProducer.run(
        {}, // params
        ['output'], // expectedOutputs
        {}, // actions
        {} // context
      );

      expect( typeof result ).toBe('object');
      expect(Object.keys(result)).toStrictEqual(['output']);
      expect(result.output).toBe('test');
    });
  });

  describe('static run()', () => {
    
    it('should execute flow and resolve with outputs', async () => {
      const flow = new FlowProducer();
      flow.add('echoTask', {
        provides: ['output'],
        requires: [],
        resolver: {
          name: 'imqfe::Echo',
          params: { in: 'test' },
          results: { out: 'output' }
        }
      });

      const result = await FlowProducer.run(
        flow,
        {}, // params  
        ['output'], // expectedOutputs
        {} // context
      );

      expect( typeof result ).toBe('object');
      expect(Object.keys(result)).toStrictEqual(['output']);
      expect(result.output).toBe('test');
    });

  });

});