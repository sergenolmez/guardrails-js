export type GuardType =
    | "string"
    | "number"
    | "boolean"
    | "object"
    | "array"
    | "function";

export interface BaseGuardOptions<T = unknown> {
    required?: boolean;
    type?: GuardType;
    default?: T;
    custom?: (value: T) => boolean;
    message?: string;
    label?: string;
    oneOf?: T[];
}

export interface StringGuardOptions<T = string> extends BaseGuardOptions<T> {
    type?: "string";
    minLength?: number;
    maxLength?: number;
    matches?: RegExp;
}

export interface NumberGuardOptions<T = number> extends BaseGuardOptions<T> {
    type?: "number";
    min?: number;
    max?: number;
}

export interface ArrayGuardOptions<T = unknown[]> extends BaseGuardOptions<T> {
    type?: "array";
    minLength?: number;
    maxLength?: number;
}

export interface BooleanGuardOptions<T = boolean> extends BaseGuardOptions<T> {
    type?: "boolean";
}

export interface ObjectGuardOptions<T = Record<string, unknown>> extends BaseGuardOptions<T> {
    type?: "object";
}

export interface GuardOptions<T = unknown> extends BaseGuardOptions<T> {
    minLength?: number;
    maxLength?: number;
    matches?: RegExp;
    min?: number;
    max?: number;
}