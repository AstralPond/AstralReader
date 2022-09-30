import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { Binary, Collection, Db, MongoClient } from "mongodb";
import { v4 as uuidv4 } from "uuid";

type Stringify = (buffer: Buffer, delimiter?: string) => string;

interface User {
  _id?: Binary;
  email: string;
  password: string;
}

export interface CustomDb extends Db {
  users: Collection<User>;
  stringify: Stringify;
}

// References:
// https://github.com/cdimascio/uuid-mongodb
// https://www.mongodb.com/docs/drivers/node/v4.2/fundamentals/crud/write-operations/pkFactory/

function stringify(buffer: Buffer, delimiter: string = "-") {
  return [
    buffer.toString("hex", 0, 4),
    buffer.toString("hex", 4, 6),
    buffer.toString("hex", 6, 8),
    buffer.toString("hex", 8, 10),
    buffer.toString("hex", 10, 16),
  ].join(delimiter);
}

/**
 * A plugin that adds the mongodb driver to the app
 * @example
 *
 * import db from '@plugins/db'
 *
 * const app = Fastify({ logger: true })
 *
 * await app.register(db)
 *
 * app.db.collection("users").findOne({email: "johndoe@example.com"})
 */
export default fp(async function db(app: FastifyInstance) {
  const uri = process.env.MONGO_URI || "";
  const client = new MongoClient(uri, {
    pkFactory: {
      createPk: () =>
        new Binary(uuidv4(null, Buffer.alloc(16)), Binary.SUBTYPE_UUID),
    },
  });

  const db = client.db(process.env.DB_NAME);

  app.decorate("db", customizeDb(db));
  app.decorate("idStringify", stringify);
});

/**
 * Adds native mongodb shell like syntax to db
 * @param {Db} db - MongoDB instance
 * @returns {CustomDb} - returns customized db
 */
function customizeDb(db: Db): CustomDb {
  let customDb: any = db;
  customDb.users = db.collection("users");
  customDb.stringify = stringify;

  return customDb;
}
