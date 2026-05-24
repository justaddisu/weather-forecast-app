import { z } from "zod";

export const citySearchQuerySchema = z.object({
  city: z.string().trim().min(2).max(80),
});

export const suggestionQuerySchema = z.object({
  q: z.string().trim().min(2).max(80),
});

export const favoriteCitySchema = z.object({
  cityName: z.string().trim().min(2).max(80),
  country: z.string().trim().max(80).optional().nullable(),
  latitude: z.number(),
  longitude: z.number(),
  timezone: z.string().trim().max(80).optional().nullable(),
});
