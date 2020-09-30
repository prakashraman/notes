import { writeFile } from "fs";

import manifestTemplate from "./templates/manifest";
import { Manifest } from "./typings";
import { MANIFEST_PATH } from "./constants";
import { log } from "./helpers";

const init = (): void => {
  const manifest: Manifest = {
    ...manifestTemplate,
    createdAt: new Date().toISOString(),
  };

  writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2), (err) => {
    if (err) throw err;

    log.success(`Created manifest file at ${MANIFEST_PATH}`);
  });
};

export { init };
