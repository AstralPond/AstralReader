import { stringify } from "@db";
import Users from "@db/collections/Users";
import type { FastifyCookieOptions } from "@fastify/cookie";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import fastifyStatic from "@fastify/static";
import bcrypt from "bcrypt";
import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import mercurius, { IResolvers } from "mercurius";
import mercuriusCodegen, { gql } from "mercurius-codegen";
import path from "path";

interface Payload {
  data: User;
}

interface User {
  id: string;
  email: string;
}

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

// Checks if JWT token from cookie is valid
app.get("/gatekeeper", async (req, reply) => {
  if (!req.cookies.astralreader_data)
    return reply.code(403).send("Not Authorized.");

  try {
    const { valid, value } = req.unsignCookie(req.cookies.astralreader_data);

    if (!valid || !value) {
      // TODO: log user's IP and info
      return reply.code(403).send("This request has been reported.");
    }

    const decoded = jwt.verify(value, process.env.JWT_SECRET!) as Payload;

    const { id, email } = decoded.data;

    if (!id || !email)
      return reply.code(403).send("This request has been reported.");

    const query = gql`
      query User($id: ID!, $email: String!) {
        user(id: $id, email: $email) {
          id
          email
        }
      }
    `;

    const gqlResponse = await app.graphql(query, undefined, {
      id,
      email,
    });

    if (!gqlResponse || !gqlResponse.data?.user)
      throw new Error("Request reported.");

    const { user } = gqlResponse.data;

    const token = jwt.sign(
      {
        data: {
          id: user.id,
          email: user.email,
        },
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    // milli * seconds * minutes * hours * days
    // new Date(Date.now() + 1000 * 60 * 60 * 24)
    return reply
      .setCookie("astralreader_data", token, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 1), // 1 hour
        domain: "localhost",
        path: "/gatekeeper",
        httpOnly: true,
        secure: true,
        signed: true,
      })
      .send({ email: user.email });
  } catch (err) {
    return reply.code(500).send(err);
  }
});

app.post("/gatekeeper/login", async (request, reply) => {
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
      return reply.code(401).send("Email or password incorrect.");

    const { login } = gqlResponse.data;

    const token = jwt.sign(
      {
        data: {
          id: login.id,
          email: login.email,
        },
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    // milli * seconds * minutes * hours * days
    // new Date(Date.now() + 1000 * 60 * 60 * 24)
    return reply
      .setCookie("astralreader_data", token, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 1), // 1 hour
        domain: "localhost",
        path: "/gatekeeper",
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
    user(id: ID!, email: String!): User
  }

  type Mutation {
    login(email: String!, password: String!): User
    createUser(email: String!, password: String!): User
  }
`;

const resolvers: IResolvers = {
  Query: {
    user: async (_parent, args, _context, _info) => {
      const { id, email } = args;

      const foundUser = await Users.findOne({
        email,
      });

      if (!foundUser) return null;
      if (stringify(foundUser._id.buffer) !== id) return null;

      return { id, email };
    },
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

const start = async () => {
  try {
    await app.register(cookie, {
      secret: "my-cookie-secret",
    } as FastifyCookieOptions);

    await app.register(fastifyStatic, {
      root: path.join(__dirname, "public"),
      allowedPath: (_pathName, _root, request) => {
        // console.log(request.headers.authorization, "yeet");
        if (!request.headers.authorization) return false;
        return true;
      },
    });

    await app.register(cors, {
      origin: "http://localhost:8080",
      credentials: true,
    });

    await app.register(mercurius, {
      schema,
      resolvers,
      context: buildContext,
      graphiql: true,
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
