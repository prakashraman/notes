import { rmdirSync, existsSync, mkdirSync, writeFileSync } from "fs";

import { log, getAbsolutePath } from "./helpers";
import { getIManifest } from "./manifest";
import { DIST_PATH, DIST_NOTES_PATH, IMANIFEST_PATH } from "./config/constants";

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
};

export { build };
