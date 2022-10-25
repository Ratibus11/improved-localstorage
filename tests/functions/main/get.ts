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
import { get } from "@src/main";

describe("get() - Get an entry's content.", () => {
    before(routines.before);
    beforeEach(routines.beforeEach);
    after(routines.after);

    describe("Options", () => {
        keyTests(get);

        describe("options - Getter's options.", () => {
            describe("destroy - Destroy after being loaded (even if an error occurred).", () => {
                describe("It should ");
            });
            describe("destroy - Destroy if an error occurred.", () => {});
        });
    });

    describe("Function", () => {
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

                    if (typeof content === "object") {
                        expect(content).to.be.deep.equal(test.expected);
                    } else {
                        expect(content).to.be.equal(test.expected);
                    }
                });
            });
        });
    });
});
