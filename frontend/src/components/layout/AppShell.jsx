import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

export function AppShell() {
  return (
    <div className="weather-grid min-h-screen pb-10">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pt-8 md:px-8">
        <Outlet />
      </main>
    </div>
  );
}
