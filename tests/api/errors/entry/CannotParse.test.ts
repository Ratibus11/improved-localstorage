import { describe, expect, test } from "@jest/globals";

// ===== TESTED FEATURE
import { errors } from "@main";

describe("errors.entry.CannotParse", () => {
    test("Should have the right class name", () => {
        // ===== GIVEN
        const error = new errors.entry.CannotParse(new SyntaxError());

        // ===== WHEN
        const classConstructor = error.constructor;

        // ===== THEN
        expect(classConstructor).toStrictEqual(errors.entry.CannotParse);
    });

    test.each([undefined, null, 0, false, new Date(), new TypeError(), new Error()])(
        "%p should throw a 'TypeError'",
        (invalidError: any) => {
            // ===== GIVEN
            // invalidError

            // ===== WHEN
            const functionThatShouldThrowTypeError = () => {
                const error = new errors.entry.CannotParse(invalidError);
            };

            // ===== THEN
            expect(functionThatShouldThrowTypeError).toThrow(TypeError);
        }
    );
});
