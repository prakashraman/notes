import { describe, it } from "mocha";
import { expect } from "chai";

import { setup } from "../src/lib/setup";
import { setStubInquirerPrompt } from "./test-helpers";
import { createPage, setupFreshPage } from "../src/lib/pages/pages";
import { getManifest } from "../src/lib/manifest";

describe("Pages", () => {
  it("can create page", (done) => {
    setup();
    setStubInquirerPrompt("title", "Hello World");

    createPage((note) => {
      expect(note.title).to.eq("Hello World");
      done();
    });
  });

  it("will not setup page with duplicate path", () => {
    setup();
    setupFreshPage("Hello world");

    expect(() => setupFreshPage("Hello world")).to.throw(
      "This page already exists. Maybe try choosing a different title, and try again."
    );
  });

  it("can create multiple pages", () => {
    setup();
    setupFreshPage("Hello world");
    setupFreshPage("Good morning");

    const pages = getManifest().pages;

    expect(pages[0].title).to.eq("Hello world");
    expect(pages[1].title).to.eq("Good morning");
  });
});
