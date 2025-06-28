import { ResolversRegistry } from "./resolver-registry";
// import { FlowProducer } from "./mq-flow";

describe("ResolversRegistry", () => {
  describe("imqfe::Noop", () => {
    it("should return an empty object", () => {
      const result = ResolversRegistry["imqfe::Noop"]({});
      expect(result).toEqual({});
    });
  });

  describe("imqfe::Echo", () => {
    it("should return input value in out property", () => {
      const params = { in: "test value" };
      const result = ResolversRegistry["imqfe::Echo"](params);
      expect(result).toEqual({ out: "test value" });
    });

    it("should handle different input types", () => {
      const testCases = [
        { in: 123 },
        { in: true },
        { in: { prop: "value" } },
        { in: ["item"] },
      ];

      testCases.forEach((params) => {
        const result = ResolversRegistry["imqfe::Echo"](params);
        expect(result).toEqual({ out: params.in });
      });
    });
  });

  describe("imqfe::ThrowError", () => {
    it("should throw error with default message when no message provided", () => {
      expect(() => {
        ResolversRegistry["imqfe::ThrowError"]({});
      }).toThrow("ThrowErrorResolver resolver has thrown an error");
    });

    it("should throw error with provided message", () => {
      const message = "Custom error message";
      expect(() => {
        ResolversRegistry["imqfe::ThrowError"]({ message });
      }).toThrow(message);
    });
  });

  describe("imqfe::Conditional", () => {
    it("should return onTrue object when condition is true", () => {
      const params = {
        condition: true,
        trueResult: { result: "success" },
        falseResult: { result: "failure" },
      };
      const result = ResolversRegistry["imqfe::Conditional"](params);
      expect(result).toEqual({ onTrue: { result: "success" } });
    });

    it("should return onFalse object when condition is false", () => {
      const params = {
        condition: false,
        trueResult: { result: "success" },
        falseResult: { result: "failure" },
      };
      const result = ResolversRegistry["imqfe::Conditional"](params);
      expect(result).toEqual({ onFalse: { result: "failure" } });
    });

    it("should handle different result value types", () => {
      const testCases = [
        {
          condition: true,
          trueResult: { value: 123 },
          falseResult: { value: 456 },
        },
        { condition: false, trueResult: { a: 1 }, falseResult: { b: 2 } },
        {
          condition: true,
          trueResult: { value: [1, 2, 3] },
          falseResult: { value: [4, 5, 6] },
        },
      ];

      testCases.forEach((params) => {
        const result = ResolversRegistry["imqfe::Conditional"](params);
        expect(result).toEqual(
          params.condition
            ? { onTrue: params.trueResult }
            : { onFalse: params.falseResult }
        );
      });
    });
  });

  describe("imqfe::Wait", () => {
    it("should resolve after specified delay with given result", async () => {
      const params = {
        ms: 100,
        result: { value: "test result" },
      };
      const startTime = Date.now();
      const result = await ResolversRegistry["imqfe::Wait"](params);
      const endTime = Date.now();

      expect(result).toEqual({ result: { value: "test result" } });
      expect(endTime - startTime).toBeGreaterThanOrEqual(100);
    });

    it("should handle different result value types", async () => {
      const testCases = [
        { ms: 50, result: { value: 123 } },
        { ms: 50, result: { value: "value" } },
        { ms: 50, result: { value: ["item"] } },
        { ms: 50, result: { value: true } },
      ];

      for (const params of testCases) {
        const result = await ResolversRegistry["imqfe::Wait"](params);
        expect(result).toEqual({ result: params.result });
      }
    });

    it("should resolve immediately with 0ms delay", async () => {
      const params = {
        ms: 0,
        result: { value: "immediate" },
      };
      const result = await ResolversRegistry["imqfe::Wait"](params);
      expect(result).toEqual({ result: { value: "immediate" } });
    });
  });

  describe("imqfe::SubFlow", () => {
    it("should execute a sub-flow and resolve with its result", async () => {
      const params = {
        flowSpec: {
          tasks: {
            getDate: {
              provides: ["date"],
              resolver: {
                name: "imqfe::Echo",
                params: { in: { value: new Date() } },
                results: { out: "date" },
              },
            },
            formatDate: {
              requires: ["date"],
              provides: ["formatted-date"],
              resolver: {
                name: "imqfe::Echo",
                params: {
                  transform: {
                    in: {
                      year: "{{this.requires.date.value.getDate()}}",
                      month: "{{this.requires.date.value.getMonth() + 1}}",
                      day: "{{this.requires.date.value.getFullYear()}}",
                    },
                  },
                },
                results: { out: "formatted-date" },
              },
            },
          },
        },
        flowExpectedResults: ["formatted-date"],
      };

      const result = await ResolversRegistry["imqfe::SubFlow"](params);

      expect(result["formatted-date"]).toMatchObject({
        year: expect.any(Number),
        month: expect.any(Number),
        day: expect.any(Number),
      });
    });

    it("should reject with error message when sub-flow fails", async () => {
      const params = {
        flowSpec: { some: "flow spec" },
        flowExpectedResults: ["result"],
      };

      await expect(
        await ResolversRegistry["imqfe::SubFlow"](params as any)
      ).toEqual({});
    });
  });

  describe("imqfe::Stop", () => {
    it("should call stop on queue and return promise when context has queue", () => {
      const mockStop = jest.fn().mockResolvedValue(null);
      const mockContext = {
        $queue: {
          stop: mockStop,
        },
      };

      const result = ResolversRegistry["imqfe::Stop"]({}, mockContext as any);

      expect(mockStop).toHaveBeenCalled();
      expect(result).toEqual({ promise: mockStop(null) });
    });

    it("should handle missing context gracefully", () => {
      const result = ResolversRegistry["imqfe::Stop"]({});
      expect(result).toEqual({ promise: Promise.resolve() });
    });
  });

  describe("imqfe::Loop", () => {
    
    it("should process items sequentially when parallel is false", async () => {
      const params = {
        inCollection: [1, 2, 3],
        inItemName: "num",
        outItemName: "result",
        subtask: {
          multiply: {
            provides: ["result"],
            resolver: {
              name: "imqfe::Echo",
              params: { in: 2 },
              results: { out: "result" },
            },
          },
        },
        parallel: false,
      };

      const result = await ResolversRegistry["imqfe::Loop"](params);

      expect(result).toHaveProperty("outCollection");
      expect(Array.isArray(result.outCollection)).toBe(true);
    });

    it("should process items in parallel when parallel is true", async () => {
      const params = {
        inCollection: [1, 2, 3],
        inItemName: "num",
        outItemName: "result",
        subtask: {
          multiply: {
            provides: ["result"],
            resolver: {
              name: "imqfe::Echo",
              params: { in: 2 },
              results: { out: "result" },
            },
          },
        },
        parallel: true,
      };

      const result = await ResolversRegistry["imqfe::Loop"](params);

      expect(result).toHaveProperty("outCollection");
      expect(Array.isArray(result.outCollection)).toBe(true);
    });

    it("should handle empty input collection", async () => {
      const params = {
        inCollection: [],
        inItemName: "num",
        outItemName: "result",
        subtask: {
          task: {
            resolver: {
              name: "imqfe::Echo",
            },
          },
        },
      };

      const result = await ResolversRegistry["imqfe::Loop"](params);

      expect(result.outCollection).toEqual([]);
    });

    it('should return outCollection with transformed items', async () => {

      const params = {
        inCollection: [1, 2, 3],
        inItemName: "num",
        outItemName: "result",
        parallel: true,
        subtask: {
          multiply: {
            provides: ["result"],
            resolver: {
              name: "imqfe::Echo",
              params: {
                transform : {
                  in: "{{$flow.properties.num * 2}}"
                }
              },
              results: { out: "result" },
            },
          },
        },
      };

      const result = await ResolversRegistry["imqfe::Loop"](params);

      expect(result.outCollection).toEqual([{ result : 2 }, { result : 4 }, { result : 6 }]);
      
    })
    
  });
});
