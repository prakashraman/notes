import { describe, it } from "mocha";
import { expect, assert } from "chai";
import sinon from "sinon";
import { readdirSync, existsSync, writeFileSync, readFileSync } from "fs";

import { setup } from "../src/lib/setup";
import {
  getManifest,
  getNote,
  setTitle,
  writeTitleToManifest,
} from "../src/lib/manifest";
import {
  createTestNote,
  setStubInquirerPrompt,
  createTestNoteWithContent,
  createTestPage,
} from "./test-helpers";
import { createNote, setupFreshNote, listNotes } from "../src/lib/notes/notes";
import { build, clean, getNoteHtml, writeHTMLNote } from "../src/lib/build";
import { DIST_PATH, IMANIFEST_PATH } from "../src/lib/config/constants";
import {
  getDistFilePathForNote,
  getDistFullFilePathForNote,
} from "../src/lib/helpers";

describe("Build", () => {
  it("can clean dist", () => {
    setup();
    build();
    clean();

    expect(existsSync(DIST_PATH)).to.be.false;
  });

  it("will not crash when cleaning before build", () => {
    setup();

    assert.doesNotThrow(() => clean());
  });

  it("will create imanifest.json", () => {
    setup();
    writeTitleToManifest("Welcome to my website");
    build();

    expect(existsSync(IMANIFEST_PATH)).to.be.true;
  });

  it("can create html for note", () => {
    setup();

    const note = createTestNote("hello world");
    const html = getNoteHtml(note);

    expect(html).to.be.eq("");
  });

  it("can convert markdown to html", () => {
    setup();

    const note = createTestNoteWithContent(
      "hello world",
      "the ants go marching"
    );

    build();

    expect(existsSync(getDistFullFilePathForNote(note))).to.be.true;
    expect(existsSync(getDistFilePathForNote(note))).to.be.true;
  });

  it("can build pages", () => {
    setup();

    createTestPage("ants marching");
    build();

    expect(existsSync(IMANIFEST_PATH)).to.be.true;
  });
});
