// MODULES
// Assertion
import { expect } from "chai";
// Localstorage simulation for Node.js
import { LocalStorage as nodeLocalStorage } from "node-localstorage";

// TESTED FEATURES
import { clear } from "@src/main";

describe("clear() - Destroy all entries", () => {
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

	it("Should return 'false' is there is no entry before calling the function", () => {
		expect(clear()).to.be.false;
	});

	it("Should return 'true' is there is at least one entry before calling the function", () => {
		localStorage.setItem("1", "");
		localStorage.setItem("2", "");

		expect(clear()).to.be.true;
	});
});
