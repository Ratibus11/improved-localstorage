import { describe, expect, test } from "@jest/globals";

// TESTED FEATURE
import { set, errors } from "@main";

describe("set() - Set a value in the local storage", () => {
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
                    // GIVEN
                    // invalidKey

                    // WHEN
                    const functionThatShouldThrowNotString = () => {
                        set(invalidKey, null);
                    };

                    // THEN
                    expect(functionThatShouldThrowNotString).toThrow(errors.options.key.NotString);
                }
            );

            test("It should throw a 'errors.options.key.EmptyString' if the key is an empty string", () => {
                // GIVEN
                const invalidKey: any = "";

                // WHEN
                const functionThatShouldThrowEmptyString = () => {
                    set(invalidKey, null);
                };

                // THEN
                expect(functionThatShouldThrowEmptyString).toThrow(errors.options.key.EmptyString);
            });
        });
    });

    test.each([
        [true, "true"],
        [0, "0"],
        [undefined, "undefined"],
        [null, "null"],
        [{ hi: "everyone" }, '{"hi":"everyone"}'],
        [Symbol(""), "undefined"],
    ])("%p should set %p in the localstorage", async (original: any, expected: string) => {
        // GIVEN
        const key = "a";

        // WHEN
        set(key, original);

        // THEN
        expect(localStorage.getItem(key)).toStrictEqual(expected);
    });

    test.each([
        (() => {
            const value = { internal: {} };
            value.internal = value;
            return value;
        })(),
        BigInt(1),
    ])("%p should throw a 'errors.entry.CannotStringify'", async (invalidValue: any) => {
        // GIVEN
        const key = "a";

        // WHEN
        const functionThatShouldThrowCannotStringify = () => {
            set(key, invalidValue);
        };

        // THEN
        expect(functionThatShouldThrowCannotStringify).toThrow(errors.entry.CannotStringify);
    });
});
