/**
 * Generic error for missing argument
 * @param argumentName Argument's name.
 */
class MissingArgument extends Error {
	constructor(argumentName: string) {
		super(`Missing argument: '${argumentName}'`);
		this.name = "MissingArgument";
	}
}

/**
 * Missing Entry's key error.
 */
class MissingKey extends MissingArgument {
	constructor() {
		super("Entry's key");
		this.name = "MissingKey";
	}
}

/**
 * Entry's key is not a string
 */
class KeyNotString extends TypeError {
	constructor() {
		super("Entry's key must be a string.");
		this.name = "KeyNotString";
	}
}

/**
 * Missing Entry's key content error.
 */
class MissingContent extends MissingArgument {
	constructor() {
		super("Entry's key content");
		this.name = "MissingContent";
	}
}

/**
 * Generic error for JSON interactions
 * @param cannot Error message
 */
class JsonError extends Error {
	constructor(cannot: string) {
		super(`Error while reading JSON - ${cannot}`);
		this.name = "JsonError";
	}
}

/**
 * Error while strigifying an Object to JSON
 * @param content Object tried to strigify to JSON
 */
class CannotStringifyJson extends JsonError {
	constructor(content: Object) {
		super(`Cannot strigify data to JSON: ${content}`);
		this.name = "CannotStringifyJson";
	}
}

/**
 * Error while parsing JSON
 * @param content JSON tried to parse
 */
class CannotParseJson extends JsonError {
	constructor(content: string) {
		super(`Cannot parse JSON data: ${content}`);
		this.name = "CannotParseJson";
	}
}

/**
 * Error when the stringify result is equal to 'undefined'
 * @param content JSON tried to parse
 */
class UndefinedStringified extends JsonError {
	constructor(content: Object) {
		try {
			super(`JSON.strigify result is 'undefined' : ${content}`);
		} catch {
			super(
				`JSON.strigify result is 'undefined'. Original value cannot be displayed in string.`
			);
		}
		this.name = "UndefinedStringified";
	}
}

export {
	MissingKey,
	KeyNotString,
	MissingContent,
	CannotStringifyJson,
	CannotParseJson,
	UndefinedStringified,
};
