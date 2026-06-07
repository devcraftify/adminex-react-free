# AdminEx Routing

> Complete documentation for the routing system, route configuration, and navigation.

## 📋 Table of Contents

- [Overview](#overview)
- [Router Setup](#router-setup)
- [Route Configuration](#route-configuration)
- [All Routes](#all-routes)
- [Navigation Data](#navigation-data)
- [Route Guards](#route-guards)
- [Dynamic Routes](#dynamic-routes)
- [Adding New Routes](#adding-new-routes)
- [Best Practices](#best-practices)

---

## Overview

AdminEx uses **React Router v7** with the `createBrowserRouter` API for:

- Data loading and mutations
- Nested routing with layouts
- Error boundaries
- Type-safe navigation

---

## Router Setup

### Entry Point

**File:** `src/routes/index.tsx`

```tsx
import { createBrowserRouter } from 'react-router-dom'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      // All routes
    ],
  },
])
```

### Provider

**File:** `src/main.tsx`

```tsx
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'

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

---

## Route Configuration

### Structure

Routes are organized by layout:

```tsx
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      // Blank Layout Routes (frontend)
      {
        element: <BlankLayout />,
        children: [
          { index: true, element: <HomePage /> },
          {
            path: 'auth',
            element: <AuthLayout />,
            children: [/* auth routes */],
          },
          {
            path: 'auth-card',
            element: <AuthCardLayout />,
            children: [/* card auth routes */],
          },
        ],
      },
      // Full Layout Routes (admin)
      {
        element: <FullLayout />,
        children: [
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'app/email', element: <EmailPage /> },
          // ... more admin routes
        ],
      },
    ],
  },
])
```

### Route Object

```typescript
interface RouteObject {
  path?: string                    // URL path segment
  index?: boolean                  // Is index route
  element?: React.ReactNode        // Component to render
  errorElement?: React.ReactNode   // Error boundary
  children?: RouteObject[]         // Nested routes
  loader?: LoaderFunction          // Data loader
  action?: ActionFunction          // Form action
}
```

---

## All Routes

### Landing & Public

| Path | Component | Layout | Description |
|------|-----------|--------|-------------|
| `/` | `HomePage` | Blank | Landing page |

### Authentication

| Path | Component | Layout | Description |
|------|-----------|--------|-------------|
| `/auth/login` | `LoginPage` | AuthLayout | Side login |
| `/auth/register` | `RegisterPage` | AuthLayout | Side register |
| `/auth/forgot-password` | `ForgotPasswordPage` | AuthLayout | Password recovery |
| `/auth-card/login` | `LoginPage` | AuthCardLayout | Card login |
| `/auth-card/register` | `RegisterPage` | AuthCardLayout | Card register |
| `/auth-card/forgot-password` | `ForgotPasswordPage` | AuthCardLayout | Card password recovery |

### Dashboards

| Path | Component | Layout | Description |
|------|-----------|--------|-------------|
| `/dashboard` | `DashboardPage` | Full | Main dashboard |
| `/dashboard/analytics` | `AnalyticsDashboard` | Full | Analytics metrics |
| `/dashboard/ecommerce` | `EcommerceDashboard` | Full | E-commerce metrics |
| `/dashboard/crm` | `CRMDashboard` | Full | CRM metrics |

### Applications

| Path | Component | Layout | Description |
|------|-----------|--------|-------------|
| `/app/email` | `EmailPage` | Full | Email client |
| `/app/chat` | `ChatPage` | Full | Chat application |
| `/app/chat/voice-call` | `VoiceCallPage` | Full | Voice call UI |
| `/app/chat/video-call` | `VideoCallPage` | Full | Video call UI |
| `/app/calendar` | `CalendarPage` | Full | Event calendar |
| `/app/contacts` | `ContactsPage` | Full | Contact management |
| `/app/blog` | `BlogListPage` | Full | Blog posts list |
| `/app/blog/create` | `BlogCreatePage` | Full | Create blog post |
| `/app/blog/:slug` | `BlogDetailPage` | Full | View blog post |
| `/app/notes` | `NotesPage` | Full | Notes application |
| `/app/kanban` | `KanbanPage` | Full | Kanban board |

### E-commerce

| Path | Component | Layout | Description |
|------|-----------|--------|-------------|
| `/app/ecommerce/products` | `ProductsPage` | Full | Products list |
| `/app/ecommerce/products/create` | `ProductCreatePage` | Full | Add product |
| `/app/ecommerce/products/:id` | `ProductDetailPage` | Full | Product details |
| `/app/ecommerce/products/:id/edit` | `ProductCreatePage` | Full | Edit product |
| `/app/ecommerce/checkout` | `CheckoutPage` | Full | Checkout flow |

### Forms

| Path | Component | Layout | Description |
|------|-----------|--------|-------------|
| `/forms/layout` | `FormLayoutPage` | Full | Form layouts |
| `/forms/validation` | `FormValidationPage` | Full | Form validation |
| `/forms/editor` | `EditorPage` | Full | Rich text editor |

### Tables

| Path | Component | Layout | Description |
|------|-----------|--------|-------------|
| `/tables/simple` | `SimpleTablePage` | Full | Basic table |
| `/tables/data` | `DataTablePage` | Full | Advanced data table |
| `/tables/crud` | `CrudTablePage` | Full | CRUD operations |

### Charts

| Path | Component | Layout | Description |
|------|-----------|--------|-------------|
| `/charts` | redirect | Full | Redirects to /charts/line |
| `/charts/line` | `LineChartsPage` | Full | Line chart examples |
| `/charts/area` | `AreaChartsPage` | Full | Area chart examples |
| `/charts/columns` | `ColumnChartsPage` | Full | Column chart examples |
| `/charts/pie` | `PieDoughnutChartsPage` | Full | Pie/doughnut examples |
| `/charts/radar` | `RadarChartsPage` | Full | Radar chart examples |
| `/charts/candlestick` | `CandlestickChartsPage` | Full | Financial charts |

### Utility Pages

| Path | Component | Layout | Description |
|------|-----------|--------|-------------|
| `/pages/pricing` | `PricingPage` | Full | Pricing plans |
| `/pages/account-settings` | `AccountSettingsPage` | Full | User settings |
| `/pages/gallery` | `GalleryPage` | Full | Image gallery |
| `/pages/faq` | `FaqPage` | Full | FAQ section |
| `/pages/typography` | `TypographyGuidePage` | Full | Typography guide |

### Error Pages

| Path | Component | Layout | Description |
|------|-----------|--------|-------------|
| `*` | `NotFoundPage` | - | 404 error page |

---

## Navigation Data

### Structure

**File:** `src/layouts/sidebar/navData.ts`

```typescript
import { Icons } from '@/components/common'
import type { NavGroup } from './types'

export const navGroups: NavGroup[] = [
  {
    title: 'Dashboards',
    items: [
      { path: '/dashboard', label: 'Overview', icon: Icons.dashboard },
      { path: '/dashboard/analytics', label: 'Analytics', icon: Icons.chartLine, badge: 'New' },
      { path: '/dashboard/ecommerce', label: 'eCommerce', icon: Icons.shopping },
      { path: '/dashboard/crm', label: 'CRM', icon: Icons.briefcase },
    ],
  },
  // More groups...
]
```

### Types

**File:** `src/layouts/sidebar/types.ts`

```typescript
export interface NavSubItem {
  path: string
  label: string
}

export interface NavItem {
  path: string
  label: string
  icon: string
  badge?: string | number
  children?: NavSubItem[]
}

export interface NavGroup {
  title: string
  items: NavItem[]
}
```

### Complete Navigation

```typescript
export const navGroups: NavGroup[] = [
  {
    title: 'Dashboards',
    items: [
      { path: '/dashboard', label: 'Overview', icon: Icons.dashboard },
      { path: '/dashboard/analytics', label: 'Analytics', icon: Icons.chartLine, badge: 'New' },
      { path: '/dashboard/ecommerce', label: 'eCommerce', icon: Icons.shopping },
      { path: '/dashboard/crm', label: 'CRM', icon: Icons.briefcase },
    ],
  },
  {
    title: 'Apps',
    items: [
      { path: '/app/email', label: 'Email', icon: Icons.mail, badge: 3 },
      { path: '/app/chat', label: 'Chat', icon: Icons.message, badge: 5 },
      { path: '/app/calendar', label: 'Calendar', icon: Icons.calendar },
      { path: '/app/contacts', label: 'Contacts', icon: Icons.contacts },
      {
        path: '/app/blog',
        label: 'Blog',
        icon: Icons.article,
        children: [
          { path: '/app/blog', label: 'All Posts' },
          { path: '/app/blog/create', label: 'Create Post' },
        ],
      },
      {
        path: '/app/ecommerce/products',
        label: 'E-commerce',
        icon: Icons.shopping,
        children: [
          { path: '/app/ecommerce/products', label: 'Products' },
          { path: '/app/ecommerce/products/create', label: 'Add Product' },
          { path: '/app/ecommerce/checkout', label: 'Checkout' },
        ],
      },
      { path: '/app/notes', label: 'Notes', icon: Icons.note },
      { path: '/app/kanban', label: 'Kanban Board', icon: Icons.kanban },
    ],
  },
  {
    title: 'Authentication',
    items: [
      {
        path: '/auth/login',
        label: 'Login',
        icon: Icons.lock,
        children: [
          { path: '/auth/login', label: 'Side Login' },
          { path: '/auth-card/login', label: 'Card Login' },
        ],
      },
      {
        path: '/auth/register',
        label: 'Register',
        icon: Icons.userPlus,
        children: [
          { path: '/auth/register', label: 'Side Register' },
          { path: '/auth-card/register', label: 'Card Register' },
        ],
      },
      { path: '/auth/forgot-password', label: 'Forgot Password', icon: Icons.key },
    ],
  },
  {
    title: 'Pages',
    items: [
      { path: '/pages/pricing', label: 'Pricing', icon: Icons.creditCard },
      { path: '/pages/account-settings', label: 'Account Settings', icon: Icons.settings },
      { path: '/pages/gallery', label: 'Gallery', icon: Icons.photo },
      { path: '/pages/faq', label: 'FAQ', icon: Icons.help },
      { path: '/pages/typography', label: 'Typography', icon: Icons.heading },
    ],
  },
  {
    title: 'Forms',
    items: [
      { path: '/forms/layout', label: 'Form Layout', icon: Icons.layoutGrid },
      { path: '/forms/validation', label: 'Form Validation', icon: Icons.checklist },
      { path: '/forms/editor', label: 'Editor', icon: Icons.edit },
    ],
  },
  {
    title: 'Tables',
    items: [
      { path: '/tables/simple', label: 'Simple Table', icon: Icons.table },
      { path: '/tables/data', label: 'Data Table', icon: Icons.database },
      { path: '/tables/crud', label: 'CRUD Table', icon: Icons.edit },
    ],
  },
  {
    title: 'Charts',
    items: [
      { path: '/charts/line', label: 'Line', icon: Icons.chartLine },
      { path: '/charts/area', label: 'Area', icon: Icons.chartArea },
      { path: '/charts/columns', label: 'Columns', icon: Icons.chartBar },
      { path: '/charts/pie', label: 'Pie & Doughnut', icon: Icons.chartPie },
      { path: '/charts/radar', label: 'Radar', icon: Icons.chartRadar },
      { path: '/charts/candlestick', label: 'Candlestick', icon: Icons.chartCandle },
    ],
  },
]
```

---

## Route Guards

### Protected Routes (Example)

```tsx
// components/auth/ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
```

### Usage

```tsx
{
  element: (
    <ProtectedRoute>
      <FullLayout />
    </ProtectedRoute>
  ),
  children: [
    { path: 'dashboard', element: <DashboardPage /> },
  ],
}
```

### Role-Based Access (Example)

```tsx
// components/auth/RoleGuard.tsx
export function RoleGuard({ 
  roles, 
  children 
}: { 
  roles: string[]
  children: React.ReactNode 
}) {
  const { user } = useAuth()

  if (!roles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <>{children}</>
}
```

---

## Dynamic Routes

### URL Parameters

```tsx
// Route definition
{ path: 'app/blog/:slug', element: <BlogDetailPage /> }

// Access in component
import { useParams } from 'react-router-dom'

function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  // Use slug to fetch blog post
}
```

### Multiple Parameters

```tsx
// Route definition
{ path: 'app/ecommerce/products/:id', element: <ProductDetailPage /> }
{ path: 'app/ecommerce/products/:id/edit', element: <ProductCreatePage /> }

// Access in component
function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  // Use id to fetch product
}
```

### Query Parameters

```tsx
import { useSearchParams } from 'react-router-dom'

function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  
  const category = searchParams.get('category')
  const page = searchParams.get('page') || '1'
  
  const setFilter = (category: string) => {
    setSearchParams({ category, page: '1' })
  }
}
```

---

## Adding New Routes

### 1. Create the Page Component

```tsx
// src/pages/custom/MyPage.tsx
export function MyPage() {
  return (
    <div className="space-y-6">
      <h1 className="heading-2 text-secondary-900 dark:text-white">
        My Page
      </h1>
      <p className="text-body text-secondary-500">
        Page content here.
      </p>
    </div>
  )
}
```

### 2. Export from Index

```tsx
// src/pages/custom/index.ts
export { MyPage } from './MyPage'
```

### 3. Add to Routes

```tsx
// src/routes/index.tsx
import { MyPage } from '@/pages/custom'

// In FullLayout children
{ path: 'custom/my-page', element: <MyPage /> }
```

### 4. Add to Navigation (Optional)

```tsx
// src/layouts/sidebar/navData.ts
{
  title: 'Custom',
  items: [
    { path: '/custom/my-page', label: 'My Page', icon: Icons.star },
  ],
}
```

### 5. Add Translation Keys (Optional)

```json
// src/i18n/locales/en.json
{
  "nav.custom": "Custom",
  "nav.my_page": "My Page"
}
```

---

## Scroll Restoration

**File:** `src/routes/ScrollToTop.tsx`

```tsx
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
```

Usage in RootLayout:

```tsx
export function RootLayout() {
  return (
    <div>
      <ScrollToTop />
      <Outlet />
    </div>
  )
}
```

---

## Navigation Hooks

### useNavigate

```tsx
import { useNavigate } from 'react-router-dom'

function MyComponent() {
  const navigate = useNavigate()

  const goToDashboard = () => {
    navigate('/dashboard')
  }

  const goBack = () => {
    navigate(-1)
  }

  const replaceHistory = () => {
    navigate('/new-page', { replace: true })
  }
}
```

### useLocation

```tsx
import { useLocation } from 'react-router-dom'

function MyComponent() {
  const location = useLocation()
  
  console.log(location.pathname)  // "/dashboard"
  console.log(location.search)    // "?filter=active"
  console.log(location.hash)      // "#section1"
  console.log(location.state)     // Custom state data
}
```

### NavLink

```tsx
import { NavLink } from 'react-router-dom'

function Navigation() {
  return (
    <NavLink
      to="/dashboard"
      className={({ isActive }) =>
        isActive 
          ? 'text-theme-primary font-bold' 
          : 'text-secondary-600'
      }
    >
      Dashboard
    </NavLink>
  )
}
```

---

## Best Practices

### 1. Organize by Feature

```
pages/
├── dashboard/
│   ├── DashboardPage.tsx
│   ├── AnalyticsDashboard.tsx
│   └── index.ts
├── apps/
│   ├── blog/
│   ├── email/
│   └── chat/
└── index.ts
```

### 2. Use Index Files

```tsx
// pages/dashboard/index.ts
export { DashboardPage } from './DashboardPage'
export { AnalyticsDashboard } from './AnalyticsDashboard'

// routes/index.tsx
import { DashboardPage, AnalyticsDashboard } from '@/pages/dashboard'
```

### 3. Keep Routes Flat in Layout

```tsx
// ✅ Good - flat children
{
  element: <FullLayout />,
  children: [
    { path: 'dashboard', element: <DashboardPage /> },
    { path: 'dashboard/analytics', element: <AnalyticsDashboard /> },
  ],
}

// ❌ Avoid - deeply nested
{
  element: <FullLayout />,
  children: [
    {
      path: 'dashboard',
      children: [
        { index: true, element: <DashboardPage /> },
        { path: 'analytics', element: <AnalyticsDashboard /> },
      ],
    },
  ],
}
```

### 4. Use Navigate for Redirects

```tsx
import { Navigate } from 'react-router-dom'

// Redirect route
{ path: 'charts', element: <Navigate to="/charts/line" replace /> }
```

### 5. Handle 404s

```tsx
{
  path: '/',
  element: <RootLayout />,
  errorElement: <NotFoundPage />,  // Catches unmatched routes
  children: [/* ... */],
}
```

---

See also:
- [Layouts](./LAYOUTS.md)
- [Components](./COMPONENTS.md)
- [Architecture](./ARCHITECTURE.md)
