import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Icon, Icons } from '@/components/common'
import type { NavGroup } from './types'

interface HorizontalNavProps {
  navGroups: NavGroup[]
}

/**
 * Horizontal Navigation Component
 * Top navigation bar for horizontal layout mode
 */
export function HorizontalNav({ navGroups }: HorizontalNavProps) {
  const location = useLocation()
  const [openGroup, setOpenGroup] = useState<string | null>(null)
  const closeTimerRef = useRef<number | null>(null)
  const rootRef = useRef<HTMLElement | null>(null)

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard'
    }
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  const groups = useMemo(() => {
    const allowed = new Set(['Dashboards', 'Apps', 'Pages', 'From', 'Table', 'Charts'])
    return navGroups.filter((g) => allowed.has(g.title))
  }, [navGroups])

  const displayTitle = (title: string) => {
    if (title === 'Dashboards') return 'Dashboard'
    if (title === 'From') return 'Forms'
    if (title === 'Table') return 'Tables'
    return title
  }

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }

  const scheduleClose = () => {
    clearCloseTimer()
    closeTimerRef.current = window.setTimeout(() => setOpenGroup(null), 140)
  }

  const open = (title: string) => {
    clearCloseTimer()
    setOpenGroup(title)
  }

  // Reset open group when location changes
  useEffect(() => {
    setOpenGroup(null)
  }, [location.pathname, location.search, location.hash])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenGroup(null)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    const onPointerDown = (e: MouseEvent) => {
      const root = rootRef.current
      if (!root) return
      if (root.contains(e.target as Node)) return
      setOpenGroup(null)
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [])

  const isGroupActive = (group: NavGroup) => group.items.some((i) => isActive(i.path))

  return (
    <nav
      ref={rootRef}
      className="fixed top-16 left-0 right-0 h-12 bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-800 z-[1010]"
    >
      <div className="layout-container h-full">
        <div className="relative h-full" onMouseLeave={scheduleClose} onMouseEnter={clearCloseTimer}>
          <div className="h-full flex items-center gap-3">
            {groups.map((g) => {
              const active = isGroupActive(g)
              const opened = openGroup === g.title

              return (
                <div
                  key={g.title}
                  className="relative h-full flex items-center"
                  onMouseEnter={() => open(g.title)}
                >
                  <button
                    type="button"
                    className={
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ' +
                      (opened
                        ? 'bg-surface-100 dark:bg-surface-800 text-secondary-900 dark:text-white'
                        : active
                          ? 'bg-theme-primary/10 text-theme-primary'
                          : 'text-secondary-600 dark:text-secondary-400 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-secondary-900 dark:hover:text-white')
                    }
                    onClick={() => setOpenGroup((prev) => (prev === g.title ? null : g.title))}
                  >
                    {displayTitle(g.title)}
                    <Icon icon={Icons.chevronDown} className={'w-3.5 h-3.5 transition-transform duration-200 ' + (opened ? 'rotate-180' : '')} />
                  </button>

                  {/* Standard Dropdown */}
                  {opened && (
                    <div
                      className="absolute top-[calc(100%+0.5rem)] left-0 w-56 p-1 rounded-xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 shadow-xl shadow-surface-200/20 dark:shadow-black/20 animate-in fade-in slide-in-from-top-1 duration-200 z-[1025]"
                      onMouseEnter={clearCloseTimer}
                      onMouseLeave={scheduleClose}
                    >
                       <div className="flex flex-col gap-0.5">
                         {g.items.map((item) => {
                           const itemActive = isActive(item.path)
                           const hasChildren = item.children && item.children.length > 0
                           
                           return (
                             <div
                               key={item.path}
                               className="relative group/sub after:content-[''] after:absolute after:top-0 after:left-full after:w-3 after:h-full"
                             >
                               {/* Main Item Link */}
                               <Link
                                 to={item.path}
                                 onClick={() => !hasChildren && setOpenGroup(null)}
                                 className={
                                   'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors relative ' +
                                   (itemActive
                                     ? 'bg-theme-primary/10 text-theme-primary font-medium'
                                     : 'text-secondary-700 dark:text-secondary-300 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-secondary-900 dark:hover:text-white')
                                 }
                               >
                                 <Icon icon={item.icon} className="w-4 h-4 opacity-70" />
                                 <span className="flex-1 truncate">{item.label}</span>
                                 {item.badge && (
                                   <span className="px-1.5 py-0.5 rounded text-ui-2xs font-bold bg-theme-primary/10 text-theme-primary">
                                     {item.badge}
                                   </span>
                                 )}
                                 {hasChildren && (
                                    <Icon icon={Icons.chevronRight} className="w-3.5 h-3.5 opacity-50 group-hover/sub:translate-x-0.5 transition-transform" />
                                 )}
                               </Link>

                               {/* Nested Dropdown (Sub-menu) */}
                               {hasChildren && (
                                 <div className="hidden group-hover/sub:block absolute top-0 left-full w-48 p-1 rounded-xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 shadow-xl animate-in fade-in slide-in-from-left-1 duration-150">
                                   <div className="flex flex-col gap-0.5">
                                      {item.children!.map((child) => (
                                         <Link
                                           key={child.path}
                                           to={child.path}
                                           onClick={() => setOpenGroup(null)}
                                           className={
                                             'block px-3 py-2 rounded-lg text-sm transition-colors ' +
                                             (isActive(child.path)
                                               ? 'bg-theme-primary/10 text-theme-primary font-medium'
                                               : 'text-secondary-700 dark:text-secondary-300 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-secondary-900 dark:hover:text-white')
                                           }
                                         >
                                           {child.label}
                                         </Link>
                                      ))}
                                   </div>
                                 </div>
                               )}
                             </div>
                           )
                         })}
                       </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
