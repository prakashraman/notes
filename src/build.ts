import {
  rmdirSync,
  existsSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
} from "fs";
import * as showdown from "showdown";
import * as path from "path";

import { log, getAbsolutePath } from "./helpers";
import { getIManifest } from "./manifest";
import { DIST_PATH, DIST_NOTES_PATH, IMANIFEST_PATH } from "./config/constants";
import { Note } from "./typings";

/**
 * Cleans the dist folder of all remnants
 *
 */
const clean = () => {
  log.blue("Attempting to clean build");
  const path = getAbsolutePath(DIST_PATH);

  if (existsSync(path)) {
    rmdirSync(getAbsolutePath(DIST_PATH), { recursive: true });
    return log.success(`Successfully cleaned build ${DIST_PATH} ...`);
  }

  log.success("No existing build folder present. Skipping ...");
};

/**
 * Write a fresh IManifest file. Expected to be consumed via HTTP
 *
 */
const writeIManifest = () => {
  const iManifest = getIManifest();

  log.blue("Writing iManifest file ...");
  writeFileSync(
    getAbsolutePath(IMANIFEST_PATH),
    JSON.stringify(iManifest, null, 2)
  );
  log.success(`Successfully created iManifest file at ${IMANIFEST_PATH}`);
};

/**
 * Converts the note's mardown into HTML and write to a file in
 * build folder
 *
 * @param {Note} note
 */
const writeHTMLNote = (note: Note) => {
  log.blue(`Converting markdown to HTML for ${note.path} ...`);

  const md = readFileSync(getAbsolutePath(note.path), { encoding: "utf-8" });
  const html = new showdown.Converter().makeHtml(md);

  log.success(`Successfully converted to HTML`);

  const filePath = `${DIST_NOTES_PATH}/${path.parse(note.path).name}.html`;

  log.blue(`Writing HTML file ${filePath} ...`);
  writeFileSync(getAbsolutePath(filePath), html);
  log.success(`Successfully create HTML file at ${filePath} ...`);
};

/**
 * Iterates over all the notes and converts to HTML
 *
 */
const writeHTMLNotes = () => {
  getIManifest().notes.forEach((note) => writeHTMLNote(note));
};

/**
 * Entry point to the build process. Cleans the build folder and recreates it.
 * Ideally should be run on the CD flow and build folder is to be
 * pushed to a publicly accessible server
 *
 */
const build = () => {
  clean();

  log.blue("Building notes\nCreating build folder");
  mkdirSync(getAbsolutePath(DIST_NOTES_PATH), { recursive: true });
  log.success(`Created build folder at ${DIST_PATH} ...`);

  writeIManifest();
  writeHTMLNotes();
};

export { build };
