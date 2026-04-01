import type { Transaction } from '../types/finance'

export const mockTransactions: Transaction[] = [
  { id: 'tx-1', date: '2026-01-03', amount: 5200, category: 'Salary', type: 'income' },
  { id: 'tx-2', date: '2026-01-05', amount: 145, category: 'Groceries', type: 'expense' },
  { id: 'tx-3', date: '2026-01-08', amount: 90, category: 'Transport', type: 'expense' },
  { id: 'tx-4', date: '2026-01-14', amount: 480, category: 'Freelance', type: 'income' },
  { id: 'tx-5', date: '2026-01-17', amount: 210, category: 'Utilities', type: 'expense' },
  { id: 'tx-6', date: '2026-02-02', amount: 5200, category: 'Salary', type: 'income' },
  { id: 'tx-7', date: '2026-02-07', amount: 320, category: 'Dining', type: 'expense' },
  { id: 'tx-8', date: '2026-02-12', amount: 670, category: 'Rent', type: 'expense' },
  { id: 'tx-9', date: '2026-02-16', amount: 260, category: 'Health', type: 'expense' },
  { id: 'tx-10', date: '2026-02-23', amount: 320, category: 'Investment Return', type: 'income' },
  { id: 'tx-11', date: '2026-03-03', amount: 5200, category: 'Salary', type: 'income' },
  { id: 'tx-12', date: '2026-03-05', amount: 220, category: 'Groceries', type: 'expense' },
  { id: 'tx-13', date: '2026-03-09', amount: 410, category: 'Travel', type: 'expense' },
  { id: 'tx-14', date: '2026-03-13', amount: 190, category: 'Subscriptions', type: 'expense' },
  { id: 'tx-15', date: '2026-03-18', amount: 340, category: 'Consulting', type: 'income' },
  { id: 'tx-16', date: '2026-03-22', amount: 510, category: 'Shopping', type: 'expense' },
]
