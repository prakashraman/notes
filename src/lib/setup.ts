import { existsSync, mkdirSync } from "fs";

import { log } from "./helpers";
import * as constants from "./config/constants";
import { init as initManifest, setupHeaderAndFooter } from "./manifest";

/**
 * Determines whether a configuration is present. Looks for the folder structures and manifest.json
 *
 * @return {*}  {boolean}
 */
const isConfigurationPresent = (): boolean => {
  return [
    constants.CONTENTS_PATH,
    constants.MANIFEST_PATH,
    constants.NOTES_PATH,
    constants.HEAD_PATH,
  ]
    .map((path) => existsSync(path))
    .includes(true);
};

/**
 * Initialize the system with relevant folders and configuration files
 *
 */
const init = (): void => {
  mkdirSync(constants.CONTENTS_PATH);
  log.success(`Created 'contents' folder at ${constants.CONTENTS_PATH}`);

  initManifest();
  setupHeaderAndFooter();

  mkdirSync(constants.NOTES_PATH);
  log.success(`Created 'notes' folder at ${constants.NOTES_PATH}`);
};

/**
 * Sets up the content folder structure. The setup will be skipped if any configuration files already exist
 *
 */
const setup = (): void => {
  log.blue("Looking for existing configuration ...");

  if (isConfigurationPresent()) {
    throw new Error("Configuration is present. Shall leave things as is ...");
  }

  log.blue(
    "No configuration found. Setting up a whole new system. Sit back and watch the magic."
  );
  init();
};

export { setup };
