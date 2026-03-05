'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './layout.module.css';
import {
  LayoutDashboard, Users, FileText, Flag,
  BarChart3, Settings, Shield, LogOut,
  Search, Bell, HelpCircle, FolderTree,
} from 'lucide-react';

const navSections = [
  {
    label: '대시보드',
    items: [
      { href: '/admin', icon: <LayoutDashboard size={18} />, label: '개요' },
    ],
  },
  {
    label: '운영 관리',
    items: [
      { href: '/admin/users', icon: <Users size={18} />, label: '유저 관리' },
      { href: '/admin/content', icon: <FileText size={18} />, label: '콘텐츠 관리' },
      { href: '/admin/reports', icon: <Flag size={18} />, label: '신고 큐(Queue)', badge: 12 },
      { href: '/admin/groups', icon: <Users size={18} />, label: '그룹 관리' },
    ],
  },
  {
    label: '분석',
    items: [
      { href: '/admin/stats', icon: <BarChart3 size={18} />, label: '통계 지표' },
      { href: '/admin/settings', icon: <Settings size={18} />, label: '시스템 설정' },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <div className={styles.sidebarLogoIcon}>
            <Shield size={18} />
          </div>
          <span className={styles.sidebarLogoText}>Cluverse</span>
        </div>
        <div className={styles.sidebarLogoSub}>Admin</div>

        {navSections.map(section => (
          <div key={section.label} className={styles.navGroup}>
            <div className={styles.navGroupLabel}>{section.label}</div>
            {section.items.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={pathname === item.href ? styles.navItemActive : styles.navItem}
              >
                {item.icon}
                {item.label}
                {item.badge && <span className={styles.navBadge}>{item.badge}</span>}
              </Link>
            ))}
          </div>
        ))}

        <div className={styles.sidebarFooter}>
          <div className={styles.adminProfile}>
            <div className={styles.adminAvatar}>김</div>
            <div className={styles.adminInfo}>
              <div className={styles.adminName}>김관리</div>
              <div className={styles.adminRole}>Super Admin</div>
            </div>
          </div>
          <button className={styles.logoutBtn}>
            <LogOut size={16} />
            로그아웃
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className={styles.mainArea}>
        <header className={styles.topBar}>
          <div className={styles.searchBar}>
            <Search size={18} color="#9CA3AF" />
            <input
              className={styles.searchBarInput}
              placeholder="유저 ID, 게시글 키워드, 그룹명 검색..."
            />
          </div>
          <div className={styles.topBarActions}>
            <button className={styles.topBarBtn}>
              <Bell size={18} />
              <span className={styles.topBarBtnDot} />
            </button>
            <button className={styles.topBarBtn}>
              <HelpCircle size={18} />
            </button>
          </div>
        </header>

        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}
