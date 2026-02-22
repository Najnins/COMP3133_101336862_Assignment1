require("dotenv").config();
const { createServer } = require("http");
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 4000;

async function start() {
  await connectDB();
  const httpServer = createServer(app);

  httpServer.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}/graphql`);
  });
}

start().catch((err) => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});