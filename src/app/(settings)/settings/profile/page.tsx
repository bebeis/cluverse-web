'use client';

import React, { useEffect, useState } from 'react';
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
  MessageCircle,
  Bookmark,
  Ban,
  ChevronRight,
  Hash,
  PlusCircle,
} from 'lucide-react';
import { AuthRequiredOverlay } from '@/components/ui/AuthRequiredOverlay';
import { ApiError, cluverseApi, MemberInterest, MemberMajor, Profile } from '@/lib/cluverse-api';
import { isLoggedIn } from '@/lib/auth';

export default function MyPageSettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [majors, setMajors] = useState<MemberMajor[]>([]);
  const [interests, setInterests] = useState<MemberInterest[]>([]);
  const [authRequired, setAuthRequired] = useState(false);

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
                <button className={styles.avatarEditBtn}>
                  <Camera size={16} />
                </button>
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
            </span>
            {majors.slice(0, 2).map(major => (
              <span key={major.memberMajorId} className={styles.badgeMajor}>
                <Terminal size={16} />
                {major.majorType} #{major.majorId}
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
                  전공 ID {major.majorId}
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
              <span key={interest.interestId} className={styles.tag}>#{interest.interestId}</span>
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
        {[
          { icon: <FileText size={20} />, bg: '#E0E7FF', color: '#4338CA', name: '내가 쓴 글', desc: `팔로워 ${profile.followerCount}` },
          { icon: <MessageCircle size={20} />, bg: '#FFEDD5', color: '#EA580C', name: '팔로잉', desc: `팔로잉 ${profile.followingCount}` },
          { icon: <Bookmark size={20} />, bg: '#F3E8FF', color: '#9333EA', name: '북마크', desc: '저장된 글 확인', href: '/bookmarks' },
          { icon: <Ban size={20} />, bg: '#F3F4F6', color: '#4B5563', name: '차단 관리', desc: '차단 사용자 관리', href: '/settings/blocked' },
        ].map(item => (
          <Link key={item.name} href={item.href || '#'} className={styles.activityItem}>
            <div className={styles.activityItemLeft}>
              <div className={styles.activityIcon} style={{ background: item.bg, color: item.color }}>
                {item.icon}
              </div>
              <div>
                <div className={styles.activityName}>{item.name}</div>
                <div className={styles.activityDesc}>{item.desc}</div>
              </div>
            </div>
            <ChevronRight size={20} className={styles.activityArrow} />
          </Link>
        ))}
      </div>
    </AuthRequiredOverlay>
  );
}
