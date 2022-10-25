/**
 * Check `key` option validity.
 * @param key Key to test.
 * @throws `TypeError` if the key is not a string.
 * @throws `RangeError` if the key is an empty string.
 */
function key(key: string): void | never {
    if (typeof key !== "string") {
        throw new TypeError(`Entry's key must be a string. A ${typeof key} `);
    }

    if (key === "") {
        throw new RangeError(`Entry's key cannot be an empty string.`);
    }
}

export { key };
