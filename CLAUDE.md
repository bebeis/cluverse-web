# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cluverse is a campus social platform built with Next.js 16 App Router. The platform features feeds, groups, messaging, events, and user settings.

## Commands

```bash
pnpm dev      # Start development server (port 3000)
pnpm build    # Production build
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

## Tech Stack

- **Next.js 16.1.6** with App Router (not Pages Router)
- **React 19** with TypeScript (strict mode)
- **CSS Modules** for all styling (scoped `.module.css` files)
- **lucide-react** for icons
- **pnpm** as package manager

## Architecture

### Route Groups

The app uses Next.js route groups for logical organization:

- `(auth)/` - Login, onboarding flows
- `(main)/` - Primary feed layout with 3-column structure (Header + LeftAside + Content + RightAside)
- `(group)/` - Group detail, management, recruitment
- `(settings)/` - User settings pages
- `(notifications)/` - Notification center
- `(thread)/` - Comment/thread views
- `(editor)/` - Post creation

### Component Structure

```
src/components/
├── layout/     # Header, LeftAside, RightAside
├── ui/         # Reusable components (Button, Avatar, Badge, PostCard, etc.)
└── report/     # Content reporting modal
```

### Key Patterns

1. **CSS Modules**: Every component has a paired `.module.css` file
   ```tsx
   import styles from './Component.module.css'
   <div className={styles.container}>
   ```

2. **Client Components**: Use `'use client'` directive for interactive components

3. **Component Variants**: Button/Badge/Avatar support `variant` and `size` props

4. **Path Alias**: Use `@/*` to import from `src/*`
   ```tsx
   import { Button } from '@/components/ui/Button'
   ```

5. **Route Detection**: Use `usePathname()` for active route styling

6. **Mock Data**: Components currently use inline mock data arrays

## Conventions

- Korean content/labels, English code identifiers
- Functional components only (no class components)
- Interface-based prop typing
- Mobile-first responsive design (BottomNav for mobile, sidebars for desktop)
