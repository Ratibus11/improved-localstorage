# improved-localstorage

A better way to interact and store data in a `localstorage` container.

## Table of content

-   [Installation](#installation)
-   Usage (see API structure [here](#api-structure))

    -   Functions
        -   [`get(key[, options])`](#getkey-options)
        -   [`set(key, value)`](#setkey-value)
        -   [`exists(key)`](#existskey)
        -   [`destroy(key)`](#destroykey)
        -   [`clear()`](#clear)
    -   Types
        -   [`GetOptions`](#getoptions)
    -   [Errors](#errors-errors-namespace)

-   [API structure](#api-structure)
-   [Contributing](#contributing)
-   [License](#license)
-   [Credits to dependencies](#credits-to-dependencies)

## Installation

This module is published through the [NPM registry](https://npmjs.com). You can easly install it with the following command:

```
npm i improved-localstorage
```

## Usage

This module allows to interact with the client's local storage and store JSON-stringified data, so each entry can contain JSON-like data.

### `get(key[, options])`

Get an element from the local storage.

#### Returns

-   `Object` - Entry's key if it exists and its content as been parsed.
-   `undefined` - If the entry doesn't exists.

#### Parameters

|   Name    |           Type            |    Facultative     | Description      |
| :-------: | :-----------------------: | :----------------: | ---------------- |
|   `key`   |          string           |        :x:         | Entry's key      |
| `options` | [GetOptions](#getoptions) | :white_check_mark: | Getter's options |

#### Throw

-   `MissingKey` - If `key` is not provided (undefined, null, empty string, ...).
-   `KeyNotString` - If `key` is not a string.
-   `CannotParseJson` - If the entry's key value cannot be parsed as JSON.

#### Examples

```ts
// { test: "{\"something\":true}" }
get("test"); // { something: true }
```

```ts
// { test: "{\"something\":true}" }
get("something"); // undefined
```

```ts
// { test: "1" }
get("test"); // 1
```

### `set(key, value)`

Set an element to the local storage.

#### Returns

-   `undefined`.

#### Parameters

|  Name   | Facultative | Facultative | Description                        |
| :-----: | :---------: | :---------: | ---------------------------------- |
|  `key`  |   string    |     :x:     | Entry's key                        |
| `value` |   Object    |     :x:     | Content to set in the localstorage |

#### Throw

-   `MissingKey` - If `key` is not provided (undefined, null, empty string, ...).
-   `KeyNotString` - If `key` is not a string.
-   `MissingContent` - If `value` is not provided.
-   `CannotStringifyJson` - If `value` cannot be strigified as JSON.
-   `UndefinedStringified` - If the `JSON.stringify`'s result is equal to `undefined`.

#### Examples

```ts
// { test: "{\"something\":true}" }
set("test", true);
// { test: "true" }
```

```ts
// { test: "{\"something\":true}" }
set("something", { hi: "everyone" });
// { test: "{\"something\":true}", something: "{\"hi\":\"everyone\"}" }
```

### `exists(key)`

Check if an entry exists in the local storage.

#### Returns

-   `boolean` - `true` if the entry exists, `false` otherwise.

#### Parameters

| Name  |  Type  | Facultative | Description |
| :---: | :----: | :---------: | ----------- |
| `key` | string |     :x:     | Entry's key |

#### Throw

-   `MissingKey` - If `key` is not provided (undefined, null, empty string, ...).
-   `KeyNotString` - If `key` is not a string.

#### Examples

```ts
// { test: "hi" }
exists("test"); // true
```

```ts
// { test: "hi" }
exists("something"); // false
```

### `destroy(key)`

Remove an entry from the local storage.

### Returns

-   `boolean` - `true` if the entry has been removed by the function's call, `false` otherwise.

#### Parameters

| Name  |  Type  | Facultative | Description |
| :---: | :----: | :---------: | ----------- |
| `key` | string |     :x:     | Entry's key |

#### Throw

-   `MissingKey` - If `key` is not provided (undefined, null, empty string, ...).
-   `KeyNotString` - If `key` is not a string.

#### Examples

```ts
// { test: "hi", something: "everyone" }
destroy("test"); // true
// { something: "everyone" }
```

```ts
// { test: "hi" }
destroy("something"); // false
// { test: "hi" }
```

### `clear()`

Clear all entries from the local storage.

### Returns

-   `boolean` - `true` if the entries have been removed by the function's call, `false` otherwise.

#### Examples

```ts
// { test: "hi", something: "everyone" }
clear(); // true
// {  }
```

```ts
// {  }
clear(); // false
// {  }
```

## Types

### `GetOptions`

[`get()`](#getkey-options) options.

#### Content

|       Name       |  Type   |    Facultative     | Description                                                                                         |
| :--------------: | :-----: | :----------------: | --------------------------------------------------------------------------------------------------- |
|    `destroy`     | boolean | :white_check_mark: | If strictly `true`, will destroy the entry after calling this function (even if an error occurred). |
| `destroyOnError` | boolean | :white_check_mark: | If strictly `true`, will destroy the entry only if an error occurred.                               |

## Errors (`errors` namespace)

|          Name          | Description                                                                      |
| :--------------------: | -------------------------------------------------------------------------------- |
|   `CannotParseJson`    | Throw when a string cannot be parsed as JSON.                                    |
| `CannotStringifyJson`  | Thrown when a JSON cannot be strigified.                                         |
|     `KeyNotString`     | Throw when an entry's key is not a string.                                       |
|    `MissingContent`    | Thrown when an entry's content is not provided.                                  |
|      `MissingKey`      | Thrown when an entry's key is not provided (undefined, null, empty string, ...). |
| `UndefinedStringified` | Throw when a strigified data is equal to `undefined`.                            |

## API structure

```
improved-localstorage
  |
  |- clear()
  |- destroy(key)
  |- exists(key)
  |- get(key[, options])
  |- set(key, value)
  |
  |- GetOptions
  |
  \- errors
      |
      |- CannotParseJson
      |- CannotStringifyJson
      |- KeyNotString
      |- MissingContent
      |- MissingKey
      \- UndefinedStringified
```

## Contributing

Feel free to [open an issue](https://github.com/Ratibus11/improved-localstorage/issues/new) if you want to report bugs or discuss about suggestions!

## License

This package is published under the [MIT](https://choosealicense.com/licenses/mit/) license.

## Credits to dependencies

Using multiple modules:

-   dependencies:
    -   _nothing, all made with love_
-   Development dependencies:
    -   [`chai`](https://www.npmjs.com/package/chai) - Assertions (tests)
    -   [`glob`](https://www.npmjs.com/package/glob) - Multiple files selection (build)
    -   [`gulp`](https://www.npmjs.com/package/gulp) - Tasks runner (build)
    -   [`gulp-minify`](https://www.npmjs.com/package/gulp-minify) - Gulp plugin for files minifying (build)
    -   [`gulp-rename`](https://www.npmjs.com/package/gulp-rename) - Gulp plugin for files renaming (build)
    -   [`gulp-typescript`](https://www.npmjs.com/package/gulp-typescript) - Gulp plugin for Typescript compilation (build)
    -   [`merge2`](https://www.npmjs.com/package/merge2) - Combine streams (build)
    -   [`node-localstorage`](https://www.npmjs.com/package/node-localstorage) - Localstorage simulation on Node.js (tests)
    -   [`ts-mocha`](https://www.npmjs.com/package/ts-mocha) - Typescript version of Mocha (tests)
    -   [`tsconfig-paths`](https://www.npmjs.com/package/tsconfig-paths) - Loader for `tsconfig.json` paths (tests)

<div align="right">Made with &#10084; by <a href="https://github.com/Ratibus11">Ratibus11</a>.</div>
