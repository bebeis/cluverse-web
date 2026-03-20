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
} from 'lucide-react';
import { AuthRequiredOverlay } from '@/components/ui/AuthRequiredOverlay';
import { ApiError, cluverseApi, FeedPost, MemberInterest, MemberMajor, MemberSummary, Profile, formatRelativeTime } from '@/lib/cluverse-api';
import { isLoggedIn } from '@/lib/auth';

export default function MyPageSettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [majors, setMajors] = useState<MemberMajor[]>([]);
  const [interests, setInterests] = useState<MemberInterest[]>([]);
  const [authRequired, setAuthRequired] = useState(false);

  // Image upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

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
              프로필 편집
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

      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIcon}>
            <Eye size={20} />
          </div>
          <div>
            <div className={styles.sectionTitle}>프로필 공개 설정</div>
            <div className={styles.sectionDesc}>현재 서버 저장값을 기준으로 표시합니다.</div>
          </div>
        </div>

        <div className={styles.toggleRow}>
          <div>
            <div className={styles.toggleLabel}>전체 공개 프로필</div>
            <div className={styles.toggleDesc}>현재 설정값: {profile.isPublic ? '공개' : '비공개'}</div>
          </div>
          <label className={styles.toggle}>
            <input className={styles.toggleInput} type="checkbox" checked={profile.isPublic} readOnly />
            <span className={styles.toggleSlider} />
          </label>
        </div>

        <div className={styles.toggleRow}>
          <div>
            <div className={styles.toggleLabel}>공개 필드 수</div>
            <div className={styles.toggleDesc}>{profile.visibleFields.join(', ') || '없음'}</div>
          </div>
          <label className={styles.toggle}>
            <input className={styles.toggleInput} type="checkbox" checked={profile.visibleFields.length > 0} readOnly />
            <span className={styles.toggleSlider} />
          </label>
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

        {/* 내가 쓴 글 */}
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

        {/* 팔로워 */}
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

        {/* 팔로잉 */}
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

      {/* 팔로워/팔로잉 모달 */}
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
