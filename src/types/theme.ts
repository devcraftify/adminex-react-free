/**
 * Theme Configuration Types
 * Defines all customizable theme options for Adminex
 */

/** Light or Dark mode */
export type ThemeMode = 'light' | 'dark'

/** Sidebar layout for admin area (Full layout only) */
export type SidebarLayout = 'vertical' | 'horizontal'

/** Container width option */
export type ContainerType = 'full' | 'boxed'

/** Card styling option */
export type CardStyle = 'shadow' | 'border'

/** Complete theme configuration */
export interface ThemeConfig {
  mode: ThemeMode
  sidebarLayout: SidebarLayout
  container: ContainerType
  cardStyle: CardStyle
  sidebarCollapsed: boolean
}

/** Default theme configuration */
export const defaultThemeConfig: ThemeConfig = {
  mode: 'light',
  sidebarLayout: 'vertical',
  container: 'full',
  cardStyle: 'shadow',
  sidebarCollapsed: false,
}

/** Fixed blue theme colors */
export const themeColors = {
  primary: '59, 130, 246', // #3b82f6
  accent: '99, 102, 241',  // #6366f1
} as const
