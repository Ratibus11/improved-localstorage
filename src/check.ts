import * as errors from "@src/errors";

/**
 * Check `key` option validity.
 * @param {string} key Key to test.
 * @throws {errors.options.key.NotString} If the key is not a string.
 * @throws {errors.options.key.EmptyString} If the key is an empty string.
 */
function key(key: any): void | never {
    if (typeof key !== "string") {
        throw new errors.options.key.NotString(key);
    }

    if (key === "") {
        throw new errors.options.key.EmptyString();
    }
}

export { key };
