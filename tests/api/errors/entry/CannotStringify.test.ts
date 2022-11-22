import { describe, expect, test } from "@jest/globals";

// TESTED FEATURE
import { errors } from "@main";

describe("errors.entry.CannotStringify", () => {
    test("Should have the right class name", () => {
        // GIVEN
        const error = new errors.entry.CannotStringify(new TypeError());

        // WHEN
        const classConstructor = error.constructor;

        // THEN
        expect(classConstructor).toStrictEqual(errors.entry.CannotStringify);
    });

    test.each([undefined, null, 0, false, new Date(), new SyntaxError(), new Error()])(
        "%p should throw a 'TypeError'",
        (invalidError: any) => {
            // GIVEN
            // invalidError

            // WHEN
            const functionThatShouldThrowTypeError = () => {
                const error = new errors.entry.CannotStringify(invalidError);
            };

            // THEN
            expect(functionThatShouldThrowTypeError).toThrow(TypeError);
        }
    );
});
