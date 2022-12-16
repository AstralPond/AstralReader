import dotenv from "dotenv";
import { Binary, MongoClient } from "mongodb";
import { v4 as uuidv4 } from "uuid";

dotenv.config()

const mongoUser = process.env.MONGO_INITDB_ROOT_USERNAME;
const mongoPass = process.env.MONGO_INITDB_ROOT_PASSWORD;

const uri = `mongodb://${mongoUser}:${mongoPass}@localhost:27017`

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

export const client = new MongoClient(uri, {
  pkFactory: {
    createPk: () =>
      new Binary(uuidv4(null, Buffer.alloc(16)), Binary.SUBTYPE_UUID),
  },
});

export const db = client.db("astro");
