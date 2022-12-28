import { readdirSync } from "fs";
import fs from "fs/promises";
import path from "path";
import { PUBLIC_DIRECTORY } from "..";

export type DirPath = string | Buffer | URL;

export const getDirectories = (source: DirPath) =>
  readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

/**
 * Creates a symbolic link.
 *
 * @param target - It is a string, Buffer or URL which represents the path to which the symlink has to be created.
 *
 */
export async function symlinkDir(target: DirPath, libraryName: string) {
  try {
    const directoryName = path.basename(target.toString());
    // The "dir" is necessary for symlinks to work on Windows
    await fs.symlink(
      target,
      path.join(PUBLIC_DIRECTORY, libraryName, directoryName),
      "dir"
    );
  } catch (e) {
    throw new Error(e as any);
  }
}

/**
 * Unlinks Symbolic Links
 *
 * @param path - It is a string, Buffer or URL which represents the path of a symlink will be removed.
 *
 */
export async function unlink(path: DirPath) {
  try {
    const stats = await fs.lstat(path);

    if (stats.isSymbolicLink() === false)
      throw new Error(`${path} is not a valid symbolic link`);

    // The "dir" is necessary for symlinks to work on Windows
    await fs.unlink(path);
  } catch (e) {
    throw new Error(e as any);
  }
}
