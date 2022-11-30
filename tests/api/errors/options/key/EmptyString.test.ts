import { describe, expect, test } from "@jest/globals";

// ===== TESTED FEATURE
import { errors } from "@main";

describe("errors.options.key.EmptyString", () => {
    test("Should have the right class name", () => {
        // ===== GIVEN
        const error = new errors.options.key.EmptyString();

        // ===== WHEN
        const classConstructor = error.constructor;

        // ===== THEN
        expect(classConstructor).toStrictEqual(errors.options.key.EmptyString);
    });
});
