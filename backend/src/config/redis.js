import { createClient } from "redis";
import { env } from "./env.js";

let redisClient = null;

export async function connectRedis() {
  const client = createClient({
    url: env.REDIS_URL,
    socket: {
      connectTimeout: 3000,
      reconnectStrategy: false, // don't retry — we treat Redis as optional
    },
  });

  client.on("error", () => {});

  try {
    await client.connect();
    redisClient = client;
    console.log("Redis connected");
  } catch {
    console.warn("Redis unavailable — caching disabled. The app will continue without it.");
    redisClient = null;
  }

  return redisClient;
}

export function getRedisClient() {
  return redisClient;
}
