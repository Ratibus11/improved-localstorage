import { describe, expect, test } from "@jest/globals";

// ===== TESTED FEATURE
import { remove, errors } from "@main";

describe("remove() - Remove a specific entry from the local storage", () => {
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
                        remove(invalidKey);
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
                    remove(invalidKey);
                };

                // ===== THEN
                expect(functionThatShouldThrowEmptyString).toThrow(errors.options.key.EmptyString);
            });
        });
    });

    test("It should remove the element from the local storage", () => {
        // ===== GIVEN
        const key = "a";
        localStorage.setItem(key, "");

        // ===== WHEN
        remove(key);

        // ===== THEN
        expect(localStorage.getItem(key)).toBeNull;
    });

    test("It shouldn't remove the element if the key is not the same as the entry", () => {
        // ===== GIVEN
        const entryKey = "a";
        const removeKey = "b";
        expect(entryKey).not.toStrictEqual(removeKey);
        localStorage.setItem(entryKey, "");

        // ===== WHEN
        remove(removeKey);

        // ===== THEN
        expect(localStorage.getItem(entryKey)).not.toBeNull;
    });

    test("It should return true if the entry exists while calling the function", () => {
        // ===== GIVEN
        const key = "a";
        localStorage.setItem(key, "");

        // ===== WHEN
        const wasRemoved = remove(key);

        // ===== THEN
        expect(wasRemoved).toBeTruthy;
    });

    test("It should return false if the entry doesn't exists while calling the function", () => {
        // ===== GIVEN
        const key = "a";

        // ===== WHEN
        const wasRemoved = remove(key);

        // ===== THEN
        expect(wasRemoved).toBeFalsy;
    });
});
