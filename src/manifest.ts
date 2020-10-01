import { writeFile, readFileSync } from "fs";

import manifestTemplate from "./templates/manifest";
import { MANIFEST_PATH } from "./constants";
import { log } from "./helpers";
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
  writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2), (err) => {
    if (err) throw err;

    log.success(`Created manifest file at ${MANIFEST_PATH}`);
  });
};

/**
 * Retrieve the Manifest Object
 *
 * @return {*}  {Manifest}
 */
const getManifest = (): Manifest => {
  const data = readFileSync(MANIFEST_PATH, { encoding: "utf8" });

  return JSON.parse(data) as Manifest;
};

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
