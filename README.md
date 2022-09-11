# improved-localstorage

A better way to interact and store data in a `localstorage` container.

## Table of content

-   [Installation](#installation)
-   Usage

    -   Functions
        -   [`get(key[, options]`](#getkey-options)
        -   [`set(key, value)`](#setkey-value)
        -   [`exists(key)`](#existskey)
        -   [`destroy(key)`](#destroykey)
        -   [`clear()`](#clear)
    -   Types
        -   [`GetOptions`](#getoptions)
    -   Errors
        -   [`CannotParseJson`](#cannotparsejsoncontent)
        -   [`CannotStringifyJson`](#cannotstringifyjsoncontent)
        -   [`MissingContent`](#missingcontent)
        -   [`MissingKey`](#missingkey)

-   [Contributing](#contributing)
-   [License](#license)

## Installation

This module is published through the [NPM registry](https://npmjs.com). You can easly install it with the following command:

```
npm i improved-localstorage
```

## Usage

This module allows to interact with the client's local storage and store JSON-strigified data, so each entry can contain JSON-like data.

### `get(key[, options])`

Get an element from the local storage.

#### Returns

-   `Object` - Entry's content if it exists and its content as been parsed.
-   `undefined` - If the entry doesn't exists.

#### Parameters

|   Name    |           Type            |    Facultative     | Description      |
| :-------: | :-----------------------: | :----------------: | ---------------- |
|   `key`   |          string           |        :x:         | Entry's name     |
| `options` | [GetOptions](#getoptions) | :white_check_mark: | Getter's options |

#### Throw

-   [`MissingKey`](#missingkey) - If `key` is not provided.
-   [`CannotParseJson`](#cannotparsejson) - If the entry's value cannot be parsed as JSON.

#### Examples

```ts
// { test: { something: true } }
get("test"); // { something: true }
```

```ts
// { test: { something: true } }
get("something"); // undefined
```

```ts
// { test: 1 }
get("test"); // 1
```

### `set(key, value)`

Set an element to the local storage.

#### Returns

-   `undefined`.

#### Parameters

|  Name   | Facultative | Facultative | Description                        |
| :-----: | :---------: | :---------: | ---------------------------------- |
|  `key`  |   string    |     :x:     | Entry's name                       |
| `value` |   Object    |     :x:     | Content to set in the localstorage |

#### Throw

-   [`MissingKey`](#missingkey) - If `key` is not provided.
-   [`MissingContent`](#missingcontent) - If `value` is not provided.
-   [`CannotStringifyJson`](#cannotstringifyjson) - If `value` cannot be strigified as JSON.

#### Examples

```ts
// { test: { something: true } }
set("test", true);
// { test: true }
```

```ts
// { test: { something: true } }
set("something", { hi: "everyone" });
// { test: { something: true }, something: { hi: "everyone" } }
```

### `exists(key)`

Check if an entry exists in the local storage.

#### Returns

-   `boolean` - `true` if the entry exists, `false` otherwise.

#### Parameters

| Name  |  Type  | Facultative | Description  |
| :---: | :----: | :---------: | ------------ |
| `key` | string |     :x:     | Entry's name |

#### Throw

-   [`MissingKey`](#missingkey) - If `key` is not provided.

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

| Name  |  Type  | Facultative | Description  |
| :---: | :----: | :---------: | ------------ |
| `key` | string |     :x:     | Entry's name |

#### Throw

-   [`MissingKey`](#missingkey) - If `key` is not provided.

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

|       Name       |  Type   |    Facultative     | Description                                                                              |
| :--------------: | :-----: | :----------------: | ---------------------------------------------------------------------------------------- |
|    `destroy`     | boolean | :white_check_mark: | If `true`, will destroy the entry after calling this function (even if an error occured) |
| `destroyOnError` | boolean | :white_check_mark: | If `true`, will destroy the entry only if an error occured                               |

## Errors

### `CannotParseJson`

Throw when a string cannot be parsed as JSON.

### `CannotStringifyJson`

Thrown when a JSON cannot be strigified.

### `MissingContent`

Thrown when an entry's content is not provided.

### `MissingKey`

Thrown when an entry's key name is not provided.

## Contributing

Feel free to [open an issue](https://github.com/Ratibus11/improved-localstorage/issues/new) if you want to report bugs or discuss about suggestions!

## License

This package is published under the [MIT](https://github.com/Ratibus11/better-localstorage/blob/v1/LICENSE) license.

<div align="right">Made with &#10084; by <a href="https://github.com/Ratibus11">Ratibus11</a>.</div>
