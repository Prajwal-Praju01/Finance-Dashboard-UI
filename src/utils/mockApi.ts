import type { Transaction, TransactionDraft } from '../types/finance'
import { mockTransactions } from './mockTransactions'

const API_STORAGE_KEY = 'finance-dashboard-api-transactions'
const API_LATENCY_MS = 380

const wait = (ms: number): Promise<void> => new Promise((resolve) => window.setTimeout(resolve, ms))

const clone = (transactions: Transaction[]): Transaction[] =>
  transactions.map((transaction) => ({ ...transaction }))

const hasWindow = (): boolean => typeof window !== 'undefined'

const readTransactions = (): Transaction[] => {
  if (!hasWindow()) {
    return clone(mockTransactions)
  }

  const raw = window.localStorage.getItem(API_STORAGE_KEY)

  if (!raw) {
    window.localStorage.setItem(API_STORAGE_KEY, JSON.stringify(mockTransactions))
    return clone(mockTransactions)
  }

  try {
    const parsed = JSON.parse(raw) as Transaction[]

    if (!Array.isArray(parsed)) {
      throw new Error('Invalid transaction payload')
    }

    return parsed
  } catch {
    window.localStorage.setItem(API_STORAGE_KEY, JSON.stringify(mockTransactions))
    return clone(mockTransactions)
  }
}

const writeTransactions = (transactions: Transaction[]): void => {
  if (!hasWindow()) {
    return
  }

  window.localStorage.setItem(API_STORAGE_KEY, JSON.stringify(transactions))
}

const normalizeDraft = (draft: TransactionDraft): TransactionDraft => ({
  ...draft,
  amount: Math.abs(draft.amount),
  category: draft.category.trim(),
})

export const financeApi = {
  getTransactions: async (): Promise<Transaction[]> => {
    await wait(API_LATENCY_MS)
    return clone(readTransactions())
  },

  createTransaction: async (draft: TransactionDraft): Promise<Transaction> => {
    await wait(API_LATENCY_MS)

    const nextTransaction: Transaction = {
      id: crypto.randomUUID(),
      ...normalizeDraft(draft),
    }

    const current = readTransactions()
    const next = [nextTransaction, ...current]

    writeTransactions(next)
    return { ...nextTransaction }
  },

  updateTransaction: async (id: string, draft: TransactionDraft): Promise<Transaction> => {
    await wait(API_LATENCY_MS)

    const cleanDraft = normalizeDraft(draft)
    const current = readTransactions()

    const next = current.map((transaction) => {
      if (transaction.id !== id) {
        return transaction
      }

      return {
        ...transaction,
        ...cleanDraft,
      }
    })

    const updatedTransaction = next.find((transaction) => transaction.id === id)

    if (!updatedTransaction) {
      throw new Error('Transaction not found')
    }

    writeTransactions(next)
    return { ...updatedTransaction }
  },

  deleteTransaction: async (id: string): Promise<void> => {
    await wait(API_LATENCY_MS)

    const current = readTransactions()
    const next = current.filter((transaction) => transaction.id !== id)

    writeTransactions(next)
  },

  resetTransactions: async (): Promise<Transaction[]> => {
    await wait(API_LATENCY_MS)
    writeTransactions(mockTransactions)
    return clone(mockTransactions)
  },
}
