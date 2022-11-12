// MODULES
// Assertion
import { expect } from "chai";

// TESTS UTILS
// Mocha routines
import * as routines from "@testsRoutines";

// TESTED FEATURES
import { clear } from "@src/main";

describe("clear() - Remove all local storage's entries.", () => {
    before(routines.before);
    beforeEach(routines.beforeEach);
    after(routines.after);

    describe("Should remove all items from the localstorage.", () => {
        const upToN = 2;

        for (let i = 0; i <= upToN; i++) {
            it(`With ${i} items`, () => {
                for (let j = 0; j <= i; j++) {
                    localStorage.setItem(i.toString(), i.toString());
                }

                clear();
                expect(localStorage.length).to.be.equal(0);
            });
        }
    });

    describe("Should return `true` if there is at least 1 item before calling the function.", () => {
        const upToN = 2;

        for (let i = 0; i <= upToN; i++) {
            it(`With ${i} items`, () => {
                for (let j = 0; j <= i; j++) {
                    localStorage.setItem(i.toString(), i.toString());
                }

                expect(clear()).to.be.true;
            });
        }
    });

    it("Should return `false` if there is no item before calling the function.", () => {
        expect(clear()).to.be.false;
    });
});
