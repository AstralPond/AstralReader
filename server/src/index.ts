import type { FastifyCookieOptions } from "@fastify/cookie";
import cookie from "@fastify/cookie";
import cors, { FastifyCorsOptions } from "@fastify/cors";
import fastifyStatic, { FastifyStaticOptions } from "@fastify/static";
import astralGraphqlPlugin from "@plugins/astral-graphql";
import dbPlugin from "@plugins/db";
import routes from "@plugins/routes";
import Fastify from "fastify";
import path from "path";

const app = Fastify({ logger: true });

// The path to the public directory (where we make symlinks to libraries)
export const PUBLIC_DIRECTORY = path.join(__dirname, "public")

const corsOptions: FastifyCorsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

const fastifyStaticOptions: FastifyStaticOptions = {
  root: PUBLIC_DIRECTORY,
  allowedPath: (_pathName, _root, request) => {
    console.log(request.headers.authorization, "yeet");
    // if (!request.headers.authorization) return false;
    return true;
  },
};

const cookieOptions: FastifyCookieOptions = {
  secret: "my-cookie-secret",
};

const start = async () => {
  try {
    // Load Plugins
    await app.register(dbPlugin);
    await app.register(astralGraphqlPlugin);
    await app.register(routes);

    await app.register(cookie, cookieOptions);
    await app.register(fastifyStatic, fastifyStaticOptions);

    await app.register(cors, corsOptions);

    // Start app
    await app.listen({ port: 3000 });

  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
