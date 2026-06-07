import { Icons } from '@/components/common'
import type { NavGroup } from './types'

export const navGroups: NavGroup[] = [
  {
    title: 'Dashboards',
    items: [
      { path: '/dashboard', label: 'Overview', icon: Icons.dashboard },
    ],
  },
  {
    title: 'Apps',
    items: [
      { path: '/app/calendar', label: 'Calendar', icon: Icons.calendar },
      { path: '/app/contacts', label: 'Contacts', icon: Icons.contacts },
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
      { path: '/pages/account-settings', label: 'Account Settings', icon: Icons.settings },
      { path: '/pages/typography', label: 'Typography', icon: Icons.heading },
    ],
  },
  {
    title: 'Forms',
    items: [
      { path: '/forms/layout', label: 'Form Layout', icon: Icons.layoutGrid },
      { path: '/forms/validation', label: 'Form Validation', icon: Icons.checklist },
    ],
  },
  {
    title: 'Table',
    items: [
      { path: '/tables/simple', label: 'Simple Table', icon: Icons.table },
      { path: '/tables/data', label: 'Data Table', icon: Icons.database },
    ],
  },
  {
    title: 'Charts',
    items: [
      { path: '/charts/line', label: 'Line', icon: Icons.chartLine },
      { path: '/charts/area', label: 'Area', icon: Icons.chartArea },
      { path: '/charts/columns', label: 'Columns', icon: Icons.chartBar },
      { path: '/charts/pie', label: 'Pie & Doughnut', icon: Icons.chartPie },
    ],
  },
]
