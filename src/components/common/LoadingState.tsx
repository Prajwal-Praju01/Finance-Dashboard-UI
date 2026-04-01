export const LoadingState = () => {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="h-28 animate-pulse rounded-2xl bg-white/80 dark:bg-slate-800/70" />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="h-32 animate-pulse rounded-2xl bg-white/80 dark:bg-slate-800/70" />
        <div className="h-32 animate-pulse rounded-2xl bg-white/80 dark:bg-slate-800/70" />
        <div className="h-32 animate-pulse rounded-2xl bg-white/80 dark:bg-slate-800/70" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-96 animate-pulse rounded-2xl bg-white/80 dark:bg-slate-800/70" />
        <div className="h-96 animate-pulse rounded-2xl bg-white/80 dark:bg-slate-800/70" />
      </div>
    </div>
  )
}
