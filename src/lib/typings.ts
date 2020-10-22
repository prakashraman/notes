// typings.ts
/**
 * This file contains all the typings used in the project
 * @packageDocumentation
 */

/**
 * Note
 */
export type Note = {
  /** Auto-increment ID of the article. Decided by the previous ID */
  id: number;
  /** Title of the Note. Initial used to contruct the handle */
  title: string;
  /** Contructed from the first title provided. Should NOT be directly update in the manifest file */
  handle: string;
  /** Auto-generated from during the creation of the note */
  path: string;
  /** Time of creation */
  createdAt: Date | string;
  /** Publish time. This field can be updated in the manifest file */
  publishedAt: Date | string;
};

export type Manifest = {
  /** List of Notes[] */
  notes: Note[];
  /** Title of the homepage */
  title?: string;
  /** Auto-generated timestamp during init */
  createdAt: Date | string;
};

/**
 * Note type for the public interface
 */
export type INote = Note & {
  /** Summary of the note. Ideally the first para or first 200 words */
  summary: string;
  /** Relative path of the full article */
  relativePath: string;
};

/**
 * Manifest type for the public interface
 */
export type IManifest = Pick<Manifest, "createdAt"> & {
  notes: INote[];
};
