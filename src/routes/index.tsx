import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'

import { RootLayout } from '@/layouts/RootLayout'
import { BlankLayout } from '@/layouts/BlankLayout'
import { FullLayout } from '@/layouts/FullLayout'
import { AuthLayout } from '@/layouts/AuthLayout'

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
)

const HomePage = lazy(() => import('@/pages/home/HomePage').then(m => ({ default: m.HomePage })))

const DashboardPage = lazy(() => import('@/pages/dashboard').then(m => ({ default: m.DashboardPage })))

const ContactsPage = lazy(() => import('@/pages/apps/contacts').then(m => ({ default: m.ContactsPage })))
const CalendarPage = lazy(() => import('@/pages/apps/calendar').then(m => ({ default: m.CalendarPage })))

const FormLayoutPage = lazy(() => import('@/pages/forms').then(m => ({ default: m.FormLayoutPage })))
const FormValidationPage = lazy(() => import('@/pages/forms').then(m => ({ default: m.FormValidationPage })))

const SimpleTablePage = lazy(() => import('@/pages/tables').then(m => ({ default: m.SimpleTablePage })))
const DataTablePage = lazy(() => import('@/pages/tables').then(m => ({ default: m.DataTablePage })))

const LineChartsPage = lazy(() => import('@/pages/charts').then(m => ({ default: m.LineChartsPage })))
const AreaChartsPage = lazy(() => import('@/pages/charts').then(m => ({ default: m.AreaChartsPage })))
const ColumnChartsPage = lazy(() => import('@/pages/charts').then(m => ({ default: m.ColumnChartsPage })))
const PieDoughnutChartsPage = lazy(() => import('@/pages/charts').then(m => ({ default: m.PieDoughnutChartsPage })))

const AccountSettingsPage = lazy(() => import('@/pages/pages').then(m => ({ default: m.AccountSettingsPage })))
const TypographyGuidePage = lazy(() => import('@/pages/pages').then(m => ({ default: m.TypographyGuidePage })))

const LoginPage = lazy(() => import('@/pages/auth/LoginPage').then(m => ({ default: m.LoginPage })))
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage').then(m => ({ default: m.RegisterPage })))
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })))

const NotFoundPage = lazy(() => import('@/pages/errors/NotFoundPage').then(m => ({ default: m.NotFoundPage })))

const withSuspense = (Component: React.LazyExoticComponent<React.ComponentType>) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
)

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: withSuspense(NotFoundPage),
    children: [
      {
        element: <BlankLayout />,
        children: [
          {
            index: true,
            element: withSuspense(HomePage),
          },
          {
            path: 'auth',
            element: <AuthLayout />,
            children: [
              { path: 'login', element: withSuspense(LoginPage) },
              { path: 'register', element: withSuspense(RegisterPage) },
              { path: 'forgot-password', element: withSuspense(ForgotPasswordPage) },
            ],
          },
        ],
      },
      {
        element: <FullLayout />,
        children: [
          { path: 'dashboard', element: withSuspense(DashboardPage) },
          { path: 'app/calendar', element: withSuspense(CalendarPage) },
          { path: 'app/contacts', element: withSuspense(ContactsPage) },
          { path: 'forms/layout', element: withSuspense(FormLayoutPage) },
          { path: 'forms/validation', element: withSuspense(FormValidationPage) },
          { path: 'tables/simple', element: withSuspense(SimpleTablePage) },
          { path: 'tables/data', element: withSuspense(DataTablePage) },
          { path: 'charts', element: <Navigate to="/charts/line" replace /> },
          { path: 'charts/line', element: withSuspense(LineChartsPage) },
          { path: 'charts/area', element: withSuspense(AreaChartsPage) },
          { path: 'charts/columns', element: withSuspense(ColumnChartsPage) },
          { path: 'charts/pie', element: withSuspense(PieDoughnutChartsPage) },
          { path: 'pages/account-settings', element: withSuspense(AccountSettingsPage) },
          { path: 'pages/typography', element: withSuspense(TypographyGuidePage) },
        ],
      },
    ],
  },
])
