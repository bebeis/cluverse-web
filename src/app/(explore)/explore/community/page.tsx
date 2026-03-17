'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Eye, Heart, MessageCircle, Filter, Rss, Cpu, ChevronDown } from 'lucide-react';
import { cluverseApi, FeedPost, InterestNode, formatRelativeTime } from '@/lib/cluverse-api';
import styles from './CommunityExplore.module.css';

export default function CommunityExplorePage() {
  const [interests, setInterests] = useState<InterestNode[]>([]);
  const [selectedInterestId, setSelectedInterestId] = useState<number | null>(null);
  const [posts, setPosts] = useState<FeedPost[]>([]);

  useEffect(() => {
    cluverseApi.getInterests()
      .then(result => {
        const sorted = [...result].sort((a, b) => a.displayOrder - b.displayOrder);
        setInterests(sorted);
        setSelectedInterestId(sorted[0]?.interestId ?? null);
      })
      .catch(() => {
        setInterests([]);
        setSelectedInterestId(null);
      });
  }, []);

  const childrenByParent = useMemo(() => {
    const grouped = new Map<number | null, InterestNode[]>();
    interests.forEach(interest => {
      const current = grouped.get(interest.parentId) || [];
      current.push(interest);
      current.sort((a, b) => a.displayOrder - b.displayOrder);
      grouped.set(interest.parentId, current);
    });
    return grouped;
  }, [interests]);

  const rootInterests = childrenByParent.get(null) || childrenByParent.get(0) || interests.filter(item => item.parentId === null);
  const selectedInterest = interests.find(interest => interest.interestId === selectedInterestId) || null;

  useEffect(() => {
    if (!selectedInterest?.boardId) {
      return;
    }

    cluverseApi.getPosts({ boardId: selectedInterest.boardId, sort: 'LATEST', page: 1, size: 20 })
      .then(result => setPosts(result.posts))
      .catch(() => setPosts([]));
  }, [selectedInterest]);

  const renderChildLinks = (parentId: number, level = 0): React.ReactNode => {
    const children = childrenByParent.get(parentId) || [];

    return children.map(child => (
      <React.Fragment key={child.interestId}>
        <button
          type="button"
          className={selectedInterestId === child.interestId ? styles.subLinkActive : styles.subLink}
          onClick={() => setSelectedInterestId(child.interestId)}
          style={{ paddingLeft: `${64 + level * 16}px` }}
        >
          {child.name}
        </button>
        {renderChildLinks(child.interestId, level + 1)}
      </React.Fragment>
    ));
  };

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div>
          <h1 className={styles.sideTitle}>관심사 탐색</h1>
          <p className={styles.sideSubtitle}>`/api/v1/interests` 트리에서 선택한 관심사의 `boardId`로 게시글을 조회합니다.</p>
        </div>

        <div className={styles.accordionList}>
          {rootInterests.map(interest => {
            const children = childrenByParent.get(interest.interestId) || [];
            const isSelected = selectedInterestId === interest.interestId;

            return (
              <div key={interest.interestId} className={styles.accordionItem}>
                <button className={styles.accordionHeader} type="button" onClick={() => setSelectedInterestId(interest.interestId)}>
                  <div className={styles.accordionLeft}>
                    <div
                      className={styles.accordionIcon}
                      style={{ background: isSelected ? '#4f46e5' : '#F3F4F6', color: isSelected ? 'white' : '#6B7280' }}
                    >
                      <Cpu size={18} />
                    </div>
                    <span className={isSelected ? styles.accordionName : styles.accordionNameInactive}>
                      {interest.name}
                    </span>
                  </div>
                  {children.length ? <ChevronDown size={18} className={styles.accordionChevron} /> : null}
                </button>
                {children.length ? <div className={styles.accordionBody}>{renderChildLinks(interest.interestId)}</div> : null}
              </div>
            );
          })}
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
            <h1>{selectedInterest?.name || '관심사 커뮤니티'}</h1>
            <p>{selectedInterest ? `${selectedInterest.category} 카테고리 · boardId ${selectedInterest.boardId}` : '관심사를 선택하세요.'}</p>
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
