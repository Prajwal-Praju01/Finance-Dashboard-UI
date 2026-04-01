import { IconRole } from './AppIcons'
import type { UserRole } from '../../types/finance'

interface RoleSwitcherProps {
  role: UserRole
  onChange: (role: UserRole) => void
}

export const RoleSwitcher = ({ role, onChange }: RoleSwitcherProps) => {
  return (
    <label className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
      <IconRole className="h-4 w-4" />
      <span className="text-slate-500 dark:text-slate-400">Role</span>
      <select
        value={role}
        onChange={(event) => onChange(event.target.value as UserRole)}
        className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-sm text-slate-700 outline-none transition focus:border-sky-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-sky-500"
      >
        <option value="admin">Admin</option>
        <option value="viewer">Viewer</option>
      </select>
    </label>
  )
}
