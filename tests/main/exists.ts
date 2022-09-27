// MODULES
// Assertion
import { expect } from "chai";
// Localstorage simulation for Node.js
import { LocalStorage as nodeLocalStorage } from "node-localstorage";

// TESTED FEATURES
import { exists } from "@src/main";

describe("exists() - Check entry's existence", () => {
	before(() => {
		localStorage = new nodeLocalStorage(`${__dirname}/localstorage`);
	});
	beforeEach(() => {
		localStorage.clear();
	});
	after(() => {
		localStorage._deleteLocation();
	});

	// TESTS

	it("Should return 'true' if the entry exists", () => {
		localStorage.setItem("test", "");

		expect(exists("test")).to.be.true;
	});

	it("Should return 'false' if the entry doesn't exists", () => {
		expect(exists("test")).to.be.false;
	});
});
