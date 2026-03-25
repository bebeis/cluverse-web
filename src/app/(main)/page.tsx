'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PenTool, Flame, MessageSquare, Music, BookOpen, ShoppingBag } from 'lucide-react';
import { AuthRequiredOverlay } from '@/components/ui/AuthRequiredOverlay';
import { PostCard } from '@/components/ui/PostCard';
import { PostModal } from '@/components/ui/PostModal';
import { ApiError, cluverseApi, mapPostCard } from '@/lib/cluverse-api';
import { isLoggedIn } from '@/lib/auth';
import styles from './HomePage.module.css';

const filters = [
  { key: 'ALL', label: '전체', icon: null },
  { key: 'RECOMMENDED', label: '추천', icon: <Flame size={16} className={styles.tagIcon} /> },
  { key: 'SUBSCRIBED', label: '구독', icon: <MessageSquare size={16} className={styles.tagIcon} /> },
];

export default function HomePage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [posts, setPosts] = useState<ReturnType<typeof mapPostCard>[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [authRequired, setAuthRequired] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!isLoggedIn()) {
        if (!cancelled) setAuthRequired(true);
        return;
      }
      try {
        const feed = await cluverseApi.getHomeFeed(activeFilter, 20);
        if (!cancelled) {
          setPosts(feed.posts.map(mapPostCard));
          setError(null);
          setAuthRequired(false);
        }
      } catch (caught) {
        if (!cancelled) {
          setAuthRequired(caught instanceof ApiError && caught.statusCode === 401);
          setError(caught instanceof Error ? caught.message : '피드를 불러오지 못했습니다.');
        }
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [activeFilter]);

  return (
    <AuthRequiredOverlay active={authRequired}>
      <div className={styles.bannerGroup}>
        <div className={styles.bannerContent}>
          <h2 className={styles.bannerHeadline}>오늘의 캠퍼스 라이프, <br />Cluverse에서 시작하세요!</h2>
          <p className={styles.bannerSubline}>관심사 기반 커뮤니티, 동아리, 학과 정보를 한 곳에서</p>
          <div className={styles.bannerBtnsRow}>
            <Link href="/explore/groups" className={styles.btnSolid}>동아리 찾기</Link>
            <Link href="/trending" className={styles.btnGlass}>트렌딩 보기</Link>
          </div>
        </div>
        <div className={styles.glowTopRight} />
        <div className={styles.glowBottomRight} />
      </div>

      <div className={styles.tagsContainer}>
        {filters.map(filter => (
          <button
            key={filter.key}
            className={`${styles.tagBtn} ${activeFilter === filter.key ? styles.tagBtnActive : ''}`}
            onClick={() => setActiveFilter(filter.key)}
          >
            {filter.icon}
            {filter.label}
          </button>
        ))}
        <button className={styles.tagBtn}><Music size={16} className={styles.tagIcon} /> 그룹</button>
        <button className={styles.tagBtn}><BookOpen size={16} className={styles.tagIcon} /> 정보</button>
        <button className={styles.tagBtn}><ShoppingBag size={16} className={styles.tagIcon} /> 장터</button>
      </div>

      {error ? <p style={{ color: '#b91c1c' }}>{error}</p> : null}

      <div className={styles.feedContainer}>
        {posts.map(post => (
          <PostCard
            key={post.id}
            {...post}
            onClick={() => setSelectedPostId(Number(post.id))}
          />
        ))}
      </div>

      <PostModal postId={selectedPostId} onClose={() => setSelectedPostId(null)} />

      <button className={styles.fabBtn} aria-label="글쓰기" onClick={() => router.push('/write')}>
        <PenTool size={24} />
      </button>
    </AuthRequiredOverlay>
  );
}
