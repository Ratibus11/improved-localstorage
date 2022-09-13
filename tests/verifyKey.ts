// MODULES
// Assertion
import { expect } from "chai";
// Localstorage simulation for Node.js
import { LocalStorage as nodeLocalStorage } from "node-localstorage";
// Accessing private function
import * as rewire from "rewire";

// Tested function
const improvedLocalstorage = rewire("../src/main.ts"),
	verifyKey = improvedLocalstorage.__get__("verifyKey");
import { MissingKey, KeyNotString } from "../src/errors";

describe("verifyKey() - Verify a key's validity", () => {
	it("Should throw a 'MissingKey' error if no entry's key is provided or the key is empty", () => {
		const invalidValues = [undefined, "", null];

		invalidValues.forEach((invalidValue) => {
			expect(() => {
				verifyKey(invalidValue as any);
			}).to.throw(MissingKey);
		});
	});

	it("Should throw a 'KeyNotString' error if the entry's key is not a string", () => {
		const invalidValues = [{ notAccepted: true }, 1, true, new Date()];

		invalidValues.forEach((invalidValue) => {
			expect(() => {
				improvedLocalstorage.__get__("verifyKey")(invalidValue as any);
			}).to.throw(KeyNotString);
		});
	});

	it("Should do nothing is the entry's key is a non-empty string", () => {
		const validValues = ["test"];

		validValues.forEach((validValue) => {
			expect(improvedLocalstorage.__get__("verifyKey")(validValue as any))
				.to.be.undefined;
		});
	});
});
