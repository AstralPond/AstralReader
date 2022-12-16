import { CustomDb } from "@plugins/db";
import bcrypt from "bcrypt";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import mercurius, { IResolvers, MercuriusOptions } from "mercurius";
import mercuriusCodegen, { gql } from "mercurius-codegen";
import fs from "fs";
import path from "path";
import { PUBLIC_DIRECTORY } from "@/index";
import { symlinkDir, unlink } from "@/libs";
import { Folder } from "@/db/collections/Libraries";

interface FastifyDbInstance extends FastifyInstance {
  db: CustomDb;
}

export default fp(async function astralGraphql(
  app: FastifyInstance,
  options: MercuriusOptions
) {
  const resolvers = createResolvers(app as FastifyDbInstance);
  await app.register(mercurius, {
    schema,
    resolvers,
    context: buildContext,
    graphiql: true,
    ...options,
  });

  // Generate file for typescript autocompletion
  mercuriusCodegen(app, {
    targetPath: "./src/plugins/astral-graphql/generated.ts",
  });
});

type PromiseType<T> = T extends PromiseLike<infer U> ? U : T;
declare module "mercurius" {
  interface MercuriusContext
    extends PromiseType<ReturnType<typeof buildContext>> {}
}

export const buildContext = async (
  req: FastifyRequest,
  _reply: FastifyReply
) => {
  return {
    auth: req.headers.authorization,
  };
};

export const schema = gql`
  type User {
    id: ID!
    email: String!
  }

  type Library {
    id: ID!
    name: String!
    folders: [Folder!]!
  }

  type Folder {
    libraryID: ID!
    basePath: String!
    publicPath: String!
  }

  type Query {
    user(id: ID!, email: String!): User
  }

  type Mutation {
    login(email: String!, password: String!): User
    createUser(email: String!, password: String!): User
    createLibrary(name: String!): Library
    deleteLibrary(id: ID!, name: String!): Library
    addFolder(
      targetPath: String!
      libraryID: ID!
      libraryName: String!
    ): Folder!
    removeFolder(
      publicPath: String!
      libraryID: ID!
      libraryName: String!
    ): Folder!
  }
`;

function createResolvers(app: FastifyDbInstance): IResolvers {
  const { db } = app;
  return {
    Query: {
      user: async (_parent, args, _context, _info) => {
        const { id, email } = args;

        const foundUser = await app.db.users.findOne({
          email,
        });

        if (!foundUser) return null;

        // If the input ID does not match the found user's ID
        if (db.stringify(foundUser._id.buffer) !== id) {
          // TODO: Log this event
          return null;
        }

        return { id, email };
      },
    },
    Mutation: {
      login: async (_parent, args, _context, _info) => {
        try {
          const { email, password } = args;
          const foundUser = await db.users.findOne({ email });

          if (foundUser === null) {
            throw new Error("Email or password incorrect");
          }

          const match = await bcrypt.compare(password, foundUser.password);

          if (match) {
            const { _id, email } = foundUser;
            const id = db.stringify(_id.buffer);

            return {
              id,
              email,
            };
          }
        } catch (e) {
          // throw new Error((e as Error)?.message || "Internal Server Error");
          throw new Error("Email or password incorrect");
        }

        throw new Error("Email or password incorrect");
      },
      createUser: async (_parent, args, _context, _info) => {
        try {
          const { email, password } = args;

          const foundUser = await db.users.findOne({ email });

          if (foundUser) {
            throw new Error("User already exists.");
          }

          const hashedPassword = await bcrypt
            .hash(password, Number(process.env.SALT_ROUNDS))
            .catch((_err) => {
              throw new Error("Bycrpt hashing failed.");
            });

          const createdUser = await db.users.insertOne({
            email,
            password: hashedPassword,
          });
          const binary = createdUser.insertedId;
          const id = db.stringify(binary.buffer);

          return { id, email };
        } catch (err) {
          throw new Error((err as Error)?.message || "Internal Server Error");
        }
      },
      createLibrary: async (_parent, args, _context, _info) => {
        const { name } = args;
        const foundLibrary = await db.libraries.findOne({ name });
        const libraryPath = path.join(PUBLIC_DIRECTORY, name);
        const existingLibraryDir = fs.existsSync(libraryPath);

        // Can't create a library if it already exists
        if (foundLibrary) {
          throw new Error(`Library "${name}" already exists`);
        }

        if (!foundLibrary && existingLibraryDir) {
          throw new Error(
            `${libraryPath} already exists, this shouldn't happen. Please delete it.`
          );
        }

        // Creaate new library (directory)
        fs.mkdirSync(libraryPath);

        // Create new library (mongodb)
        const createdLibrary = await db.libraries.insertOne({
          name,
          folders: [],
        });
        const binary = createdLibrary.insertedId;
        const id = db.stringify(binary.buffer);
        return { id, name };
      },
      deleteLibrary: async (_parent, args, _context, _info) => {
        const { id, name } = args;

        const foundLibrary = await db.libraries.findOne({ name });
        if (!foundLibrary) {
          throw new Error(`Library "${name}" does not exist.`);
        }

        if (db.stringify(foundLibrary._id.buffer) !== id) {
          throw new Error(`Incorrect arguments.`);
        }

        fs.rmdirSync(path.join(PUBLIC_DIRECTORY, name), {
          recursive: true,
        });
        await db.libraries.deleteOne(foundLibrary);
        return { id, name };
      },
      addFolder: async (_parent, args, _context, _info) => {
        const { targetPath, libraryID, libraryName } = args;
        const foundLibrary = await db.libraries.findOne({ name: libraryName });
        if (!foundLibrary) {
          throw new Error("Invalid library.");
        }

        if (db.stringify(foundLibrary._id.buffer) !== libraryID) {
          throw new Error("Invalid arguments.");
        }

        const directoryName = path.basename(targetPath);
        const publicPath = path.join(
          PUBLIC_DIRECTORY,
          libraryName,
          directoryName
        );

        const folder: Folder = {
          basePath: targetPath,
          publicPath: publicPath,
        };

        await db.libraries.updateOne(
          { _id: foundLibrary._id },
          // const Folder = {
          //   ...,
          //   folders: [
          //     ...,
          //     { path: targetPath } // addToSet appends here
          //   ]
          // }
          { $push: { folders: folder } }
        );

        try {
          await symlinkDir(targetPath, libraryName);
        } catch (err) {
          throw new Error(JSON.stringify(err));
        }

        return {
          ...folder,
          libraryID: foundLibrary._id,
        };
      },
      removeFolder: async (_parent, args, _context, _info) => {
        const { publicPath, libraryID, libraryName } = args;

        const foundLibrary = await db.libraries.findOne({
          name: libraryName,
          "folders.publicPath": publicPath,
        });

        if (!foundLibrary) {
          throw new Error("Invalid library.");
        }

        const foundFolder = foundLibrary.folders[0];

        if (db.stringify(foundLibrary._id.buffer) !== libraryID) {
          throw new Error("Invalid arguments.");
        }

        if (foundFolder.publicPath !== publicPath) {
          throw new Error("Invalid Path.");
        }

        await db.libraries.updateOne(
          { _id: foundLibrary._id },
          { $pull: { folders: { publicPath } } }
        );

        await unlink(publicPath);

        return { ...foundFolder, libraryID };
      },
    },
  };
}
