import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-2xl items-center justify-center py-20">
      <section className="glass-panel rounded-[32px] p-8 text-center">
        <p className="text-sm uppercase tracking-[0.25em] text-slate-500 dark:text-slate-300">404</p>
        <h1 className="mt-4 font-heading text-4xl font-bold">This forecast drifted off course.</h1>
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-300">
          Head back to the weather dashboard and search for another city.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white dark:bg-sky-300 dark:text-slate-950"
        >
          Return home
        </Link>
      </section>
    </div>
  );
}