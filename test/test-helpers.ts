import inquirer from "inquirer";
import { stub } from "sinon";
import { setupFreshNote } from "../src/lib/notes/notes";
import { setupFreshPage } from "../src/lib/pages/pages";
import { Note } from "../src/lib/typings";

const inquirerPromptStub = stub(inquirer, "prompt");

const createTestNote = (title: string): Note => {
  return setupFreshNote(title);
};

const createTestPage = (title: string): Note => {
  return setupFreshPage(title);
};

const setStubInquirerPrompt = (key: string, value: string) => {
  inquirerPromptStub.resolves({ [key]: value });
};

export { createTestNote, createTestPage, setStubInquirerPrompt };
