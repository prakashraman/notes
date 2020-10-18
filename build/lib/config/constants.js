"use strict";
exports.__esModule = true;
exports.SUMMARY_STRING_LENGTH = exports.IMANIFEST_PATH = exports.DIST_FULL_NOTES_PATH = exports.DIST_NOTES_PATH = exports.DIST_HOMEPAGE_PATH = exports.DIST_PATH = exports.HEAD_PATH = exports.NOTES_PATH = exports.FOOTER_PATH = exports.HEADER_PATH = exports.MANIFEST_PATH = exports.CONTENTS_PATH = exports.MANIFEST = exports.ROOT_PATH = void 0;
exports.ROOT_PATH = process.cwd();
exports.MANIFEST = "manifest.json";
exports.CONTENTS_PATH = "contents";
exports.MANIFEST_PATH = exports.CONTENTS_PATH + "/" + exports.MANIFEST;
exports.HEADER_PATH = exports.CONTENTS_PATH + "/header.md";
exports.FOOTER_PATH = exports.CONTENTS_PATH + "/footer.md";
exports.NOTES_PATH = exports.CONTENTS_PATH + "/notes";
exports.HEAD_PATH = exports.CONTENTS_PATH + "/head.html";
exports.DIST_PATH = "dist";
exports.DIST_HOMEPAGE_PATH = exports.DIST_PATH + "/index.html";
exports.DIST_NOTES_PATH = exports.DIST_PATH + "/notes";
exports.DIST_FULL_NOTES_PATH = exports.DIST_NOTES_PATH + "/full";
exports.IMANIFEST_PATH = exports.DIST_PATH + "/imanifest.json";
exports.SUMMARY_STRING_LENGTH = 360;
