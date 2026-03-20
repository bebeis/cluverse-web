'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight, Eye, Heart, Layers3, MessageCircle, Sparkles } from 'lucide-react';
import { PostModal } from '@/components/ui/PostModal';
import { cluverseApi, FeedPost, InterestNode, formatRelativeTime } from '@/lib/cluverse-api';
import styles from './CommunityExplore.module.css';

export default function CommunityExplorePage() {
  const [interests, setInterests] = useState<InterestNode[]>([]);
  const [selectedInterestId, setSelectedInterestId] = useState<number | null>(null);
  const [expandedRootId, setExpandedRootId] = useState<number | null>(null);
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [treeLoading, setTreeLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  useEffect(() => {
    cluverseApi.getInterests()
      .then(result => {
        const sorted = [...result].sort((a, b) => a.displayOrder - b.displayOrder);
        setInterests(sorted);
        const firstRoot = sorted.find(item => item.parentId === null || item.parentId === 0) ?? sorted[0] ?? null;
        setSelectedInterestId(firstRoot?.interestId ?? null);
        setExpandedRootId(firstRoot?.interestId ?? null);
        setPostsLoading(!!firstRoot?.boardId);
      })
      .catch(() => {
        setInterests([]);
        setSelectedInterestId(null);
        setExpandedRootId(null);
        setPosts([]);
        setLoadError('관심사 트리를 불러오지 못했습니다.');
      })
      .finally(() => {
        setTreeLoading(false);
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
      .catch(() => setPosts([]))
      .finally(() => setPostsLoading(false));
  }, [selectedInterest]);

  const renderChildLinks = (parentId: number, level = 0): React.ReactNode => {
    const children = childrenByParent.get(parentId) || [];

    return children.map(child => (
      <React.Fragment key={child.interestId}>
        <button
          type="button"
          className={selectedInterestId === child.interestId ? styles.subLinkActive : styles.subLink}
          onClick={() => {
            setPostsLoading(true);
            setSelectedInterestId(child.interestId);
            const topRootId = level === 0 ? parentId : expandedRootId;
            if (topRootId) {
              setExpandedRootId(topRootId);
            }
          }}
          style={{ ['--interest-indent' as string]: `${level}` }}
        >
          <span className={styles.subLinkLine} />
          <span>{child.name}</span>
        </button>
        {renderChildLinks(child.interestId, level + 1)}
      </React.Fragment>
    ));
  };

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.introCard}>
          <div className={styles.introEyebrow}>
            <Sparkles size={14} />
            Community Discover
          </div>
          <h1 className={styles.sideTitle}>관심사 탐색</h1>
          <p className={styles.sideSubtitle}>관심사 트리에서 보드를 고르고, 연결된 게시글을 바로 읽는 구조로 정리했습니다.</p>
          <div className={styles.introMeta}>
            <div className={styles.introMetaItem}>
              <span className={styles.introMetaLabel}>루트 그룹</span>
              <strong>{rootInterests.length}</strong>
            </div>
            <div className={styles.introMetaItem}>
              <span className={styles.introMetaLabel}>선택 보드</span>
              <strong>{selectedInterest?.boardId ?? '-'}</strong>
            </div>
          </div>
        </div>

        <div className={styles.indexCard}>
          <div className={styles.indexHeader}>
            <div>
              <p className={styles.indexEyebrow}>Interest Index</p>
              <h2 className={styles.indexTitle}>그룹별 탐색</h2>
            </div>
            <div className={styles.indexBadge}>
              <Layers3 size={14} />
              {interests.length}
            </div>
          </div>
          {loadError ? <p className={styles.indexError}>{loadError}</p> : null}
          {treeLoading ? <p className={styles.indexHint}>관심사 목록을 불러오는 중입니다.</p> : null}
          {rootInterests.map(interest => {
            const children = childrenByParent.get(interest.interestId) || [];
            const isSelected = selectedInterestId === interest.interestId || expandedRootId === interest.interestId;
            const isExpanded = expandedRootId === interest.interestId;

            return (
              <div key={interest.interestId} className={styles.accordionItem}>
                <button
                  className={styles.accordionHeader}
                  type="button"
                  onClick={() => {
                    setPostsLoading(true);
                    setSelectedInterestId(interest.interestId);
                    setExpandedRootId(current => (current === interest.interestId ? null : interest.interestId));
                  }}
                >
                  <div className={styles.accordionLeft}>
                    <div className={isSelected ? styles.accordionIconActive : styles.accordionIcon}>
                      {String(interest.displayOrder + 1).padStart(2, '0')}
                    </div>
                    <div className={styles.accordionTextWrap}>
                      <span className={styles.accordionKicker}>{interest.category}</span>
                      <span className={isSelected ? styles.accordionName : styles.accordionNameInactive}>{interest.name}</span>
                    </div>
                  </div>
                  {children.length ? <ChevronDown size={18} className={isExpanded ? styles.accordionChevronOpen : styles.accordionChevron} /> : null}
                </button>
                {children.length && isExpanded ? <div className={styles.accordionBody}>{renderChildLinks(interest.interestId)}</div> : null}
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

        <div className={styles.heroPanel}>
          <div className={styles.heroCopy}>
            <p className={styles.heroEyebrow}>Selected Board</p>
            <h1>{selectedInterest?.name || '관심사 커뮤니티'}</h1>
            <p className={styles.heroDescription}>
              {selectedInterest
                ? `${selectedInterest.category} 카테고리의 보드입니다. boardId ${selectedInterest.boardId} 기준으로 최근 글을 불러옵니다.`
                : '왼쪽에서 관심사를 선택하면 연결된 게시판을 바로 확인할 수 있습니다.'}
            </p>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>카테고리</span>
              <strong>{selectedInterest?.category || '-'}</strong>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>게시글</span>
              <strong>{posts.length}</strong>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>boardId</span>
              <strong>{selectedInterest?.boardId ?? '-'}</strong>
            </div>
          </div>
        </div>

        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionEyebrow}>Recent Posts</p>
            <h2 className={styles.sectionTitle}>최신 글</h2>
          </div>
          <p className={styles.sectionHint}>{postsLoading ? '게시글을 불러오는 중입니다.' : '선택한 보드의 최신순 목록입니다.'}</p>
        </div>

        <div className={styles.postList}>
          {!postsLoading && posts.length === 0 ? (
            <div className={styles.emptyCard}>
              <h3>표시할 게시글이 없습니다</h3>
              <p>선택한 관심사 보드에 아직 글이 없거나 조회에 실패했습니다.</p>
            </div>
          ) : null}
          {posts.map(post => (
            <div key={post.postId} onClick={() => setSelectedPostId(post.postId)} className={styles.postCard} style={{ cursor: 'pointer' }}>
              <div className={styles.postHeader}>
                <span className={styles.postCategory}>{post.category}</span>
                <span className={styles.postTime}>{formatRelativeTime(post.createdAt)}</span>
              </div>
              <h3 className={styles.postTitle}>{post.title}</h3>
              <p className={styles.postPreview}>{post.contentPreview || post.content || '본문 미리보기가 없습니다.'}</p>
              <div className={styles.postFooter}>
                <span className={styles.postAuthor}>{post.isAnonymous ? '익명' : post.author.nickname}</span>
                <span className={styles.postAction}><Eye size={14} /> {post.viewCount}</span>
                <span className={styles.postAction}><Heart size={14} /> {post.likeCount}</span>
                <span className={styles.postAction}><MessageCircle size={14} /> {post.commentCount}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
      <PostModal postId={selectedPostId} onClose={() => setSelectedPostId(null)} />
    </div>
  );
}
