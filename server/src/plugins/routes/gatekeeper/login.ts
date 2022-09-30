import { FastifyInstance } from "fastify";
import jwt from "jsonwebtoken";
import { gql } from "mercurius-codegen";

export default async function (app: FastifyInstance) {
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

      if (!gqlResponse.data || !gqlResponse.data.login)
        return reply.code(401).send("Email or password incorrect.");

      console.log(JSON.stringify(gqlResponse, null, 4));

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
}
