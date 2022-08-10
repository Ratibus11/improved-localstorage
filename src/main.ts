/**
 * Get an entry from the local storage.
 * @param key Entry's key.
 * @param options
 * @returns The entry's value or `undefined` if the entry doesn't exists.
 * @throw `TypeError` if the entry's value cannot be parsed.
 */
function get(key: string, options?: GetOptions): Object | undefined | never {
	if (!key) throw new RangeError("No key provided");

	const content = localStorage.getItem(key);

	if (options?.destroy) localStorage.removeItem(key);

	try {
		return content ? JSON.parse(content) : undefined;
	} catch {
		if (options?.destroyOnError) localStorage.removeItem(key);
		throw new TypeError(
			`Cannot parse content from localstorage: ${content}`
		);
	}
}

interface GetOptions {
	/**
	 * If `true`, will destroy the entry after calling this function (even if an error occured).
	 */
	destroy?: boolean;
	/**
	 * If `true`, will destroy the entry only if an error occured.
	 */
	destroyOnError?: boolean;
}

function set(key: string, value: Object): void {
	if (!key) throw new RangeError("No key provided");
	if (!value) throw new RangeError("No value provided");

	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch {
		throw new TypeError(`Cannot parse content to localstorage: ${value}`);
	}
}

function exists(key: string): boolean {
	return localStorage.getItem(key) !== null;
}

function destroy(key: string): boolean {
	const existingEntry = exists(key);
	localStorage.removeItem(key);
	return existingEntry;
}

function clean(): boolean {
	const existingEntries = localStorage.length > 0;

	localStorage.clear();
	return existingEntries;
}

export { get, set, exists, destroy, clean };
