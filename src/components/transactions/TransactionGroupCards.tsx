import type { GroupByOption } from '../../types/finance'
import { formatCurrency } from '../../utils/format'

export interface TransactionGroupSummary {
  key: string
  totalAmount: number
  count: number
}

interface TransactionGroupCardsProps {
  groupBy: GroupByOption
  groups: TransactionGroupSummary[]
}

const groupByLabel: Record<Exclude<GroupByOption, 'none'>, string> = {
  category: 'Category',
  month: 'Month',
  type: 'Type',
}

export const TransactionGroupCards = ({ groupBy, groups }: TransactionGroupCardsProps) => {
  if (groupBy === 'none' || groups.length === 0) {
    return null
  }

  return (
    <section className="mb-4 rounded-xl border border-slate-200 bg-white/60 p-4 dark:border-slate-700 dark:bg-slate-900/45">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100">
          Grouped By {groupByLabel[groupBy]}
        </h3>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
          {groups.length} groups
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {groups.map((group) => (
          <article key={group.key} className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
            <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{group.key}</p>
            <p className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">
              {formatCurrency(group.totalAmount)}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{group.count} transactions</p>
          </article>
        ))}
      </div>
    </section>
  )
}
