#!/usr/bin/env node

import figlet from "figlet";
import { program } from "commander";

import { setup } from "./lib/setup";
import { createNote, listNotes } from "./lib/notes/notes";
import { build } from "./lib/build";
import { setTitle } from "./lib/manifest";

/** The big banner */
console.log(figlet.textSync("notes"));

program.name("npx pr-notes").usage("command");

/**
 * All the commands of the program
 */
program
  .command("setup")
  .description(
    "sets up the structure. You don't need to run this more than once"
  )
  .action(setup);

program
  .command("set:title")
  .description("sets the title of the homepage")
  .action(setTitle);

program
  .command("notes:create")
  .description("creates a new note")
  .action(createNote);

program
  .command("notes:list")
  .description("list all the notes")
  .action(listNotes);

program
  .command("publish")
  .description("publishes the notes to dist folder")
  .action(build);

program.parse(process.argv);
