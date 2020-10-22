import { existsSync, mkdirSync } from "fs";

import { log, softMkdirSync } from "./helpers";
import * as constants from "./config/constants";
import { init as initManifest, setupHeaderAndFooter } from "./manifest";

/**
 * Initialize the system with relevant folders and configuration files
 *
 */
const init = (): void => {
  softMkdirSync(constants.CONTENTS_PATH);
  softMkdirSync(constants.PUBLIC_PATH);

  initManifest();
  setupHeaderAndFooter();

  softMkdirSync(constants.NOTES_PATH);
};

/**
 * Sets up the content folder structure. The setup will be skipped if any configuration files already exist
 *
 */
const setup = (): void => {
  init();
};

export { setup };
