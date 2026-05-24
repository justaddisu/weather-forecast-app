import { Link, useNavigate } from "react-router-dom";
import { FavoritesCard } from "../components/weather/FavoritesCard";
import { HistoryCard } from "../components/weather/HistoryCard";
import { LoadingSkeleton } from "../components/common/LoadingSkeleton";
import { useDashboardData } from "../hooks/useDashboardData";
import { useAuth } from "../hooks/useAuth";
import { userService } from "../services/userService";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { favorites, history, isLoading, setFavorites } = useDashboardData();

  async function handleRemoveFavorite(id) {
    await userService.removeFavorite(token, id);
    setFavorites((currentFavorites) => currentFavorites.filter((item) => item.id !== id));
  }

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-[32px] p-8">
        <p className="text-sm uppercase tracking-[0.25em] text-slate-500 dark:text-slate-300">Protected dashboard</p>
        <h1 className="mt-4 font-heading text-4xl font-bold">Your saved weather workflow</h1>
        <p className="mt-4 max-w-3xl text-sm text-slate-500 dark:text-slate-300">
          Access favorite cities instantly, jump back into recent searches, and continue exploring from the main forecast screen.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white dark:bg-sky-300 dark:text-slate-950"
        >
          Search another city
        </Link>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <FavoritesCard
          favorites={favorites}
          onSelectCity={(city) => navigate(`/?city=${encodeURIComponent(city)}`)}
          onRemoveCity={handleRemoveFavorite}
        />
        <HistoryCard history={history} onSelectCity={(city) => navigate(`/?city=${encodeURIComponent(city)}`)} />
      </section>
    </div>
  );
}
