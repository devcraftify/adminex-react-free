# AdminEx Architecture

> A comprehensive guide to the project structure, design patterns, and architectural decisions.

## 📋 Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Core Principles](#core-principles)
- [Application Flow](#application-flow)
- [State Management](#state-management)
- [File Organization](#file-organization)
- [Design Patterns](#design-patterns)
- [Dependencies](#dependencies)

## Overview

AdminEx follows a modular, component-based architecture built on React 19. The application is structured around:

- **Layouts** - Define the overall page structure
- **Pages** - Represent routes/views in the application
- **Components** - Reusable UI building blocks
- **Context** - Global state management
- **Hooks** - Shared logic and side effects

```
┌─────────────────────────────────────────────────────────┐
│                     ThemeProvider                        │
│  ┌───────────────────────────────────────────────────┐  │
│  │                  LocaleProvider                    │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │              RouterProvider                  │  │  │
│  │  │  ┌───────────────────────────────────────┐  │  │  │
│  │  │  │            RootLayout                  │  │  │  │
│  │  │  │  ┌─────────────────────────────────┐  │  │  │  │
│  │  │  │  │     BlankLayout / FullLayout    │  │  │  │  │
│  │  │  │  │  ┌───────────────────────────┐  │  │  │  │  │
│  │  │  │  │  │         Pages             │  │  │  │  │  │
│  │  │  │  │  └───────────────────────────┘  │  │  │  │  │
│  │  │  │  └─────────────────────────────────┘  │  │  │  │
│  │  │  └───────────────────────────────────────┘  │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Project Structure

```
src/
├── assets/              # Static assets (images, fonts)
│
├── components/          # Reusable UI components
│   ├── charts/         # Chart.js wrapper components
│   │   ├── AreaChart.tsx
│   │   ├── BarChart.tsx
│   │   ├── CandlestickChart.tsx
│   │   ├── DoughnutChart.tsx
│   │   ├── LineChart.tsx
│   │   ├── PieChart.tsx
│   │   ├── RadarChart.tsx
│   │   ├── chartConfig.ts     # Chart.js registration
│   │   └── index.ts
│   ├── common/         # Shared utility components
│   │   ├── Icon.tsx           # Iconify wrapper + Icons map
│   │   ├── LanguageSwitcher.tsx
│   │   ├── Logo.tsx
│   │   ├── ThemeCustomizer.tsx
│   │   └── index.ts
│   └── dashboard/      # Dashboard-specific components
│       ├── ActivityItem.tsx
│       ├── ChartCard.tsx
│       ├── ProgressBar.tsx
│       ├── StatCard.tsx
│       └── index.ts
│
├── context/            # React Context providers
│   ├── ThemeContext.tsx    # Theme state management
│   └── index.ts
│
├── data/               # Mock data for demos
│   ├── analytics.ts
│   ├── blog.ts
│   ├── calendar.ts
│   ├── chat.ts
│   ├── contacts.ts
│   ├── crm.ts
│   ├── ecommerce.ts
│   ├── emails.ts
│   ├── kanban.ts
│   ├── notes.ts
│   ├── testimonials.ts
│   └── index.ts
│
├── hooks/              # Custom React hooks
│   ├── useTheme.ts         # Theme context hook
│   └── index.ts
│
├── i18n/               # Internationalization
│   ├── LocaleProvider.tsx  # Locale context provider
│   ├── useLocale.ts        # Locale hook
│   ├── locales/            # Translation JSON files
│   │   ├── en.json
│   │   ├── fr.json
│   │   ├── es.json
│   │   ├── pt.json
│   │   ├── ru.json
│   │   ├── hi-IN.json
│   │   ├── zh-CN.json
│   │   ├── ja.json
│   │   ├── ar.json
│   │   └── ur.json
│   └── index.ts
│
├── layouts/            # Page layout components
│   ├── RootLayout.tsx      # Root wrapper with ThemeCustomizer
│   ├── BlankLayout.tsx     # Minimal layout (auth, landing)
│   ├── FullLayout.tsx      # Admin layout (sidebar + header)
│   ├── AuthLayout.tsx      # Auth page layouts
│   ├── DashboardLayout.tsx # Dashboard-specific layout
│   ├── header/
│   │   ├── AppHeader.tsx   # Main header component
│   │   └── index.ts
│   ├── sidebar/
│   │   ├── Sidebar.tsx     # Vertical sidebar
│   │   ├── HorizontalNav.tsx # Horizontal navigation
│   │   ├── NavGroup.tsx    # Navigation group
│   │   ├── NavItem.tsx     # Navigation item
│   │   ├── NavSubItem.tsx  # Sub-navigation item
│   │   ├── navData.ts      # Navigation configuration
│   │   ├── types.ts        # TypeScript types
│   │   └── index.ts
│   └── index.ts
│
├── pages/              # Page components (routes)
│   ├── apps/           # Application pages
│   │   ├── blog/
│   │   ├── calendar/
│   │   ├── chat/
│   │   ├── contacts/
│   │   ├── ecommerce/
│   │   ├── email/
│   │   ├── kanban/
│   │   └── notes/
│   ├── auth/           # Authentication pages
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── ForgotPasswordPage.tsx
│   │   └── index.ts
│   ├── charts/         # Chart demo pages
│   ├── dashboard/      # Dashboard pages
│   │   ├── DashboardPage.tsx
│   │   ├── AnalyticsDashboard.tsx
│   │   ├── EcommerceDashboard.tsx
│   │   ├── CRMDashboard.tsx
│   │   └── index.ts
│   ├── errors/         # Error pages
│   │   ├── NotFoundPage.tsx
│   │   └── index.ts
│   ├── forms/          # Form pages
│   ├── home/           # Landing page
│   │   ├── HomePage.tsx
│   │   ├── sections/   # Landing sections
│   │   └── index.ts
│   ├── pages/          # Utility pages
│   └── tables/         # Table pages
│
├── routes/             # Router configuration
│   ├── index.tsx           # Route definitions
│   └── ScrollToTop.tsx     # Scroll restoration
│
├── styles/             # CSS modules
│   ├── variables.css       # CSS custom properties
│   ├── fonts.css           # Typography system
│   ├── base.css            # Reset & base styles
│   ├── layout.css          # Layout utilities
│   ├── components.css      # Component utilities
│   └── animations.css      # Animation keyframes
│
├── types/              # TypeScript definitions
│   ├── theme.ts            # Theme types
│   ├── swiper-css.d.ts     # Swiper CSS types
│   └── index.ts
│
├── App.tsx             # Root component (demo)
├── App.css             # Root styles
├── main.tsx            # Application entry point
└── index.css           # Global styles entry
```

## Core Principles

### 1. Component-Based Architecture

Components are organized by feature and responsibility:

```tsx
// Feature-based organization
components/
├── charts/       # Chart-related components
├── common/       # Shared across features
└── dashboard/    # Dashboard-specific
```

### 2. Layout Composition

Layouts are nested to provide flexibility:

```
RootLayout (ThemeCustomizer, ScrollToTop)
└── BlankLayout (minimal)
    └── AuthLayout (split-screen auth)
        └── Page
└── FullLayout (sidebar + header)
    └── Page
```

### 3. Separation of Concerns

- **Layouts** handle page structure
- **Components** are pure UI elements
- **Context** manages global state
- **Hooks** encapsulate reusable logic
- **Data** contains mock/sample data

### 4. Type Safety

All components and utilities are fully typed with TypeScript:

```typescript
// Example: Theme types
export type ThemeMode = 'light' | 'dark'
export type ThemeDirection = 'ltr' | 'rtl'
export type ThemeColor = 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'cyan'

export interface ThemeConfig {
  mode: ThemeMode
  direction: ThemeDirection
  color: ThemeColor
  sidebarLayout: SidebarLayout
  container: ContainerType
  cardStyle: CardStyle
  sidebarCollapsed: boolean
}
```

## Application Flow

### 1. Entry Point (`main.tsx`)

```tsx
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <LocaleProvider>
        <RouterProvider router={router} />
      </LocaleProvider>
    </ThemeProvider>
  </StrictMode>,
)
```

### 2. Provider Hierarchy

1. **ThemeProvider** - Manages theme configuration
2. **LocaleProvider** - Manages internationalization
3. **RouterProvider** - Handles routing

### 3. Route Resolution

```
URL → Router → Layout → Page → Components
```

## State Management

### Theme State (Context API)

```typescript
// ThemeContext provides:
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

### Locale State (Context API)

```typescript
// LocaleContext provides:
interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  messages: Messages
  t: (key: string, vars?: TranslateVars) => string
}
```

### Persistence

Both theme and locale preferences are persisted to `localStorage`:

- `adminex-theme` - Theme configuration
- `adminex-locale` - Current locale
- `adminex-direction-locked-by-locale` - RTL lock flag

## File Organization

### Index Files

Each directory has an `index.ts` for clean exports:

```typescript
// components/common/index.ts
export { Icon, Icons, createIcon, type IconName } from './Icon'
export { Logo } from './Logo'
export { ThemeCustomizer } from './ThemeCustomizer'
export { LanguageSwitcher } from './LanguageSwitcher'
```

### Import Aliases

Path aliases are configured in `tsconfig.json` and `vite.config.ts`:

```typescript
// Use @ for src directory
import { Icon } from '@/components/common'
import { useTheme } from '@/hooks/useTheme'
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `ThemeCustomizer.tsx` |
| Hooks | camelCase with `use` prefix | `useTheme.ts` |
| Context | PascalCase with `Context` suffix | `ThemeContext.tsx` |
| Types | PascalCase | `ThemeConfig` |
| Constants | UPPER_SNAKE_CASE | `STORAGE_KEY` |
| CSS Variables | kebab-case | `--theme-primary` |

## Design Patterns

### 1. Compound Components

Navigation uses compound components:

```tsx
<NavGroup>
  <NavItem />
  <NavItem>
    <NavSubItem />
  </NavItem>
</NavGroup>
```

### 2. Render Props / Children

Layouts use `Outlet` for child routes:

```tsx
function FullLayout() {
  return (
    <div>
      <Sidebar />
      <main>
        <Outlet />  {/* Child routes render here */}
      </main>
    </div>
  )
}
```

### 3. Custom Hooks

Logic extraction into reusable hooks:

```tsx
// Using theme hook
const { config, setMode, setColor } = useTheme()

// Using locale hook
const { t, locale, setLocale } = useLocale()
```

### 4. Context + Provider Pattern

Global state via Context API:

```tsx
// Provider wraps app
<ThemeProvider>
  <App />
</ThemeProvider>

// Consumer via hook
const theme = useTheme()
```

## Dependencies

### Core

| Package | Purpose |
|---------|---------|
| `react` | UI framework |
| `react-dom` | DOM rendering |
| `react-router-dom` | Client-side routing |
| `typescript` | Type safety |

### Styling

| Package | Purpose |
|---------|---------|
| `tailwindcss` | Utility-first CSS |
| `@tailwindcss/vite` | Vite integration |

### UI Components

| Package | Purpose |
|---------|---------|
| `@iconify/react` | Icon system |
| `@iconify-icons/solar` | Solar icon set |
| `swiper` | Carousels/sliders |
| `lightbox.js-react` | Image lightbox |

### Charts

| Package | Purpose |
|---------|---------|
| `chart.js` | Chart library |
| `react-chartjs-2` | React wrapper |
| `chartjs-chart-financial` | Financial charts |

### Rich Text

| Package | Purpose |
|---------|---------|
| `@tiptap/react` | Editor framework |
| `@tiptap/starter-kit` | Base extensions |
| `@tiptap/extension-placeholder` | Placeholder text |

### Drag & Drop

| Package | Purpose |
|---------|---------|
| `@dnd-kit/core` | Core DnD |
| `@dnd-kit/sortable` | Sortable lists |
| `@dnd-kit/utilities` | DnD utilities |

### Build Tools

| Package | Purpose |
|---------|---------|
| `vite` | Build tool |
| `@vitejs/plugin-react` | React support |
| `eslint` | Code linting |

---

See also:
- [Components](./COMPONENTS.md)
- [Theming](./THEMING.md)
- [Routing](./ROUTING.md)
