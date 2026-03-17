'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Heart, Users, Calendar, Rss } from 'lucide-react';
import styles from './LeftAside.module.css';

const fetchProfile = async () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
  const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

  const mockData = {
    nickname: "김지민",
    university: { universityName: "서울대학교" },
    majorName: "경영학과", 
    entranceYear: "21",    
    followerCount: 156,
    followingCount: 48,
    postCount: 12,         
    profileImageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDdBndDe9racyM19P48JQ5X6OywzRIAc6bw57vuse3CQ99eQn8XM4ECt20Xf17N-VmGFcspypoP-uVM4sZKGC6HmNHy0mcWpwWSt8BbYohBpiIw51SCqrkawkwcdXhmZVHTifExPdQZj_mA_Ope_kSH1VYpghQp3mzHZI_ppgNDCItporJHDW6CTKh15X9_tljq6yVaHtdvdsUA7tOKsUQucsE0x3Az2Wg3s4xnfpFfjRnYv8qKSdStQCz2duibUnqLGA4WFcbGJ1lW"
  };

  if (USE_MOCK) return mockData;

  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/members/me/profile`);
    if (!res.ok) throw new Error('API request failed');
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.warn("API 연동 실패로 Mock 데이터를 반환합니다.", error);
    return mockData;
  }
};

export default function LeftAside() {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetchProfile().then(data => setProfile(data));
  }, []);

  if (!profile) return <aside className={styles.container}></aside>;

  return (
    <aside className={styles.container}>
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
          <p className={styles.schoolInfo}>{profile.university?.universityName || "알 수 없는 학교"} · {profile.majorName || "알 수 없는 학과"} {profile.entranceYear || "??"}학번</p>
          
          <div className={styles.statsRow}>
            <div className={styles.statItem}>
              <p className={styles.statLabel}>게시글</p>
              <p className={styles.statValue}>{profile.postCount || 0}</p>
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
    </aside>
  );
}
