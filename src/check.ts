import * as errors from "@src/errors";

/**
 * Check `key` option validity.
 * @param {string} key Key to test.
 * @throws `errors.options.key.NotString` if the key is not a string.
 * @throws `errors.options.key.EmptyString` if the key is an empty string.
 */
function key(key: string): void | never {
    if (typeof key !== "string") {
        throw new errors.options.key.NotString(key);
    }

    if (key === "") {
        throw new errors.options.key.EmptyString();
    }
}

export { key };
