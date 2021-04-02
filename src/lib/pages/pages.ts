import * as inquirer from "inquirer";
import slugify from "slugify";
import { existsSync, writeFileSync } from "fs";

import { getNextPageId, getManifest, writeManifest } from "../manifest";
import { PAGES_PATH } from "../config/constants";
import { getAbsolutePath, log } from "../helpers";
import { Note } from "../typings";

/**
 * Creates the new note, by asking a series of very personal questions
 *
 */
const createPage = (cb: (note: Note) => void) => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "Title",
      },
    ])
    .then((answers) => {
      const note = setupFreshPage(answers.title);
      cb(note);
    });
};

const setupFreshPage = (title: string): Note => {
  const id = getNextPageId();
  const handle = slugify(title.toLowerCase(), { strict: true });
  const path = `${PAGES_PATH}/${handle}.md`;

  if (existsSync(path)) {
    throw new Error(
      "This page already exists. Maybe try choosing a different title, and try again."
    );
  }

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
    pages: [...(manifest.pages ?? []), note],
  });

  return note;
};

export { createPage, setupFreshPage };
