#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var figlet_1 = __importDefault(require("figlet"));
var commander_1 = require("commander");
var setup_1 = require("./lib/setup");
var notes_1 = require("./lib/notes/notes");
var build_1 = require("./lib/build");
/** The big banner */
console.log(figlet_1["default"].textSync("notes"));
commander_1.program.name("npx pr-notes").usage("command");
/**
 * All the commands of the program
 */
commander_1.program
    .command("setup")
    .description("sets up the structure. You don't need to run this more than once")
    .action(setup_1.setup);
commander_1.program
    .command("notes:create")
    .description("creates a new note")
    .action(notes_1.createNote);
commander_1.program
    .command("notes:list")
    .description("list all the notes")
    .action(notes_1.listNotes);
commander_1.program
    .command("publish")
    .description("publishes the notes to dist folder")
    .action(build_1.build);
commander_1.program.parse(process.argv);
