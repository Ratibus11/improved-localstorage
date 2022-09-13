// MODULES
// Assertion
import { expect } from "chai";
import * as deepEql from "deep-eql";
// Localstorage simulation for Node.js
import { LocalStorage as nodeLocalStorage } from "node-localstorage";

// Tested function
import { set } from "../src/main";
import {
	UndefinedStringified,
	MissingContent,
	CannotStringifyJson,
} from "../src/errors";

describe("set() - Set an entry", () => {
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
		//localStorage._deleteLocation();
	});

	it("Should parse correct values", () => {
		const values: { value: any; expected: string | undefined | null }[] = [
			{ value: 1, expected: "1" },
			{
				value: { test: { hi: "everyone" } },
				expected: `{\"test\":{\"hi\":\"everyone\"}}`,
			},
			{
				value: false,
				expected: "false",
			},
			{
				value: "",
				expected: '""',
			},
			{
				value: null,
				expected: "null",
			},
			{
				value: "test",
				expected: `\"test\"`,
			},
		];

		values.forEach((value) => {
			set("test", value.value);
			expect(deepEql(localStorage.getItem("test"), value.expected)).to.be
				.true;
		});
	});

	it("Should throw 'MissingContent' if no content is provided", () => {
		expect(() => {
			set("test", undefined as any);
		}).to.throw(MissingContent);
	});

	it("Should throw 'CannotStringifyJson' if the content cannot be parsed as JSON", () => {
		const invalidValues = [];

		invalidValues.forEach((invalidValue) => {
			expect(() => {
				set("test", invalidValue);
			}).to.throw(CannotStringifyJson);
		});
	});

	it("Should throw 'UndefinedStringified' if the content cannot be parsed as JSON", () => {
		const invalidValues = [Symbol("test")];

		invalidValues.forEach((invalidValue) => {
			expect(() => {
				set("test", invalidValue);
			}).to.throw(UndefinedStringified);
		});
	});
});
