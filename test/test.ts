import { describe, it, before, after } from "mocha";
import { readdirSync, existsSync } from "fs";
import { expect } from "chai";
import { stub } from "sinon";
import * as mock from "mock-fs";
import * as path from "path";

import { setup } from "../src/setup";
import { getAbsolutePath } from "../src/helpers";
import {
  CONTENTS_PATH,
  ROOT_PATH,
  MANIFEST_PATH,
} from "../src/config/constants";
import { getManifest } from "../src/manifest";
import { magentaBright } from "chalk";

describe("Write Lite", () => {
  const consoleStub = stub(console, "log");

  beforeEach(() => {
    mock({
      src: mock.load(path.resolve(__dirname, "../src")),
    });
  });

  after(() => {
    consoleStub.reset();
    mock.restore();
  });

  describe("Setup", () => {
    it("Will setup configuration", () => {
      setup();
      expect(existsSync(MANIFEST_PATH)).to.be.true;
    });

    it("will not setup if configuration is already present", () => {
      setup();
      try {
        setup();

        throw new Error("should not reach here");
      } catch (e) {
        expect(e.message.toLowerCase()).to.includes("configuration is present");
      }
    });
  });

  describe("Manifest", () => {
    it("can fetch the manifest", () => {
      setup();

      const manifest = getManifest();

      expect(manifest.createdAt).to.not.be.empty;
      expect(manifest.notes).to.be.empty;
    });
  });
});
