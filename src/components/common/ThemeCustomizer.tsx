import { useState } from 'react'
import { useTheme } from '@/hooks/useTheme'
import { useLocale } from '@/i18n'

/**
 * Floating Theme Customizer Panel
 * Allows users to customize theme settings globally
 */
export function ThemeCustomizer() {
  const [isOpen, setIsOpen] = useState(false)
  const { config, setMode, setSidebarLayout, setContainer, setCardStyle, setSidebarCollapsed, resetTheme } = useTheme()
  const { t } = useLocale()

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-1/2 -translate-y-1/2 z-[1080] bg-theme-primary text-white p-3 shadow-lg hover:shadow-xl transition-all right-0 rounded-l-lg"
        aria-label={t('theme.open_customizer')}
      >
        <SettingsIcon className="w-5 h-5 animate-spin-slow" />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[1080] transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Customizer Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-surface-900 shadow-2xl z-[1090] transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-surface-200 dark:border-surface-700">
          <h2 className="heading-5 text-secondary-900 dark:text-white">
            {t('theme.title')}
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg transition-colors"
            aria-label={t('theme.close_customizer')}
          >
            <CloseIcon className="w-5 h-5 text-secondary-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6 h-[calc(100%-130px)] overflow-y-auto scrollbar-thin">
          {/* Theme Mode */}
          <SettingSection title={t('theme.mode')}>
            <div className="grid grid-cols-2 gap-3">
              <OptionButton
                active={config.mode === 'light'}
                onClick={() => setMode('light')}
                icon={<SunIcon />}
                label={t('theme.light')}
              />
              <OptionButton
                active={config.mode === 'dark'}
                onClick={() => setMode('dark')}
                icon={<MoonIcon />}
                label={t('theme.dark')}
              />
            </div>
          </SettingSection>

          {/* Sidebar Layout (for Admin/Full layout) */}
          <SettingSection title={t('theme.sidebar_layout')}>
            <p className="text-caption text-secondary-400 dark:text-secondary-500 mb-3 -mt-1">
              {t('theme.applied_full_layout')}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <LayoutOption
                active={config.sidebarLayout === 'vertical'}
                onClick={() => setSidebarLayout('vertical')}
                label={t('theme.vertical')}
                type="vertical"
              />
              <LayoutOption
                active={config.sidebarLayout === 'horizontal'}
                onClick={() => setSidebarLayout('horizontal')}
                label={t('theme.horizontal')}
                type="horizontal"
              />
            </div>
          </SettingSection>

          {/* Sidebar Collapsed (only for vertical layout) */}
          {config.sidebarLayout === 'vertical' && (
            <SettingSection title={t('theme.sidebar_style')}>
              <div className="grid grid-cols-2 gap-3">
                <OptionButton
                  active={!config.sidebarCollapsed}
                  onClick={() => setSidebarCollapsed(false)}
                  label={t('theme.full')}
                />
                <OptionButton
                  active={config.sidebarCollapsed}
                  onClick={() => setSidebarCollapsed(true)}
                  label={t('theme.mini')}
                />
              </div>
            </SettingSection>
          )}

          {/* Container */}
          <SettingSection title={t('theme.container')}>
            <div className="grid grid-cols-2 gap-3">
              <OptionButton
                active={config.container === 'full'}
                onClick={() => setContainer('full')}
                label={t('theme.full_width')}
              />
              <OptionButton
                active={config.container === 'boxed'}
                onClick={() => setContainer('boxed')}
                label={t('theme.boxed')}
              />
            </div>
          </SettingSection>

          {/* Card Style */}
          <SettingSection title={t('theme.card_style')}>
            <div className="grid grid-cols-2 gap-3">
              <OptionButton
                active={config.cardStyle === 'shadow'}
                onClick={() => setCardStyle('shadow')}
                label={t('theme.shadow')}
              />
              <OptionButton
                active={config.cardStyle === 'border'}
                onClick={() => setCardStyle('border')}
                label={t('theme.border')}
              />
            </div>
          </SettingSection>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900">
          <button
            onClick={resetTheme}
            className="w-full py-2.5 px-4 bg-danger-500 hover:bg-danger-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('theme.reset')}
          </button>
        </div>
      </div>
    </>
  )
}

/* Sub-components */

function SettingSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-label text-secondary-500 dark:text-secondary-400 mb-3">
        {title}
      </h3>
      {children}
    </div>
  )
}

function OptionButton({
  active,
  onClick,
  icon,
  label,
  disabled,
}: {
  active: boolean
  onClick: () => void
  icon?: React.ReactNode
  label: string
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
      className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border transition-all ${
        active
          ? 'border-theme-primary bg-theme-primary-light text-theme-primary'
          : 'border-surface-200 dark:border-surface-700 text-secondary-600 dark:text-secondary-400 hover:border-surface-300 dark:hover:border-surface-600'
      } ${disabled ? 'opacity-60 cursor-not-allowed pointer-events-none' : ''}`}
    >
      {icon}
      <span className="text-label">{label}</span>
    </button>
  )
}

function LayoutOption({
  active,
  onClick,
  label,
  type,
}: {
  active: boolean
  onClick: () => void
  label: string
  type: 'vertical' | 'horizontal'
}) {
  return (
    <button
      onClick={onClick}
      className={`p-3 rounded-lg border transition-all ${
        active
          ? 'border-theme-primary bg-theme-primary-light'
          : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600'
      }`}
    >
      <div className={`w-full h-12 rounded border-2 border-dashed ${active ? 'border-theme-primary' : 'border-surface-300 dark:border-surface-600'} flex ${type === 'vertical' ? 'flex-row' : 'flex-col'}`}>
        <div className={`${type === 'vertical' ? 'w-1/4 h-full' : 'w-full h-1/4'} bg-surface-300 dark:bg-surface-600 rounded-sm`} />
      </div>
      <span className={`text-caption font-medium mt-2 block ${active ? 'text-theme-primary' : 'text-secondary-500'}`}>
        {label}
      </span>
    </button>
  )
}

/* Icons */

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  )
}
