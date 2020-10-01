import * as inquirer from "inquirer";
import { mkdirSync, writeFileSync } from "fs";
import slugify from "slugify";

import { log } from "./helpers";
import { NOTES_PATH } from "./constants";
import {
  getNextNoteId,
  getManifest,
  writeManifest,
  getNotes,
} from "./manifest";
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
 * Creates a new note by doing the following
 *
 * 1. Create a markdown file
 * 2. Place file in the dated folder
 * 3. Update the manifest file with the note
 *
 * @param {string} title
 * @param {string} author
 */
const setupFreshNote = (title: string, author: string): void => {
  if (!title) {
    log.error(
      "No title found. Not creating a note! Come back after coffee and try again."
    );
    return;
  }

  const handle = slugify(title.toLowerCase(), { strict: true });
  const path = `${setupFolderForNote()}/${handle}.md`;

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

  const manifest = getManifest();

  writeManifest({
    ...manifest,
    notes: [...manifest.notes, note],
  });

  log.success("Successfully updated manifest with the new note");
  log.success("Open the file using your favorite editor and start typing!");
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

export { createNote, listNotes };
