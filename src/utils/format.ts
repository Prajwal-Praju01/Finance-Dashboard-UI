import { format, parseISO } from 'date-fns'
import type { TransactionType } from '../types/finance'

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export const formatCurrency = (value: number): string => usdFormatter.format(value)

export const formatDisplayDate = (value: string): string => {
  const parsed = parseISO(value)

  if (Number.isNaN(parsed.getTime())) {
    return value
  }

  return format(parsed, 'MMM d, yyyy')
}

export const formatTypeLabel = (type: TransactionType): string =>
  type === 'income' ? 'Income' : 'Expense'
