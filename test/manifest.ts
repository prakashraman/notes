import { describe, it } from "mocha";
import { expect } from "chai";

import { setup } from "../src/lib/setup";
import {
  getManifest,
  getNotes,
  getNote,
  getPages,
  getNextNoteId,
  getNextPageId,
  getINotes,
  getIPages,
  getIManifest,
  setTitle,
} from "../src/lib/manifest";
import {
  createTestNote,
  createTestPage,
  stubInquirerPrompt,
} from "./test-helpers";

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

  it("will return 1 for the first page ID", () => {
    setup();
    expect(getNextPageId()).to.be.eq(1);
  });

  it("will return the next number in the series as page ID", () => {
    setup();
    createTestPage("About Me");
    expect(getNextPageId()).to.be.eq(2);
  });

  it("will return iNotes", () => {
    setup();
    createTestNote("Hello World");
    expect(getINotes()).to.be.eql([
      {
        id: 1,
        title: "Hello World",
        handle: "1-hello-world",
        path: "contents/notes/2000/0/1/1-hello-world.md",
        createdAt: "2000-01-01T00:00:00.000Z",
        publishedAt: "2000-01-01T00:00:00.000Z",
        relativePath: "./notes/full/1-hello-world.html",
        summary: "",
      },
    ]);
  });

  it("will return all iNotes", () => {
    setup();
    createTestNote("Hello World");
    createTestNote("About Me");

    expect(getINotes()).lengthOf(2);
  });

  it("will return an ipage", () => {
    setup();
    createTestPage("About Me");

    expect(getIPages()[0]).to.be.eql({
      id: 1,
      title: "About Me",
      handle: "about-me",
      path: "contents/pages/about-me.md",
      createdAt: "2000-01-01T00:00:00.000Z",
      publishedAt: "2000-01-01T00:00:00.000Z",
      relativePath: "./pages/about-me.html",
      summary: "About Me",
    });
  });

  it("will return the imanifest", () => {
    setup();

    expect(getIManifest()).to.be.eql({
      createdAt: "2000-01-01T00:00:00.000Z",
      notes: [],
      pages: [],
    });
  });

  it("can set the title of the blog", (done) => {
    setup();
    stubInquirerPrompt("title", "hello");

    setTitle((_title) => {
      expect(getIManifest().title).to.be.eq("hello");
      done();
    });
  });
});
