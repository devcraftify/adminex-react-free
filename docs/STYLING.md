# AdminEx Styling

> Complete guide to the CSS architecture, design tokens, and utility classes.

## 📋 Table of Contents

- [Overview](#overview)
- [CSS Architecture](#css-architecture)
- [Design Tokens](#design-tokens)
- [Typography System](#typography-system)
- [Color System](#color-system)
- [Utility Classes](#utility-classes)
- [Component Styles](#component-styles)
- [Animations](#animations)
- [Responsive Design](#responsive-design)
- [Dark Mode](#dark-mode)
- [Best Practices](#best-practices)

---

## Overview

AdminEx uses a modular CSS architecture built on:

- **Tailwind CSS v4** - Utility-first framework
- **CSS Custom Properties** - Design tokens
- **CSS Layers** - Specificity management
- **Modular Files** - Organized by concern

---

## CSS Architecture

### File Structure

```
src/
├── index.css              # Entry point (imports all modules)
└── styles/
    ├── variables.css      # CSS custom properties & design tokens
    ├── fonts.css          # Typography & font definitions
    ├── base.css           # Resets & base element styles
    ├── layout.css         # Layout system (sidebar, RTL)
    ├── components.css     # Component utilities (cards, buttons)
    └── animations.css     # Keyframes & animation utilities
```

### Entry Point

**File:** `src/index.css`

```css
/* Tailwind base */
@import "tailwindcss";

/* Configure dark mode to use class strategy */
@custom-variant dark (&:where(.dark, .dark *));

/* Import modules */
@import "./styles/variables.css";
@import "./styles/fonts.css";
@import "./styles/base.css";
@import "./styles/layout.css";
@import "./styles/components.css";
@import "./styles/animations.css";
```

### CSS Layers

Tailwind v4 uses CSS layers for specificity:

```css
@layer base {
  /* Base element styles */
}

@layer utilities {
  /* Utility classes */
}
```

---

## Design Tokens

**File:** `src/styles/variables.css`

### Theme Colors

```css
@theme {
  /* Dynamic theme colors (set by ThemeContext) */
  --theme-primary: 236, 72, 153;  /* RGB values */
  --theme-accent: 14, 165, 233;
}
```

### Color Palettes

Each color has 11 shades (50-950):

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

  /* Secondary, Accent, Success, Warning, Danger, Info, Surface... */
}
```

### Available Palettes

| Palette | CSS Prefix | Usage |
|---------|------------|-------|
| Primary | `--color-primary-*` | Brand color |
| Secondary | `--color-secondary-*` | Text, neutral UI |
| Accent | `--color-accent-*` | Highlights, links |
| Success | `--color-success-*` | Success states |
| Warning | `--color-warning-*` | Warning states |
| Danger | `--color-danger-*` | Error states |
| Info | `--color-info-*` | Informational |
| Surface | `--color-surface-*` | Backgrounds |

### Layout Tokens

```css
@theme {
  /* Dimensions */
  --sidebar-width: 260px;
  --sidebar-collapsed-width: 80px;
  --header-height: 70px;

  /* Border Radius */
  --radius-sm: 0.375rem;   /* 6px */
  --radius-md: 0.5rem;     /* 8px */
  --radius-lg: 0.75rem;    /* 12px */
  --radius-xl: 1rem;       /* 16px */
  --radius-2xl: 1.5rem;    /* 24px */
  --radius-3xl: 2rem;      /* 32px */
}
```

### Shadows

```css
@theme {
  --shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-sm: 0 2px 4px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 8px -2px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.06);
  --shadow-lg: 0 12px 24px -6px rgb(0 0 0 / 0.1), 0 6px 12px -6px rgb(0 0 0 / 0.06);
  --shadow-xl: 0 24px 48px -12px rgb(0 0 0 / 0.15);
  --shadow-2xl: 0 32px 64px -12px rgb(0 0 0 / 0.2);
}
```

### Animation Timing

```css
@theme {
  --duration-fast: 150ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
}
```

### Z-Index Scale

```css
@theme {
  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-fixed: 1030;
  --z-modal-backdrop: 1040;
  --z-modal: 1050;
  --z-popover: 1060;
  --z-tooltip: 1070;
  --z-customizer: 1080;
}
```

---

## Typography System

**File:** `src/styles/fonts.css`

### Font Families

```css
:root {
  --font-sans: "Rethink Sans", system-ui, -apple-system, BlinkMacSystemFont, 
               "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --font-mono: "JetBrains Mono", "Fira Code", ui-monospace, Consolas, monospace;
  --font-display: "Rethink Sans", var(--font-sans);
}
```

### Typography Scale

```css
:root {
  /* Display (landing/hero) */
  --text-display-lg: 5rem;     /* 80px */
  --text-display-md: 3.75rem;  /* 60px */
  --text-display-sm: 3rem;     /* 48px */

  /* Headings (app UI) */
  --text-h1: 2.25rem;   /* 36px */
  --text-h2: 1.875rem;  /* 30px */
  --text-h3: 1.5rem;    /* 24px */
  --text-h4: 1.25rem;   /* 20px */
  --text-h5: 1.125rem;  /* 18px */
  --text-h6: 1rem;      /* 16px */

  /* Body */
  --text-body: 1rem;       /* 16px */
  --text-body-sm: 0.875rem; /* 14px */
  --text-caption: 0.75rem;  /* 12px */
  --text-badge: 0.75rem;    /* 12px */

  /* Line heights */
  --leading-display: 1.1;
  --leading-heading: 1.25;
  --leading-body: 1.625;
  --leading-compact: 1.5;

  /* Letter spacing */
  --tracking-tight: -0.025em;
  --tracking-tighter: -0.03em;
}
```

### Heading Classes

```css
.heading-1 { font-size: var(--text-h1); font-weight: 700; }
.heading-2 { font-size: var(--text-h2); font-weight: 700; }
.heading-3 { font-size: var(--text-h3); font-weight: 600; }
.heading-4 { font-size: var(--text-h4); font-weight: 600; }
.heading-5 { font-size: var(--text-h5); font-weight: 600; }
.heading-6 { font-size: var(--text-h6); font-weight: 600; }
```

### Body Classes

```css
.text-body { font-size: var(--text-body); line-height: var(--leading-body); }
.text-body-sm { font-size: var(--text-body-sm); line-height: var(--leading-compact); }
.text-caption { font-size: var(--text-caption); }
.text-lead { font-size: 1.125rem; line-height: 1.75; }
```

### Usage

```tsx
<h1 className="heading-1 text-secondary-900 dark:text-white">
  Page Title
</h1>

<p className="text-body text-secondary-500">
  Body text content here.
</p>

<span className="text-caption text-secondary-400">
  Caption text
</span>
```

---

## Color System

### Theme Colors (Dynamic)

Use for elements that should respect the user's color choice:

```tsx
/* Background */
<div className="bg-theme-primary">Primary BG</div>
<div className="bg-theme-primary-light">Light Primary BG</div>

/* Text */
<span className="text-theme-primary">Primary Text</span>

/* Border */
<div className="border border-theme-primary">Bordered</div>

/* Shadow */
<div className="shadow-theme-primary">Glowing shadow</div>
```

### Semantic Colors

Use for consistent meaning across the app:

```tsx
/* Success */
<div className="bg-success-100 text-success-700">Success message</div>

/* Warning */
<div className="bg-warning-100 text-warning-700">Warning message</div>

/* Danger/Error */
<div className="bg-danger-100 text-danger-700">Error message</div>

/* Info */
<div className="bg-info-100 text-info-700">Info message</div>
```

### Surface Colors

Use for backgrounds and layers:

```tsx
/* Page background */
<div className="bg-surface-50 dark:bg-surface-950">

/* Card background */
<div className="bg-white dark:bg-surface-900">

/* Elevated surface */
<div className="bg-surface-100 dark:bg-surface-800">
```

### Secondary Colors

Use for text and neutral UI:

```tsx
/* Headings */
<h1 className="text-secondary-900 dark:text-white">

/* Body text */
<p className="text-secondary-500 dark:text-secondary-400">

/* Muted text */
<span className="text-secondary-400 dark:text-secondary-500">
```

---

## Utility Classes

### Card Styles

**File:** `src/styles/components.css`

```css
/* Base card */
.card {
  background-color: white;
  border-radius: var(--radius-xl);
  transition: box-shadow var(--duration-normal);
}

.dark .card {
  background-color: var(--color-surface-900);
}

/* Shadow style (controlled by data-card-style) */
[data-card-style="shadow"] .card {
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
}

/* Border style */
[data-card-style="border"] .card {
  box-shadow: none;
  border: 1px solid var(--color-surface-200);
}
```

Usage:
```tsx
<div className="card p-6">
  Card content
</div>

<div className="card card-hover p-6">
  Hoverable card
</div>
```

### Glass Morphism

```css
.glass {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

.dark .glass {
  background: rgba(17, 25, 40, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
```

Usage:
```tsx
<div className="glass rounded-2xl p-8">
  Glassmorphism effect
</div>
```

### Gradient Text

```css
.text-gradient {
  background: linear-gradient(to right, rgb(var(--theme-primary)), rgb(var(--theme-accent)));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
}

.bg-gradient-theme {
  background: linear-gradient(135deg, rgb(var(--theme-primary)), rgb(var(--theme-accent)));
}
```

Usage:
```tsx
<h1 className="text-gradient">
  Gradient Heading
</h1>

<button className="bg-gradient-theme text-white">
  Gradient Button
</button>
```

### Buttons

```css
.btn-theme-primary {
  background-color: rgb(var(--theme-primary));
  color: white;
  transition: all 0.2s ease;
}

.btn-theme-primary:hover {
  filter: brightness(0.9);
  box-shadow: 0 4px 15px rgb(var(--theme-primary) / 0.4);
}

.btn-theme-outline {
  background-color: transparent;
  border: 1px solid rgb(var(--theme-primary));
  color: rgb(var(--theme-primary));
}

.btn-theme-outline:hover {
  background-color: rgb(var(--theme-primary) / 0.1);
}
```

Usage:
```tsx
<button className="btn-theme-primary px-4 py-2 rounded-lg">
  Primary Button
</button>

<button className="btn-theme-outline px-4 py-2 rounded-lg">
  Outline Button
</button>
```

### Form Inputs

```css
.input-theme {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--color-surface-300);
  background-color: white;
  color: var(--color-secondary-900);
  transition: all 0.2s ease;
}

.input-theme:focus {
  outline: none;
  border-color: rgb(var(--theme-primary));
  box-shadow: 0 0 0 3px rgb(var(--theme-primary) / 0.15);
}

.dark .input-theme {
  border-color: var(--color-surface-700);
  background-color: var(--color-surface-800);
  color: white;
}
```

Usage:
```tsx
<input 
  type="text" 
  className="input-theme" 
  placeholder="Enter text..."
/>
```

### Scrollbar

```css
.scrollbar-thin {
  scrollbar-width: thin;
  scrollbar-color: var(--color-surface-300) transparent;
}

.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: var(--color-surface-300);
  border-radius: 3px;
}

.dark .scrollbar-thin {
  scrollbar-color: var(--color-surface-600) transparent;
}
```

Usage:
```tsx
<div className="overflow-y-auto scrollbar-thin h-64">
  Scrollable content
</div>
```

---

## Animations

**File:** `src/styles/animations.css`

### Fade In

```css
.animate-fade-in {
  animation: fade-in var(--duration-normal) ease-out;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Slide Variations

```css
.animate-slide-in-left { animation: slide-in-left var(--duration-slow) ease-out; }
.animate-slide-in-right { animation: slide-in-right var(--duration-slow) ease-out; }
.animate-slide-in-up { animation: slide-in-up var(--duration-slow) ease-out; }
```

### Scale In

```css
.animate-scale-in {
  animation: scale-in var(--duration-normal) ease-out;
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

### Pulse Dot

```css
.animate-pulse-dot {
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}
```

### Spin Slow

```css
.animate-spin-slow {
  animation: spin 3s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

### Usage

```tsx
<div className="animate-fade-in">
  Fades in on mount
</div>

<div className="animate-slide-in-left">
  Slides from left
</div>

<span className="animate-pulse-dot w-2 h-2 bg-success-500 rounded-full">
  Pulsing indicator
</span>
```

---

## Responsive Design

### Breakpoints

Tailwind default breakpoints:

| Prefix | Min Width | CSS |
|--------|-----------|-----|
| `sm` | 640px | `@media (min-width: 640px)` |
| `md` | 768px | `@media (min-width: 768px)` |
| `lg` | 1024px | `@media (min-width: 1024px)` |
| `xl` | 1280px | `@media (min-width: 1280px)` |
| `2xl` | 1536px | `@media (min-width: 1536px)` |

### Responsive Classes

```tsx
/* Grid that changes columns */
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

/* Padding that increases */
<div className="p-4 md:p-6 lg:p-8">

/* Hidden on mobile */
<div className="hidden lg:block">

/* Show only on mobile */
<div className="block lg:hidden">
```

### Mobile-First Approach

```tsx
/* Base (mobile) → larger screens */
<div className="
  flex flex-col         /* Mobile: stack */
  md:flex-row          /* Tablet+: row */
  gap-4
  md:gap-6
">
```

---

## Dark Mode

### How It Works

1. `ThemeProvider` adds `dark` class to `<html>`
2. Tailwind's dark variant applies styles
3. Custom CSS uses `.dark` selector

### Tailwind Dark Variant

```tsx
<div className="
  bg-white              /* Light mode */
  dark:bg-surface-900   /* Dark mode */
  text-secondary-900
  dark:text-white
">
```

### Custom CSS Dark Mode

```css
.my-component {
  background: white;
  color: black;
}

.dark .my-component {
  background: var(--color-surface-900);
  color: white;
}
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

This affects:
- Scrollbar colors
- Form element defaults
- Selection colors

---

## Layout Classes

**File:** `src/styles/layout.css`

### Container

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

### RTL Support

```css
[dir="rtl"] [data-sidebar-layout="vertical"] .layout-sidebar {
  left: auto;
  right: 0;
}

[dir="rtl"] [data-sidebar-layout="vertical"] .layout-main {
  margin-left: 0;
  margin-right: var(--sidebar-width);
}

/* Flip icons/elements */
[dir="rtl"] .rtl-flip {
  transform: scaleX(-1);
}
```

### Logical Properties for RTL

```tsx
/* Use logical properties instead of physical */
<div className="ps-4 pe-6">    {/* padding-inline-start/end */}
<div className="ms-auto me-2"> {/* margin-inline-start/end */}
<div className="border-s">     {/* border-inline-start */}
```

---

## Best Practices

### 1. Use Semantic Color Classes

```tsx
// ✅ Good - semantic meaning
<div className="bg-success-100 text-success-700">
  Success message
</div>

// ❌ Avoid - color without meaning
<div className="bg-green-100 text-green-700">
  Success message
</div>
```

### 2. Use Theme Colors for Brand Elements

```tsx
// ✅ Good - respects user's color choice
<button className="bg-theme-primary text-white">
  Primary Action
</button>

// ❌ Avoid - hardcoded brand color
<button className="bg-blue-500 text-white">
  Primary Action
</button>
```

### 3. Always Support Dark Mode

```tsx
// ✅ Good - both modes
<div className="bg-white dark:bg-surface-900">

// ❌ Avoid - only light mode
<div className="bg-white">
```

### 4. Use Typography Classes

```tsx
// ✅ Good - consistent typography
<h1 className="heading-2 text-secondary-900 dark:text-white">

// ❌ Avoid - arbitrary sizes
<h1 className="text-2xl font-bold">
```

### 5. Prefer Utility Classes

```tsx
// ✅ Good - Tailwind utilities
<div className="flex items-center gap-4 p-6 rounded-xl">

// ❌ Avoid - custom CSS for common patterns
<div className="my-flex-container">
```

### 6. Use CSS Variables for Custom Styles

```css
/* ✅ Good - uses variables */
.custom-element {
  padding: 1rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

/* ❌ Avoid - hardcoded values */
.custom-element {
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
```

---

See also:
- [Theming](./THEMING.md)
- [Components](./COMPONENTS.md)
- [API Reference](./API_REFERENCE.md)
