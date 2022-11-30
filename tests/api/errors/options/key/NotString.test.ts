import { describe, expect, test } from "@jest/globals";

// ===== TESTED FEATURE
import { errors } from "@main";

describe("errors.options.key.NotString", () => {
    test("Should have the right class name", () => {
        // ===== GIVEN
        const error = new errors.options.key.NotString("");

        // ===== WHEN
        const classConstructor = error.constructor;

        // ===== THEN
        expect(classConstructor).toStrictEqual(errors.options.key.NotString);
    });
});
