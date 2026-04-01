import {
  endOfMonth,
  format,
  isWithinInterval,
  parseISO,
  startOfMonth,
  subMonths,
} from 'date-fns'
import type { Transaction } from '../types/finance'

export interface Totals {
  totalIncome: number
  totalExpenses: number
  totalBalance: number
}

export interface TrendPoint {
  label: string
  income: number
  expense: number
  balance: number
}

export interface CategorySlice {
  category: string
  value: number
  percent: number
}

export interface DashboardInsights {
  highestCategory: string
  highestCategorySpend: number
  currentMonthSpend: number
  previousMonthSpend: number
  monthChangePct: number
  averageExpense: number
  savingsRate: number
}

const toDate = (value: string): Date => {
  const parsed = parseISO(value)
  return Number.isNaN(parsed.getTime()) ? new Date(value) : parsed
}

export const getTotals = (transactions: Transaction[]): Totals => {
  const totalIncome = transactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((sum, transaction) => sum + transaction.amount, 0)

  const totalExpenses = transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((sum, transaction) => sum + transaction.amount, 0)

  return {
    totalIncome,
    totalExpenses,
    totalBalance: totalIncome - totalExpenses,
  }
}

export const getTrendData = (transactions: Transaction[]): TrendPoint[] => {
  if (!transactions.length) {
    return []
  }

  const monthlyBuckets = new Map<string, { date: Date; income: number; expense: number }>()

  transactions.forEach((transaction) => {
    const parsedDate = toDate(transaction.date)
    const key = format(parsedDate, 'yyyy-MM')

    if (!monthlyBuckets.has(key)) {
      monthlyBuckets.set(key, { date: parsedDate, income: 0, expense: 0 })
    }

    const bucket = monthlyBuckets.get(key)
    if (!bucket) {
      return
    }

    if (transaction.type === 'income') {
      bucket.income += transaction.amount
    } else {
      bucket.expense += transaction.amount
    }
  })

  const orderedBuckets = [...monthlyBuckets.values()].sort(
    (left, right) => left.date.getTime() - right.date.getTime(),
  )

  let runningBalance = 0

  return orderedBuckets.map((bucket) => {
    runningBalance += bucket.income - bucket.expense

    return {
      label: format(bucket.date, 'MMM yy'),
      income: bucket.income,
      expense: bucket.expense,
      balance: runningBalance,
    }
  })
}

export const getExpenseCategoryData = (transactions: Transaction[]): CategorySlice[] => {
  const expenseOnly = transactions.filter((transaction) => transaction.type === 'expense')
  const totalExpense = expenseOnly.reduce((sum, transaction) => sum + transaction.amount, 0)

  if (!totalExpense) {
    return []
  }

  const byCategory = expenseOnly.reduce<Record<string, number>>((acc, transaction) => {
    const currentAmount = acc[transaction.category] ?? 0
    acc[transaction.category] = currentAmount + transaction.amount
    return acc
  }, {})

  return Object.entries(byCategory)
    .map(([category, value]) => ({
      category,
      value,
      percent: (value / totalExpense) * 100,
    }))
    .sort((left, right) => right.value - left.value)
}

export const getInsights = (transactions: Transaction[]): DashboardInsights => {
  const totals = getTotals(transactions)
  const categoryData = getExpenseCategoryData(transactions)

  const now = new Date()
  const currentMonthStart = startOfMonth(now)
  const currentMonthEnd = endOfMonth(now)

  const previousMonthReference = subMonths(now, 1)
  const previousMonthStart = startOfMonth(previousMonthReference)
  const previousMonthEnd = endOfMonth(previousMonthReference)

  const currentMonthSpend = transactions
    .filter((transaction) => transaction.type === 'expense')
    .filter((transaction) =>
      isWithinInterval(toDate(transaction.date), {
        start: currentMonthStart,
        end: currentMonthEnd,
      }),
    )
    .reduce((sum, transaction) => sum + transaction.amount, 0)

  const previousMonthSpend = transactions
    .filter((transaction) => transaction.type === 'expense')
    .filter((transaction) =>
      isWithinInterval(toDate(transaction.date), {
        start: previousMonthStart,
        end: previousMonthEnd,
      }),
    )
    .reduce((sum, transaction) => sum + transaction.amount, 0)

  const monthChangePct =
    previousMonthSpend === 0
      ? currentMonthSpend > 0
        ? 100
        : 0
      : ((currentMonthSpend - previousMonthSpend) / previousMonthSpend) * 100

  const expenseCount = transactions.filter((transaction) => transaction.type === 'expense').length

  return {
    highestCategory: categoryData[0]?.category ?? 'N/A',
    highestCategorySpend: categoryData[0]?.value ?? 0,
    currentMonthSpend,
    previousMonthSpend,
    monthChangePct,
    averageExpense: expenseCount ? totals.totalExpenses / expenseCount : 0,
    savingsRate:
      totals.totalIncome === 0
        ? 0
        : ((totals.totalIncome - totals.totalExpenses) / totals.totalIncome) * 100,
  }
}
