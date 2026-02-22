const { decodeToken } = require("../middleware/auth");

module.exports = function buildContext(req) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  let user = null;
  if (token) {
    try {
      user = decodeToken(token);
    } catch (e) {
      user = null; // invalid token => treated as not logged in
    }
  }

  return { req, user };
};