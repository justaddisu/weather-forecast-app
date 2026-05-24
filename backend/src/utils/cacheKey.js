export function normalizeCity(city) {
  return city.trim().toLowerCase().replace(/\s+/g, "-");
}

export function weatherCacheKey(city) {
  return `weather:${normalizeCity(city)}`;
}
