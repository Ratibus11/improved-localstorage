// MODULES
// Assertion
import { expect } from "chai";
import * as deepEql from "deep-eql";
// Localstorage simulation for Node.js
import { LocalStorage } from "node-localstorage";

// Tested function
import { get } from "../src/main";
import { CannotParseJson } from "../src/errors";

describe("get() - Get an entry", () => {
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

	it("Should return 'undefined' if the entry doesn't exists", () => {
		expect(get("test")).to.be.undefined;
	});

	it("Should return 'undefined' if the entry exists but is empty", () => {
		localStorage.setItem("test", "");
		expect(get("test")).to.be.undefined;
	});

	it("Should return 'undefined' if the entry exists but is null", () => {
		localStorage.setItem("test", "null");
		expect(get("test")).to.be.null;
	});

	it("Should throw 'CannotParseJson' if the entry exists but cannot be parsed", () => {
		localStorage.setItem("test", '{test:{hi:"everyone"}}');
		expect(() => {
			get("test");
		}).to.throw(CannotParseJson);
	});

	it("Should retrive correct value", () => {
		const values: { value: string; expected: any }[] = [
			{ value: "1", expected: 1 },
			{
				value: '{"test":{"hi":"everyone"}}',
				expected: { test: { hi: "everyone" } },
			},
			{
				value: "false",
				expected: false,
			},
		];

		values.forEach((value) => {
			localStorage.setItem("test", value.value);
			expect(deepEql(get("test"), value.expected)).to.be.true;
		});
	});

	it("The local storage's length should not change", () => {
		localStorage.setItem("test", "");

		expect(localStorage.length).to.be.equal(1);

		get("test");
		expect(localStorage.length).to.be.equal(1);

		get("notExists");
		expect(localStorage.length).to.be.equal(1);
	});

	it("Should not remove the element from the local storage if no error occurred and no destroy option was setted", () => {
		localStorage.setItem("test", "true");

		get("test");

		expect(localStorage.getItem("test")).to.be.not.null;
	});

	it("Should remove the element from the local storage after being loaded: '{ destroy: true }'", () => {
		localStorage.setItem("test", "true");

		get("test", { destroy: true });

		expect(localStorage.getItem("test")).to.be.null;
	});

	it("Should remove the element from the local storage if an error occurred: : '{ destroyOnError: true }'", () => {
		localStorage.setItem("test", "undefined");

		try {
			get("test", { destroyOnError: true });
		} catch {}

		expect(localStorage.getItem("test")).to.be.null;
	});
});
