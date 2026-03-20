'use client';

import React, { useEffect, useState } from 'react';
import { Bookmark } from 'lucide-react';
import { AuthRequiredOverlay } from '@/components/ui/AuthRequiredOverlay';
import { PostCard } from '@/components/ui/PostCard';
import { ApiError, cluverseApi, mapPostCard } from '@/lib/cluverse-api';
import styles from './Bookmarks.module.css';

export default function BookmarksPage() {
  const [posts, setPosts] = useState<ReturnType<typeof mapPostCard>[]>([]);
  const [authRequired, setAuthRequired] = useState(false);

  useEffect(() => {
    cluverseApi.getBookmarks()
      .then(data => {
        setPosts(data.posts.map(mapPostCard));
        setAuthRequired(false);
      })
      .catch(caught => {
        setPosts([]);
        setAuthRequired(caught instanceof ApiError && caught.statusCode === 401);
      });
  }, []);

  return (
    <AuthRequiredOverlay active={authRequired}>
      <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerIcon}>
          <Bookmark size={24} color="#3B82F6" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className={styles.title}>관심 게시글</h1>
          <p className={styles.subtitle}>북마크한 게시글 목록입니다.</p>
        </div>
      </header>

      <div className={styles.feedContainer}>
        {posts.map(post => (
          <PostCard key={post.id} {...post} />
        ))}
        {posts.length === 0 ? <div className={styles.emptyState}>아직 북마크된 게시글이 없습니다.</div> : null}
      </div>
      </div>
    </AuthRequiredOverlay>
  );
}
