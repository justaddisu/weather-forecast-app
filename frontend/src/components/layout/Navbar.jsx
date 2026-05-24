import { CloudSun, LogOut, MapPinned } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 px-4 pt-4 md:px-8">
      <div className="glass-panel mx-auto flex max-w-7xl items-center justify-between rounded-full px-5 py-3">
        <Link to="/" className="flex items-center gap-3">
          <div className="rounded-full bg-sky-500/20 p-2 text-sky-700 dark:text-sky-200">
            <CloudSun size={20} />
          </div>
          <div>
            <p className="font-heading text-lg font-bold">WeatherFlow</p>
            <p className="text-xs text-slate-500 dark:text-slate-300">Forecasts with fast server caching</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-5 md:flex">
          <NavLink to="/" className="text-sm font-semibold text-slate-600 dark:text-slate-200">
            Forecast
          </NavLink>
          <NavLink to="/dashboard" className="text-sm font-semibold text-slate-600 dark:text-slate-200">
            Dashboard
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {isAuthenticated ? (
            <div className="hidden items-center gap-3 rounded-full bg-white/20 px-4 py-2 md:flex">
              <MapPinned size={16} />
              <span className="text-sm font-semibold">{user?.name}</span>
              <button type="button" onClick={logout} className="text-slate-500 dark:text-slate-300">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link to="/auth" className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white dark:bg-sky-300 dark:text-slate-950">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
