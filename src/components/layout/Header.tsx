'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Bell, MessageCircle, GraduationCap } from 'lucide-react';
import styles from './Header.module.css';

const navLinks = [
  { href: '/', label: '홈', exact: true },
  { href: '/explore/community', label: '관심', exact: false },
  { href: '/explore/major', label: '학과', exact: false },
  { href: '/explore/groups', label: '그룹', exact: false },
  { href: '/event', label: '이벤트', exact: false },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Logo and Title */}
        <Link href="/" className={styles.leftContainer}>
          <div className={styles.logoIcon} suppressHydrationWarning>
            <GraduationCap size={18} strokeWidth={2.5} />
          </div>
          <h1 className={styles.title}>Cluverse</h1>
        </Link>

        {/* Search Bar */}
        <div className={styles.centerContainer}>
          <div 
            className={styles.searchWrapper}
            onClick={() => alert('검색 기능은 준비 중입니다.')}
          >
            <div className={styles.searchIcon}>
              <Search size={16} />
            </div>
            <input 
              className={styles.searchInput} 
              placeholder="관심사, 학교, 모임 검색" 
              type="text"
              readOnly
            />
          </div>
        </div>

        {/* Right Section */}
        <div className={styles.rightContainer}>
          <nav className={styles.navLinks}>
            {navLinks.map(link => {
              const isActive = link.exact ? pathname === link.href : pathname?.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <Link href="/notifications" className={styles.iconBtn}>
            <Bell size={20} />
            <span className={styles.badge}></span>
          </Link>
          
          <Link href="/messages" className={styles.iconBtn}>
            <MessageCircle size={20} />
          </Link>
          
          <Link href="/settings/profile" className={styles.profileWrapper}>
            <img 
              alt="User Profile" 
              className={styles.profileImg} 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHeKp5Uew-jj2oA5kn632aeUx7BEWgEFk_2eIZBuoHfnKnpZNDUjvbniBTjsrvn2C9BCc69WAEr0x2D_ZoBmXEdy76dh-W7VdK7Wqq4tZ2__0dPUGhtvK3Lhq4eRLOHpN38tYU7JKB-JDnTeX3q5zT5aIrYu72XZp531Sm7aAxj66dyQsUKE3iOTVgZeeD-2LN7XFapW2Ipwh2UMk-8dqzuLHaDU-3A4Yl9b85UP-_jIe2vkyE-pnqXyUG0IV1pdNKGIheQmbr573X"
            />
          </Link>
        </div>
      </div>
    </header>
  );
}
