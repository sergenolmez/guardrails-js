import { GuardError } from "./errors";
import { GuardOptions } from "./types";
import { getType } from "./utils";

export function guard<T>(value: T, options: GuardOptions<T> = {}): T {
    const { required, type, default: defaultValue, custom, message } = options;

    const isMissing = value === undefined || value === null;

    if (isMissing) {
        if (defaultValue !== undefined) {
            return defaultValue;
        }

        if (required) {
            throw new GuardError(message || `Expected required value, got ${value}`);
        }

        return value;
    }

    if (type) {
        const actualType = getType(value);

        if (actualType !== type) {
            throw new GuardError(
                message || `Expected type ${type}, got ${actualType}`
            );
        }
    }

    if (custom && !custom(value)) {
        throw new GuardError(message || `Custom validation failed`);
    }

    return value;
}