// MODULES
// Assertion
import { expect } from "chai";

// TESTED FEATURES
import { errors } from "@main";

const shouldThrowTypeError = (
    functionToTest: (...args: any) => any,
    keyIndex: number,
    ...args: any[]
) => {
    describe("Should throw a `NotString` if the type is not a string.", () => {
        [null, undefined, 1, false, new Date()].forEach((invalidKey) => {
            const splicedArgs = [...args];
            splicedArgs.splice(keyIndex, 0, invalidKey);

            it(`With ${invalidKey}`, () => {
                expect(() => {
                    functionToTest.apply(this, splicedArgs as any);
                }).to.throw(errors.options.key.NotString);
            });
        });
    });
};

const shouldThrowRangeError = (
    functionToTest: (...args: any) => any,
    keyIndex: number,
    ...args: any[]
) => {
    it("Should throw a `EmptyString` if the key is an empty string.", () => {
        const splicedArgs = [...args];
        splicedArgs.splice(keyIndex, 0, "");

        expect(() => {
            functionToTest.apply(this, splicedArgs as any);
        }).to.throw(errors.options.key.EmptyString);
    });
};
const shouldThrowError = (
    functionToTest: (...args: any) => any,
    keyIndex: number,
    ...args: any[]
) => {
    const splicedArgs = [...args];
    splicedArgs.splice(keyIndex, 0, "entry");

    it("Should not throw any error if the entry is a non-empty string.", () => {
        expect(() => {
            functionToTest.apply(this, splicedArgs as any);
        }).to.not.throw(Error);
    });
};

export { shouldThrowError, shouldThrowTypeError, shouldThrowRangeError };
