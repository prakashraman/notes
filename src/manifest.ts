import { writeFile, readFileSync } from "fs";

import manifestTemplate from "./config/templates/manifest";
import { MANIFEST_PATH } from "./config/constants";
import { log, getAbsolutePath } from "./helpers";
import { Note, Manifest } from "./typings";

/**
 * Creates a first empty manifest
 *
 */
const init = (): void => {
  const manifest: Manifest = {
    ...manifestTemplate,
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
  writeFile(
    getAbsolutePath(MANIFEST_PATH),
    JSON.stringify(manifest, null, 2),
    (err) => {
      if (err) throw err;

      log.success(`Created manifest file at ${MANIFEST_PATH}`);
    }
  );
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
 * Return all the notes from the manifest
 *
 * @return {*}  {Note[]}
 */
const getNotes = (): Note[] => {
  return getManifest().notes;
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

export { init, getManifest, getNextNoteId, writeManifest, getNotes };
