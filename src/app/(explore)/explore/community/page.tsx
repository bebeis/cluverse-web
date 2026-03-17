'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Eye, Heart, MessageCircle, Filter, Rss, Cpu } from 'lucide-react';
import { cluverseApi, FeedPost, formatRelativeTime } from '@/lib/cluverse-api';
import styles from './CommunityExplore.module.css';

type ExploreBoard = {
  boardId: number;
  name: string;
  description: string;
  depth?: number;
};

export default function CommunityExplorePage() {
  const [boards, setBoards] = useState<ExploreBoard[]>([]);
  const [selectedBoardId, setSelectedBoardId] = useState<number | null>(null);
  const [posts, setPosts] = useState<FeedPost[]>([]);

  useEffect(() => {
    cluverseApi.getBoards({ type: 'INTEREST', depth: 2, activeOnly: true })
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
          <h1 className={styles.sideTitle}>관심사 탐색</h1>
          <p className={styles.sideSubtitle}>`/api/v1/boards?type=INTEREST` 결과입니다.</p>
        </div>

        <div className={styles.accordionList}>
          {boards.map(board => (
            <button
              key={board.boardId}
              className={styles.accordionItem}
              type="button"
              onClick={() => setSelectedBoardId(board.boardId)}
            >
              <div className={styles.accordionHeader}>
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
              </div>
            </button>
          ))}
        </div>
      </aside>

      <section className={styles.main}>
        <nav className={styles.breadcrumbs}>
          <Link href="/explore">탐색</Link>
          <ChevronRight size={14} />
          <span className={styles.breadcrumbActive}>커뮤니티</span>
        </nav>

        <div className={styles.titleSection}>
          <div className={styles.titleWrap}>
            <h1>{selectedBoard?.name || '커뮤니티 게시판'}</h1>
            <p>{selectedBoard?.description || '보드를 선택하면 실제 게시글 목록을 불러옵니다.'}</p>
          </div>
          <div className={styles.titleActions}>
            <button className={styles.filterBtn}>
              <Filter size={16} />
              최신순
            </button>
            <button className={styles.followingBtn}>
              <Rss size={16} />
              관심 보드
            </button>
          </div>
        </div>

        <div className={styles.postList}>
          {posts.map(post => (
            <Link key={post.postId} href={`/post/${post.postId}`} className={styles.postCard}>
              <div className={styles.postMeta}>
                <span className={styles.postAuthor}>{post.isAnonymous ? '익명' : post.author.nickname}</span>
                <span className={styles.postTime}>{formatRelativeTime(post.createdAt)}</span>
              </div>
              <h3 className={styles.postTitle}>{post.title}</h3>
              <p className={styles.postPreview}>{post.contentPreview}</p>
              <div className={styles.postFooter}>
                <span className={styles.postAction}><Eye size={14} /> {post.viewCount}</span>
                <span className={styles.postAction}><Heart size={14} /> {post.likeCount}</span>
                <span className={styles.postAction}><MessageCircle size={14} /> {post.commentCount}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
