# Database Overview

This folder mirrors the PostgreSQL design used by Prisma in the backend.

## Tables

- `users`: registered accounts for JWT-authenticated access.
- `search_history`: stores each authenticated city lookup.
- `favorite_cities`: stores a user's saved quick-access locations.
- `cached_weather_logs`: stores the most recent cached payload and cache metadata for each city key.

## Notes

- The Prisma schema in `backend/prisma/schema.prisma` is the source of truth.
- `schema.sql` is included for documentation and manual inspection.
- Redis holds live 15-minute cache entries, while PostgreSQL keeps an auditable cache log.
