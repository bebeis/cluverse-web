'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronDown, Star, PenLine, Eye, Heart, MessageCircle, Lightbulb, Cpu } from 'lucide-react';
import { cluverseApi, FeedPost, MajorNode, formatRelativeTime } from '@/lib/cluverse-api';
import styles from './MajorExplore.module.css';

export default function MajorExplorePage() {
  const router = useRouter();
  const [rootMajors, setRootMajors] = useState<MajorNode[]>([]);
  const [childrenByParent, setChildrenByParent] = useState<Record<number, MajorNode[]>>({});
  const [selectedMajorId, setSelectedMajorId] = useState<number | null>(null);
  const [posts, setPosts] = useState<FeedPost[]>([]);

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
      })
      .catch(() => {
        setRootMajors([]);
        setChildrenByParent({});
        setSelectedMajorId(null);
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
      .catch(() => setPosts([]));
  }, [selectedMajor]);

  const renderChildLinks = (parentId: number, level = 0): React.ReactNode => {
    const children = childrenByParent[parentId] || [];

    return children.map(child => (
      <React.Fragment key={child.majorId}>
        <button
          className={selectedMajorId === child.majorId ? styles.subLinkActive : styles.subLink}
          type="button"
          onClick={() => setSelectedMajorId(child.majorId)}
          style={{ paddingLeft: `${64 + level * 16}px` }}
        >
          {child.name}
        </button>
        {renderChildLinks(child.majorId, level + 1)}
      </React.Fragment>
    ));
  };

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div>
          <h1 className={styles.sideTitle}>학과 탐색</h1>
          <p className={styles.sideSubtitle}>`/api/v1/majors` 트리에서 선택한 전공의 `boardId`로 게시글을 조회합니다.</p>
        </div>

        <div className={styles.accordionList}>
          {rootMajors.map(major => {
            const children = childrenByParent[major.majorId] || [];
            const isSelected = selectedMajorId === major.majorId;

            return (
              <div key={major.majorId} className={styles.accordionItem}>
                <button className={styles.accordionHeader} type="button" onClick={() => setSelectedMajorId(major.majorId)}>
                  <div className={styles.accordionLeft}>
                    <div
                      className={styles.accordionIcon}
                      style={{ background: isSelected ? '#4f46e5' : '#F3F4F6', color: isSelected ? 'white' : '#6B7280' }}
                    >
                      <Cpu size={18} />
                    </div>
                    <span className={isSelected ? styles.accordionName : styles.accordionNameInactive}>
                      {major.name}
                    </span>
                  </div>
                  {children.length ? <ChevronDown size={18} className={styles.accordionChevron} /> : null}
                </button>
                {children.length ? (
                  <div className={styles.accordionBody}>{renderChildLinks(major.majorId)}</div>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className={styles.tipCard}>
          <div className={styles.tipTitle}>
            <Lightbulb size={16} />
            전공 보드 탐색
          </div>
          <p className={styles.tipDesc}>전공 엔티티가 가진 `boardId`로 실제 게시글을 조회합니다.</p>
          <button className={styles.tipBtn} onClick={() => selectedMajor && router.push(`/board/${encodeURIComponent(selectedMajor.name)}`)}>
            보드 열기
          </button>
        </div>
      </aside>

      <section className={styles.main}>
        <div className={styles.boardHeader}>
          <div className={styles.boardTopRow}>
            <div className={styles.boardTitleWrap}>
              <div className={styles.boardTitleRow}>
                <h1 className={styles.boardTitle}>{selectedMajor?.name || '학과 게시판'}</h1>
                <button className={styles.starBtn}>
                  <Star size={24} />
                </button>
              </div>
              <p className={styles.boardDesc}>{selectedMajor ? `majorId ${selectedMajor.majorId} · boardId ${selectedMajor.boardId}` : '전공을 선택하세요.'}</p>
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
