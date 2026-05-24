import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CloudSun, DatabaseZap, ShieldCheck, Sparkles } from "lucide-react";
import { FavoritesCard } from "../components/weather/FavoritesCard";
import { CurrentWeatherCard } from "../components/weather/CurrentWeatherCard";
import { DailyForecast } from "../components/weather/DailyForecast";
import { HistoryCard } from "../components/weather/HistoryCard";
import { HourlyForecast } from "../components/weather/HourlyForecast";
import { SearchBar } from "../components/weather/SearchBar";
import { LoadingSkeleton } from "../components/common/LoadingSkeleton";
import { useDashboardData } from "../hooks/useDashboardData";
import { useWeatherSearch } from "../hooks/useWeatherSearch";
import { useAuth } from "../hooks/useAuth";
import { userService } from "../services/userService";

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { token, isAuthenticated } = useAuth();
  const { favorites, history, isLoading: isDashboardLoading, setFavorites } = useDashboardData();
  const { query, setQuery, weather, suggestions, isLoading, isFetchingSuggestions, error, searchByCity } =
    useWeatherSearch();
  const [isSavingFavorite, setIsSavingFavorite] = useState(false);
  const [favoriteError, setFavoriteError] = useState("");

  useEffect(() => {
    const linkedCity = searchParams.get("city");

    if (linkedCity) {
      searchByCity(linkedCity);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, searchByCity, setSearchParams]);

  async function handleSaveFavorite() {
    if (!weather || !token) {
      return;
    }

    setIsSavingFavorite(true);
    setFavoriteError("");

    try {
      const response = await userService.addFavorite(token, {
        cityName: weather.location.city,
        country: weather.location.country,
        latitude: weather.location.latitude,
        longitude: weather.location.longitude,
        timezone: weather.location.timezone,
      });

      setFavorites((currentFavorites) => {
        const existing = currentFavorites.find((item) => item.id === response.favorite.id);
        if (existing) {
          return currentFavorites.map((item) => (item.id === response.favorite.id ? response.favorite : item));
        }

        return [response.favorite, ...currentFavorites];
      });
    } catch (saveError) {
      setFavoriteError(saveError.response?.data?.message || "Unable to save favorite city.");
    } finally {
      setIsSavingFavorite(false);
    }
  }

  async function handleRemoveFavorite(id) {
    if (!token) {
      return;
    }

    await userService.removeFavorite(token, id);
    setFavorites((currentFavorites) => currentFavorites.filter((item) => item.id !== id));
  }

  return (
    <div className="space-y-6 pb-10">
      <section className="grid gap-6 lg:grid-cols-[1.35fr,0.65fr]">
        <div className="space-y-6">
          <div className="glass-panel relative overflow-hidden rounded-[36px] px-6 py-8 md:px-10 md:py-10">
            <div className="pointer-events-none absolute -left-12 -top-12 h-48 w-48 rounded-full bg-sky-300/40 blur-3xl dark:bg-sky-500/20" />
            <div className="pointer-events-none absolute -bottom-16 right-8 h-44 w-44 rounded-full bg-orange-200/50 blur-3xl dark:bg-orange-400/20" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-600 dark:bg-slate-900/40 dark:text-slate-300">
                <Sparkles size={14} />
                PERN weather platform
              </div>

              <h1 className="mt-5 max-w-3xl font-heading text-3xl font-bold leading-tight md:text-5xl">
                Intelligent city forecasts with cached weather, account sync, and a fast glassmorphism UI.
              </h1>

              <p className="mt-4 max-w-2xl text-base text-slate-600 dark:text-slate-300 md:text-lg">
                Search any city, monitor live conditions, and jump between hourly and 7-day trends with an interface designed to feel sharp on both desktop and mobile.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                <div className="rounded-3xl bg-white/40 p-4 dark:bg-slate-900/30">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Cache speed</p>
                  <p className="mt-2 flex items-center gap-2 text-xl font-bold">
                    <DatabaseZap size={18} />
                    15 min TTL
                  </p>
                </div>
                <div className="rounded-3xl bg-white/40 p-4 dark:bg-slate-900/30">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Auth layer</p>
                  <p className="mt-2 flex items-center gap-2 text-xl font-bold">
                    <ShieldCheck size={18} />
                    JWT secure
                  </p>
                </div>
                <div className="rounded-3xl bg-white/40 p-4 dark:bg-slate-900/30">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Forecast scope</p>
                  <p className="mt-2 flex items-center gap-2 text-xl font-bold">
                    <CloudSun size={18} />
                    24h + 7d
                  </p>
                </div>
              </div>
            </div>
          </div>

          <SearchBar
            query={query}
            onQueryChange={setQuery}
            onSubmit={searchByCity}
            suggestions={suggestions}
            onSelectSuggestion={searchByCity}
            isFetchingSuggestions={isFetchingSuggestions}
            isSearching={isLoading}
          />

          {error ? (
            <div className="rounded-[28px] border border-rose-300 bg-rose-50/80 p-4 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-950/30 dark:text-rose-200">
              {error}
            </div>
          ) : null}

          {favoriteError ? (
            <div className="rounded-[28px] border border-amber-300 bg-amber-50/80 p-4 text-sm text-amber-700 dark:border-amber-500/30 dark:bg-amber-950/30 dark:text-amber-200">
              {favoriteError}
            </div>
          ) : null}
        </div>

        <div className="glass-panel relative overflow-hidden rounded-[36px] p-7">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sky-100/40 via-transparent to-orange-100/30 dark:from-sky-900/20 dark:to-orange-900/10" />

          <div className="relative z-10">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500 dark:text-slate-300">Account features</p>
            <h2 className="mt-3 font-heading text-3xl font-bold leading-tight">Favorites and synced history</h2>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              Build your own weather command center with one-tap favorite cities and persistent search history in PostgreSQL.
            </p>

            <div className="mt-6 space-y-3">
              <div className="rounded-3xl bg-white/45 p-4 dark:bg-slate-900/35">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Dashboard state</p>
                <p className="mt-1 text-xl font-bold">Synced across sessions</p>
              </div>
              <div className="rounded-3xl bg-white/45 p-4 dark:bg-slate-900/35">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Search memory</p>
                <p className="mt-1 text-xl font-bold">Latest 10 lookups</p>
              </div>
            </div>

            {!isAuthenticated ? (
              <Link
                to="/auth"
                className="mt-6 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:translate-y-[-1px] dark:bg-sky-300 dark:text-slate-950"
              >
                Create account
              </Link>
            ) : (
              <Link
                to="/dashboard"
                className="mt-6 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:translate-y-[-1px] dark:bg-sky-300 dark:text-slate-950"
              >
                Open dashboard
              </Link>
            )}
          </div>
        </div>
      </section>

      {isLoading || !weather ? (
        <LoadingSkeleton />
      ) : (
        <div className="space-y-6">
          <CurrentWeatherCard
            weather={weather}
            onSaveFavorite={handleSaveFavorite}
            canSaveFavorite={isAuthenticated}
            isSavingFavorite={isSavingFavorite}
          />
          <HourlyForecast hourly={weather.hourly} />
          <DailyForecast daily={weather.daily} />
        </div>
      )}

      <section className="grid gap-6 lg:grid-cols-2">
        <FavoritesCard
          favorites={favorites}
          onSelectCity={searchByCity}
          onRemoveCity={handleRemoveFavorite}
        />
        <HistoryCard history={history} onSelectCity={searchByCity} />
      </section>

      {isDashboardLoading ? <div className="text-sm text-slate-500 dark:text-slate-300">Refreshing dashboard data...</div> : null}
    </div>
  );
}
