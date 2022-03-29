# Find Up <!-- omit in toc -->

[![npm](https://img.shields.io/npm/v/@dozerg/find-up.svg)](https://www.npmjs.com/package/@dozerg/find-up)
![Downloads](https://img.shields.io/npm/dm/@dozerg/find-up.svg)
[![Build Status](https://github.com/daidodo/find-up/actions/workflows/node.js.yml/badge.svg)](https://github.com/daidodo/find-up/actions)

Find a file or directory by walking up parent directories.

# Table of contents <!-- omit in toc -->

- [Install](#install)
- [APIs](#apis)
  - [`findUp`](#findup)
  - [`findUp.gen`](#findupgen)
  - [`findUp.sync`](#findupsync)
- [Options](#options)
- [License](#license)

# Install

```
npm i @dozerg/find-up
```

# APIs

## `findUp`

Find file(s) asynchrously and return a promise.

- `findUp(name: string, options?: Options) => Promise<string[]>`

```ts
import findUp from '@dozerg/find-up';

findUp('package.json').then((results: string[]) => {
  if(results.length === 0) {
    // No files found.
  } else {
    // Found 'package.json' files in results.
    // The results are in the order they were found,
    // i.e. from the deepest to the root.
  }
})

// Find the first 'package.json' starting from specific directory.
const [package] = await findUp('package.json', { stopAtLimit: 1, cwd: 'path/to/start' });
```

- `findUp(names: string[], options?: Options) => Promise<string[]>`

```ts
// Find the first supported eslintrc file.
const [eslintrc] = await findUp(['.eslintrc.yaml', '.eslintrc.json'], { stopAtLimit: 1 })
// If both '.eslintrc.yaml' and '.eslintrc.json' are found in a directory,
// '.eslintrc.yaml' will be returned because it's in front of the other in the array.
```

- `findUp(matcher: Function, options?: Options) => Promise<string[]>`

`matcher` is of type `(directory: string) => string | undefined`. It'll be called with every directory in the search, and return a string or `undefined`. If a string is returned, a file path will be checked. If the string is relative, the file path will be the join of `directory` and returned string. If the string is absolute, the file path will be the string.

When in async mode, `matcher` could be an async or promise-returning function.

```ts
const matcher = (directory: string) => {
  if(condition_1) {
    return undefined;
    // Nothing to check
  } else if (condition_2) {
    return '/absolute/path/to/file';
    // Will check '/absolute/path/to/file'
  } else
    return 'relative/path/to/file';
    // Will check '${directory}/relative/path/to/file'
}

const results = await findUp(matcher);
```

## `findUp.gen`

Find file(s) asynchrously and return an async generator.

- `findUp.gen(name: string, options?: Options) => AsyncGenerator<string>`

```ts
for await (const file of findUp.gen('my.config')) {
  // Found 'my.config' file.
}
```

- `findUp.gen(names: string[], options?: Options) => AsyncGenerator<string>`

```ts
for await (const file of findUp.gen(['my.json', 'my.yaml'])) {
  // Found either 'my.json' or 'my.yaml' file.
  // If both are found in a directory, 'my.json' will be returned
  // because it's in front of the other in the array.
}
```

- `findUp.gen(matcher: Function, options?: Options) => AsyncGenerator<string>`

```ts
const matcher = (dir: string) => 'my.config';

for await (const file of findUp.gen(matcher)) {
  // Found 'my.config' file.
}
```

## `findUp.sync`

Find file(s) synchrously.

- `findUp.sync(name: string, options?: Options) => string[]`

```ts
// Find all 'package.json' files.
const packages = findUp.sync('package.json');

// Find the first 'package.json' starting from specific directory.
const [package] = findUp.sync('package.json', { stopAtLimit: 1, cwd: 'path/to/start' });
```

- `findUp.sync(names: string[], options?: Options) => string[]`

```ts
// Find the first supported eslintrc file.
const [eslintrc] = findUp.sync(['.eslintrc.yaml', '.eslintrc.json'], { stopAtLimit: 1 })
// If both '.eslintrc.yaml' and '.eslintrc.json' are found in a directory,
// '.eslintrc.yaml' will be returned because it's in front of the other in the array.
```

- `findUp.sync(matcher: Function, options?: Options) => string[]`

```ts
const matcher = (dir: string) => 'my.config';

// Find all 'my.config' files.
const configs = findUp.sync(matcher);
```

# Options

| Name          | Type                      | Default                    | Description                                                        |
| ------------- | ------------------------- | -------------------------- | ------------------------------------------------------------------ |
| cwd           | `string` \| `URL`         | `process.cwd()`            | The directory to start searching from.                             |
| type          | `"file"` \| `"directory"` | `"file"`                   | The type of paths that can match.                                  |
| stopAtLimit   | `number`                  | `Number.POSITIVE_INFINITY` | Stop the search once a number of results have been found.          |
| stopAtPath    | `string` \| `URL`         | `path.parse(cwd).root`     | The path to the directory to stop the search before reaching root. |
| allowSymlinks | `boolean`                 | _true_                     | Allow symlinks to match if they point to the chosen path type.     |

# License

MIT © Zhao DAI <daidodo@gmail.com>
