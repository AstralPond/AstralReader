import loginRoute from "@plugins/routes/gatekeeper/login";
import { FastifyInstance } from "fastify";
import jwt from "jsonwebtoken";
import { gql } from "mercurius-codegen";

interface Payload {
  data: User;
}

interface User {
  id: string;
  email: string;
}

export default function routes(app: FastifyInstance) {
  loginRoute(app);

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
}
