/**
 * Namespace for options errors.
 */
namespace options {
    /**
     * Namespace for `key` option errors.
     */
    export namespace key {
        /**
         * `key` option is not a string.
         */
        export class NotString extends TypeError {
            /**
             * @param invalidKey Invalid key.
             * @note Will display, if possible, the invalid key. Otherwise, it will not be displayed.
             */
            constructor(invalidKey: any) {
                try {
                    super(`Key ('${invalidKey}') must be a string. A ${typeof invalidKey} was provided.`);
                } catch {
                    super(`Key must be a string. A ${typeof invalidKey} was provided.`);
                }
                this.name = "OptionsKeyNotString";
            }
        }

        /**
         * `key` option is an empty string.
         */
        export class EmptyString extends RangeError {
            constructor() {
                super(`Key must be an non-empty string.`);
                this.name = "OptionsKeyEmpty";
            }
        }
    }
}

/**
 * Namespace for localstorage entries's errors.
 */
namespace entry {
    /**
     * The entry's content cannot be parsed from JSON.
     */
    export class CannotParse extends SyntaxError {
        /**
         * @param error Error thrown by `JSON.parse()`.
         * @param content Loaded content.
         * @note `error` will not be displayed in the error message if it's not a `SyntaxError` instance.
         * @note `content` will not be displayed in the error message if it's not a string.
         */
        constructor(error: SyntaxError, content: string) {
            super(
                `Something went wrong while parsing entry's content from JSON${
                    error instanceof SyntaxError === false ? "" : `: ${error}`
                }${typeof content !== "string" ? "" : `, in: ${content}`}.`
            );
            this.name = "EntryCannotParse";
        }
    }

    /**
     * The value cannot be stringified to JSON.
     */
    export class CannotStringify extends TypeError {
        /**
         * @param error Error thrown by `JSON.stringify()`.
         * @note `error` will not be displayed in the error message if it's not a `TypeError` instance.
         */
        constructor(error: TypeError) {
            super(
                `Something went wrong while stringifying value to JSON${
                    error instanceof TypeError === false ? "." : `: ${error}`
                }`
            );
            this.name = "EntryCannotStringify";
        }
    }
}

namespace typeError {
    class Error extends TypeError {
        constructor() {
            super();
            this.name = "TypeErrorError";
        }
    }

    class Content extends TypeError {
        constructor() {
            super();
            this.name = "TypeErrorContent";
        }
    }
}

export { options, entry };
