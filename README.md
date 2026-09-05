# WeatherFlow

WeatherFlow is a full-stack weather forecast platform with authentication, favorites, search history, and Redis-backed caching. It is built as a React frontend and an Express API using PostgreSQL, Prisma, and Open-Meteo.

## Project Snapshot

- Type: Full-stack web application
- Architecture: React SPA + Express REST API + PostgreSQL + Redis
- Primary focus: API design, auth flows, caching strategy, and responsive UI
- Data provider: Open-Meteo (no API key required)

## Highlights

- Search cities with autocomplete suggestions
- View current weather, hourly forecast, and daily forecast
- Register/login with JWT-based authentication
- Save favorite cities and track search history
- Cache weather responses in Redis to reduce external API calls
- Responsive UI with loading states, route protection, and error boundaries

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router, Axios
- Backend: Node.js, Express, Prisma ORM, Zod, JWT, Redis client
- Data layer: PostgreSQL (persistent data) + Redis (cache)
- Third-party API: Open-Meteo (proxied through backend)

## Project Structure

```text
weather-forecast-app/
  backend/
    prisma/
      schema.prisma
      seed.js
    src/
      config/
      controllers/
      middleware/
      routes/
      services/
      utils/
      validators/
      app.js
      server.js
    Dockerfile
    package.json
  frontend/
    src/
      components/
      context/
      hooks/
      pages/
      services/
      utils/
      App.jsx
      main.jsx
    Dockerfile
    package.json
  database/
    schema.sql
  docker-compose.yml
  README.md
```

## API Overview

Auth:
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

Weather:
- GET /api/weather/search?city=Accra
- GET /api/weather/suggestions?q=Acc
- GET /api/health

User:
- GET /api/users/favorites
- POST /api/users/favorites
- DELETE /api/users/favorites/:id
- GET /api/users/history

## Local Development

### 1. Prerequisites

- Node.js 20+
- Docker Desktop (recommended for PostgreSQL and Redis)

### 2. Set environment variables

Create environment files from examples.

PowerShell:

```powershell
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env
```

Bash:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Backend example:

```env
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/weather_app?schema=public
REDIS_URL=redis://localhost:6379
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
PRODUCT_KEY=MY_PRODUCT_KEY
```

Frontend example:

```env
VITE_API_URL=http://localhost:4000/api
```

### 3. Install dependencies

```bash
cd backend
npm install
cd ../frontend
npm install
```

### 4. Start infrastructure

From project root:

```bash
docker compose up -d postgres redis
```

### 5. Prepare database and seed

```bash
cd backend
npx prisma generate
npx prisma db push
npm run seed
```

Demo user:
- Email: demo@weatherflow.dev
- Password: DemoPass123!

### 6. Run the app

Backend (terminal 1):

```bash
cd backend
npm run dev
```

Frontend (terminal 2):

```bash
cd frontend
npm run dev
```

App URLs:
- Frontend: http://localhost:5173
- Backend API: http://localhost:4000/api

## Docker Full Stack

To run all services using Docker Compose:

```bash
docker compose up --build
```

This starts:
- PostgreSQL on 5432
- Redis on 6379
- Backend on 4000
- Frontend on 5173

## Deployment Notes

- Frontend can be deployed to Vercel (build output: dist)
- Backend can be deployed to Render or Railway
- Use managed PostgreSQL (Neon/Supabase) and Redis (Upstash) for production
- Run prisma db push during first deployment to initialize schema

## Quality Signals

- Centralized request validation with Zod schemas
- Global error handling and async controller wrappers
- Route-level and auth-specific rate limiting
- Cache-aside Redis strategy with TTL for weather payloads
- Backend-only token handling for authenticated endpoints

## Commit Message Standard

Use clear, professional, imperative commit messages. Recommended format:

```text
type(scope): concise summary
```

Examples:

- feat(weather): add hourly forecast cache metadata
- fix(auth): return 401 for invalid credentials
- docs(readme): clarify local setup and deployment notes

## Implementation Notes

Original work and implementation by Addisu Dessalegn.

- Request validation is handled with Zod middleware
- Rate limiting is enabled globally with stricter auth limits
- Redis uses a cache-aside strategy with a 15-minute TTL
- Prisma schema source of truth: backend/prisma/schema.prisma

## Product Key / Licensing

This project requires a valid product key for licensed usage.

- Product keys are issued privately per project and per deployment.
- Do not commit product keys to source code, README files, or public repositories.
- Store product keys only in secure secret managers or private environment files.

To request a product key, contact:

- Name: Addisu Dessalegn
- Email: justaddisu@gmail.com
- Phone/WhatsApp: +251 910 170 759
- LinkedIn: https://www.linkedin.com/in/addisu-dessalegn-6a852b11a/
- Portfolio: https://justaddisu.github.io/My-Portfolio
