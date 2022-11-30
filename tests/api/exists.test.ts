import { describe, expect, test } from "@jest/globals";

// ===== TESTED FEATURES
import { exists, errors } from "@main";

describe("exists()", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    afterAll(() => {
        localStorage._deleteLocation();
    });

    describe("Arguments validity", () => {
        describe("key", () => {
            test.each([undefined, null, 0, false])(
                "It should throw a 'errors.options.key.NotString' if the key is %p.",
                async (invalidKey: any) => {
                    // ===== GIVEN
                    // invalidKey

                    // ===== WHEN
                    const functionThatShouldThrowNotString = () => {
                        exists(invalidKey);
                    };

                    // ===== THEN
                    expect(functionThatShouldThrowNotString).toThrow(errors.options.key.NotString);
                }
            );

            test("It should throw a 'errors.options.key.EmptyString' if the key is an empty string", () => {
                // ===== GIVEN
                const invalidKey: any = "";

                // ===== WHEN
                const functionThatShouldThrowEmptyString = () => {
                    exists(invalidKey);
                };

                // ===== THEN
                expect(functionThatShouldThrowEmptyString).toThrow(errors.options.key.EmptyString);
            });
        });
    });

    test("It should return true if an entry with the provided key exists", () => {
        // ===== GIVEN
        const key = "a";
        localStorage.setItem(key, "");

        // ===== WHEN
        const doEntryExists = exists(key);

        // ===== THEN
        expect(doEntryExists).toBeTruthy;
    });

    test("It should return false if an entry with the provided key doesn't exists", () => {
        // ===== GIVEN
        const key = "a";

        // ===== WHEN
        const doEntryExists = exists(key);

        // ===== THEN
        expect(doEntryExists).toBeFalsy;
    });
});
