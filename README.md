# improved-localstorage

![](https://img.shields.io/npm/v/improved-localstorage?label=last%20release&style=flat-square)
![](https://img.shields.io/github/release-date/Ratibus11/improved-localstorage?label=date&style=flat-square)

![](https://img.shields.io/librariesio/dependents/npm/improved-localstorage?style=flat-square)

![](https://img.shields.io/github/last-commit/Ratibus11/improved-localstorage?style=flat-square)

A better way to interact and store data in a browser's localstorage.

## Table of content

-   [Installation](#installation)
-   Usage
    -   [`clear()`](#clear)
    -   [`exists(key)`](#existskey)
    -   [`get(key[, options])`](#getkey-options)
    -   [`remove(key)`](#removekey)
    -   [`set(key, newValue)`](#setkey-newvalue)
    -   `errors`
        -   `entry`
            -   [`CannotParse(error, content)`](#errorsentrycannotparseerror-content)
            -   [`CannotStringify(error)`](#errorsentrycannotstringifyerror)
        -   `options`
            -   `key`
                -   [`EmptyString()`](#errorsoptionskeyemptystring)
                -   [`NotString(invalidKey)`](#errorsoptionskeynotstringinvalidkey)
-   [Contributing](#contributing)
-   [License](#license)
-   [Credits to dependancies](#credits-to-dependancies)

## Installation

This package is published through the [NPM registry](https://www.npmjs.com/). You can easily install it with the following command:

```
npm install improved-localstorage
```

## Usage

### `clear()`

Remove all local storage's entries.

<details>
  <summary><b>Returns</b></summary>

`boolean` - `true` if the local storage contains entries while calling the function, `false` otherwise.

</details>

<details>
  <summary><b>Examples</b></summary>

```ts
// {}
clear(); // false
// {}
```

```ts
// { hi: "everyone" }
clear(); // true
// {}
```

</details>

### `exists(key)`

Check if an entry with a specific key exists.

<details>
  <summary><b>Returns</b></summary>

`boolean` - `true` if the entry with the provided key exists, `false` otherwise.

</details>

<details>
  <summary><b>Arguments</b></summary>

| Name  | Facultative |   Type   | Description                  |
| :---: | :---------: | :------: | ---------------------------- |
| `key` |             | `string` | Key to check it's existence. |

</details>

<details>
  <summary><b>Errors</b></summary>

|                        Type                         | Reason                            |
| :-------------------------------------------------: | --------------------------------- |
| [`NotString`](#errorsoptionskeynotstringinvalidkey) | Argument `key` is not a string    |
|    [`EmptyString`](#errorsoptionskeyemptystring)    | Argument `key` is an empty string |

</details>

<details>
  <summary><b>Examples</b></summary>

```ts
// { hi: "everyone" }
exists("hi"); // true
```

```ts
// { hi: "everyone" }
exists("something"); // false
```

</details>

### `get(key[, options])`

Get an entry from the local storage.

<details>
  <summary><b>Returns</b></summary>

`any` - JSON-parsed entry's content, or `null` if the entry doesn't exists.

</details>

<details>
  <summary><b>Arguments</b></summary>

|   Name    |    Facultative     |   Type   | Description                                                                                                                                                                                                        |
| :-------: | :----------------: | :------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
|   `key`   |                    | `string` | Entry's key                                                                                                                                                                                                        |
| `options` | :white_check_mark: | `object` | Getter's options:<br/>- `destroy` - If strictly `true`, the entry will be destroyed after being loaded (even if an error occurred)<br/>- If strictly `true`, the entry will be destroyed only if an error occurred |

</details>

<details>
  <summary><b>Errors</b></summary>

|                         Type                          | Reason                                         |
| :---------------------------------------------------: | ---------------------------------------------- |
|  [`NotString`](#errorsoptionskeynotstringinvalidkey)  | Argument `key` is not a string                 |
|     [`EmptyString`](#errorsoptionskeyemptystring)     | Argument `key` is an empty string              |
| [`CannotParse`](#errorsentrycannotparseerror-content) | The entry's content cannot be parsed from JSON |

</details>

<details>
  <summary><b>Examples</b></summary>

```ts
// { hi: "{\"everyone\":true}" }
get("hi"); // { everyone: true }
```

```ts
// { hi: "\"everyone\"" }
get("something"); // null
```

```ts
// { hi: "undefined" }
get("hi", { destroy: true }); // undefined
// {}
```

```ts
// { hi: "{anError:true}" }
get("hi", { destroyOnError: true }); // Throws CannotParse
// { }
```

</details>

<details>
  <summary><b>Notes</b></summary>

-   Although `"undefined"` is not a valid JSON string, it will anyway return `undefined`. See [`set(key, newValue)`](#setkey-newvalue) for more details.
</details>

### `remove(key)`

Remove an entry with a specific key from the local storage.

<details>
  <summary><b>Returns</b></summary>

`boolean` - `true` if the entry exists while calling the function, `false` otherwise.

</details>

<details>
  <summary><b>Arguments</b></summary>

| Name  | Facultative |   Type   | Description           |
| :---: | :---------: | :------: | --------------------- |
| `key` |             | `string` | Entry to remove's key |

</details>

<details>
  <summary><b>Errors</b></summary>

|                        Type                         | Reason                         |
| :-------------------------------------------------: | ------------------------------ |
| [`NotString`](#errorsoptionskeynotstringinvalidkey) | Argument `key` is not a string |
|    [`EmptyString`](#errorsoptionskeyemptystring)    | Argument `key` is an empty     |

</details>

<details>
  <summary><b>Examples</b></summary>

```ts
// { hi: "everyone" }
remove("hi"); // true
// {}
```

```ts
// { hi: "everyone" }
remove("something"); // false
// { hi: "everyone" }
```

</details>

### `set(key, newValue)`

Set a entry in the local storage.

<details>
  <summary><b>Arguments</b></summary>

|    Name    |    Facultative     |   Type   | Description               |
| :--------: | :----------------: | :------: | ------------------------- |
|   `key`    |                    | `string` | Entry's key               |
| `newValue` | :white_check_mark: |  `any`   | Value to set in the entry |

</details>

<details>
  <summary><b>Errors</b></summary>

|                         Type                          | Reason                                                    |
| :---------------------------------------------------: | --------------------------------------------------------- |
|  [`NotString`](#errorsoptionskeynotstringinvalidkey)  | Argument `key` is not a string                            |
|     [`EmptyString`](#errorsoptionskeyemptystring)     | Argument `key` is an empty string                         |
| [`CannotStringify`](#errorsentrycannotstringifyerror) | Something went wrong while stringifying the value to JSON |

</details>

<details>
  <summary><b>Examples</b></summary>

```js
// {}
set("hi", "everyone");
// { hi: "\"everyone\"" }
```

```js
// { hi: "\"nobody\"" }
set("hi", { everyone: true });
// { hi: "{\"everyone\":true}" }
```

```js
// {}
set("hi", null);
// { hi: "null" }
```

```js
// {}
set("hi", undefined);
// { hi: "undefined" }
```

</details>

<details>
  <summary><b>Notes</b></summary>

-   Although `undefined` can be stringified to JSON but not parsed from it by JavaScript's `JSON` object, `undefined` can be setted and getted with `get()` and `set()`. See [`get(key[, options])`](#getkey-options) for more details.
</details>

### `errors.entry.CannotParse(error, content)`

The entry's content cannot be parsed from JSON.

Inherits from `SyntaxError`.

<details>
  <summary><b>Arguments</b></summary>

|   Name    |    Facultative     |     Type      | Description                    |
| :-------: | :----------------: | :-----------: | ------------------------------ |
|  `error`  | :white_check_mark: | `SyntaxError` | Error thrown by `JSON.parse()` |
| `content` | :white_check_mark: |   `string`    | Loaded content                 |

</details>

<details>
  <summary><b>Notes</b></summary>

-   `error` will not be displayed in the error message if it's not a `SyntaxError` instance.
-   `content` will not be displayed in the error message if it's not a string.

</details>

### `errors.entry.CannotStringify(error)`

The provided value cannot be stringified to JSON.

Inherits from `TypeError`.

<details>
  <summary><b>Arguments</b></summary>

|  Name   |    Facultative     |    Type     | Description                        |
| :-----: | :----------------: | :---------: | ---------------------------------- |
| `error` | :white_check_mark: | `TypeError` | Error thrown by `JSON.stringify()` |

</details>

<details>
  <summary><b>Notes</b></summary>

-   `error` will not be displayed in the error message if it's not a `TypeError` instance.

</details>

### `errors.options.key.EmptyString()`

Argument `key` is an empty string.

Inherits from `RangeError`.

### `errors.options.key.NotString(invalidKey)`

Argument `key` is not a string.

Inherits from `TypeError`.

<details>
  <summary><b>Arguments</b></summary>

|     Name     |    Facultative     | Type  | Description      |
| :----------: | :----------------: | :---: | ---------------- |
| `invalidKey` | :white_check_mark: | `any` | Invalid used key |

</details>

<details>
  <summary><b>Notes</b></summary>

-   Will display, if possible and if not strictly `undefined`, the invalid key. Otherwise, it will not be displayed.
</details>

## Contributing

Feel free to [open an issue](https://github.com/Ratibus11/improved-localstorage/issues/new) if you want to report bugs or discuss about suggestions!

## License

This package is published under the [MIT](https://choosealicense.com/licenses/mit/) license.
See in LICENSE in the repo's root.

## Credits to dependancies

-   [`chai`](https://www.npmjs.com/package/chai) - Assertions with `expect` _(tests)_
-   [`gulp`](https://www.npmjs.com/package/gulp) - Tasks runner _(build)_
-   [`gulp-minify`](https://www.npmjs.com/package/gulp-minify) - `.js` minifier for Gulp _(build)_
-   [`gulp-rename`](https://www.npmjs.com/package/gulp-rename) - Files renamer for Gulp _(build)_
-   [`gulp-typescript`](https://www.npmjs.com/package/gulp-typescript) - Typescript transpiler for Gulp _(build)_
-   [`merge2`](https://www.npmjs.com/package/merge2) - Multiple streams adapter _(build)_
-   [`node-localstorage`](https://www.npmjs.com/package/node-localstorage) - Local storage for Node.js _(tests)_
-   [`ts-mocha`](https://www.npmjs.com/package/ts-mocha) - Mocha version for Typescript _(tests)_
-   [`ts-patch`](https://www.npmjs.com/package/ts-patch) - Patch for Typescript aliases rewrite _(build)_
-   [`tsconfig-paths`](https://www.npmjs.com/package/tsconfig-paths) - Loader for `tsconfig.json` aliases _(tests)_
-   [`typescript-transform-paths`](https://www.npmjs.com/package/typescript-transform-paths) - Typescript plugin for aliases rewrite _(build)_

<div align="right">Made with &#10084; by <a href="https://github.com/Ratibus11">Ratibus11</a>.</div>

![](https://img.shields.io/github/stars/ratibus11/improved-localstorage?style=social)
