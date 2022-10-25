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
-   [API structure](#api-structure)
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

#### Returns

`any` - JSON-parsed entry's content, or `null` if the entry don't exists.

#### Note

-   Although `"undefined"` is not a valid JSON string, it will return `undefined`. See [`set(key, newValue)`](#setkey-newvalue) for more details.
-   As `null` can be getted from a entry and is the returned value if the entry don't exists, it is recommanded to use [`exists(key)`](#existskey) if you want to check an entry's existence.

#### Parameters

|   Name    |    Facultative     |   Type   | Description                                                                                                                                                                                                                 |
| :-------: | :----------------: | :------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|   `key`   |                    | `string` | Entry's key                                                                                                                                                                                                                 |
| `options` | :white_check_mark: | `object` | Getter's options:<br/>- `destroy` - If strictly `true`, the entry is destroyed after being loaded (even if an error occurred)<br/>- `destroyOnError` - If strictly `true`, the entry is destroyed only if an error occurred |

#### Errors

|     Type      | Reason                                       |
| :-----------: | -------------------------------------------- |
|  `TypeError`  | `key` is not a string                        |
| `RangeError`  | `key` is an empty string                     |
| `SyntaxError` | The entry's content cannot be parsed as JSON |

#### Examples

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

### `set(key, newValue)`

Set a entry in the local storage.

#### Returns

`void`

#### Note

-   Although `undefined` can be stringified to JSON as `"undefined"` but not parsed from it, it's anyway possible to set and get `undefined`. See [`get(key[, options]`](#getkey-options) for more details.

#### Parameters

|    Name    |    Facultative     |   Type   | Description               |
| :--------: | :----------------: | :------: | ------------------------- |
|   `key`    |                    | `string` | Entry's key               |
| `newValue` | :white_check_mark: |  `any`   | Value to set in the entry |

#### Errors

|     Type     | Reason                                                    |
| :----------: | --------------------------------------------------------- |
| `TypeError`  | `key` is not a string                                     |
| `RangeError` | `key` is an empty string                                  |
|   `Error`    | Something went wrong while stringifying the value to JSON |

#### Examples

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

### `exists(key)`

Check if an entry with a specific key exists.

#### Returns

`boolean` - `true` if the entry with this key exists, `false` otherwise.

#### Parameters

| Name  | Facultative |   Type   | Description |
| :---: | :---------: | :------: | ----------- |
| `key` |             | `string` | Entry's key |

#### Errors

|     Type     | Reason                   |
| :----------: | ------------------------ |
| `TypeError`  | `key` is not a string    |
| `RangeError` | `key` is an empty string |

#### Examples

```js
// { hi: "everyone" }
exists("hi"); // true
```

```js
// { hi: "everyone" }
exists("something"); // false
```

### `remove(key)`

Remove an entry with a specific key from the local storage.

#### Returns

`boolean` - `true` if the entry exists while calling the function, `false` otherwise.

#### Parameters

| Name  | Facultative |   Type   | Description |
| :---: | :---------: | :------: | ----------- |
| `key` |             | `string` | Entry's key |

#### Errors

|     Type     | Reason                   |
| :----------: | ------------------------ |
| `TypeError`  | `key` is not a string    |
| `RangeError` | `key` is an empty string |

#### Examples

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

### `clear()`

Remove all local storage's entries.

#### Returns

`boolean` - `true` if the local storage contains entries while calling the function, `false` otherwise.

#### Examples

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

## API structure

```
improved-localstorage
  |
  |- get(key[, options])
  |- set(key, newValue)
  |- exists(key)
  |- remove(key)
  \- clear()
```

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
