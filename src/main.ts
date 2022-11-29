import * as check from "@src/check";
import * as errors from "@src/errors";

/**
 * Remove all local storage's content.
 * @returns `true` if there were content in the local storage while calling the function, `false` otherwise.
 * @example
 * // { a: "\"hi\"", b: "\"everyone\"" }
 * clear(); // true
 * // {}
 * @example
 * // {}
 * clear(); // false
 * // {}
 */
function clear(): boolean {
    const doContentExists = localStorage.length > 0;
    localStorage.clear();
    return doContentExists;
}

/**
 * Check if a specific entry exists in the local storage.
 * @param key Entry's key to check its existence.
 * @returns `true` if an entry with the provided key exists in the local storage, `false` otherwise.
 * @example
 * // { hi: "\"everyone\"" }
 * exists("hi") // true
 * @example
 * // { hello: "\"everyone\"" }
 * exists("hi") // false
 */
function exists(key: string): boolean | never {
    check.key(key);

    return localStorage.getItem(key) !== null;
}

/**
 * Getter's options.
 */
interface GetOptions {
    /**
     * If `true`, will remove the entry after being loaded, even if an error occurred.
     */
    destroy?: boolean;
    /**
     * If `true`, will remove the entry only if an error occurred.
     */
    destroyOnError?: boolean;
}

/**
 * Get an entry's value from the local storage.
 * @param key Entry to get its value's key.
 * @param options Getter's options.
 * @returns Entry's parsed content, or `null` if it doesn't exists.
 * @remarks
 * As `null` can be stored in the local storage and may be returned by {@link get} if the entry doesn't exists, I don't recommand to use {@link get} to check an entry's existence. Instead, use `exists`.
 * @remarks
 * Altought `undefined` can be stringify as JSON but not be parsed from it, {@link get} support this value. Check {@link get}'s examples and {@link set} for more details.
 * @example
 * // { hi: "\"everyone\"" }
 * get("hi"); // "everyone"
 * @example
 * // { hi: "{\"everyone\":true}" }
 * get("hi", { destroy: true }); // { everyone: true }
 * // {}
 * @example
 * // { hello: "\"everyone\"" }
 * get("hi") // null
 * @throws {@link errors.entry.CannotParse} if the localstorage's entry cannot be parsed as JSON.
 */
function get(key: string, options?: GetOptions): any | null | never {
    options = {
        destroy: options?.destroy === true,
        destroyOnError: options?.destroyOnError === true,
    };

    check.key(key);

    const localStorageContent = localStorage.getItem(key);

    if (localStorageContent === null) {
        return null;
    } else if (localStorageContent === "undefined") {
        return undefined;
    }

    const [error, parsedLocalStorageContent]: [undefined, any] | [SyntaxError, undefined] = (() => {
        try {
            return [undefined, JSON.parse(localStorageContent)];
        } catch (error) {
            if (options.destroyOnError) {
                remove(key);
            }
            return [error as SyntaxError, undefined];
        }
    })();

    if (options.destroy) {
        remove(key);
    }

    if (error) {
        throw new errors.entry.CannotParse(error);
    }

    return parsedLocalStorageContent;
}

/**
 * Remove a specific entry from the local storage.
 * @param key Entry to remove's key.
 * @returns `true` if an entry with the provided key exists while calling the function, `false` otherwise.
 */
function remove(key: string): boolean | never {
    check.key(key);

    const doEntryExists = exists(key);
    localStorage.removeItem(key);
    return doEntryExists;
}

/**
 * Set a value in the local storage.
 * @param key Entry to set its value's key.
 * @param value Value to set in the entry.
 * @example
 * // {}
 * set("hi", "everyone");
 * // { hi: "\"everyone\"" }
 * @example
 * // { hi: "\"everyone\"" }
 * set("hi", {everyone: false});
 * // { hi: "{\"everyone\":false}"}
 * @throws {errors.entry.CannotParse} if the value cannot be stringified as JSON.
 */
function set(key: string, value: any): void | never {
    check.key(key);

    const [error, stringifiedValue]: [undefined, string] | [TypeError, undefined] = (() => {
        try {
            return [undefined, JSON.stringify(value)];
        } catch (error) {
            return [error as TypeError, undefined];
        }
    })();

    if (error) {
        throw new errors.entry.CannotStringify(error);
    }

    localStorage.setItem(key, stringifiedValue);
}

export { clear, exists, get, set, remove, errors };
