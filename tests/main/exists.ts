// MODULES
// Assertion
import { expect } from "chai";
// Localstorage simulation for Node.js
import { LocalStorage as nodeLocalStorage } from "node-localstorage";

// TESTED FEATURES
import { MissingKey, KeyNotString } from "@src/errors";
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

	describe("key - Entry to check its existence", () => {
		describe("Should throw 'MissingKey' if no provided", () => {
			it("With undefined", () => {
				expect(() => {
					exists(undefined);
				}).to.throw(MissingKey);
			});

			it("With empty string", () => {
				expect(() => {
					exists("");
				}).to.throw(MissingKey);
			});

			it("With null", () => {
				expect(() => {
					exists(null);
				}).to.throw(MissingKey);
			});
		});

		describe("Should throw 'KeyNotString' if is not a string", () => {
			it("With false", () => {
				expect(() => {
					exists(false as any);
				}).to.throw(KeyNotString);
			});

			it("With a number (1)", () => {
				expect(() => {
					exists(1 as any);
				}).to.throw(KeyNotString);
			});

			it('With an object ({ test: "hi" })', () => {
				expect(() => {
					exists({} as any);
				}).to.throw(KeyNotString);
			});
		});
	});

	it("Should return 'true' if the entry exists", () => {
		localStorage.setItem("test", "");

		expect(exists("test")).to.be.true;
	});

	it("Should return 'false' if the entry doesn't exists", () => {
		expect(exists("test")).to.be.false;
	});
});
