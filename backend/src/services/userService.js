import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/appError.js";

export async function recordSearchHistory(userId, location) {
  if (!userId) {
    return null;
  }

  return prisma.searchHistory.create({
    data: {
      userId,
      query: location.city,
      cityName: location.city,
      country: location.country,
      latitude: location.latitude,
      longitude: location.longitude,
    },
  });
}

export async function getSearchHistory(userId) {
  return prisma.searchHistory.findMany({
    where: { userId },
    orderBy: { searchedAt: "desc" },
    take: 10,
  });
}

export async function listFavoriteCities(userId) {
  return prisma.favoriteCity.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function addFavoriteCity(userId, payload) {
  return prisma.favoriteCity.upsert({
    where: {
      userId_cityName: {
        userId,
        cityName: payload.cityName,
      },
    },
    update: {
      country: payload.country,
      latitude: payload.latitude,
      longitude: payload.longitude,
      timezone: payload.timezone,
    },
    create: {
      userId,
      cityName: payload.cityName,
      country: payload.country,
      latitude: payload.latitude,
      longitude: payload.longitude,
      timezone: payload.timezone,
    },
  });
}

export async function removeFavoriteCity(userId, favoriteId) {
  const favorite = await prisma.favoriteCity.findFirst({
    where: {
      id: favoriteId,
      userId,
    },
  });

  if (!favorite) {
    throw new AppError("Favorite city not found", 404);
  }

  await prisma.favoriteCity.delete({ where: { id: favoriteId } });
}
