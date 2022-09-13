// MODULES
// Assertion
import { expect } from "chai";
// Localstorage simulation for Node.js
import { LocalStorage as nodeLocalStorage } from "node-localstorage";

// Tested function
import { destroy } from "../src/main";

describe("destroy() - Remove an entry", () => {
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

		expect(destroy("exists")).to.be.true;
	});

	it("Should return 'false' if the entry doesn't exists", () => {
		expect(destroy("notExists")).to.be.false;
	});

	it("The local storage's length should be reduced by one if an entry has been is deleted", () => {
		localStorage.setItem("test1", "");
		localStorage.setItem("test2", "");

		expect(() => {
			destroy("test2");
		})
			.to.decrease(() => {
				return localStorage.length;
			})
			.by(1);
	});

	it("The local storage's length should not be changed if no entry has been deleted", () => {
		localStorage.setItem("test", "");

		expect(() => {
			destroy("test1");
		}).to.not.change(() => {
			return localStorage.length;
		});
	});
});
