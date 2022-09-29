import dotenv from "dotenv";
import { Binary, MongoClient } from "mongodb";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

console.log(JSON.stringify(process.env.MONGO_URI), "yeet===");

const uri = process.env.MONGO_URI || "";

// References:
// https://github.com/cdimascio/uuid-mongodb
// https://www.mongodb.com/docs/drivers/node/v4.2/fundamentals/crud/write-operations/pkFactory/

export function stringify(buffer: Buffer, delimiter: string = "-") {
  return [
    buffer.toString("hex", 0, 4),
    buffer.toString("hex", 4, 6),
    buffer.toString("hex", 6, 8),
    buffer.toString("hex", 8, 10),
    buffer.toString("hex", 10, 16),
  ].join(delimiter);
}

const client = new MongoClient(uri, {
  pkFactory: {
    createPk: () =>
      new Binary(uuidv4(null, Buffer.alloc(16)), Binary.SUBTYPE_UUID),
  },
});
export const db = client.db("astro");
