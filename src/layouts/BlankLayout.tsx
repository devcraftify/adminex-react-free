import { Outlet } from 'react-router-dom'

/**
 * Blank Layout Component
 * Minimal layout for frontend pages: Auth, Landing, Error pages
 * No sidebar, no header - just clean content area
 */
export function BlankLayout() {
  return (
    <div className="min-h-screen bg-white dark:bg-surface-950 pt-[var(--pro-banner-height)]">
      <Outlet />
    </div>
  )
}
