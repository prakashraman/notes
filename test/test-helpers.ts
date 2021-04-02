import { setupFreshNote } from "../src/lib/notes/notes";
import { setupFreshPage } from "../src/lib/pages/pages";
import { Note } from "../src/lib/typings";

const createTestNote = (title: string): Note => {
  return setupFreshNote(title);
};

const createTestPage = (title: string): Note => {
  return setupFreshPage(title);
};

export { createTestNote, createTestPage };
