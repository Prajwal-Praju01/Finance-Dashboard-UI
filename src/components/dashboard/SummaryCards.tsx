import type { Totals } from '../../utils/analytics'
import { formatCurrency } from '../../utils/format'
import { StatCard } from '../common/StatCard'

interface SummaryCardsProps {
  totals: Totals
}

export const SummaryCards = ({ totals }: SummaryCardsProps) => {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      <StatCard
        label="Total Balance"
        value={formatCurrency(totals.totalBalance)}
        helperText="income minus expenses"
        tone="balance"
      />
      <StatCard
        label="Total Income"
        value={formatCurrency(totals.totalIncome)}
        helperText="all recorded inflows"
        tone="income"
      />
      <StatCard
        label="Total Expenses"
        value={formatCurrency(totals.totalExpenses)}
        helperText="all recorded outflows"
        tone="expense"
      />
    </section>
  )
}
