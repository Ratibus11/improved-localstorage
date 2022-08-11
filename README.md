# better-localstorage
A better way to interact and store data in a browser's localstorage.

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
-   [Contributing](#contributing)
-   [License](#license)

## Installation

This module is published through the [NPM registry](https://npmjs.com). You can easly install it with the following command:

```
npm i better-localstorage
```

## Usage

This module allow to interact with client's localstorage and store JSON-parsed data, so each entry can contains JSON-like data.

### `get(key[, options])`

Get an element from the local storage.

#### Returns

-   `Object` - Entry's content if it exists and its content as been parsed.
-   `undefined` - If the entry doesn't exists.

#### Parameters

|   Name    |           Type            |    Facultative     | Description      |
| :-------: | :-----------------------: | :----------------: | ---------------- |
|   `key`   |          string           |                    | Entry's name     |
| `options` | [GetOptions](#getoptions) | :white_check_mark: | Getter's options |

#### Throw

-   `RangeError` - If `key` is not provided.
-   `TypeError` - If the entry's value cannot be parsed as JSON.

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
|  `key`  |   string    |             | Entry's name                       |
| `value` |   Object    |             | Content to set in the localstorage |

#### Throw

-   `RangeError` - If `key` or `value` is not provided.
-   `TypeError` if the value cannot be strigified as JSON.

#### Examples

```ts
// { test: { something: true } }
set("test", true);
// { test: true }
```

```ts
// { test: { something: true } }
set("something", { hi: "everyone" });
// { test: { something: true }, hi: "everyone" }
```

### `exists(key)`

Check if an entry exists in the local storage.

#### Returns

-   `boolean` - `true` if the entry exists, `false` otherwise.

#### Parameters

| Name  |  Type  | Facultative | Description  |
| :---: | :----: | :---------: | ------------ |
| `key` | string |             | Entry's name |

#### Throw

-   `RangeError` - If `key` is not provided.

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
| `key` | string |             | Entry's name |

#### Throw

-   `RangeError` - If `key` is not provided.

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

### `GetOptions`

[`get()`](#getkey-options) options.

#### Content

|       Name       |  Type   |    Facultative     | Description                                                                              |
| :--------------: | :-----: | :----------------: | ---------------------------------------------------------------------------------------- |
|    `destroy`     | boolean | :white_check_mark: | If `true`, will destroy the entry after calling this function (even if an error occured) |
| `destroyOnError` | boolean | :white_check_mark: | If `true`, will destroy the entry only if an error occured                               |

## Contributing

Feel free to [open an issue](https://github.com/Ratibus11/better-localstorage/issues/new) if you want to report bugs or discuss about suggestions!

## License

[MIT](https://github.com/Ratibus11/better-localstorage/blob/v1/LICENSE)

<div align="right">Made with &#10084; by <a href="https://github.com/Ratibus11">Ratibus11</a>.</div>
