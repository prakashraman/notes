import { describe, it } from "mocha";
import { expect } from "chai";
import sinon from "sinon";

import { setup } from "../src/lib/setup";
import { getManifest } from "../src/lib/manifest";
import { createTestNote, setStubInquirerPrompt } from "./test-helpers";
import { createNote, setupFreshNote, listNotes } from "../src/lib/notes/notes";
import { log } from "../src/lib/helpers";

describe("Notes", () => {
  it("can create note", (done) => {
    setup();
    setStubInquirerPrompt("title", "Hello World");

    createNote((note) => {
      expect(note).to.eql({
        id: 1,
        title: "Hello World",
        handle: "1-hello-world",
        path: "contents/notes/2000/0/1/1-hello-world.md",
        createdAt: "2000-01-01T00:00:00.000Z",
        publishedAt: "2000-01-01T00:00:00.000Z",
      });

      done();
    });
  });

  it("can list notes", () => {
    setup();
    createTestNote("Hello world");
    createTestNote("Good morning");

    const notes = getManifest().notes;

    expect(notes[0].title).to.be.eq("Hello world");
    expect(notes[1].title).to.be.eq("Good morning");
    expect(notes).to.be.lengthOf(2);
  });

  it("wont setup note without a title", () => {
    setup();
    setupFreshNote("Hello world");

    expect(() => setupFreshNote("")).to.throw(
      "You cannot create a note without a title"
    );
  });

  it("will list notes", () => {
    const spy = sinon.spy(log, "success");

    setup();

    createTestNote("Hello world");
    createTestNote("Good morning");
    listNotes();

    expect(spy.called).to.be.true;
  });

  it("will display error when no notes are present", () => {
    const spy = sinon.spy(log, "error");

    setup();
    listNotes();

    expect(spy.calledOnce).to.be.true;
  });
});
