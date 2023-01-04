import { Folder } from "@/db/collections/Libraries";
import { PUBLIC_DIRECTORY } from "@/index";
import { symlinkDir, unlink } from "@/libs";
import { CustomDb } from "@plugins/db";
import bcrypt from "bcrypt";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import fs from "fs";
import mercurius, { IResolvers, MercuriusOptions } from "mercurius";
import mercuriusCodegen, { gql } from "mercurius-codegen";
import path from "path";
import MUUID from "uuid-mongodb";

export interface FastifyDbInstance extends FastifyInstance {
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
    libraries: [Library!]!
  }

  type Library {
    id: ID!
    userID: ID!
    name: String!
    folders: [Folder!]!
  }

  type Folder {
    basePath: String!
    publicPath: String!
  }

  type Query {
    user(id: ID!, email: String!): User!
  }

  type Mutation {
    login(email: String!, password: String!): User
    createLibraryWithFolder(
      libraryName: String!
      email: String!
      targetPath: String!
    ): Library
    createLibrary(libraryName: String!, email: String!): Library
    deleteLibrary(id: ID!, libraryName: String!): Library
    addFolder(targetPath: String!, libraryName: String!): Folder!
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
    User: {
      // @ts-ignore
      libraries: async (user) => {
        const result = await db.libraries
          .find({
            userID: MUUID.from(user.id),
          })
          .toArray();

        result.forEach((library) => {
          // @ts-ignore
          library.id = db.stringify(library._id);
          // @ts-ignore
          delete library._id;
        });
        return result;
      },
    },
    Query: {
      user: async (_parent, args, _context, _info) => {
        const { id, email } = args;

        const foundUser = await db.users.findOne({
          email,
        });

        if (!foundUser) throw new Error("User not found");

        // If the input ID does not match the found user's ID
        if (db.stringify(foundUser._id.buffer) !== id) {
          // TODO: Log this event
          throw new Error("Invalid arguments");
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

          const passwordMatched = await bcrypt.compare(
            password,
            foundUser.password
          );

          if (passwordMatched) {
            const { _id, email } = foundUser;
            const id = db.stringify(_id.buffer);

            return {
              id,
              email,
            };
          }
        } catch (e) {
          throw new Error(JSON.stringify(e));
        }

        throw new Error("Email or password incorrect");
      },
      createLibrary: async (_parent, args, _context, _info) => {
        const { libraryName, email } = args;
        const foundUser = await db.users.findOne({ email });
        const foundLibrary = await db.libraries.findOne({ name: libraryName });
        const libraryPath = path.join(PUBLIC_DIRECTORY, libraryName);
        const existingLibraryDir = fs.existsSync(libraryPath);

        if (!foundUser) {
          throw new Error("Invalid user.");
        }

        // Can't create a library if it already exists
        if (foundLibrary) {
          throw new Error(`Library "${libraryName}" already exists`);
        }

        if (!foundLibrary && existingLibraryDir) {
          throw new Error(
            `${libraryPath} already exists in the 'public' directory, this shouldn't happen. Please delete it.`
          );
        }

        // Creaate new library (directory)
        fs.mkdirSync(libraryPath);

        // Create new library (mongodb)
        const createdLibrary = await db.libraries.insertOne({
          name: libraryName,
          userID: foundUser._id,
          folders: [],
        });

        const id = db.stringify(createdLibrary.insertedId.buffer);

        return { id, name: libraryName };
      },
      createLibraryWithFolder: async (_parent, args, _context, _info) => {
        const { libraryName, email, targetPath } = args;
        const foundUser = await db.users.findOne({ email });
        const foundLibrary = await db.libraries.findOne({
          userID: foundUser?._id,
          name: libraryName,
        });
        const libraryPath = path.join(PUBLIC_DIRECTORY, libraryName);
        const existingLibraryDir = fs.existsSync(libraryPath);
        const directoryName = path.basename(targetPath);

        if (!foundUser) {
          throw new Error("Invalid user.");
        }

        // Can't create a library if it already exists
        if (foundLibrary) {
          throw new Error(`Library "${libraryName}" already exists`);
        }

        if (!foundLibrary && existingLibraryDir) {
          throw new Error(
            `${libraryPath} already exists, this shouldn't happen. Please delete it.`
          );
        }

        // Creaate new library (directory)
        fs.mkdirSync(libraryPath);

        // Create new library (mongodb)
        const publicPath = path.join(
          PUBLIC_DIRECTORY,
          libraryName,
          directoryName
        );

        const folder: Folder = {
          basePath: targetPath,
          publicPath: publicPath,
        };

        const createdLibrary = await db.libraries.insertOne({
          name: libraryName,
          userID: foundUser._id,
          folders: [folder],
        });

        try {
          await symlinkDir(targetPath, libraryName);
        } catch (err) {
          throw new Error(JSON.stringify(err));
        }
        return {
          id: db.stringify(createdLibrary.insertedId.buffer),
          userID: db.stringify(foundUser._id.buffer),
          name: libraryName,
          folders: [folder],
        };
      },
      deleteLibrary: async (_parent, args, _context, _info) => {
        const { id, libraryName } = args;

        const foundLibrary = await db.libraries.findOne({ name: libraryName });
        if (!foundLibrary) {
          throw new Error(`Library "${libraryName}" does not exist.`);
        }

        if (db.stringify(foundLibrary._id.buffer) !== id) {
          throw new Error(`Incorrect arguments.`);
        }

        fs.rmdirSync(path.join(PUBLIC_DIRECTORY, libraryName), {
          recursive: true,
        });
        await db.libraries.deleteOne(foundLibrary);
        return { id, name: libraryName };
      },
      addFolder: async (_parent, args, _context, _info) => {
        const { targetPath, libraryName } = args;
        const foundLibrary = await db.libraries.findOne({ name: libraryName });
        if (!foundLibrary) {
          throw new Error("Invalid library.");
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
          { $push: { folders: folder } }
        );

        try {
          await symlinkDir(targetPath, libraryName);
        } catch (err) {
          throw new Error(JSON.stringify(err));
        }

        return folder;
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
