import type { ReactNode } from 'react'
import { Card } from './Card'

interface ChartPanelProps {
  title: string
  description: string
  children: ReactNode
}

export const ChartPanel = ({ title, description, children }: ChartPanelProps) => {
  return (
    <Card title={title} description={description} className="h-full">
      <div className="h-72">{children}</div>
    </Card>
  )
}
