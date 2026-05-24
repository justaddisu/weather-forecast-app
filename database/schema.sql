CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE search_history (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  city_name TEXT NOT NULL,
  country TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  searched_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX search_history_user_id_searched_at_idx ON search_history (user_id, searched_at DESC);

CREATE TABLE favorite_cities (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  city_name TEXT NOT NULL,
  country TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  timezone TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, city_name)
);

CREATE INDEX favorite_cities_user_id_created_at_idx ON favorite_cities (user_id, created_at DESC);

CREATE TABLE cached_weather_logs (
  id TEXT PRIMARY KEY,
  cache_key TEXT NOT NULL UNIQUE,
  city_name TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'open-meteo',
  payload JSONB NOT NULL,
  cache_hits INTEGER NOT NULL DEFAULT 0,
  last_status TEXT NOT NULL DEFAULT 'MISS',
  expires_at TIMESTAMP NOT NULL,
  last_fetched_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX cached_weather_logs_city_name_idx ON cached_weather_logs (city_name);
