'use client';

import React, { useState } from 'react';
import styles from './StatsPage.module.css';
import {
  Users, Activity, TrendingUp, MessageSquare,
  ArrowUpRight, ArrowDownRight, Minus,
} from 'lucide-react';

const dauData = [
  { label: '1월', value: 42 },
  { label: '2월', value: 55 },
  { label: '3월', value: 48 },
  { label: '4월', value: 68 },
  { label: '5월', value: 72 },
  { label: '6월', value: 65 },
  { label: '7월', value: 58 },
  { label: '8월', value: 45 },
  { label: '9월', value: 78 },
  { label: '10월', value: 85 },
  { label: '11월', value: 92 },
  { label: '12월', value: 100 },
];

const boardRanking = [
  { rank: 1, name: '컴퓨터공학과', posts: 3420, views: 89200, trend: 'up', change: '+12.3%', ratio: 100 },
  { rank: 2, name: '경영학과', posts: 2890, views: 72100, trend: 'up', change: '+8.1%', ratio: 84 },
  { rank: 3, name: '자유게시판', posts: 2540, views: 68400, trend: 'flat', change: '0.0%', ratio: 74 },
  { rank: 4, name: 'AI/ML', posts: 1980, views: 54300, trend: 'up', change: '+23.5%', ratio: 58 },
  { rank: 5, name: '전자전기공학부', posts: 1560, views: 41200, trend: 'down', change: '-3.2%', ratio: 46 },
];

const donutData = [
  { label: '학과 보드', value: 42, color: '#4051B5' },
  { label: '관심사 보드', value: 28, color: '#7C3AED' },
  { label: '그룹 게시판', value: 18, color: '#059669' },
  { label: '기타', value: 12, color: '#D1D5DB' },
];

export default function StatsPage() {
  const [period, setPeriod] = useState('weekly');
  const maxVal = Math.max(...dauData.map(d => d.value));

  // SVG donut
  const total = donutData.reduce((a, b) => a + b.value, 0);
  const donutSegments = donutData.map((d, index) => {
    const previousValue = donutData.slice(0, index).reduce((sum, item) => sum + item.value, 0);
    const percent = d.value / total;
    const startAngle = (previousValue / total) * 360;
    const endAngle = ((previousValue + d.value) / total) * 360;
    const x1 = 50 + 40 * Math.cos((Math.PI / 180) * (startAngle - 90));
    const y1 = 50 + 40 * Math.sin((Math.PI / 180) * (startAngle - 90));
    const x2 = 50 + 40 * Math.cos((Math.PI / 180) * (endAngle - 90));
    const y2 = 50 + 40 * Math.sin((Math.PI / 180) * (endAngle - 90));
    const largeArc = percent > 0.5 ? 1 : 0;
    return { ...d, path: `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z` };
  });

  return (
    <>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>통계 지표</h1>
          <p className={styles.pageSubtitle}>DAU/WAU/MAU, 신고율, 그룹 전환율 등 핵심 운영 지표를 확인합니다.</p>
        </div>
        <div className={styles.periodSelector}>
          {['daily', 'weekly', 'monthly'].map(p => (
            <button
              key={p}
              className={period === p ? styles.periodBtnActive : styles.periodBtn}
              onClick={() => setPeriod(p)}
            >
              {p === 'daily' ? '일별' : p === 'weekly' ? '주별' : '월별'}
            </button>
          ))}
        </div>
      </div>

      {/* Top Stats */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statTop}>
            <div className={`${styles.statIcon} ${styles.statIconBlue}`}><Users size={20} /></div>
            <span className={`${styles.statChange} ${styles.statChangeGreen}`}><TrendingUp size={14} /> +5.2%</span>
          </div>
          <div className={styles.statLabel}>DAU (일간 활성)</div>
          <div className={styles.statValue}>12,540</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTop}>
            <div className={`${styles.statIcon} ${styles.statIconGreen}`}><Activity size={20} /></div>
            <span className={`${styles.statChange} ${styles.statChangeGreen}`}><TrendingUp size={14} /> +2.1%</span>
          </div>
          <div className={styles.statLabel}>WAU (주간 활성)</div>
          <div className={styles.statValue}>45,200</div>
        </div>
        <div className={styles.statCardPrimary}>
          <div className={styles.statTop}>
            <div className={`${styles.statIcon} ${styles.statIconWhite}`}><Users size={20} /></div>
            <span className={`${styles.statChange} ${styles.statChangeWhite}`}><TrendingUp size={14} /> +8.7%</span>
          </div>
          <div className={styles.statLabel}>MAU (월간 활성)</div>
          <div className={styles.statValue}>128,400</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTop}>
            <div className={`${styles.statIcon} ${styles.statIconPurple}`}><MessageSquare size={20} /></div>
            <span className={`${styles.statChange} ${styles.statChangeGreen}`}><TrendingUp size={14} /> +15.3%</span>
          </div>
          <div className={styles.statLabel}>일간 게시글</div>
          <div className={styles.statValue}>2,847</div>
        </div>
      </div>

      {/* Charts */}
      <div className={styles.cardsGrid}>
        {/* Monthly DAU Chart */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h2 className={styles.cardTitle}>월별 활성 유저 추이</h2>
              <p className={styles.cardSubtitle}>최근 12개월 DAU 변화입니다.</p>
            </div>
            <select className={styles.cardSelect}>
              <option>DAU</option>
              <option>WAU</option>
              <option>MAU</option>
            </select>
          </div>
          <div className={styles.chartArea}>
            {dauData.map((d, i) => (
              <div key={i} className={styles.chartBar}>
                <div
                  className={styles.chartBarInner}
                  style={{
                    height: `${(d.value / maxVal) * 180}px`,
                    background: i === dauData.length - 1
                      ? 'linear-gradient(180deg, #4051B5, #5C6BC0)'
                      : '#E0E7FF',
                  }}
                />
                <span className={styles.chartBarLabel}>{d.label.replace('월', '')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Content Distribution Donut */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h2 className={styles.cardTitle}>콘텐츠 분포</h2>
              <p className={styles.cardSubtitle}>게시판 유형별 게시글 비율</p>
            </div>
          </div>
          <div className={styles.donutContainer}>
            <svg className={styles.donutChart} viewBox="0 0 100 100">
              {donutSegments.map((s, i) => (
                <path key={i} d={s.path} fill={s.color} />
              ))}
              <circle cx="50" cy="50" r="22" fill="white" />
              <text x="50" y="47" textAnchor="middle" fontSize="12" fontWeight="800" fill="#111218">100%</text>
              <text x="50" y="58" textAnchor="middle" fontSize="7" fill="#6B7280">전체</text>
            </svg>
            <div className={styles.donutLegend}>
              {donutData.map(d => (
                <div key={d.label} className={styles.donutLegendItem}>
                  <div className={styles.donutLegendDot} style={{ background: d.color }} />
                  <span className={styles.donutLegendLabel}>{d.label}</span>
                  <span className={styles.donutLegendValue}>{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Board Ranking */}
        <div className={styles.cardFull}>
          <div className={styles.cardHeader}>
            <div>
              <h2 className={styles.cardTitle}>보드 활성도 랭킹</h2>
              <p className={styles.cardSubtitle}>게시글 수 기준 상위 보드</p>
            </div>
            <select className={styles.cardSelect}>
              <option>게시글 수</option>
              <option>조회수</option>
              <option>댓글 수</option>
            </select>
          </div>
          <table className={styles.rankTable}>
            <thead>
              <tr>
                <th style={{ width: 60 }}>순위</th>
                <th>보드명</th>
                <th>게시글</th>
                <th>조회수</th>
                <th>변동</th>
                <th style={{ width: 200 }}>비율</th>
              </tr>
            </thead>
            <tbody>
              {boardRanking.map(b => (
                <tr key={b.rank}>
                  <td>
                    <div className={`${styles.rankNumber} ${
                      b.rank === 1 ? styles.rankGold :
                      b.rank === 2 ? styles.rankSilver :
                      b.rank === 3 ? styles.rankBronze :
                      styles.rankNormal
                    }`}>
                      {b.rank}
                    </div>
                  </td>
                  <td style={{ fontWeight: 700 }}>{b.name}</td>
                  <td style={{ fontWeight: 600 }}>{b.posts.toLocaleString()}</td>
                  <td style={{ color: '#6B7280' }}>{b.views.toLocaleString()}</td>
                  <td>
                    <span className={`${styles.trendBadge} ${
                      b.trend === 'up' ? styles.trendUp :
                      b.trend === 'down' ? styles.trendDown :
                      styles.trendFlat
                    }`}>
                      {b.trend === 'up' ? <ArrowUpRight size={12} /> :
                       b.trend === 'down' ? <ArrowDownRight size={12} /> :
                       <Minus size={12} />}
                      {b.change}
                    </span>
                  </td>
                  <td>
                    <div className={styles.barChart}>
                      <div className={styles.barChartFill} style={{ width: `${b.ratio}%` }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
