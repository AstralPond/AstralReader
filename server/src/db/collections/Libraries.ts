import { db } from "db";
import { Binary } from "mongodb";

export interface Library {
  _id?: Binary;
  name: string;
  folders: Folder[];
}

export interface Folder {
  libraryID?: Binary;
  basePath: string;
  publicPath: string;
}

export default db.collection<Library>("libraries");
