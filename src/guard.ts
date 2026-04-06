import { GuardError } from "./errors";
import { 
    GuardOptions, 
    StringGuardOptions, 
    NumberGuardOptions, 
    ArrayGuardOptions, 
    BooleanGuardOptions, 
    ObjectGuardOptions 
} from "./types";
import { getType } from "./utils";

export function guard<T>(value: T, options: GuardOptions<T> = {}): T {
    const { 
        required, type, default: defaultValue, custom, message, 
        label, oneOf, minLength, maxLength, min, max, matches
    } = options;

    const isMissing = value === undefined || value === null;

    if (isMissing) {
        if (defaultValue !== undefined) {
            return defaultValue;
        }

        if (required) {
            const msg = message || `Expected required value, got ${value}`;
            throw new GuardError(label ? `[${label}]: ${msg}` : msg);
        }

        return value;
    }

    if (type) {
        const actualType = getType(value);

        if (actualType !== type) {
            const msg = message || `Expected type ${type}, got ${actualType}`;
            throw new GuardError(label ? `[${label}]: ${msg}` : msg);
        }
    }

    if (oneOf && !oneOf.includes(value)) {
        const msg = message || `Value must be one of [${oneOf.join(", ")}], got ${value}`;
        throw new GuardError(label ? `[${label}]: ${msg}` : msg);
    }
    
    // String & Array Length Validation
    if (typeof value === "string" || Array.isArray(value)) {
        if (minLength !== undefined && value.length < minLength) {
            const msg = message || `Expected length to be at least ${minLength}, got ${value.length}`;
            throw new GuardError(label ? `[${label}]: ${msg}` : msg);
        }
        if (maxLength !== undefined && value.length > maxLength) {
            const msg = message || `Expected length to be at most ${maxLength}, got ${value.length}`;
            throw new GuardError(label ? `[${label}]: ${msg}` : msg);
        }
    }

    // Number Bounds Validation
    if (typeof value === "number") {
        if (Number.isNaN(value)) {
            const msg = message || `Expected a valid number, got NaN`;
            throw new GuardError(label ? `[${label}]: ${msg}` : msg);
        }
        if (!Number.isFinite(value)) {
            const msg = message || `Expected a finite number, got ${value}`;
            throw new GuardError(label ? `[${label}]: ${msg}` : msg);
        }
        if (min !== undefined && value < min) {
            const msg = message || `Expected value to be at least ${min}, got ${value}`;
            throw new GuardError(label ? `[${label}]: ${msg}` : msg);
        }
        if (max !== undefined && value > max) {
            const msg = message || `Expected value to be at most ${max}, got ${value}`;
            throw new GuardError(label ? `[${label}]: ${msg}` : msg);
        }
    }

    // Regex Validation
    if (typeof value === "string" && matches instanceof RegExp) {
        if (!matches.test(value)) {
            const msg = message || `Value does not match the required pattern`;
            throw new GuardError(label ? `[${label}]: ${msg}` : msg);
        }
    }

    if (custom) {
        try {
            if (!custom(value)) {
                const msg = message || `Custom validation failed`;
                throw new GuardError(label ? `[${label}]: ${msg}` : msg);
            }
        } catch (err) {
            if (err instanceof GuardError) throw err;
            const msg = message || `Custom validation failed: ${(err as Error).message}`;
            throw new GuardError(label ? `[${label}]: ${msg}` : msg);
        }
    }

    return value;
}

guard.string = function <T = string>(value: unknown, options: StringGuardOptions<T> = {}): T {
    return guard(value as any, { ...options, type: "string" }) as T;
};

guard.number = function <T = number>(value: unknown, options: NumberGuardOptions<T> = {}): T {
    return guard(value as any, { ...options, type: "number" }) as T;
};

guard.array = function <T = unknown[]>(value: unknown, options: ArrayGuardOptions<T> = {}): T {
    return guard(value as any, { ...options, type: "array" }) as T;
};

guard.boolean = function <T = boolean>(value: unknown, options: BooleanGuardOptions<T> = {}): T {
    return guard(value as any, { ...options, type: "boolean" }) as T;
};

guard.object = function <T = Record<string, unknown>>(value: unknown, options: ObjectGuardOptions<T> = {}): T {
    return guard(value as any, { ...options, type: "object" }) as T;
};