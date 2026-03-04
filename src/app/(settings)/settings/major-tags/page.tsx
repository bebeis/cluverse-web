'use client';

import React, { useState } from 'react';
import styles from './MajorTags.module.css';
import {
  Building2, Edit2, Eye,
  GraduationCap, BookOpen, History,
  PlusCircle, Trash2,
  Mail, CheckCircle, Search, Sparkles,
  X, RotateCcw, Info,
} from 'lucide-react';

const suggestedTags = {
  'IT / 개발 (전공 연관)': { color: '#3B82F6', items: ['#프론트엔드', '#백엔드', '#인공지능', '#알고리즘', '#해커톤', '#앱개발', '#클라우드'] },
  '경영 / 창업': { color: '#A855F7', items: ['#스타트업', '#마케팅', '#재무분석', '#투자'] },
  '취미 / 동아리': { color: '#F59E0B', items: ['#독서', '#여행', '#맛집탐방', '#사진', '#밴드'] },
};

const majors = [
  { type: '제1전공', name: '컴퓨터공학과', college: '공과대학', color: '#3B82F6', icon: <Building2 size={24} /> },
  { type: '복수전공', name: '경영학과', college: '경영대학', color: '#A855F7', icon: <BookOpen size={24} /> },
  { type: '부전공', name: '심리학과', college: '사회과학대학', color: '#F59E0B', icon: <History size={24} /> },
];

export default function MajorTagsPage() {
  const [selectedTags, setSelectedTags] = useState(['#웹개발', '#UX디자인', '#영어회화', '#영화감상', '#재테크']);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.headerBar}>
        <h1>전공 및 관심 태그 설정</h1>
        <p>나의 학업 정보와 관심사를 설정하여 클루버스 활동을 시작해보세요.</p>
      </div>

      {/* School Info */}
      <div className={styles.schoolCard}>
        <div className={styles.schoolHeader}>
          <span className={styles.schoolHeaderTitle}>
            <Building2 size={20} style={{ color: '#4051B5' }} />
            학교 정보
          </span>
          <button className={styles.changeBtn}>
            <Edit2 size={14} />
            학교 변경 신청
          </button>
        </div>

        <div className={styles.schoolBody}>
          <div className={styles.schoolBadge}>
            <div className={styles.schoolBadgeCircle}>
              <div className={styles.schoolBadgeGlow} />
              <div style={{
                width: '100%', height: '100%', borderRadius: '50%',
                background: 'linear-gradient(135deg, #4051B5 0%, #6366F1 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: 48, fontWeight: 900, letterSpacing: -2,
              }}>
                K
              </div>
              <div className={styles.schoolBadgeIcon}>
                <Eye size={16} />
              </div>
            </div>
            <span className={styles.schoolBadgeLabel}>프로필 배지 미리보기</span>
          </div>

          <div className={styles.schoolDetails}>
            <div className={styles.schoolName}>
              <h2>한국대학교</h2>
              <span className={styles.verifiedBadge}>
                <CheckCircle size={12} />
                인증됨
              </span>
            </div>
            <p className={styles.schoolSubtext}>서울 캠퍼스 · 4년제 종합대학교</p>

            <div className={styles.schoolInfoGrid}>
              <div className={styles.schoolInfoItem}>
                <span className={styles.schoolInfoItemLabel}>이메일 계정</span>
                <div className={styles.schoolInfoItemValue}>
                  <Mail size={16} style={{ color: '#9CA3AF' }} />
                  student@korea.ac.kr
                </div>
              </div>
              <div className={styles.schoolInfoItem}>
                <span className={styles.schoolInfoItemLabel}>인증 상태</span>
                <div className={styles.schoolInfoItemValue} style={{ color: '#15803D' }}>
                  <CheckCircle size={16} />
                  재학 인증 완료 (2024.03.15)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Major List */}
      <div id="major-list">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionHeaderTitle}>
            <GraduationCap size={20} style={{ color: '#4051B5' }} />
            전공 목록
          </span>
          <button className={styles.addBtn}>
            <PlusCircle size={18} />
            전공 추가하기
          </button>
        </div>

        <div className={styles.majorGrid} style={{ marginTop: 16 }}>
          {majors.map(m => (
            <div key={m.name} className={styles.majorCard}>
              <div className={styles.majorAccent} style={{ background: m.color }} />
              <div className={styles.majorInfo}>
                <div className={styles.majorIcon} style={{ background: `${m.color}15`, color: m.color }}>
                  {m.icon}
                </div>
                <div>
                  <span className={styles.majorType} style={{
                    background: `${m.color}15`,
                    color: m.color,
                    border: `1px solid ${m.color}30`,
                  }}>
                    {m.type}
                  </span>
                  <div className={styles.majorName}>{m.name}</div>
                  <div className={styles.majorCollege}>{m.college}</div>
                </div>
              </div>
              <div className={styles.majorActions}>
                <button className={styles.majorActionBtn}>
                  <Edit2 size={16} />
                </button>
                {m.type !== '제1전공' && (
                  <button className={`${styles.majorActionBtn} ${styles.majorActionBtnDanger}`}>
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className={styles.divider} />

      {/* Tag Section */}
      <div id="tag-settings" className={styles.tagSection}>
        <div className={styles.headerBar}>
          <span className={styles.sectionHeaderTitle}>
            <Sparkles size={20} style={{ color: '#4051B5' }} />
            관심 태그 설정
          </span>
          <p style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>
            관심 태그를 기반으로 맞춤형 모임과 게시글을 추천해 드립니다.
          </p>
        </div>

        <div className={styles.tagGrid}>
          {/* Suggested Tags */}
          <div className={styles.tagPanel}>
            <div className={styles.tagPanelHeader}>
              <span className={styles.tagPanelTitle}>
                <Sparkles size={14} />
                추천 태그
              </span>
              <div className={styles.tagSearch}>
                <Search size={16} style={{ color: '#9CA3AF', flexShrink: 0 }} />
                <input className={styles.tagSearchInput} placeholder="태그 검색..." />
              </div>
            </div>
            <div className={styles.tagPanelBody}>
              {Object.entries(suggestedTags).map(([category, { color, items }]) => (
                <div key={category} className={styles.tagCategory}>
                  <div className={styles.tagCategoryTitle}>
                    <span className={styles.tagCategoryDot} style={{ background: color }} />
                    {category}
                  </div>
                  <div className={styles.tagChips}>
                    {items.map(tag => (
                      <button
                        key={tag}
                        className={styles.tagChip}
                        onClick={() => toggleTag(tag)}
                        style={selectedTags.includes(tag) ? {
                          background: `${color}10`,
                          borderColor: color,
                          color: color,
                        } : {}}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Tags */}
          <div className={styles.selectedPanel}>
            <div className={styles.selectedHeader}>
              <div className={styles.selectedTitle}>
                내 관심 태그
                <span className={styles.selectedCount}>{selectedTags.length}</span>
              </div>
              <button className={styles.resetBtn} onClick={() => setSelectedTags([])}>
                <RotateCcw size={12} />
                전체 초기화
              </button>
            </div>

            <div className={styles.selectedTags}>
              {selectedTags.map(tag => (
                <div key={tag} className={styles.selectedTag}>
                  <span>{tag}</span>
                  <button className={styles.removeTagBtn} onClick={() => toggleTag(tag)}>
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>

            <div className={styles.selectedInfo}>
              <div className={styles.selectedInfoText}>
                <Info size={14} style={{ color: '#4051B5', flexShrink: 0, marginTop: 2 }} />
                선택한 태그는 사용자 추천 알고리즘에 즉시 반영됩니다. 최대 20개까지 등록하여 더 정확한 추천을 받아보세요.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <button className={styles.cancelFooterBtn}>취소</button>
        <button className={styles.saveFooterBtn}>변경사항 저장 완료</button>
      </div>
    </div>
  );
}
