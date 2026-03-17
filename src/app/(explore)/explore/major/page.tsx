'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronDown, Star, PenLine, Eye, Heart, MessageCircle, Lightbulb, Cpu } from 'lucide-react';
import { cluverseApi, FeedPost, formatRelativeTime } from '@/lib/cluverse-api';
import styles from './MajorExplore.module.css';

type ExploreBoard = {
  boardId: number;
  name: string;
  description: string;
  depth?: number;
};

export default function MajorExplorePage() {
  const router = useRouter();
  const [boards, setBoards] = useState<ExploreBoard[]>([]);
  const [selectedBoardId, setSelectedBoardId] = useState<number | null>(null);
  const [posts, setPosts] = useState<FeedPost[]>([]);

  useEffect(() => {
    cluverseApi.getBoards({ type: 'DEPARTMENT', depth: 2, activeOnly: true })
      .then(result => {
        setBoards(result.boards);
        setSelectedBoardId(result.boards[0]?.boardId ?? null);
      })
      .catch(() => {
        setBoards([]);
        setSelectedBoardId(null);
      });
  }, []);

  useEffect(() => {
    if (!selectedBoardId) {
      return;
    }
    cluverseApi.getPosts({ boardId: selectedBoardId, sort: 'LATEST', page: 1, size: 20 })
      .then(result => setPosts(result.posts))
      .catch(() => setPosts([]));
  }, [selectedBoardId]);

  const selectedBoard = boards.find(board => board.boardId === selectedBoardId) || null;

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div>
          <h1 className={styles.sideTitle}>학과 탐색</h1>
          <p className={styles.sideSubtitle}>`/api/v1/boards?type=DEPARTMENT` 결과입니다.</p>
        </div>

        <div className={styles.accordionList}>
          {boards.map(board => (
            <div key={board.boardId} className={styles.accordionItem}>
              <button className={styles.accordionHeader} type="button" onClick={() => setSelectedBoardId(board.boardId)}>
                <div className={styles.accordionLeft}>
                  <div
                    className={styles.accordionIcon}
                    style={{ background: selectedBoardId === board.boardId ? '#4f46e5' : '#F3F4F6', color: selectedBoardId === board.boardId ? 'white' : '#6B7280' }}
                  >
                    <Cpu size={18} />
                  </div>
                  <span className={selectedBoardId === board.boardId ? styles.accordionName : styles.accordionNameInactive}>
                    {board.name}
                  </span>
                </div>
                <ChevronDown size={18} className={styles.accordionChevron} />
              </button>
            </div>
          ))}
        </div>

        <div className={styles.tipCard}>
          <div className={styles.tipTitle}>
            <Lightbulb size={16} />
            학과 보드 탐색
          </div>
          <p className={styles.tipDesc}>선택한 보드의 실제 게시글은 `/api/v1/posts?boardId=...`로 가져옵니다.</p>
          <button className={styles.tipBtn} onClick={() => selectedBoardId && router.push(`/board/${encodeURIComponent(selectedBoard?.name || '')}`)}>
            보드 열기
          </button>
        </div>
      </aside>

      <section className={styles.main}>
        <div className={styles.boardHeader}>
          <div className={styles.boardTopRow}>
            <div className={styles.boardTitleWrap}>
              <div className={styles.boardTitleRow}>
                <h1 className={styles.boardTitle}>{selectedBoard?.name || '학과 게시판'}</h1>
                <button className={styles.starBtn}>
                  <Star size={24} />
                </button>
              </div>
              <p className={styles.boardDesc}>{selectedBoard?.description || '보드를 선택하세요.'}</p>
            </div>
            <button className={styles.writeBtn} onClick={() => router.push('/write')}>
              <PenLine size={18} />
              글쓰기
            </button>
          </div>
        </div>

        <div className={styles.postList}>
          {posts.map(post => (
            <Link key={post.postId} href={`/post/${post.postId}`} className={styles.postCard}>
              <div className={styles.postHeader}>
                <span className={styles.badge}>{post.category}</span>
                <span className={styles.postTime}>{formatRelativeTime(post.createdAt)}</span>
              </div>
              <h3 className={styles.postTitle}>{post.title}</h3>
              <p className={styles.postPreview}>{post.contentPreview}</p>
              <div className={styles.postMeta}>
                <span>{post.isAnonymous ? '익명' : post.author.nickname}</span>
                <div className={styles.postStats}>
                  <span><Eye size={14} /> {post.viewCount}</span>
                  <span><Heart size={14} /> {post.likeCount}</span>
                  <span><MessageCircle size={14} /> {post.commentCount}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
