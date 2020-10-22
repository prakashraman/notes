import { readFileSync, writeFileSync } from "fs";
import * as inquirer from "inquirer";

import manifestTemplate from "./config/templates/manifest";
import {
  MANIFEST_PATH,
  CONTENTS_PATH,
  SUMMARY_STRING_LENGTH,
  HEAD_PATH,
} from "./config/constants";
import { log, getAbsolutePath } from "./helpers";
import { Note, Manifest, INote, IManifest } from "./typings";
import { getNoteHtml } from "./build";
import stripHtml from "string-strip-html";
import moment from "moment";

/**
 * Creates a first empty manifest
 *
 */
const init = (): void => {
  const manifest: Manifest = {
    ...manifestTemplate,
    title: "",
    createdAt: new Date().toISOString(),
  };

  writeManifest(manifest);
};

/**
 * Updates the manifest file
 *
 * @param {Manifest} manifest
 */
const writeManifest = (manifest: Manifest): void => {
  writeFileSync(
    getAbsolutePath(MANIFEST_PATH),
    JSON.stringify(manifest, null, 2)
  );
  log.success(`Updated manifest file at ${MANIFEST_PATH}`);
};

/**
 * Retrieve the Manifest Object
 *
 * @return {*}  {Manifest}
 */
const getManifest = (): Manifest => {
  const data = readFileSync(getAbsolutePath(MANIFEST_PATH), {
    encoding: "utf8",
  });

  return JSON.parse(data) as Manifest;
};

/**
 * Creates the header and footer markdown files
 */
const setupHeaderAndFooter = (): void => {
  log.blue("Setting up header and footer markdown files");
  writeFileSync(getAbsolutePath(`${CONTENTS_PATH}/header.md`), "");
  writeFileSync(getAbsolutePath(`${CONTENTS_PATH}/footer.md`), "");
  writeFileSync(getAbsolutePath(HEAD_PATH), "");
  log.success("Successfully created header and footer markdown files ...");
};

/**
 * Return all the notes from the manifest
 *
 * @return {*}  {Note[]}
 */
const getNotes = (): Note[] => {
  return getManifest().notes;
};

/**
 * Return a Note for an ID
 *
 * @param {number} id
 * @return {*}  {Note}
 */
const getNote = (id: number): Note => {
  const note = getNotes().find((n) => n.id === id);

  if (!note) throw new Error(`Did not find Note with ID ${id}`);

  return note;
};

/**
 * Returns the next available ID for a note
 *
 * @return {*}  {number}
 */
const getNextNoteId = (): number => {
  const notes = getNotes();

  if (notes.length === 0) return 1;

  return notes[notes.length - 1].id + 1;
};

/** Interface methods */

/**
 * Returns the INotes from the manifest order by published_at [desc]
 *
 * @return {*}  {INote[]}
 */
const getINotes = (): INote[] => {
  const notes = getManifest().notes.sort((a, b) =>
    moment(b.publishedAt).diff(a.publishedAt)
  );

  return notes.map<INote>((note) => ({
    ...note,
    relativePath: `./notes/full/${note.handle}.html`,
    summary: stripHtml(getNoteHtml(note)).result.slice(
      0,
      SUMMARY_STRING_LENGTH
    ),
  }));
};

const getIManifest = (): IManifest => {
  const manifest = getManifest();

  return {
    ...manifest,
    notes: getINotes(),
  };
};

const setTitle = (): void => {
  const manifest = getManifest();

  inquirer
    .prompt({
      type: "input",
      name: "title",
      message: "Title",
      default: manifest.title,
    })
    .then((answers) => {
      writeManifest({
        ...manifest,
        title: answers.title,
      });

      log.success("Successfully set the new title. Republish to view changes.");
    });
};

export {
  init,
  getManifest,
  getNextNoteId,
  writeManifest,
  getNotes,
  getNote,
  getIManifest,
  setupHeaderAndFooter,
  setTitle,
};
