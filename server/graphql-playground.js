import { ApolloServer } from "apollo-server";

const typeDefs = `

  type Query {
    add(x: Int, y: Int): Int
  }

`;

const resolvers = {
  Query: {
    add: async (_, { x, y }) => x + y,
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
});

(async () => {
  const { url } = await server.listen();
  console.log(`🚀 Server ready at ${url}`);
})();
