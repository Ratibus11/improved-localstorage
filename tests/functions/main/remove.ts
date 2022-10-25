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
import { remove } from "@src/main";

describe("remove(key) - Remove an entry with a specific key from the local storage.", () => {
    before(routines.before);
    beforeEach(routines.beforeEach);
    after(routines.after);

    describe("key - Entry's key.", () => {
        keyTests.shouldThrowError(remove, 0);
        keyTests.shouldThrowRangeError(remove, 0);
        keyTests.shouldThrowTypeError(remove, 0);
    });

    it("Should return `true` if the entry exists before removing it.", () => {
        localStorage.setItem("existing", '"null"');
        expect(remove("existing")).to.be.true;
    });

    it("Should return `false` if the entry don't exists before removing it.", () => {
        expect(remove("notExisting")).to.be.false;
    });

    it("The item should be removed", () => {
        const key = "test";

        localStorage.setItem("test", "");
        remove(key);
        expect(localStorage.getItem(key)).to.be.null;
    });
});
