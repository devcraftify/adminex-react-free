# AdminEx Layouts

> Complete documentation for the layout system, layout types, and usage patterns.

## 📋 Table of Contents

- [Overview](#overview)
- [Layout Hierarchy](#layout-hierarchy)
- [RootLayout](#rootlayout)
- [BlankLayout](#blanklayout)
- [FullLayout](#fulllayout)
- [AuthLayout](#authlayout)
- [Layout Configuration](#layout-configuration)
- [Responsive Behavior](#responsive-behavior)
- [Creating Custom Layouts](#creating-custom-layouts)

---

## Overview

AdminEx uses a hierarchical layout system with nested layouts:

| Layout | Purpose | Features |
|--------|---------|----------|
| **RootLayout** | Top-level wrapper | Theme Customizer, Scroll restoration |
| **BlankLayout** | Frontend pages | Minimal, no admin UI |
| **FullLayout** | Admin pages | Sidebar, Header, Footer |
| **AuthLayout** | Authentication | Split-screen branding |
| **AuthCardLayout** | Authentication | Centered card |

---

## Layout Hierarchy

```
RootLayout                    ← Global wrapper
├── BlankLayout               ← Minimal wrapper
│   ├── HomePage              ← Landing page
│   ├── AuthLayout            ← Split-screen auth
│   │   ├── LoginPage
│   │   ├── RegisterPage
│   │   └── ForgotPasswordPage
│   └── AuthCardLayout        ← Centered card auth
│       ├── LoginPage
│       └── RegisterPage
│
└── FullLayout                ← Admin wrapper
    ├── Header
    ├── Sidebar (or HorizontalNav)
    └── Main Content
        ├── DashboardPage
        ├── AnalyticsDashboard
        ├── Apps (Email, Chat, etc.)
        ├── Forms
        ├── Tables
        └── Charts
```

---

## RootLayout

The top-level layout that wraps the entire application.

**File:** `src/layouts/RootLayout.tsx`

### Features

- Provides common background
- Includes `ScrollToTop` for scroll restoration
- Mounts `ThemeCustomizer` globally

### Implementation

```tsx
import { Outlet } from 'react-router-dom'
import { ThemeCustomizer } from '@/components/common/ThemeCustomizer'
import { ScrollToTop } from '@/routes/ScrollToTop'

export function RootLayout() {
  return (
    <div className="min-h-screen bg-surface-100 dark:bg-surface-950">
      <ScrollToTop />
      <Outlet />
      <ThemeCustomizer />
    </div>
  )
}
```

### Usage

RootLayout is the root element in the router:

```tsx
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      // All routes nest under RootLayout
    ],
  },
])
```

---

## BlankLayout

Minimal layout for frontend pages without admin UI.

**File:** `src/layouts/BlankLayout.tsx`

### Features

- Clean, minimal wrapper
- No sidebar or header
- Full-width content area
- Dark mode support

### Implementation

```tsx
import { Outlet } from 'react-router-dom'

export function BlankLayout() {
  return (
    <div className="min-h-screen bg-white dark:bg-surface-950">
      <Outlet />
    </div>
  )
}
```

### When to Use

- Landing page (`/`)
- Authentication pages (`/auth/*`)
- Public pages
- Error pages (404, 500)

### Route Configuration

```tsx
{
  element: <BlankLayout />,
  children: [
    { index: true, element: <HomePage /> },
    {
      path: 'auth',
      element: <AuthLayout />,
      children: [
        { path: 'login', element: <LoginPage /> },
        { path: 'register', element: <RegisterPage /> },
      ],
    },
  ],
}
```

---

## FullLayout

Complete admin layout with sidebar and header.

**File:** `src/layouts/FullLayout.tsx`

### Features

- Collapsible sidebar (vertical layout)
- Horizontal navigation option
- Responsive mobile drawer
- Fixed header
- RTL support
- Theme-aware styling

### Props & State

```tsx
function FullLayout() {
  const { config, toggleSidebar } = useTheme()
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const isHorizontal = config.sidebarLayout === 'horizontal'
  const isCollapsed = config.sidebarCollapsed && !isHorizontal
  const isRtl = config.direction === 'rtl'
  const sidebarWidth = isHorizontal ? 0 : isCollapsed ? 80 : 260
  
  // ...
}
```

### Structure

```tsx
<div className="min-h-screen bg-surface-50 dark:bg-surface-950">
  {/* Header */}
  <AppHeader
    sidebarWidth={sidebarWidth}
    isHorizontal={isHorizontal}
    isCollapsed={isCollapsed}
    onToggleSidebar={toggleSidebar}
    onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
  />

  {/* Horizontal Nav (when enabled) */}
  {isHorizontal && <HorizontalNav navGroups={navGroups} />}

  {/* Vertical Sidebar (when enabled) */}
  {!isHorizontal && (
    <Sidebar
      navGroups={navGroups}
      isCollapsed={isCollapsed}
      width={sidebarWidth}
      isMobileOpen={isMobileSidebarOpen}
      onMobileClose={() => setIsMobileSidebarOpen(false)}
    />
  )}

  {/* Main Content */}
  <main style={{ paddingTop: isHorizontal ? 112 : 64 }}>
    <div className="layout-container p-4 md:p-6">
      <Outlet />
    </div>
  </main>
</div>
```

### Sidebar Modes

| Mode | Width | Features |
|------|-------|----------|
| Expanded | 260px | Full text labels, icons |
| Collapsed | 80px | Icons only, tooltips |
| Mobile | 260px | Overlay drawer |

### Layout Options

| Option | Values | Description |
|--------|--------|-------------|
| `sidebarLayout` | `vertical` / `horizontal` | Sidebar position |
| `container` | `full` / `boxed` | Content width |
| `sidebarCollapsed` | `true` / `false` | Sidebar state |

### When to Use

- Dashboard pages (`/dashboard/*`)
- Admin applications (`/app/*`)
- Management pages
- Any authenticated admin page

### Route Configuration

```tsx
{
  element: <FullLayout />,
  children: [
    { path: 'dashboard', element: <DashboardPage /> },
    { path: 'dashboard/analytics', element: <AnalyticsDashboard /> },
    { path: 'app/email', element: <EmailPage /> },
    { path: 'app/chat', element: <ChatPage /> },
    // ... more routes
  ],
}
```

---

## AuthLayout

Split-screen authentication layout.

**File:** `src/layouts/AuthLayout.tsx`

### Features

- Two-column layout
- Branding section with gradients
- Feature highlights
- Social links
- Responsive (single column on mobile)

### Structure

```
┌─────────────────────────────────────────────┐
│                  AuthLayout                  │
├─────────────────────┬───────────────────────┤
│                     │                       │
│    Branding Side    │    Auth Form Side     │
│                     │                       │
│    - Logo           │    <Outlet />         │
│    - Title          │    (LoginPage, etc.)  │
│    - Subtitle       │                       │
│    - Features       │                       │
│    - Social Links   │                       │
│                     │                       │
└─────────────────────┴───────────────────────┘
```

### Implementation

```tsx
export function AuthLayout() {
  const { t } = useLocale()

  return (
    <div className="min-h-screen flex bg-surface-50 dark:bg-surface-950">
      {/* Left Side - Branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-secondary-900 p-12 flex-col justify-between">
        {/* Background gradients */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-theme-primary/10 blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-theme-accent/10 blur-[100px]" />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <Link to="/">
            <img src="/assets/logo/logo-dark.svg" alt="AdminEx" />
          </Link>
        </div>

        {/* Title & Features */}
        <div className="relative z-10 space-y-8">
          <h2 className="text-display-section text-white">
            {t('auth.side.title_prefix')}
            <span className="text-gradient">{t('auth.side.title_emphasis')}</span>
          </h2>
          <p className="text-lead text-secondary-200/80">
            {t('auth.side.subtitle')}
          </p>
          {/* Feature badges */}
        </div>

        {/* Footer */}
        <div className="relative z-10 flex justify-between">
          <p className="text-secondary-200/60 text-sm">
            {t('footer.copyright_all_rights', { year })}
          </p>
          {/* Social links */}
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-[440px]">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
```

---

## AuthCardLayout

Centered card authentication layout.

**File:** `src/layouts/AuthLayout.tsx`

### Features

- Centered card design
- Background gradient effects
- Logo above card
- Footer links below

### Structure

```
┌─────────────────────────────────────────────┐
│                                             │
│              AuthCardLayout                 │
│                                             │
│                  [Logo]                     │
│                                             │
│         ┌─────────────────────┐             │
│         │                     │             │
│         │     <Outlet />      │             │
│         │   (LoginPage, etc.) │             │
│         │                     │             │
│         └─────────────────────┘             │
│                                             │
│            © 2025 • Privacy • Terms         │
│                                             │
└─────────────────────────────────────────────┘
```

### Implementation

```tsx
export function AuthCardLayout() {
  const { t } = useLocale()

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-surface-100 dark:bg-surface-950 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] rounded-full opacity-20 blur-[120px]"
          style={{ background: 'radial-gradient(circle, rgb(var(--theme-primary)) 0%, transparent 70%)' }}
        />
      </div>

      {/* Card Container */}
      <div className="relative w-full max-w-[480px]">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/">
            <Logo width={160} height={32} />
          </Link>
        </div>

        {/* Auth Card */}
        <div className="bg-white dark:bg-surface-900 rounded-[2rem] p-8 md:p-10 shadow-xl border border-surface-200 dark:border-surface-800">
          <Outlet />
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-secondary-500">
            {t('footer.copyright_all_rights', { year })}
          </p>
          <div className="flex justify-center gap-4">
            <Link to="#">Privacy</Link>
            <Link to="#">Terms</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

## Layout Configuration

### Container Types

```css
/* Full width (default) */
.layout-container {
  width: 100%;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

/* Boxed (max-width) */
[data-container="boxed"] .layout-container {
  max-width: 1440px;
  margin-left: auto;
  margin-right: auto;
}
```

### Sidebar Width

```css
:root {
  --sidebar-width: 260px;
  --sidebar-collapsed-width: 80px;
  --header-height: 70px;
}
```

### RTL Adjustments

```css
/* Sidebar position */
[dir="rtl"] [data-sidebar-layout="vertical"] .layout-sidebar {
  left: auto;
  right: 0;
}

/* Main content margin */
[dir="rtl"] [data-sidebar-layout="vertical"] .layout-main {
  margin-left: 0;
  margin-right: var(--sidebar-width);
}
```

---

## Responsive Behavior

### Breakpoints

| Breakpoint | Width | Behavior |
|------------|-------|----------|
| Mobile | < 768px | Hidden sidebar, hamburger menu |
| Tablet | 768px - 1024px | Collapsible sidebar |
| Desktop | > 1024px | Full sidebar |

### Mobile Sidebar

On mobile, the sidebar becomes an overlay drawer:

```tsx
// Open state managed in FullLayout
const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

// Hamburger button in header
<button onClick={() => setIsMobileSidebarOpen(true)}>
  <Icon icon={Icons.menu} />
</button>

// Sidebar with mobile props
<Sidebar
  isMobileOpen={isMobileSidebarOpen}
  onMobileClose={() => setIsMobileSidebarOpen(false)}
/>
```

### Mobile Overlay

```tsx
// In Sidebar component
{isMobileOpen && (
  <div 
    className="fixed inset-0 bg-black/50 z-[1025] lg:hidden"
    onClick={onMobileClose}
  />
)}
```

### Responsive CSS

```css
@media (max-width: 1024px) {
  [data-sidebar-layout="vertical"] .layout-sidebar {
    transform: translateX(-100%);
  }

  [data-sidebar-layout="vertical"] .layout-sidebar.open {
    transform: translateX(0);
  }

  [data-sidebar-layout="vertical"] .layout-main {
    margin-left: 0;
  }
}
```

---

## Creating Custom Layouts

### Basic Layout Template

```tsx
import { Outlet } from 'react-router-dom'

export function CustomLayout() {
  return (
    <div className="min-h-screen bg-surface-100 dark:bg-surface-950">
      {/* Optional Header */}
      <header className="h-16 bg-white dark:bg-surface-900 border-b">
        {/* Header content */}
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Optional Footer */}
      <footer className="py-4 text-center text-sm text-secondary-500">
        © 2025 My App
      </footer>
    </div>
  )
}
```

### Layout with Sidebar

```tsx
import { Outlet } from 'react-router-dom'
import { useTheme } from '@/hooks/useTheme'

export function SidebarLayout() {
  const { config } = useTheme()
  const sidebarWidth = config.sidebarCollapsed ? 80 : 260

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside 
        className="fixed top-0 left-0 bottom-0 bg-white dark:bg-surface-900 border-r"
        style={{ width: sidebarWidth }}
      >
        {/* Sidebar content */}
      </aside>

      {/* Main */}
      <main style={{ marginLeft: sidebarWidth }}>
        <Outlet />
      </main>
    </div>
  )
}
```

### Registering Custom Layout

```tsx
// routes/index.tsx
import { CustomLayout } from '@/layouts/CustomLayout'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: 'custom',
        element: <CustomLayout />,
        children: [
          { path: 'page1', element: <Page1 /> },
          { path: 'page2', element: <Page2 /> },
        ],
      },
    ],
  },
])
```

---

## Best Practices

### 1. Use the Right Layout

```tsx
// ✅ Good - Public pages use BlankLayout
{
  element: <BlankLayout />,
  children: [{ path: 'about', element: <AboutPage /> }],
}

// ✅ Good - Admin pages use FullLayout
{
  element: <FullLayout />,
  children: [{ path: 'dashboard', element: <DashboardPage /> }],
}
```

### 2. Nest Auth in Blank

```tsx
// ✅ Good - Auth nested in BlankLayout
{
  element: <BlankLayout />,
  children: [
    {
      path: 'auth',
      element: <AuthLayout />,
      children: [/* auth pages */],
    },
  ],
}
```

### 3. Handle Mobile Navigation

```tsx
// ✅ Good - Close sidebar on navigation
<Link 
  to="/dashboard" 
  onClick={onMobileClose}
>
  Dashboard
</Link>
```

### 4. Use Layout CSS Classes

```tsx
// ✅ Good - uses layout utilities
<div className="layout-container">
  {/* Respects container settings */}
</div>

// ❌ Avoid - hardcoded widths
<div className="max-w-7xl mx-auto">
  {/* Ignores user preferences */}
</div>
```

---

See also:
- [Routing](./ROUTING.md)
- [Theming](./THEMING.md)
- [Components](./COMPONENTS.md)
