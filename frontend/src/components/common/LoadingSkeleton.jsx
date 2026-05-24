export function LoadingSkeleton() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.3fr,0.7fr]">
      <div className="glass-panel rounded-[28px] p-6">
        <div className="skeleton h-6 w-32 rounded-full" />
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="skeleton h-24 rounded-2xl" />
          ))}
        </div>
      </div>
      <div className="glass-panel rounded-[28px] p-6">
        <div className="skeleton h-6 w-28 rounded-full" />
        <div className="mt-6 space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="skeleton h-14 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
