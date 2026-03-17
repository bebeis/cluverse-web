'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Eye, Heart, MessageCircle } from 'lucide-react';
import { cluverseApi, BoardRef, FeedPost, formatRelativeTime } from '@/lib/cluverse-api';
import styles from './Board.module.css';

export default function BoardPage() {
  const params = useParams<{ slug: string }>();
  const [board, setBoard] = useState<BoardRef | null>(null);
  const [posts, setPosts] = useState<FeedPost[]>([]);

  useEffect(() => {
    cluverseApi.getBoards({ keyword: decodeURIComponent(params.slug), activeOnly: true })
      .then(async result => {
        const matched = result.boards.find(item => item.name === decodeURIComponent(params.slug)) || result.boards[0] || null;
        if (!matched) {
          return;
        }
        setBoard(matched);
        const list = await cluverseApi.getPosts({ boardId: matched.boardId, sort: 'LATEST', page: 1, size: 20 });
        setPosts(list.posts);
      })
      .catch(() => {
        setBoard(null);
        setPosts([]);
      });
  }, [params.slug]);

  return (
    <>
      <div className={styles.filterBox}>
        <div className={styles.filterRow}>
          <div>
            <h2>{board?.name || '게시판'}</h2>
            <p>{board ? `${board.boardType} 보드` : '보드를 찾는 중입니다.'}</p>
          </div>
        </div>
      </div>

      <div className={styles.postList}>
        {posts.map(post => (
          <Link key={post.postId} href={`/post/${post.postId}`} className={styles.postItem}>
            <div className={styles.postTop}>
              <span className={styles.postBadge}>{post.category}</span>
              <span className={styles.postTime}>{formatRelativeTime(post.createdAt)}</span>
            </div>
            <h3 className={styles.postTitle}>{post.title}</h3>
            <p className={styles.postExcerpt}>{post.contentPreview}</p>
            <div className={styles.postFooter}>
              <div className={styles.postAuthor}>
                <div className={styles.avatarInitial}>
                  {(post.isAnonymous ? '익' : post.author.nickname.charAt(0)) || 'C'}
                </div>
                <span className={styles.authorName}>{post.isAnonymous ? '익명' : post.author.nickname}</span>
                <span className={styles.postAuthorDivider}>|</span>
                <div className={styles.postStats}>
                  <span className={styles.postStat}><Eye size={14} /> {post.viewCount}</span>
                  <span className={styles.postStat}><Heart size={14} /> {post.likeCount}</span>
                  <span className={`${styles.postStat} ${styles.postStatPrimary}`}><MessageCircle size={14} /> {post.commentCount}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
