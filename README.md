<div align="center">
  <h1>guardrails-js</h1>
  <p><strong>Strict, inline runtime validation for JavaScript and TypeScript</strong></p>

  [![npm version](https://img.shields.io/npm/v/guardrails-js.svg?style=flat-square)](https://www.npmjs.com/package/guardrails-js)
  [![License](https://img.shields.io/npm/l/guardrails-js.svg?style=flat-square)](https://github.com/sergenolmez/guardrails-js/blob/main/LICENSE)
</div>

<br />

`guardrails-js` is a zero-dependency, highly performant utility designed to enforce runtime data integrity. It provides a robust defense against missing values and type discrepancies while maintaining seamless integration with TypeScript's type system. 

By eliminating the need for deeply nested conditional logic, it allows you to write cleaner, more predictable code.

## Key Features

- **Zero Dependencies:** Microscopic footprint with no external dependencies.
- **Strict Bounds:** Granular validation for strings, numbers, and arrays (min, max, length, regex).
- **Type Safety:** Intelligent TypeScript generics ensure the return type matches your expectations.
- **Contextual Errors:** Built-in support for path labeling to trace validation failures back to their source.
- **Fail-Safe Fallbacks:** Soft-handle missing data by defining graceful default values.
- **Universal Compatibility:** Distributed as ESM and CJS; runs seamlessly in Node.js and the browser.

## Installation

```bash
npm install guardrails-js
```

## Quick Start

You can use the core `guard()` function for standard validations, or leverage the type-specific aliases for enhanced auto-complete and targeted options.

```typescript
import { guard } from "guardrails-js";

// Type-specific validation with boundaries
const password = guard.string(req.body.password, { 
    required: true, 
    minLength: 8,
    maxLength: 32,
    matches: /[A-Z]/,
    label: "user.auth.password" 
});

// Value constraint validations
const tier = guard.string(req.body.tier, {
    oneOf: ["free", "premium", "enterprise"],
    default: "free"
});

// Numeric limits
const age = guard.number(req.body.age, { 
    min: 18, 
    max: 99, 
    message: "User must be an adult." 
});
```

## API Reference

### Core Method: `guard<T>(value: T, options: GuardOptions)`

Returns the `value` if it passes constraints. If the value is missing (`null` or `undefined`) and no `default` is provided, it either safely returns the original missing value or throws a `GuardError` when `required: true` is set.

#### Universal Options

These options apply to all validation instances.

| Property   | Type                    | Description |
| ---------- | ----------------------- | ----------- |
| `required` | `boolean`               | Throws an error if the value is `undefined` or `null`. |
| `type`     | `GuardType`             | Expected primitive type (`"string"`, `"number"`, `"boolean"`, `"object"`, `"array"`). |
| `default`  | `T`                     | Fallback value returned if the input is missing. Prevents `required` exceptions. |
| `oneOf`    | `T[]`                   | Ensures the value strictly matches one of the specified array items. |
| `custom`   | `(value: T) => boolean` | Custom logic evaluator. Must return `true` to pass validation. |
| `label`    | `string`                | Prepends a context path to exception messages (e.g., `[user.email]: error`). |
| `message`  | `string`                | Overrides the default structural error message. |

---

### Type-Specific Methods

`guardrails-js` includes convenient static methods for specific data types. These methods automatically enforce the type constraint and expose specialized validation options in TypeScript.

#### `guard.string(value, options)`
Exposes `StringGuardOptions`.

| Property    | Type      | Description |
| ----------- | --------- | ----------- |
| `minLength` | `number`  | Minimum required string length. |
| `maxLength` | `number`  | Maximum allowed string length. |
| `matches`   | `RegExp`  | Validates the string against a regular expression. |

#### `guard.number(value, options)`
Exposes `NumberGuardOptions`.

| Property | Type      | Description |
| -------- | --------- | ----------- |
| `min`    | `number`  | Minimum allowed numeric value. |
| `max`    | `number`  | Maximum allowed numeric value. |

#### `guard.array(value, options)`
Exposes `ArrayGuardOptions`.

| Property    | Type      | Description |
| ----------- | --------- | ----------- |
| `minLength` | `number`  | Minimum required array size. |
| `maxLength` | `number`  | Maximum allowed array size. |

#### `guard.object(value, options)` & `guard.boolean(value, options)`
Provides shorthand property extraction and strict shape guarantees without additional properties.

## Error Handling

Validation failures throw a `GuardError`. Incorporating the `label` property attaches exact key paths to the error class, vastly simplifying debugging processes within deeply nested objects.

```typescript
try {
    guard.number(undefined, { required: true, label: "config.port" });
} catch (err) {
    console.error(err.message); 
    // Output: [config.port]: Expected required value, got undefined
}
```

## Running Tests

The library is comprehensively tested with Vitest.

```bash
npm install
npm test
```

## License

[MIT](LICENSE)
