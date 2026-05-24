import { Moon, SunMedium } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="glass-panel inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
    >
      {theme === "dark" ? <SunMedium size={16} /> : <Moon size={16} />}
      {theme === "dark" ? "Light" : "Dark"} mode
    </button>
  );
}
