import * as inquirer from "inquirer";
import { setup } from "./setup";
import { createContent } from "./create-content";
import * as chalk from "chalk";

console.log(chalk.green("Welcome to", chalk.bold("write-lite")), "\n");

inquirer
  .prompt({
    name: "choice",
    message: "What would you like to do?",
    type: "list",
    choices: [
      { value: "setup", name: "Setup lite blog" },
      { value: "new", name: "Create a new content" },
      { value: "list", name: "List content" },
      { value: "build", name: "Build HTML content" },
    ],
  })
  .then((answer) => {
    if (answer.choice === "setup") setup();
    else createContent();
  });
