import { Link, useLocation } from 'react-router-dom'
import { Icon, Icons } from '@/components/common'
import type { NavItem as NavItemType } from './types'
import { NavSubItem } from './NavSubItem'
import { useLocale } from '@/i18n'

const NAV_ITEM_KEY_BY_LABEL: Record<string, string> = {
  Overview: 'nav.overview',
  Calendar: 'nav.calendar',
  Contacts: 'nav.contacts',
  Login: 'nav.login',
  'Side Login': 'nav.login_side',
  'Card Login': 'nav.login_card',
  Register: 'nav.register',
  'Side Register': 'nav.register_side',
  'Card Register': 'nav.register_card',
  'Forgot Password': 'nav.forgot_password',
  'Account Settings': 'nav.account_settings',
  Typography: 'nav.typography',
  'Form Layout': 'nav.form_layout',
  'Form Validation': 'nav.form_validation',
  'Simple Table': 'nav.simple_table',
  'Data Table': 'nav.data_table',
  Line: 'nav.chart_line',
  Area: 'nav.chart_area',
  Columns: 'nav.chart_columns',
  'Pie & Doughnut': 'nav.chart_pie_doughnut',
}

interface NavItemProps {
  item: NavItemType
  isCollapsed: boolean
  isExpanded: boolean
  onToggle: () => void
}

export function NavItem({ item, isCollapsed, isExpanded, onToggle }: NavItemProps) {
  const location = useLocation()
  const { t } = useLocale()

  const label = NAV_ITEM_KEY_BY_LABEL[item.label] ? t(NAV_ITEM_KEY_BY_LABEL[item.label]) : item.label

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard'
    }
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  const isParentActive = () => {
    if (item.children) {
      return item.children.some(child =>
        location.pathname === child.path || location.pathname.startsWith(child.path + '/'),
      )
    }
    return isActive(item.path)
  }

  if (item.children) {
    return (
      <div>
        <button
          onClick={onToggle}
          className={`
            w-full group relative flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200
            ${isCollapsed ? 'justify-center p-3' : 'px-4 py-2.5'}
            ${isParentActive()
              ? 'bg-theme-primary text-white'
              : 'text-secondary-600 dark:text-secondary-400 hover:bg-surface-100 dark:hover:bg-surface-800'
            }
          `}
          title={isCollapsed ? label : undefined}
        >
          <Icon icon={item.icon} className="w-5 h-5 flex-shrink-0" />

          {!isCollapsed && (
            <>
              <span className="flex-1 text-start">{label}</span>
              <Icon
                icon={Icons.chevronDown}
                className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
              />
            </>
          )}

          {isCollapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-surface-900 dark:bg-surface-700 text-white text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
              {label}
            </div>
          )}
        </button>

        {!isCollapsed && isExpanded && (
          <div className="mt-1 ms-4 ps-4 border-s border-surface-200 dark:border-surface-700 space-y-1">
            {item.children.map((child) => (
              <NavSubItem key={child.path} item={child} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Link
      to={item.path}
      className={`
        group relative flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200
        ${isCollapsed ? 'justify-center p-3' : 'px-4 py-2.5'}
        ${isActive(item.path)
          ? 'bg-theme-primary text-white'
          : 'text-secondary-600 dark:text-secondary-400 hover:bg-surface-100 dark:hover:bg-surface-800'
        }
      `}
      title={isCollapsed ? label : undefined}
    >
      <Icon icon={item.icon} className="w-5 h-5 flex-shrink-0" />

      {!isCollapsed && (
        <>
          <span className="flex-1">{label}</span>
          {item.badge && (
            <span className={`
              px-2 py-0.5 text-xs font-medium rounded-full
              ${isActive(item.path)
                ? 'bg-white/20 text-white'
                : typeof item.badge === 'number'
                  ? 'bg-danger-100 text-danger-600 dark:bg-danger-900/30 dark:text-danger-400'
                  : 'bg-theme-primary-light text-theme-primary'
              }
            `}>
              {item.badge}
            </span>
          )}
        </>
      )}

      {isCollapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-surface-900 dark:bg-surface-700 text-white text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
          {label}
          {item.badge && (
            <span className="ms-1 px-1.5 py-0.5 bg-white/20 rounded text-ui-2xs">
              {item.badge}
            </span>
          )}
        </div>
      )}
    </Link>
  )
}
