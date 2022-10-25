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
import { remove } from "@src/main";

describe("remove() - Remove a specific entry.", () => {
    before(routines.before);
    beforeEach(routines.beforeEach);
    after(routines.after);

    describe("Options", () => {
        keyTests(remove);
    });

    describe("Function", () => {
        it("Should return `true` if the entry exists before removing it.", () => {
            localStorage.setItem("existing", '"null"');

            expect(remove("existing")).to.be.true;
        });

        it("Should return `false` if the entry don't exists before removing it.", () => {
            expect(remove("notExisting")).to.be.false;
        });
    });
});
