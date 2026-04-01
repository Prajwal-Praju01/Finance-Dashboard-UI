import { Cell, Pie, PieChart, Tooltip } from 'recharts'
import type { CategorySlice } from '../../utils/analytics'
import { formatCurrency } from '../../utils/format'
import { ChartPanel } from '../common/ChartPanel'
import { useElementSize } from '../../hooks/useElementSize'

const SEGMENT_COLORS = ['#0f766e', '#0284c7', '#6366f1', '#f59e0b', '#ef4444', '#64748b']

interface ExpenseDonutChartProps {
  data: CategorySlice[]
}

export const ExpenseDonutChart = ({ data }: ExpenseDonutChartProps) => {
  const { elementRef, width, height } = useElementSize<HTMLDivElement>()

  return (
    <ChartPanel title="Expense Split" description="Where your money is going by category">
      {data.length === 0 ? (
        <p className="flex h-full items-center justify-center text-sm text-slate-500">
          No expense categories available yet.
        </p>
      ) : (
        <div className="grid h-full gap-4 md:grid-cols-[1.4fr_1fr]">
          <div ref={elementRef} className="min-h-[240px] min-w-0">
            {width > 0 && height > 0 ? (
              <PieChart width={width} height={height}>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="category"
                  innerRadius={Math.max(48, Math.min(62, Math.round(width * 0.17)))}
                  outerRadius={Math.max(72, Math.min(92, Math.round(width * 0.26)))}
                  paddingAngle={3}
                >
                  {data.map((slice, index) => (
                    <Cell key={slice.category} fill={SEGMENT_COLORS[index % SEGMENT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: unknown) => [formatCurrency(Number(value ?? 0)), 'Spent']} />
              </PieChart>
            ) : (
              <div className="h-full min-h-[240px] animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800/70" />
            )}
          </div>

          <ul className="space-y-3 overflow-auto pr-1">
            {data.map((slice, index) => (
              <li key={slice.category} className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: SEGMENT_COLORS[index % SEGMENT_COLORS.length] }}
                  />
                  <span className="text-sm text-slate-600">{slice.category}</span>
                </div>
                <span className="text-sm font-semibold text-slate-800">{slice.percent.toFixed(0)}%</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </ChartPanel>
  )
}
