// MODULES
// Assertion
import { expect } from "chai";

// TESTS UTILS
// Mocha routines
import * as routines from "@testsRoutines";

// OPTIONS
// key
import * as keyTests from "@testsOptions/key";

// TESTED FEATURES
import { set } from "@src/main";

describe("set(key, newValue) - Set a entry in the local storage.", () => {
    before(routines.before);
    beforeEach(routines.beforeEach);
    after(routines.after);

    describe("key - Entry's key.", () => {
        keyTests.shouldThrowError(set, 0);
        keyTests.shouldThrowRangeError(set, 0);
        keyTests.shouldThrowTypeError(set, 0);
    });

    describe("newValue - Value to set in the entry.", () => {});

    describe("Should retrive the expected value.", () => {
        const tests: { original: any; expected: string }[] = [
            { original: true, expected: "true" },
            { original: 1, expected: "1" },
            { original: undefined, expected: "undefined" },
            { original: null, expected: "null" },
            { original: Symbol(""), expected: "undefined" },
            {
                original: { hi: "everyone" },
                expected: '{"hi":"everyone"}',
            },
        ];

        tests.forEach((test) => {
            it(`Expects ${test.expected}`, () => {
                const key = "test";

                set(key, test.original);

                expect(localStorage.getItem(key)).to.be.equal(test.expected);
            });
        });
    });

    describe("Should throw an `Error` if it cannot be parsed as JSON", () => {
        it("With cyclic object", () => {
            const cyclicObject = { inside: {} };
            cyclicObject.inside = cyclicObject;

            expect(() => {
                set("test", cyclicObject);
            }).to.throw(Error);
        });
    });
});
