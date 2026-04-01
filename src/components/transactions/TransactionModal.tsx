import { AnimatePresence, motion } from 'framer-motion'
import { format } from 'date-fns'
import { useState } from 'react'
import type { Transaction, TransactionDraft } from '../../types/finance'

interface TransactionModalProps {
  open: boolean
  mode: 'add' | 'edit'
  initialTransaction: Transaction | null
  isBusy?: boolean
  onClose: () => void
  onSubmit: (draft: TransactionDraft) => void
}

const createDefaultDraft = (): TransactionDraft => ({
  date: format(new Date(), 'yyyy-MM-dd'),
  amount: 0,
  category: '',
  type: 'expense',
})

export const TransactionModal = ({
  open,
  mode,
  initialTransaction,
  isBusy = false,
  onClose,
  onSubmit,
}: TransactionModalProps) => {
  const [draft, setDraft] = useState<TransactionDraft>(() =>
    initialTransaction
      ? {
          date: initialTransaction.date,
          amount: initialTransaction.amount,
          category: initialTransaction.category,
          type: initialTransaction.type,
        }
      : createDefaultDraft(),
  )
  const [error, setError] = useState('')

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    if (!draft.category.trim() || !draft.date || draft.amount <= 0) {
      setError('Please provide date, category, and a positive amount.')
      return
    }

    onSubmit({
      ...draft,
      category: draft.category.trim(),
    })
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="font-display text-xl font-semibold text-slate-900 dark:text-slate-100">
                {mode === 'add' ? 'Add Transaction' : 'Edit Transaction'}
              </h3>
              <button
                type="button"
                disabled={isBusy}
                onClick={onClose}
                className="rounded-lg border border-slate-200 px-2.5 py-1 text-sm text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-1">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Date</span>
                  <input
                    type="date"
                    disabled={isBusy}
                    value={draft.date}
                    onChange={(event) => setDraft((current) => ({ ...current, date: event.target.value }))}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-sky-300 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-sky-500"
                  />
                </label>

                <label className="space-y-1">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Amount</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    disabled={isBusy}
                    value={draft.amount}
                    onChange={(event) =>
                      setDraft((current) => ({ ...current, amount: Number(event.target.value) }))
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-sky-300 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-sky-500"
                  />
                </label>
              </div>

              <label className="space-y-1">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Category</span>
                <input
                  type="text"
                  disabled={isBusy}
                  value={draft.category}
                  placeholder="e.g. Salary, Groceries"
                  onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value }))}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-sky-300 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-sky-500"
                />
              </label>

              <label className="space-y-1">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Type</span>
                <select
                  value={draft.type}
                  disabled={isBusy}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, type: event.target.value as Transaction['type'] }))
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-sky-300 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-sky-500"
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </label>

              {error && <p className="text-sm font-medium text-rose-600">{error}</p>}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={onClose}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isBusy}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
                >
                  {mode === 'add' ? 'Add' : 'Save Changes'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
