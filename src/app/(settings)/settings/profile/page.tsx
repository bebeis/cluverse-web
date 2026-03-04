'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './MyPage.module.css';
import {
  Camera,
  Edit3,
  GraduationCap,
  Terminal,
  TrendingUp,
  Eye,
  FileText,
  MessageCircle,
  Bookmark,
  Ban,
  ChevronRight,
  Hash,
  PlusCircle,
} from 'lucide-react';

export default function MyPageSettingsPage() {
  const [publicProfile, setPublicProfile] = useState(true);
  const [showMajor, setShowMajor] = useState(true);
  const [showSocial, setShowSocial] = useState(false);

  return (
    <>
      {/* Profile Cover Card */}
      <div className={styles.profileCard}>
        <div className={styles.coverImage}>
          <div className={styles.coverOverlay} />
        </div>
        <div className={styles.profileBody}>
          <div className={styles.profileTop}>
            <div className={styles.avatarWrap}>
              <div className={styles.avatar}>
                <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea, #764ba2)' }} />
                <button className={styles.avatarEditBtn}>
                  <Camera size={16} />
                </button>
              </div>
            </div>
            <button className={styles.editProfileBtn}>
              <Edit3 size={16} />
              프로필 편집
            </button>
          </div>
          <div className={styles.profileName} style={{ marginBottom: 16 }}>
            <h1>김서준</h1>
            <p>@alex_korea</p>
          </div>

          {/* Badges */}
          <div className={styles.badges}>
            <span className={styles.badgeSchool}>
              <GraduationCap size={16} />
              서울대학교
            </span>
            <span className={styles.badgeMajor}>
              <Terminal size={16} />
              컴퓨터공학과
            </span>
            <span className={styles.badgeMinor}>
              <TrendingUp size={16} />
              경제학과
            </span>
          </div>

          {/* Bio */}
          <div className={styles.bio}>
            기술과 시장 역학의 교차점을 탐구하고 있습니다. 여가 시간에는 커뮤니티 도구를 만듭니다. AI나 행동 경제학에 대한 이야기는 언제나 환영입니다!
          </div>
        </div>
      </div>

      {/* Profile Privacy Settings */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIcon}>
            <Eye size={20} />
          </div>
          <div>
            <div className={styles.sectionTitle}>프로필 공개 설정</div>
            <div className={styles.sectionDesc}>다른 사용자에게 보여지는 정보를 관리합니다.</div>
          </div>
        </div>

        <div className={styles.toggleRow}>
          <div>
            <div className={styles.toggleLabel}>전체 공개 프로필</div>
            <div className={styles.toggleDesc}>다른 대학의 학생들이 내 프로필을 검색하고 볼 수 있도록 허용합니다.</div>
          </div>
          <label className={styles.toggle}>
            <input className={styles.toggleInput} type="checkbox" checked={publicProfile} onChange={() => setPublicProfile(!publicProfile)} />
            <span className={styles.toggleSlider} />
          </label>
        </div>

        <div className={styles.toggleRow}>
          <div>
            <div className={styles.toggleLabel}>전공 정보 표시</div>
            <div className={styles.toggleDesc}>프로필 카드에 주전공 및 복수전공을 배지로 표시합니다.</div>
          </div>
          <label className={styles.toggle}>
            <input className={styles.toggleInput} type="checkbox" checked={showMajor} onChange={() => setShowMajor(!showMajor)} />
            <span className={styles.toggleSlider} />
          </label>
        </div>

        <div className={styles.toggleRow}>
          <div>
            <div className={styles.toggleLabel}>연동된 계정 표시</div>
            <div className={styles.toggleDesc}>GitHub 및 LinkedIn 등 외부 소셜 프로필 링크를 표시합니다.</div>
          </div>
          <label className={styles.toggle}>
            <input className={styles.toggleInput} type="checkbox" checked={showSocial} onChange={() => setShowSocial(!showSocial)} />
            <span className={styles.toggleSlider} />
          </label>
        </div>
      </div>

      {/* Major & Tags 2-col */}
      <div className={styles.twoColGrid}>
        {/* Major Management */}
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
            <div className={styles.majorItem}>
              <div className={styles.majorItemLabel}>주전공</div>
              <div className={styles.majorItemValue}>
                <Terminal size={18} style={{ color: '#4051B5' }} />
                컴퓨터공학과
              </div>
            </div>
            <div className={styles.majorItem} style={{ borderColor: '#ECFDF5' }}>
              <div className={styles.majorItemLabel} style={{ color: '#10B981' }}>복수전공 / 부전공</div>
              <div className={styles.majorItemValue}>
                <TrendingUp size={18} style={{ color: '#10B981' }} />
                경제학과
              </div>
            </div>
          </div>
        </div>

        {/* Interest Tags */}
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
            <span className={styles.tag}>#인공지능</span>
            <span className={styles.tag}>#웹개발</span>
            <span className={styles.tag}>#스타트업</span>
            <span className={styles.tag}>#해커톤</span>
            <span className={styles.tag}>#사진촬영</span>
            <Link href="/settings/major-tags#tag-settings" className={styles.tagAdd}>
              <PlusCircle size={14} style={{ marginRight: 4 }} />
              태그 추가
            </Link>
          </div>
        </div>
      </div>

      {/* Activity & Privacy */}
      <div className={styles.activityCard}>
        <div className={styles.activityHeader}>활동 및 개인정보</div>
        {[
          { icon: <FileText size={20} />, bg: '#E0E7FF', color: '#4338CA', name: '내가 쓴 글', desc: '커뮤니티 기여 활동 확인 및 관리' },
          { icon: <MessageCircle size={20} />, bg: '#FFEDD5', color: '#EA580C', name: '댓글 단 글', desc: '참여한 토론 및 답글 내역' },
          { icon: <Bookmark size={20} />, bg: '#F3E8FF', color: '#9333EA', name: '북마크', desc: '저장된 이벤트, 게시글 및 기회' },
          { icon: <Ban size={20} />, bg: '#F3F4F6', color: '#4B5563', name: '차단 관리', desc: '제한한 사용자 관리', href: '/settings/blocked' },
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
    </>
  );
}
