import { ResolversRegistry } from "./resolver-registry";

describe("ResolversRegistry", () => {
  describe("flowher::Noop", () => {
    it("should return an empty object", () => {
      const result = ResolversRegistry["flowher::Noop"]();
      expect(result).toEqual({});
    });
  });

  describe("flowher::Echo", () => {
    
    it("should return input value in out property", () => {
      const params = { in: "test value" };
      const result = ResolversRegistry["flowher::Echo"](params);
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
        const result = ResolversRegistry["flowher::Echo"](params);
        expect(result).toEqual({ out: params.in });
      });
    });
  });

  describe("flowher::ThrowError", () => {
    it("should throw error with default message when no message provided", () => {
      expect(() => {
        ResolversRegistry["flowher::ThrowError"]({});
      }).toThrow("ThrowErrorResolver resolver has thrown an error");
    });

    it("should throw error with provided message", () => {
      const message = "Custom error message";
      expect(() => {
        ResolversRegistry["flowher::ThrowError"]({ message });
      }).toThrow(message);
    });
  });

  describe("flowher::Conditional", () => {
    it("should return onTrue object when condition is true", () => {
      const params = {
        condition: true,
        trueResult: "success",
        falseResult: "failure",
      };
      const result = ResolversRegistry["flowher::Conditional"](params);
      expect(result).toEqual({ onTrue: "success" });
    });

    it("should return onFalse object when condition is false", () => {
      const params = {
        condition: false,
        trueResult: "success",
        falseResult: "failure",
      };
      const result = ResolversRegistry["flowher::Conditional"](params);
      expect(result).toEqual({ onFalse: "failure" });
    });

    it("should handle different result value types", () => {
      const testCases = [
        { condition: true, trueResult: 123, falseResult: 456 },
        { condition: false, trueResult: { a: 1 }, falseResult: { b: 2 } },
        { condition: true, trueResult: [1, 2, 3], falseResult: [4, 5, 6] },
      ];

      testCases.forEach((params) => {
        const result = ResolversRegistry["flowher::Conditional"](params);
        expect(result).toEqual(
          params.condition
            ? { onTrue: params.trueResult }
            : { onFalse: params.falseResult }
        );
      });
    });
  });

  describe("flowher::Wait", () => {
    it("should resolve after specified delay with given result", async () => {
      const params = {
        ms: 100,
        result: "test result",
      };
      const startTime = Date.now();
      const result = await ResolversRegistry["flowher::Wait"](params);
      const endTime = Date.now();

      expect(result).toEqual({ result: "test result" });
      expect(endTime - startTime).toBeGreaterThanOrEqual(100);
    });

    it("should handle different result value types", async () => {
      const testCases = [
        { ms: 50, result: 123 },
        { ms: 50, result: { prop: "value" } },
        { ms: 50, result: ["item"] },
        { ms: 50, result: true },
      ];

      for (const params of testCases) {
        const result = await ResolversRegistry["flowher::Wait"](params);
        expect(result).toEqual({ result: params.result });
      }
    });

    it("should resolve immediately with 0ms delay", async () => {
      const params = {
        ms: 0,
        result: "immediate",
      };
      const result = await ResolversRegistry["flowher::Wait"](params);
      expect(result).toEqual({ result: "immediate" });
    });
  });
});
