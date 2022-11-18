import { describe, expect, test } from "@jest/globals";

// TESTED FEATURE
import { get, errors } from "@main";

describe("get() - Get an entry's value from the local storage", () => {
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
                        get(invalidKey);
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
                    get(invalidKey);
                };

                // THEN
                expect(functionThatShouldThrowEmptyString).toThrow(errors.options.key.EmptyString);
            });
        });

        describe("options", () => {
            test.each([undefined, null, new Date(), 0, false])(
                "%p not make the entry be delete",
                (invalidOptionArgument: any) => {
                    // GIVEN
                    const key = "a";
                    localStorage.setItem(key, "0");

                    // WHEN
                    get(key, invalidOptionArgument);

                    // THEN
                    expect(localStorage.getItem(key)).not.toBeNull;
                }
            );

            describe("destroy", () => {
                test.each([undefined, null, new Date(), 0, false, {}])(
                    "%p should not make the entry be deleted",
                    (nonTrueDestroyOptionArgument: any) => {
                        // GIVEN
                        const key = "a";
                        localStorage.setItem(key, "0");

                        // WHEN
                        get(key, { destroy: nonTrueDestroyOptionArgument });

                        // THEN
                        expect(localStorage.getItem(key)).not.toBeNull;
                    }
                );

                test("true should make the entry be deleted", () => {
                    // GIVEN
                    const key = "a";
                    localStorage.setItem(key, "0");

                    // WHEN
                    get(key, { destroy: true });

                    // THEN
                    expect(localStorage.getItem(key)).toBeNull;
                });
            });

            describe("destroyOnError", () => {
                test.each([undefined, null, new Date(), 0, false])(
                    "%p should not make the entry be deleted if an error occurred",
                    (nonTrueDestroyOptionArgument: any) => {
                        // GIVEN
                        const key = "a";
                        localStorage.setItem(key, "0");

                        // WHEN
                        try {
                            get(key, { destroyOnError: nonTrueDestroyOptionArgument });
                        } catch {}

                        // THEN
                        expect(localStorage.getItem(key)).not.toBeNull;
                    }
                );

                test("true should make the entry be deleted if an error occurred", () => {
                    // GIVEN
                    const key = "a";
                    localStorage.setItem(key, "0");

                    // WHEN
                    try {
                        get(key, { destroyOnError: true });
                    } catch {}

                    // THEN
                    expect(localStorage.getItem(key)).toBeNull;
                });
            });
        });
    });

    test.each([
        ["null", null],
        ["undefined", undefined],
        ["0", 0],
        ["false", false],
        [`{\"hi\":\"everyone\"}`, { hi: "everyone" }],
    ])("%p should retrive %p from the localstorage", (original: string, expected: any) => {
        // GIVEN
        const key = "a";
        localStorage.setItem(key, original);

        // WHEN
        const loadedValue = get(key);

        // THEN
        expect(loadedValue).toStrictEqual(expected);
    });

    test.each(["", "{hi:error}"])(
        "%p should throw a 'errors.entry.CannotParse'",
        (invalidValue: string) => {
            // GIVEN
            const key = "a";
            localStorage.setItem(key, invalidValue);

            // WHEN
            const functionThatShouldThrowCannotParse = () => {
                get(key);
            };

            // THEN
            expect(functionThatShouldThrowCannotParse).toThrow(errors.entry.CannotParse);
        }
    );
});
