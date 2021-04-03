import chalk from "chalk";
import { mkdirSync, existsSync, writeFileSync } from "fs";
import * as path from "path";

import { ROOT_PATH, DIST_NOTES_PATH } from "./config/constants";
import { Note } from "./typings";

/**
 * Logs in blue
 *
 * @param {string} text
 */
const blue = (text: string): void => {
  console.log(chalk.blue(text));
};

/**
 * Logs in green
 *
 * @param {string} text
 */
const success = (text: string): void => {
  console.log(chalk.green(text));
};

/**
 * Logs in red
 *
 * @param {string} text
 */
const error = (text: string): void => {
  normal(chalk.red(text));
};

/**
 * Wrapper to console.log
 *
 * @param {(string | object)} message
 */
const normal = (message: string | object): void => {
  console.log(message);
};

const log = {
  blue,
  success,
  error,
  log: console.log,
};

/**
 * Returns the absolute path for a passed relative path
 *
 * @param {string} path
 * @return {*}  {string}
 */
const getAbsolutePath = (path: string): string => {
  return `${ROOT_PATH}/${path}`;
};

/**
 * Checks if folder exists before creating it. Logs appropriately.
 *
 * @param {string} path
 * @return {*}  {void}
 */
const softMkdirSync = (path: string): void => {
  if (existsSync(path)) {
    log.blue(`Folder: ${path} already exists, skipping ...`);
    return;
  }

  mkdirSync(path);
  log.success(`Folder ${path} created ...`);
};

/**
 * Checks if the file exists before writing to it. If present the write is skipped.
 * Logs Appropriately.
 *
 * @param {string} path
 * @param {string} content
 */
const softWriteFileSync = (path: string, content: string) => {
  if (existsSync(path)) {
    log.blue(`File: ${path} already existing. Skipping write ...`);
    return;
  }
  writeFileSync(path, content);
};

/**
 * Returns the dist path of the summary article of the note
 *
 * @param {Note} note
 * @return {*}  {string}
 */
const getDistFilePathForNote = (note: Note): string => {
  const filename = `${path.parse(note.path).name}.html`;

  return `${DIST_NOTES_PATH}/${filename}`;
};

/**
 * Returns the dist path of the full article of the note
 *
 * @param {Note} note
 * @return {*}  {string}
 */
const getDistFullFilePathForNote = (note: Note): string => {
  const filename = `${path.parse(note.path).name}.html`;

  return `${DIST_NOTES_PATH}/${filename}`;
};

export {
  log,
  getAbsolutePath,
  softMkdirSync,
  softWriteFileSync,
  getDistFilePathForNote,
  getDistFullFilePathForNote,
};
