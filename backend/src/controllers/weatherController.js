import { asyncHandler } from "../utils/asyncHandler.js";
import { getCitySuggestions } from "../services/openWeatherService.js";
import { getWeatherByCity } from "../services/weatherService.js";

export const searchWeather = asyncHandler(async (req, res) => {
  const weather = await getWeatherByCity(req.query.city, req.user?.id);
  res.json(weather);
});

export const suggestions = asyncHandler(async (req, res) => {
  const results = await getCitySuggestions(req.query.q);
  res.json({ suggestions: results });
});
