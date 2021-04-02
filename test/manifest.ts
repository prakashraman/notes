import { describe, it } from "mocha";
import { expect } from "chai";

import { setup } from "../src/lib/setup";
import {
  getManifest,
  getNotes,
  getNote,
  getPages,
  getNextNoteId,
} from "../src/lib/manifest";
import { createTestNote, createTestPage } from "./test-helpers";

describe("Manifest", () => {
  it("can fetch the manifest", () => {
    setup();

    const manifest = getManifest();

    expect(manifest.createdAt).to.not.be.empty;
    expect(manifest.notes).to.be.empty;
  });

  it("can return notes", () => {
    setup();

    expect(getNotes()).to.be.lengthOf(0);
  });

  it("can return note by id", () => {
    setup();
    const note = createTestNote("Hello World"); // expects to create a note with ID=1

    expect(note.id).to.eq(1);
    expect(getNote(1).title).to.be.eq("Hello World");
  });

  it("will throw error if note is not found", () => {
    setup();

    expect(() => {
      getNote(1);
    }).to.throw("Did not find Note with ID 1");
  });

  it("will return blank array of pages when no pages are present", () => {
    setup();

    expect(getPages()).to.be.eql([]);
  });

  it("will return pages", () => {
    setup();
    createTestPage("About Me");
    expect(getPages()).to.be.lengthOf(1);
  });

  it("will return 1 for the first note ID", () => {
    setup();
    expect(getNextNoteId()).to.be.eq(1);
  });

  it("will return the next number in the series as note ID", () => {
    setup();
    createTestNote("Hello world");
    expect(getNextNoteId()).to.be.eq(2);
  });
});
