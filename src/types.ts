export type GuardType =
    | "string"
    | "number"
    | "boolean"
    | "object"
    | "array"
    | "function";

export interface GuardOptions<T = unknown> {
    required?: boolean;
    type?: GuardType;
    default?: T;
    custom?: (value: T) => boolean;
    message?: string;
}