"use client";

export default function GoalsSkeleton() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-pulse">

      {/* HEADER */}
      <div className="h-10 w-40 bg-zinc-800 rounded-lg" />

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-20 bg-zinc-800 rounded-xl" />
        ))}
      </div>

      {/* ANALYTICS */}
      <div className="h-40 bg-zinc-800 rounded-xl" />

      {/* FILTER */}
      <div className="h-10 bg-zinc-800 rounded-lg" />

      {/* LIST */}
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-16 bg-zinc-800 rounded-xl"
          />
        ))}
      </div>
    </div>
  );
}