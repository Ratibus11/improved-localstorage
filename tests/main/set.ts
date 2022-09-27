// MODULES
// Assertion
import { expect } from "chai";
// Localstorage simulation for Node.js
import { LocalStorage as nodeLocalStorage } from "node-localstorage";

// TESTED FEATURES
import {
	MissingKey,
	KeyNotString,
	MissingContent,
	CannotStringifyJson,
	UndefinedStringified,
} from "@src/errors";
import { set } from "@src/main";

describe("set() - Entry an entry", () => {
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

	describe("key - Key to set", () => {
		describe("Should throw 'MissingKey' if no provided", () => {
			it("With undefined", () => {
				expect(() => {
					set(undefined, "");
				}).to.throw(MissingKey);
			});

			it("With empty string", () => {
				expect(() => {
					set("", "");
				}).to.throw(MissingKey);
			});

			it("With null", () => {
				expect(() => {
					set(null, "");
				}).to.throw(MissingKey);
			});
		});

		describe("Should throw 'KeyNotString' if is not a string", () => {
			it("With false", () => {
				expect(() => {
					set(false as any, "");
				}).to.throw(KeyNotString);
			});

			it("With a number (1)", () => {
				expect(() => {
					set(1 as any, "");
				}).to.throw(KeyNotString);
			});

			it('With an object ({ test: "hi" })', () => {
				expect(() => {
					set({} as any, "");
				}).to.throw(KeyNotString);
			});
		});
	});

	describe("value - Setted value", () => {
		it("Should throw 'MissingContent' if no value is provided", () => {
			expect(() => {
				set("test", undefined);
			}).to.throw(MissingContent);
		});

		// No scenario where value can throw 'CannotStringifyJson'

		describe("Should throw 'UndefinedStringified' if the strigified value is undefined", () => {
			it("With symbol (Symbol())", () => {
				expect(() => {
					set("test", Symbol());
				}).to.throw(UndefinedStringified);
			});
		});
	});

	describe("Should retrieve the original value", () => {
		it("With true", () => {
			set("test", true);

			expect(localStorage.getItem("test")).to.be.equal("true");
		});

		it("With a number (1)", () => {
			set("test", 1);

			expect(localStorage.getItem("test")).to.be.equal("1");
		});

		it('With an object ({ test: "hi" })', () => {
			set("test", { test: "hi" });

			expect(localStorage.getItem("test")).to.be.equal('{"test":"hi"}');
		});

		it("With null", () => {
			set("test", null);

			expect(localStorage.getItem("test")).to.be.equal("null");
		});
	});
});
