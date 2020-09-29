import { existsSync, mkdirSync, writeFile } from "fs";

import { log } from "./helpers";
import * as constants from "./constants";
import manifestTemplate from "./templates/manifest";
import { Manifest } from "./typings";

/**
 * Determines wheather a configuration is present. Looks for the folder structures and manifest.json
 *
 * @return {*}  {boolean}
 */
const isConfigurationPresent = (): boolean => {
  return [
    constants.CONTENTS_PATH,
    constants.MANIFEST_PATH,
    constants.NOTES_PATH,
  ]
    .map((path) => existsSync(path))
    .includes(true);
};

/**
 * Initialise the system with relevant folders and configuration files
 *
 */
const init = (): void => {
  mkdirSync(constants.CONTENTS_PATH);
  log.green(`Created 'contents' folder at ${constants.CONTENTS_PATH}`);

  const manifest: Manifest = {
    ...manifestTemplate,
    createdAt: new Date().toISOString(),
  };

  writeFile(
    constants.MANIFEST_PATH,
    JSON.stringify(manifest, null, 2),
    (err) => {
      if (err) throw err;

      log.green(`Created manifest file at ${constants.MANIFEST_PATH}`);
    }
  );

  mkdirSync(constants.NOTES_PATH);
  log.green(`Created 'notes' folder at ${constants.NOTES_PATH}`);
};

/**
 * Sets up the content folder structure. The setup will be skipped if any configuration files already exist
 *
 */
const setup = (): void => {
  log.blue("Looking for existing configuration ...");

  log.log({ manifestTemplate });
  if (isConfigurationPresent()) {
    log.green("Configuration is present. Shall leave things as is ...");
    return;
  }

  log.blue(
    "No configuration found. Setting up a whole new system. Sit back and watch the magic."
  );
  init();
};

export { setup };
