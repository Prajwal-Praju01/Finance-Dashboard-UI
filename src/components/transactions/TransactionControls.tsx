import type { DateRangeFilter, FilterType, GroupByOption, SortOption } from '../../types/finance'

interface TransactionControlsProps {
  search: string
  filterType: FilterType
  categoryFilter: string
  dateRange: DateRangeFilter
  groupBy: GroupByOption
  sortBy: SortOption
  categories: string[]
  canManage: boolean
  isBusy?: boolean
  onSearchChange: (value: string) => void
  onFilterChange: (value: FilterType) => void
  onCategoryFilterChange: (value: string) => void
  onDateRangeChange: (value: DateRangeFilter) => void
  onGroupByChange: (value: GroupByOption) => void
  onSortChange: (value: SortOption) => void
  onExportCsv: () => void
  onExportJson: () => void
  onAdd: () => void
}

export const TransactionControls = ({
  search,
  filterType,
  categoryFilter,
  dateRange,
  groupBy,
  sortBy,
  categories,
  canManage,
  isBusy = false,
  onSearchChange,
  onFilterChange,
  onCategoryFilterChange,
  onDateRangeChange,
  onGroupByChange,
  onSortChange,
  onExportCsv,
  onExportJson,
  onAdd,
}: TransactionControlsProps) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/65 p-3 shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/55">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto_auto_auto]">
      <input
        type="text"
        value={search}
        placeholder="Search category, type, amount"
        disabled={isBusy}
        onChange={(event) => onSearchChange(event.target.value)}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-sky-500 dark:focus:ring-sky-700/50"
      />

      <select
        value={filterType}
        disabled={isBusy}
        onChange={(event) => onFilterChange(event.target.value as FilterType)}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-sky-500 dark:focus:ring-sky-700/50"
      >
        <option value="all">All Types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      <select
        value={categoryFilter}
        disabled={isBusy}
        onChange={(event) => onCategoryFilterChange(event.target.value)}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-sky-500 dark:focus:ring-sky-700/50"
      >
        <option value="all">All Categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <select
        value={dateRange}
        disabled={isBusy}
        onChange={(event) => onDateRangeChange(event.target.value as DateRangeFilter)}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-sky-500 dark:focus:ring-sky-700/50"
      >
        <option value="all">All Dates</option>
        <option value="30d">Last 30 Days</option>
        <option value="90d">Last 90 Days</option>
        <option value="ytd">Year To Date</option>
      </select>

      <select
        value={groupBy}
        disabled={isBusy}
        onChange={(event) => onGroupByChange(event.target.value as GroupByOption)}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-sky-500 dark:focus:ring-sky-700/50"
      >
        <option value="none">No Grouping</option>
        <option value="category">Group By Category</option>
        <option value="month">Group By Month</option>
        <option value="type">Group By Type</option>
      </select>

      <select
        value={sortBy}
        disabled={isBusy}
        onChange={(event) => onSortChange(event.target.value as SortOption)}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-sky-500 dark:focus:ring-sky-700/50"
      >
        <option value="date_desc">Newest Date</option>
        <option value="date_asc">Oldest Date</option>
        <option value="amount_desc">Highest Amount</option>
        <option value="amount_asc">Lowest Amount</option>
      </select>

      <button
        type="button"
        disabled={isBusy}
        onClick={onExportCsv}
        className="rounded-xl border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:translate-y-[-1px] hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
      >
        Export CSV
      </button>

      <button
        type="button"
        disabled={isBusy}
        onClick={onExportJson}
        className="rounded-xl border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:translate-y-[-1px] hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
      >
        Export JSON
      </button>

      {canManage && (
        <button
          type="button"
          disabled={isBusy}
          onClick={onAdd}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:translate-y-[-1px] hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
        >
          Add Transaction
        </button>
      )}
      </div>
    </div>
  )
}
