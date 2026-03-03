'use client';

import React from 'react';
import styles from './BottomNav.module.css';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  activeIcon: string;
}

const navItems: NavItem[] = [
  { id: 'home', label: '홈', icon: '🏠', activeIcon: '🏡' },
  { id: 'explore', label: '탐색', icon: '🔍', activeIcon: '🔎' },
  { id: 'groups', label: '그룹', icon: '👥', activeIcon: '🫂' },
  { id: 'notifications', label: '알림', icon: '🔔', activeIcon: '🔔' },
  { id: 'my', label: '마이', icon: '👤', activeIcon: '👤' },
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
