import { describe, it, after } from "mocha";
import { existsSync } from "fs";
import { expect } from "chai";
import { stub } from "sinon";
import mock from "mock-fs";
import * as path from "path";

import { setup } from "../src/lib/setup";
import { MANIFEST_PATH } from "../src/lib/config/constants";
import { getManifest } from "../src/lib/manifest";

describe("@prakashraman/notes", () => {
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
