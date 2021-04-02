import * as inquirer from "inquirer";
import { mkdirSync, writeFileSync } from "fs";
import slugify from "slugify";

import { log, getAbsolutePath } from "../helpers";
import { NOTES_PATH } from "../config/constants";
import {
  getNextNoteId,
  getManifest,
  writeManifest,
  getNotes,
  getNote,
} from "../manifest";
import { Note } from "../typings";

/**
 * Sets up the folder 'notes/[year]/[month]/[date]'
 *
 * @return {*}  {string} relative path for the note folder
 */
const setupFolderForNote = (): string => {
  const now = new Date();
  const [year, month, date] = [
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ];
  const relativePath = `${NOTES_PATH}/${year}/${month}/${date}`;

  log.blue(`Creating folder structure for the note: ${relativePath} ...`);
  mkdirSync(getAbsolutePath(`${relativePath}`), {
    recursive: true,
  });
  log.success("Successfully created note container folder");

  return relativePath;
};

/**
 * Creates a new note by doing the following
 *
 * 1. Create a markdown file
 * 2. Place file in the dated folder
 * 3. Update the manifest file with the note
 *
 * @param {string} title
 * @return {*} {Note}
 */
const setupFreshNote = (title: string): Note => {
  if (!title) {
    log.error(
      "No title found. Not creating a note! Come back after coffee and try again."
    );
    return;
  }
  const id = getNextNoteId();
  const handle = slugify(`${id}-${title.toLowerCase()}`, { strict: true });
  const path = `${setupFolderForNote()}/${handle}.md`;

  log.blue(`Creating markdown file at ${path} ...`);
  writeFileSync(getAbsolutePath(path), "");
  log.success(`New file created at: ${path}`);

  const note: Note = {
    id,
    title,
    handle,
    path,
    createdAt: new Date(),
    publishedAt: new Date(),
  };

  const manifest = getManifest();

  writeManifest({
    ...manifest,
    notes: [...manifest.notes, note],
  });

  log.success("Successfully updated manifest with the new note");
  log.success("Open the file using your favorite editor and start typing!");

  return getNote(id);
};

/**
 * Creates the new note, by asking a series of very personal questions
 *
 */
const createNote = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "Title",
      },
    ])
    .then((answers) => {
      setupFreshNote(answers.title);
    });
};

/**
 * List all the notes
 *
 */
const listNotes = (): void => {
  const notes = getNotes();
  if (notes.length === 0) {
    return log.error("No notes found. Why not create your first one?");
  }

  log.success(`Found ${notes.length} note(s)`);

  notes.forEach((note) => {
    log.log(`[id: ${note.id}]: ${note.title}`);
  });
};

export { createNote, listNotes, setupFreshNote };
