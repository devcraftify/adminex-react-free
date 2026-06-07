# AdminEx API Reference

> Complete documentation for hooks, context providers, utilities, and mock data.

## 📋 Table of Contents

- [Hooks](#hooks)
  - [useTheme](#usetheme)
  - [useLocale](#uselocale)
- [Context Providers](#context-providers)
  - [ThemeProvider](#themeprovider)
  - [LocaleProvider](#localeprovider)
- [Types](#types)
  - [Theme Types](#theme-types)
  - [Locale Types](#locale-types)
  - [Navigation Types](#navigation-types)
- [Mock Data](#mock-data)
- [Utilities](#utilities)

---

## Hooks

### useTheme

Access and modify theme configuration.

**File:** `src/hooks/useTheme.ts`

#### Import

```tsx
import { useTheme } from '@/hooks/useTheme'
```

#### Returns

```typescript
interface ThemeContextValue {
  config: ThemeConfig
  setMode: (mode: ThemeMode) => void
  setDirection: (direction: ThemeDirection) => void
  setColor: (color: ThemeColor) => void
  setSidebarLayout: (layout: SidebarLayout) => void
  setContainer: (container: ContainerType) => void
  setCardStyle: (cardStyle: CardStyle) => void
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleSidebar: () => void
  resetTheme: () => void
}
```

#### Usage

```tsx
function MyComponent() {
  const { 
    config, 
    setMode, 
    setColor, 
    toggleSidebar,
    resetTheme 
  } = useTheme()

  return (
    <div>
      <p>Mode: {config.mode}</p>
      <p>Color: {config.color}</p>
      <p>Direction: {config.direction}</p>
      <p>Sidebar: {config.sidebarCollapsed ? 'Collapsed' : 'Expanded'}</p>

      <button onClick={() => setMode('dark')}>Dark Mode</button>
      <button onClick={() => setColor('purple')}>Purple Theme</button>
      <button onClick={toggleSidebar}>Toggle Sidebar</button>
      <button onClick={resetTheme}>Reset All</button>
    </div>
  )
}
```

#### Config Properties

| Property | Type | Description |
|----------|------|-------------|
| `mode` | `'light' \| 'dark'` | Theme mode |
| `direction` | `'ltr' \| 'rtl'` | Text direction |
| `color` | `ThemeColor` | Color preset |
| `sidebarLayout` | `'vertical' \| 'horizontal'` | Sidebar type |
| `container` | `'full' \| 'boxed'` | Container width |
| `cardStyle` | `'shadow' \| 'border'` | Card styling |
| `sidebarCollapsed` | `boolean` | Sidebar state |

---

### useLocale

Access and modify locale/translation settings.

**File:** `src/i18n/useLocale.ts`

#### Import

```tsx
import { useLocale } from '@/i18n'
// or
import { useLocale } from '@/i18n/useLocale'
```

#### Returns

```typescript
interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  messages: Messages
  t: (key: string, vars?: TranslateVars) => string
}
```

#### Usage

```tsx
function MyComponent() {
  const { locale, setLocale, t } = useLocale()

  return (
    <div>
      <h1>{t('dashboard.title')}</h1>
      <p>{t('dashboard.welcome_back')}</p>
      
      {/* With variables */}
      <p>{t('footer.copyright', { year: 2025 })}</p>
      
      <p>Current: {locale}</p>
      
      <select 
        value={locale} 
        onChange={(e) => setLocale(e.target.value as Locale)}
      >
        <option value="en">English</option>
        <option value="fr">French</option>
        <option value="ar">Arabic</option>
      </select>
    </div>
  )
}
```

#### Translation Function

```typescript
// Signature
t(key: string, vars?: Record<string, string | number>): string

// Examples
t('nav.dashboard')                           // "Dashboard"
t('user.greeting', { name: 'John' })        // "Hello, John!"
t('stats.count', { count: 42 })             // "42 items"
t('missing.key')                             // Returns key if not found
```

---

## Context Providers

### ThemeProvider

Provides theme configuration to the app.

**File:** `src/context/ThemeContext.tsx`

#### Setup

```tsx
import { ThemeProvider } from '@/context/ThemeContext'

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>,
)
```

#### Features

- Persists to `localStorage` (`adminex-theme`)
- Applies CSS classes/variables to `<html>`
- Provides setter functions for all options

#### Implementation Details

```typescript
// Storage key
const STORAGE_KEY = 'adminex-theme'

// Default configuration
const defaultThemeConfig: ThemeConfig = {
  mode: 'light',
  direction: 'ltr',
  color: 'blue',
  sidebarLayout: 'vertical',
  container: 'full',
  cardStyle: 'shadow',
  sidebarCollapsed: false,
}
```

#### DOM Effects

When config changes, the provider:

1. Adds/removes `dark` class on `<html>`
2. Sets `dir` attribute (`ltr`/`rtl`)
3. Sets `--theme-primary` and `--theme-accent` CSS variables
4. Sets `data-*` attributes for layout options

---

### LocaleProvider

Provides internationalization to the app.

**File:** `src/i18n/LocaleProvider.tsx`

#### Setup

```tsx
import { LocaleProvider } from '@/i18n'

// Must be inside ThemeProvider (uses useTheme for RTL)
<ThemeProvider>
  <LocaleProvider>
    <App />
  </LocaleProvider>
</ThemeProvider>
```

#### Features

- Persists to `localStorage` (`adminex-locale`)
- Falls back to English for missing keys
- Auto-switches to RTL for Arabic/Urdu
- Sets `lang` attribute on `<html>`

#### Implementation Details

```typescript
// Storage keys
const STORAGE_KEY = 'adminex-locale'
const DIRECTION_LOCK_STORAGE_KEY = 'adminex-direction-locked-by-locale'

// Default locale
const DEFAULT_LOCALE: Locale = 'en'

// RTL languages
const rtlLocales = ['ar', 'ur']
```

---

## Types

### Theme Types

**File:** `src/types/theme.ts`

```typescript
/** Light or Dark mode */
export type ThemeMode = 'light' | 'dark'

/** Text direction */
export type ThemeDirection = 'ltr' | 'rtl'

/** Color presets */
export type ThemeColor = 
  | 'blue' 
  | 'purple' 
  | 'green' 
  | 'orange' 
  | 'red' 
  | 'cyan'

/** Sidebar layout type */
export type SidebarLayout = 'vertical' | 'horizontal'

/** Container width */
export type ContainerType = 'full' | 'boxed'

/** Card styling */
export type CardStyle = 'shadow' | 'border'

/** Complete theme configuration */
export interface ThemeConfig {
  mode: ThemeMode
  direction: ThemeDirection
  color: ThemeColor
  sidebarLayout: SidebarLayout
  container: ContainerType
  cardStyle: CardStyle
  sidebarCollapsed: boolean
}

/** Default configuration */
export const defaultThemeConfig: ThemeConfig = {
  mode: 'light',
  direction: 'ltr',
  color: 'blue',
  sidebarLayout: 'vertical',
  container: 'full',
  cardStyle: 'shadow',
  sidebarCollapsed: false,
}

/** Color presets (RGB values for CSS variables) */
export const themeColorPresets: Record<ThemeColor, { 
  primary: string
  accent: string 
}> = {
  blue: { primary: '59, 130, 246', accent: '99, 102, 241' },
  purple: { primary: '236, 72, 153', accent: '14, 165, 233' },
  green: { primary: '34, 197, 94', accent: '20, 184, 166' },
  orange: { primary: '249, 115, 22', accent: '245, 158, 11' },
  red: { primary: '239, 68, 68', accent: '244, 63, 94' },
  cyan: { primary: '6, 182, 212', accent: '14, 165, 233' },
}
```

### Locale Types

**File:** `src/i18n/LocaleProvider.tsx`

```typescript
/** Supported locales */
export type Locale = 
  | 'en' 
  | 'fr' 
  | 'hi-IN' 
  | 'zh-CN' 
  | 'ja' 
  | 'ur' 
  | 'pt' 
  | 'ru' 
  | 'es' 
  | 'ar'

/** Translation messages */
export type Messages = Record<string, string>

/** Variables for interpolation */
export type TranslateVars = Record<string, string | number>
```

### Navigation Types

**File:** `src/layouts/sidebar/types.ts`

```typescript
/** Sub-navigation item */
export interface NavSubItem {
  path: string
  label: string
}

/** Navigation item */
export interface NavItem {
  path: string
  label: string
  icon: string
  badge?: string | number
  children?: NavSubItem[]
}

/** Navigation group */
export interface NavGroup {
  title: string
  items: NavItem[]
}
```

---

## Mock Data

**Location:** `src/data/`

### Overview

AdminEx includes comprehensive mock data for all demo pages:

| File | Export | Description |
|------|--------|-------------|
| `analytics.ts` | Analytics data | Chart data, metrics |
| `blog.ts` | Blog posts | Articles, authors |
| `calendar.ts` | Calendar events | Appointments, meetings |
| `chat.ts` | Chat data | Conversations, messages |
| `contacts.ts` | Contacts | People, organizations |
| `crm.ts` | CRM data | Leads, deals, pipeline |
| `ecommerce.ts` | E-commerce | Products, orders, cart |
| `emails.ts` | Email data | Inbox, sent, drafts |
| `kanban.ts` | Kanban boards | Tasks, columns |
| `notes.ts` | Notes | Note items |
| `testimonials.ts` | Testimonials | Reviews, ratings |

### Import

```typescript
// Import specific data
import { contacts } from '@/data/contacts'
import { emails } from '@/data/emails'
import { kanbanColumns } from '@/data/kanban'

// Import everything
import { 
  contacts, 
  emails, 
  blogPosts,
  calendarEvents,
  // ...
} from '@/data'
```

### Example: Contacts Data

```typescript
// data/contacts.ts
export interface Contact {
  id: string
  name: string
  email: string
  phone: string
  company: string
  role: string
  avatar: string
  status: 'active' | 'inactive'
  tags: string[]
  lastContact: string
}

export const contacts: Contact[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 234 567 890',
    company: 'Acme Inc',
    role: 'CEO',
    avatar: '/assets/avatars/avatar1.jpg',
    status: 'active',
    tags: ['client', 'vip'],
    lastContact: '2024-12-15',
  },
  // ... more contacts
]
```

### Example: Kanban Data

```typescript
// data/kanban.ts
export interface KanbanTask {
  id: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  assignees: { id: string; name: string; avatar: string }[]
  tags: string[]
  dueDate?: string
  comments?: number
  checklist?: { completed: number; total: number }
}

export interface KanbanColumn {
  id: string
  title: string
  color: string
  tasks: KanbanTask[]
}

export const kanbanColumns: KanbanColumn[] = [
  {
    id: 'backlog',
    title: 'Backlog',
    color: 'bg-secondary-500',
    tasks: [/* tasks */],
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    color: 'bg-primary-500',
    tasks: [/* tasks */],
  },
  // ... more columns
]
```

---

## Utilities

### Icon System

**File:** `src/components/common/Icon.tsx`

```typescript
import { Icon, Icons, createIcon, type IconName } from '@/components/common'

// Using Icon component
<Icon icon={Icons.dashboard} className="w-6 h-6" />

// All available icons
Icons = {
  home, dashboard, menu, close,
  chartLine, chartBar, chartPie,
  shopping, creditCard, briefcase,
  mail, message, phone, video,
  calendar, kanban, note, contacts,
  user, users, lock, key, logout,
  settings, help, plus, check, x,
  search, trash, edit, eye, heart,
  // ... 100+ icons
}

// Create reusable icon component
const DashboardIcon = createIcon('dashboard')
<DashboardIcon className="w-5 h-5" />
```

### Chart Configuration

**File:** `src/components/charts/chartConfig.ts`

```typescript
import { 
  registerCharts, 
  defaultOptions, 
  chartColors,
  getThemeColors 
} from '@/components/charts/chartConfig'

// Register Chart.js components (call once)
registerCharts()

// Default chart options
const options = defaultOptions

// Predefined color palette
chartColors = {
  blue: { solid: '#3b82f6', light: 'rgba(59, 130, 246, 0.1)' },
  purple: { solid: '#8b5cf6', light: 'rgba(139, 92, 246, 0.1)' },
  green: { solid: '#22c55e', light: 'rgba(34, 197, 94, 0.1)' },
  orange: { solid: '#f97316', light: 'rgba(249, 115, 22, 0.1)' },
  red: { solid: '#ef4444', light: 'rgba(239, 68, 68, 0.1)' },
  cyan: { solid: '#06b6d4', light: 'rgba(6, 182, 212, 0.1)' },
  pink: { solid: '#ec4899', light: 'rgba(236, 72, 153, 0.1)' },
  yellow: { solid: '#eab308', light: 'rgba(234, 179, 8, 0.1)' },
}

// Get current theme colors (reads CSS variables)
const { primary, primaryLight, accent, accentLight } = getThemeColors()
```

### Scroll Restoration

**File:** `src/routes/ScrollToTop.tsx`

```typescript
import { ScrollToTop } from '@/routes/ScrollToTop'

// Scrolls to top on route change
function RootLayout() {
  return (
    <div>
      <ScrollToTop />
      <Outlet />
    </div>
  )
}
```

### Logo Component

**File:** `src/components/common/Logo.tsx`

```typescript
import { Logo } from '@/components/common'

// Full logo with text
<Logo width={160} height={32} />

// Logomark only (for collapsed sidebar)
<Logo showText={false} height={32} />

// Custom styling
<Logo className="opacity-80" />
```

---

## Storage Keys

AdminEx uses localStorage for persistence:

| Key | Purpose | Type |
|-----|---------|------|
| `adminex-theme` | Theme configuration | JSON (ThemeConfig) |
| `adminex-locale` | Current locale | string (Locale) |
| `adminex-direction-locked-by-locale` | RTL lock flag | `'1'` or absent |

### Reading Storage

```typescript
// Theme
const themeConfig = JSON.parse(
  localStorage.getItem('adminex-theme') || '{}'
)

// Locale
const locale = localStorage.getItem('adminex-locale') || 'en'

// Direction lock
const isLocked = localStorage.getItem('adminex-direction-locked-by-locale') === '1'
```

### Clearing Storage

```typescript
// Clear theme (resets to defaults)
localStorage.removeItem('adminex-theme')

// Clear locale (resets to English)
localStorage.removeItem('adminex-locale')

// Or use resetTheme()
const { resetTheme } = useTheme()
resetTheme()
```

---

## Error Handling

### useTheme without Provider

```typescript
// hooks/useTheme.ts
export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
```

### useLocale without Provider

```typescript
// i18n/useLocale.ts
export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) {
    throw new Error('useLocale must be used within <LocaleProvider />')
  }
  return ctx
}
```

### Missing Translation Key

```typescript
// Returns the key itself if translation not found
t('missing.translation.key')  // Returns: "missing.translation.key"

// Falls back to English if key exists there
t('nav.dashboard')  // In French file, if missing → uses English
```

---

## Type Exports

### From `@/types`

```typescript
import { 
  ThemeMode,
  ThemeDirection,
  ThemeColor,
  SidebarLayout,
  ContainerType,
  CardStyle,
  ThemeConfig,
  defaultThemeConfig,
  themeColorPresets,
} from '@/types/theme'
```

### From `@/i18n`

```typescript
import { 
  LocaleProvider,
  useLocale,
  type Locale,
  type Messages,
  type TranslateVars,
} from '@/i18n'
```

### From `@/components/common`

```typescript
import { 
  Icon,
  Icons,
  createIcon,
  type IconName,
  Logo,
  ThemeCustomizer,
  LanguageSwitcher,
} from '@/components/common'
```

### From `@/layouts/sidebar`

```typescript
import { 
  Sidebar,
  HorizontalNav,
  NavGroup,
  NavItem,
  navGroups,
  type NavGroup as NavGroupType,
  type NavItem as NavItemType,
  type NavSubItem,
} from '@/layouts/sidebar'
```

---

See also:
- [Theming](./THEMING.md)
- [Components](./COMPONENTS.md)
- [Internationalization](./INTERNATIONALIZATION.md)
