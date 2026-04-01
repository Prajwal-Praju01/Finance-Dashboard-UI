import { parseISO, startOfYear, subDays } from 'date-fns'
import { useMemo } from 'react'
import type { SortOption, Transaction, TransactionFilters } from '../types/finance'
import { useFinanceStore } from '../store/useFinanceStore'

const sortTransactions = (transactions: Transaction[], sortBy: SortOption): Transaction[] => {
  const next = [...transactions]

  return next.sort((left, right) => {
    switch (sortBy) {
      case 'date_asc': {
        return parseISO(left.date).getTime() - parseISO(right.date).getTime()
      }
      case 'date_desc': {
        return parseISO(right.date).getTime() - parseISO(left.date).getTime()
      }
      case 'amount_asc': {
        return left.amount - right.amount
      }
      case 'amount_desc': {
        return right.amount - left.amount
      }
      default:
        return 0
    }
  })
}

const isWithinDateRange = (transactionDate: string, filters: TransactionFilters): boolean => {
  if (filters.dateRange === 'all') {
    return true
  }

  const date = parseISO(transactionDate)

  if (Number.isNaN(date.getTime())) {
    return false
  }

  const now = new Date()

  if (filters.dateRange === '30d') {
    return date.getTime() >= subDays(now, 30).getTime()
  }

  if (filters.dateRange === '90d') {
    return date.getTime() >= subDays(now, 90).getTime()
  }

  return date.getTime() >= startOfYear(now).getTime()
}

export const useFilteredTransactions = (): Transaction[] => {
  const transactions = useFinanceStore((state) => state.transactions)
  const filters = useFinanceStore((state) => state.filters)

  return useMemo(() => {
    const normalizedSearch = filters.search.trim().toLowerCase()

    const filtered = transactions.filter((transaction) => {
      if (filters.type !== 'all' && transaction.type !== filters.type) {
        return false
      }

      if (filters.category !== 'all' && transaction.category !== filters.category) {
        return false
      }

      if (!isWithinDateRange(transaction.date, filters)) {
        return false
      }

      if (!normalizedSearch) {
        return true
      }

      const searchable = `${transaction.category} ${transaction.type} ${transaction.amount} ${transaction.date}`.toLowerCase()
      return searchable.includes(normalizedSearch)
    })

    return sortTransactions(filtered, filters.sortBy)
  }, [transactions, filters])
}
