import { IconTheme } from './AppIcons'
import type { ThemeMode } from '../../types/finance'

interface ThemeToggleProps {
  theme: ThemeMode
  onToggle: () => void
}

export const ThemeToggle = ({ theme, onToggle }: ThemeToggleProps) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
    >
      <IconTheme className="h-4 w-4" />
      <span>Theme:</span>
      <span>{theme === 'light' ? 'Dark' : 'Light'} mode</span>
    </button>
  )
}
