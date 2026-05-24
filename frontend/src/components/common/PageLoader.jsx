export function PageLoader({ label = "Loading" }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="glass-panel rounded-3xl px-8 py-6 text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600" />
        <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-300">{label}</p>
      </div>
    </div>
  );
}
