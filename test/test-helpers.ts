import { writeFileSync } from "fs";

import inquirer from "inquirer";
import { stub } from "sinon";
import { setupFreshNote } from "../src/lib/notes/notes";
import { setupFreshPage } from "../src/lib/pages/pages";
import { Note } from "../src/lib/typings";

const inquirerPromptStub = stub(inquirer, "prompt");

/**
 * Creates a page and set the title
 *
 * @param {string} title
 * @return {*}  {Note}
 */
const createTestNote = (title: string): Note => {
  return setupFreshNote(title);
};

/**
 * Creates a note and set the title and content
 *
 * @param {string} title
 * @param {string} content
 * @return {*}  {Note}
 */
const createTestNoteWithContent = (title: string, content: string): Note => {
  const note = createTestNote(title);

  writeFileSync(note.path, content);

  return note;
};

/**
 * Creates a page and set the title
 *
 * @param {string} title
 * @return {*}  {Note}
 */
const createTestPage = (title: string): Note => {
  return setupFreshPage(title);
};

const setStubInquirerPrompt = (key: string, value: string) => {
  inquirerPromptStub.resolves({ [key]: value });
};

export {
  createTestNote,
  createTestPage,
  setStubInquirerPrompt,
  createTestNoteWithContent,
};
