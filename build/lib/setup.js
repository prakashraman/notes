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
exports.__esModule = true;
exports.setup = void 0;
var fs_1 = require("fs");
var helpers_1 = require("./helpers");
var constants = __importStar(require("./config/constants"));
var manifest_1 = require("./manifest");
/**
 * Determines whether a configuration is present. Looks for the folder structures and manifest.json
 *
 * @return {*}  {boolean}
 */
var isConfigurationPresent = function () {
    return [
        constants.CONTENTS_PATH,
        constants.MANIFEST_PATH,
        constants.NOTES_PATH,
        constants.HEAD_PATH,
    ]
        .map(function (path) { return fs_1.existsSync(path); })
        .includes(true);
};
/**
 * Initialize the system with relevant folders and configuration files
 *
 */
var init = function () {
    fs_1.mkdirSync(constants.CONTENTS_PATH);
    helpers_1.log.success("Created 'contents' folder at " + constants.CONTENTS_PATH);
    manifest_1.init();
    manifest_1.setupHeaderAndFooter();
    fs_1.mkdirSync(constants.NOTES_PATH);
    helpers_1.log.success("Created 'notes' folder at " + constants.NOTES_PATH);
};
/**
 * Sets up the content folder structure. The setup will be skipped if any configuration files already exist
 *
 */
var setup = function () {
    helpers_1.log.blue("Looking for existing configuration ...");
    if (isConfigurationPresent()) {
        throw new Error("Configuration is present. Shall leave things as is ...");
    }
    helpers_1.log.blue("No configuration found. Setting up a whole new system. Sit back and watch the magic.");
    init();
};
exports.setup = setup;
