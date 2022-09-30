import { CustomDb } from "@plugins/db";
import bcrypt from "bcrypt";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import mercurius, { IResolvers, MercuriusOptions } from "mercurius";
import mercuriusCodegen, { gql } from "mercurius-codegen";

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
    targetPath: "./src/astral-graphql/generated.ts",
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

  type Query {
    user(id: ID!, email: String!): User
  }

  type Mutation {
    login(email: String!, password: String!): User
    createUser(email: String!, password: String!): User
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
        if (db.stringify(foundUser._id.buffer) !== id) return null;

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
          createdUser.insertedId;
          const binary = createdUser.insertedId;
          const id = db.stringify(binary.buffer);

          return { id, email };
        } catch (err) {
          throw new Error((err as Error)?.message || "Internal Server Error");
        }
      },
    },
  };
}
