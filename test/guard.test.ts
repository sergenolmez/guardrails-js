import { describe, it, expect } from "vitest";
import { guard, GuardError } from "../src";

describe("guard", () => {
    it("returns value when valid", () => {
        expect(guard("hello", { type: "string" })).toBe("hello");
    });

    it("throws when required value is missing", () => {
        expect(() => guard(undefined, { required: true })).toThrow(GuardError);
    });

    it("returns default when value is missing", () => {
        expect(guard(undefined, { default: 123 })).toBe(123);
    });

    it("throws on wrong type", () => {
        expect(() => guard("123", { type: "number" })).toThrow(GuardError);
    });

    it("passes custom validation", () => {
        expect(
            guard("abcd", {
                type: "string",
                custom: (v) => v.length > 2
            })
        ).toBe("abcd");
    });

    it("fails custom validation", () => {
        expect(() =>
            guard("a", {
                type: "string",
                custom: (v) => v.length > 2
            })
        ).toThrow(GuardError);
    });

    describe("label", () => {
        it("prepends label to error message", () => {
            expect(() => guard(undefined, { required: true, label: "user.name" })).toThrowError(
                "[user.name]: Expected required value, got undefined"
            );
        });

        it("works with custom error message", () => {
            expect(() => guard("hello", { type: "number", label: "age", message: "Age must be a number" })).toThrowError(
                "[age]: Age must be a number"
            );
        });
    });

    describe("oneOf", () => {
        it("returns value when in allowed list", () => {
            expect(guard("active", { oneOf: ["active", "inactive"] })).toBe("active");
        });

        it("throws when not in allowed list", () => {
            expect(() => guard("pending", { oneOf: ["active", "inactive"] })).toThrowError(
                "Value must be one of [active, inactive], got pending"
            );
        });
    });

    describe("shorthands & bounds", () => {
        describe("guard.string", () => {
            it("validates string type automatically", () => {
                expect(guard.string("test")).toBe("test");
                expect(() => guard.string(123)).toThrowError(/Expected type string/);
            });

            it("validates minLength", () => {
                expect(guard.string("abc", { minLength: 2 })).toBe("abc");
                expect(() => guard.string("a", { minLength: 2 })).toThrowError(/Expected length to be at least 2/);
            });

            it("validates maxLength", () => {
                expect(guard.string("abc", { maxLength: 4 })).toBe("abc");
                expect(() => guard.string("abcde", { maxLength: 4 })).toThrowError(/Expected length to be at most 4/);
            });

            it("validates regex matches", () => {
                expect(guard.string("test@example.com", { matches: /@/ })).toBe("test@example.com");
                expect(() => guard.string("test", { matches: /@/ })).toThrowError(/Value does not match the required pattern/);
            });
        });

        describe("guard.number", () => {
            it("validates number type automatically", () => {
                expect(guard.number(42)).toBe(42);
                expect(() => guard.number("42")).toThrowError(/Expected type number/);
            });

            it("validates min", () => {
                expect(guard.number(10, { min: 5 })).toBe(10);
                expect(() => guard.number(3, { min: 5 })).toThrowError(/Expected value to be at least 5/);
            });

            it("validates max", () => {
                expect(guard.number(10, { max: 15 })).toBe(10);
                expect(() => guard.number(20, { max: 15 })).toThrowError(/Expected value to be at most 15/);
            });
        });

        describe("guard.array", () => {
            it("validates array type automatically", () => {
                expect(guard.array([1, 2])).toEqual([1, 2]);
                expect(() => guard.array({})).toThrowError(/Expected type array/);
            });

            it("validates array length", () => {
                expect(guard.array([1, 2], { minLength: 1, maxLength: 3 })).toEqual([1, 2]);
                expect(() => guard.array([], { minLength: 1 })).toThrowError(/Expected length to be at least 1/);
            });
        });

        describe("guard.boolean", () => {
            it("validates boolean", () => {
                expect(guard.boolean(true)).toBe(true);
                expect(() => guard.boolean(1)).toThrowError(/Expected type boolean/);
            });
        });

        describe("guard.object", () => {
            it("validates object", () => {
                expect(guard.object({ a: 1 })).toEqual({ a: 1 });
                // 123 is a number, so it should throw
                expect(() => guard.object(123)).toThrowError(/Expected type object, got number/);
            });
        });
    });
});