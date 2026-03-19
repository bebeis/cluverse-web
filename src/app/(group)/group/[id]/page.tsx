'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Users, MapPin, Calendar, SquarePen, Eye, MessageCircle, Heart, Pin, Lock } from 'lucide-react';
import { AuthRequiredOverlay } from '@/components/ui/AuthRequiredOverlay';
import { cluverseApi, FeedPost, GroupDetail, formatRelativeTime } from '@/lib/cluverse-api';
import styles from './GroupDetail.module.css';

export default function GroupDetailPage() {
  const params = useParams<{ id: string }>();
  const groupId = Number(params.id);
  const [group, setGroup] = useState<GroupDetail | null>(null);
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [authRequired, setAuthRequired] = useState(false);

  useEffect(() => {
    if (!groupId) {
      return;
    }

    cluverseApi.getGroup(groupId)
      .then(async groupData => {
        setGroup(groupData);
        setAuthRequired(false);
        try {
          const boardPosts = await cluverseApi.getPosts({ boardId: groupData.boardId, sort: 'LATEST', page: 1, size: 10 });
          setPosts(boardPosts.posts);
        } catch {
          setPosts([]);
        }
      })
      .catch(() => {
        setGroup(null);
        setPosts([]);
        setAuthRequired(true);
      });
  }, [groupId]);

  if (!group) {
    return (
      <AuthRequiredOverlay active={authRequired}>
        <div className={styles.gridLayout} style={{ minHeight: 320 }} />
      </AuthRequiredOverlay>
    );
  }

  const pinnedPost = posts.find(post => post.isPinned);
  const normalPosts = posts.filter(post => !post.isPinned);

  return (
    <AuthRequiredOverlay active={authRequired}>
      <div className={styles.hero}>
        <div className={styles.heroCover} style={{ backgroundImage: `url('${group.coverImageUrl || '/images/groups/photography-club-cover.png'}')` }} />
        <div className={styles.heroGradient} />
        <div className={styles.heroContent}>
          <div className={styles.heroInfo}>
            <div className={styles.heroTags}>
              {group.interests.map(interest => (
                <span key={interest.interestId} className={styles.heroTag}>#{interest.name}</span>
              ))}
            </div>
            <h1 className={styles.heroTitle}>{group.name}</h1>
            <div className={styles.heroMeta}>
              <span className={styles.heroMetaItem}><Users size={18} /> 멤버 {group.memberCount}명</span>
              <span className={styles.heroMetaItem}><MapPin size={18} /> {group.region}</span>
              <span className={styles.heroMetaItem}><Calendar size={18} /> {group.activityType}</span>
            </div>
          </div>
          {group.recruiting ? (
            <Link href={`/group/${group.groupId}/apply`} className={styles.applyBtn}>
              <div className={styles.applyBtnDot} />
              지원하기
              {group.openRecruitmentCount > 1 && (
                <span style={{ fontSize: 12, fontWeight: 600, opacity: 0.85 }}>
                  {group.openRecruitmentCount}개 공고
                </span>
              )}
            </Link>
          ) : (
            <div className={styles.closedBadge}>
              <Lock size={15} />
              현재 모집 없음
            </div>
          )}
        </div>
      </div>

      <div className={styles.gridLayout}>
        <div className={styles.mainCol}>
          {pinnedPost ? (
            <div className={styles.pinnedSection}>
              <div className={styles.pinnedLabel}>
                <Pin size={16} style={{ color: '#4051B5' }} />
                <span>필독 공지사항</span>
              </div>
              <Link href={`/post/${pinnedPost.postId}`} className={styles.noticeCard}>
                <div className={styles.noticeAccent} />
                <div className={styles.noticeHeader}>
                  <div className={styles.noticeHeaderLeft}>
                    <span className={styles.noticeBadge}>{pinnedPost.category}</span>
                    <span className={styles.noticeDate}>{formatRelativeTime(pinnedPost.createdAt)}</span>
                  </div>
                </div>
                <h3 className={styles.noticeTitle}>{pinnedPost.title}</h3>
                <p className={styles.noticeBody}>{pinnedPost.contentPreview || pinnedPost.content}</p>
                <div className={styles.noticeMeta}>
                  <span className={styles.metaItem}><Eye size={14} /> {pinnedPost.viewCount}</span>
                  <span className={styles.metaItem}><MessageCircle size={14} /> {pinnedPost.commentCount}</span>
                </div>
              </Link>
            </div>
          ) : null}

          <div className={styles.postList}>
            {normalPosts.map(post => (
              <Link key={post.postId} href={`/post/${post.postId}`} className={styles.postCard}>
                <div className={styles.postRow}>
                  <div className={styles.postContent}>
                    <div className={styles.postAuthor}>
                      <div className={styles.postAuthorAvatar} />
                      <span className={styles.postAuthorName}>{post.isAnonymous ? '익명' : post.author.nickname}</span>
                      <span className={styles.postAuthorTime}>• {formatRelativeTime(post.createdAt)}</span>
                    </div>
                    <h4 className={styles.postTitle}>{post.title}</h4>
                    <p className={styles.postExcerpt}>{post.contentPreview || post.content}</p>
                  </div>
                </div>
                <div className={styles.postFooter}>
                  <div className={styles.postFooterLeft}>
                    <span className={styles.postFooterItem}><Heart size={14} /> {post.likeCount}</span>
                    <span className={styles.postFooterItem}><MessageCircle size={14} /> {post.commentCount}</span>
                  </div>
                  <span className={styles.postFooterViews}><Eye size={14} /> {post.viewCount}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AuthRequiredOverlay>
  );
}
