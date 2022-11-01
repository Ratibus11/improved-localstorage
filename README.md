# improved-localstorage

A better way to interact and store data in a browser's localstorage.

## Table of content

-   [Installation](#installation)
-   Usage
    -   [`get(key[, options])`](#getkey-options)
    -   [`set(key, newValue)`](#setkey-newvalue)
    -   [`exists(key)`](#existskey)
    -   [`remove(key)`](#removekey)
    -   [`clear()`](#clear)
    -   `errors`
        -   `entry`
            -   [`CannotParse(error, content)`](#errorsentrycannotparseerror-content)
            -   [`CannotStringify(error)`](#errorsentrycannotstringifyerror)
        -   `options`
            -   `key`
                -   [`NotString(invalidKey)`](#errorsoptionskeynotstringinvalidkey)
                -   [`EmptyString()`](#errorsoptionskeyemptystring)
-   [Contributing](#contributing)
-   [License](#license)
-   [Credits to dependancies](#credits-to-dependancies)

## Installation

This package is published through the [NPM registry](https://www.npmjs.com/). You can easily install it with the following command:

```
npm install improved-localstorage
```

## Usage

### `get(key[, options])`

Get an entry from the local storage.

<details>
  <summary><b>Returns</b></summary>

`any` - JSON-parsed entry's content, or `null` if the entry doesn't exists.

</details>

<details>
  <summary><b>Arguments</b></summary>

|   Name    |    Facultative     |   Type   | Description                                                                                                                                                                                                                 |
| :-------: | :----------------: | :------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|   `key`   |                    | `string` | Entry's key                                                                                                                                                                                                                 |
| `options` | :white_check_mark: | `object` | Getter's options:<br/>- `destroy` - If strictly `true`, the entry is destroyed after being loaded (even if an error occurred)<br/>- `destroyOnError` - If strictly `true`, the entry is destroyed only if an error occurred |

</details>

<details>
  <summary><b>Errors</b></summary>

|                         Type                          | Reason                                         |
| :---------------------------------------------------: | ---------------------------------------------- |
|  [`NotString`](#errorsoptionskeynotstringinvalidkey)  | `key` is not a string                          |
|     [`EmptyString`](#errorsoptionskeyemptystring)     | `key` is an empty string                       |
| [`CannotParse`](#errorsentrycannotparseerror-content) | The entry's content cannot be parsed from JSON |

</details>

<details>
  <summary><b>Examples</b></summary>

```js
// { hi: "{\"everyone\":true}" }
get("hi"); // { everyone: true }
```

```js
// { hi: "\"everyone\"" }
get("something"); // null
```

```js
// { hi: "undefined" }
get("hi", { destroy: true }); // undefined
// {}
```

```js
// { hi: "{anError:true}" }
get("hi", { destroyOnError: true }); // Throws SyntaxError
// { }
```

</details>

<details>
  <summary><b>Notes</b></summary>

-   Although `"undefined"` is not a valid JSON string, it will return `undefined`. See [`set(key, newValue)`](#setkey-newvalue) for more details.
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

### `exists(key)`

Check if an entry with a specific key exists.

<details>
  <summary><b>Returns</b></summary>

`boolean` - `true` if the entry with this key exists, `false` otherwise.

</details>

<details>
  <summary><b>Arguments</b></summary>

| Name  | Facultative |   Type   | Description |
| :---: | :---------: | :------: | ----------- |
| `key` |             | `string` | Entry's key |

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

```js
// { hi: "everyone" }
exists("hi"); // true
```

```js
// { hi: "everyone" }
exists("something"); // false
```

</details>

### `remove(key)`

Remove an entry with a specific key from the local storage.

<details>
  <summary><b>Returns</b></summary>

`boolean` - `true` if the entry exists while calling the function, `false` otherwise.

</details>

<details>
  <summary><b>Arguments</b></summary>

| Name  | Facultative |   Type   | Description |
| :---: | :---------: | :------: | ----------- |
| `key` |             | `string` | Entry's key |

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

```js
// { hi: "everyone" }
remove("hi"); // true
// {}
```

```js
// { hi: "everyone" }
remove("something"); // false
// { hi: "everyone" }
```

</details>

### `clear()`

Remove all local storage's entries.

<details>
  <summary><b>Returns</b></summary>

`boolean` - `true` if the local storage contains entries while calling the function, `false` otherwise.

</details>

<details>
  <summary><b>Examples</b></summary>

```js
// {}
clear(); // false
// {}
```

```js
// { hi: "everyone" }
clear(); // true
// {}
```

</details>

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

### `errors.options.key.EmptyString()`

Argument `key` is an empty string.

Inherits from `RangeError`.

### `errors.entry.CannotParse(error, content)`

The entry's content cannot be parsed from JSON.

Inherits from `SyntaxError`.

<details>
  <summary><b>Arguments</b></summary>

|   Name    | Facultative |     Type      | Description                    |
| :-------: | :---------: | :-----------: | ------------------------------ |
|  `error`  |             | `SyntaxError` | Error thrown by `JSON.parse()` |
| `content` |             |   `string`    | Loaded content                 |

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

|  Name   | Facultative |    Type     | Description                        |
| :-----: | :---------: | :---------: | ---------------------------------- |
| `error` |             | `TypeError` | Error thrown by `JSON.stringify()` |

</details>

<details>
  <summary><b>Notes</b></summary>

-   `error` will not be displayed in the error message if it's not a `TypeError` instance.

</details>

## Contributing

Feel free to [open an issue](https://github.com/Ratibus11/improved-localstorage/issues/new) if you want to report bugs or discuss about suggestions!

## License

This package is published under the [MIT](https://choosealicense.com/licenses/mit/) license.
See in LICENSE in the repo's root.

## Credits to dependancies

-   [`chai`](https://www.npmjs.com/package/chai) - Assertions with `expect` _(tests)_
-   [`glob`](https://www.npmjs.com/package/glob) - Multi-files selection _(build)_
-   [`gulp`](https://www.npmjs.com/package/gulp) - Tasks runner _(build)_
-   [`gulp-minify`](https://www.npmjs.com/package/gulp-minify) - `.js` minifier for Gulp _(build)_
-   [`gulp-rename`](https://www.npmjs.com/package/gulp-rename) - Files renamer for Gulp _(build)_
-   [`gulp-typescript`](https://www.npmjs.com/package/gulp-typescript) - Typescript transpiler for Gulp _(build)_
-   [`merge2`](https://www.npmjs.com/package/merge2) - Multiple streams adapter _(build)_
-   [`node-localstorage`](https://www.npmjs.com/package/node-localstorage) - Local storage for Node.js _(tests)_
-   [`ts-mocha`](https://www.npmjs.com/package/ts-mocha) - Mocha version for Typescript _(tests)_
-   [`tsconfig-paths`](https://www.npmjs.com/package/tsconfig-paths) - Loader for `tsconfig.json` aliases _(tests)_

<div align="right">Made with &#10084; by <a href="https://github.com/Ratibus11">Ratibus11</a>.</div>
