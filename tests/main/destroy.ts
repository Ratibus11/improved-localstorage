// MODULES
// Assertion
import { expect } from "chai";
// Localstorage simulation for Node.js
import { LocalStorage as nodeLocalStorage } from "node-localstorage";

// TESTED FEATURES
import { MissingKey, KeyNotString } from "@src/errors";
import { destroy } from "@src/main";

describe("destroy() - Destroy a specific entry", () => {
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

	describe("key - Entry to destroy", () => {
		describe("Should throw 'MissingKey' if no provided", () => {
			it("With undefined", () => {
				expect(() => {
					destroy(undefined);
				}).to.throw(MissingKey);
			});

			it("With empty string", () => {
				expect(() => {
					destroy("");
				}).to.throw(MissingKey);
			});

			it("With null", () => {
				expect(() => {
					destroy(null);
				}).to.throw(MissingKey);
			});
		});

		describe("Should throw 'KeyNotString' if is not a string", () => {
			it("With false", () => {
				expect(() => {
					destroy(false as any);
				}).to.throw(KeyNotString);
			});

			it("With a number (1)", () => {
				expect(() => {
					destroy(1 as any);
				}).to.throw(KeyNotString);
			});

			it('With an object ({ test: "hi" })', () => {
				expect(() => {
					destroy({ test: "hi" } as any);
				}).to.throw(KeyNotString);
			});
		});
	});

	it("Should return 'true' if the entry exists before calling the function", () => {
		localStorage.setItem("test", "");

		expect(destroy("test")).to.be.true;
	});

	it("Should return 'false' if the entry doesn't before calling the function", () => {
		expect(destroy("test")).to.be.false;
	});
});
