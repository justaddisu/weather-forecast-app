import { formatDayLabel, formatTemperature, weatherIconUrl } from "../../utils/formatters";

export function HourlyForecast({ hourly }) {
  return (
    <section className="glass-panel rounded-[28px] p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-bold">Next 24 hours</h2>
        <p className="text-sm text-slate-500 dark:text-slate-300">Hourly conditions</p>
      </div>

      <div className="hide-scrollbar mt-6 flex gap-4 overflow-x-auto pb-2">
        {hourly.map((item) => (
          <article key={item.timestamp} className="min-w-[132px] rounded-[24px] bg-white/25 p-4 dark:bg-slate-900/30">
            <p className="text-sm font-semibold">{formatDayLabel(item.timestamp, { hour: "numeric" })}</p>
            <img src={weatherIconUrl(item.icon)} alt={item.condition} className="mx-auto h-16 w-16" />
            <p className="text-center text-2xl font-bold">{formatTemperature(item.temperature)}</p>
            <p className="mt-2 text-center text-xs text-slate-500 dark:text-slate-300">Rain {item.chanceOfRain}%</p>
          </article>
        ))}
      </div>
    </section>
  );
}
