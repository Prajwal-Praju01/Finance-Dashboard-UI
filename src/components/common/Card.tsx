import { motion } from 'framer-motion'
import clsx from 'clsx'
import type { ReactNode } from 'react'

interface CardProps {
  title?: string
  description?: string
  action?: ReactNode
  className?: string
  children: ReactNode
}

export const Card = ({ title, description, action, className, children }: CardProps) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -3 }}
      className={clsx(
        'relative overflow-hidden rounded-2xl border border-white/70 bg-white/90 p-5 shadow-soft backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/85',
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-sky-100/70 to-transparent dark:from-sky-900/20" />

      {(title || description || action) && (
        <header className="relative mb-4 flex items-start justify-between gap-3">
          <div>
            {title && <h3 className="font-display text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h3>}
            {description && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>}
          </div>
          {action}
        </header>
      )}
      <div className="relative">{children}</div>
    </motion.article>
  )
}
