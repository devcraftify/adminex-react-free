# AdminEx Theming

> Complete guide to the AdminEx theme system, customization options, and color presets.

## 📋 Table of Contents

- [Overview](#overview)
- [Theme Configuration](#theme-configuration)
- [Theme Provider](#theme-provider)
- [Using the Theme](#using-the-theme)
- [Color Presets](#color-presets)
- [Theme Customizer](#theme-customizer)
- [CSS Variables](#css-variables)
- [Dark Mode](#dark-mode)
- [RTL Support](#rtl-support)
- [Custom Theming](#custom-theming)

---

## Overview

AdminEx features a comprehensive theming system that allows users to customize:

- **Mode**: Light or Dark
- **Direction**: LTR (Left-to-Right) or RTL (Right-to-Left)
- **Color**: 6 primary color presets
- **Sidebar Layout**: Vertical or Horizontal
- **Container**: Full width or Boxed
- **Card Style**: Shadow or Border
- **Sidebar State**: Expanded or Collapsed

All preferences are persisted to localStorage and applied instantly.

---

## Theme Configuration

### Types

Located in `src/types/theme.ts`:

```typescript
/** Light or Dark mode */
export type ThemeMode = 'light' | 'dark'

/** Text direction for RTL/LTR support */
export type ThemeDirection = 'ltr' | 'rtl'

/** Available theme color presets */
export type ThemeColor = 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'cyan'

/** Sidebar layout for admin area */
export type SidebarLayout = 'vertical' | 'horizontal'

/** Container width option */
export type ContainerType = 'full' | 'boxed'

/** Card styling option */
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
```

### Default Configuration

```typescript
export const defaultThemeConfig: ThemeConfig = {
  mode: 'light',
  direction: 'ltr',
  color: 'blue',
  sidebarLayout: 'vertical',
  container: 'full',
  cardStyle: 'shadow',
  sidebarCollapsed: false,
}
```

---

## Theme Provider

The `ThemeProvider` component wraps the application and provides theme state.

### Setup

```tsx
// main.tsx
import { ThemeProvider } from '@/context/ThemeContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
```

### Context Value

The provider exposes:

```typescript
interface ThemeContextValue {
  config: ThemeConfig              // Current configuration
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

---

## Using the Theme

### useTheme Hook

Access theme configuration via the `useTheme` hook:

```tsx
import { useTheme } from '@/hooks/useTheme'

function MyComponent() {
  const { config, setMode, setColor, toggleSidebar } = useTheme()

  return (
    <div>
      <p>Current mode: {config.mode}</p>
      <p>Current color: {config.color}</p>
      
      <button onClick={() => setMode('dark')}>
        Switch to Dark
      </button>
      
      <button onClick={() => setColor('purple')}>
        Use Purple Theme
      </button>
      
      <button onClick={toggleSidebar}>
        Toggle Sidebar
      </button>
    </div>
  )
}
```

### Conditional Styling

```tsx
function ThemedCard() {
  const { config } = useTheme()

  return (
    <div className={`
      rounded-xl p-6
      ${config.mode === 'dark' 
        ? 'bg-surface-900 text-white' 
        : 'bg-white text-secondary-900'}
      ${config.cardStyle === 'shadow' 
        ? 'shadow-lg' 
        : 'border border-surface-200'}
    `}>
      Content
    </div>
  )
}
```

---

## Color Presets

### Available Colors

| Name | Primary | Accent | Use Case |
|------|---------|--------|----------|
| Blue | `#3b82f6` | `#6366f1` | Default, professional |
| Purple | `#ec4899` | `#0ea5e9` | Creative, modern |
| Green | `#22c55e` | `#14b8a6` | Nature, growth |
| Orange | `#f97316` | `#f59e0b` | Energetic, warm |
| Red | `#ef4444` | `#f43f5e` | Bold, urgent |
| Cyan | `#06b6d4` | `#0ea5e9` | Tech, fresh |

### Color Preset Definition

```typescript
export const themeColorPresets: Record<ThemeColor, { primary: string; accent: string }> = {
  blue: {
    primary: '59, 130, 246',    // RGB values
    accent: '99, 102, 241',
  },
  purple: {
    primary: '236, 72, 153',
    accent: '14, 165, 233',
  },
  green: {
    primary: '34, 197, 94',
    accent: '20, 184, 166',
  },
  orange: {
    primary: '249, 115, 22',
    accent: '245, 158, 11',
  },
  red: {
    primary: '239, 68, 68',
    accent: '244, 63, 94',
  },
  cyan: {
    primary: '6, 182, 212',
    accent: '14, 165, 233',
  },
}
```

### Using Theme Colors in CSS

```css
/* Theme colors are applied as CSS variables */
.bg-theme-primary {
  background-color: rgb(var(--theme-primary));
}

.text-theme-primary {
  color: rgb(var(--theme-primary));
}

.border-theme-primary {
  border-color: rgb(var(--theme-primary));
}

/* With opacity */
.bg-theme-primary-light {
  background-color: rgba(var(--theme-primary), 0.1);
}
```

### Using Theme Colors in Components

```tsx
// Inline styles with CSS variables
<div 
  style={{ 
    backgroundColor: 'rgb(var(--theme-primary))',
    color: 'white'
  }}
>
  Primary Button
</div>

// Tailwind utility classes
<button className="bg-theme-primary text-white hover:shadow-theme-primary">
  Click Me
</button>

// Gradient
<h1 className="text-gradient">
  Gradient Text
</h1>
```

---

## Theme Customizer

The `ThemeCustomizer` component provides a UI for theme configuration.

### Features

- Floating toggle button on screen edge
- Slide-in panel with all options
- Real-time preview
- Reset to defaults
- RTL-aware positioning

### Including in Layout

```tsx
// RootLayout.tsx
import { ThemeCustomizer } from '@/components/common'

export function RootLayout() {
  return (
    <div>
      <Outlet />
      <ThemeCustomizer />  {/* Floating customizer */}
    </div>
  )
}
```

### Customizer Options

| Section | Options |
|---------|---------|
| Mode | Light, Dark |
| Direction | LTR, RTL (locked for Arabic/Urdu) |
| Primary Color | 6 color swatches |
| Sidebar Layout | Vertical, Horizontal |
| Sidebar Width | Wide (260px), Mini (80px) |
| Container | Full Width, Boxed (1440px max) |
| Card Style | Shadow, Border |

---

## CSS Variables

Theme variables are defined in `src/styles/variables.css`:

### Theme Colors

```css
@theme {
  /* Dynamic Theme Colors */
  --theme-primary: 236, 72, 153;  /* RGB values */
  --theme-accent: 14, 165, 233;
}
```

### Color Palettes

```css
@theme {
  /* Primary Colors */
  --color-primary-50: #fdf2f8;
  --color-primary-100: #fce7f3;
  --color-primary-200: #fbcfe8;
  --color-primary-300: #f9a8d4;
  --color-primary-400: #f472b6;
  --color-primary-500: #ec4899;
  --color-primary-600: #db2777;
  --color-primary-700: #be185d;
  --color-primary-800: #9d174d;
  --color-primary-900: #831843;
  --color-primary-950: #500724;

  /* Secondary, Accent, Success, Warning, Danger, Info, Surface palettes... */
}
```

### Layout Variables

```css
@theme {
  /* Dimensions */
  --sidebar-width: 260px;
  --sidebar-collapsed-width: 80px;
  --header-height: 70px;

  /* Border Radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-2xl: 1.5rem;

  /* Shadows */
  --shadow-sm: 0 2px 4px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 8px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 12px 24px -6px rgb(0 0 0 / 0.1);

  /* Z-Index Scale */
  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-fixed: 1030;
  --z-modal: 1050;
  --z-customizer: 1080;
}
```

---

## Dark Mode

### How It Works

1. ThemeContext sets `config.mode` to `'light'` or `'dark'`
2. Provider adds/removes `dark` class on `<html>` element
3. Tailwind's dark variant applies dark styles

### Usage in Components

```tsx
// Tailwind dark variant
<div className="bg-white dark:bg-surface-900">
  <p className="text-secondary-900 dark:text-white">
    Hello World
  </p>
</div>

// Conditional classes
<div className={config.mode === 'dark' ? 'theme-dark' : 'theme-light'}>
  Content
</div>
```

### Flash Prevention

To prevent flash of wrong theme on page load, `index.html` includes an inline script:

```html
<script>
  (function () {
    try {
      var saved = localStorage.getItem('adminex-theme')
      if (!saved) return
      var config = JSON.parse(saved)
      if (config && config.mode === 'dark') {
        document.documentElement.classList.add('dark')
      }
    } catch (e) {}
  })()
</script>
```

### Color Scheme

```css
html {
  color-scheme: light;
}

html.dark {
  color-scheme: dark;
}
```

---

## RTL Support

### Automatic Direction

RTL is automatically applied for Arabic and Urdu:

```tsx
// LocaleProvider.tsx
useEffect(() => {
  const shouldRtl = locale === 'ar' || locale === 'ur'
  if (shouldRtl) {
    setDirection('rtl')
  }
}, [locale])
```

### RTL in CSS

```css
/* Layout adjustments */
[dir="rtl"] [data-sidebar-layout="vertical"] .layout-sidebar {
  left: auto;
  right: 0;
}

[dir="rtl"] [data-sidebar-layout="vertical"] .layout-main {
  margin-left: 0;
  margin-right: var(--sidebar-width);
}

/* Flip elements */
[dir="rtl"] .rtl-flip {
  transform: scaleX(-1);
}
```

### RTL in Components

```tsx
const { config } = useTheme()
const isRtl = config.direction === 'rtl'

<aside className={isRtl ? 'right-0' : 'left-0'}>
  {/* Sidebar */}
</aside>

<Icon 
  icon={Icons.chevronRight} 
  className={isRtl ? 'rotate-180' : ''} 
/>
```

### Tailwind RTL Utilities

```tsx
// Start/End instead of Left/Right
<div className="ps-4 pe-4 ms-auto me-2">
  {/* ps = padding-start, pe = padding-end */}
  {/* ms = margin-start, me = margin-end */}
</div>

// Border
<div className="border-s border-e-0">
  {/* border-s = border-inline-start */}
</div>
```

---

## Custom Theming

### Adding a New Color Preset

1. Add the color type:

```typescript
// types/theme.ts
export type ThemeColor = 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'cyan' | 'indigo'
```

2. Add the preset:

```typescript
// types/theme.ts
export const themeColorPresets: Record<ThemeColor, { primary: string; accent: string }> = {
  // ... existing colors
  indigo: {
    primary: '99, 102, 241',    // #6366f1
    accent: '139, 92, 246',     // #8b5cf6
  },
}
```

3. Add to customizer:

```typescript
// components/common/ThemeCustomizer.tsx
const THEME_COLORS = [
  // ... existing colors
  { value: 'indigo', label: 'Indigo', class: 'bg-indigo-500' },
]
```

4. Update flash prevention in `index.html`:

```javascript
var presets = {
  // ... existing presets
  indigo: ['#6366f1', '#8b5cf6'],
}
```

### Custom CSS Variables

Override or extend variables in your CSS:

```css
/* Custom color palette */
@layer base {
  :root {
    --color-brand-50: #eff6ff;
    --color-brand-500: #3b82f6;
    --color-brand-900: #1e3a8a;
  }
}

/* Custom component styles */
@layer utilities {
  .btn-brand {
    background-color: var(--color-brand-500);
    color: white;
  }
}
```

### Extending Theme Context

Add new configuration options:

```typescript
// types/theme.ts
export interface ThemeConfig {
  // ... existing options
  fontSize: 'small' | 'medium' | 'large'
  borderRadius: 'none' | 'small' | 'medium' | 'large'
}

// context/ThemeContext.tsx
const setFontSize = useCallback((fontSize: FontSize) => {
  setConfig((prev) => ({ ...prev, fontSize }))
}, [])
```

---

## Persistence

### Storage Keys

| Key | Purpose |
|-----|---------|
| `adminex-theme` | Theme configuration JSON |
| `adminex-locale` | Selected locale |
| `adminex-direction-locked-by-locale` | RTL lock flag |

### Reading Persisted Theme

```typescript
const saved = localStorage.getItem('adminex-theme')
if (saved) {
  const config = JSON.parse(saved)
  // Apply config
}
```

### Clearing Theme

```typescript
// Reset to defaults
resetTheme()

// Or manually
localStorage.removeItem('adminex-theme')
```

---

## Best Practices

### 1. Use Theme Utilities

```tsx
// ✅ Good - uses theme-aware utilities
<button className="btn-theme-primary">Submit</button>
<div className="bg-theme-primary-light p-4">Content</div>

// ❌ Avoid - hardcoded colors
<button style={{ backgroundColor: '#3b82f6' }}>Submit</button>
```

### 2. Support Both Modes

```tsx
// ✅ Good - works in light and dark
<div className="bg-white dark:bg-surface-900">
  <p className="text-secondary-900 dark:text-white">
    Content
  </p>
</div>

// ❌ Avoid - only works in one mode
<div className="bg-white text-black">
  Content
</div>
```

### 3. Use Logical Properties for RTL

```tsx
// ✅ Good - works in LTR and RTL
<div className="ps-4 pe-2 ms-auto">
  Content
</div>

// ❌ Avoid - only works in LTR
<div className="pl-4 pr-2 ml-auto">
  Content
</div>
```

### 4. Access Theme via Hook

```tsx
// ✅ Good - uses hook
const { config, setMode } = useTheme()

// ❌ Avoid - direct context access
const context = useContext(ThemeContext)
```

---

See also:
- [Styling](./STYLING.md)
- [Components](./COMPONENTS.md)
- [Layouts](./LAYOUTS.md)
