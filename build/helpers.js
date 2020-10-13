"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.getAbsolutePath = exports.log = void 0;
var chalk_1 = __importDefault(require("chalk"));
var constants_1 = require("./config/constants");
/**
 * Logs in blue
 *
 * @param {string} text
 */
var blue = function (text) {
    console.log(chalk_1["default"].blue(text));
};
/**
 * Logs in green
 *
 * @param {string} text
 */
var success = function (text) {
    console.log(chalk_1["default"].green(text));
};
/**
 * Logs in red
 *
 * @param {string} text
 */
var error = function (text) {
    normal(chalk_1["default"].red(text));
};
/**
 * Wrapper to console.log
 *
 * @param {(string | object)} message
 */
var normal = function (message) {
    console.log(message);
};
var log = {
    blue: blue,
    success: success,
    error: error,
    log: console.log
};
exports.log = log;
/**
 * Returns the absolute path for a passed relative path
 *
 * @param {string} path
 * @return {*}  {string}
 */
var getAbsolutePath = function (path) {
    return constants_1.ROOT_PATH + "/" + path;
};
exports.getAbsolutePath = getAbsolutePath;
