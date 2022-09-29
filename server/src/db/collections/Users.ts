import { db } from "db";
import { Binary } from "mongodb";

interface User {
  _id?: Binary;
  email: string;
  password: string;
}

export default db.collection<User>("users");
