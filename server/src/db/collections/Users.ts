import { db } from "db";
import { Binary } from "mongodb";

export interface User {
  _id?: Binary;
  email: string;
  password: string;
}

export default db.collection<User>("users");
