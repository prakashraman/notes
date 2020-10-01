import * as inquirer from "inquirer";
import * as chalk from "chalk";
import * as figlet from "figlet";

import { setup } from "./setup";
import { createNote, listNotes } from "./notes";
import { log } from "./helpers";

/**
 * Entry method of the library. It asks all the right questions :)
 *
 */
const start = () => {
  inquirer
    .prompt({
      name: "choice",
      message: "What would you like to do?",
      type: "list",
      choices: [
        { value: "setup", name: "Setup lite blog" },
        { value: "new", name: "Create note" },
        { value: "list", name: "List notes" },
        { value: "build", name: "Build HTML content" },
      ],
    })
    .then((answer) => {
      if (answer.choice === "setup") setup();
      else if (answer.choice === "list") listNotes();
      else if (answer.choice === "new") createNote();
    });
};

figlet("Write lite", (er, data) => {
  if (er) {
    return log.blue("write-lite");
  }

  log.log(data);
  start();
});
