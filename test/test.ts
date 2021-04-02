import { describe, it, after } from "mocha";
import { existsSync } from "fs";
import { expect } from "chai";

import { setup } from "../src/lib/setup";
import { MANIFEST_PATH } from "../src/lib/config/constants";

describe("Setup", () => {
  it("Will setup configuration", () => {
    setup();
    expect(existsSync(MANIFEST_PATH)).to.be.true;
  });
});
