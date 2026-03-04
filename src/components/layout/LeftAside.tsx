import React from 'react';
import Link from 'next/link';
import { Home, Heart, Users, Calendar, Rss } from 'lucide-react';
import styles from './LeftAside.module.css';

export default function LeftAside() {
  return (
    <aside className={styles.container}>
      <div className={styles.box}>
        <div className={styles.profileCenter}>
          <div className={styles.avatarWrapper}>
            <img 
              alt="Profile" 
              className={styles.avatar}
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdBndDe9racyM19P48JQ5X6OywzRIAc6bw57vuse3CQ99eQn8XM4ECt20Xf17N-VmGFcspypoP-uVM4sZKGC6HmNHy0mcWpwWSt8BbYohBpiIw51SCqrkawkwcdXhmZVHTifExPdQZj_mA_Ope_kSH1VYpghQp3mzHZI_ppgNDCItporJHDW6CTKh15X9_tljq6yVaHtdvdsUA7tOKsUQucsE0x3Az2Wg3s4xnfpFfjRnYv8qKSdStQCz2duibUnqLGA4WFcbGJ1lW"
            />
            <div className={styles.onlineBadge}></div>
          </div>
          <h3 className={styles.name}>김지민</h3>
          <p className={styles.schoolInfo}>서울대학교 · 경영학과 21학번</p>
          
          <div className={styles.statsRow}>
            <div className={styles.statItem}>
              <p className={styles.statLabel}>게시글</p>
              <p className={styles.statValue}>12</p>
            </div>
            <div className={styles.divider}></div>
            <div className={styles.statItem}>
              <p className={styles.statLabel}>팔로잉</p>
              <p className={styles.statValue}>48</p>
            </div>
            <div className={styles.divider}></div>
            <div className={styles.statItem}>
              <p className={styles.statLabel}>팔로워</p>
              <p className={styles.statValue}>156</p>
            </div>
          </div>
          
          <button className={styles.editBtn}>내 정보 수정</button>
        </div>
      </div>

      <div className={styles.menuBox}>
        <ul className={styles.menuList}>
          <li>
            <Link href="/" className={`${styles.menuItem} ${styles.menuItemActive}`}>
              <Home size={20} />
              홈 피드
            </Link>
          </li>
          <li>
            <Link href="/following" className={styles.menuItem}>
              <Rss size={20} />
              팔로잉 피드
            </Link>
          </li>
          <li>
            <Link href="/bookmarks" className={styles.menuItem}>
              <Heart size={20} />
              관심 게시글
            </Link>
          </li>
          <li>
            <Link href="/groups" className={styles.menuItem}>
              <Users size={20} />
              내 동아리
            </Link>
          </li>
          <li>
            <Link href="/calendar" className={styles.menuItem}>
              <Calendar size={20} />
              내 일정
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}
