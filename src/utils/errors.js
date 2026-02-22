const { GraphQLError } = require("graphql");

function throwValidationError(message, details = []) {
  throw new GraphQLError(message, {
    extensions: { code: "BAD_USER_INPUT", details }
  });
}

function throwNotFound(message) {
  throw new GraphQLError(message, {
    extensions: { code: "NOT_FOUND" }
  });
}

function throwAuthError(message = "Unauthorized") {
  throw new GraphQLError(message, {
    extensions: { code: "UNAUTHORIZED" }
  });
}

function throwServerError(message = "Internal Server Error") {
  throw new GraphQLError(message, {
    extensions: { code: "INTERNAL_SERVER_ERROR" }
  });
}

// Normalize errors (Mongoose duplicate key, etc.)
function formatApolloError(err) {
  const msg = err.message || "GraphQL Error";

  // Mongo duplicate key
  if (msg.includes("E11000 duplicate key")) {
    return {
      message: "Duplicate value. This field must be unique.",
      extensions: { code: "DUPLICATE_KEY" }
    };
  }

  return err;
}

module.exports = {
  throwValidationError,
  throwNotFound,
  throwAuthError,
  throwServerError,
  formatApolloError
};