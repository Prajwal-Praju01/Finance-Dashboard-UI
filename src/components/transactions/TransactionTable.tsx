import type { Transaction } from '../../types/finance'
import { formatCurrency, formatDisplayDate, formatTypeLabel } from '../../utils/format'

interface TransactionTableProps {
  transactions: Transaction[]
  canManage: boolean
  onEdit: (transaction: Transaction) => void
  onDelete: (transactionId: string) => void
}

const typeBadgeClass = (type: Transaction['type']): string =>
  type === 'income'
    ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
    : 'bg-rose-50 text-rose-700 border-rose-100'

export const TransactionTable = ({
  transactions,
  canManage,
  onEdit,
  onDelete,
}: TransactionTableProps) => {
  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border border-slate-200 shadow-sm dark:border-slate-700 md:block">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur dark:bg-slate-800/85">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-300">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-300">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-300">
                Type
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-300">
                Amount
              </th>
              {canManage && (
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-300">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white dark:divide-slate-800 dark:bg-slate-900/75">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="transition hover:bg-sky-50/70 dark:hover:bg-slate-800/80">
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                  {formatDisplayDate(transaction.date)}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-100">{transaction.category}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${typeBadgeClass(transaction.type)}`}
                  >
                    {formatTypeLabel(transaction.type)}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {formatCurrency(transaction.amount)}
                </td>
                {canManage && (
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(transaction)}
                        className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(transaction.id)}
                        className="rounded-md border border-rose-200 px-2.5 py-1 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {transactions.map((transaction) => (
          <article key={transaction.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/75">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{transaction.category}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{formatDisplayDate(transaction.date)}</p>
              </div>
              <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs ${typeBadgeClass(transaction.type)}`}>
                {formatTypeLabel(transaction.type)}
              </span>
            </div>
            <p className="mt-3 text-lg font-bold text-slate-900 dark:text-slate-100">{formatCurrency(transaction.amount)}</p>
            {canManage && (
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(transaction)}
                  className="flex-1 rounded-lg border border-slate-200 py-2 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(transaction.id)}
                  className="flex-1 rounded-lg border border-rose-200 py-2 text-xs font-semibold text-rose-600"
                >
                  Delete
                </button>
              </div>
            )}
          </article>
        ))}
      </div>
    </>
  )
}
