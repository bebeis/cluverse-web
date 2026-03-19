'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bookmark, Heart, MessageCircle, UserCog } from 'lucide-react';
import { AuthRequiredOverlay } from '@/components/ui/AuthRequiredOverlay';
import { ApiError, cluverseApi, FeedPost, formatRelativeTime } from '@/lib/cluverse-api';
import { isLoggedIn } from '@/lib/auth';
import styles from './Following.module.css';

const scopeMap: Record<string, string> = {
  all: 'ALL',
  posts: 'POST',
  comments: 'COMMENT',
  likes: 'LIKE',
};

export default function FollowingFeedPage() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'posts' | 'comments' | 'likes'>('all');
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [authRequired, setAuthRequired] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      setAuthRequired(true);
      return;
    }
    cluverseApi.getFollowingFeed(scopeMap[activeFilter], 20)
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
        <div className={styles.titleBlock}>
          <h1 className={styles.pageTitle}>팔로잉 피드</h1>
          <p className={styles.pageDesc}>팔로우한 사용자의 최근 활동을 `/api/v1/feeds/following` 기준으로 불러옵니다.</p>
        </div>
        <button className={styles.manageBtn} type="button">
          <UserCog size={18} />
          <span>팔로우 관리</span>
        </button>
      </div>

      <div className={styles.filters}>
        {[
          { key: 'all', label: '전체 활동' },
          { key: 'posts', label: '새 게시글' },
          { key: 'comments', label: '댓글 활동' },
          { key: 'likes', label: '좋아요한 글' },
        ].map(filter => (
          <button
            key={filter.key}
            className={`${styles.filterBtn} ${activeFilter === filter.key ? styles.filterBtnActive : ''}`}
            onClick={() => setActiveFilter(filter.key as typeof activeFilter)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className={styles.feed}>
        {posts.map(post => (
          <Link key={post.postId} href={`/post/${post.postId}`} className={styles.card}>
            <div className={styles.authorRow}>
              <div className={styles.author}>
                <div className={styles.avatarWrap}>
                  {post.author.profileImageUrl ? (
                    <img className={styles.avatar} src={post.author.profileImageUrl} alt={post.author.nickname} />
                  ) : (
                    <div className={styles.avatar} />
                  )}
                </div>
                <div className={styles.authorInfo}>
                  <div className={styles.authorName}>
                    <h3>{post.isAnonymous ? '익명' : post.author.nickname}</h3>
                    <span className={styles.schoolTag}>{post.board.name}</span>
                  </div>
                  <div className={styles.authorMeta}>
                    <span>{formatRelativeTime(post.createdAt)}</span>
                    <span>·</span>
                    <span>{post.category}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.bodyText}>
              <h3>{post.title}</h3>
              <p>{post.contentPreview || post.content}</p>
            </div>

            {post.thumbnailImageUrl ? <img className={styles.bodyImage} src={post.thumbnailImageUrl} alt="" /> : null}

            <div className={styles.actionsBar}>
              <div className={styles.actionsLeft}>
                <span className={styles.actionBtn}>
                  <Heart size={18} /> <span>{post.likeCount}</span>
                </span>
                <span className={styles.actionBtn}>
                  <MessageCircle size={18} /> <span>{post.commentCount}</span>
                </span>
              </div>
              <span className={styles.shareBtn}>
                <Bookmark size={18} fill={post.bookmarked ? 'currentColor' : 'none'} />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {!posts.length ? <div className={styles.loader}>표시할 팔로잉 활동이 없습니다.</div> : null}
    </AuthRequiredOverlay>
  );
}
