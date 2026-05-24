import { getRedisClient } from "../config/redis.js";
import { weatherCacheKey } from "../utils/cacheKey.js";

export const WEATHER_CACHE_TTL_SECONDS = 60 * 15;

export async function getCachedWeather(city) {
  const redis = getRedisClient();
  if (!redis) return null;
  try {
    const value = await redis.get(weatherCacheKey(city));
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

export async function setCachedWeather(city, payload) {
  const redis = getRedisClient();
  if (!redis) return;
  try {
    await redis.set(weatherCacheKey(city), JSON.stringify(payload), {
      EX: WEATHER_CACHE_TTL_SECONDS,
    });
  } catch {
    // non-critical
  }
}
