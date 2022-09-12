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
 * Missing entry's key name error.
 */
class MissingKey extends MissingArgument {
	constructor() {
		super("Entry's key name");
		this.name = "MissingKey";
	}
}

/**
 * Missing entry's content error.
 */
class MissingContent extends MissingArgument {
	constructor() {
		super("Entry's content");
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

export { MissingKey, MissingContent, CannotStringifyJson, CannotParseJson };
