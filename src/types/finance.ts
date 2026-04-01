export type TransactionType = 'income' | 'expense'

export type UserRole = 'admin' | 'viewer'

export type ThemeMode = 'light' | 'dark'

export type FilterType = 'all' | TransactionType

export type SortOption = 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc'

export type DateRangeFilter = 'all' | '30d' | '90d' | 'ytd'

export type GroupByOption = 'none' | 'category' | 'month' | 'type'

export interface Transaction {
  id: string
  date: string
  amount: number
  category: string
  type: TransactionType
}

export interface TransactionDraft {
  date: string
  amount: number
  category: string
  type: TransactionType
}

export interface TransactionFilters {
  search: string
  type: FilterType
  sortBy: SortOption
  category: string
  dateRange: DateRangeFilter
  groupBy: GroupByOption
}
