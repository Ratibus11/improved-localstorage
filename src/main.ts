import * as check from "@src/check";

/**
 * Get an entry from the local storage.
 * @param key Entry's key.
 * @param options Getter's options:
 * - `destroy` - If strictly `true`, the entry is destroyed after being loaded (even if an error occurred).
 * - `destroyOnError` - If strictly `true`, the entry is destroyed only if an error occurred.
 * @returns {any} JSON-parsed entry's content, or `null` if the entry don't exists.
 * @note Although `"undefined"` is not a valid JSON string, it will return `undefined`. See `set(key, newValue)` for more details.
 * @throws {TypeError} If `key` is is not a string.
 * @throws {RangeError} If `key` is is an empty string.
 * @throws {SyntaxError} If the entry's content cannot be parsed as JSON.
 * @example
 * // { hi: "{\"everyone\":true}" }
 * get("hi"); // { everyone: true }
 * @example
 * // { hi: "\"everyone\"" }
 * get("something"); // null
 * @example
 * // { hi: "undefined" }
 * get("hi", { destroy: true }); // undefined
 * // {}
 * @example
 * // { hi: "{anError:true}" }
 * get("hi", { destroyOnError: true }); // Throws SyntaxError
 * // { }
 * @example
 */
function get(
    key: string,
    options?: {
        destroy?: boolean;
        destroyOnError?: boolean;
    }
): any | never {
    check.key(key);

    options = {
        destroy: options?.destroy === true,
        destroyOnError: options?.destroyOnError === true,
    };

    const entryContent = localStorage.getItem(key);
    if (options.destroy) {
        remove(key);
    }

    switch (entryContent) {
        case null:
            return null;
        case "undefined":
            return undefined;
    }

    try {
        return JSON.parse(entryContent);
    } catch {
        if (options.destroyOnError) {
            remove(key);
        }
        throw SyntaxError(`'${entryContent}' cannot be parsed as string.`);
    }
}

/**
 * Set a entry in the local storage.
 * @param key Entry's key.
 * @param newValue Value to set in the entry.
 * @throws {TypeError} If `key` is is not a string.
 * @throws {RangeError} If `key` is is an empty string.
 * @throws {Error} If something went wrong while stringifying the value to JSON.
 * @example
 * // {}
 * set("hi", "everyone");
 * // { hi: "\"everyone\"" }
 * @example
 * // { hi: "\"nobody\"" }
 * set("hi", { everyone: true });
 * // { hi: "{\"everyone\":true}" }
 * @example
 * // {}
 * set("hi", null);
 * // { hi: "null" }
 * @example
 * // {}
 * set("hi", undefined);
 * // { hi: "undefined" }
 */
function set(key: string, newValue: any): void | never {
    check.key(key);

    const [result, success]: [string, boolean] = (() => {
        try {
            return [JSON.stringify(newValue), true];
        } catch (error) {
            return [error, false];
        }
    })();

    if (!success) {
        throw new Error(`Something went wrong while stringifying the value to JSON: ${result}`);
    }

    localStorage.setItem(key, result);
}

/**
 * Check if an entry with a specific key exists.
 * @param key Key to check it's existence.
 * @returns {boolean} `true` if the entry with this key exists, `false` otherwise.
 * @throws {TypeError} If `key` is is not a string.
 * @throws {RangeError} If `key` is is an empty string.
 * @example
 * // { hi: "everyone" }
 * exists("hi"); // true
 * @example
 * // { hi: "everyone" }
 * exists("something"); // false
 */
function exists(key: string): boolean | never {
    check.key(key);
    return localStorage.getItem(key) !== null;
}

/**
 * Remove an entry with a specific key from the local storage.
 * @param key Entry to remove's key.
 * @returns {boolean} `true` if the entry exists while calling the function, `false` otherwise.
 * @throws {TypeError} If `key` is is not a string.
 * @throws {RangeError} If `key` is is an empty string.
 * @example
 * // { hi: "everyone" }
 * remove("hi"); // true
 * // {}
 * @example
 * // { hi: "everyone" }
 * remove("something"); // false
 * // { hi: "everyone" }
 */
function remove(key: string): boolean | never {
    check.key(key);
    const entryExists = exists(key);
    localStorage.removeItem(key);
    return entryExists;
}

/**
 * Remove all local storage's entries.
 * @returns {boolean} `true` if the local storage contains entries while calling the function, `false` otherwise.
 * @example
 * // {}
 * clear() // false
 * // {}
 * @example
 * // { hi: "everyone" }
 * clear() // true
 * // {}
 */
function clear(): boolean {
    const hasContent = localStorage.length > 0;
    localStorage.clear();
    return hasContent;
}

export { get, set, exists, remove, clear };
