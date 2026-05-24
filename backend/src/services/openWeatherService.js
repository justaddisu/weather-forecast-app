import axios from "axios";
import { AppError } from "../utils/appError.js";

// Open-Meteo: completely free, no API key required
const geoClient = axios.create({
  baseURL: "https://geocoding-api.open-meteo.com",
  timeout: 8000,
});

const weatherClient = axios.create({
  baseURL: "https://api.open-meteo.com",
  timeout: 8000,
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function requestWithRetry(client, config, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await client.request(config);
      return response.data;
    } catch (error) {
      const isLastAttempt = attempt === retries;
      if (isLastAttempt) {
        if (error.code === "ECONNABORTED") throw new AppError("Weather service timed out. Please try again.", 504);
        if (error.response?.status === 404) throw new AppError("City not found", 404);
        throw new AppError("Weather provider is currently unavailable", 502);
      }
      await sleep(300 * (attempt + 1));
    }
  }
}

// WMO weather code → { condition, icon (OWM-compatible) }
function wmoToMeta(code, isDay = true) {
  const d = isDay ? "d" : "n";
  if (code === 0) return { condition: "Clear", description: "clear sky", icon: `01${d}` };
  if (code <= 2) return { condition: "Clouds", description: "partly cloudy", icon: `02${d}` };
  if (code === 3) return { condition: "Clouds", description: "overcast", icon: `04${d}` };
  if (code <= 48) return { condition: "Mist", description: "foggy", icon: `50${d}` };
  if (code <= 55) return { condition: "Drizzle", description: "drizzle", icon: `09${d}` };
  if (code <= 65) return { condition: "Rain", description: "rain", icon: `10${d}` };
  if (code <= 77) return { condition: "Snow", description: "snow", icon: `13${d}` };
  if (code <= 82) return { condition: "Rain", description: "rain showers", icon: `09${d}` };
  if (code <= 86) return { condition: "Snow", description: "snow showers", icon: `13${d}` };
  return { condition: "Thunderstorm", description: "thunderstorm", icon: `11${d}` };
}

export async function getCitySuggestions(query) {
  const data = await requestWithRetry(geoClient, {
    url: "/v1/search",
    method: "GET",
    params: { name: query, count: 5, language: "en", format: "json" },
  });

  const results = data?.results || [];

  if (results.length === 0) {
    return [];
  }

  return results.map((item) => ({
    cityName: item.name,
    country: item.country_code || item.country,
    state: item.admin1 || null,
    latitude: item.latitude,
    longitude: item.longitude,
    label: [item.name, item.admin1, item.country].filter(Boolean).join(", "),
  }));
}

export async function fetchWeatherBundle(city) {
  const suggestions = await getCitySuggestions(city);
  const location = suggestions[0];

  if (!location) {
    throw new AppError("City not found", 404);
  }

  const data = await requestWithRetry(weatherClient, {
    url: "/v1/forecast",
    method: "GET",
    params: {
      latitude: location.latitude,
      longitude: location.longitude,
      current: [
        "temperature_2m",
        "relative_humidity_2m",
        "apparent_temperature",
        "weather_code",
        "wind_speed_10m",
        "surface_pressure",
        "cloud_cover",
        "is_day",
      ].join(","),
      hourly: ["temperature_2m", "weather_code", "precipitation_probability"].join(","),
      daily: [
        "weather_code",
        "temperature_2m_max",
        "temperature_2m_min",
        "precipitation_probability_max",
      ].join(","),
      timezone: "auto",
      forecast_days: 7,
      wind_speed_unit: "ms",
    },
  });

  const cur = data.current;
  const isDay = cur.is_day === 1;
  const curMeta = wmoToMeta(cur.weather_code, isDay);

  // Open-Meteo hourly gives 7*24 = 168 entries; take next 24 starting from now
  const nowIso = cur.time;
  const hourlyTimes = data.hourly.time;
  const startIdx = Math.max(
    0,
    hourlyTimes.findIndex((t) => t >= nowIso),
  );
  const hourlySlice = hourlyTimes.slice(startIdx, startIdx + 24);

  return {
    location: {
      city: location.cityName,
      country: location.country,
      state: location.state,
      latitude: location.latitude,
      longitude: location.longitude,
      timezone: data.timezone,
    },
    current: {
      temperature: Math.round(cur.temperature_2m),
      humidity: cur.relative_humidity_2m,
      windSpeed: Math.round(cur.wind_speed_10m * 10) / 10,
      condition: curMeta.condition,
      description: curMeta.description,
      feelsLike: Math.round(cur.apparent_temperature),
      pressure: Math.round(cur.surface_pressure),
      // visibility not exposed by Open-Meteo free tier; estimate from cloud cover
      visibility: Math.max(1, Math.round(10 - (cur.cloud_cover / 100) * 7)),
      icon: curMeta.icon,
    },
    hourly: hourlySlice.map((time, i) => {
      const idx = startIdx + i;
      const meta = wmoToMeta(data.hourly.weather_code[idx], true);
      return {
        timestamp: Math.floor(new Date(time).getTime() / 1000),
        temperature: Math.round(data.hourly.temperature_2m[idx]),
        chanceOfRain: data.hourly.precipitation_probability[idx] ?? 0,
        condition: meta.condition,
        icon: meta.icon,
      };
    }),
    daily: data.daily.time.map((time, i) => {
      const meta = wmoToMeta(data.daily.weather_code[i], true);
      return {
        timestamp: Math.floor(new Date(time).getTime() / 1000),
        high: Math.round(data.daily.temperature_2m_max[i]),
        low: Math.round(data.daily.temperature_2m_min[i]),
        chanceOfRain: data.daily.precipitation_probability_max[i] ?? 0,
        condition: meta.condition,
        icon: meta.icon,
      };
    }),
  };
}
