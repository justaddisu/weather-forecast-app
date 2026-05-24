# WeatherFlow

WeatherFlow is a full-stack weather forecast platform with authentication, favorites, search history, and Redis-backed caching. It is built as a React frontend and an Express API using PostgreSQL, Prisma, and OpenWeatherMap.

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
- Third-party API: OpenWeatherMap (proxied through backend)

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
- OpenWeatherMap API key

### 2. Set environment variables

Create environment files for backend and frontend.

Backend example:

```env
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/weather_app?schema=public
REDIS_URL=redis://localhost:6379
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
OPENWEATHER_API_KEY=your-openweather-api-key
OPENWEATHER_BASE_URL=https://api.openweathermap.org
OPENWEATHER_TIMEOUT_MS=8000
FRONTEND_URL=http://localhost:5173
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

## Push This Project To GitHub

Run these commands from the project root:

```bash
git init
git add .
git commit -m "Initial commit: WeatherFlow full-stack app"
git branch -M main
git remote add origin <your-repository-url>
git push -u origin main
```

If the remote already exists, update it with:

```bash
git remote set-url origin <your-repository-url>
git push -u origin main
```

## Implementation Notes

- OpenWeatherMap API key is only used on the backend
- Request validation is handled with Zod middleware
- Rate limiting is enabled globally with stricter auth limits
- Redis uses a cache-aside strategy with a 15-minute TTL
- Prisma schema source of truth: backend/prisma/schema.prisma
