import app from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./config/prisma.js";
import { connectRedis } from "./config/redis.js";

async function startServer() {
  await prisma.$connect();
  await connectRedis();

  app.listen(env.PORT, () => {
    console.log(`Weather API listening on port ${env.PORT}`);
  });
}

startServer().catch(async (error) => {
  console.error("Server failed to start", error);
  await prisma.$disconnect();
  process.exit(1);
});