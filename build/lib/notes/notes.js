"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.listNotes = exports.createNote = void 0;
var inquirer = __importStar(require("inquirer"));
var fs_1 = require("fs");
var slugify_1 = __importDefault(require("slugify"));
var helpers_1 = require("../helpers");
var constants_1 = require("../config/constants");
var manifest_1 = require("../manifest");
/**
 * Sets up the folder 'notes/[year]/[month]/[date]'
 *
 * @return {*}  {string} relative path for the note folder
 */
var setupFolderForNote = function () {
    var now = new Date();
    var _a = [
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
    ], year = _a[0], month = _a[1], date = _a[2];
    var relativePath = constants_1.NOTES_PATH + "/" + year + "/" + month + "/" + date;
    helpers_1.log.blue("Creating folder structure for the note: " + relativePath + " ...");
    fs_1.mkdirSync(helpers_1.getAbsolutePath("" + relativePath), {
        recursive: true
    });
    helpers_1.log.success("Successfully created note container folder");
    return relativePath;
};
/**
 * Creates a new note by doing the following
 *
 * 1. Create a markdown file
 * 2. Place file in the dated folder
 * 3. Update the manifest file with the note
 *
 * @param {string} title
 * @param {string} author
 * @return {*}  {Note}
 */
var setupFreshNote = function (title, author) {
    if (!title) {
        helpers_1.log.error("No title found. Not creating a note! Come back after coffee and try again.");
        return;
    }
    var id = manifest_1.getNextNoteId();
    var handle = slugify_1["default"](id + "-" + title.toLowerCase(), { strict: true });
    var path = setupFolderForNote() + "/" + handle + ".md";
    helpers_1.log.blue("Creating markdown file at " + path + " ...");
    fs_1.writeFileSync(helpers_1.getAbsolutePath(path), "");
    helpers_1.log.success("New file created at: " + path);
    var note = {
        id: id,
        title: title,
        handle: handle,
        path: path,
        createdAt: new Date(),
        publishedAt: new Date()
    };
    var manifest = manifest_1.getManifest();
    manifest_1.writeManifest(__assign(__assign({}, manifest), { notes: __spreadArrays(manifest.notes, [note]) }));
    helpers_1.log.success("Successfully updated manifest with the new note");
    helpers_1.log.success("Open the file using your favorite editor and start typing!");
    return manifest_1.getNote(id);
};
/**
 * Creates the new note, by asking a series of very personal questions
 *
 */
var createNote = function () {
    inquirer
        .prompt([
        {
            type: "input",
            name: "title",
            message: "Title"
        },
        {
            name: "author",
            type: "input",
            "default": "Prakash Raman",
            message: "Author"
        },
    ])
        .then(function (answers) {
        setupFreshNote(answers.title, answers.author);
    });
};
exports.createNote = createNote;
/**
 * List all the notes
 *
 */
var listNotes = function () {
    var notes = manifest_1.getNotes();
    if (notes.length === 0) {
        return helpers_1.log.error("No notes found. Why not create your first one?");
    }
    helpers_1.log.success("Found " + notes.length + " note(s)");
    notes.forEach(function (note) {
        helpers_1.log.log("[id: " + note.id + "]: " + note.title);
    });
};
exports.listNotes = listNotes;
