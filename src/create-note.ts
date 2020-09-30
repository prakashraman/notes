import * as inquirer from "inquirer";
import { mkdirSync, writeFileSync } from "fs";
import slugify from "slugify";

import { log } from "./helpers";
import { NOTES_PATH } from "./constants";

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
  console.log({ title, author, slug: slugify(title.toLowerCase()) });
  const handle = slugify(title, { strict: true });
  const path = `${setupFolderForNote()}/${handle}.md`;

  log.blue(`Creating markdown file at ${path} ...`);
  writeFileSync(path, "");
  log.success(`New file created at: ${path}`);
  log.log("Open the file using your favorite editor and start typing!");
};

/**
 * Creates the new note
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

export { createNote };
