export const ROOT_PATH: string = process.cwd();

export const MANIFEST: string = "manifest.json";
export const CONTENTS_PATH: string = `contents`;
export const PUBLIC_PATH: string = `${CONTENTS_PATH}/public`;
export const MANIFEST_PATH: string = `${CONTENTS_PATH}/${MANIFEST}`;
export const HEADER_PATH: string = `${CONTENTS_PATH}/header.md`;
export const FOOTER_PATH: string = `${CONTENTS_PATH}/footer.md`;
export const NOTES_PATH: string = `${CONTENTS_PATH}/notes`;
export const PAGES_PATH: string = `${CONTENTS_PATH}/pages`;
export const HEAD_PATH: string = `${CONTENTS_PATH}/head.html`;

export const DIST_PATH: string = `dist`;
export const DIST_HOMEPAGE_PATH: string = `${DIST_PATH}/index.html`;
export const DIST_NOTES_PATH: string = `${DIST_PATH}/notes`;
export const DIST_PAGES_PATH: string = `${DIST_PATH}/pages`;
export const DIST_FULL_NOTES_PATH: string = `${DIST_NOTES_PATH}/full`;
export const IMANIFEST_PATH: string = `${DIST_PATH}/imanifest.json`;

export const SUMMARY_STRING_LENGTH = 360;
