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
import { exists } from "@src/main";

describe("exists() - Check if an entry exists.", () => {
    before(routines.before);
    beforeEach(routines.beforeEach);
    after(routines.after);

    describe("Options", () => {
        keyTests(exists);
    });

    describe("Function", () => {
        it("Should return `true` if the entry exists.", () => {
            const key = "exists";

            localStorage.setItem(key, '"hi"');

            expect(exists(key)).to.be.true;
        });

        it("Should return `false` if the entry don't exists.", () => {
            const key = "dontExists";

            expect(exists(key)).to.be.false;
        });
    });
});
