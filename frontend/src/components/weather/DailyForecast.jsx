import { formatDayLabel, formatTemperature, weatherIconUrl } from "../../utils/formatters";

export function DailyForecast({ daily }) {
  return (
    <section className="glass-panel rounded-[28px] p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-bold">7-day forecast</h2>
        <p className="text-sm text-slate-500 dark:text-slate-300">Daily highs and lows</p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {daily.map((day) => (
          <article key={day.timestamp} className="rounded-[24px] bg-white/25 p-4 transition hover:-translate-y-1 dark:bg-slate-900/30">
            <p className="text-sm font-semibold">{formatDayLabel(day.timestamp)}</p>
            <img src={weatherIconUrl(day.icon)} alt={day.condition} className="mx-auto h-16 w-16" />
            <p className="text-center font-heading text-xl font-bold">{day.condition}</p>
            <div className="mt-4 flex items-center justify-between text-sm font-semibold">
              <span>{formatTemperature(day.high)}</span>
              <span className="text-slate-500 dark:text-slate-300">{formatTemperature(day.low)}</span>
            </div>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-300">Chance of rain {day.chanceOfRain}%</p>
          </article>
        ))}
      </div>
    </section>
  );
}
