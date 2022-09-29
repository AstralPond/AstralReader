import { stringify } from "@db";
import Users from "@db/collections/Users";
import type { FastifyCookieOptions } from "@fastify/cookie";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import bcrypt from "bcrypt";
import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import mercurius, { IResolvers } from "mercurius";
import mercuriusCodegen, { gql } from "mercurius-codegen";

// TODO: change salt rounds
// https://security.stackexchange.com/questions/17207/recommended-of-rounds-for-bcrypt
const saltRounds = 11;

type PromiseType<T> = T extends PromiseLike<infer U> ? U : T;
declare module "mercurius" {
  interface MercuriusContext
    extends PromiseType<ReturnType<typeof buildContext>> {}
}

const app = Fastify({ logger: true });

export const buildContext = async (
  req: FastifyRequest,
  _reply: FastifyReply
) => {
  return {
    auth: req.headers.authorization,
  };
};

app.post("/login", async (request, reply) => {
  interface LoginBody {
    email?: string;
    password?: string;
  }
  const { email, password } = request.body as LoginBody;
  const query = gql`
    mutation Login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        id
        email
      }
    }
  `;

  try {
    const gqlResponse = await app.graphql(query, undefined, {
      email,
      password,
    });

    console.log(JSON.stringify(gqlResponse, null, 4));

    if (!gqlResponse.data || !gqlResponse.data.login)
      return reply.code(404).send("Email or password incorrect.");

    const { login } = gqlResponse.data;

    const token = jwt.sign(
      {
        data: {
          id: login.id,
        },
      },
      "super-secret",
      { expiresIn: "1h" }
    );

    // milli * seconds * minutes * hours * days
    // new Date(Date.now() + 1000 * 60 * 60 * 24)
    return reply
      .setCookie("astroreader_data", token, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 1),
        domain: "localhost",
        path: "/login",
        httpOnly: true,
        secure: true,
        signed: true,
      })
      .send({ email: login.email });
  } catch (err) {
    console.log(err);
    return reply.code(500).send("Internal Server Error");
  }
});

const schema = gql`
  type User {
    id: ID!
    email: String!
  }

  type Query {
    test: String
  }

  type Mutation {
    login(email: String!, password: String!): User
    createUser(email: String!, password: String!): User
  }
`;

const resolvers: IResolvers = {
  Query: {
    test: () => "hi",
  },
  Mutation: {
    login: async (_parent, args, _context, _info) => {
      try {
        const { email, password } = args;
        const foundUser = await Users.findOne({ email });

        if (foundUser === null) {
          throw new Error("Email or password incorrect");
        }

        const match = await bcrypt.compare(password, foundUser.password);

        if (match) {
          const { _id, email } = foundUser;
          const id = stringify(_id.buffer);

          return {
            id,
            email,
          };
        }
      } catch (e) {
        throw new Error((e as Error)?.message || "Internal Server Error");
      }

      throw new Error("Email or password incorrect");
    },
    createUser: async (_parent, args, _context, _info) => {
      try {
        const { email, password } = args;

        const foundUser = await Users.findOne({ email });

        if (foundUser) {
          throw new Error("User already exists.");
        }

        const hashedPassword = await bcrypt
          .hash(password, saltRounds)
          .catch((_err) => {
            throw new Error("Bycrpt hashing failed.");
          });

        const createdUser = await Users.insertOne({
          email,
          password: hashedPassword,
        });
        createdUser.insertedId;
        const binary = createdUser.insertedId;
        const id = stringify(binary.buffer);

        return { id, email };
      } catch (err) {
        throw new Error((err as Error)?.message || "Internal Server Error");
      }
    },
  },
};

app.register(mercurius, {
  schema,
  resolvers,
  context: buildContext,
  graphiql: true,
});

app.register(cookie, {
  secret: "my-cookie-secret",
} as FastifyCookieOptions);

const start = async () => {
  try {
    await app.register(cors, {
      origin: "http://localhost:8080",
      credentials: true,
    });
    await mercuriusCodegen(app, {
      targetPath: "./src/graphql/generated.ts",
    });

    await app.listen({ port: 3000 });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
