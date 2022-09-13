// MODULES
// Assertion
import { expect } from "chai";
// Localstorage simulation for Node.js
import { LocalStorage as nodeLocalStorage } from "node-localstorage";

// Tested function
import { exists } from "../src/main";

describe("exists() - Check if an entry exists", () => {
	// Initializing localstorage simulation
	before(() => {
		localStorage = new nodeLocalStorage(`${__dirname}/localstorage`);
	});

	// Empty the localstorage before each test.
	beforeEach(() => {
		localStorage.clear();
	});

	// Delete the localstorage after all test
	after(() => {
		localStorage._deleteLocation();
	});

	it("Should return 'true' if the entry exists", () => {
		localStorage.setItem("exists", "");

		expect(exists("exists")).to.be.true;
	});

	it("Should return 'false' if the entry doesn't exists", () => {
		expect(exists("notExists")).to.be.false;
	});

	it("The local storage's length should not change", () => {
		localStorage.setItem("test", "");

		expect(localStorage.length).to.be.equal(1);

		exists("test");
		expect(localStorage.length).to.be.equal(1);

		exists("notExists");
		expect(localStorage.length).to.be.equal(1);
	});
});
