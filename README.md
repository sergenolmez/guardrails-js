<div align="center">
  <h1>🛡️ guardrails-js</h1>
  <p><strong>Strict, inline runtime validation for JavaScript & TypeScript</strong></p>

  [![npm version](https://img.shields.io/npm/v/guardrails-js.svg?style=flat-square)](https://www.npmjs.com/package/guardrails-js)
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://github.com/sergenolmez/guardrails-js/blob/main/LICENSE)
  [![Tests](https://img.shields.io/badge/tests-30%20passed-brightgreen?style=flat-square)](#running-tests)
  [![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen?style=flat-square)](#)
</div>

<br />

**guardrails-js** is a zero-dependency, highly performant runtime validation utility for JavaScript and TypeScript. It enforces data integrity at runtime with strict type checks, boundary validation, and contextual error reporting — all without the boilerplate of deeply nested conditionals.

```typescript
import { guard } from "guardrails-js";

const email = guard.string(input.email, {
    required: true,
    matches: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    label: "user.email"
});
```

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **Zero Dependencies** | No external packages. Tiny footprint for any bundle. |
| **Type-Safe** | Full TypeScript generics — return types match your expectations automatically. |
| **Boundary Validation** | Enforce `min`, `max`, `minLength`, `maxLength`, and `RegExp` patterns. |
| **NaN & Infinity Protection** | Automatically rejects `NaN`, `Infinity`, and `-Infinity` for number validations. |
| **Contextual Errors** | Attach `label` paths to errors for instant traceability in nested data structures. |
| **Safe Defaults** | Provide fallback values for missing data with the `default` option. |
| **Custom Validators** | Supply your own logic with `custom` — exceptions are automatically wrapped. |
| **Enum Constraints** | Restrict values to a specific set with `oneOf`. |
| **Universal** | Ships as ESM + CJS. Works in Node.js, Bun, Deno, and all modern browsers. |

---

## 📦 Installation

```bash
npm install guardrails-js
```

```bash
# or with your preferred package manager
yarn add guardrails-js
pnpm add guardrails-js
```

---

## 🚀 Quick Start

### Basic Usage

```typescript
import { guard } from "guardrails-js";

// Required value — throws if missing
const name = guard(input.name, { required: true, type: "string" });

// Default fallback — returns "guest" if value is null/undefined
const role = guard(input.role, { default: "guest" });

// Custom validator
const even = guard(input.count, {
    type: "number",
    custom: (v) => v % 2 === 0,
    message: "Value must be an even number"
});
```

### Type-Specific Shorthands

Type shorthands automatically enforce the correct type and expose relevant options in TypeScript autocompletion:

```typescript
// String validation with length & pattern
const password = guard.string(req.body.password, {
    required: true,
    minLength: 8,
    maxLength: 128,
    matches: /[A-Z]/,
    label: "auth.password"
});

// Number validation with bounds
const age = guard.number(req.body.age, {
    min: 18,
    max: 120,
    message: "Age is out of valid range."
});

// Array validation with size constraints
const tags = guard.array(req.body.tags, {
    minLength: 1,
    maxLength: 10,
    label: "post.tags"
});

// Boolean & Object validation
const active = guard.boolean(req.body.active, { required: true });
const meta   = guard.object(req.body.metadata, { default: {} });
```

### Enum Constraints

```typescript
const tier = guard.string(input.tier, {
    oneOf: ["free", "pro", "enterprise"],
    default: "free"
});
```

---

## 📖 API Reference

### `guard<T>(value, options?): T`

The core validation function. Returns the `value` unchanged if all constraints pass.

**Behavior with missing values** (`null` or `undefined`):
1. If `default` is provided → returns the default value
2. If `required: true` → throws `GuardError`
3. Otherwise → returns the original `null`/`undefined`

---

### Universal Options (`GuardOptions<T>`)

Available on `guard()` and all type-specific shorthands.

| Option | Type | Description |
|--------|------|-------------|
| `required` | `boolean` | Throw if value is `null` or `undefined`. |
| `type` | `GuardType` | Expected type: `"string"`, `"number"`, `"boolean"`, `"object"`, `"array"`. |
| `default` | `T` | Fallback value if input is missing. Takes priority over `required`. |
| `oneOf` | `T[]` | Value must strictly match one of the provided items. |
| `custom` | `(value: T) => boolean` | Custom validation function. Must return `true` to pass. Thrown exceptions are automatically wrapped in `GuardError`. |
| `label` | `string` | Context path prepended to error messages (e.g., `[user.email]: ...`). |
| `message` | `string` | Override the default error message. |

---

### Type-Specific Methods

#### `guard.string(value, options?)`

Automatically sets `type: "string"`. Exposes additional options:

| Option | Type | Description |
|--------|------|-------------|
| `minLength` | `number` | Minimum character count. |
| `maxLength` | `number` | Maximum character count. |
| `matches` | `RegExp` | Value must match the given regular expression. |

#### `guard.number(value, options?)`

Automatically sets `type: "number"`. Rejects `NaN` and `Infinity` values. Exposes:

| Option | Type | Description |
|--------|------|-------------|
| `min` | `number` | Minimum allowed value (inclusive). |
| `max` | `number` | Maximum allowed value (inclusive). |

#### `guard.array(value, options?)`

Automatically sets `type: "array"`. Exposes:

| Option | Type | Description |
|--------|------|-------------|
| `minLength` | `number` | Minimum array size. |
| `maxLength` | `number` | Maximum array size. |

#### `guard.boolean(value, options?)`

Automatically sets `type: "boolean"`. No additional options.

#### `guard.object(value, options?)`

Automatically sets `type: "object"`. No additional options.

---

## 🔍 Error Handling

All validation failures throw a `GuardError` (extends `Error`). The `label` option adds context paths for easy debugging:

```typescript
import { guard, GuardError } from "guardrails-js";

try {
    guard.number(undefined, { required: true, label: "config.port" });
} catch (err) {
    if (err instanceof GuardError) {
        console.error(err.message);
        // → [config.port]: Expected required value, got undefined
    }
}
```

### Error Messages by Validation Type

| Validation | Example Message |
|------------|----------------|
| Missing required | `Expected required value, got undefined` |
| Wrong type | `Expected type string, got number` |
| Not in oneOf | `Value must be one of [a, b], got c` |
| Below minLength | `Expected length to be at least 8, got 3` |
| Above max | `Expected value to be at most 100, got 150` |
| NaN value | `Expected a valid number, got NaN` |
| Infinite value | `Expected a finite number, got Infinity` |
| Regex mismatch | `Value does not match the required pattern` |
| Custom failure | `Custom validation failed` |

---

## 🧪 Real-World Examples

### Express.js Request Validation

```typescript
import { guard, GuardError } from "guardrails-js";

app.post("/api/users", (req, res) => {
    try {
        const user = {
            name:  guard.string(req.body.name,  { required: true, minLength: 2, label: "body.name" }),
            email: guard.string(req.body.email, { required: true, matches: /@/, label: "body.email" }),
            age:   guard.number(req.body.age,   { min: 13, max: 120, label: "body.age" }),
            role:  guard.string(req.body.role,  { oneOf: ["user", "admin"], default: "user" }),
        };

        // user is fully validated and typed here
        createUser(user);
        res.status(201).json(user);
    } catch (err) {
        if (err instanceof GuardError) {
            res.status(400).json({ error: err.message });
        }
    }
});
```

### Environment Variable Validation

```typescript
const config = {
    port:     guard.number(Number(process.env.PORT),     { min: 1, max: 65535, default: 3000 }),
    dbUrl:    guard.string(process.env.DATABASE_URL,     { required: true, label: "env.DATABASE_URL" }),
    logLevel: guard.string(process.env.LOG_LEVEL,        { oneOf: ["debug", "info", "warn", "error"], default: "info" }),
    workers:  guard.number(Number(process.env.WORKERS),  { min: 1, max: 16, default: 4 }),
};
```

### Nested Object Validation

```typescript
function validateAddress(data: unknown) {
    const obj = guard.object(data, { required: true, label: "address" });
    
    return {
        street: guard.string(obj.street, { required: true, label: "address.street" }),
        city:   guard.string(obj.city,   { required: true, label: "address.city" }),
        zip:    guard.string(obj.zip,    { required: true, matches: /^\d{5}$/, label: "address.zip" }),
    };
}
```

---

## 🧪 Running Tests

The library is tested with [Vitest](https://vitest.dev/) — 30 tests covering core validation, type shorthands, boundary checks, and edge cases.

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm run dev
```

---

## 📁 Project Structure

```
guardrails-js/
├── src/
│   ├── index.ts       # Public API exports
│   ├── guard.ts       # Core validation logic
│   ├── types.ts       # TypeScript type definitions
│   ├── errors.ts      # GuardError class
│   └── utils.ts       # Internal utilities
├── test/
│   └── guard.test.ts  # Test suite (30 tests)
├── dist/              # Compiled output (ESM + CJS + .d.ts)
├── package.json
├── tsconfig.json
└── LICENSE
```

---

## 📋 Compatibility

| Platform | Support |
|----------|---------|
| Node.js | ≥ 16 |
| Bun | ✅ |
| Deno | ✅ |
| Modern Browsers | ✅ |
| TypeScript | ≥ 5.0 |

**Module Formats:** ESM (`import`) and CJS (`require`) with full type declarations.

---

## 📄 License

[MIT](LICENSE) © Sergen Olmez
