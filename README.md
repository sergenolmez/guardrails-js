<div align="center">
  <h1>🛡️ guardrails-js</h1>
  <p><strong>Stop writing defensive <code>if</code> statements.<br/>Validate any value in one line.</strong></p>

  <br />

  [![npm version](https://img.shields.io/npm/v/guardrails-js.svg?style=flat-square)](https://www.npmjs.com/package/guardrails-js)
  [![bundle size](https://img.shields.io/bundlephobia/minzip/guardrails-js?style=flat-square&label=size)](https://bundlephobia.com/package/guardrails-js)
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
  [![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
</div>

<br />

You've written this a thousand times:

```javascript
if (value === undefined || value === null) {
    throw new Error("value is required");
}
if (typeof value !== "string") {
    throw new Error("value must be a string");
}
if (value.length < 3) {
    throw new Error("value is too short");
}
```

**With guardrails-js, it's one line:**

```typescript
const name = guard.string(input.name, { required: true, minLength: 3 });
```

That's it. No schemas, no decorators, no build step. Just a function call that validates and returns — or throws a clear, traceable error.

---

## Why not Zod, Joi, or Yup?

Those are **schema builders**. You define a shape, then parse data against it. They're great for form validation, API request bodies, and config files.

**guardrails-js is different.** It's an **inline guard** — you wrap a single value, right where you use it. No schema definition, no `.parse()` step, no separate validation layer.

| | Schema Libraries (Zod, Joi) | guardrails-js |
|---|---|---|
| **Use case** | Validate a whole object shape | Guard a single value |
| **Where it runs** | Separate validation layer | Inline, where you use the value |
| **Setup** | Define schema → parse → handle | One function call |
| **Bundle size** | 10–50 KB | < 2 KB |
| **Learning curve** | Moderate | Zero |

**Use Zod** when you need to validate a complex request body against a full schema.  
**Use guardrails-js** when you need to make sure `port` is a valid number on line 12 of your config loader.

They solve different problems. You can use both.

---

## Install

```bash
npm install guardrails-js
```

---

## Usage

### The basics

```typescript
import { guard } from "guardrails-js";

// Require a value — throws if null or undefined
const id = guard(input.id, { required: true });

// Enforce a type
const name = guard(input.name, { type: "string" });

// Fall back gracefully
const role = guard(input.role, { default: "viewer" });
```

### Type shorthands

Type-specific methods enforce the type automatically and give you better autocomplete in TypeScript:

```typescript
// Strings — with length and pattern constraints
const email = guard.string(input.email, {
    required: true,
    matches: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    label: "user.email"
});

const password = guard.string(input.password, {
    minLength: 8,
    maxLength: 128
});

// Numbers — with bounds, NaN and Infinity rejected automatically
const port = guard.number(rawPort, { min: 1, max: 65535, default: 3000 });

// Arrays — with size constraints
const tags = guard.array(input.tags, { minLength: 1, maxLength: 20 });

// Booleans and objects
const verbose = guard.boolean(flags.verbose, { default: false });
const headers = guard.object(req.headers, { required: true });
```

### Restrict to a set of values

```typescript
const env = guard.string(process.env.NODE_ENV, {
    oneOf: ["development", "staging", "production"],
    default: "development"
});
```

### Custom validators

```typescript
const even = guard.number(input.count, {
    custom: (n) => n % 2 === 0,
    message: "Must be an even number"
});
```

If your custom function throws, the error is automatically caught and wrapped in a `GuardError` — so your error contract stays consistent.

### Labels for debugging

The `label` option prepends a context path to error messages. This is essential when validating nested data:

```typescript
guard.string(data.user.name, { required: true, label: "user.name" });
// Error: [user.name]: Expected required value, got undefined

guard.number(config.retries, { min: 0, label: "config.retries" });
// Error: [config.retries]: Expected value to be at least 0, got -1
```

---

## Real-world patterns

### Validate environment variables at startup

```typescript
import { guard } from "guardrails-js";

const config = {
    port:     guard.number(Number(process.env.PORT),     { min: 1, max: 65535, default: 3000 }),
    dbUrl:    guard.string(process.env.DATABASE_URL,     { required: true, label: "env.DATABASE_URL" }),
    logLevel: guard.string(process.env.LOG_LEVEL,        { oneOf: ["debug", "info", "warn", "error"], default: "info" }),
    workers:  guard.number(Number(process.env.WORKERS),  { min: 1, max: 16, default: 4 }),
};
// App crashes immediately on misconfiguration — not 5 minutes later on a random request
```

### Guard Express.js request parameters

```typescript
import { guard, GuardError } from "guardrails-js";

app.post("/api/users", (req, res) => {
    try {
        const user = {
            name:  guard.string(req.body.name,  { required: true, minLength: 2, label: "body.name" }),
            email: guard.string(req.body.email, { required: true, matches: /@/, label: "body.email" }),
            age:   guard.number(req.body.age,   { min: 13, max: 120, label: "body.age" }),
            role:  guard.string(req.body.role,   { oneOf: ["user", "admin"], default: "user" }),
        };

        createUser(user);
        res.status(201).json(user);
    } catch (err) {
        if (err instanceof GuardError) {
            return res.status(400).json({ error: err.message });
        }
        throw err;
    }
});
```

### Harden third-party API responses

```typescript
function parseWeatherResponse(data: unknown) {
    const obj = guard.object(data, { required: true, label: "api.response" });

    return {
        temp:   guard.number(obj.main?.temp,    { label: "response.temp" }),
        city:   guard.string(obj.name,          { required: true, label: "response.city" }),
        coords: guard.array(obj.coord?.values,  { minLength: 2, maxLength: 2, label: "response.coords" }),
    };
}
```

---

## API Reference

### `guard<T>(value, options?): T`

Returns the value if all constraints pass.

**When value is `null` or `undefined`:**
1. Returns `default` if provided
2. Throws `GuardError` if `required: true`
3. Returns the original value otherwise

### Options

| Option | Type | Description |
|--------|------|-------------|
| `required` | `boolean` | Throw if value is `null` or `undefined` |
| `type` | `GuardType` | Expected type: `"string"` `"number"` `"boolean"` `"object"` `"array"` |
| `default` | `T` | Fallback when value is missing — takes priority over `required` |
| `oneOf` | `T[]` | Value must be one of these |
| `custom` | `(v: T) => boolean` | Custom validation — return `true` to pass |
| `label` | `string` | Context path prepended to errors (e.g. `[user.email]: ...`) |
| `message` | `string` | Override the default error message |

### Type-specific options

| Method | Extra options |
|--------|--------------|
| `guard.string()` | `minLength`, `maxLength`, `matches` (RegExp) |
| `guard.number()` | `min`, `max` — also rejects `NaN` and `Infinity` |
| `guard.array()` | `minLength`, `maxLength` |
| `guard.boolean()` | — |
| `guard.object()` | — |

### Error messages

| Situation | Message |
|-----------|---------|
| Missing required | `Expected required value, got undefined` |
| Wrong type | `Expected type string, got number` |
| Not in oneOf | `Value must be one of [a, b], got c` |
| String too short | `Expected length to be at least 8, got 3` |
| Number out of range | `Expected value to be at most 100, got 150` |
| NaN | `Expected a valid number, got NaN` |
| Infinite | `Expected a finite number, got Infinity` |
| Regex mismatch | `Value does not match the required pattern` |
| Custom failed | `Custom validation failed` |

All messages are prefixed with `[label]:` when a label is provided.

---

## Error handling

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

---

## Compatibility

Works everywhere. Ships as both ESM and CJS with full TypeScript declarations.

- **Node.js** ≥ 16
- **Bun**, **Deno** ✓
- **Modern browsers** ✓
- **TypeScript** ≥ 5.0
- **Zero dependencies**

---

## Tests

30 tests covering core validation, type shorthands, boundary checks, and edge cases.

```bash
npm test
```

---

## License

[MIT](LICENSE) © Sergen Olmez
