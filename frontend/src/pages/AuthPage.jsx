import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const initialForm = {
  name: "",
  email: "",
  password: "",
};

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (mode === "register") {
        await register(form);
      } else {
        await login({ email: form.email, password: form.password });
      }

      navigate(location.state?.from || "/dashboard", { replace: true });
    } catch (submitError) {
      setError(submitError.response?.data?.message || "Authentication failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[0.9fr,1.1fr]">
      <section className="glass-panel rounded-[32px] p-8">
        <p className="text-sm uppercase tracking-[0.25em] text-slate-500 dark:text-slate-300">Authentication</p>
        <h1 className="mt-4 font-heading text-4xl font-bold">Secure your weather workspace.</h1>
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-300">
          JWT-authenticated sessions unlock saved favorites, search history, and a protected dashboard.
        </p>
      </section>

      <section className="glass-panel rounded-[32px] p-8">
        <div className="flex rounded-full bg-white/25 p-1 dark:bg-slate-900/25">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 rounded-full px-4 py-3 text-sm font-semibold ${mode === "login" ? "bg-slate-950 text-white dark:bg-sky-300 dark:text-slate-950" : "text-slate-600 dark:text-slate-300"}`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`flex-1 rounded-full px-4 py-3 text-sm font-semibold ${mode === "register" ? "bg-slate-950 text-white dark:bg-sky-300 dark:text-slate-950" : "text-slate-600 dark:text-slate-300"}`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {mode === "register" ? (
            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Name</span>
              <input
                value={form.name}
                onChange={(event) => setForm((currentForm) => ({ ...currentForm, name: event.target.value }))}
                className="w-full rounded-2xl border-none bg-white/30 px-4 py-3 dark:bg-slate-900/30"
                required
              />
            </label>
          ) : null}

          <label className="block">
            <span className="mb-2 block text-sm font-semibold">Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm((currentForm) => ({ ...currentForm, email: event.target.value }))}
              className="w-full rounded-2xl border-none bg-white/30 px-4 py-3 dark:bg-slate-900/30"
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold">Password</span>
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm((currentForm) => ({ ...currentForm, password: event.target.value }))}
              className="w-full rounded-2xl border-none bg-white/30 px-4 py-3 dark:bg-slate-900/30"
              required
            />
          </label>

          {error ? (
            <div className="rounded-2xl border border-rose-300 bg-rose-50/80 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-950/30 dark:text-rose-200">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {isSubmitting ? "Please wait..." : mode === "register" ? "Create account" : "Sign in"}
          </button>
        </form>
      </section>
    </div>
  );
}
