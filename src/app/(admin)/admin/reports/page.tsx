'use client';

import React from 'react';
import styles from './ReportDetail.module.css';
import {
  ChevronRight, User, ExternalLink, MessageSquare,
  Clock, AlertTriangle, Ban, Trash2, CheckCircle2,
  X, FileText, RefreshCw, ChevronDown,
} from 'lucide-react';

export default function ReportDetailPage() {
  return (
    <>
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb}>
        <a href="/admin" className={styles.breadcrumbLink}>홈</a>
        <ChevronRight size={14} />
        <a href="/admin/reports" className={styles.breadcrumbLink}>신고 관리</a>
        <ChevronRight size={14} />
        <span className={styles.breadcrumbCurrent}>신고 #10234</span>
      </nav>

      <div className={styles.layout}>
        {/* Left Column */}
        <div>
          {/* Main Report Card */}
          <div className={styles.reportCard}>
            <div className={styles.reportCardHeader}>
              <div>
                <span className={styles.reportStatusBadge}>● 신고 접수</span>
                <span className={styles.reportDate}>2026-02-27 14:30:10 KST</span>
              </div>
              <span className={styles.reportId}>ID: #10234</span>
            </div>

            <h1 className={styles.reportTitle}>욕설 및 비하 발언 포함</h1>

            <div className={styles.reportMeta}>
              <div className={styles.reportReporter}>
                <User size={16} /> 신고자: user_992 (한국대)
              </div>
              <a href="#" className={styles.reportOriginalLink}>
                원본 보기 <ExternalLink size={14} />
              </a>
            </div>

            {/* Content Timeline */}
            <div className={styles.timelineSection}>
              <div className={styles.timelineSectionTitle}>
                <MessageSquare size={16} /> 맥락 타임라인
                <span className={styles.timelineSectionMeta}>게시판: 자유게시판 &gt; 우리학교</span>
              </div>

              <div className={styles.timeline}>
                <div className={styles.timelineLine} />

                {/* Comment 1 */}
                <div className={styles.timelineItem}>
                  <div className={styles.timelineDot} />
                  <div className={styles.timelineComment}>
                    <div className={styles.timelineCommentHeader}>
                      <div className={styles.timelineAvatar}>행</div>
                      <span className={styles.timelineName}>행복한대학생</span>
                      <span className={styles.timelineTime}>14:20</span>
                    </div>
                    <div className={styles.timelineText}>
                      이번 축제 라인업 진짜 별로지 않나? 등록금이 아깝다 진짜.
                    </div>
                  </div>
                </div>

                {/* Reported Comment */}
                <div className={styles.timelineItem}>
                  <div className={styles.timelineDotReported} />
                  <div className={styles.timelineCommentReported}>
                    <div className={styles.timelineCommentHeader}>
                      <div className={styles.timelineAvatarReported}>익</div>
                      <span className={styles.timelineName}>익명_불만러</span>
                      <span className={styles.timelineAuthorBadge}>작성자</span>
                      <span className={styles.timelineReportedBadge}>
                        <AlertTriangle size={12} /> 신고 대상
                      </span>
                    </div>
                    <div className={styles.timelineText}>
                      &quot;야 이 <span className={styles.timelineHighlight}>**들</span>아 니들이 뭘 안다고 떠드냐? 학교 수준 알만하다 ㅋㅋ 그냥 자퇴나 해라 <span className={styles.timelineHighlight}>**들</span>아.&quot;
                    </div>
                    <div className={styles.timelinePostMeta}>
                      <span>게시판: 자유게시판 &gt; 우리학교</span>
                      <span>👍 2</span>
                      <span>💬 14</span>
                    </div>
                  </div>
                </div>

                {/* Comment 3 */}
                <div className={styles.timelineItem}>
                  <div className={styles.timelineDot} />
                  <div className={styles.timelineComment}>
                    <div className={styles.timelineCommentHeader}>
                      <div className={styles.timelineAvatar}>지</div>
                      <span className={styles.timelineName}>지나가던행인</span>
                      <span className={styles.timelineTime}>14:28</span>
                    </div>
                    <div className={styles.timelineText}>
                      말이 너무 심하시네요. 신고하겠습니다.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sanction History */}
          <div className={styles.sanctionCard}>
            <div className={styles.sanctionHeader}>
              <div className={styles.sanctionTitle}>
                <Clock size={18} /> 대상 유저 제재 이력
                <span className={styles.sanctionUserId}>(익명_불만러 / User_ID: 8821)</span>
              </div>
              <span className={styles.sanctionLink}>전체 이력 보기</span>
            </div>

            <table className={styles.sanctionTable}>
              <thead>
                <tr>
                  <th>일자</th>
                  <th>위반 항목</th>
                  <th>조치 결과</th>
                  <th>처리자</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>2025.11.12</td>
                  <td>스팸/홍보성 도배</td>
                  <td><span className={`${styles.sanctionBadge} ${styles.sanctionWarn}`}>경고 1회</span></td>
                  <td>Admin_B</td>
                </tr>
                <tr>
                  <td>2025.08.04</td>
                  <td>욕설/비하 발언</td>
                  <td><span className={`${styles.sanctionBadge} ${styles.sanctionBan}`}>3일 정지</span></td>
                  <td>Admin_A</td>
                </tr>
              </tbody>
            </table>

            <div className={styles.warningAlert}>
              <AlertTriangle size={18} className={styles.warningAlertIcon} />
              <div>
                <div className={styles.warningAlertTitle}>가중 처벌 권장 대상</div>
                <div className={styles.warningAlertText}>
                  최근 6개월 내 동종 위반 이력이 존재합니다. 내부 규정에 따라 가중 처벌이 권장됩니다.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div>
          {/* Action Panel */}
          <div className={styles.actionPanel}>
            <div className={styles.actionPanelHeader}>
              <h2 className={styles.actionPanelTitle}>신고 처리</h2>
              <div className={styles.actionPanelDot} />
            </div>

            <div className={styles.memoLabel}>처리 사유 및 메모</div>
            <textarea
              className={styles.memoTextarea}
              placeholder="제재 사유 또는 반려 사유를 상세히 입력하세요..."
            />

            <div className={styles.sanctionSectionLabel}>제재 조치 (RED)</div>
            <div className={styles.sanctionActions}>
              <button className={styles.sanctionActionDanger}>
                <div className={styles.sanctionActionIcon}>
                  <Ban size={18} />
                </div>
                <div className={styles.sanctionActionInfo}>
                  <div className={styles.sanctionActionTitle}>게시글 삭제 + 7일 정지</div>
                  <div className={styles.sanctionActionDesc}>가중 처벌 적용</div>
                </div>
              </button>
              <button className={styles.sanctionActionWarn}>
                <div className={styles.sanctionActionIcon}>
                  <Trash2 size={18} />
                </div>
                <div className={styles.sanctionActionInfo}>
                  <div className={styles.sanctionActionTitle}>게시글만 삭제</div>
                  <div className={styles.sanctionActionDesc}>경고 메시지 발송</div>
                </div>
              </button>
            </div>

            <div className={styles.sanctionSectionLabel}>반려 조치 (BLUE)</div>
            <div className={styles.sanctionActions}>
              <button className={styles.sanctionActionDismiss}>
                <div className={styles.sanctionActionIcon}>
                  <CheckCircle2 size={18} />
                </div>
                <div className={styles.sanctionActionInfo}>
                  <div className={styles.sanctionActionTitle}>신고 반려 (무혐의)</div>
                  <div className={styles.sanctionActionDesc}>위반 사항 없음</div>
                </div>
              </button>
            </div>
          </div>

          {/* Audit Log */}
          <div className={styles.auditLog}>
            <div className={styles.auditLogTitle}>
              <FileText size={18} /> 감사 로그
              <RefreshCw size={14} style={{ marginLeft: 'auto', color: '#9CA3AF', cursor: 'pointer' }} />
            </div>

            <div className={styles.auditTimeline}>
              <div className={styles.auditEntry}>
                <div className={`${styles.auditDot} ${styles.auditDotGreen}`} />
                <div className={styles.auditContent}>
                  <div className={styles.auditContentHeader}>
                    <span className={styles.auditActor}>System</span>
                    <span className={styles.auditTime}>14:35:12</span>
                    <span className={`${styles.auditBadge} ${styles.auditBadgeAuto}`}>AUTO</span>
                  </div>
                  <div className={styles.auditDesc}>
                    신고 자동 분류 수행: <span className={styles.auditDescHighlight}>높은 위험도</span>
                  </div>
                </div>
              </div>

              <div className={styles.auditEntry}>
                <div className={`${styles.auditDot} ${styles.auditDotBlue}`} />
                <div className={styles.auditContent}>
                  <div className={styles.auditContentHeader}>
                    <span className={styles.auditActor}>Admin_C</span>
                    <span className={styles.auditTime}>14:32:45</span>
                    <span className={`${styles.auditBadge} ${styles.auditBadgeStatus}`}>STATUS</span>
                  </div>
                  <div className={styles.auditDesc}>
                    상태 변경: <span className={styles.auditDescHighlightBlue}>검토 중</span>
                  </div>
                </div>
              </div>

              <div className={styles.auditEntry}>
                <div className={styles.auditDot} />
                <div className={styles.auditContent}>
                  <div className={styles.auditContentHeader}>
                    <span className={styles.auditActor}>user_992</span>
                    <span className={styles.auditTime}>14:30:10</span>
                    <span className={`${styles.auditBadge} ${styles.auditBadgeNew}`}>NEW</span>
                  </div>
                  <div className={styles.auditDesc}>
                    신고 접수 (사유: 욕설)
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.auditMore}>
              <button className={styles.auditMoreBtn}>
                전체 히스토리 보기 <ChevronDown size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
