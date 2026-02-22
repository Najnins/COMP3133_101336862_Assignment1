const jwt = require("jsonwebtoken");
const { GraphQLError } = require("graphql");

function requireAuth(context) {
  if (!context.user) {
    throw new GraphQLError("Unauthorized", {
      extensions: { code: "UNAUTHORIZED" }
    });
  }
  return context.user;
}

function decodeToken(token) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET missing in .env");
  return jwt.verify(token, secret);
}

module.exports = { requireAuth, decodeToken };