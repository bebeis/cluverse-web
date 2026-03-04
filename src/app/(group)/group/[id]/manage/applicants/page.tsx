'use client';

import React from 'react';
import styles from './Applicants.module.css';
import {
  Filter, Download, X, Printer, Share2,
  MoreVertical, MessageSquare, ChevronDown,
  ChevronLeft, ChevronRight, Phone, Mail,
  FileEdit, Mic, Lock, CheckCircle,
  FileText, Youtube,
} from 'lucide-react';

const applicants = [
  {
    name: '박현우',
    school: '연세대학교 · 경영학과 · 21학번',
    tag: '보컬 지원',
    tagColor: { bg: '#EEF2FF', color: '#4051B5', border: '#c7d2fe' },
    status: '검토중',
    statusClass: 'statusReview',
    time: '10분 전 제출',
    hasAvatar: true,
    active: true,
  },
  {
    name: '장서윤',
    initials: 'JS',
    school: '이화여자대학교 · 작곡과 · 23학번',
    tag: '키보드 지원',
    tagColor: { bg: '#FDF2F8', color: '#DB2777', border: '#FBCFE8' },
    status: '미열람',
    statusClass: 'statusUnread',
    time: '1시간 전 제출',
    active: false,
  },
  {
    name: '김지민',
    school: '서울대학교 · 기계공학과 · 20학번',
    tag: '베이스 지원',
    tagColor: { bg: '#EFF6FF', color: '#2563EB', border: '#BFDBFE' },
    status: '서류 합격',
    statusClass: 'statusPass',
    time: '어제',
    hasAvatar: true,
    active: false,
  },
  {
    name: '강현우',
    initials: 'KH',
    school: '홍익대학교 · 시각디자인과 · 19학번',
    tag: '보컬 지원',
    tagColor: { bg: '#EEF2FF', color: '#4051B5', border: '#c7d2fe' },
    status: '불합격',
    statusClass: 'statusFail',
    time: '2일 전',
    dimmed: true,
    active: false,
  },
  {
    name: '이승준',
    school: '한양대학교 · 실용음악과 · 22학번',
    tag: '드럼 지원',
    tagColor: { bg: '#FFF7ED', color: '#EA580C', border: '#FED7AA' },
    status: '검토중',
    statusClass: 'statusReview',
    time: '2일 전',
    hasAvatar: true,
    active: false,
  },
];

export default function ApplicantManagementPage() {
  return (
    <div className={styles.page}>
      {/* Left Panel: List */}
      <section className={styles.listPanel}>
        <div className={styles.listHeader}>
          <div className={styles.listHeaderTop}>
            <div>
              <h2 className={styles.listTitle}>지원자 목록</h2>
              <p className={styles.listSubtitle}>SoundWave 5기 보컬/세션 모집</p>
            </div>
            <div className={styles.listActions}>
              <button className={styles.filterBtn}>
                <Filter size={16} /> 필터
              </button>
              <button className={styles.exportBtn}>
                <Download size={16} /> 엑셀 다운로드
              </button>
            </div>
          </div>
          <div className={styles.statusTabs}>
            <button className={styles.statusTabActive}>전체 (42)</button>
            <button className={styles.statusTabInactive}>검토중 (15)</button>
            <button className={styles.statusTabInactive}>합격 (8)</button>
            <button className={styles.statusTabInactive}>불합격 (19)</button>
          </div>
        </div>

        <div className={styles.applicantList}>
          {applicants.map((app, idx) => (
            <div
              key={idx}
              className={
                app.active
                  ? styles.applicantCardActive
                  : app.dimmed
                  ? styles.applicantCardDimmed
                  : styles.applicantCard
              }
            >
              <div className={styles.applicantCardInner}>
                <div className={styles.applicantLeft}>
                  <div className={styles.applicantAvatar} style={{
                    background: app.initials
                      ? `linear-gradient(135deg, hsl(${idx * 60}, 60%, 85%), hsl(${idx * 60 + 30}, 50%, 75%))`
                      : `linear-gradient(135deg, hsl(${idx * 50 + 200}, 60%, 65%), hsl(${idx * 50 + 240}, 70%, 55%))`,
                    ...(app.initials ? { display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#4B5563' } : {}),
                  }}>
                    {app.initials && app.initials}
                    {app.active && (
                      <div className={styles.applicantCheckBadge}>
                        <CheckCircle size={16} style={{ color: '#22C55E' }} />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className={styles.applicantName}>
                      <span className={styles.applicantNameText}>{app.name}</span>
                      <span
                        className={styles.applicantTag}
                        style={{
                          background: app.tagColor.bg,
                          color: app.tagColor.color,
                          border: `1px solid ${app.tagColor.border}`,
                        }}
                      >
                        {app.tag}
                      </span>
                    </div>
                    <div className={styles.applicantSchool}>{app.school}</div>
                  </div>
                </div>
                <div className={styles.applicantRight}>
                  <span className={`${styles.applicantStatus} ${styles[app.statusClass]}`}>
                    {app.status}
                  </span>
                  <div className={styles.applicantTime}>{app.time}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Right Panel: Detail */}
      <aside className={styles.detailPanel}>
        <div className={styles.detailHeader}>
          <div className={styles.detailHeaderLeft}>
            <button className={styles.detailCloseBtn}><X size={20} /></button>
            <span className={styles.detailLabel}>상세 검토</span>
          </div>
          <div className={styles.detailHeaderRight}>
            <button className={styles.detailHeaderBtn}><Printer size={18} /></button>
            <button className={styles.detailHeaderBtn}><Share2 size={18} /></button>
            <button className={styles.detailHeaderBtn}><MoreVertical size={18} /></button>
          </div>
        </div>

        <div className={styles.detailBody}>
          {/* Profile */}
          <div className={styles.detailProfile}>
            <div className={styles.detailProfileTop}>
              <div className={styles.detailAvatar} />
              <div className={styles.detailProfileInfo}>
                <div className={styles.detailProfileNameRow}>
                  <span className={styles.detailProfileName}>박현우</span>
                  <span className={styles.detailProfileStatus} style={{ background: '#FEF3C7', color: '#92400E' }}>
                    검토중
                  </span>
                </div>
                <div className={styles.detailProfileTags}>
                  <span className={styles.detailProfileTag}>연세대학교</span>
                  <span className={styles.detailProfileTag}>경영학과</span>
                  <span className={styles.detailProfileTag}>21학번</span>
                </div>
                <div className={styles.detailProfileContact}>
                  <span className={styles.detailProfileContactItem}>
                    <Phone size={14} /> 010-1234-5678
                  </span>
                  <span className={styles.detailProfileContactItem}>
                    <Mail size={14} /> hyunwoo@yonsei.ac.kr
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.detailProfileActions}>
              <button className={styles.chatBtn}>
                <MessageSquare size={18} /> 채팅하기
              </button>
              <button className={styles.statusChangeBtn}>
                상태 변경 <ChevronDown size={16} />
              </button>
            </div>
          </div>

          {/* QA Section */}
          <div className={styles.qaSection}>
            <div>
              <div className={styles.qaLabel}>
                <FileEdit size={16} /> 지원 동기
              </div>
              <div className={styles.qaCard}>
                <h4 className={styles.qaQuestion}>Q1. 동아리에 지원하게 된 계기가 무엇인가요?</h4>
                <p className={styles.qaAnswer}>
                  안녕하세요, 저는 평소 밴드 음악을 즐겨 듣고 코인노래방을 제 집처럼 드나드는 박현우입니다.
                  대학교 입학 후 밴드 동아리 활동을 꼭 해보고 싶었는데, 학업에 치여 미루다가 이번 5기 모집 공고를 보고 용기내어 지원하게 되었습니다.
                  특히 SoundWave의 지난 축제 공연 영상을 보고 열정적인 분위기에 반했습니다.
                </p>
              </div>
            </div>

            <div>
              <div className={styles.qaLabel}>
                <Mic size={16} /> 활동 경험
              </div>
              <div className={styles.qaCard}>
                <h4 className={styles.qaQuestion}>Q2. 관련된 음악 활동 경험이 있다면 구체적으로 서술해주세요.</h4>
                <p className={styles.qaAnswer}>
                  고등학교 시절 교내 밴드부 &apos;하모니&apos;에서 2년간 메인 보컬로 활동했습니다. 학교 축제 및 지역 청소년 가요제에 참가하여 은상을 수상한 경험이 있습니다.
                  주로 버즈, YB, 데이식스의 곡들을 커버했으며, 기본적인 발성 연습과 무대 매너에 대해 꾸준히 공부해왔습니다.
                </p>
              </div>
            </div>

            <div>
              <div className={styles.qaLabel}>
                <FileText size={16} /> 포트폴리오
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className={styles.fileItem}>
                  <div className={styles.fileItemIcon} style={{ background: '#FEE2E2', color: '#EF4444' }}>
                    <Youtube size={20} />
                  </div>
                  <div className={styles.fileItemInfo}>
                    <div className={styles.fileItemName}>노래 연습 영상_데이식스_한페이지가될수있게.mp4</div>
                    <div className={styles.fileItemMeta}>24.5 MB · 2024.03.15</div>
                  </div>
                  <Download size={18} style={{ color: '#9CA3AF', flexShrink: 0 }} />
                </div>
                <div className={styles.fileItem}>
                  <div className={styles.fileItemIcon} style={{ background: '#DBEAFE', color: '#3B82F6' }}>
                    <FileText size={20} />
                  </div>
                  <div className={styles.fileItemInfo}>
                    <div className={styles.fileItemName}>자기소개서_상세.pdf</div>
                    <div className={styles.fileItemMeta}>1.2 MB · 2024.03.15</div>
                  </div>
                  <Download size={18} style={{ color: '#9CA3AF', flexShrink: 0 }} />
                </div>
              </div>
            </div>

            <div>
              <div className={styles.qaLabel}>
                <Lock size={16} /> 운영진 메모
              </div>
              <div className={styles.memoBox}>
                <div className={styles.memoHeader}>
                  <div className={styles.memoAvatar} />
                  <div>
                    <div className={styles.memoAuthor}>이다은 (운영진)</div>
                    <div className={styles.memoTime}>20분 전</div>
                  </div>
                </div>
                <p className={styles.memoText}>
                  음색이 우리 밴드랑 잘 어울릴 것 같아. 영상 봤는데 고음 처리도 깔끔하고. 면접 때 즉흥곡 요청해봐도 좋을 듯!
                </p>
                <div className={styles.memoInputRow}>
                  <input className={styles.memoInput} placeholder="메모를 입력하세요..." />
                  <button className={styles.memoSubmitBtn}>등록</button>
                </div>
              </div>
            </div>

            <div style={{ height: 80 }} />
          </div>
        </div>

        <div className={styles.detailFooter}>
          <button className={styles.detailFooterNav}>
            <ChevronLeft size={18} /> 이전 지원자
          </button>
          <span className={styles.detailFooterCount}>15 / 42</span>
          <button className={styles.detailFooterNav}>
            다음 지원자 <ChevronRight size={18} />
          </button>
        </div>
      </aside>
    </div>
  );
}
