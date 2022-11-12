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
import { exists } from "@src/main";

describe("exists(key) - Check if an entry with a specific key exists.", () => {
    before(routines.before);
    beforeEach(routines.beforeEach);
    after(routines.after);

    describe("key - Entry's key.", () => {
        keyTests.shouldThrowError(exists, 0);
        keyTests.shouldThrowRangeError(exists, 0);
        keyTests.shouldThrowTypeError(exists, 0);
    });

    it("Should return `true` if the entry exists.", () => {
        const key = "exists";
        localStorage.setItem(key, '"hi"');
        expect(exists(key)).to.be.true;
    });

    it("Should return `false` if the entry doesn't exists.", () => {
        const key = "doesntExists";
        expect(exists(key)).to.be.false;
    });
});
