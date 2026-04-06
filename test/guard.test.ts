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
});