import { describe, expect, test } from "@jest/globals";

// ===== TESTED FEATURE
import { clear } from "@main";

describe("clear()", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    afterAll(() => {
        localStorage._deleteLocation();
    });

    test("It should empty the local storage", () => {
        // ===== GIVEN
        localStorage.setItem("a", "");
        localStorage.setItem("b", "");

        // ===== WHEN
        clear();

        // ===== THEN
        expect(localStorage.length).toStrictEqual(0);
    });

    test("It should return 'true' if there were at least one element in the local storage while calling the function", () => {
        // ===== GIVEN
        localStorage.setItem("a", "");
        localStorage.setItem("b", "");

        // ===== WHEN
        const wereElementsInLocalStorage = clear();

        // ===== THEN
        expect(wereElementsInLocalStorage).toBeTruthy;
    });
});
