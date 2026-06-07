/**
 * Stat Card Component
 * Display statistics with icon and change indicator
 */
import { Icon, Icons } from '@/components/common'

interface StatCardProps {
  label: string
  value: string
  change?: string
  isPositive?: boolean
  icon: string
  iconBg?: string
  iconColor?: string
  showMenu?: boolean
}

export function StatCard({
  label,
  value,
  change,
  isPositive = true,
  icon,
  iconBg = 'bg-primary-100 dark:bg-primary-900/40',
  iconColor = 'text-primary-600 dark:text-primary-400',
  showMenu = true,
}: StatCardProps) {
  return (
    <div className="card rounded-xl p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center`}>
          <Icon icon={icon} className={`w-5 h-5 ${iconColor}`} />
        </div>
        {showMenu && (
          <button className="p-1 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg transition-colors">
            <Icon icon={Icons.dotsVertical} className="w-4 h-4 text-secondary-400" />
          </button>
        )}
      </div>
      <p className="text-sm text-secondary-500 dark:text-secondary-400 font-medium">
        {label}
      </p>
      <div className="flex items-end justify-between mt-1">
        <p className="heading-3 text-secondary-900 dark:text-white">
          {value}
        </p>
        {change && (
          <span className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-1 rounded-full ${
            isPositive 
              ? 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400' 
              : 'bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-400'
          }`}>
            {isPositive ? (
              <Icon icon={Icons.arrowUpRight} className="w-3 h-3" />
            ) : (
              <Icon icon={Icons.arrowDownRight} className="w-3 h-3" />
            )}
            {change}
          </span>
        )}
      </div>
    </div>
  )
}
