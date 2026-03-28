'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Users, MapPin, Calendar, Eye, MessageCircle, Heart, Pin, Lock, SquarePen,
  Crown, Shield, User as UserIcon, Settings, PlusCircle, FileText, UserCheck,
  LogOut, Pencil, ChevronRight, X, Trash2, ClipboardList, StopCircle, PlayCircle,
} from 'lucide-react';
import { AuthRequiredOverlay } from '@/components/ui/AuthRequiredOverlay';
import { PostModal } from '@/components/ui/PostModal';
import {
  cluverseApi, FeedPost, GroupDetail, GroupMember, RecruitmentSummary, formatRelativeTime,
} from '@/lib/cluverse-api';
import { stripHtml } from '@/lib/html-utils';
import styles from './GroupDetail.module.css';

type Tab = '게시글' | '공고' | '멤버';

const ROLE_LABEL: Record<string, string> = { OWNER: '운영자', ADMIN: '관리자', MEMBER: '멤버' };
const ROLE_ICON: Record<string, React.ReactNode> = {
  OWNER: <Crown size={13} />,
  ADMIN: <Shield size={13} />,
  MEMBER: <UserIcon size={13} />,
};

interface EditForm {
  name: string;
  description: string;
  coverImageUrl: string;
  maxMembers: number;
  region: string;
  activityType: string;
  visibility: string;
}

export default function GroupDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const groupId = Number(params.id);
  const [group, setGroup] = useState<GroupDetail | null>(null);
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [recruitments, setRecruitments] = useState<RecruitmentSummary[]>([]);
  const [tab, setTab] = useState<Tab>('게시글');
  const [authRequired, setAuthRequired] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<EditForm | null>(null);
  const [saving, setSaving] = useState(false);

  // 공고 수정 모달
  const [recruitEditOpen, setRecruitEditOpen] = useState(false);
  const [recruitEditing, setRecruitEditing] = useState<RecruitmentSummary | null>(null);
  const [recruitEditTitle, setRecruitEditTitle] = useState('');
  const [recruitEditDeadline, setRecruitEditDeadline] = useState('');
  const [recruitSaving, setRecruitSaving] = useState(false);

  const reloadGroup = async () => {
    const g = await cluverseApi.getGroup(groupId);
    setGroup(g);
    return g;
  };

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
          setMembers(await cluverseApi.getGroupMembers(groupId));
        } catch {
          setMembers([]);
        }
        try {
          const rec = await cluverseApi.getRecruitments({ groupId });
          setRecruitments(rec.recruitments);
        } catch {
          setRecruitments([]);
        }
      })
      .catch(() => {
        setGroup(null);
        setPosts([]);
        setMembers([]);
        setAuthRequired(true);
      });
  }, [groupId]);

  const openEdit = () => {
    if (!group) return;
    setEditForm({
      name: group.name,
      description: group.description,
      coverImageUrl: group.coverImageUrl || '',
      maxMembers: group.maxMembers,
      region: group.region,
      activityType: group.activityType,
      visibility: group.visibility,
    });
    setEditOpen(true);
  };

  const saveEdit = async () => {
    if (!editForm || !group) return;
    setSaving(true);
    try {
      await cluverseApi.updateGroup(group.groupId, {
        name: editForm.name,
        description: editForm.description,
        coverImageUrl: editForm.coverImageUrl,
        maxMembers: editForm.maxMembers,
        region: editForm.region,
        activityType: editForm.activityType,
        visibility: editForm.visibility,
      });
      setGroup(await cluverseApi.getGroup(groupId));
      setEditOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const leaveGroup = async () => {
    if (!confirm('정말로 그룹을 나가시겠습니까?')) return;
    await cluverseApi.leaveGroup(groupId);
    router.push('/groups');
  };

  const openRecruitEdit = (rec: RecruitmentSummary) => {
    setRecruitEditing(rec);
    setRecruitEditTitle(rec.title);
    // deadline을 datetime-local input 형식으로 변환
    setRecruitEditDeadline(rec.deadline ? rec.deadline.slice(0, 16) : '');
    setRecruitEditOpen(true);
  };

  const saveRecruitEdit = async () => {
    if (!recruitEditing) return;
    setRecruitSaving(true);
    try {
      const detail = await cluverseApi.getRecruitment(recruitEditing.recruitmentId);
      await cluverseApi.updateRecruitment(recruitEditing.recruitmentId, {
        title: recruitEditTitle,
        description: detail.description,
        positions: detail.positions,
        requirements: detail.requirements,
        duration: detail.duration,
        goal: detail.goal,
        processDescription: detail.processDescription,
        deadline: new Date(recruitEditDeadline).toISOString(),
        formItems: detail.formItems,
      });
      const rec = await cluverseApi.getRecruitments({ groupId });
      setRecruitments(rec.recruitments);
      setRecruitEditOpen(false);
    } finally {
      setRecruitSaving(false);
    }
  };

  const toggleRecruitStatus = async (rec: RecruitmentSummary) => {
    const next = rec.status === 'OPEN' ? 'CLOSED' : 'OPEN';
    await cluverseApi.patchRecruitmentStatus(rec.recruitmentId, next);
    setRecruitments(prev => prev.map(r =>
      r.recruitmentId === rec.recruitmentId ? { ...r, status: next } : r,
    ));
  };

  const deleteRecruitment = async (rec: RecruitmentSummary) => {
    if (!confirm(`"${rec.title}" 공고를 삭제하시겠습니까?`)) return;
    await cluverseApi.deleteRecruitment(rec.recruitmentId);
    setRecruitments(prev => prev.filter(r => r.recruitmentId !== rec.recruitmentId));
  };

  const kickMember = async (memberId: number, nickname: string) => {
    if (!confirm(`${nickname}님을 그룹에서 내보내시겠습니까?`)) return;
    await cluverseApi.kickGroupMember(groupId, memberId);
    setMembers(prev => prev.filter(m => m.memberId !== memberId));
    reloadGroup();
  };

  if (!group) {
    return (
      <AuthRequiredOverlay active={authRequired}>
        <div className={styles.gridLayout} style={{ minHeight: 320 }} />
      </AuthRequiredOverlay>
    );
  }

  const pinnedPost = posts.find(p => p.isPinned);
  const normalPosts = posts.filter(p => !p.isPinned);
  const canWrite = group.member && group.boardId;
  const isOwner = group.myRole === 'OWNER';
  const canManage = group.myRole === 'OWNER' || group.myRole === 'ADMIN';
  const isMember = group.member === true;

  return (
    <AuthRequiredOverlay active={authRequired}>
      {/* ── 히어로 ── */}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h1 className={styles.heroTitle}>{group.name}</h1>
              {isOwner && (
                <button className={styles.heroEditBtn} onClick={openEdit} title="그룹 정보 수정">
                  <Pencil size={14} />
                </button>
              )}
            </div>
            <div className={styles.heroMeta}>
              <span className={styles.heroMetaItem}><Users size={18} /> 멤버 {group.memberCount}명</span>
              <span className={styles.heroMetaItem}><MapPin size={18} /> {group.region}</span>
              <span className={styles.heroMetaItem}><Calendar size={18} /> {group.activityType}</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
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
            {canManage && (
              <Link href={`/group/${groupId}/recruit/create`} className={styles.heroManageBtn}>
                <PlusCircle size={14} />
                공고 등록
              </Link>
            )}
          </div>
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
            {(['게시글', '공고', '멤버'] as Tab[]).map(t => (
              <button
                key={t}
                className={tab === t ? styles.tabActive : styles.tabInactive}
                onClick={() => setTab(t)}
              >
                {t}
                {t === '멤버' && (
                  <span style={{ marginLeft: 4, fontSize: 13, color: tab === '멤버' ? '#4051B5' : '#9CA3AF' }}>
                    {group.memberCount}
                  </span>
                )}
                {t === '공고' && recruitments.length > 0 && (
                  <span style={{ marginLeft: 4, fontSize: 13, color: tab === '공고' ? '#4051B5' : '#9CA3AF' }}>
                    {recruitments.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ── 게시글 탭 ── */}
          {tab === '게시글' && (
            <>
              {pinnedPost && (
                <div className={styles.pinnedSection}>
                  <div className={styles.pinnedLabel}>
                    <Pin size={16} style={{ color: '#4051B5' }} />
                    <span>필독 공지사항</span>
                  </div>
                  <div onClick={() => setSelectedPostId(pinnedPost.postId)} className={styles.noticeCard} style={{ cursor: 'pointer' }}>
                    <div className={styles.noticeAccent} />
                    <div className={styles.noticeHeader}>
                      <div className={styles.noticeHeaderLeft}>
                        <span className={styles.noticeBadge}>{pinnedPost.category}</span>
                        <span className={styles.noticeDate}>{formatRelativeTime(pinnedPost.createdAt)}</span>
                      </div>
                    </div>
                    <h3 className={styles.noticeTitle}>{pinnedPost.title}</h3>
                    <p className={styles.noticeBody}>{stripHtml(pinnedPost.contentPreview || pinnedPost.content || '')}</p>
                    <div className={styles.noticeMeta}>
                      <span className={styles.metaItem}><Eye size={14} /> {pinnedPost.viewCount}</span>
                      <span className={styles.metaItem}><MessageCircle size={14} /> {pinnedPost.commentCount}</span>
                    </div>
                  </div>
                </div>
              )}

              {normalPosts.length === 0 && !pinnedPost ? (
                <div className={styles.emptyState}>
                  <SquarePen size={32} style={{ color: '#D1D5DB' }} />
                  <p>아직 게시글이 없습니다.</p>
                  {canWrite && (
                    <button
                      onClick={() => router.push(`/post/create?boardId=${group.boardId}`)}
                      className={styles.emptyStateBtn}
                    >
                      첫 글 작성하기
                    </button>
                  )}
                </div>
              ) : (
                <div className={styles.postList}>
                  {normalPosts.map(post => (
                    <div key={post.postId} onClick={() => setSelectedPostId(post.postId)} className={styles.postCard} style={{ cursor: 'pointer' }}>
                      <div className={styles.postRow}>
                        <div className={styles.postContent}>
                          <div className={styles.postAuthor}>
                            <div className={styles.postAuthorAvatar} />
                            <span className={styles.postAuthorName}>{post.isAnonymous ? '익명' : post.author.nickname}</span>
                            <span className={styles.postAuthorTime}>• {formatRelativeTime(post.createdAt)}</span>
                          </div>
                          <h4 className={styles.postTitle}>{post.title}</h4>
                          <p className={styles.postExcerpt}>{stripHtml(post.contentPreview || post.content || '')}</p>
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
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ── 공고 탭 ── */}
          {tab === '공고' && (
            <div className={styles.recruitList}>
              {canManage && (
                <Link href={`/group/${groupId}/recruit/create`} className={styles.recruitCreateBtn}>
                  <PlusCircle size={16} />
                  새 공고 등록
                </Link>
              )}
              {recruitments.length === 0 ? (
                <div className={styles.emptyState}>
                  <ClipboardList size={32} style={{ color: '#D1D5DB' }} />
                  <p>등록된 모집 공고가 없습니다.</p>
                </div>
              ) : recruitments.map(rec => (
                <div key={rec.recruitmentId} className={styles.recruitCard}>
                  <div className={styles.recruitCardBody}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <span className={`${styles.recruitStatus} ${rec.status === 'OPEN' ? styles.recruitStatusOpen : styles.recruitStatusClosed}`}>
                          {rec.status === 'OPEN' ? '모집 중' : '마감'}
                        </span>
                        <h3 className={styles.recruitTitle}>{rec.title}</h3>
                      </div>
                      <div className={styles.recruitMeta}>
                        <span>마감: {new Date(rec.deadline).toLocaleDateString('ko-KR')}</span>
                        {rec.positions.length > 0 && (
                          <span>포지션: {rec.positions.map(p => `${p.name} ${p.count}명`).join(', ')}</span>
                        )}
                        {canManage && (
                          <span>지원자 {rec.applicationCount}명</span>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                      {!isMember && rec.status === 'OPEN' && (
                        <Link href={`/group/${groupId}/apply`} className={styles.recruitApplyBtn}>
                          지원하기
                        </Link>
                      )}
                      {canManage && (
                        <Link href={`/group/${groupId}/manage/applicants`} className={styles.recruitManageBtn}>
                          <UserCheck size={13} />
                          지원자 관리
                        </Link>
                      )}
                      {canManage && (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className={styles.recruitIconBtn} onClick={() => openRecruitEdit(rec)} title="수정">
                            <Pencil size={13} />
                          </button>
                          <button
                            className={styles.recruitIconBtn}
                            onClick={() => toggleRecruitStatus(rec)}
                            title={rec.status === 'OPEN' ? '마감' : '재개'}
                          >
                            {rec.status === 'OPEN' ? <StopCircle size={13} /> : <PlayCircle size={13} />}
                          </button>
                          <button className={`${styles.recruitIconBtn} ${styles.recruitIconBtnDanger}`} onClick={() => deleteRecruitment(rec)} title="삭제">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── 멤버 탭 ── */}
          {tab === '멤버' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {canManage && (
                <Link href={`/group/${groupId}/manage/roles`} className={styles.memberManageLink}>
                  <Settings size={14} />
                  멤버 역할 관리
                  <ChevronRight size={14} style={{ marginLeft: 'auto' }} />
                </Link>
              )}
              {members.length === 0 ? (
                <p style={{ color: '#9CA3AF', fontSize: 14, padding: '24px 0' }}>멤버 정보를 불러올 수 없습니다.</p>
              ) : members.map(m => (
                <div
                  key={m.memberId}
                  className={styles.memberRow}
                  style={{
                    border: m.isMe ? '1px solid rgba(64,81,181,0.3)' : '1px solid #E5E7EB',
                    boxShadow: m.isMe ? '0 0 0 2px rgba(64,81,181,0.08)' : undefined,
                  }}
                >
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
                  {canManage && !m.isMe && m.role !== 'OWNER' && (
                    <button
                      className={styles.kickBtn}
                      onClick={() => kickMember(m.memberId, m.nickname)}
                      title="내보내기"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── 사이드바 ── */}
        <div className={styles.sidebar}>
          {/* 관리자 패널 */}
          {canManage && (
            <div className={styles.adminPanel}>
              <div className={styles.adminPanelTitle}>
                <Settings size={15} />
                그룹 관리
              </div>
              <div className={styles.adminActions}>
                {isOwner && (
                  <button className={styles.adminActionBtn} onClick={openEdit}>
                    <Pencil size={15} />
                    <span>그룹 정보 수정</span>
                    <ChevronRight size={14} style={{ marginLeft: 'auto', color: '#9CA3AF' }} />
                  </button>
                )}
                <Link href={`/group/${groupId}/recruit/create`} className={styles.adminActionBtn}>
                  <PlusCircle size={15} />
                  <span>공고 등록</span>
                  <ChevronRight size={14} style={{ marginLeft: 'auto', color: '#9CA3AF' }} />
                </Link>
                <Link href={`/group/${groupId}/manage/applicants`} className={styles.adminActionBtn}>
                  <FileText size={15} />
                  <span>지원자 관리</span>
                  <ChevronRight size={14} style={{ marginLeft: 'auto', color: '#9CA3AF' }} />
                </Link>
                <Link href={`/group/${groupId}/manage/roles`} className={styles.adminActionBtn}>
                  <UserCheck size={15} />
                  <span>회원 관리</span>
                  <ChevronRight size={14} style={{ marginLeft: 'auto', color: '#9CA3AF' }} />
                </Link>
              </div>
            </div>
          )}

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

          {/* 그룹 나가기 */}
          {isMember && !isOwner && (
            <button className={styles.leaveBtn} onClick={leaveGroup}>
              <LogOut size={14} />
              그룹 나가기
            </button>
          )}
        </div>
      </div>

      <PostModal postId={selectedPostId} onClose={() => setSelectedPostId(null)} />

      {/* ── 공고 수정 모달 ── */}
      {recruitEditOpen && recruitEditing && (
        <div className={styles.modalOverlay} onClick={() => setRecruitEditOpen(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>공고 수정</h2>
              <button className={styles.modalClose} onClick={() => setRecruitEditOpen(false)}><X size={20} /></button>
            </div>
            <div className={styles.modalBody}>
              <label className={styles.modalLabel}>공고 제목</label>
              <input
                className={styles.modalInput}
                value={recruitEditTitle}
                onChange={e => setRecruitEditTitle(e.target.value)}
              />
              <label className={styles.modalLabel}>마감일</label>
              <input
                className={styles.modalInput}
                type="datetime-local"
                value={recruitEditDeadline}
                onChange={e => setRecruitEditDeadline(e.target.value)}
              />
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.modalCancelBtn} onClick={() => setRecruitEditOpen(false)}>취소</button>
              <button className={styles.modalSaveBtn} onClick={saveRecruitEdit} disabled={recruitSaving}>
                {recruitSaving ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 그룹 정보 수정 모달 ── */}
      {editOpen && editForm && (
        <div className={styles.modalOverlay} onClick={() => setEditOpen(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>그룹 정보 수정</h2>
              <button className={styles.modalClose} onClick={() => setEditOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <label className={styles.modalLabel}>그룹명</label>
              <input
                className={styles.modalInput}
                value={editForm.name}
                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
              />
              <label className={styles.modalLabel}>소개</label>
              <textarea
                className={styles.modalTextarea}
                value={editForm.description}
                onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                rows={4}
              />
              <label className={styles.modalLabel}>커버 이미지 URL</label>
              <input
                className={styles.modalInput}
                value={editForm.coverImageUrl}
                onChange={e => setEditForm({ ...editForm, coverImageUrl: e.target.value })}
                placeholder="https://..."
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className={styles.modalLabel}>지역</label>
                  <input
                    className={styles.modalInput}
                    value={editForm.region}
                    onChange={e => setEditForm({ ...editForm, region: e.target.value })}
                  />
                </div>
                <div>
                  <label className={styles.modalLabel}>활동 방식</label>
                  <select
                    className={styles.modalSelect}
                    value={editForm.activityType}
                    onChange={e => setEditForm({ ...editForm, activityType: e.target.value })}
                  >
                    <option value="ONLINE">온라인</option>
                    <option value="OFFLINE">오프라인</option>
                    <option value="HYBRID">혼합</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className={styles.modalLabel}>최대 인원</label>
                  <input
                    className={styles.modalInput}
                    type="number"
                    value={editForm.maxMembers}
                    min={1}
                    onChange={e => setEditForm({ ...editForm, maxMembers: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className={styles.modalLabel}>공개 설정</label>
                  <select
                    className={styles.modalSelect}
                    value={editForm.visibility}
                    onChange={e => setEditForm({ ...editForm, visibility: e.target.value })}
                  >
                    <option value="PUBLIC">공개</option>
                    <option value="PRIVATE">비공개</option>
                    <option value="UNIVERSITY_ONLY">우리 학교만</option>
                  </select>
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.modalCancelBtn} onClick={() => setEditOpen(false)}>취소</button>
              <button className={styles.modalSaveBtn} onClick={saveEdit} disabled={saving}>
                {saving ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthRequiredOverlay>
  );
}
