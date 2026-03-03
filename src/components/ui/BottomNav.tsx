'use client';

import React from 'react';
import styles from './BottomNav.module.css';

import { Home, Compass, Users, Bell, User } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
}

const navItems: NavItem[] = [
  { id: 'home', label: '홈', icon: <Home size={22} strokeWidth={2} />, activeIcon: <Home size={22} strokeWidth={2.5} fill="#0F172A" /> },
  { id: 'explore', label: '탐색', icon: <Compass size={22} strokeWidth={2} />, activeIcon: <Compass size={22} strokeWidth={2.5} fill="#0F172A" /> },
  { id: 'groups', label: '그룹', icon: <Users size={22} strokeWidth={2} />, activeIcon: <Users size={22} strokeWidth={2.5} fill="#0F172A" /> },
  { id: 'notifications', label: '알림', icon: <Bell size={22} strokeWidth={2} />, activeIcon: <Bell size={22} strokeWidth={2.5} fill="#0F172A" /> },
  { id: 'my', label: '마이', icon: <User size={22} strokeWidth={2} />, activeIcon: <User size={22} strokeWidth={2.5} fill="#0F172A" /> },
];

export interface BottomNavProps {
  activeTab: string;
  onTabChange: (id: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className={styles.bottomNav}>
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            onClick={() => onTabChange(item.id)}
          >
            <span className={styles.icon}>{isActive ? item.activeIcon : item.icon}</span>
            <span className={styles.label}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
