"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.getNoteHtml = exports.build = void 0;
var fs_1 = require("fs");
var showdown = __importStar(require("showdown"));
var path = __importStar(require("path"));
var Handlebars = __importStar(require("handlebars"));
var moment_1 = __importDefault(require("moment"));
var helpers_1 = require("./helpers");
var manifest_1 = require("./manifest");
var constants_1 = require("./config/constants");
var TEMPLATE = {
    /** The main layout template. Used in the home page and in the article page */
    layout: Handlebars.compile(fs_1.readFileSync(__dirname + "/config/templates/layout.hbs", {
        encoding: "utf-8"
    })),
    /** The back template. Dipslayed instead of the standard header in the article page. */
    back: Handlebars.compile(fs_1.readFileSync(__dirname + "/config/templates/back.hbs", {
        encoding: "utf-8"
    })),
    /** The layout which iterates over the notes. This layout is used in the homepage */
    notes: Handlebars.compile(fs_1.readFileSync(__dirname + "/config/templates/notes.hbs", {
        encoding: "utf-8"
    })),
    /** The layout of the article page */
    note: Handlebars.compile(fs_1.readFileSync(__dirname + "/config/templates/note.hbs", {
        encoding: "utf-8"
    }))
};
var SHOWDOWN_CONVERTER = new showdown.Converter();
var HTML = {
    getHeader: function () {
        return SHOWDOWN_CONVERTER.makeHtml(fs_1.readFileSync(helpers_1.getAbsolutePath(constants_1.HEADER_PATH), { encoding: "utf-8" }));
    },
    getFooter: function () {
        return SHOWDOWN_CONVERTER.makeHtml(fs_1.readFileSync(helpers_1.getAbsolutePath(constants_1.FOOTER_PATH), { encoding: "utf-8" }));
    },
    getHead: function () {
        return fs_1.readFileSync(helpers_1.getAbsolutePath(constants_1.HEAD_PATH), { encoding: "utf-8" });
    }
};
/**
 * Cleans the dist folder of all remnants
 */
var clean = function () {
    helpers_1.log.blue("Attempting to clean build");
    var path = helpers_1.getAbsolutePath(constants_1.DIST_PATH);
    if (fs_1.existsSync(path)) {
        fs_1.rmdirSync(helpers_1.getAbsolutePath(constants_1.DIST_PATH), { recursive: true });
        return helpers_1.log.success("Successfully cleaned build " + constants_1.DIST_PATH + " ...");
    }
    helpers_1.log.success("No existing build folder present. Skipping ...");
};
/**
 * Write a fresh IManifest file. Expected to be consumed via HTTP
 */
var writeIManifest = function () {
    var iManifest = manifest_1.getIManifest();
    helpers_1.log.blue("Writing iManifest file ...");
    fs_1.writeFileSync(helpers_1.getAbsolutePath(constants_1.IMANIFEST_PATH), JSON.stringify(iManifest, null, 2));
    helpers_1.log.success("Successfully created iManifest file at " + constants_1.IMANIFEST_PATH);
};
/**
 * Returns the converted HTML from the notes markdown
 *
 * @param {Note} note
 * @return {*}  {string}
 */
var getNoteHtml = function (note) {
    var md = fs_1.readFileSync(helpers_1.getAbsolutePath(note.path), { encoding: "utf-8" });
    return SHOWDOWN_CONVERTER.makeHtml(md);
};
exports.getNoteHtml = getNoteHtml;
/**
 * Converts the note's markdown into HTML and write to a file in
 * build folder
 *
 * @param {Note} note
 */
var writeHTMLNote = function (note) {
    var html = getNoteHtml(note);
    var filename = path.parse(note.path).name + ".html";
    var filePath = constants_1.DIST_NOTES_PATH + "/" + filename;
    var fullFilePath = constants_1.DIST_FULL_NOTES_PATH + "/" + filename;
    var fullHtml = TEMPLATE.layout({
        title: note.title,
        head: HTML.getHead(),
        header: TEMPLATE.back({}),
        footer: HTML.getFooter(),
        content: TEMPLATE.note({
            title: note.title,
            content: html,
            publishedAt: moment_1["default"](note.publishedAt).format("MMMM Do YYYY")
        }),
        cssPath: "../../main.css"
    });
    fs_1.writeFileSync(helpers_1.getAbsolutePath(filePath), html);
    fs_1.writeFileSync(helpers_1.getAbsolutePath(fullFilePath), fullHtml);
    helpers_1.log.success("Successfully create HTML file at " + filePath + " ...");
};
/**
 * Iterates over all the notes and converts to HTML
 */
var writeHTMLNotes = function () {
    manifest_1.getIManifest().notes.forEach(function (note) { return writeHTMLNote(note); });
};
/**
 * Creates the home page under dist
 */
var writeHomePage = function () {
    var notes = manifest_1.getIManifest().notes.map(function (note) { return ({
        title: note.title,
        content: note.summary,
        publishedAt: moment_1["default"](note.publishedAt).format("MMMM Do YYYY"),
        url: note.relativePath
    }); });
    var html = TEMPLATE.layout({
        head: HTML.getHead(),
        header: HTML.getHeader(),
        footer: HTML.getFooter(),
        cssPath: "./main.css",
        content: TEMPLATE.notes({ notes: notes })
    });
    fs_1.writeFileSync(helpers_1.getAbsolutePath(constants_1.DIST_HOMEPAGE_PATH), html);
    helpers_1.log.success("Successfully created homepage ...");
};
/**
 * Write the CSS file to the dist folder
 */
var writeCssFile = function () {
    fs_1.copyFileSync(__dirname + "/config/templates/main.css", constants_1.DIST_PATH + "/main.css");
};
/**
 * Entry point to the build process. Cleans the build folder and recreates it.
 * Ideally should be run on the CD flow and build folder is to be
 * pushed to a publicly accessible server
 */
var build = function () {
    clean();
    helpers_1.log.blue("Building notes\nCreating build folder");
    // This creates both the notes and notes/full folders
    fs_1.mkdirSync(helpers_1.getAbsolutePath(constants_1.DIST_FULL_NOTES_PATH), { recursive: true });
    helpers_1.log.success("Created build folder at " + constants_1.DIST_PATH + " ...");
    writeCssFile();
    writeIManifest();
    writeHomePage();
    writeHTMLNotes();
};
exports.build = build;
