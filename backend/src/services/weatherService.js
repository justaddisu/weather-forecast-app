import { prisma } from "../config/prisma.js";
import { fetchWeatherBundle } from "./openWeatherService.js";
import { getCachedWeather, setCachedWeather, WEATHER_CACHE_TTL_SECONDS } from "./cacheService.js";
import { weatherCacheKey } from "../utils/cacheKey.js";
import { recordSearchHistory } from "./userService.js";

export async function getWeatherByCity(city, userId = null) {
  const cachedPayload = await getCachedWeather(city);

  if (cachedPayload) {
    await prisma.cachedWeatherLog.upsert({
      where: { cacheKey: weatherCacheKey(city) },
      update: {
        cacheHits: { increment: 1 },
        lastStatus: "HIT",
        payload: cachedPayload,
      },
      create: {
        cacheKey: weatherCacheKey(city),
        cityName: cachedPayload.location.city,
        payload: cachedPayload,
        cacheHits: 1,
        lastStatus: "HIT",
        expiresAt: new Date(Date.now() + WEATHER_CACHE_TTL_SECONDS * 1000),
      },
    });

    await recordSearchHistory(userId, cachedPayload.location);

    return {
      ...cachedPayload,
      meta: {
        cache: "HIT",
      },
    };
  }

  const freshPayload = await fetchWeatherBundle(city);

  await setCachedWeather(city, freshPayload);

  await prisma.cachedWeatherLog.upsert({
    where: { cacheKey: weatherCacheKey(city) },
    update: {
      cityName: freshPayload.location.city,
      payload: freshPayload,
      lastStatus: "MISS",
      expiresAt: new Date(Date.now() + WEATHER_CACHE_TTL_SECONDS * 1000),
      lastFetchedAt: new Date(),
    },
    create: {
      cacheKey: weatherCacheKey(city),
      cityName: freshPayload.location.city,
      payload: freshPayload,
      lastStatus: "MISS",
      expiresAt: new Date(Date.now() + WEATHER_CACHE_TTL_SECONDS * 1000),
      lastFetchedAt: new Date(),
    },
  });

  await recordSearchHistory(userId, freshPayload.location);

  return {
    ...freshPayload,
    meta: {
      cache: "MISS",
    },
  };
}
