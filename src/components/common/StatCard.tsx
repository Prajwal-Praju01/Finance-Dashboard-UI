import clsx from 'clsx'
import { Card } from './Card'

interface StatCardProps {
  label: string
  value: string
  helperText: string
  tone: 'balance' | 'income' | 'expense'
}

const toneMap = {
  balance: 'text-slate-900 dark:text-slate-100',
  income: 'text-emerald-600',
  expense: 'text-rose-600',
}

const surfaceMap = {
  balance: 'from-white to-sky-50/90 dark:from-slate-900 dark:to-slate-800/80',
  income: 'from-white to-emerald-50/90 dark:from-slate-900 dark:to-emerald-950/20',
  expense: 'from-white to-rose-50/90 dark:from-slate-900 dark:to-rose-950/20',
}

const barMap = {
  balance: 'bg-sky-500',
  income: 'bg-emerald-500',
  expense: 'bg-rose-500',
}

export const StatCard = ({ label, value, helperText, tone }: StatCardProps) => {
  return (
    <Card className={clsx('h-full bg-gradient-to-b', surfaceMap[tone])} title={label}>
      <p className={clsx('text-3xl font-extrabold tracking-tight', toneMap[tone])}>{value}</p>
      <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{helperText}</p>
      <div className="mt-4 h-1.5 rounded-full bg-slate-200/80 dark:bg-slate-700/70">
        <div className={clsx('h-1.5 rounded-full', barMap[tone], tone === 'balance' ? 'w-3/4' : tone === 'income' ? 'w-5/6' : 'w-2/3')} />
      </div>
    </Card>
  )
}
