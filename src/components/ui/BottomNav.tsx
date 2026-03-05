'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './BottomNav.module.css';

import { Home, Compass, Users, Bell, User } from 'lucide-react';

interface NavItem {
  id: string;
  href: string;
  label: string;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
}

const navItems: NavItem[] = [
  { id: 'home', href: '/', label: '홈', icon: <Home size={22} strokeWidth={2} />, activeIcon: <Home size={22} strokeWidth={2.5} fill="#0F172A" /> },
  { id: 'explore', href: '/explore', label: '탐색', icon: <Compass size={22} strokeWidth={2} />, activeIcon: <Compass size={22} strokeWidth={2.5} fill="#0F172A" /> },
  { id: 'groups', href: '/groups', label: '그룹', icon: <Users size={22} strokeWidth={2} />, activeIcon: <Users size={22} strokeWidth={2.5} fill="#0F172A" /> },
  { id: 'notifications', href: '/notifications', label: '알림', icon: <Bell size={22} strokeWidth={2} />, activeIcon: <Bell size={22} strokeWidth={2.5} fill="#0F172A" /> },
  { id: 'my', href: '/settings/profile', label: '마이', icon: <User size={22} strokeWidth={2} />, activeIcon: <User size={22} strokeWidth={2.5} fill="#0F172A" /> },
];

export const BottomNav: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className={styles.bottomNav}>
      {navItems.map((item) => {
        // Simple active check: if pathname starts with the href (except for home, which must match exactly)
        const isActive = item.href === '/' ? pathname === '/' : pathname?.startsWith(item.href);
        return (
          <Link
            key={item.id}
            href={item.href}
            className={`${styles.navItem} ${isActive ? styles.active : ''}`}
          >
            <span className={styles.icon}>{isActive ? item.activeIcon : item.icon}</span>
            <span className={styles.label}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
