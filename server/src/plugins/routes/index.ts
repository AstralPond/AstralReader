import { getDirectories } from "@/libs";
import gatekeeperRoute from "@plugins/routes/gatekeeper";
import { FastifyInstance } from "fastify";

export default async function routes(app: FastifyInstance) {
  gatekeeperRoute(app);

  /**
   * For getting dir (folder) names for folder input
   */
  app.post("/dir-autocompletion", async (req, reply) => {
    interface FolderAutoCompletionBody {
      input?: string;
    }
    const { input } = req.body as FolderAutoCompletionBody;
    const dirs = getDirectories(input || "/");

    return reply.code(200).send(dirs);
  });
}
