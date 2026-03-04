'use client';

import React from 'react';
import styles from './Recruit.module.css';
import {
  FileEdit, Smartphone, Calendar, Users,
  Edit, Trash2, GripVertical, Plus,
  Type, Link2, ArrowLeft,
} from 'lucide-react';

export default function CreateRecruitmentPage() {
  return (
    <div className={styles.page}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <div className={styles.adminLabel}>
            <FileEdit size={16} />
            관리자 모드
          </div>
          <h1 className={styles.pageTitle}>모집 공고 생성</h1>
          <p className={styles.pageSubtitle}>
            새로운 멤버를 맞이할 준비를 시작하세요. 매력적인 공고와 꼼꼼한 질문지로 지원자를 모집할 수 있습니다.
          </p>
        </div>
        <nav className={styles.tabsBar}>
          <button className={styles.tabActive}>공고 작성</button>
          <button className={styles.tabInactive}>지원자 관리</button>
          <button className={styles.tabInactive}>설정</button>
        </nav>
      </div>

      {/* Content Grid */}
      <div className={styles.grid}>
        {/* Left: Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {/* Section 1: Basic Info */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionNumber}>1</div>
              <div>
                <h2 className={styles.sectionTitle}>기본 정보 입력</h2>
                <p className={styles.sectionSubtitle}>지원자들이 가장 먼저 보게 될 핵심 정보입니다.</p>
              </div>
            </div>

            <div className={styles.formGrid}>
              <div className={`${styles.formGrid} ${styles.formGrid2}`} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div>
                  <label className={styles.formLabel}>모집 포지션</label>
                  <input className={styles.formInput} placeholder="예: 프론트엔드 개발자" />
                </div>
                <div>
                  <label className={styles.formLabel}>활동 기간</label>
                  <input className={styles.formInput} placeholder="예: 6개월 (2024.03 ~ 2024.08)" />
                </div>
              </div>

              <div>
                <label className={styles.formLabel}>모집 마감일</label>
                <div className={styles.formDateWrap}>
                  <div className={styles.formDateIcon}>
                    <Calendar size={18} />
                  </div>
                  <input className={styles.formDateInput} type="date" />
                </div>
                <p className={styles.formDateHint}>마감일 자정(23:59)까지 지원서 접수가 가능합니다.</p>
              </div>

              <div>
                <label className={styles.formLabel}>요구 조건 및 우대 사항</label>
                <textarea
                  className={styles.formTextarea}
                  placeholder={`지원자에게 바라는 점이나 필수 역량을 자세히 적어주세요.\n- React.js 경험자 우대\n- 주 1회 오프라인 모임 참여 가능자`}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Questions */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionNumber}>2</div>
              <div>
                <h2 className={styles.sectionTitle}>지원서 질문 구성</h2>
                <p className={styles.sectionSubtitle}>지원자의 역량을 파악할 수 있는 질문을 추가하세요.</p>
              </div>
            </div>

            <div className={styles.questions}>
              {/* Q1 */}
              <div className={styles.questionCard}>
                <div className={styles.questionActions}>
                  <button className={styles.questionActionBtn}><Edit size={16} /></button>
                  <button className={`${styles.questionActionBtn} ${styles.questionActionBtnDanger}`}><Trash2 size={16} /></button>
                  <button className={styles.questionActionBtn} style={{ cursor: 'move' }}><GripVertical size={16} /></button>
                </div>
                <div className={styles.questionMeta}>
                  <span className={styles.questionNum}>Q1</span>
                  <span className={styles.questionRequired}>필수</span>
                  <span className={styles.questionType}>장문형</span>
                </div>
                <p className={styles.questionText}>자기소개 및 지원 동기를 자유롭게 작성해주세요.</p>
                <div className={styles.questionPlaceholder}>
                  <Type size={20} style={{ opacity: 0.5 }} />
                  <span>지원자는 이곳에 텍스트를 입력하게 됩니다</span>
                </div>
              </div>

              {/* Q2 */}
              <div className={styles.questionCard}>
                <div className={styles.questionActions}>
                  <button className={styles.questionActionBtn}><Edit size={16} /></button>
                  <button className={`${styles.questionActionBtn} ${styles.questionActionBtnDanger}`}><Trash2 size={16} /></button>
                  <button className={styles.questionActionBtn} style={{ cursor: 'move' }}><GripVertical size={16} /></button>
                </div>
                <div className={styles.questionMeta}>
                  <span className={styles.questionNum}>Q2</span>
                  <span className={styles.questionRequired}>필수</span>
                  <span className={styles.questionType}>장문형</span>
                </div>
                <p className={styles.questionText}>협업 프로젝트 경험이 있다면 구체적으로 서술해주세요. (역할, 기여도 등)</p>
                <div className={styles.questionPlaceholder}>
                  <Type size={20} style={{ opacity: 0.5 }} />
                  <span>지원자는 이곳에 텍스트를 입력하게 됩니다</span>
                </div>
              </div>

              {/* Add Question */}
              <button className={styles.addQuestionBtn}>
                <div className={styles.addQuestionInner}>
                  <div className={styles.addQuestionIcon}>
                    <Plus size={20} />
                  </div>
                  <span className={styles.addQuestionLabel}>새로운 질문 추가하기</span>
                  <span className={styles.addQuestionHint}>최대 5개까지 추가 가능합니다</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Preview */}
        <div className={styles.previewCol}>
          <div className={styles.previewHeader}>
            <h3 className={styles.previewTitle}>
              <Smartphone size={20} style={{ color: '#4051B5' }} />
              지원자 화면 미리보기
            </h3>
            <span className={styles.previewBadge}>Live Preview</span>
          </div>

          <div className={styles.phoneFrame}>
            <div className={styles.phoneInner}>
              <div className={styles.phoneStatusBar}>
                <span className={styles.phoneTime}>9:41</span>
                <div className={styles.phoneStatusDots}>
                  <div className={styles.phoneStatusDot} />
                  <div className={styles.phoneStatusDot} />
                </div>
              </div>

              <div className={styles.phoneContent}>
                <div className={styles.phoneHero}>
                  <div style={{ position: 'absolute', top: 16, left: 16, color: 'rgba(255,255,255,0.8)' }}>
                    <ArrowLeft size={20} />
                  </div>
                  <span className={styles.phoneHeroBadge}>D-14</span>
                  <div className={styles.phoneHeroTitle}>
                    프론트엔드 개발자<br />신규 멤버 모집
                  </div>
                </div>

                <div className={styles.phoneBody}>
                  <div className={styles.phoneInfoChips}>
                    <div className={styles.phoneChip}>
                      <Calendar size={14} style={{ color: '#9CA3AF' }} />
                      6개월 활동
                    </div>
                    <div className={styles.phoneChip}>
                      <Users size={14} style={{ color: '#9CA3AF' }} />
                      3명 모집
                    </div>
                  </div>

                  <hr style={{ border: 'none', borderTop: '1px solid #E5E7EB' }} />

                  {[
                    { q: '1. 자기소개 및 지원 동기', required: true },
                    { q: '2. 협업 프로젝트 경험', required: true },
                  ].map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#111218' }}>{item.q}</span>
                        {item.required && <span style={{ fontSize: 11, color: '#EF4444' }}>*필수</span>}
                      </div>
                      <div style={{
                        width: '100%',
                        height: 80,
                        borderRadius: 12,
                        border: '1px solid #E5E7EB',
                        background: 'white',
                        padding: 12,
                        fontSize: 12,
                        color: '#D1D5DB',
                      }}>
                        내용을 입력해주세요...
                      </div>
                    </div>
                  ))}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#111218' }}>
                      포트폴리오 링크 <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(선택)</span>
                    </span>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      borderRadius: 12,
                      border: '1px solid #E5E7EB',
                      background: 'white',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0 12px',
                        background: '#F8FAFC',
                        borderRight: '1px solid #E5E7EB',
                        height: 40,
                      }}>
                        <Link2 size={14} style={{ color: '#9CA3AF' }} />
                      </div>
                      <div style={{ flex: 1, padding: '8px 12px', fontSize: 12, color: '#D1D5DB' }}>
                        https://notion.so/...
                      </div>
                    </div>
                  </div>

                  <div style={{ paddingTop: 16 }}>
                    <button className={styles.phoneSubmitBtn}>지원서 제출하기</button>
                    <p className={styles.phoneHint}>제출 후에는 수정이 불가능하니 신중히 확인해주세요.</p>
                  </div>
                </div>
              </div>

              <div className={styles.phoneHomeIndicator} />
            </div>
          </div>

          <div className={styles.footerActions}>
            <button className={styles.footerBtnSecondary}>임시 저장</button>
            <button className={styles.footerBtnPrimary}>공고 게시하기</button>
          </div>
        </div>
      </div>
    </div>
  );
}
