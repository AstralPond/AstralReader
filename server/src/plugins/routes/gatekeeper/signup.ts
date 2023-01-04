import { type FastifyDbInstance } from "@/plugins/astral-graphql";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default async function (app: FastifyDbInstance) {
  app.post("/gatekeeper/signup", async (request, reply) => {
    interface SignupBody {
      email?: string;
      password?: string;
    }
    const { email, password } = request.body as SignupBody;

    if (!email || !password) {
      return reply.code(401).send("Email or password missing.");
    }

    try {
      const foundUser = await app.db.users.findOne({ email });

      // Don't create user if user with given email already exists
      if (foundUser) {
        return reply.code(400).send("User already exists.");
      }

      const hashedPassword = await bcrypt
        .hash(password, Number(process.env.SALT_ROUNDS))
        .catch((_err) => {
          throw new Error("Bycrpt hashing failed.");
        });

      const createdUser = await app.db.users.insertOne({
        email,
        password: hashedPassword,
      });

      if (createdUser.insertedId) {
        // return reply.code(200).send("User created.");

        const token = jwt.sign(
          {
            data: {
              id: app.db.stringify(createdUser.insertedId.buffer),
              email,
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
            sameSite: "none",
          })
          .send("User Created.");
      } else {
        return reply.code(500).send("Something went wrong.");
      }
    } catch (e) {
      return reply.code(500).send(JSON.stringify(e));
    }
  });
}
