'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Users, MapPin, Calendar, Eye, MessageCircle, Heart, Pin, Lock, SquarePen, Crown, Shield, User as UserIcon } from 'lucide-react';
import { AuthRequiredOverlay } from '@/components/ui/AuthRequiredOverlay';
import { cluverseApi, FeedPost, GroupDetail, GroupMember, formatRelativeTime } from '@/lib/cluverse-api';
import styles from './GroupDetail.module.css';

type Tab = '게시글' | '멤버';

const ROLE_LABEL: Record<string, string> = { OWNER: '운영자', ADMIN: '관리자', MEMBER: '멤버' };
const ROLE_ICON: Record<string, React.ReactNode> = {
  OWNER: <Crown size={13} />,
  ADMIN: <Shield size={13} />,
  MEMBER: <UserIcon size={13} />,
};

export default function GroupDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const groupId = Number(params.id);
  const [group, setGroup] = useState<GroupDetail | null>(null);
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [tab, setTab] = useState<Tab>('게시글');
  const [authRequired, setAuthRequired] = useState(false);

  useEffect(() => {
    if (!groupId) return;

    cluverseApi.getGroup(groupId)
      .then(async groupData => {
        setGroup(groupData);
        setAuthRequired(false);
        try {
          const boardPosts = await cluverseApi.getPosts({ boardId: groupData.boardId, sort: 'LATEST', page: 1, size: 20 });
          setPosts(boardPosts.posts);
        } catch {
          setPosts([]);
        }
        try {
          const memberList = await cluverseApi.getGroupMembers(groupId);
          setMembers(memberList);
        } catch {
          setMembers([]);
        }
      })
      .catch(() => {
        setGroup(null);
        setPosts([]);
        setMembers([]);
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
  const canWrite = group.member && group.boardId;

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
        {/* ── 메인 컬럼 ── */}
        <div className={styles.mainCol}>
          {canWrite && (
            <div className={styles.writeBox}>
              <div className={styles.writeBoxInner}>
                <div className={styles.writeBoxAvatar} />
                <div className={styles.writeBoxContent}>
                  <input
                    className={styles.writeBoxInput}
                    placeholder="이 그룹에 새 글을 작성해보세요..."
                    readOnly
                    onClick={() => router.push(`/post/create?boardId=${group.boardId}`)}
                  />
                  <div className={styles.writeBoxActions}>
                    <div className={styles.writeBoxMedia} />
                    <button
                      className={styles.writeBoxSubmit}
                      onClick={() => router.push(`/post/create?boardId=${group.boardId}`)}
                    >
                      <SquarePen size={14} style={{ marginRight: 6 }} />
                      글 작성
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className={styles.tabs}>
            {(['게시글', '멤버'] as Tab[]).map(t => (
              <button
                key={t}
                className={tab === t ? styles.tabActive : styles.tabInactive}
                onClick={() => setTab(t)}
              >
                {t}
                {t === '멤버' && <span style={{ marginLeft: 4, fontSize: 13, color: tab === '멤버' ? '#4051B5' : '#9CA3AF' }}>{group.memberCount}</span>}
              </button>
            ))}
          </div>

          {/* 게시글 탭 */}
          {tab === '게시글' && (
            <>
              {pinnedPost && (
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
              )}

              {normalPosts.length === 0 && !pinnedPost ? (
                <div style={{ background: 'white', borderRadius: 12, padding: '48px 24px', textAlign: 'center', border: '1px solid #E5E7EB' }}>
                  <p style={{ color: '#9CA3AF', fontSize: 14 }}>아직 게시글이 없습니다.</p>
                  {canWrite && (
                    <button
                      onClick={() => router.push(`/post/create?boardId=${group.boardId}`)}
                      style={{ marginTop: 16, padding: '8px 20px', borderRadius: 8, background: '#4051B5', color: 'white', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer' }}
                    >
                      첫 글 작성하기
                    </button>
                  )}
                </div>
              ) : (
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
                        {post.thumbnailImageUrl && (
                          <div className={styles.postThumb}>
                            <img src={post.thumbnailImageUrl} alt="" className={styles.postThumbImg} />
                          </div>
                        )}
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
              )}
            </>
          )}

          {/* 멤버 탭 */}
          {tab === '멤버' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {members.length === 0 ? (
                <p style={{ color: '#9CA3AF', fontSize: 14, padding: '24px 0' }}>멤버 정보를 불러올 수 없습니다.</p>
              ) : members.map(m => (
                <div key={m.memberId} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '14px 20px',
                  background: 'white',
                  borderRadius: 12,
                  border: `1px solid ${m.isMe ? 'rgba(64,81,181,0.3)' : '#E5E7EB'}`,
                  boxShadow: m.isMe ? '0 0 0 2px rgba(64,81,181,0.08)' : undefined,
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    overflow: 'hidden',
                  }}>
                    {m.profileImageUrl && <img src={m.profileImageUrl} alt={m.nickname} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontWeight: 700, fontSize: 14, color: '#111218' }}>{m.nickname}</span>
                      {m.isMe && <span style={{ fontSize: 11, fontWeight: 600, color: '#4051B5', background: '#EEF2FF', padding: '1px 6px', borderRadius: 4 }}>나</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2, fontSize: 12, color: '#6B7280' }}>
                      {ROLE_ICON[m.role]}
                      <span>{m.customTitle || ROLE_LABEL[m.role] || m.role}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: 11, color: '#9CA3AF', flexShrink: 0 }}>
                    {new Date(m.joinedAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'short' })} 가입
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── 사이드바 ── */}
        <div className={styles.sidebar}>
          {/* 그룹 소개 */}
          <div className={styles.sideCard}>
            <div className={styles.sideCardTitle}>그룹 소개</div>
            <p style={{ fontSize: 14, color: '#4B5563', lineHeight: 1.6, margin: '0 0 16px' }}>{group.description}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#6B7280' }}>
                <Calendar size={14} style={{ flexShrink: 0 }} />
                <span>{group.activityType}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#6B7280' }}>
                <MapPin size={14} style={{ flexShrink: 0 }} />
                <span>{group.region}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#6B7280' }}>
                <Users size={14} style={{ flexShrink: 0 }} />
                <span>최대 {group.maxMembers}명 · 현재 {group.memberCount}명</span>
              </div>
            </div>
          </div>

          {/* 운영자 + 멤버 미리보기 */}
          <div className={styles.sideCard}>
            <div className={styles.leader}>
              <div className={styles.leaderAvatar} />
              <div className={styles.leaderInfo}>
                <div className={styles.leaderName}>{group.ownerNickname}</div>
                <div className={styles.leaderDesc}>그룹 운영자</div>
              </div>
            </div>
            <div className={styles.divider} />
            <div className={styles.membersHeader}>
              <div className={styles.membersTitle}>
                멤버 <span className={styles.membersCount}>{group.memberCount}</span>
              </div>
              <button className={styles.membersViewAll} onClick={() => setTab('멤버')}>
                전체보기
              </button>
            </div>
            <div className={styles.membersGrid}>
              {members.slice(0, 4).map(m => (
                <div key={m.memberId} className={styles.memberAvatar} style={{
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  overflow: 'hidden',
                }}>
                  {m.profileImageUrl && (
                    <img src={m.profileImageUrl} alt={m.nickname} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  )}
                </div>
              ))}
              {group.memberCount > 4 && (
                <div className={styles.memberMore}>+{group.memberCount - 4}</div>
              )}
            </div>
          </div>

          {/* 관심 태그 */}
          {group.interests.length > 0 && (
            <div className={styles.sideCard}>
              <div className={styles.sideCardTitle}>관심 태그</div>
              <div className={styles.quickTags}>
                {group.interests.map(i => (
                  <span key={i.interestId} className={styles.quickTag}>#{i.name}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthRequiredOverlay>
  );
}
