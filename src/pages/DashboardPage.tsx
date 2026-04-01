import { format, parseISO } from 'date-fns'
import { motion } from 'framer-motion'
import { Suspense, lazy, useEffect, useMemo, useState } from 'react'
import { IconCategory, IconFilter, IconRecords } from '../components/common/AppIcons'
import { EmptyState } from '../components/common/EmptyState'
import { LoadingState } from '../components/common/LoadingState'
import { RoleSwitcher } from '../components/common/RoleSwitcher'
import { ThemeToggle } from '../components/common/ThemeToggle'
import { SummaryCards } from '../components/dashboard/SummaryCards'
import { InsightsCards } from '../components/insights/InsightsCards'
import { TransactionControls } from '../components/transactions/TransactionControls'
import { TransactionGroupCards } from '../components/transactions/TransactionGroupCards'
import { TransactionModal } from '../components/transactions/TransactionModal'
import { TransactionTable } from '../components/transactions/TransactionTable'
import { useFilteredTransactions } from '../hooks/useFilteredTransactions'
import { useFinanceStore } from '../store/useFinanceStore'
import type { GroupByOption, Transaction, TransactionDraft } from '../types/finance'
import { getExpenseCategoryData, getInsights, getTotals, getTrendData } from '../utils/analytics'

const BalanceLineChart = lazy(async () => {
  const module = await import('../components/dashboard/BalanceLineChart')
  return { default: module.BalanceLineChart }
})

const ExpenseDonutChart = lazy(async () => {
  const module = await import('../components/dashboard/ExpenseDonutChart')
  return { default: module.ExpenseDonutChart }
})

const escapeCsvCell = (rawValue: string): string => {
  const normalized = /^[=+\-@]/.test(rawValue) ? `'${rawValue}` : rawValue
  return `"${normalized.replace(/"/g, '""')}"`
}

const createCsv = (rows: string[][]): string =>
  rows.map((row) => row.map(escapeCsvCell).join(',')).join('\n')

const getGroupKey = (transaction: Transaction, groupBy: GroupByOption): string => {
  if (groupBy === 'category') {
    return transaction.category
  }

  if (groupBy === 'type') {
    return transaction.type === 'income' ? 'Income' : 'Expense'
  }

  const parsedDate = parseISO(transaction.date)

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Unknown Month'
  }

  return format(parsedDate, 'MMM yyyy')
}

const ChartLoadingCard = () => (
  <div className="h-96 animate-pulse rounded-2xl border border-white/65 bg-white/70 dark:border-slate-700 dark:bg-slate-900/60" />
)

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
}

const sectionVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' as const },
  },
}

export const DashboardPage = () => {
  const [isBooting, setIsBooting] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTransactionId, setActiveTransactionId] = useState<string | null>(null)

  const role = useFinanceStore((state) => state.role)
  const theme = useFinanceStore((state) => state.theme)
  const filters = useFinanceStore((state) => state.filters)
  const transactions = useFinanceStore((state) => state.transactions)
  const isApiLoading = useFinanceStore((state) => state.isApiLoading)
  const apiError = useFinanceStore((state) => state.apiError)

  const setRole = useFinanceStore((state) => state.setRole)
  const toggleTheme = useFinanceStore((state) => state.toggleTheme)
  const setSearch = useFinanceStore((state) => state.setSearch)
  const setFilterType = useFinanceStore((state) => state.setFilterType)
  const setCategoryFilter = useFinanceStore((state) => state.setCategoryFilter)
  const setDateRange = useFinanceStore((state) => state.setDateRange)
  const setGroupBy = useFinanceStore((state) => state.setGroupBy)
  const setSortBy = useFinanceStore((state) => state.setSortBy)
  const resetFilters = useFinanceStore((state) => state.resetFilters)
  const loadTransactions = useFinanceStore((state) => state.loadTransactions)
  const restoreMockTransactions = useFinanceStore((state) => state.restoreMockTransactions)
  const addTransaction = useFinanceStore((state) => state.addTransaction)
  const updateTransaction = useFinanceStore((state) => state.updateTransaction)
  const deleteTransaction = useFinanceStore((state) => state.deleteTransaction)

  const filteredTransactions = useFilteredTransactions()

  const totals = useMemo(() => getTotals(transactions), [transactions])
  const trendData = useMemo(() => getTrendData(transactions), [transactions])
  const categoryData = useMemo(() => getExpenseCategoryData(transactions), [transactions])
  const insights = useMemo(() => getInsights(transactions), [transactions])
  const categoryOptions = useMemo(
    () => [...new Set(transactions.map((transaction) => transaction.category))].sort((left, right) => left.localeCompare(right)),
    [transactions],
  )

  const groupedSummaries = useMemo(() => {
    if (filters.groupBy === 'none') {
      return []
    }

    const groupedMap = new Map<string, { key: string; totalAmount: number; count: number }>()

    filteredTransactions.forEach((transaction) => {
      const key = getGroupKey(transaction, filters.groupBy)
      const current = groupedMap.get(key)

      if (!current) {
        groupedMap.set(key, {
          key,
          totalAmount: transaction.amount,
          count: 1,
        })
        return
      }

      groupedMap.set(key, {
        ...current,
        totalAmount: current.totalAmount + transaction.amount,
        count: current.count + 1,
      })
    })

    return [...groupedMap.values()].sort((left, right) => right.totalAmount - left.totalAmount)
  }, [filteredTransactions, filters.groupBy])

  const activeTransaction = useMemo(
    () => transactions.find((transaction) => transaction.id === activeTransactionId) ?? null,
    [transactions, activeTransactionId],
  )

  const canManage = role === 'admin'
  const hasTransactions = transactions.length > 0
  const hasFilteredRows = filteredTransactions.length > 0
  const activeFilterCount = useMemo(() => {
    let count = 0

    if (filters.search.trim()) {
      count += 1
    }

    if (filters.type !== 'all') {
      count += 1
    }

    if (filters.category !== 'all') {
      count += 1
    }

    if (filters.dateRange !== 'all') {
      count += 1
    }

    if (filters.groupBy !== 'none') {
      count += 1
    }

    return count
  }, [filters])

  useEffect(() => {
    let isMounted = true

    const bootstrap = async () => {
      await loadTransactions()

      if (isMounted) {
        setIsBooting(false)
      }
    }

    void bootstrap()

    return () => {
      isMounted = false
    }
  }, [loadTransactions])

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const openNewTransactionModal = () => {
    if (!canManage) {
      return
    }

    setActiveTransactionId(null)
    setIsModalOpen(true)
  }

  const openEditTransactionModal = (transactionId: string) => {
    if (!canManage) {
      return
    }

    setActiveTransactionId(transactionId)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setActiveTransactionId(null)
  }

  const handleSubmitTransaction = async (draft: TransactionDraft) => {
    if (!canManage) {
      closeModal()
      return
    }

    let didSucceed = false

    if (activeTransactionId) {
      didSucceed = await updateTransaction(activeTransactionId, draft)
    } else {
      didSucceed = await addTransaction(draft)
    }

    if (didSucceed) {
      closeModal()
    }
  }

  const handleDeleteTransaction = async (transactionId: string) => {
    if (!canManage) {
      return
    }

    await deleteTransaction(transactionId)
  }

  const handleRestoreMockData = () => {
    if (!canManage) {
      return
    }

    void restoreMockTransactions()
  }

  const exportCsv = () => {
    if (!filteredTransactions.length) {
      return
    }

    const rows = [
      ['id', 'date', 'amount', 'category', 'type'],
      ...filteredTransactions.map((transaction) => [
        transaction.id,
        `'${transaction.date}`,
        String(transaction.amount),
        transaction.category,
        transaction.type,
      ]),
    ]

    const blob = new Blob(['\uFEFF', createCsv(rows)], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'transactions.csv'
    link.click()
    URL.revokeObjectURL(link.href)
  }

  const exportJson = () => {
    if (!filteredTransactions.length) {
      return
    }

    const blob = new Blob([JSON.stringify(filteredTransactions, null, 2)], {
      type: 'application/json;charset=utf-8;',
    })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'transactions.json'
    link.click()
    URL.revokeObjectURL(link.href)
  }

  if (isBooting) {
    return <LoadingState />
  }

  return (
    <motion.main
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="relative mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8"
    >
      <div className="pointer-events-none absolute -left-16 -top-10 h-44 w-44 rounded-full bg-teal-300/20 blur-3xl dark:bg-teal-500/10" />
      <div className="pointer-events-none absolute -right-12 top-40 h-56 w-56 rounded-full bg-sky-300/20 blur-3xl dark:bg-sky-500/10" />

      <motion.header
        variants={sectionVariants}
        className="dashboard-shell relative rounded-2xl border border-white/65 p-6 shadow-soft ring-1 ring-white/40 dark:border-slate-700 dark:ring-slate-700/40"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="dashboard-kicker text-teal-700 dark:text-teal-300">
              Pulse Ledger
            </p>
            <h1 className="dashboard-title mt-2 text-slate-900 dark:text-slate-100">
              Finance Dashboard
            </h1>
            <p className="dashboard-subtitle mt-2 max-w-2xl text-slate-600 dark:text-slate-300">
              Track balances, inspect transaction behavior, and spot spending patterns without leaving a
              single workspace.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/85 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300">
                <IconRecords className="h-3.5 w-3.5" />
                {transactions.length} records
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/85 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300">
                <IconCategory className="h-3.5 w-3.5" />
                {categoryOptions.length} categories
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/85 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300">
                <IconFilter className="h-3.5 w-3.5" />
                {activeFilterCount} active filters
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
            <RoleSwitcher role={role} onChange={setRole} />
            <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-white dark:bg-slate-100 dark:text-slate-900">
              {canManage ? 'Admin access' : 'Viewer mode'}
            </span>
          </div>
        </div>
      </motion.header>

      {apiError && (
        <motion.div variants={sectionVariants} className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200">
          {apiError}
        </motion.div>
      )}

      <motion.div variants={sectionVariants}>
        <SummaryCards totals={totals} />
      </motion.div>

      <motion.section variants={sectionVariants} className="grid gap-4 lg:grid-cols-2">
        <Suspense fallback={<ChartLoadingCard />}>
          <BalanceLineChart data={trendData} />
        </Suspense>
        <Suspense fallback={<ChartLoadingCard />}>
          <ExpenseDonutChart data={categoryData} />
        </Suspense>
      </motion.section>

      <motion.div variants={sectionVariants}>
        <InsightsCards insights={insights} />
      </motion.div>

      <motion.section variants={sectionVariants} className="dashboard-shell rounded-2xl border border-white/65 p-5 shadow-soft ring-1 ring-white/40 dark:border-slate-700 dark:ring-slate-700/40">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-slate-100">Transactions</h2>
            <p className="text-sm text-slate-500 dark:text-slate-300">
              Search, filter, and sort your entries. Admin users can create and edit records.
            </p>
          </div>
          <span className="rounded-full border border-slate-200 bg-white/85 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            {filteredTransactions.length} shown
          </span>
          {!canManage && (
            <span className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.13em] text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              Read only
            </span>
          )}
        </div>

        <TransactionControls
          search={filters.search}
          filterType={filters.type}
          categoryFilter={filters.category}
          dateRange={filters.dateRange}
          groupBy={filters.groupBy}
          sortBy={filters.sortBy}
          categories={categoryOptions}
          canManage={canManage}
          isBusy={isApiLoading}
          onSearchChange={setSearch}
          onFilterChange={setFilterType}
          onCategoryFilterChange={setCategoryFilter}
          onDateRangeChange={setDateRange}
          onGroupByChange={setGroupBy}
          onSortChange={setSortBy}
          onExportCsv={exportCsv}
          onExportJson={exportJson}
          onAdd={openNewTransactionModal}
        />

        {isApiLoading && (
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
            Syncing with mock API...
          </p>
        )}

        <div className="mt-4">
          {!hasTransactions && (
            <EmptyState
              title="No transactions yet"
              message="Start by adding your first transaction. You can also restore mock data for demo walkthroughs."
              actionLabel={canManage ? 'Restore Mock Data' : undefined}
              onAction={canManage ? handleRestoreMockData : undefined}
            />
          )}

          {hasTransactions && !hasFilteredRows && (
            <EmptyState
              title="No matching results"
              message="Try changing your search text or filters to view transactions."
              actionLabel="Clear Filters"
              onAction={resetFilters}
            />
          )}

          {hasFilteredRows && (
            <>
              <TransactionGroupCards groupBy={filters.groupBy} groups={groupedSummaries} />

              <TransactionTable
                transactions={filteredTransactions}
                canManage={canManage}
                onEdit={(transaction) => openEditTransactionModal(transaction.id)}
                onDelete={handleDeleteTransaction}
              />
            </>
          )}
        </div>
      </motion.section>

      <TransactionModal
        key={`${activeTransaction?.id ?? 'new'}-${isModalOpen ? 'open' : 'closed'}`}
        open={isModalOpen}
        mode={activeTransaction ? 'edit' : 'add'}
        initialTransaction={activeTransaction}
        isBusy={isApiLoading}
        onClose={closeModal}
        onSubmit={(draft) => {
          void handleSubmitTransaction(draft)
        }}
      />
    </motion.main>
  )
}
