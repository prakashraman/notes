import { rmdirSync } from "fs";

import { log, getAbsolutePath } from "./helpers";
import { DIST_PATH } from './config/constants''

/**
 * Cleans the dist folder of all remnants
 *
 */
const clean = () => {
  log.blue("Attempting to clean build")
  rmdirSync(getAbsolutePath(DIST_PATH));
  log.success(`Successfully cleaned build ${DIST_PATH} ...`);
};

const build = async () => {
  clean();
  log.blue("Building notes");
};

export { build };
