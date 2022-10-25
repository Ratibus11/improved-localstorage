// MODULES
// Assertion
import { expect } from "chai";

// TESTS UTILS
// Mocha routines
import * as routines from "@tests/utils/setup";

// OPTIONS
// key
import { tests as keyTests } from "@tests/options/key";

// TESTED FEATURES
import { set } from "@src/main";

describe("set() - Set an entry's value.", () => {
    before(routines.before);
    beforeEach(routines.beforeEach);
    after(routines.after);

    describe("Options", () => {
        keyTests(set);
    });

    describe("Function", () => {
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

                    expect(localStorage.getItem(key)).to.be.equal(
                        test.expected
                    );
                });
            });
        });
    });
});
