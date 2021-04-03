import {
  rmdirSync,
  existsSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  copyFileSync,
  readdirSync,
} from "fs";
import cpy from "cpy";
import * as showdown from "showdown";
import * as path from "path";
import * as Handlebars from "handlebars";
import moment from "moment";

import {
  log,
  getAbsolutePath,
  getDistFilePathForNote,
  getDistFullFilePathForNote,
} from "./helpers";
import { getIManifest } from "./manifest";
import {
  DIST_PATH,
  DIST_HOMEPAGE_PATH,
  FOOTER_PATH,
  HEADER_PATH,
  DIST_NOTES_PATH,
  IMANIFEST_PATH,
  DIST_FULL_NOTES_PATH,
  DIST_PAGES_PATH,
  PUBLIC_PATH,
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
 * @return {*}  {{ filePath: string; fullFilePath: string }}
 */
const writeHTMLNote = (
  note: Note
): { filePath: string; fullFilePath: string } => {
  const html = getNoteHtml(note);
  const filePath = getDistFilePathForNote(note);
  const fullFilePath = getDistFullFilePathForNote(note);
  const fullHtml = TEMPLATE.layout({
    title: note.title,
    head: HTML.getHead(),
    header: TEMPLATE.back({ path: "../../index.html" }),
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

  return { filePath, fullFilePath };
};

/**
 * Iterates over all the notes and converts to HTML
 */
const writeHTMLNotes = () => {
  getIManifest().notes.forEach((note) => writeHTMLNote(note));
};

/**
 * Iterates over all the pages and converts to HTML
 */
const writeHTMLPages = () => {
  getIManifest().pages.forEach((note) => writeHTMLPage(note));
};

/**
 * Creates the home page under dist
 */
const writeHomePage = () => {
  const imanifest = getIManifest();
  const notes = imanifest.notes.map((note) => ({
    title: note.title,
    content: note.summary,
    publishedAt: moment(note.publishedAt).format("MMMM Do YYYY"),
    url: note.relativePath,
  }));
  const html = TEMPLATE.layout({
    title: imanifest.title ?? "",
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
 * Converts the note's markdown into HTML and write to a file in
 * build folder
 *
 * @param {Note} note
 */
const writeHTMLPage = (note: Note) => {
  const html = getNoteHtml(note);
  const filename = `${path.parse(note.path).name}.html`;
  const filePath = `${DIST_PAGES_PATH}/${filename}`;
  const pageHtml = TEMPLATE.layout({
    title: note.title,
    head: HTML.getHead(),
    header: TEMPLATE.back({ path: "../index.html" }),
    footer: HTML.getFooter(),
    content: TEMPLATE.note({
      title: note.title,
      content: html,
    }),
    cssPath: "../main.css",
  });

  writeFileSync(getAbsolutePath(filePath), pageHtml);

  log.success(`Successfully create HTML file at ${filePath} ...`);
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
 * Copies the contents of the public folder to the "dist" folder
 */
const writePublicFolder = async (): Promise<void> => {
  await cpy(["**/*"], getAbsolutePath(DIST_PATH), {
    parents: true,
    cwd: PUBLIC_PATH,
  });
};

/**
 * Entry point to the build process. Cleans the build folder and recreates it.
 * Ideally should be run on the CD flow and build folder is to be
 * pushed to a publicly accessible server
 */
const build = async () => {
  clean();

  log.blue("Building notes\nCreating build folders");
  // This creates both the notes and notes/full folders
  mkdirSync(getAbsolutePath(DIST_FULL_NOTES_PATH), { recursive: true });
  log.success(`Created build folder at ${DIST_PATH} ...`);
  mkdirSync(getAbsolutePath(DIST_PAGES_PATH), { recursive: true });
  log.success(`Created pages folder at ${DIST_PAGES_PATH}`);

  writePublicFolder();
  writeCssFile();
  writeIManifest();
  writeHomePage();
  writeHTMLNotes();
  writeHTMLPages();
};

export { build, getNoteHtml, clean, writeHTMLNote };
