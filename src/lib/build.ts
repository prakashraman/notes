import {
  rmdirSync,
  existsSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  copyFileSync,
} from "fs";
import * as showdown from "showdown";
import * as path from "path";
import * as Handlebars from "handlebars";
import moment from "moment";

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
  HEAD_PATH,
} from "./config/constants";
import { Note } from "./typings";

const TEMPLATE = {
  /** The main layout template. Used in the home page and in the article page */
  layout: Handlebars.compile(
    readFileSync(`${__dirname}/config/templates/layout.hbs`, {
      encoding: "utf-8",
    })
  ),

  /** The back template. Dipslayed instead of the standard header in the article page. */
  back: Handlebars.compile(
    readFileSync(`${__dirname}/config/templates/back.hbs`, {
      encoding: "utf-8",
    })
  ),

  /** The layout which iterates over the notes. This layout is used in the homepage */
  notes: Handlebars.compile(
    readFileSync(`${__dirname}/config/templates/notes.hbs`, {
      encoding: "utf-8",
    })
  ),

  /** The layout of the article page */
  note: Handlebars.compile(
    readFileSync(`${__dirname}/config/templates/note.hbs`, {
      encoding: "utf-8",
    })
  ),
};

const SHOWDOWN_CONVERTER = new showdown.Converter();

const HTML = {
  getHeader: () =>
    SHOWDOWN_CONVERTER.makeHtml(
      readFileSync(getAbsolutePath(HEADER_PATH), { encoding: "utf-8" })
    ),
  getFooter: () =>
    SHOWDOWN_CONVERTER.makeHtml(
      readFileSync(getAbsolutePath(FOOTER_PATH), { encoding: "utf-8" })
    ),
  getHead: () =>
    readFileSync(getAbsolutePath(HEAD_PATH), { encoding: "utf-8" }),
};

/**
 * Cleans the dist folder of all remnants
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
 * Converts the note's markdown into HTML and write to a file in
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
    title: note.title,
    head: HTML.getHead(),
    header: TEMPLATE.back({}),
    footer: HTML.getFooter(),
    content: TEMPLATE.note({
      title: note.title,
      content: html,
      publishedAt: moment(note.publishedAt).format("MMMM Do YYYY"),
    }),
    cssPath: "../../main.css",
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
    content: note.summary,
    publishedAt: moment(note.publishedAt).format("MMMM Do YYYY"),
    url: note.relativePath,
  }));
  const html = TEMPLATE.layout({
    head: HTML.getHead(),
    header: HTML.getHeader(),
    footer: HTML.getFooter(),
    cssPath: "./main.css",
    content: TEMPLATE.notes({ notes }),
  });

  writeFileSync(getAbsolutePath(DIST_HOMEPAGE_PATH), html);
  log.success("Successfully created homepage ...");
};

/**
 * Write the CSS file to the dist folder
 */
const writeCssFile = () => {
  copyFileSync(
    `${__dirname}/config/templates/main.css`,
    `${DIST_PATH}/main.css`
  );
};

/**
 * Entry point to the build process. Cleans the build folder and recreates it.
 * Ideally should be run on the CD flow and build folder is to be
 * pushed to a publicly accessible server
 */
const build = () => {
  clean();

  log.blue("Building notes\nCreating build folder");
  // This creates both the notes and notes/full folders
  mkdirSync(getAbsolutePath(DIST_FULL_NOTES_PATH), { recursive: true });
  log.success(`Created build folder at ${DIST_PATH} ...`);

  writeCssFile();
  writeIManifest();
  writeHomePage();
  writeHTMLNotes();
};

export { build, getNoteHtml };
