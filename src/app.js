const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const { ApolloServer } = require("apollo-server-express");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const buildContext = require("./graphql/context");

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "10mb" }));

async function startApollo() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => buildContext(req),
  });

  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });
}

startApollo().catch(console.error);

module.exports = app;