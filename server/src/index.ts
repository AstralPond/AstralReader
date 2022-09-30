import type { FastifyCookieOptions } from "@fastify/cookie";
import cookie from "@fastify/cookie";
import cors, { FastifyCorsOptions } from "@fastify/cors";
import fastifyStatic, { FastifyStaticOptions } from "@fastify/static";
import astralGraphql from "@plugins/astral-graphql";
import db from "@plugins/db";
import routes from "@plugins/routes";
import dotenv from "dotenv";
import Fastify from "fastify";
import path from "path";

dotenv.config();

const app = Fastify({ logger: true });

const corsOptions: FastifyCorsOptions = {
  origin: "http://localhost:8080",
  credentials: true,
};

const fastifyStaticOptions: FastifyStaticOptions = {
  root: path.join(__dirname, "public"),
  allowedPath: (_pathName, _root, request) => {
    // console.log(request.headers.authorization, "yeet");
    if (!request.headers.authorization) return false;
    return true;
  },
};

const cookieOptions: FastifyCookieOptions = {
  secret: "my-cookie-secret",
};

const start = async () => {
  try {
    // Load Plugins
    await app.register(db);
    await app.register(astralGraphql);
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
