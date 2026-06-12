import { createContext, useCallback, useEffect, useState, type ReactNode } from 'react'
import {
  type ThemeConfig,
  type ThemeMode,
  type SidebarLayout,
  type ContainerType,
  type CardStyle,
  defaultThemeConfig,
  themeColors,
} from '@/types/theme'

const STORAGE_KEY = 'adminex-theme'

interface ThemeContextValue {
  config: ThemeConfig
  setMode: (mode: ThemeMode) => void
  setSidebarLayout: (sidebarLayout: SidebarLayout) => void
  setContainer: (container: ContainerType) => void
  setCardStyle: (cardStyle: CardStyle) => void
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleSidebar: () => void
  resetTheme: () => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [config, setConfig] = useState<ThemeConfig>(() => {
    if (typeof window === 'undefined') return defaultThemeConfig
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        return {
          ...defaultThemeConfig,
          mode: parsed.mode ?? defaultThemeConfig.mode,
          sidebarLayout: parsed.sidebarLayout ?? defaultThemeConfig.sidebarLayout,
          container: parsed.container ?? defaultThemeConfig.container,
          cardStyle: parsed.cardStyle ?? defaultThemeConfig.cardStyle,
          sidebarCollapsed: parsed.sidebarCollapsed ?? defaultThemeConfig.sidebarCollapsed,
        }
      }
    } catch {
      // Invalid JSON, clear it
      localStorage.removeItem(STORAGE_KEY)
    }
    return defaultThemeConfig
  })

  // Apply theme to DOM
  useEffect(() => {
    const root = document.documentElement

    // Mode (dark/light) - explicitly add or remove
    if (config.mode === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    root.dir = 'ltr'
    root.style.setProperty('--theme-primary', themeColors.primary)
    root.style.setProperty('--theme-accent', themeColors.accent)

    // Sidebar layout type (for Full/Admin layout)
    root.dataset.sidebarLayout = config.sidebarLayout

    // Container type
    root.dataset.container = config.container

    // Card style
    root.dataset.cardStyle = config.cardStyle

    // Persist to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
  }, [config])

  const setMode = useCallback((mode: ThemeMode) => {
    setConfig((prev) => ({ ...prev, mode }))
  }, [])

  const setSidebarLayout = useCallback((sidebarLayout: SidebarLayout) => {
    setConfig((prev) => ({ ...prev, sidebarLayout }))
  }, [])

  const setContainer = useCallback((container: ContainerType) => {
    setConfig((prev) => ({ ...prev, container }))
  }, [])

  const setCardStyle = useCallback((cardStyle: CardStyle) => {
    setConfig((prev) => ({ ...prev, cardStyle }))
  }, [])

  const setSidebarCollapsed = useCallback((sidebarCollapsed: boolean) => {
    setConfig((prev) => ({ ...prev, sidebarCollapsed }))
  }, [])

  const toggleSidebar = useCallback(() => {
    setConfig((prev) => ({ ...prev, sidebarCollapsed: !prev.sidebarCollapsed }))
  }, [])

  const resetTheme = useCallback(() => {
    setConfig(defaultThemeConfig)
  }, [])

  return (
    <ThemeContext.Provider
      value={{
        config,
        setMode,
        setSidebarLayout,
        setContainer,
        setCardStyle,
        setSidebarCollapsed,
        toggleSidebar,
        resetTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
