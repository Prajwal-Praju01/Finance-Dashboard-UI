import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { TrendPoint } from '../../utils/analytics'
import { formatCurrency } from '../../utils/format'
import { ChartPanel } from '../common/ChartPanel'
import { useElementSize } from '../../hooks/useElementSize'

interface BalanceLineChartProps {
  data: TrendPoint[]
}

export const BalanceLineChart = ({ data }: BalanceLineChartProps) => {
  const { elementRef, width, height } = useElementSize<HTMLDivElement>()

  return (
    <ChartPanel title="Balance Trend" description="Balance and income across recent months">
      {data.length === 0 ? (
        <p className="flex h-full items-center justify-center text-sm text-slate-500">
          Add transactions to unlock trend analytics.
        </p>
      ) : (
        <div ref={elementRef} className="h-full min-h-[260px] min-w-0">
          {width > 0 && height > 0 ? (
            <LineChart width={width} height={height} data={data} margin={{ top: 8, right: 8, left: 4, bottom: 8 }}>
              <CartesianGrid strokeDasharray="4 6" stroke="#d8e1eb" />
              <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis tickFormatter={(value: number) => `$${Math.round(value / 1000)}k`} tick={{ fill: '#64748b' }} />
              <Tooltip
                formatter={(value: unknown, name: unknown) => [
                  formatCurrency(Number(value ?? 0)),
                  String(name) === 'balance' ? 'Balance' : 'Income',
                ]}
                contentStyle={{ borderRadius: '10px', borderColor: '#e2e8f0' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="balance"
                stroke="#0f766e"
                strokeWidth={3}
                dot={{ r: 3, fill: '#0f766e' }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 2, fill: '#2563eb' }}
              />
            </LineChart>
          ) : (
            <div className="h-full min-h-[260px] animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800/70" />
          )}
        </div>
      )}
    </ChartPanel>
  )
}
