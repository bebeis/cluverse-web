'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight, Eye, GraduationCap, Heart, Layers3, MessageCircle, Pencil, Sparkles } from 'lucide-react';
import { PostInlineView } from '@/components/ui/PostInlineView';
import { cluverseApi, FeedPost, MajorNode, formatRelativeTime } from '@/lib/cluverse-api';
import { stripHtml } from '@/lib/html-utils';
import styles from './MajorExplore.module.css';

export default function MajorExplorePage() {
  const [rootMajors, setRootMajors] = useState<MajorNode[]>([]);
  const [childrenByParent, setChildrenByParent] = useState<Record<number, MajorNode[]>>({});
  const [selectedMajorId, setSelectedMajorId] = useState<number | null>(null);
  const [expandedRootId, setExpandedRootId] = useState<number | null>(null);
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [treeLoading, setTreeLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  useEffect(() => {
    const fetchTree = async () => {
      const roots = [...await cluverseApi.getMajors()].sort((a, b) => a.displayOrder - b.displayOrder);
      const nextChildren: Record<number, MajorNode[]> = {};

      const walk = async (nodes: MajorNode[]) => {
        await Promise.all(nodes.map(async node => {
          const children = [...await cluverseApi.getMajors(node.majorId)].sort((a, b) => a.displayOrder - b.displayOrder);
          if (children.length) {
            nextChildren[node.majorId] = children;
            await walk(children);
          }
        }));
      };

      await walk(roots);
      return { roots, nextChildren };
    };

    fetchTree()
      .then(({ roots, nextChildren }) => {
        setRootMajors(roots);
        setChildrenByParent(nextChildren);
        setSelectedMajorId(roots[0]?.majorId ?? null);
        setExpandedRootId(roots[0]?.majorId ?? null);
        setPostsLoading(!!roots[0]?.boardId);
      })
      .catch(() => {
        setRootMajors([]);
        setChildrenByParent({});
        setSelectedMajorId(null);
        setExpandedRootId(null);
        setPosts([]);
        setLoadError('전공 트리를 불러오지 못했습니다.');
      })
      .finally(() => {
        setTreeLoading(false);
      });
  }, []);

  const majorMap = useMemo(() => {
    const map = new Map<number, MajorNode>();
    rootMajors.forEach(major => map.set(major.majorId, major));
    Object.values(childrenByParent).flat().forEach(major => map.set(major.majorId, major));
    return map;
  }, [childrenByParent, rootMajors]);

  const selectedMajor = selectedMajorId ? majorMap.get(selectedMajorId) || null : null;

  useEffect(() => {
    if (!selectedMajor?.boardId) {
      return;
    }

    cluverseApi.getPosts({ boardId: selectedMajor.boardId, sort: 'LATEST', page: 1, size: 20 })
      .then(result => setPosts(result.posts))
      .catch(() => setPosts([]))
      .finally(() => setPostsLoading(false));
  }, [selectedMajor]);

  const renderChildLinks = (parentId: number, level = 0): React.ReactNode => {
    const children = childrenByParent[parentId] || [];

    return children.map(child => (
      <React.Fragment key={child.majorId}>
        <button
          className={selectedMajorId === child.majorId ? styles.subLinkActive : styles.subLink}
          type="button"
          onClick={() => {
            setPostsLoading(true);
            setSelectedPostId(null);
            setSelectedMajorId(child.majorId);
            const topRootId = level === 0 ? parentId : expandedRootId;
            if (topRootId) {
              setExpandedRootId(topRootId);
            }
          }}
          style={{ ['--major-indent' as string]: `${level}` }}
        >
          <span className={styles.subLinkLine} />
          <span>{child.name}</span>
        </button>
        {renderChildLinks(child.majorId, level + 1)}
      </React.Fragment>
    ));
  };

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.introCard}>
          <div className={styles.introEyebrow}>
            <Sparkles size={14} />
            Major Discover
          </div>
          <h1 className={styles.sideTitle}>학과 탐색</h1>
          <p className={styles.sideSubtitle}>전공 계층에서 보드를 고르고, 해당 학과 커뮤니티의 최신 글을 한 화면에서 확인합니다.</p>
          <div className={styles.introMeta}>
            <div className={styles.introMetaItem}>
              <span className={styles.introMetaLabel}>루트 전공</span>
              <strong>{rootMajors.length}</strong>
            </div>
            <div className={styles.introMetaItem}>
              <span className={styles.introMetaLabel}>선택 보드</span>
              <strong>{selectedMajor?.boardId ?? '-'}</strong>
            </div>
          </div>
        </div>

        <div className={styles.indexCard}>
          <div className={styles.indexHeader}>
            <div>
              <p className={styles.indexEyebrow}>Major Index</p>
              <h2 className={styles.indexTitle}>전공별 탐색</h2>
            </div>
            <div className={styles.indexBadge}>
              <Layers3 size={14} />
              {majorMap.size}
            </div>
          </div>
          {loadError ? <p className={styles.indexError}>{loadError}</p> : null}
          {treeLoading ? <p className={styles.indexHint}>전공 목록을 불러오는 중입니다.</p> : null}
          {rootMajors.map(major => {
            const children = childrenByParent[major.majorId] || [];
            const isSelected = selectedMajorId === major.majorId || expandedRootId === major.majorId;
            const isExpanded = expandedRootId === major.majorId;

            return (
              <div key={major.majorId} className={styles.accordionItem}>
                <button
                  className={styles.accordionHeader}
                  type="button"
                  onClick={() => {
                    setPostsLoading(true);
                    setSelectedPostId(null);
                    setSelectedMajorId(major.majorId);
                    setExpandedRootId(current => (current === major.majorId ? null : major.majorId));
                  }}
                >
                  <div className={styles.accordionLeft}>
                    <div className={isSelected ? styles.accordionIconActive : styles.accordionIcon}>
                      <GraduationCap size={18} />
                    </div>
                    <div className={styles.accordionTextWrap}>
                      <span className={styles.accordionKicker}>{major.depth === 1 ? 'Faculty' : 'Department'}</span>
                      <span className={isSelected ? styles.accordionName : styles.accordionNameInactive}>{major.name}</span>
                    </div>
                  </div>
                  {children.length ? <ChevronDown size={18} className={isExpanded ? styles.accordionChevronOpen : styles.accordionChevron} /> : null}
                </button>
                {children.length && isExpanded ? (
                  <div className={styles.accordionBody}>{renderChildLinks(major.majorId)}</div>
                ) : null}
              </div>
            );
          })}
        </div>

      </aside>

      <section className={styles.main}>
        <nav className={styles.breadcrumbs}>
          <Link href="/explore">탐색</Link>
          <ChevronRight size={14} />
          <span className={styles.breadcrumbActive}>학과</span>
        </nav>

        <div className={styles.heroPanel}>
          <div className={styles.heroCopy}>
            <p className={styles.heroEyebrow}>Selected Major</p>
            <h1>{selectedMajor?.name || '학과 게시판'}</h1>
            <p className={styles.heroDescription}>
              {selectedMajor
                ? `${selectedMajor.depth === 1 ? '상위 전공' : '세부 전공'} 보드입니다. majorId ${selectedMajor.majorId}, boardId ${selectedMajor.boardId} 기준으로 최신 글을 조회합니다.`
                : '왼쪽에서 전공을 선택하면 연결된 게시판을 바로 확인할 수 있습니다.'}
            </p>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>depth</span>
              <strong>{selectedMajor?.depth ?? '-'}</strong>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>majorId</span>
              <strong>{selectedMajor?.majorId ?? '-'}</strong>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>boardId</span>
              <strong>{selectedMajor?.boardId ?? '-'}</strong>
            </div>
          </div>
        </div>

        {selectedPostId ? (
          <PostInlineView postId={selectedPostId} onBack={() => setSelectedPostId(null)} />
        ) : (
          <>
            <div className={styles.sectionHeader}>
              <div>
                <p className={styles.sectionEyebrow}>Recent Posts</p>
                <h2 className={styles.sectionTitle}>최신 글</h2>
              </div>
              <div className={styles.sectionHeaderRight}>
                <p className={styles.sectionHint}>{postsLoading ? '게시글을 불러오는 중입니다.' : '선택한 전공 보드의 최신순 목록입니다.'}</p>
                {selectedMajor?.boardId ? (
                  <Link href={`/post/create?boardId=${selectedMajor.boardId}`} className={styles.writeBtn}>
                    <Pencil size={14} />
                    글쓰기
                  </Link>
                ) : null}
              </div>
            </div>

            <div className={styles.postList}>
              {!postsLoading && posts.length === 0 ? (
                <div className={styles.emptyCard}>
                  <h3>표시할 게시글이 없습니다</h3>
                  <p>선택한 전공 보드에 아직 글이 없거나 조회에 실패했습니다.</p>
                </div>
              ) : null}
              {posts.map(post => (
                <div key={post.postId} onClick={() => setSelectedPostId(post.postId)} className={styles.postCard} style={{ cursor: 'pointer' }}>
                  <div className={styles.postHeader}>
                    <span className={styles.postCategory}>{post.category}</span>
                    <span className={styles.postTime}>{formatRelativeTime(post.createdAt)}</span>
                  </div>
                  <h3 className={styles.postTitle}>{post.title}</h3>
                  <p className={styles.postPreview}>{stripHtml(post.contentPreview || post.content || '') || '본문 미리보기가 없습니다.'}</p>
                  <div className={styles.postFooter}>
                    <span className={styles.postAuthor}>{post.isAnonymous ? '익명' : post.author.nickname}</span>
                    <span className={styles.postAction}><Eye size={14} /> {post.viewCount}</span>
                    <span className={styles.postAction}><Heart size={14} /> {post.likeCount}</span>
                    <span className={styles.postAction}><MessageCircle size={14} /> {post.commentCount}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
