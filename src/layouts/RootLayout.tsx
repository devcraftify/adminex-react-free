import { Outlet } from 'react-router-dom'
import { ProVersionBanner, ThemeCustomizer } from '@/components/common'
import { ScrollToTop } from '@/routes/ScrollToTop'

/**
 * Root Layout Component
 * Wraps the entire application with common providers and global elements
 */
export function RootLayout() {
  return (
    <div className="min-h-screen bg-surface-100 dark:bg-surface-950">
      {/* Global elements like toasts, modals can be placed here */}
      <ProVersionBanner />
      <ScrollToTop />
      <Outlet />
      
      {/* Theme Customizer - floating settings panel */}
      <ThemeCustomizer />
    </div>
  )
}
