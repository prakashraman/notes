import * as inquirer from "inquirer";
import { mkdirSync, writeFileSync } from "fs";
import slugify from "slugify";

import { log } from "./helpers";
import { NOTES_PATH } from "./constants";
import { getNextNoteId, getManifest, writeManifest } from "./manifest";
import { Note } from "./typings";

/**
 * Sets up the folder 'notes/[year]/[month]/[date]'
 *
 * @return {*}  {string} storage path for the note
 */
const setupFolderForNote = (): string => {
  const now = new Date();
  const [year, month, date] = [
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ];
  const path = `${NOTES_PATH}/${year}/${month}/${date}`;

  log.blue(`Creating folder structure for the note: ${path} ...`);
  mkdirSync(path, { recursive: true });
  log.success("Successfully created note container folder");

  return path;
};

/**
 * Create a markdown file with the handle in the dated folder
 *
 * @param {string} title
 * @param {string} author
 */
const setupFreshNote = (title: string, author: string): void => {
  const handle = slugify(title.toLowerCase(), { strict: true });
  const path = `${setupFolderForNote()}/${handle}.md`;

  console.log({ title, author, handle });

  log.blue(`Creating markdown file at ${path} ...`);
  writeFileSync(path, "");
  log.success(`New file created at: ${path}`);

  const note: Note = {
    id: getNextNoteId(),
    title: title,
    handle,
    path,
    createdAt: new Date(),
    publishedAt: new Date(),
  };

  log.log({ next: getNextNoteId(), man: getManifest() });

  const manifest = getManifest();

  writeManifest({
    ...manifest,
    notes: [...manifest.notes, note],
  });

  log.success("Successfully updated manifest with the new note");
  log.success("Open the file using your favorite editor and start typing!");
};

/**
 * Creates the new note
 *
 */
const createNote = () => {
  return setupFreshNote("this is nice", "prakash");
  inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "Title",
      },
      {
        name: "author",
        type: "input",
        default: "Prakash Raman",
        message: "Author",
      },
    ])
    .then((answers) => {
      setupFreshNote(answers.title, answers.author);
    });
};

export { createNote };
