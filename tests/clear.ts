// MODULES
// Assertion
import { expect } from "chai";
// Localstorage simulation for Node.js
import { LocalStorage } from "node-localstorage";

// Tested function
import { clear } from "../src/main";

describe("clear() - Empty the local storage", () => {
	// Initializing localstorage simulation
	before(() => {
		localStorage = new LocalStorage(`${__dirname}/localstorage`);
	});

	// Empty the localstorage before each test.
	beforeEach(() => {
		localStorage.clear();
	});

	// Delete the localstorage after all test
	after(() => {
		localStorage._deleteLocation();
	});

	it("Should return 'true' if the local storage is not empty", () => {
		localStorage.setItem("test", "");

		expect(clear()).to.be.true;
	});

	it("Should return 'false' if the local storage is empty", () => {
		expect(clear()).to.be.false;
	});

	it("The local storage's length must be equal to 0 after being cleared", () => {
		localStorage.setItem("test1", "");
		localStorage.setItem("test2", "");

		clear();

		expect(localStorage.length).to.be.equal(0);
	});
});
