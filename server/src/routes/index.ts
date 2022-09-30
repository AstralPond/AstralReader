import gatekeeperRoute from "@/routes/gatekeeper";
import { FastifyInstance } from "fastify";

export default async function routes(app: FastifyInstance) {
  gatekeeperRoute(app);
}
