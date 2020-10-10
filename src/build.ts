import {
  rmdirSync,
  existsSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
} from "fs";
import * as showdown from "showdown";
import * as path from "path";
import * as Handlebars from "handlebars";
import * as stripHtml from "string-strip-html";

import { log, getAbsolutePath } from "./helpers";
import { getIManifest } from "./manifest";
import {
  DIST_PATH,
  DIST_HOMEPAGE_PATH,
  FOOTER_PATH,
  HEADER_PATH,
  DIST_NOTES_PATH,
  IMANIFEST_PATH,
  DIST_FULL_NOTES_PATH,
} from "./config/constants";
import { Note } from "./typings";

const TEMPLATE = {
  layout: Handlebars.compile(
    readFileSync(`${__dirname}/config/templates/layout.hbs`, {
      encoding: "utf-8",
    })
  ),
  notes: Handlebars.compile(
    readFileSync(`${__dirname}/config/templates/notes.hbs`, {
      encoding: "utf-8",
    })
  ),
};
const SHOWDOWN_CONVERTER = new showdown.Converter();
const HTML = {
  header: SHOWDOWN_CONVERTER.makeHtml(
    readFileSync(getAbsolutePath(HEADER_PATH), { encoding: "utf-8" })
  ),
  footer: SHOWDOWN_CONVERTER.makeHtml(
    readFileSync(getAbsolutePath(FOOTER_PATH), { encoding: "utf-8" })
  ),
};

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
 * Returns the converted HTML from the notes markdown
 *
 * @param {Note} note
 * @return {*}  {string}
 */
const getNoteHtml = (note: Note): string => {
  const md = readFileSync(getAbsolutePath(note.path), { encoding: "utf-8" });
  return SHOWDOWN_CONVERTER.makeHtml(md);
};

/**
 * Converts the note's mardown into HTML and write to a file in
 * build folder
 *
 * @param {Note} note
 */
const writeHTMLNote = (note: Note) => {
  const html = getNoteHtml(note);
  const filename = `${path.parse(note.path).name}.html`;
  const filePath = `${DIST_NOTES_PATH}/${filename}`;
  const fullFilePath = `${DIST_FULL_NOTES_PATH}/${filename}`;
  const fullHtml = TEMPLATE.layout({
    title: "title",
    header: HTML.header,
    footer: HTML.footer,
    content: html,
  });

  writeFileSync(getAbsolutePath(filePath), html);
  writeFileSync(getAbsolutePath(fullFilePath), fullHtml);

  log.success(`Successfully create HTML file at ${filePath} ...`);
};

/**
 * Iterates over all the notes and converts to HTML
 */
const writeHTMLNotes = () => {
  getIManifest().notes.forEach((note) => writeHTMLNote(note));
};

/**
 * Creates the home page under dist
 */
const writeHomePage = () => {
  const notes = getIManifest().notes.map((note) => ({
    title: note.title,
    content: stripHtml(getNoteHtml(note)).result.slice(0, 100),
  }));
  const html = TEMPLATE.layout({
    header: HTML.header,
    footer: HTML.footer,
    content: TEMPLATE.notes({ notes }),
  });

  writeFileSync(getAbsolutePath(DIST_HOMEPAGE_PATH), html);
  log.success("Successfully created homepage ...");
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
  // This creates both the notes and notes/full folders
  mkdirSync(getAbsolutePath(DIST_FULL_NOTES_PATH), { recursive: true });
  log.success(`Created build folder at ${DIST_PATH} ...`);

  writeIManifest();
  writeHomePage();
  writeHTMLNotes();
};

export { build };
