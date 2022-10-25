// MODULES
// Assertion
import { expect } from "chai";

// Used to test key option's bevahariors on differents functions.
const tests = (functionToTest: (...args: any) => any) => {
    describe("key - Entry to remove's key.", () => {
        describe("Should throw a TypeError if the type is not a string.", () => {
            [null, undefined, 1, false, new Date()].forEach((invalidKey) => {
                it(`With ${invalidKey}`, () => {
                    expect(() => {
                        functionToTest(invalidKey as any);
                    }).to.throw(TypeError);
                });
            });
        });

        it("Should throw a RangeError if the key is an empty string.", () => {
            expect(() => {
                functionToTest("");
            }).to.throw(RangeError);
        });

        it("Should not throw any error if the entry is a non-empty string.", () => {
            expect(() => {
                functionToTest("entry");
            }).to.not.throw(Error);
        });
    });
};

export { tests };
