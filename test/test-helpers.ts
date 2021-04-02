import inquirer from "inquirer";
import { stub } from "sinon";
import { setupFreshNote } from "../src/lib/notes/notes";
import { setupFreshPage } from "../src/lib/pages/pages";
import { Note } from "../src/lib/typings";

const createTestNote = (title: string): Note => {
  return setupFreshNote(title);
};

const createTestPage = (title: string): Note => {
  return setupFreshPage(title);
};

const stubInquirerPrompt = (key: string, value: string) => {
  stub(inquirer, "prompt")
    .onCall(0)
    .resolves({ [key]: value });
};

export { createTestNote, createTestPage, stubInquirerPrompt };
