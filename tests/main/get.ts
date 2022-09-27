// MODULES
// Assertion
import { expect } from "chai";
// Localstorage simulation for Node.js
import { LocalStorage as nodeLocalStorage } from "node-localstorage";

// TESTED FEATURES
import { MissingKey, KeyNotString, CannotParseJson } from "@src/errors";
import { get } from "@src/main";

describe("get() - Get an entry", () => {
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

	describe("key - Entry to get", () => {
		describe("Should throw 'MissingKey' if no provided", () => {
			it("With undefined", () => {
				expect(() => {
					get(undefined);
				}).to.throw(MissingKey);
			});

			it("With empty string", () => {
				expect(() => {
					get("");
				}).to.throw(MissingKey);
			});

			it("With null", () => {
				expect(() => {
					get(null);
				}).to.throw(MissingKey);
			});
		});

		describe("Should throw 'KeyNotString' if is not a string", () => {
			it("With false", () => {
				expect(() => {
					get(false as any);
				}).to.throw(KeyNotString);
			});

			it("With a number (1)", () => {
				expect(() => {
					get(1 as any);
				}).to.throw(KeyNotString);
			});

			it('With an object ({ test: "hi" })', () => {
				expect(() => {
					get({} as any);
				}).to.throw(KeyNotString);
			});
		});
	});

	describe("options - Getter's options", () => {
		describe("options.destroy", () => {
			it("Should remove the entry after being loaded if is strictly equal to 'true'", () => {
				localStorage.setItem("test", "");
				get("test", { destroy: true });

				expect(localStorage.getItem("test")).to.be.null;
			});

			describe("Should not remove the entry after being loaded if is strictly different to 'true'", () => {
				it("With false", () => {
					localStorage.setItem("test", "");
					get("test", { destroy: false });

					expect(localStorage.getItem("test")).to.be.not.null;
				});

				it("With null", () => {
					localStorage.setItem("test", "");
					get("test", { destroy: null });

					expect(localStorage.getItem("test")).to.be.not.null;
				});

				it("With undefined", () => {
					localStorage.setItem("test", "");
					get("test", { destroy: undefined });

					expect(localStorage.getItem("test")).to.be.not.null;
				});

				it("With a number (1)", () => {
					localStorage.setItem("test", "");
					get("test", { destroy: 1 as any });

					expect(localStorage.getItem("test")).to.be.not.null;
				});

				it("With an empty string", () => {
					localStorage.setItem("test", "");
					get("test", { destroy: "" as any });

					expect(localStorage.getItem("test")).to.be.not.null;
				});

				it('With a string ("test")', () => {
					localStorage.setItem("test", "");
					get("test", { destroy: "test" as any });

					expect(localStorage.getItem("test")).to.be.not.null;
				});

				it('With an object ({ test: "hi"})', () => {
					localStorage.setItem("test", "");
					get("test", { destroy: { test: "hi" } as any });

					expect(localStorage.getItem("test")).to.be.not.null;
				});
			});
		});
		describe("options.destroyOnError", () => {
			it("Should remove the entry if it cannot be parsed if is strictly equal to 'true'", () => {
				localStorage.setItem("test", '{test:"hi" }');
				try {
					get("test", { destroyOnError: true });
				} catch {}

				expect(localStorage.getItem("test")).to.be.null;
			});

			describe("Should not remove the entry if it cannot be parsed if is strictly different to 'true'", () => {
				it("With false", () => {
					localStorage.setItem("test", '{test:"hi"}');
					try {
						get("test", { destroyOnError: false });
					} catch {}

					expect(localStorage.getItem("test")).to.be.not.null;
				});

				it("With null", () => {
					localStorage.setItem("test", '{test:"hi"}');
					try {
						get("test", { destroyOnError: null });
					} catch {}

					expect(localStorage.getItem("test")).to.be.not.null;
				});

				it("With undefined", () => {
					localStorage.setItem("test", '{test:"hi"}');
					try {
						get("test", { destroyOnError: undefined });
					} catch {}

					expect(localStorage.getItem("test")).to.be.not.null;
				});

				it("With a number (1)", () => {
					localStorage.setItem("test", '{test:"hi"}');
					try {
						get("test", { destroyOnError: 1 as any });
					} catch {}

					expect(localStorage.getItem("test")).to.be.not.null;
				});

				it("With an empty string", () => {
					localStorage.setItem("test", '{test:"hi"}');
					try {
						get("test", { destroyOnError: "" as any });
					} catch {}

					expect(localStorage.getItem("test")).to.be.not.null;
				});

				it('With a string ("test")', () => {
					localStorage.setItem("test", '{test:"hi"}');
					try {
						get("test", { destroyOnError: "test" as any });
					} catch {}

					expect(localStorage.getItem("test")).to.be.not.null;
				});

				it('With an object ({ test: "hi" })', () => {
					localStorage.setItem("test", "");
					get("test", { destroyOnError: { test: "hi" } as any });

					expect(localStorage.getItem("test")).to.be.not.null;
				});
			});
		});
	});

	describe("Should throw 'CannotParseJson' if the entry cannot be parsed", () => {
		it('With invalid object ({test:"hi"})', () => {
			localStorage.setItem("test", '{test:"hi"}');

			expect(() => {
				get("test");
			}).to.throw(CannotParseJson);
		});

		it("With undefined", () => {
			localStorage.setItem("test", "undefined");

			expect(() => {
				get("test");
			}).to.throw(CannotParseJson);
		});
	});

	describe("Should retrive the original value", () => {
		it("With true", () => {
			localStorage.setItem("test", "true");

			expect(get("test")).to.be.true;
		});

		it("With a number (1)", () => {
			localStorage.setItem("test", "1");

			expect(get("test")).to.be.equal(1);
		});

		it('With an object ({ test: "hi" })', () => {
			localStorage.setItem("test", '{"test":"hi"}');

			expect(get("test")).to.be.deep.equal({ test: "hi" });
		});

		it("With null", () => {
			localStorage.setItem("test", "null");

			expect(get("test")).to.be.null;
		});
	});

	it("Should return 'undefined' if the entry doesn't exists", () => {
		expect(get("test")).to.be.undefined;
	});
});
