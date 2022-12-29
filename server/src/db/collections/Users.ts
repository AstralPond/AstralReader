import { Library } from "@/db/collections/Libraries";
import { db } from "db";
import { Binary } from "mongodb";

export interface User {
  _id?: Binary;
  email: string;
  password: string;
  libraries: Library[];
}

export default db.collection<User>("users");
