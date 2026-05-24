export function FavoritesCard({ favorites, onSelectCity, onRemoveCity }) {
  return (
    <section className="glass-panel rounded-[28px] p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-bold">Favorite cities</h2>
        <p className="text-sm text-slate-500 dark:text-slate-300">Quick access dashboard</p>
      </div>

      <div className="mt-5 space-y-3">
        {favorites.length === 0 ? (
          <div className="rounded-3xl bg-white/20 p-5 text-sm text-slate-500 dark:bg-slate-900/20 dark:text-slate-300">
            Save cities from the main forecast screen to build your personal dashboard.
          </div>
        ) : (
          favorites.map((favorite) => (
            <article key={favorite.id} className="flex items-center justify-between rounded-3xl bg-white/20 p-4 dark:bg-slate-900/25">
              <button type="button" onClick={() => onSelectCity(favorite.cityName)} className="text-left">
                <p className="font-semibold">{favorite.cityName}</p>
                <p className="text-sm text-slate-500 dark:text-slate-300">{favorite.country || "Saved city"}</p>
              </button>
              <button type="button" onClick={() => onRemoveCity(favorite.id)} className="text-sm font-semibold text-rose-500">
                Remove
              </button>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
