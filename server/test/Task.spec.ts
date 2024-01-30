import { add } from "../src/Task";
import { assert } from "chai";

describe("Tests Addition", () => {
    it("should return 5 when 2 is added to 3", () => {
        const result = add(2,3);
        assert.equal(result,5);
    });
});