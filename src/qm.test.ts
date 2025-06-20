import { MQ, WorkerController } from './qm';

describe('Memory Queue Tests', () => {

  describe('WorkerController Validation', () => {
    it('should validate a properly constructed worker callback', () => {
      const queue = new MQ({ name: 'test-queue' });
      const validWorker = WorkerController(async () => 'test', {});
      const callback = validWorker(queue);

      expect(callback).toBeDefined();
      expect(typeof callback).toBe('function');
      expect(typeof callback.controller).toBe('function');
      expect(typeof callback.controller.name).toBe('string');
    });

    it('should create worker with correct structure', () => {
      const queue = new MQ({ name: 'test-queue' });
      const workerFactory = WorkerController(({ testProp }: { testProp: string }) => testProp, {
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

  describe('Job lifecycle and events', () => {
    it('should trigger "start", "success" and "end" events', async () => {
      const queue = new MQ({ name: 'test-queue' });
      const events: string[] = [];

      const workerFactory = WorkerController(async () => 'done', {});
      const worker = workerFactory(queue);

      worker.on('start', () => events.push('start'));
      worker.on('success', () => events.push('success'));
      worker.on('end', () => events.push('end'));

      // Simule l'exécution du job
      await worker();

      // Simule la fin de la queue
      queue.callbacks.get(`on:${worker.id}:start`)?.call();
      queue.callbacks.get(`on:${worker.id}:success`)?.call();
      queue.callbacks.get(`on:${worker.id}:end`)?.call();

      expect(events).toContain('start');
      expect(events).toContain('success');
      expect(events).toContain('end');
    });

    it('should allow following a job with follow()', async () => {
      const queue = new MQ({ name: 'test-queue' });
      const statuses: any[] = [];

      const workerFactory = WorkerController(async () => 'done', {});
      const worker = workerFactory(queue);

      worker.follow((step) => {
        statuses.push(step);
      });

      // Simule l'exécution du job
      await worker();

      // Simule le suivi via follow
      queue.callbacks.get(`follow:${worker.id}`)?.call(worker, 'start', null, {});
      queue.callbacks.get(`follow:${worker.id}`)?.call(worker, 'success', null, {});
      queue.callbacks.get(`follow:${worker.id}`)?.call(worker, 'end', null, {});

      expect(statuses).toContain('start');
      expect(statuses).toContain('success');
      expect(statuses).toContain('end');
    });

    it('should handle error event', async () => {
      const queue = new MQ({ name: 'test-queue' });
      let errorEventTriggered = false;

      const workerFactory = WorkerController(async () => { throw new Error('fail'); }, {});
      const worker = workerFactory(queue);

      worker.on('error', () => {
        errorEventTriggered = true;
      });

      try {
        await worker();
      } catch (e) {
        // ignore
      }

      // Simule l'appel du callback d'erreur
      queue.callbacks.get(`on:${worker.id}:error`)?.();

      expect(errorEventTriggered).toBe(true);
    });
  });

  describe('Queue enqueue and dequeue', () => {
    it('should enqueue and dequeue jobs', () => {
      const queue = new MQ({ name: 'test-queue' });
      const workerFactory = WorkerController(async () => 'test', {});
      const [worker] = queue.enqueue(workerFactory);

      expect(queue.jobs.length).toBeGreaterThan(0);

      const removed = queue.dequeue(worker.id);
      expect(removed).toBe(worker);
      expect(queue.jobs.length).toBe(0);
    });

    it('should return null when dequeue with unknown id', () => {
      const queue = new MQ({ name: 'test-queue' });
      const result = queue.dequeue('unknown-id');
      expect(result).toBeNull();
    });
  });

  describe('Worker start()', () => {

    it('should return worker result', async () => {
      const queue = new MQ({ name: 'test-queue' });
      const workerFactory = WorkerController(async () => 'test result', {});
      const [worker] = queue.enqueue(workerFactory);

      let result = await worker.start();

      console.log({ result })

      expect( result ).toBeDefined();
    });

    it('should execute worker and return result in callback if used', async () => {
      const queue = new MQ({ name: 'test-queue' });
      let testResult = 'test result';
      const workerFactory = WorkerController(async () => testResult, {});
      const [worker] = queue.enqueue(workerFactory);

      worker.start(( error , result ) => {
        expect(error).toBe(null);
        expect(result).toBe(testResult);
      });
      
    });

    it('should execute worker and return errors in callback if used', async () => {
      const queue = new MQ({ name: 'test-queue' });
      const errorMessage = 'Test error';
      const workerFactory = WorkerController(async () => { throw new Error(errorMessage); }, {});
      const [worker] = queue.enqueue(workerFactory);

      worker.start(( error ) => {
        expect(error instanceof Error).toBe(true);
      });

    });

    it('should execute worker and return result', async () => {
      const queue = new MQ({ name: 'test-queue' });
      const workerFactory = WorkerController(async () => 'test result', {});
      const [worker] = queue.enqueue(workerFactory);

      await worker.start();

      expect(worker.status).toBe('success');
      expect(worker.success).toBe(true);
      expect(worker.data).toBe('test result');
      expect(worker.error).toBeNull();
      expect(worker.executionDt).toBeDefined();
      expect(worker.completedDt).toBeDefined();
    });

    it('should handle worker execution errors', async () => {
      const queue = new MQ({ name: 'test-queue' });
      const errorMessage = 'Test error';
      const workerFactory = WorkerController(async () => { throw new Error(errorMessage); }, {});
      const [worker] = queue.enqueue(workerFactory);

      try {
        await worker.start();
      } catch (e) {
        // ignore
      }

      expect(worker.status).toBe('error');
      expect(worker.success).toBe(false);
      expect(worker.error?.message).toBe(errorMessage);
    });

  })

  describe('job() method', () => {

    it('should find a job by id', () => {
      const queue = new MQ({ name: 'test-queue' });
      const workerFactory = WorkerController(async () => 'test', {});
      const [worker] = queue.enqueue(workerFactory);

      const found = queue.job(worker.id);
      expect(found).toBe(worker);
    });

    it('should return undefined for unknown job id', () => {
      const queue = new MQ({ name: 'test-queue' });
      const found = queue.job('unknown-id');
      expect(found).toBeUndefined();
    });

  });

});