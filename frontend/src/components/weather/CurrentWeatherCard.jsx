import { CloudRain, Droplets, Eye, Gauge, Thermometer, Wind } from "lucide-react";
import { formatTemperature, weatherIconUrl } from "../../utils/formatters";

const metrics = [
  { key: "feelsLike", label: "Feels like", icon: Thermometer, suffix: "\u00b0" },
  { key: "humidity", label: "Humidity", icon: Droplets, suffix: "%" },
  { key: "windSpeed", label: "Wind", icon: Wind, suffix: " m/s" },
  { key: "pressure", label: "Pressure", icon: Gauge, suffix: " hPa" },
  { key: "visibility", label: "Visibility", icon: Eye, suffix: " km" },
];

export function CurrentWeatherCard({ weather, onSaveFavorite, canSaveFavorite, isSavingFavorite }) {
  return (
    <section className="glass-panel animate-float rounded-[32px] p-6 md:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">Current weather</p>
          <h1 className="mt-4 font-heading text-4xl font-bold md:text-6xl">{weather.location.city}</h1>
          <p className="mt-2 text-base text-slate-500 dark:text-slate-300">
            {weather.location.country} • {weather.current.description}
          </p>
          <div className="mt-6 flex items-center gap-4">
            <img
              src={weatherIconUrl(weather.current.icon)}
              alt={weather.current.condition}
              className="h-20 w-20 rounded-full bg-white/20"
            />
            <div>
              <p className="font-heading text-6xl font-bold">{formatTemperature(weather.current.temperature)}</p>
              <p className="mt-2 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-300">
                <CloudRain size={16} />
                Cache status: {weather.meta?.cache || "MISS"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:items-end">
          <button
            type="button"
            onClick={onSaveFavorite}
            disabled={!canSaveFavorite || isSavingFavorite}
            className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-sky-200 dark:text-slate-950"
          >
            {isSavingFavorite ? "Saving..." : "Save to favorites"}
          </button>
          <div className="grid gap-3 sm:grid-cols-2 lg:max-w-xl">
            {metrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <div key={metric.key} className="rounded-3xl bg-white/25 p-4 dark:bg-slate-900/30">
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-300">
                    <Icon size={16} />
                    {metric.label}
                  </div>
                  <p className="mt-3 text-2xl font-bold">
                    {weather.current[metric.key]}
                    {metric.suffix}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
