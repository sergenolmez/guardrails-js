<div align="center">
  <h1>🛡️ guardrails-js</h1>
  <p><strong>Inline runtime validation for JavaScript and TypeScript</strong></p>

  [![npm version](https://img.shields.io/npm/v/guardrails-js.svg?style=flat-square)](https://www.npmjs.com/package/guardrails-js)
  [![License](https://img.shields.io/npm/l/guardrails-js.svg?style=flat-square)](https://github.com/sergenolmez/guardrails-js/blob/main/LICENSE)
</div>

<br />

`guardrails-js` is a zero-dependency, microscopic utility to safely validate variables at runtime. Say goodbye to deep nested `if-else` blocks and missing value crashes, while preserving full TypeScript support.

## ✨ Features

- **Zero Dependencies:** Extremely lightweight and fast.
- **Fail-Safe:** Provide default values gracefully when data goes missing.
- **Strict Typing:** Out-of-the-box TypeScript support ensures type safety on the return type.
- **Customizable:** Build complex validations specific to your unique use-case seamlessly.
- **Works Everywhere:** Supports ESM, CJS and works perfectly in both browser and Node.js environments.

## 📦 Installation

```bash
npm install guardrails-js
```

_Or using your favorite package manager:_
```bash
yarn add guardrails-js
# or
pnpm add guardrails-js
```

## 🚀 Quick Start

Wrap any variable with `guard` to make sure it matches your exact expectations before it hits your business logic. 

```typescript
import { guard } from "guardrails-js";

// Basic Type Enforcement
const title = guard(data.title, {
  required: true,
  type: "string",
  message: "Title must be provided as a string!"
});

// Fallback to Defaults
const port = guard(process.env.PORT, {
  type: "number",
  default: 3000
});
```

## 🛠️ API Reference

### `guard<T>(value, options)`

Returns the `value` if it passes validation, otherwise either throws a `GuardError` or returns the defined `default`.

#### Options

| Property   | Type                          | Description                                                                                       |
| ---------- | ----------------------------- | ------------------------------------------------------------------------------------------------- |
| `required` | `boolean`                     | Throws an error if the value is `undefined` or `null`.                                            |
| `type`     | `GuardType`                   | The expected type of the value (`"string"`, `"number"`, `"boolean"`, `"object"`, `"array"`, `"function"`). |
| `default`  | `T`                           | The fallback value to return if the input value is missing. Prevents throwing a required error.   |
| `custom`   | `(value: T) => boolean`       | A custom validation callback logic. Must return `true` to pass.                                   |
| `message`  | `string`                      | A custom error message thrown when validation fails.                                              |

### 🎯 Custom Validations

Need something more specific? The `custom` property allows you to define infinite logic on the fly.

```typescript
const age = guard(userInput.age, {
  type: "number",
  required: true,
  custom: (val) => val >= 18,
  message: "User must be at least 18 years old!"
});
```

## 🏎️ Running Tests

```bash
# Install dependencies
npm install 

# Run Vitest test suite
npm test
```

## 📄 License

[MIT](LICENSE)
