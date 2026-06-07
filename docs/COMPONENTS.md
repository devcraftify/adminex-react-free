# AdminEx Components

> Complete documentation for all reusable UI components in AdminEx.

## 📋 Table of Contents

- [Common Components](#common-components)
  - [Icon](#icon)
  - [Logo](#logo)
  - [ThemeCustomizer](#themecustomizer)
  - [LanguageSwitcher](#languageswitcher)
- [Chart Components](#chart-components)
  - [LineChart](#linechart)
  - [AreaChart](#areachart)
  - [BarChart](#barchart)
  - [PieChart](#piechart)
  - [DoughnutChart](#doughnutchart)
  - [RadarChart](#radarchart)
  - [CandlestickChart](#candlestickchart)
- [Dashboard Components](#dashboard-components)
  - [StatCard](#statcard)
  - [ChartCard](#chartcard)
  - [ActivityItem](#activityitem)
  - [ProgressBar](#progressbar)
- [Navigation Components](#navigation-components)
  - [Sidebar](#sidebar)
  - [HorizontalNav](#horizontalnav)
  - [NavGroup](#navgroup)
  - [NavItem](#navitem)
  - [AppHeader](#appheader)

---

## Common Components

Located in `src/components/common/`

### Icon

A wrapper component for Iconify icons with Solar icon set.

**File:** `src/components/common/Icon.tsx`

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `string` | required | Icon identifier from Iconify |
| `className` | `string` | - | CSS classes |
| `width` | `number \| string` | - | Icon width |
| `height` | `number \| string` | - | Icon height |
| `style` | `CSSProperties` | - | Inline styles |

#### Usage

```tsx
import { Icon, Icons } from '@/components/common'

// Using predefined icons
<Icon icon={Icons.dashboard} className="w-6 h-6" />
<Icon icon={Icons.settings} width={24} height={24} />
<Icon icon={Icons.user} className="text-primary-500" />
```

#### Available Icons

The `Icons` object contains 100+ predefined icon mappings:

```typescript
Icons = {
  // Navigation
  home, dashboard, menu, close, chevronDown, chevronUp, ...
  
  // Dashboard & Analytics
  chartLine, chartBar, chartPie, chartArea, chartRadar, ...
  
  // Commerce
  shopping, shoppingBag, creditCard, briefcase, ...
  
  // Communication
  mail, message, phone, video, camera, ...
  
  // Organization
  calendar, kanban, note, contacts, ...
  
  // User & Auth
  user, users, userPlus, lock, key, logout, ...
  
  // Actions
  settings, help, plus, minus, check, x, search, trash, ...
  
  // And many more...
}
```

---

### Logo

Brand logo component with light/dark mode support.

**File:** `src/components/common/Logo.tsx`

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | `number` | `140` | Logo width |
| `height` | `number` | `28` | Logo height |
| `showText` | `boolean` | `true` | Show text alongside logomark |
| `className` | `string` | - | CSS classes |

#### Usage

```tsx
import { Logo } from '@/components/common'

// Full logo
<Logo width={160} height={32} />

// Logomark only (for collapsed sidebar)
<Logo showText={false} height={32} />

// Custom styling
<Logo className="opacity-80" />
```

---

### ThemeCustomizer

Floating panel for theme customization.

**File:** `src/components/common/ThemeCustomizer.tsx`

#### Features

- Light/Dark mode toggle
- LTR/RTL direction switch
- 6 color presets
- Sidebar layout options (Vertical/Horizontal)
- Container width (Full/Boxed)
- Card style (Shadow/Border)
- Reset to defaults

#### Usage

```tsx
import { ThemeCustomizer } from '@/components/common'

// Typically placed in RootLayout
function RootLayout() {
  return (
    <div>
      <Outlet />
      <ThemeCustomizer />
    </div>
  )
}
```

The customizer automatically:
- Appears as a floating button on the right edge
- Opens a slide-in panel
- Persists settings to localStorage
- Respects RTL direction

---

### LanguageSwitcher

Dropdown for switching application language.

**File:** `src/components/common/LanguageSwitcher.tsx`

#### Features

- Dropdown with flag icons
- 10 language options
- Auto-switches direction for RTL languages
- Persists selection

#### Usage

```tsx
import { LanguageSwitcher } from '@/components/common'

// In header or settings
<LanguageSwitcher />
```

#### Supported Languages

| Language | Code | Flag |
|----------|------|------|
| English | `en` | 🇺🇸 |
| French | `fr` | 🇫🇷 |
| Spanish | `es` | 🇪🇸 |
| Portuguese | `pt` | 🇧🇷 |
| Russian | `ru` | 🇷🇺 |
| Hindi | `hi-IN` | 🇮🇳 |
| Chinese | `zh-CN` | 🇨🇳 |
| Japanese | `ja` | 🇯🇵 |
| Arabic | `ar` | 🇸🇦 |
| Urdu | `ur` | 🇵🇰 |

---

## Chart Components

Located in `src/components/charts/`

All chart components are wrappers around Chart.js with react-chartjs-2.

### Setup

Charts must be registered before use:

```tsx
import { registerCharts } from '@/components/charts'

// Call once at app startup or component mount
registerCharts()
```

### Common Props

All chart components share these props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `ChartData` | required | Chart.js data object |
| `options` | `ChartOptions` | - | Chart.js options (merged with defaults) |
| `height` | `number` | `300` | Chart height in pixels |

---

### LineChart

Line chart for trend visualization.

**File:** `src/components/charts/LineChart.tsx`

#### Usage

```tsx
import { LineChart, registerCharts } from '@/components/charts'
import { chartColors } from '@/components/charts/chartConfig'

registerCharts()

const data = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
  datasets: [
    {
      label: 'Sales',
      data: [65, 59, 80, 81, 56],
      borderColor: chartColors.blue.solid,
      tension: 0.4,
    },
  ],
}

<LineChart data={data} height={300} />
```

---

### AreaChart

Area chart with filled regions.

**File:** `src/components/charts/AreaChart.tsx`

#### Usage

```tsx
import { AreaChart } from '@/components/charts'
import { chartColors } from '@/components/charts/chartConfig'

const data = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
  datasets: [
    {
      label: 'Revenue',
      data: [12000, 19000, 15000, 22000, 18000],
      fill: true,
      borderColor: chartColors.green.solid,
      backgroundColor: chartColors.green.light,
      tension: 0.4,
    },
  ],
}

<AreaChart data={data} height={350} />
```

---

### BarChart

Vertical bar/column chart.

**File:** `src/components/charts/BarChart.tsx`

#### Usage

```tsx
import { BarChart } from '@/components/charts'
import { chartColors } from '@/components/charts/chartConfig'

const data = {
  labels: ['Q1', 'Q2', 'Q3', 'Q4'],
  datasets: [
    {
      label: 'Sales 2024',
      data: [450, 520, 480, 620],
      backgroundColor: chartColors.purple.solid,
    },
    {
      label: 'Sales 2023',
      data: [380, 410, 420, 490],
      backgroundColor: chartColors.purple.light,
    },
  ],
}

<BarChart data={data} height={300} />
```

---

### PieChart

Pie chart for proportional data.

**File:** `src/components/charts/PieChart.tsx`

#### Usage

```tsx
import { PieChart } from '@/components/charts'
import { chartColors } from '@/components/charts/chartConfig'

const data = {
  labels: ['Desktop', 'Mobile', 'Tablet'],
  datasets: [
    {
      data: [55, 35, 10],
      backgroundColor: [
        chartColors.blue.solid,
        chartColors.green.solid,
        chartColors.orange.solid,
      ],
    },
  ],
}

<PieChart data={data} height={300} />
```

---

### DoughnutChart

Doughnut chart (pie with center cutout).

**File:** `src/components/charts/DoughnutChart.tsx`

#### Usage

```tsx
import { DoughnutChart } from '@/components/charts'

const data = {
  labels: ['Completed', 'In Progress', 'Pending'],
  datasets: [
    {
      data: [45, 35, 20],
      backgroundColor: ['#22c55e', '#3b82f6', '#f59e0b'],
      cutout: '70%',
    },
  ],
}

<DoughnutChart data={data} height={300} />
```

---

### RadarChart

Radar/spider chart for multi-dimensional comparison.

**File:** `src/components/charts/RadarChart.tsx`

#### Usage

```tsx
import { RadarChart } from '@/components/charts'

const data = {
  labels: ['Speed', 'Reliability', 'Comfort', 'Safety', 'Efficiency'],
  datasets: [
    {
      label: 'Product A',
      data: [85, 75, 90, 80, 70],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
    },
  ],
}

<RadarChart data={data} height={350} />
```

---

### CandlestickChart

Financial candlestick chart for OHLC data.

**File:** `src/components/charts/CandlestickChart.tsx`

#### Usage

```tsx
import { CandlestickChart } from '@/components/charts'

const data = {
  datasets: [
    {
      label: 'Stock Price',
      data: [
        { x: 0, o: 100, h: 110, l: 95, c: 105 },
        { x: 1, o: 105, h: 115, l: 100, c: 112 },
        { x: 2, o: 112, h: 120, l: 108, c: 118 },
        // ... more candles
      ],
      color: {
        up: '#22c55e',    // Green for bullish
        down: '#ef4444',  // Red for bearish
        unchanged: '#6b7280',
      },
    },
  ],
}

<CandlestickChart data={data} height={400} />
```

---

### Chart Colors

Pre-defined color palette for charts:

```typescript
import { chartColors } from '@/components/charts/chartConfig'

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
```

---

## Dashboard Components

Located in `src/components/dashboard/`

### StatCard

Statistics card with icon, value, and change indicator.

**File:** `src/components/dashboard/StatCard.tsx`

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `label` | `string` | Stat label |
| `value` | `string` | Display value |
| `change` | `string` | Change percentage |
| `isPositive` | `boolean` | Positive/negative change |
| `icon` | `string` | Icon identifier |
| `bgColor` | `string` | Background color class |
| `iconBg` | `string` | Icon background class |
| `iconColor` | `string` | Icon color class |

#### Usage

```tsx
import { StatCard } from '@/components/dashboard'
import { Icons } from '@/components/common'

<StatCard
  label="Total Revenue"
  value="$48,295"
  change="+12%"
  isPositive={true}
  icon={Icons.currencyDollar}
  bgColor="bg-success-50 dark:bg-success-900/20"
  iconBg="bg-success-100 dark:bg-success-900/40"
  iconColor="text-success-600 dark:text-success-400"
/>
```

---

### ChartCard

Card wrapper for charts with title and optional actions.

**File:** `src/components/dashboard/ChartCard.tsx`

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Card title |
| `subtitle` | `string` | Optional subtitle |
| `action` | `ReactNode` | Action button/link |
| `children` | `ReactNode` | Chart content |

#### Usage

```tsx
import { ChartCard } from '@/components/dashboard'

<ChartCard
  title="Revenue Overview"
  subtitle="Monthly revenue trends"
  action={<button>View Details</button>}
>
  <LineChart data={revenueData} />
</ChartCard>
```

---

### ActivityItem

Activity feed item with icon, action, and timestamp.

**File:** `src/components/dashboard/ActivityItem.tsx`

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `action` | `string` | Activity description |
| `time` | `string` | Relative time |
| `user` | `string` | User name |
| `icon` | `string` | Activity icon |
| `iconBg` | `string` | Icon background class |
| `iconColor` | `string` | Icon color class |

#### Usage

```tsx
import { ActivityItem } from '@/components/dashboard'
import { Icons } from '@/components/common'

<ActivityItem
  action="New user registered"
  time="2 min ago"
  user="John Doe"
  icon={Icons.user}
  iconBg="bg-primary-100"
  iconColor="text-primary-600"
/>
```

---

### ProgressBar

Progress indicator with label and percentage.

**File:** `src/components/dashboard/ProgressBar.tsx`

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | required | Progress value (0-100) |
| `label` | `string` | - | Optional label |
| `showPercent` | `boolean` | `true` | Show percentage text |
| `color` | `string` | `'primary'` | Color variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Bar height |

#### Usage

```tsx
import { ProgressBar } from '@/components/dashboard'

<ProgressBar value={75} label="Completed" color="success" />
<ProgressBar value={45} size="lg" showPercent={false} />
```

---

## Navigation Components

Located in `src/layouts/sidebar/` and `src/layouts/header/`

### Sidebar

Vertical navigation sidebar.

**File:** `src/layouts/sidebar/Sidebar.tsx`

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `navGroups` | `NavGroup[]` | Navigation configuration |
| `isCollapsed` | `boolean` | Collapsed state |
| `width` | `number` | Sidebar width in pixels |
| `isMobileOpen` | `boolean` | Mobile menu open state |
| `onMobileClose` | `() => void` | Mobile close handler |

#### Usage

```tsx
import { Sidebar, navGroups } from '@/layouts/sidebar'

<Sidebar
  navGroups={navGroups}
  isCollapsed={false}
  width={260}
  isMobileOpen={isMobileOpen}
  onMobileClose={() => setMobileOpen(false)}
/>
```

---

### HorizontalNav

Horizontal top navigation bar.

**File:** `src/layouts/sidebar/HorizontalNav.tsx`

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `navGroups` | `NavGroup[]` | Navigation configuration |

#### Usage

```tsx
import { HorizontalNav, navGroups } from '@/layouts/sidebar'

<HorizontalNav navGroups={navGroups} />
```

---

### NavGroup, NavItem, NavSubItem

Internal navigation components used by Sidebar and HorizontalNav.

#### Navigation Data Structure

```typescript
// types.ts
interface NavSubItem {
  path: string
  label: string
}

interface NavItem {
  path: string
  label: string
  icon: string
  badge?: string | number
  children?: NavSubItem[]
}

interface NavGroup {
  title: string
  items: NavItem[]
}
```

#### Navigation Configuration

```typescript
// navData.ts
export const navGroups: NavGroup[] = [
  {
    title: 'Dashboards',
    items: [
      { path: '/dashboard', label: 'Overview', icon: Icons.dashboard },
      { path: '/dashboard/analytics', label: 'Analytics', icon: Icons.chartLine, badge: 'New' },
    ],
  },
  {
    title: 'Apps',
    items: [
      { path: '/app/email', label: 'Email', icon: Icons.mail, badge: 3 },
      {
        path: '/app/blog',
        label: 'Blog',
        icon: Icons.article,
        children: [
          { path: '/app/blog', label: 'All Posts' },
          { path: '/app/blog/create', label: 'Create Post' },
        ],
      },
    ],
  },
  // More groups...
]
```

---

### AppHeader

Main application header with navigation, search, and user menu.

**File:** `src/layouts/header/AppHeader.tsx`

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `sidebarWidth` | `number` | Current sidebar width |
| `isHorizontal` | `boolean` | Horizontal layout mode |
| `isCollapsed` | `boolean` | Sidebar collapsed state |
| `onToggleSidebar` | `() => void` | Toggle sidebar handler |
| `isMobileSidebarOpen` | `boolean` | Mobile sidebar state |
| `onToggleMobileSidebar` | `() => void` | Toggle mobile sidebar |

#### Features

- Logo (horizontal mode)
- Sidebar toggle button
- Quick navigation links
- Mega menu dropdowns
- Search bar
- Language switcher
- Notifications dropdown
- User profile dropdown

#### Usage

```tsx
import { AppHeader } from '@/layouts/header'

<AppHeader
  sidebarWidth={260}
  isHorizontal={false}
  isCollapsed={false}
  onToggleSidebar={toggleSidebar}
  isMobileSidebarOpen={mobileOpen}
  onToggleMobileSidebar={() => setMobileOpen(!mobileOpen)}
/>
```

---

## Best Practices

### 1. Import from Index Files

```tsx
// ✅ Good
import { Icon, Logo, Icons } from '@/components/common'
import { LineChart, AreaChart } from '@/components/charts'

// ❌ Avoid
import { Icon } from '@/components/common/Icon'
import { LineChart } from '@/components/charts/LineChart'
```

### 2. Use Theme-Aware Classes

```tsx
// ✅ Good - uses theme colors
<div className="bg-white dark:bg-surface-900 text-secondary-900 dark:text-white">

// ❌ Avoid - hardcoded colors
<div className="bg-white text-gray-900">
```

### 3. Use Translation Keys

```tsx
// ✅ Good
const { t } = useLocale()
<h1>{t('dashboard.title')}</h1>

// ❌ Avoid
<h1>Dashboard</h1>
```

### 4. Register Charts Once

```tsx
// ✅ Good - register at top level
useEffect(() => {
  registerCharts()
}, [])

// ❌ Avoid - registering in every render
function MyChart() {
  registerCharts() // Called every render!
  return <LineChart />
}
```

---

See also:
- [Theming](./THEMING.md)
- [Layouts](./LAYOUTS.md)
- [API Reference](./API_REFERENCE.md)
