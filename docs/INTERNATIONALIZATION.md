# AdminEx Internationalization (i18n)

> Complete guide to the internationalization system, supported languages, and translation workflow.

## 📋 Table of Contents

- [Overview](#overview)
- [Setup](#setup)
- [Locale Provider](#locale-provider)
- [Using Translations](#using-translations)
- [Supported Languages](#supported-languages)
- [Translation Files](#translation-files)
- [RTL Languages](#rtl-languages)
- [Adding a New Language](#adding-a-new-language)
- [Best Practices](#best-practices)

---

## Overview

AdminEx includes a lightweight i18n system with:

- **10 supported languages** including RTL
- **Context-based** locale management
- **Fallback to English** for missing translations
- **Variable interpolation** in strings
- **Auto RTL switching** for Arabic/Urdu
- **Persistent preference** via localStorage

---

## Setup

### Provider Hierarchy

The `LocaleProvider` must wrap components that use translations:

```tsx
// main.tsx
import { ThemeProvider } from '@/context/ThemeContext'
import { LocaleProvider } from '@/i18n'

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

> **Note:** `LocaleProvider` must be inside `ThemeProvider` because it uses `useTheme` for RTL direction.

---

## Locale Provider

**File:** `src/i18n/LocaleProvider.tsx`

### Types

```typescript
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

export type Messages = Record<string, string>
export type TranslateVars = Record<string, string | number>
```

### Context Value

```typescript
interface LocaleContextValue {
  locale: Locale                                    // Current locale
  setLocale: (locale: Locale) => void              // Change locale
  messages: Messages                                // All translations
  t: (key: string, vars?: TranslateVars) => string // Translate function
}
```

### Features

1. **Fallback translations**: Missing keys fall back to English
2. **Variable interpolation**: `{{ name }}` syntax
3. **Auto RTL**: Switches direction for Arabic/Urdu
4. **Persistence**: Saves to localStorage

---

## Using Translations

### useLocale Hook

**File:** `src/i18n/useLocale.ts`

```typescript
import { useLocale } from '@/i18n'

function MyComponent() {
  const { locale, setLocale, t } = useLocale()

  return (
    <div>
      <h1>{t('dashboard.title')}</h1>
      <p>{t('dashboard.welcome_back')}</p>
      
      <button onClick={() => setLocale('fr')}>
        Switch to French
      </button>
    </div>
  )
}
```

### Basic Translation

```tsx
const { t } = useLocale()

// Simple key
<h1>{t('nav.dashboard')}</h1>

// Nested key
<p>{t('auth.login.title')}</p>
```

### Variable Interpolation

```tsx
const { t } = useLocale()

// Translation file:
// "footer.copyright_all_rights": "© {{ year }} AdminEx. All rights reserved."

<p>{t('footer.copyright_all_rights', { year: 2025 })}</p>
// Output: "© 2025 AdminEx. All rights reserved."

// Multiple variables:
// "user.greeting": "Hello {{ name }}, you have {{ count }} messages."

<p>{t('user.greeting', { name: 'John', count: 5 })}</p>
// Output: "Hello John, you have 5 messages."
```

### Current Locale

```tsx
const { locale } = useLocale()

<p>Current language: {locale}</p>

// Conditional rendering
{locale === 'ar' && (
  <p>مرحبا بك</p>
)}
```

### Language Switcher Component

```tsx
import { LanguageSwitcher } from '@/components/common'

// Pre-built dropdown with flags
<LanguageSwitcher />
```

---

## Supported Languages

| Language | Code | RTL | Flag |
|----------|------|-----|------|
| English | `en` | No | 🇺🇸 |
| French | `fr` | No | 🇫🇷 |
| Spanish | `es` | No | 🇪🇸 |
| Portuguese | `pt` | No | 🇧🇷 |
| Russian | `ru` | No | 🇷🇺 |
| Hindi | `hi-IN` | No | 🇮🇳 |
| Chinese (Simplified) | `zh-CN` | No | 🇨🇳 |
| Japanese | `ja` | No | 🇯🇵 |
| Arabic | `ar` | **Yes** | 🇸🇦 |
| Urdu | `ur` | **Yes** | 🇵🇰 |

---

## Translation Files

### Location

```
src/i18n/
├── locales/
│   ├── en.json      # English (default/fallback)
│   ├── fr.json      # French
│   ├── es.json      # Spanish
│   ├── pt.json      # Portuguese
│   ├── ru.json      # Russian
│   ├── hi-IN.json   # Hindi
│   ├── zh-CN.json   # Chinese Simplified
│   ├── ja.json      # Japanese
│   ├── ar.json      # Arabic
│   └── ur.json      # Urdu
├── LocaleProvider.tsx
├── useLocale.ts
└── index.ts
```

### File Structure

Translation files are flat JSON with dot notation in keys:

```json
{
  "language": "Language",
  "search_placeholder": "Search...",
  "create": "Create",
  
  "nav.dashboards": "Dashboards",
  "nav.apps": "Apps",
  "nav.overview": "Overview",
  "nav.analytics": "Analytics",
  
  "dashboard.title": "Dashboard",
  "dashboard.welcome_back": "Welcome back! Here's what's happening.",
  "dashboard.visitors": "Visitors",
  "dashboard.revenue": "Revenue",
  
  "auth.login.title": "Welcome Back",
  "auth.login.subtitle": "Enter your credentials to access your account",
  "auth.login.email": "Email Address",
  "auth.login.password": "Password",
  "auth.login.remember_me": "Remember me",
  "auth.login.forgot_password": "Forgot password?",
  "auth.login.sign_in": "Sign In",
  
  "footer.copyright_all_rights": "© {{ year }} AdminEx. All rights reserved."
}
```

### Key Categories

| Prefix | Purpose |
|--------|---------|
| `nav.*` | Navigation labels |
| `dashboard.*` | Dashboard content |
| `auth.*` | Authentication pages |
| `header.*` | Header UI |
| `footer.*` | Footer content |
| `theme.*` | Theme customizer |
| `common.*` | Common actions |
| `landing.*` | Landing page sections |
| `pages.*` | Utility pages |
| `table.*` | Table components |
| `form.*` | Form elements |

---

## RTL Languages

### Automatic Direction Switching

When switching to Arabic or Urdu, the direction is automatically set to RTL:

```tsx
// LocaleProvider.tsx
useEffect(() => {
  const shouldRtl = locale === 'ar' || locale === 'ur'
  if (shouldRtl) {
    if (themeConfig.direction !== 'rtl') {
      setDirection('rtl')
    }
    localStorage.setItem(DIRECTION_LOCK_STORAGE_KEY, '1')
  } else {
    // Restore LTR if previously locked by locale
    const wasLocked = localStorage.getItem(DIRECTION_LOCK_STORAGE_KEY) === '1'
    if (wasLocked && themeConfig.direction !== 'ltr') {
      setDirection('ltr')
    }
    localStorage.removeItem(DIRECTION_LOCK_STORAGE_KEY)
  }
}, [locale])
```

### Direction Lock

For Arabic/Urdu:
- Direction control is disabled in Theme Customizer
- RTL is enforced automatically
- Switching away restores user's previous preference

### RTL-Aware Components

```tsx
const { locale } = useLocale()
const isRtl = locale === 'ar' || locale === 'ur'

// Or use theme config
const { config } = useTheme()
const isRtl = config.direction === 'rtl'

<div className={isRtl ? 'text-right' : 'text-left'}>
  Content
</div>
```

---

## Adding a New Language

### Step 1: Create Translation File

```json
// src/i18n/locales/de.json (German example)
{
  "language": "Sprache",
  "search_placeholder": "Suchen...",
  "nav.dashboards": "Dashboards",
  "nav.apps": "Apps",
  // ... copy from en.json and translate
}
```

### Step 2: Add Type

```typescript
// src/i18n/LocaleProvider.tsx
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
  | 'de'  // Add new locale
```

### Step 3: Import Messages

```typescript
// src/i18n/LocaleProvider.tsx
import deMessages from './locales/de.json'

const MESSAGES: Record<Locale, Messages> = {
  en: enMessages as Messages,
  fr: frMessages as Messages,
  // ... existing
  de: deMessages as Messages,  // Add new
}
```

### Step 4: Update Saved Locale Check

```typescript
// src/i18n/LocaleProvider.tsx
const [locale, setLocaleState] = useState<Locale>(() => {
  if (typeof window === 'undefined') return DEFAULT_LOCALE
  const saved = localStorage.getItem(STORAGE_KEY)
  if (
    saved === 'en' || saved === 'fr' || saved === 'hi-IN' || 
    saved === 'zh-CN' || saved === 'ja' || saved === 'ur' || 
    saved === 'pt' || saved === 'ru' || saved === 'es' || 
    saved === 'ar' || saved === 'de'  // Add new
  ) return saved
  return DEFAULT_LOCALE
})
```

### Step 5: Add to Language Switcher

```typescript
// src/components/common/LanguageSwitcher.tsx
const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  // ... existing
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },  // Add new
]
```

### Step 6: Add Flag Asset (Optional)

```
public/assets/flags/de.svg
```

---

## Translation Keys Reference

### Common Keys

```json
{
  "common.new": "New",
  "common.logout": "Logout",
  "common.save": "Save",
  "common.cancel": "Cancel",
  "common.delete": "Delete",
  "common.edit": "Edit",
  "common.view": "View",
  "common.search": "Search",
  "common.filter": "Filter",
  "common.reset": "Reset",
  "common.submit": "Submit",
  "common.loading": "Loading...",
  "common.no_results": "No results found",
  "common.error": "An error occurred",
  "common.success": "Success",
  "common.confirm": "Confirm",
  "common.back": "Back",
  "common.next": "Next",
  "common.previous": "Previous"
}
```

### Navigation Keys

```json
{
  "nav.dashboards": "Dashboards",
  "nav.apps": "Apps",
  "nav.authentication": "Authentication",
  "nav.pages": "Pages",
  "nav.forms": "Forms",
  "nav.table": "Table",
  "nav.charts": "Charts",
  "nav.overview": "Overview",
  "nav.analytics": "Analytics",
  "nav.ecommerce": "eCommerce",
  "nav.crm": "CRM",
  "nav.email": "Email",
  "nav.chat": "Chat",
  "nav.calendar": "Calendar",
  "nav.contacts": "Contacts",
  "nav.blog": "Blog",
  "nav.notes": "Notes",
  "nav.kanban_board": "Kanban Board"
}
```

### Auth Keys

```json
{
  "auth.login.title": "Welcome Back",
  "auth.login.subtitle": "Enter your credentials to access your account",
  "auth.login.email": "Email Address",
  "auth.login.password": "Password",
  "auth.login.remember_me": "Remember me",
  "auth.login.forgot_password": "Forgot password?",
  "auth.login.sign_in": "Sign In",
  "auth.login.no_account": "Don't have an account?",
  "auth.login.sign_up": "Sign up",
  
  "auth.register.title": "Create Account",
  "auth.register.subtitle": "Start your journey with AdminEx",
  "auth.register.name": "Full Name",
  "auth.register.email": "Email Address",
  "auth.register.password": "Password",
  "auth.register.confirm_password": "Confirm Password",
  "auth.register.agree_terms": "I agree to the Terms of Service",
  "auth.register.create_account": "Create Account",
  
  "auth.forgot.title": "Forgot Password",
  "auth.forgot.subtitle": "Enter your email to reset your password",
  "auth.forgot.send_reset": "Send Reset Link"
}
```

### Theme Keys

```json
{
  "theme.title": "Theme Settings",
  "theme.mode": "Theme Mode",
  "theme.light": "Light",
  "theme.dark": "Dark",
  "theme.direction": "Direction",
  "theme.ltr": "LTR",
  "theme.rtl": "RTL",
  "theme.primary_color": "Primary Color",
  "theme.sidebar_layout": "Sidebar Layout",
  "theme.vertical": "Vertical",
  "theme.horizontal": "Horizontal",
  "theme.sidebar_width": "Sidebar Width",
  "theme.wide": "Wide",
  "theme.mini": "Mini",
  "theme.container": "Container",
  "theme.full_width": "Full Width",
  "theme.boxed": "Boxed",
  "theme.card_style": "Card Style",
  "theme.shadow": "Shadow",
  "theme.border": "Border",
  "theme.reset": "Reset to Default"
}
```

---

## Best Practices

### 1. Always Use Translation Keys

```tsx
// ✅ Good
<h1>{t('dashboard.title')}</h1>

// ❌ Avoid
<h1>Dashboard</h1>
```

### 2. Use Meaningful Key Names

```json
// ✅ Good - descriptive and organized
{
  "auth.login.email_placeholder": "Enter your email",
  "dashboard.stats.total_users": "Total Users"
}

// ❌ Avoid - vague or flat
{
  "text1": "Enter your email",
  "usercount": "Total Users"
}
```

### 3. Keep Base Language Complete

- English (`en.json`) should have ALL keys
- Other languages can be partial (fallback to English)

### 4. Group Related Keys

```json
{
  "auth.login.title": "...",
  "auth.login.subtitle": "...",
  "auth.login.email": "...",
  "auth.login.password": "...",
  
  "auth.register.title": "...",
  "auth.register.subtitle": "..."
}
```

### 5. Use Variables for Dynamic Content

```json
// ✅ Good - uses variable
{
  "user.welcome": "Welcome, {{ name }}!"
}

// ❌ Avoid - hardcoded or concatenated
// Don't do: t('user.welcome_prefix') + name + t('user.welcome_suffix')
```

### 6. Handle Pluralization (Manual)

```tsx
const count = items.length

// For now, handle manually:
const label = count === 1 
  ? t('items.singular') 
  : t('items.plural', { count })
```

### 7. Test RTL Languages

- Test with Arabic (`ar`) or Urdu (`ur`)
- Check layout mirrors correctly
- Verify text alignment

---

## Persistence

### Storage Keys

| Key | Purpose |
|-----|---------|
| `adminex-locale` | Current locale preference |
| `adminex-direction-locked-by-locale` | RTL lock flag for Arabic/Urdu |

### Reading Saved Locale

```typescript
const saved = localStorage.getItem('adminex-locale')
if (saved && isValidLocale(saved)) {
  setLocale(saved)
}
```

---

See also:
- [Components](./COMPONENTS.md) - LanguageSwitcher component
- [Theming](./THEMING.md) - RTL support
- [API Reference](./API_REFERENCE.md) - useLocale hook
