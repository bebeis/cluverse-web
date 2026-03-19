'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Heart, Users, Calendar, Rss } from 'lucide-react';
import { AuthRequiredOverlay } from '@/components/ui/AuthRequiredOverlay';
import { ApiError, cluverseApi, Profile } from '@/lib/cluverse-api';
import { isLoggedIn } from '@/lib/auth';
import styles from './LeftAside.module.css';

export default function LeftAside() {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [authRequired, setAuthRequired] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      setAuthRequired(true);
      return;
    }
    cluverseApi.getMyProfile()
      .then(data => {
        setProfile(data);
        setAuthRequired(false);
      })
      .catch(caught => {
        setProfile(null);
        setAuthRequired(caught instanceof ApiError && caught.statusCode === 401);
      });
  }, []);

  if (!profile) {
    return (
      <aside className={styles.container}>
        <AuthRequiredOverlay active={authRequired} title="프로필 기능은 로그인 후 열립니다" description="내 프로필, 팔로잉, 북마크, 그룹 메뉴를 사용하려면 먼저 로그인해 주세요.">
          <div style={{ minHeight: 420 }} />
        </AuthRequiredOverlay>
      </aside>
    );
  }

  return (
    <aside className={styles.container}>
      <AuthRequiredOverlay active={authRequired} title="사이드바 기능은 로그인 후 사용 가능합니다" description="프로필 요약과 개인 메뉴는 인증된 사용자에게만 제공됩니다.">
        <div className={styles.box}>
          <div className={styles.profileCenter}>
            <div className={styles.avatarWrapper}>
              <img 
                alt="Profile" 
                className={styles.avatar}
                src={profile.profileImageUrl || "https://dummyimage.com/100x100/cccccc/ffffff.png&text=Profile"}
              />
              <div className={styles.onlineBadge}></div>
            </div>
            <h3 className={styles.name}>{profile.nickname}</h3>
            <p className={styles.schoolInfo}>{profile.university?.universityName || '학교 미등록'} · 공개 프로필 {profile.isPublic ? 'ON' : 'OFF'}</p>
            
            <div className={styles.statsRow}>
              <div className={styles.statItem}>
                <p className={styles.statLabel}>게시글</p>
                <p className={styles.statValue}>{profile.visibleFields.length}</p>
              </div>
              <div className={styles.divider}></div>
              <div className={styles.statItem}>
                <p className={styles.statLabel}>팔로잉</p>
                <p className={styles.statValue}>{profile.followingCount || 0}</p>
              </div>
              <div className={styles.divider}></div>
              <div className={styles.statItem}>
                <p className={styles.statLabel}>팔로워</p>
                <p className={styles.statValue}>{profile.followerCount || 0}</p>
              </div>
            </div>
            
            <button className={styles.editBtn} onClick={() => router.push('/settings/profile')}>내 정보 수정</button>
          </div>
        </div>

        <div className={styles.menuBox}>
          <ul className={styles.menuList}>
            <li>
              <Link href="/" className={`${styles.menuItem} ${pathname === '/' ? styles.menuItemActive : ''}`}>
                <Home size={20} />
                홈 피드
              </Link>
            </li>
            <li>
              <Link href="/following" className={`${styles.menuItem} ${pathname?.startsWith('/following') ? styles.menuItemActive : ''}`}>
                <Rss size={20} />
                팔로잉 피드
              </Link>
            </li>
            <li>
              <Link href="/bookmarks" className={`${styles.menuItem} ${pathname?.startsWith('/bookmarks') ? styles.menuItemActive : ''}`}>
                <Heart size={20} />
                관심 게시글
              </Link>
            </li>
            <li>
              <Link href="/groups" className={`${styles.menuItem} ${pathname?.startsWith('/groups') ? styles.menuItemActive : ''}`}>
                <Users size={20} />
                내 동아리
              </Link>
            </li>
            <li>
              <Link href="/calendar" className={`${styles.menuItem} ${pathname?.startsWith('/calendar') ? styles.menuItemActive : ''}`}>
                <Calendar size={20} />
                내 일정
              </Link>
            </li>
          </ul>
        </div>
      </AuthRequiredOverlay>
    </aside>
  );
}
