'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  User,
  Shield,
  Bell,
  Globe,
  GraduationCap,
  Ban,
  LogOut,
} from 'lucide-react';
import styles from './layout.module.css';
import { cluverseApi } from '@/lib/cluverse-api';
import { clearLoggedIn } from '@/lib/auth';

const navItems = [
  { href: '/settings/profile', icon: User, label: '내 프로필' },
  { href: '/settings/privacy', icon: Shield, label: '개인정보 보호' },
  { href: '/settings/major-tags', icon: GraduationCap, label: '전공 및 태그' },
  { href: '/settings/blocked', icon: Ban, label: '차단 관리' },
  { divider: true },
  { href: '#', icon: Bell, label: '알림 설정' },
  { href: '#', icon: Globe, label: '언어 및 지역' },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await cluverseApi.logout();
    } catch {
      // 서버 오류여도 클라이언트 상태는 초기화
    } finally {
      clearLoggedIn();
      router.replace('/login');
    }
  };

  return (
    <div className={styles.settingsWrapper}>
      {/* Sidebar Nav */}
      <nav className={styles.settingsNav}>
        <div className={styles.navLabel}>설정</div>
        {navItems.map((item, i) => {
          if ('divider' in item) {
            return <div key={`div-${i}`} className={styles.navDivider} />;
          }
          const Icon = item.icon!;
          const isActive = pathname === item.href;
          const uniqueKey = item.href === '#' ? `hash-${item.label}` : item.href;
          return (
            <Link
              key={uniqueKey}
              href={item.href!}
              className={isActive ? styles.navItemActive : styles.navItem}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
        <div className={styles.navDivider} />
        <button className={styles.navLogout} onClick={handleLogout} type="button">
          <LogOut size={16} />
          로그아웃
        </button>
      </nav>

      {/* Page Content */}
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}
