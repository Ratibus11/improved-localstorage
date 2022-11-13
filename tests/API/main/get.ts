// MODULES
// Assertion
import { expect } from "chai";

// TESTS UTILS
// Mocha routines
import * as routines from "@testsRoutines";

// OPTIONS
// key
import * as keyTests from "@testsArguments/key";

// TESTED FEATURES
import { get, errors } from "@main";

describe("get(key[, options]) - Get an entry from the local storage.", () => {
    before(routines.before);
    beforeEach(routines.beforeEach);
    after(routines.after);

    describe("key - Entry's key.", () => {
        keyTests.shouldThrowError(get, 0);
        keyTests.shouldThrowRangeError(get, 0);
        keyTests.shouldThrowTypeError(get, 0);
    });

    describe("options - Getter's options", () => {
        describe("destroy - If strictly `true`, is destroyed after being loaded (even if an error occurred).", () => {
            describe("Should not destroy the item if not strictly `true`.", () => {
                const willBeFalse = ["true", 1, false, {}, undefined, null];

                willBeFalse.forEach((falseElement) => {
                    it(`With ${falseElement}`, () => {
                        const key = "test";
                        localStorage.setItem(key, "null");
                        get(key, { destroy: falseElement as any });
                        expect(localStorage.getItem(key)).to.be.not.null;
                    });
                });
            });

            describe("Should not destroy the item if `options` is not correctly setted", () => {
                const willBeFalse = ["true", 1, false, undefined, null];

                willBeFalse.forEach((falseElement) => {
                    it(`With ${falseElement}`, () => {
                        const key = "test";
                        localStorage.setItem(key, "null");
                        get(key, falseElement as any);
                        expect(localStorage.getItem(key)).to.be.not.null;
                    });
                });
            });

            it("Should destroy the item if strictly `true`.", () => {
                const key = "test";
                localStorage.setItem(key, "null");
                get(key, { destroy: true });
                expect(localStorage.getItem(key)).to.be.null;
            });
        });

        describe("destroyOnError - If strictly `true`, is destroyed only if an error occurred.", () => {
            describe("Should not destroy the item if not strictly `true`.", () => {
                const willBeFalse = ["true", 1, false, {}, undefined, null];

                willBeFalse.forEach((falseElement) => {
                    it(`With ${falseElement}`, () => {
                        const key = "test";
                        localStorage.setItem(key, "");

                        try {
                            get(key, {
                                destroyOnError: falseElement as any,
                            });
                        } catch {}

                        expect(localStorage.getItem(key)).to.be.not.null;
                    });
                });
            });

            describe("Should not destroy the item on error if `options` is not correctly setted", () => {
                const willBeFalse = ["true", 1, false, undefined, null];

                willBeFalse.forEach((falseElement) => {
                    it(`With ${falseElement}`, () => {
                        const key = "test";
                        localStorage.setItem(key, "");

                        try {
                            get(key, falseElement as any);
                        } catch {}

                        expect(localStorage.getItem(key)).to.be.not.null;
                    });
                });
            });

            it("Should destroy the item if strictly `true`.", () => {
                const key = "test";
                localStorage.setItem(key, "");

                try {
                    get(key, { destroyOnError: true });
                } catch {}

                expect(localStorage.getItem(key)).to.be.null;
            });
        });
    });

    describe("Should retrive the expected value.", () => {
        const tests: { expected: any; original: string }[] = [
            { expected: true, original: "true" },
            { expected: 1, original: "1" },
            { expected: undefined, original: "undefined" },
            { expected: null, original: "null" },
            {
                expected: { hi: "everyone" },
                original: '{"hi":"everyone"}',
            },
        ];

        tests.forEach((test) => {
            it(`From ${test.original}`, () => {
                const key = "test";
                localStorage.setItem(key, test.original);
                const content = get(key);
                expect(content).to.be.deep.equal(test.expected);
            });
        });
    });

    it("Should throw a `CannotParse` if the content cannot be parsed from JSON.", () => {
        const key = "test";
        localStorage.setItem(key, "");

        expect(() => {
            get(key);
        }).to.throw(errors.entry.CannotParse);
    });
});
