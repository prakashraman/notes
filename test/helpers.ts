import { describe, it } from "mocha";
import { expect, assert } from "chai";
import { existsSync } from "fs";

import { softMkdirSync, softWriteFileSync, log } from "../src/lib/helpers";

describe("Helpers", () => {
  it("can soft create folder", () => {
    softMkdirSync("test-folder");

    expect(existsSync("test-folder")).to.be.true;
  });

  it("wont crash while trying to create existing folder", () => {
    softMkdirSync("test-folder");

    assert.doesNotThrow(() => softMkdirSync("test-folder"));
  });

  it("can soft create file", () => {
    softWriteFileSync("test-file", "test-content");

    expect(existsSync("test-file")).to.be.true;
  });

  it("wont crash while trying to recreate an existing file", () => {
    softWriteFileSync("test-file", "test-content");

    assert.doesNotThrow(() => softWriteFileSync("test-file", "test-content"));
  });
});
