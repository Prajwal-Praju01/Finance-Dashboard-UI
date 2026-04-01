import type { DashboardInsights } from '../../utils/analytics'
import { formatCurrency } from '../../utils/format'
import { Card } from '../common/Card'

interface InsightsCardsProps {
  insights: DashboardInsights
}

export const InsightsCards = ({ insights }: InsightsCardsProps) => {
  const comparisonDirection = insights.monthChangePct > 0 ? 'up' : 'down'
  const comparisonTone = insights.monthChangePct > 0 ? 'text-rose-600' : 'text-emerald-600'

  return (
    <section className="grid gap-4 md:grid-cols-3">
      <Card title="Top Spending Category" description="Highest expense category this period">
        <p className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          Focus Area
        </p>
        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{insights.highestCategory}</p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{formatCurrency(insights.highestCategorySpend)}</p>
      </Card>

      <Card title="Monthly Expense Comparison" description="Current month vs previous month">
        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{formatCurrency(insights.currentMonthSpend)}</p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Last month: {formatCurrency(insights.previousMonthSpend)}
        </p>
        <p className="mt-2 text-sm font-semibold">
          <span className={comparisonTone}>
            {comparisonDirection} {Math.abs(insights.monthChangePct).toFixed(1)}%
          </span>{' '}
          <span className="text-slate-500 dark:text-slate-400">vs previous period</span>
        </p>
      </Card>

      <Card title="Efficiency Snapshot" description="Average expense and savings ratio">
        <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">
          Avg Expense: <span className="text-slate-950 dark:text-slate-100">{formatCurrency(insights.averageExpense)}</span>
        </p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Savings Rate: <span className="font-semibold text-emerald-600">{insights.savingsRate.toFixed(1)}%</span>
        </p>
      </Card>
    </section>
  )
}
