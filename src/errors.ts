// Functions arguments'-related errors namespace
namespace options {
    // 'key' argument's-related errors namespace
    export namespace key {
        // 'key' argument is an empty string.
        export class EmptyString extends RangeError {
            constructor() {
                super(`Provided key is an empty string. Must be a non-empty string.`);
                this.name = "OptionsKeyEmptyString";
            }
        }

        // 'key' argument is not a string.
        export class NotString extends TypeError {
            /**
             * @param invalidKey Invalid used key.
             * @remarks Will display the key if possible.
             */
            constructor(invalidKey: any) {
                try {
                    super(
                        `Provided key '${invalidKey}' is a '${typeof invalidKey}'. Must be a string.`
                    );
                } catch {
                    super(`Provided key is a '${typeof invalidKey}'. Must be a string.`);
                }
                this.name = "OptionsKeyNotString";
            }
        }
    }
}

// Localstorage entries'-related errors namespace
namespace entry {
    // Localstorage's entry cannot be parsed as JSON.
    export class CannotParse extends SyntaxError {
        /**
         * @param error Error thrown by `JSON.parse()`.
         * @throws [TypeError](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/TypeError) if `error` is not a `SyntaxError`.
         */
        constructor(error: SyntaxError) {
            const errorConstructor = error.constructor;

            if (errorConstructor !== SyntaxError) {
                throw new TypeError(
                    `Provided error is a '${errorConstructor.name}'. Must be a 'SyntaxError'.`
                );
            }

            super(`Cannot parse entry as JSON: ${error.message}`);
            this.name = "EntryCannotParse";
        }
    }

    // Value cannot be stringified as JSON.
    export class CannotStringify extends TypeError {
        /**
         * @param error Error thrown by `JSON.stringify()`.
         * @throws [TypeError](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/TypeError) if `error` is not a `TypeError`.
         */
        constructor(error: TypeError) {
            const errorConstructor = error.constructor;

            if (errorConstructor !== TypeError) {
                throw new TypeError(
                    `Provided error is a '${errorConstructor.name}'. Must be an instance of 'TypeError'.`
                );
            }

            super(`Cannot stringify value as JSON: ${error.message}`);
            this.name = "EntryCannotStringify";
        }
    }
}

export { options, entry };
