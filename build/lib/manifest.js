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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.setupHeaderAndFooter = exports.getIManifest = exports.getNote = exports.getNotes = exports.writeManifest = exports.getNextNoteId = exports.getManifest = exports.init = void 0;
var fs_1 = require("fs");
var manifest_1 = __importDefault(require("./config/templates/manifest"));
var constants_1 = require("./config/constants");
var helpers_1 = require("./helpers");
var build_1 = require("./build");
var string_strip_html_1 = __importDefault(require("string-strip-html"));
/**
 * Creates a first empty manifest
 *
 */
var init = function () {
    var manifest = __assign(__assign({}, manifest_1["default"]), { createdAt: new Date().toISOString() });
    writeManifest(manifest);
};
exports.init = init;
/**
 * Updates the manifest file
 *
 * @param {Manifest} manifest
 */
var writeManifest = function (manifest) {
    fs_1.writeFileSync(helpers_1.getAbsolutePath(constants_1.MANIFEST_PATH), JSON.stringify(manifest, null, 2));
    helpers_1.log.success("Updated manifest file at " + constants_1.MANIFEST_PATH);
};
exports.writeManifest = writeManifest;
/**
 * Retrieve the Manifest Object
 *
 * @return {*}  {Manifest}
 */
var getManifest = function () {
    var data = fs_1.readFileSync(helpers_1.getAbsolutePath(constants_1.MANIFEST_PATH), {
        encoding: "utf8"
    });
    return JSON.parse(data);
};
exports.getManifest = getManifest;
/**
 * Creates the header and footer markdown files
 */
var setupHeaderAndFooter = function () {
    helpers_1.log.blue("Setting up header and footer markdown files");
    fs_1.writeFileSync(helpers_1.getAbsolutePath(constants_1.CONTENTS_PATH + "/header.md"), "");
    fs_1.writeFileSync(helpers_1.getAbsolutePath(constants_1.CONTENTS_PATH + "/footer.md"), "");
    fs_1.writeFileSync(helpers_1.getAbsolutePath(constants_1.HEAD_PATH), "");
    helpers_1.log.success("Successfully created header and footer markdown files ...");
};
exports.setupHeaderAndFooter = setupHeaderAndFooter;
/**
 * Return all the notes from the manifest
 *
 * @return {*}  {Note[]}
 */
var getNotes = function () {
    return getManifest().notes;
};
exports.getNotes = getNotes;
/**
 * Return a Note for an ID
 *
 * @param {number} id
 * @return {*}  {Note}
 */
var getNote = function (id) {
    var note = getNotes().find(function (n) { return n.id === id; });
    if (!note)
        throw new Error("Did not find Note with ID " + id);
    return note;
};
exports.getNote = getNote;
/**
 * Returns the next available ID for a note
 *
 * @return {*}  {number}
 */
var getNextNoteId = function () {
    var notes = getNotes();
    if (notes.length === 0)
        return 1;
    return notes[notes.length - 1].id + 1;
};
exports.getNextNoteId = getNextNoteId;
/** Interface methods */
var getINotes = function () {
    var notes = getManifest().notes;
    return notes.map(function (note) { return (__assign(__assign({}, note), { relativePath: "./notes/full/" + note.handle + ".html", summary: string_strip_html_1["default"](build_1.getNoteHtml(note)).result.slice(0, constants_1.SUMMARY_STRING_LENGTH) })); });
};
var getIManifest = function () {
    var manifest = getManifest();
    return __assign(__assign({}, manifest), { notes: getINotes() });
};
exports.getIManifest = getIManifest;
