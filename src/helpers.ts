import * as chalk from "chalk";

import { ROOT_PATH } from "./config/constants";

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

export { log, getAbsolutePath };
