import * as chalk from "chalk";

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
const green = (text: string): void => {
  console.log(chalk.green(text));
};

const normal = (message: string | object): void => {
  console.log(message);
};
const log = {
  blue,
  green,
  log: console.log,
};

export { log };
