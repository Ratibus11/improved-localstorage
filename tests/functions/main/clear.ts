// MODULES
// Assertion
import { expect } from "chai";

// TESTS UTILS
// Mocha routines
import * as routines from "@tests/utils/setup";

// TESTED FEATURES
import { clear } from "@src/main";

describe("clear() - Remove all entries.", () => {
    before(routines.before);
    beforeEach(routines.beforeEach);
    after(routines.after);

    describe("Function", () => {
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
    });
});
