import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type {
  DateRangeFilter,
  FilterType,
  GroupByOption,
  SortOption,
  ThemeMode,
  Transaction,
  TransactionDraft,
  TransactionFilters,
  UserRole,
} from '../types/finance'
import { financeApi } from '../utils/mockApi'

interface FinanceState {
  role: UserRole
  theme: ThemeMode
  transactions: Transaction[]
  filters: TransactionFilters
  isApiLoading: boolean
  apiError: string | null
  setRole: (role: UserRole) => void
  setTheme: (theme: ThemeMode) => void
  toggleTheme: () => void
  setSearch: (search: string) => void
  setFilterType: (type: FilterType) => void
  setCategoryFilter: (category: string) => void
  setDateRange: (dateRange: DateRangeFilter) => void
  setGroupBy: (groupBy: GroupByOption) => void
  setSortBy: (sortBy: SortOption) => void
  resetFilters: () => void
  loadTransactions: () => Promise<boolean>
  restoreMockTransactions: () => Promise<boolean>
  addTransaction: (draft: TransactionDraft) => Promise<boolean>
  updateTransaction: (id: string, draft: TransactionDraft) => Promise<boolean>
  deleteTransaction: (id: string) => Promise<boolean>
}

const initialFilters: TransactionFilters = {
  search: '',
  type: 'all',
  sortBy: 'date_desc',
  category: 'all',
  dateRange: 'all',
  groupBy: 'none',
}

const normalizeDraft = (draft: TransactionDraft): TransactionDraft => ({
  ...draft,
  amount: Math.abs(draft.amount),
  category: draft.category.trim(),
})

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      role: 'admin',
      theme: 'light',
      transactions: [],
      filters: initialFilters,
      isApiLoading: false,
      apiError: null,
      setRole: (role) => set({ role }),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),
      setSearch: (search) =>
        set((state) => ({
          filters: {
            ...state.filters,
            search,
          },
        })),
      setFilterType: (type) =>
        set((state) => ({
          filters: {
            ...state.filters,
            type,
          },
        })),
      setCategoryFilter: (category) =>
        set((state) => ({
          filters: {
            ...state.filters,
            category,
          },
        })),
      setDateRange: (dateRange) =>
        set((state) => ({
          filters: {
            ...state.filters,
            dateRange,
          },
        })),
      setGroupBy: (groupBy) =>
        set((state) => ({
          filters: {
            ...state.filters,
            groupBy,
          },
        })),
      setSortBy: (sortBy) =>
        set((state) => ({
          filters: {
            ...state.filters,
            sortBy,
          },
        })),
      resetFilters: () => set({ filters: initialFilters }),
      loadTransactions: async () => {
        set({ isApiLoading: true, apiError: null })

        try {
          const transactions = await financeApi.getTransactions()
          set({ transactions })
          return true
        } catch {
          set({ apiError: 'Could not load transactions from the mock API.' })
          return false
        } finally {
          set({ isApiLoading: false })
        }
      },
      restoreMockTransactions: async () => {
        if (get().role === 'viewer') {
          return false
        }

        set({ isApiLoading: true, apiError: null })

        try {
          const transactions = await financeApi.resetTransactions()
          set({ transactions })
          return true
        } catch {
          set({ apiError: 'Could not restore mock transactions.' })
          return false
        } finally {
          set({ isApiLoading: false })
        }
      },
      addTransaction: async (draft) => {
        if (get().role === 'viewer') {
          return false
        }

        const cleanDraft = normalizeDraft(draft)

        set({ isApiLoading: true, apiError: null })

        try {
          const nextTransaction = await financeApi.createTransaction(cleanDraft)

          set((state) => ({ transactions: [nextTransaction, ...state.transactions] }))
          return true
        } catch {
          set({ apiError: 'Could not create transaction.' })
          return false
        } finally {
          set({ isApiLoading: false })
        }
      },
      updateTransaction: async (id, draft) => {
        if (get().role === 'viewer') {
          return false
        }

        const cleanDraft = normalizeDraft(draft)

        set({ isApiLoading: true, apiError: null })

        try {
          const updatedTransaction = await financeApi.updateTransaction(id, cleanDraft)

          set((state) => ({
            transactions: state.transactions.map((transaction) =>
              transaction.id === id ? updatedTransaction : transaction,
            ),
          }))
          return true
        } catch {
          set({ apiError: 'Could not update transaction.' })
          return false
        } finally {
          set({ isApiLoading: false })
        }
      },
      deleteTransaction: async (id) => {
        if (get().role === 'viewer') {
          return false
        }

        set({ isApiLoading: true, apiError: null })

        try {
          await financeApi.deleteTransaction(id)
          set((state) => ({
            transactions: state.transactions.filter((transaction) => transaction.id !== id),
          }))
          return true
        } catch {
          set({ apiError: 'Could not delete transaction.' })
          return false
        } finally {
          set({ isApiLoading: false })
        }
      },
    }),
    {
      name: 'finance-dashboard-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        role: state.role,
        theme: state.theme,
      }),
    },
  ),
)
