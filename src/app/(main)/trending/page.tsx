'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { stripHtml } from '@/lib/html-utils';
import { User, Heart, MessageCircle, Bookmark } from 'lucide-react';
import { AuthRequiredOverlay } from '@/components/ui/AuthRequiredOverlay';
import { ApiError, cluverseApi, FeedPost, formatRelativeTime } from '@/lib/cluverse-api';
import styles from './Trending.module.css';

const categoryMap: Record<string, string> = {
  all: 'ALL',
  question: 'QUESTION',
  info: 'INFORMATION',
  chat: 'GENERAL',
  career: 'CAREER',
};

export default function TrendingPage() {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [authRequired, setAuthRequired] = useState(false);

  useEffect(() => {
    cluverseApi.getTrendingPosts('DAY_7', categoryMap[activeFilter])
      .then(result => {
        setPosts(result.posts);
        setAuthRequired(false);
      })
      .catch(caught => {
        setPosts([]);
        setAuthRequired(caught instanceof ApiError && caught.statusCode === 401);
      });
  }, [activeFilter]);

  return (
    <AuthRequiredOverlay active={authRequired}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>트렌딩</h1>
        <p className={styles.pageDesc}>`/api/v1/posts/trending` 결과를 기준으로 정렬합니다.</p>
      </div>

      <div className={styles.filters}>
        {['all', 'question', 'info', 'chat', 'career'].map(filter => (
          <button
            key={filter}
            className={`${styles.filterBtn} ${activeFilter === filter ? styles.filterBtnActive : ''}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter === 'all' ? '전체' : filter === 'question' ? '질문' : filter === 'info' ? '정보' : filter === 'chat' ? '자유수다' : '취업/진로'}
          </button>
        ))}
      </div>

      <div className={styles.trendList}>
        {posts.map((post, index) => (
          <Link key={post.postId} href={`/post/${post.postId}`} className={styles.trendItem}>
            <div className={styles.rankBadge}>
              <div className={`${styles.rankNum} ${index < 3 ? styles.rankTop : styles.rankNormal}`}>{index + 1}</div>
            </div>
            <div className={styles.trendContent}>
              <div className={styles.metaRow}>
                <span className={styles.categoryBadge}>{post.category}</span>
                <span className={styles.metaTime}>{formatRelativeTime(post.createdAt)}</span>
              </div>
              <h3 className={styles.trendTitle}>{post.title}</h3>
              <p className={styles.trendExcerpt}>{stripHtml(post.contentPreview ?? '')}</p>
              <div className={styles.statsRow}>
                <div className={styles.statsLeft}>
                  <span className={styles.statIcon}><User size={14} /> {post.isAnonymous ? '익명' : post.author.nickname}</span>
                  <span className={styles.statIcon}><Heart size={14} /> {post.likeCount}</span>
                  <span className={styles.statIcon}><MessageCircle size={14} /> {post.commentCount}</span>
                </div>
                <span className={styles.bookmarkBtn}>
                  <Bookmark size={18} fill={post.bookmarked ? 'currentColor' : 'none'} />
                </span>
              </div>
            </div>
            {post.thumbnailImageUrl ? (
              <div className={styles.trendThumb}>
                <img src={post.thumbnailImageUrl} alt="" />
              </div>
            ) : null}
          </Link>
        ))}
      </div>
    </AuthRequiredOverlay>
  );
}
