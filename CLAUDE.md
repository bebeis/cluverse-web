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

No test framework is set up.

## Tech Stack

- **Next.js 16.1.6** with App Router (not Pages Router)
- **React 19** with TypeScript (strict mode)
- **CSS Modules** for all styling (scoped `.module.css` files)
- **lucide-react** for icons
- **pnpm** as package manager

## Environment

- `NEXT_PUBLIC_API_BASE_URL` - Backend API URL (default: `http://localhost:8080`)
- `NEXT_PUBLIC_USE_MOCK` - When `true`, enables mock data fallback on API failure

## Architecture

### Route Groups

- `(auth)/` - Login, onboarding flows
- `(main)/` - Primary feed layout with 3-column structure (Header + LeftAside + Content + RightAside)
- `(group)/` - Group detail, management, recruitment
- `(settings)/` - User settings pages
- `(notifications)/` - Notification center
- `(thread)/` - Comment/thread views
- `(editor)/` - Post creation
- `(explore)/` - Community/group exploration
- `(admin)/` - Admin dashboard

### Component Structure

```
src/components/
├── layout/     # Header, LeftAside, RightAside
├── ui/         # Reusable components (Button, Avatar, Badge, PostCard, etc.)
└── report/     # Content reporting modal
```

### Data Fetching

All data fetching is **client-side** using `fetch()` in `useEffect` hooks — no server components with data fetching, no API service layer.

- Auth token stored in `localStorage` under `accessToken`, passed as `Bearer ${token}` header
- SSR-safe token access: `typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null`
- Every API call has an inline mock data fallback (logs a console warning when used)
- No middleware.ts — no server-side auth guards

```tsx
// Typical data fetching pattern
useEffect(() => {
  const fetchData = async () => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`${API_BASE_URL}/api/v1/...`, { headers });
      if (!res.ok) throw new Error('...');
      setData(await res.json());
    } catch {
      console.warn('API 연동 실패로 Mock 데이터를 반환합니다.');
      setData(mockFallback);
    }
  };
  fetchData();
}, []);
```

### State Management

React hooks only (`useState`, `useEffect`) — no Context, Redux, or Zustand. All state is local to components.

### Key Patterns

1. **CSS Modules**: Every component has a paired `.module.css` file
   ```tsx
   import styles from './Component.module.css'
   <div className={styles.container}>
   ```

2. **Client Components**: Use `'use client'` directive for interactive components (most pages and components are client components)

3. **Component Variants**: Button/Badge/Avatar support `variant` and `size` props

4. **Path Alias**: Use `@/*` to import from `src/*`
   ```tsx
   import { Button } from '@/components/ui/Button'
   ```

5. **Route Detection**: Use `usePathname()` for active route styling and conditional layout rendering (e.g., hiding sidebars on `/messages`)

6. **Mock Data**: Every page/component has inline mock data arrays as API fallback

7. **Navigation**: Mix of `useRouter().push()` and `<Link>` — prefer `<Link>` for new code

## Conventions

- Korean content/labels, English code identifiers
- Functional components only (no class components)
- Interface-based prop typing
- Mobile-first responsive design (BottomNav for mobile, sidebars for desktop)
- Breakpoints: `640px` (sm), `1024px` (lg)
