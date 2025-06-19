import { MQ, WorkerController } from './qm';

describe('Memory Queue Tests', () => {

  describe('WorkerController Validation', () => {

    it('should validate a properly constructed worker callback', () => {
      const queue = new MQ({ name: 'test-queue' });
      
      const validWorker = WorkerController(async () => {
        return 'test'
      }, {});

      const callback = validWorker(queue);

      expect(callback).toBeDefined();
      expect(typeof callback).toBe('function');
      expect(typeof callback.controller).toBe('function');
      expect(typeof callback.controller.name).toBe('string');
    });

    it('should create worker with correct structure', () => {
      const queue = new MQ({ name: 'test-queue' });
      
      const workerFactory = WorkerController(({ testProp } : { testProp : string }) => testProp , {
        testProp: 'test'
      });

      const worker = workerFactory(queue);

      expect(worker).toHaveProperty('id');
      expect(worker).toHaveProperty('status', 'waiting');
      expect(worker).toHaveProperty('success', null);
      expect(worker).toHaveProperty('data', null);
      expect(worker).toHaveProperty('error', null);
      expect(worker).toHaveProperty('properties.testProp', 'test');
      expect(worker).toHaveProperty('queue');
      expect(typeof worker.follow).toBe('function');
      expect(typeof worker.on).toBe('function');
    });


  });

});