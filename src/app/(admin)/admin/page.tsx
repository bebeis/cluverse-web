'use client';

import React, { useState } from 'react';
import styles from './AdminDashboard.module.css';
import {
  Users, Activity, UserPlus, CheckCircle,
  TrendingUp, AlertTriangle, EyeOff, Ban,
  Gavel, Clock,
} from 'lucide-react';

const chartData = [
  { day: '월', value: 45 },
  { day: '화', value: 62 },
  { day: '수', value: 38 },
  { day: '목', value: 55 },
  { day: '금', value: 70 },
  { day: '토', value: 48 },
  { day: '일', value: 85, today: true },
];

const reportRows = [
  { id: '#29381', type: 'comment', typeLabel: '댓글', preview: '"이런 글은 왜 올리는..."', reporter: 'user_123', reason: '욕설/비방', time: '10분 전', status: 'new' },
  { id: '#9122', type: 'post', typeLabel: '게시글', preview: '광고성 홍보글입니다.', reporter: 'clean_bot', reason: '스팸/홍보', time: '23분 전', status: 'review' },
  { id: '#4412', type: 'chat', typeLabel: '채팅', preview: '개인정보 요구', reporter: 'safe_guard', reason: '개인정보', time: '1시간 전', status: 'done' },
];

export default function AdminDashboardPage() {
  const [selectedAction, setSelectedAction] = useState('warn');
  const [banDuration, setBanDuration] = useState('permanent');
  const [tableFilter, setTableFilter] = useState('pending');

  const maxVal = Math.max(...chartData.map(d => d.value));

  return (
    <>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>운영 현황 대시보드</h1>
          <p className={styles.pageSubtitle}>오늘의 주요 지표와 처리해야 할 이슈를 확인하세요.</p>
        </div>
        <div className={styles.updateTag}>
          <Clock size={14} />
          최근 업데이트: 지금 막
        </div>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statTop}>
            <div className={`${styles.statIcon} ${styles.statIconBlue}`}><Users size={20} /></div>
            <span className={`${styles.statChange} ${styles.statChangeUp}`}><TrendingUp size={14} /> +5.2%</span>
          </div>
          <div className={styles.statLabel}>DAU (일간 활성 유저)</div>
          <div className={styles.statValue}>12,540</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTop}>
            <div className={`${styles.statIcon} ${styles.statIconGreen}`}><Activity size={20} /></div>
            <span className={`${styles.statChange} ${styles.statChangeUp}`}><TrendingUp size={14} /> +2.1%</span>
          </div>
          <div className={styles.statLabel}>WAU (주간 활성 유저)</div>
          <div className={styles.statValue}>45,200</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTop}>
            <div className={`${styles.statIcon} ${styles.statIconPurple}`}><UserPlus size={20} /></div>
            <span className={`${styles.statChange} ${styles.statChangeUp}`}><TrendingUp size={14} /> +12.5%</span>
          </div>
          <div className={styles.statLabel}>신규 가입자</div>
          <div className={styles.statValue}>1,230</div>
        </div>
        <div className={styles.statCardPrimary}>
          <div className={styles.statTop}>
            <div className={`${styles.statIcon} ${styles.statIconWhite}`}><CheckCircle size={20} /></div>
            <span className={`${styles.statChange} ${styles.statChangeUpWhite}`}>92% 완료</span>
          </div>
          <div className={styles.statLabel}>신고 처리율</div>
          <div className={styles.statValue}>15/163 건</div>
        </div>
      </div>

      {/* Main Layout */}
      <div className={styles.layoutGrid}>
        {/* Left Column */}
        <div>
          {/* Chart */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <h2 className={styles.cardTitle}>주간 신고 처리 추이</h2>
                <p className={styles.cardSubtitle}>지난 7일간의 신고 접수 및 처리 현황입니다.</p>
              </div>
              <select className={styles.cardSelect}>
                <option>최근 7일</option>
                <option>최근 30일</option>
              </select>
            </div>
            <div className={styles.chartContainer}>
              {chartData.map((d, i) => (
                <div key={i} className={styles.chartBar}>
                  <div
                    className={styles.chartBarInner}
                    style={{
                      height: `${(d.value / maxVal) * 200}px`,
                      background: d.today
                        ? 'linear-gradient(180deg, #4051B5, #5C6BC0)'
                        : '#E0E7FF',
                    }}
                  >
                    {d.today && <span className={styles.chartBarToday}>Today</span>}
                  </div>
                  <span className={styles.chartBarLabel}>{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Report Table */}
          <div className={styles.tableCard}>
            <div className={styles.tableHeader}>
              <div>
                <h2 className={styles.cardTitle}>신고 접수 현황</h2>
                <p className={styles.cardSubtitle}>실시간으로 접수된 신고 내역입니다.</p>
              </div>
              <div className={styles.tableTabs}>
                <button
                  className={tableFilter === 'all' ? styles.tableTabBtnActive : styles.tableTabBtn}
                  onClick={() => setTableFilter('all')}
                >전체보기</button>
                <button
                  className={tableFilter === 'pending' ? styles.tableTabBtnActive : styles.tableTabBtn}
                  onClick={() => setTableFilter('pending')}
                >● 미처리 건</button>
              </div>
            </div>

            <table className={styles.table}>
              <thead>
                <tr>
                  <th>대상</th>
                  <th>신고자</th>
                  <th>사유</th>
                  <th>접수 시간</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {reportRows.map(row => (
                  <tr key={row.id}>
                    <td>
                      <div className={styles.tableTarget}>
                        <span className={`${styles.tableTargetDot} ${
                          row.type === 'comment' ? styles.tableTargetDotRed :
                          row.type === 'post' ? styles.tableTargetDotBlue :
                          styles.tableTargetDotPurple
                        }`} />
                        <div className={styles.tableTargetInfo}>
                          <div className={styles.tableTargetId}>{row.typeLabel} {row.id}</div>
                          <div className={styles.tableTargetPreview}>{row.preview}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className={styles.tableUser}>
                        <div className={styles.tableUserAvatar}>{row.reporter[0].toUpperCase()}</div>
                        {row.reporter}
                      </div>
                    </td>
                    <td className={styles.tableReason}>{row.reason}</td>
                    <td className={styles.tableTime}>{row.time}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${
                        row.status === 'new' ? styles.statusNew :
                        row.status === 'review' ? styles.statusReview :
                        styles.statusDone
                      }`}>
                        {row.status === 'new' ? '접수' : row.status === 'review' ? '검토중' : '조치완료'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Panel — Detail */}
        <div className={styles.detailPanel}>
          <div className={styles.detailBadgeRow}>
            <span className={styles.detailNewBadge}>NEW</span>
            <span className={styles.detailId}>#REPORT-29381</span>
            <span className={styles.detailDate}>2023.10.25 14:30</span>
          </div>

          <h3 className={styles.detailTitle}>상세 검토 및 조치</h3>

          {/* Reported content */}
          <div className={styles.detailSectionLabel}>
            <span>신고 대상 (댓글)</span>
            <span className={styles.detailLink}>원본 보기</span>
          </div>

          <div className={styles.reportedContent}>
            <div className={styles.reportedUser}>
              <div className={styles.reportedAvatar}>B</div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className={styles.reportedName}>bad_user_99</span>
                  <span className={styles.reportedWarningBadge}>경고 2회</span>
                </div>
                <div className={styles.reportedDate}>작성: 2023.10.25 14:15</div>
              </div>
            </div>
            <div className={styles.reportedText}>
              야 이 멍청한 놈아, 생각이란 걸 좀 하고 글을 써라. 진짜 한심하네 ㅋㅋ
            </div>
          </div>

          {/* Reporter info */}
          <div className={styles.reporterInfo}>
            <div className={styles.reporterCol}>
              <div className={styles.reporterColLabel}>신고자</div>
              <div className={styles.reporterColValue}>
                <Users size={14} /> user_123
              </div>
            </div>
            <div className={styles.reporterCol}>
              <div className={styles.reporterColLabel}>신고 사유</div>
              <div className={`${styles.reporterColValue} ${styles.reporterColValueRed}`}>
                <AlertTriangle size={14} /> 욕설 및 비방
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className={styles.actionSection}>
            <div className={styles.actionSectionTitle}>
              <Gavel size={16} /> 조치 실행
            </div>
            <div className={styles.actionList}>
              <div
                className={selectedAction === 'warn' ? styles.actionCardSelected : styles.actionCard}
                onClick={() => setSelectedAction('warn')}
              >
                <div className={`${styles.actionIcon} ${styles.actionIconWarn}`}>
                  <AlertTriangle size={16} />
                </div>
                <div className={styles.actionInfo}>
                  <div className={styles.actionTitle}>경고 발송</div>
                  <div className={styles.actionDesc}>유저에게 경고 목적를 발송합니다.</div>
                </div>
                <div className={selectedAction === 'warn' ? styles.actionRadioChecked : styles.actionRadio}>
                  {selectedAction === 'warn' && <div className={styles.actionRadioDot} />}
                </div>
              </div>

              <div
                className={selectedAction === 'blind' ? styles.actionCardSelected : styles.actionCard}
                onClick={() => setSelectedAction('blind')}
              >
                <div className={`${styles.actionIcon} ${styles.actionIconBlind}`}>
                  <EyeOff size={16} />
                </div>
                <div className={styles.actionInfo}>
                  <div className={styles.actionTitle}>콘텐츠 블라인드</div>
                  <div className={styles.actionDesc}>해당 콘텐츠를 숨김 처리합니다.</div>
                </div>
                <div className={selectedAction === 'blind' ? styles.actionRadioChecked : styles.actionRadio}>
                  {selectedAction === 'blind' && <div className={styles.actionRadioDot} />}
                </div>
              </div>

              <div
                className={selectedAction === 'ban' ? styles.actionCardDanger : styles.actionCard}
                onClick={() => setSelectedAction('ban')}
              >
                <div className={`${styles.actionIcon} ${styles.actionIconBan}`}>
                  <Ban size={16} />
                </div>
                <div className={styles.actionInfo}>
                  <div className={styles.actionTitle}>계정 정지 처분(강력 조치)</div>
                  <div className={styles.actionDesc}>유저 계정을 일시/영구 정지합니다.</div>
                </div>
                <div className={selectedAction === 'ban' ? styles.actionRadioChecked : styles.actionRadio}>
                  {selectedAction === 'ban' && <div className={styles.actionRadioDot} />}
                </div>
              </div>
            </div>

            {selectedAction === 'ban' && (
              <div className={styles.banDuration}>
                {['7일', '30일', '영구 정지'].map(d => (
                  <button
                    key={d}
                    className={banDuration === d ? styles.banDurationBtnActive : styles.banDurationBtn}
                    onClick={() => setBanDuration(d)}
                  >{d}</button>
                ))}
              </div>
            )}
          </div>

          {/* Memo */}
          <div className={styles.memoSection}>
            <div className={styles.memoLabel}>관리자 메모</div>
            <textarea
              className={styles.memoTextarea}
              placeholder="조치 사유나 특이사항을 기록하세요."
            />
          </div>

          {/* Footer */}
          <div className={styles.detailFooter}>
            <button className={styles.dismissBtn}>반려 (무혐의)</button>
            <button className={styles.confirmBtn}>
              <CheckCircle size={16} /> 처리 완료
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
