export function HistoryCard({ history, onSelectCity }) {
  return (
    <section className="glass-panel rounded-[28px] p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-bold">Recent searches</h2>
        <p className="text-sm text-slate-500 dark:text-slate-300">Stored in PostgreSQL</p>
      </div>

      <div className="mt-5 space-y-3">
        {history.length === 0 ? (
          <div className="rounded-3xl bg-white/20 p-5 text-sm text-slate-500 dark:bg-slate-900/20 dark:text-slate-300">
            Search activity will appear here once you make authenticated weather requests.
          </div>
        ) : (
          history.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectCity(item.cityName)}
              className="flex w-full items-center justify-between rounded-3xl bg-white/20 p-4 text-left dark:bg-slate-900/25"
            >
              <div>
                <p className="font-semibold">{item.cityName}</p>
                <p className="text-sm text-slate-500 dark:text-slate-300">{item.country || "Search history item"}</p>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-300">
                {new Date(item.searchedAt).toLocaleString()}
              </p>
            </button>
          ))
        )}
      </div>
    </section>
  );
}
