interface EmptyStateProps {
  title: string
  message: string
  actionLabel?: string
  onAction?: () => void
}

export const EmptyState = ({ title, message, actionLabel, onAction }: EmptyStateProps) => {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-8 text-center dark:border-slate-700 dark:bg-slate-900/70">
      <h4 className="font-display text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h4>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">{message}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
