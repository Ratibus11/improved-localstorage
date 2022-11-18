import * as errors from "@src/errors";

/**
 * Check provided key's validity
 * @param key Key to check its validity.
 * @throws {@link errors.options.key.NotString} if the provided key is not a string.
 * @throws {@link errors.options.key.EmptyString} if the provided key is an empty string.
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
