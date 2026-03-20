'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './Explore.module.css';
import {
  MessageSquare,
  GraduationCap,
  Users,
  ChevronRight,
  Search,
  Heart,
  MessageCircle,
} from 'lucide-react';
import { cluverseApi, FeedPost, formatRelativeTime } from '@/lib/cluverse-api';
import { PostModal } from '@/components/ui/PostModal';

const exploreCards = [
  {
    title: '커뮤니티',
    desc: '자유롭게 의견을 나누고, 질문하고, 정보를 공유하세요. 다양한 주제의 게시판으로 구성되어 있습니다.',
    icon: <MessageSquare size={24} />,
    color: '#22C55E',
    href: '/explore/community',
    meta: '오늘 128개의 새 게시글',
  },
  {
    title: '학과 탐색',
    desc: '관심 있는 학과를 찾아 전공별 게시판에서 학과 정보, 진로 고민, 수업 후기를 확인하세요.',
    icon: <GraduationCap size={24} />,
    color: '#4F46E5',
    href: '/explore/major',
    meta: '54개 학과 등록됨',
  },
  {
    title: '그룹 탐색',
    desc: '프로젝트, 동아리, 스터디 그룹을 찾고 참여하세요. 같은 관심사를 가진 동료를 만나보세요.',
    icon: <Users size={24} />,
    color: '#F59E0B',
    href: '/explore/groups',
    meta: '현재 32개 그룹 모집 중',
  },
];

const stats = [
  { number: '2,480', label: '활성 사용자' },
  { number: '156', label: '등록된 그룹' },
  { number: '12,340', label: '전체 게시글' },
  { number: '54', label: '등록 학과' },
];

export default function ExplorePage() {
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<FeedPost[]>([]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  const handleSearch = async () => {
    if (!keyword.trim()) return;
    setSearching(true);
    setSearched(true);
    try {
      const data = await cluverseApi.searchPosts({ keyword: keyword.trim(), page: 1, size: 20 });
      setSearchResults(data.posts);
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>탐색하기</h1>
          <p className={styles.heroSubtitle}>
            Cluverse에서 커뮤니티, 학과, 그룹을 탐색하고 새로운 사람들과 연결되세요.
          </p>
        </div>
      </section>

      {/* Post Search */}
      <section>
        <h2 className={styles.sectionTitle}>게시글 검색</h2>
        <div className={styles.searchBox}>
          <div className={styles.searchInputWrap}>
            <Search size={18} className={styles.searchIcon} />
            <input
              className={styles.searchInput}
              placeholder="키워드로 게시글 검색..."
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
            />
          </div>
          <button className={styles.searchBtn} onClick={handleSearch} disabled={searching || !keyword.trim()} type="button">
            {searching ? '검색 중...' : '검색'}
          </button>
        </div>

        {searched && (
          <div className={styles.searchResults}>
            {searching ? (
              <p className={styles.searchEmpty}>검색 중...</p>
            ) : searchResults.length === 0 ? (
              <p className={styles.searchEmpty}>검색 결과가 없습니다.</p>
            ) : searchResults.map(post => (
              <button
                key={post.postId}
                className={styles.searchResultItem}
                onClick={() => setSelectedPostId(post.postId)}
                type="button"
              >
                <div className={styles.searchResultTitle}>{post.title}</div>
                <div className={styles.searchResultContent}>{post.contentPreview}</div>
                <div className={styles.searchResultMeta}>
                  <span>{post.isAnonymous ? '익명' : post.author.nickname}</span>
                  <span><Heart size={12} /> {post.likeCount}</span>
                  <span><MessageCircle size={12} /> {post.commentCount}</span>
                  <span>{formatRelativeTime(post.createdAt)}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Category Navigation */}
      <section>
        <h2 className={styles.sectionTitle}>카테고리</h2>
        <div className={styles.grid}>
          {exploreCards.map(c => (
            <Link key={c.title} href={c.href} className={styles.card}>
              <div className={styles.cardIcon} style={{ background: c.color }}>
                {c.icon}
              </div>
              <div>
                <h3 className={styles.cardTitle}>{c.title}</h3>
                <p className={styles.cardDesc}>{c.desc}</p>
              </div>
              <div className={styles.cardMeta}>
                {c.meta} <ChevronRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick Stats */}
      <section>
        <h2 className={styles.sectionTitle}>Cluverse 현황</h2>
        <div className={styles.statsRow}>
          {stats.map(s => (
            <div key={s.label} className={styles.statCard}>
              <div className={styles.statNumber}>{s.number}</div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <PostModal postId={selectedPostId} onClose={() => setSelectedPostId(null)} />
    </div>
  );
}
