# AdminEx - Premium React Admin Dashboard

> A modern, feature-rich React admin dashboard template built with React 19, TypeScript, Tailwind CSS v4, and Vite.

![AdminEx Dashboard](./assets/preview.png)

## 🚀 Overview

AdminEx is a premium admin dashboard template designed for building modern web applications. It provides a complete solution with multiple dashboard variants, extensive UI components, and a powerful theming system.

## ✨ Key Features

- **React 19** - Latest React with enhanced performance
- **TypeScript** - Full type safety and better developer experience
- **Tailwind CSS v4** - Modern utility-first CSS framework
- **Vite** - Lightning-fast build tool with HMR
- **Multiple Dashboards** - Overview, Analytics, E-commerce, CRM
- **30+ App Pages** - Email, Chat, Calendar, Contacts, Blog, E-commerce, Notes, Kanban
- **Theme Customization** - Dark/Light mode, 6 color presets, RTL support
- **Internationalization** - 10 languages supported
- **Responsive Design** - Mobile-first, works on all devices
- **Chart.js Integration** - Beautiful data visualizations
- **Drag & Drop** - Kanban boards with dnd-kit

## 📦 Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.0 | UI Framework |
| TypeScript | 5.9.3 | Type Safety |
| Tailwind CSS | 4.1.17 | Styling |
| Vite | 7.2.4 | Build Tool |
| React Router | 7.9.6 | Routing |
| Chart.js | 4.5.1 | Charts |
| dnd-kit | 6.3.1 | Drag & Drop |
| Iconify | 6.0.2 | Icons (Solar) |
| TipTap | 3.14.0 | Rich Text Editor |
| Swiper | 12.0.3 | Carousels |

## 🛠️ Installation

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Quick Start

```bash
# Clone the repository
git clone https://github.com/devcraftify/adminex.git
cd adminex

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
adminex/
├── public/                 # Static assets
│   └── assets/
│       ├── avatars/       # User avatar images
│       ├── flags/         # Country flags
│       ├── landing/       # Landing page assets
│       └── logo/          # Brand logos
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── charts/       # Chart components
│   │   ├── common/       # Common utilities (Icon, Logo, etc.)
│   │   └── dashboard/    # Dashboard-specific components
│   ├── context/          # React Context providers
│   ├── data/             # Mock data for demos
│   ├── hooks/            # Custom React hooks
│   ├── i18n/             # Internationalization
│   │   └── locales/      # Translation files
│   ├── layouts/          # Page layouts
│   │   ├── header/       # Header components
│   │   └── sidebar/      # Sidebar navigation
│   ├── pages/            # Page components
│   │   ├── apps/         # Application pages
│   │   ├── auth/         # Authentication pages
│   │   ├── charts/       # Chart demo pages
│   │   ├── dashboard/    # Dashboard variants
│   │   ├── errors/       # Error pages
│   │   ├── forms/        # Form pages
│   │   ├── home/         # Landing page
│   │   ├── pages/        # Utility pages
│   │   └── tables/       # Table pages
│   ├── routes/           # Router configuration
│   ├── styles/           # CSS modules
│   └── types/            # TypeScript types
├── docs/                  # Documentation
└── scripts/              # Build scripts
```

## 🎨 Theme Customization

AdminEx includes a powerful theme customization panel:

- **Mode**: Light / Dark
- **Direction**: LTR / RTL
- **Colors**: Blue, Purple, Green, Orange, Red, Cyan
- **Layout**: Vertical Sidebar / Horizontal Navigation
- **Container**: Full Width / Boxed
- **Card Style**: Shadow / Border

See [THEMING.md](./THEMING.md) for detailed customization guide.

## 🌍 Supported Languages

| Language | Code | RTL |
|----------|------|-----|
| English | en | No |
| French | fr | No |
| Spanish | es | No |
| Portuguese | pt | No |
| Russian | ru | No |
| Hindi | hi-IN | No |
| Chinese (Simplified) | zh-CN | No |
| Japanese | ja | No |
| Arabic | ar | Yes |
| Urdu | ur | Yes |

## 📖 Documentation

- [Architecture](./ARCHITECTURE.md) - Project structure and design patterns
- [Components](./COMPONENTS.md) - UI component documentation
- [Theming](./THEMING.md) - Theme customization guide
- [Layouts](./LAYOUTS.md) - Layout system documentation
- [Routing](./ROUTING.md) - Route configuration
- [Internationalization](./INTERNATIONALIZATION.md) - i18n setup
- [Styling](./STYLING.md) - CSS architecture
- [API Reference](./API_REFERENCE.md) - Hooks and utilities

## 🚀 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run lint:typography` | Audit typography consistency |

## 📱 Pages Overview

### Dashboards
- **Overview** - Main dashboard with stats and widgets
- **Analytics** - Data analytics with charts
- **E-commerce** - Sales and revenue metrics
- **CRM** - Customer relationship management

### Applications
- **Email** - Full email client UI
- **Chat** - Real-time messaging interface
- **Calendar** - Event management
- **Contacts** - Contact management
- **Blog** - Blog listing and creation
- **E-commerce** - Products, cart, checkout
- **Notes** - Note-taking app
- **Kanban** - Project management board

### Authentication
- **Login** - Side layout & Card layout
- **Register** - Side layout & Card layout
- **Forgot Password** - Password recovery

### Utility Pages
- **Pricing** - Pricing plans
- **Account Settings** - User preferences
- **Gallery** - Image gallery
- **FAQ** - Frequently asked questions
- **Typography** - Typography guide

### Forms
- **Form Layout** - Layout examples
- **Form Validation** - Validation patterns
- **Editor** - Rich text editor (TipTap)

### Tables
- **Simple Table** - Basic table
- **Data Table** - Advanced data table
- **CRUD Table** - Create/Read/Update/Delete

### Charts
- **Line Charts** - Line chart variations
- **Area Charts** - Area chart variations
- **Column Charts** - Bar/Column charts
- **Pie & Doughnut** - Circular charts
- **Radar Charts** - Radar visualizations
- **Candlestick** - Financial charts

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## 📄 License

This project is proprietary software. See LICENSE for details.

## 🔗 Links

- [Live Demo](https://adminex.devcraftify.com)
- [GitHub Repository](https://github.com/devcraftify/adminex)
- [Issue Tracker](https://github.com/devcraftify/adminex/issues)

---

Built with ❤️ by [DevCraftify](https://devcraftify.com)
