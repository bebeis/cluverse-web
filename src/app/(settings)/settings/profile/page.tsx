'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './MyPage.module.css';
import {
  Camera,
  Edit3,
  GraduationCap,
  Terminal,
  Eye,
  FileText,
  Bookmark,
  Ban,
  ChevronRight,
  Hash,
  PlusCircle,
  X,
  Heart,
  MessageCircle,
  User,
  Github,
  Globe,
  Instagram,
  Link as LinkIcon,
} from 'lucide-react';
import { AuthRequiredOverlay } from '@/components/ui/AuthRequiredOverlay';
import { ApiError, cluverseApi, FeedPost, MemberInterest, MemberMajor, MemberSummary, Profile, formatRelativeTime } from '@/lib/cluverse-api';
import { isLoggedIn } from '@/lib/auth';

const VISIBLE_FIELD_LABELS: Record<string, string> = {
  BIO: '소개',
  ENTRANCE_YEAR: '입학년도',
  LINK_GITHUB: 'GitHub',
  LINK_NOTION: 'Notion',
  LINK_PORTFOLIO: '포트폴리오',
  LINK_INSTAGRAM: 'Instagram',
  LINK_ETC: '기타 링크',
  UNIVERSITY: '학교',
  PROFILE_IMAGE: '프로필 이미지',
};

export default function MyPageSettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [majors, setMajors] = useState<MemberMajor[]>([]);
  const [interests, setInterests] = useState<MemberInterest[]>([]);
  const [authRequired, setAuthRequired] = useState(false);

  // Image upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Profile edit form
  const [editForm, setEditForm] = useState({
    bio: '',
    entranceYear: '',
    linkGithub: '',
    linkNotion: '',
    linkPortfolio: '',
    linkInstagram: '',
    linkEtc: '',
  });
  const [editSaving, setEditSaving] = useState(false);
  const [editMsg, setEditMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Nickname
  const [nicknameInput, setNicknameInput] = useState('');
  const [nicknameStatus, setNicknameStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'error'>('idle');
  const [nicknameSaving, setNicknameSaving] = useState(false);
  const [nicknameMsg, setNicknameMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Visibility
  const [isPublicLocal, setIsPublicLocal] = useState(false);
  const [visibleFieldsLocal, setVisibleFieldsLocal] = useState<string[]>([]);
  const [visibilitySaving, setVisibilitySaving] = useState(false);
  const [visibilityMsg, setVisibilityMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Followers/following modal
  const [followModal, setFollowModal] = useState<'followers' | 'following' | null>(null);
  const [followList, setFollowList] = useState<MemberSummary[]>([]);
  const [followLoading, setFollowLoading] = useState(false);

  // My posts
  const [myPosts, setMyPosts] = useState<FeedPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsLoaded, setPostsLoaded] = useState(false);
  const [showPosts, setShowPosts] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace('/login');
      return;
    }
    cluverseApi.getMyProfile()
      .then(data => {
        setProfile(data);
        setAuthRequired(false);
        setEditForm({
          bio: data.bio || '',
          entranceYear: data.entranceYear ? String(data.entranceYear) : '',
          linkGithub: data.linkGithub || '',
          linkNotion: data.linkNotion || '',
          linkPortfolio: data.linkPortfolio || '',
          linkInstagram: data.linkInstagram || '',
          linkEtc: data.linkEtc || '',
        });
        setIsPublicLocal(data.isPublic);
        setVisibleFieldsLocal(data.visibleFields || []);
      })
      .catch(caught => {
        setProfile(null);
        setAuthRequired(caught instanceof ApiError && caught.statusCode === 401);
      });
    cluverseApi.getMyMajors().then(setMajors).catch(() => setMajors([]));
    cluverseApi.getMyInterests().then(setInterests).catch(() => setInterests([]));
  }, [router]);

  const handleImageClick = () => fileInputRef.current?.click();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const { presignedUrl, fileUrl } = await cluverseApi.getProfileImagePresignedUrl(file.name);
      await fetch(presignedUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });
      const updated = await cluverseApi.updateMyProfile({ profileImageUrl: fileUrl });
      setProfile(updated);
    } catch {
      alert('이미지 업로드에 실패했습니다.');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSaveProfile = async () => {
    setEditSaving(true);
    setEditMsg(null);
    try {
      const updated = await cluverseApi.updateMyProfile({
        bio: editForm.bio || null,
        entranceYear: editForm.entranceYear ? Number(editForm.entranceYear) : null,
        linkGithub: editForm.linkGithub || null,
        linkNotion: editForm.linkNotion || null,
        linkPortfolio: editForm.linkPortfolio || null,
        linkInstagram: editForm.linkInstagram || null,
        linkEtc: editForm.linkEtc || null,
      });
      setProfile(updated);
      setEditMsg({ type: 'success', text: '저장되었습니다.' });
    } catch {
      setEditMsg({ type: 'error', text: '저장에 실패했습니다.' });
    } finally {
      setEditSaving(false);
    }
  };

  const handleCheckNickname = async () => {
    if (!nicknameInput.trim()) return;
    setNicknameStatus('checking');
    setNicknameMsg(null);
    try {
      const result = await cluverseApi.checkNicknameAvailability(nicknameInput.trim());
      setNicknameStatus(result.available ? 'available' : 'taken');
    } catch {
      setNicknameStatus('error');
    }
  };

  const handleSaveNickname = async () => {
    if (nicknameStatus !== 'available' || !nicknameInput.trim()) return;
    setNicknameSaving(true);
    setNicknameMsg(null);
    try {
      const updated = await cluverseApi.updateNickname(nicknameInput.trim());
      setProfile(updated);
      setNicknameInput('');
      setNicknameStatus('idle');
      setNicknameMsg({ type: 'success', text: '닉네임이 변경되었습니다.' });
    } catch {
      setNicknameMsg({ type: 'error', text: '닉네임 변경에 실패했습니다.' });
    } finally {
      setNicknameSaving(false);
    }
  };

  const handleSaveVisibility = async () => {
    setVisibilitySaving(true);
    setVisibilityMsg(null);
    try {
      const updated = await cluverseApi.updateMyProfile({
        isPublic: isPublicLocal,
        visibleFields: visibleFieldsLocal,
      });
      setProfile(updated);
      setVisibilityMsg({ type: 'success', text: '저장되었습니다.' });
    } catch {
      setVisibilityMsg({ type: 'error', text: '저장에 실패했습니다.' });
    } finally {
      setVisibilitySaving(false);
    }
  };

  const toggleVisibleField = (field: string) => {
    setVisibleFieldsLocal(prev =>
      prev.includes(field) ? prev.filter(f => f !== field) : [...prev, field]
    );
  };

  const openFollowModal = async (type: 'followers' | 'following') => {
    if (!profile) return;
    setFollowModal(type);
    setFollowLoading(true);
    try {
      const list = type === 'followers'
        ? await cluverseApi.getFollowers(profile.memberId)
        : await cluverseApi.getFollowing(profile.memberId);
      setFollowList(list);
    } catch {
      setFollowList([]);
    } finally {
      setFollowLoading(false);
    }
  };

  const loadMyPosts = async () => {
    if (postsLoaded) { setShowPosts(v => !v); return; }
    setPostsLoading(true);
    setShowPosts(true);
    try {
      const data = await cluverseApi.getMyPosts({ page: 1, size: 20 });
      setMyPosts(data.posts);
      setPostsLoaded(true);
    } catch {
      setMyPosts([]);
    } finally {
      setPostsLoading(false);
    }
  };

  if (!profile) {
    return (
      <AuthRequiredOverlay active={authRequired}>
        <div className={styles.profileCard} style={{ minHeight: 360 }} />
      </AuthRequiredOverlay>
    );
  }

  return (
    <AuthRequiredOverlay active={authRequired}>
      {/* Profile display card */}
      <div className={styles.profileCard}>
        <div className={styles.coverImage}>
          <div className={styles.coverOverlay} />
        </div>
        <div className={styles.profileBody}>
          <div className={styles.profileTop}>
            <div className={styles.avatarWrap}>
              <div className={styles.avatar}>
                {profile.profileImageUrl ? <img src={profile.profileImageUrl} alt={profile.nickname} style={{ width: '100%', height: '100%', borderRadius: '50%' }} /> : <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea, #764ba2)' }} />}
                <button className={styles.avatarEditBtn} onClick={handleImageClick} disabled={uploadingImage} type="button" title="프로필 이미지 변경">
                  <Camera size={16} />
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleImageChange} />
              </div>
            </div>
            <Link href="/settings/major-tags" className={styles.editProfileBtn}>
              <Edit3 size={16} />
              전공/태그 편집
            </Link>
          </div>
          <div className={styles.profileName} style={{ marginBottom: 16 }}>
            <h1>{profile.nickname}</h1>
            <p>@member-{profile.memberId}</p>
          </div>

          <div className={styles.badges}>
            <span className={styles.badgeSchool}>
              <GraduationCap size={16} />
              {profile.university?.universityName || '학교 미등록'}
              {profile.entranceYear ? ` ${profile.entranceYear}학번` : ''}
            </span>
            {majors.slice(0, 2).map(major => (
              <span key={major.memberMajorId} className={styles.badgeMajor}>
                <Terminal size={16} />
                {major.majorName || `전공 ID ${major.majorId}`}
              </span>
            ))}
          </div>

          <div className={styles.bio}>
            {profile.bio || '소개가 아직 없습니다.'}
          </div>
        </div>
      </div>

      {/* Profile info edit card */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIcon}>
            <User size={20} />
          </div>
          <div>
            <div className={styles.sectionTitle}>프로필 정보 수정</div>
            <div className={styles.sectionDesc}>닉네임, 소개, 입학년도, 소셜 링크를 수정합니다.</div>
          </div>
        </div>

        {/* Nickname */}
        <div className={styles.formGroup} style={{ marginBottom: 24 }}>
          <div className={styles.formLabel}>닉네임 변경</div>
          <div className={styles.nicknameRow}>
            <input
              className={`${styles.formInput} ${styles.nicknameInput}`}
              type="text"
              placeholder={profile.nickname}
              value={nicknameInput}
              onChange={e => { setNicknameInput(e.target.value); setNicknameStatus('idle'); setNicknameMsg(null); }}
            />
            <button
              className={styles.checkBtn}
              type="button"
              onClick={handleCheckNickname}
              disabled={!nicknameInput.trim() || nicknameStatus === 'checking'}
            >
              {nicknameStatus === 'checking' ? '확인 중...' : '중복 확인'}
            </button>
            <button
              className={styles.saveBtn}
              type="button"
              onClick={handleSaveNickname}
              disabled={nicknameStatus !== 'available' || nicknameSaving}
            >
              변경
            </button>
          </div>
          {nicknameStatus === 'available' && <p className={styles.statusAvailable}>사용 가능한 닉네임입니다.</p>}
          {nicknameStatus === 'taken' && <p className={styles.statusTaken}>이미 사용 중인 닉네임입니다.</p>}
          {nicknameStatus === 'error' && <p className={styles.statusError}>확인에 실패했습니다.</p>}
          {nicknameMsg && <p className={nicknameMsg.type === 'success' ? styles.savedMsg : styles.errorMsg}>{nicknameMsg.text}</p>}
        </div>

        <div style={{ borderTop: '1px solid #F3F4F6', marginBottom: 24 }} />

        {/* Bio + entranceYear */}
        <div className={styles.formGrid} style={{ marginBottom: 16 }}>
          <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
            <div className={styles.formLabel}>소개 (최대 500자)</div>
            <textarea
              className={styles.formTextarea}
              placeholder="자신을 소개해보세요."
              maxLength={500}
              value={editForm.bio}
              onChange={e => setEditForm(f => ({ ...f, bio: e.target.value }))}
            />
            <div className={styles.charCount}>{editForm.bio.length} / 500</div>
          </div>
          <div className={styles.formGroup}>
            <div className={styles.formLabel}>입학년도</div>
            <input
              className={styles.formInput}
              type="number"
              placeholder="예: 2022"
              min={1990}
              max={2100}
              value={editForm.entranceYear}
              onChange={e => setEditForm(f => ({ ...f, entranceYear: e.target.value }))}
            />
          </div>
        </div>

        {/* Social links */}
        <div className={styles.formGrid} style={{ marginBottom: 24 }}>
          <div className={styles.formGroup}>
            <div className={styles.formLabel}><Github size={13} style={{ display: 'inline', marginRight: 4 }} />GitHub</div>
            <input
              className={styles.formInput}
              type="url"
              placeholder="https://github.com/username"
              value={editForm.linkGithub}
              onChange={e => setEditForm(f => ({ ...f, linkGithub: e.target.value }))}
            />
          </div>
          <div className={styles.formGroup}>
            <div className={styles.formLabel}><Globe size={13} style={{ display: 'inline', marginRight: 4 }} />Notion</div>
            <input
              className={styles.formInput}
              type="url"
              placeholder="https://notion.so/..."
              value={editForm.linkNotion}
              onChange={e => setEditForm(f => ({ ...f, linkNotion: e.target.value }))}
            />
          </div>
          <div className={styles.formGroup}>
            <div className={styles.formLabel}><Globe size={13} style={{ display: 'inline', marginRight: 4 }} />포트폴리오</div>
            <input
              className={styles.formInput}
              type="url"
              placeholder="https://..."
              value={editForm.linkPortfolio}
              onChange={e => setEditForm(f => ({ ...f, linkPortfolio: e.target.value }))}
            />
          </div>
          <div className={styles.formGroup}>
            <div className={styles.formLabel}><Instagram size={13} style={{ display: 'inline', marginRight: 4 }} />Instagram</div>
            <input
              className={styles.formInput}
              type="url"
              placeholder="https://instagram.com/username"
              value={editForm.linkInstagram}
              onChange={e => setEditForm(f => ({ ...f, linkInstagram: e.target.value }))}
            />
          </div>
          <div className={styles.formGroup}>
            <div className={styles.formLabel}><LinkIcon size={13} style={{ display: 'inline', marginRight: 4 }} />기타 링크</div>
            <input
              className={styles.formInput}
              type="url"
              placeholder="https://..."
              value={editForm.linkEtc}
              onChange={e => setEditForm(f => ({ ...f, linkEtc: e.target.value }))}
            />
          </div>
        </div>

        <div className={styles.formActions}>
          <button className={styles.saveBtn} type="button" onClick={handleSaveProfile} disabled={editSaving}>
            {editSaving ? '저장 중...' : '저장'}
          </button>
          {editMsg && <span className={editMsg.type === 'success' ? styles.savedMsg : styles.errorMsg}>{editMsg.text}</span>}
        </div>
      </div>

      {/* Visibility card */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIcon}>
            <Eye size={20} />
          </div>
          <div>
            <div className={styles.sectionTitle}>프로필 공개 설정</div>
            <div className={styles.sectionDesc}>다른 사용자에게 공개할 항목을 선택합니다.</div>
          </div>
        </div>

        <div className={styles.toggleRow}>
          <div>
            <div className={styles.toggleLabel}>전체 공개 프로필</div>
            <div className={styles.toggleDesc}>비활성화 시 팔로워에게만 프로필이 공개됩니다.</div>
          </div>
          <label className={styles.toggle}>
            <input
              className={styles.toggleInput}
              type="checkbox"
              checked={isPublicLocal}
              onChange={e => setIsPublicLocal(e.target.checked)}
            />
            <span className={styles.toggleSlider} />
          </label>
        </div>

        <div style={{ marginTop: 24 }}>
          <div className={styles.toggleLabel} style={{ marginBottom: 8 }}>공개 항목 선택</div>
          <div className={styles.checkboxGrid}>
            {Object.entries(VISIBLE_FIELD_LABELS).map(([field, label]) => (
              <label
                key={field}
                className={`${styles.checkboxChip} ${visibleFieldsLocal.includes(field) ? styles.checkboxChipActive : ''}`}
              >
                <input
                  type="checkbox"
                  className={styles.checkboxChipInput}
                  checked={visibleFieldsLocal.includes(field)}
                  onChange={() => toggleVisibleField(field)}
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        <div className={styles.formActions} style={{ marginTop: 24 }}>
          <button className={styles.saveBtn} type="button" onClick={handleSaveVisibility} disabled={visibilitySaving}>
            {visibilitySaving ? '저장 중...' : '저장'}
          </button>
          {visibilityMsg && <span className={visibilityMsg.type === 'success' ? styles.savedMsg : styles.errorMsg}>{visibilityMsg.text}</span>}
        </div>
      </div>

      <div className={styles.twoColGrid}>
        <div className={styles.miniCard}>
          <div className={styles.miniCardHeader}>
            <div className={styles.miniCardTitle}>
              <div className={styles.miniCardTitleIcon} style={{ background: '#E0E7FF', color: '#4051B5' }}>
                <GraduationCap size={18} />
              </div>
              <span className={styles.miniCardTitleText}>전공 관리</span>
            </div>
            <Link href="/settings/major-tags#major-list" className={styles.miniCardEditBtn}>수정</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {majors.map(major => (
              <div key={major.memberMajorId} className={styles.majorItem}>
                <div className={styles.majorItemLabel}>{major.majorType}</div>
                <div className={styles.majorItemValue}>
                  <Terminal size={18} style={{ color: '#4051B5' }} />
                  {major.majorName || `전공 ID ${major.majorId}`}
                  {major.collegeName ? ` · ${major.collegeName}` : ''}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.miniCard}>
          <div className={styles.miniCardHeader}>
            <div className={styles.miniCardTitle}>
              <div className={styles.miniCardTitleIcon} style={{ background: '#FCE7F3', color: '#EC4899' }}>
                <Hash size={18} />
              </div>
              <span className={styles.miniCardTitleText}>관심 태그 수정</span>
            </div>
            <Link href="/settings/major-tags#tag-settings" className={styles.miniCardEditBtn}>수정</Link>
          </div>
          <div className={styles.tagsWrap}>
            {interests.map(interest => (
              <span key={interest.interestId} className={styles.tag}>#{interest.interestName || interest.interestId}</span>
            ))}
            <Link href="/settings/major-tags#tag-settings" className={styles.tagAdd}>
              <PlusCircle size={14} style={{ marginRight: 4 }} />
              태그 추가
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.activityCard}>
        <div className={styles.activityHeader}>활동 및 개인정보</div>

        <button className={styles.activityItem} onClick={loadMyPosts} type="button">
          <div className={styles.activityItemLeft}>
            <div className={styles.activityIcon} style={{ background: '#E0E7FF', color: '#4338CA' }}>
              <FileText size={20} />
            </div>
            <div>
              <div className={styles.activityName}>내가 쓴 글</div>
              <div className={styles.activityDesc}>{profile.postCount != null ? `게시글 ${profile.postCount}개` : '작성한 게시글 보기'}</div>
            </div>
          </div>
          <ChevronRight size={20} className={styles.activityArrow} />
        </button>

        {showPosts && (
          <div className={styles.myPostsList}>
            {postsLoading ? (
              <p className={styles.myPostsEmpty}>불러오는 중...</p>
            ) : myPosts.length === 0 ? (
              <p className={styles.myPostsEmpty}>작성한 게시글이 없습니다.</p>
            ) : myPosts.map(post => (
              <div key={post.postId} className={styles.myPostItem}>
                <div className={styles.myPostTitle}>{post.title}</div>
                <div className={styles.myPostMeta}>
                  <span><Heart size={12} /> {post.likeCount}</span>
                  <span><MessageCircle size={12} /> {post.commentCount}</span>
                  <span>{formatRelativeTime(post.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <button className={styles.activityItem} onClick={() => openFollowModal('followers')} type="button">
          <div className={styles.activityItemLeft}>
            <div className={styles.activityIcon} style={{ background: '#FFEDD5', color: '#EA580C' }}>
              <MessageCircle size={20} />
            </div>
            <div>
              <div className={styles.activityName}>팔로워</div>
              <div className={styles.activityDesc}>{`팔로워 ${profile.followerCount ?? 0}명`}</div>
            </div>
          </div>
          <ChevronRight size={20} className={styles.activityArrow} />
        </button>

        <button className={styles.activityItem} onClick={() => openFollowModal('following')} type="button">
          <div className={styles.activityItemLeft}>
            <div className={styles.activityIcon} style={{ background: '#FFEDD5', color: '#EA580C' }}>
              <MessageCircle size={20} />
            </div>
            <div>
              <div className={styles.activityName}>팔로잉</div>
              <div className={styles.activityDesc}>{`팔로잉 ${profile.followingCount ?? 0}명`}</div>
            </div>
          </div>
          <ChevronRight size={20} className={styles.activityArrow} />
        </button>

        <Link href="/bookmarks" className={styles.activityItem}>
          <div className={styles.activityItemLeft}>
            <div className={styles.activityIcon} style={{ background: '#F3E8FF', color: '#9333EA' }}>
              <Bookmark size={20} />
            </div>
            <div>
              <div className={styles.activityName}>북마크</div>
              <div className={styles.activityDesc}>저장된 글 확인</div>
            </div>
          </div>
          <ChevronRight size={20} className={styles.activityArrow} />
        </Link>

        <Link href="/settings/blocked" className={styles.activityItem}>
          <div className={styles.activityItemLeft}>
            <div className={styles.activityIcon} style={{ background: '#F3F4F6', color: '#4B5563' }}>
              <Ban size={20} />
            </div>
            <div>
              <div className={styles.activityName}>차단 관리</div>
              <div className={styles.activityDesc}>차단 사용자 관리</div>
            </div>
          </div>
          <ChevronRight size={20} className={styles.activityArrow} />
        </Link>
      </div>

      {followModal && (
        <div className={styles.followOverlay} onClick={() => setFollowModal(null)}>
          <div className={styles.followModal} onClick={e => e.stopPropagation()}>
            <div className={styles.followModalHeader}>
              <span className={styles.followModalTitle}>{followModal === 'followers' ? '팔로워' : '팔로잉'}</span>
              <button className={styles.followModalClose} onClick={() => setFollowModal(null)} type="button"><X size={18} /></button>
            </div>
            <div className={styles.followModalBody}>
              {followLoading ? (
                <p className={styles.followEmpty}>불러오는 중...</p>
              ) : followList.length === 0 ? (
                <p className={styles.followEmpty}>{followModal === 'followers' ? '팔로워가 없습니다.' : '팔로잉이 없습니다.'}</p>
              ) : followList.map(member => (
                <div key={member.memberId} className={styles.followItem}>
                  <div className={styles.followAvatar}>
                    {member.profileImageUrl
                      ? <img src={member.profileImageUrl} alt={member.nickname} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                      : <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'linear-gradient(135deg,#667eea,#764ba2)' }} />
                    }
                  </div>
                  <div>
                    <div className={styles.followName}>{member.nickname}</div>
                    {member.university && <div className={styles.followUniv}>{member.university.universityName}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </AuthRequiredOverlay>
  );
}
