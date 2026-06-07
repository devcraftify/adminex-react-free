/**
 * Chart Card Component
 * Card wrapper for chart components with header
 */
import { type ReactNode } from 'react'

interface ChartCardProps {
  title: string
  subtitle?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}

export function ChartCard({ title, subtitle, action, children, className = '' }: ChartCardProps) {
  return (
    <div className={`card rounded-xl p-6 ${className}`}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="heading-5 text-secondary-900 dark:text-white">
            {title}
          </h3>
          {subtitle && (
            <p className="text-body-sm text-secondary-500 dark:text-secondary-400 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
      {children}
    </div>
  )
}
