'use client';

import React, { useState } from 'react';
import styles from './GroupManagement.module.css';
import {
  Users, UserPlus, ShieldCheck, AlertTriangle,
  Search, Eye, Lock, Settings,
} from 'lucide-react';

const statCards = [
  { icon: <Users size={18} />, cls: 'statIconBlue', label: '전체 그룹', value: '1,247', change: '+28 이번 주' },
  { icon: <UserPlus size={18} />, cls: 'statIconGreen', label: '활성 그룹', value: '1,089', change: '87.3%' },
  { icon: <ShieldCheck size={18} />, cls: 'statIconPurple', label: '비공개 그룹', value: '312', change: '25.0%' },
  { icon: <AlertTriangle size={18} />, cls: 'statIconYellow', label: '신고 접수', value: '18', change: '검토 필요' },
];

const groups = [
  { id: 1, name: 'AI 연구 스터디', category: '스터디', tags: ['AI', '딥러닝', 'NLP'], members: 32, posts: 156, recruits: 3, status: 'active', owner: '김민수', visibility: '공개', color: '#4051B5' },
  { id: 2, name: '창업 동아리 SEED', category: '동아리', tags: ['창업', '스타트업'], members: 48, posts: 234, recruits: 1, status: 'active', owner: '이서연', visibility: '공개', color: '#059669' },
  { id: 3, name: '웹개발 프로젝트', category: '프로젝트', tags: ['React', 'Next.js', 'TypeScript'], members: 6, posts: 42, recruits: 2, status: 'active', owner: '정현우', visibility: '일부공개', color: '#7C3AED' },
  { id: 4, name: '밴드 동아리 BEAT', category: '동아리', tags: ['음악', '밴드'], members: 24, posts: 87, recruits: 0, status: 'review', owner: '최예진', visibility: '공개', color: '#D97706' },
  { id: 5, name: '비밀 과외 그룹', category: '스터디', tags: ['과외', '불법'], members: 3, posts: 12, recruits: 0, status: 'suspended', owner: 'anonymous', visibility: '비공개', color: '#EF4444' },
  { id: 6, name: 'UX/UI 연구회', category: '스터디', tags: ['UX', 'UI', '디자인'], members: 18, posts: 93, recruits: 1, status: 'active', owner: '박준호', visibility: '공개', color: '#2563EB' },
];

export default function GroupManagementPage() {
  const [filter, setFilter] = useState('all');

  return (
    <>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>그룹 관리</h1>
          <p className={styles.pageSubtitle}>전체 그룹 현황, 강제 비공개/폐쇄, 오너 확인 등을 관리합니다.</p>
        </div>
      </div>

      <div className={styles.statsRow}>
        {statCards.map((s, i) => (
          <div key={i} className={styles.statCard}>
            <div className={styles.statTop}>
              <div className={`${styles.statIcon} ${styles[s.cls]}`}>{s.icon}</div>
              <span className={styles.statChange}>{s.change}</span>
            </div>
            <div className={styles.statLabel}>{s.label}</div>
            <div className={styles.statValue}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <Search size={16} className={styles.searchIcon} />
          <input className={styles.searchInput} placeholder="그룹명, 카테고리, 오너로 검색..." />
        </div>
        {['all', 'active', 'review', 'suspended'].map(f => (
          <button
            key={f}
            className={filter === f ? styles.filterBtnActive : styles.filterBtn}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? '전체' : f === 'active' ? '활성' : f === 'review' ? '검토' : '정지'}
          </button>
        ))}
      </div>

      <div className={styles.groupGrid}>
        {groups.map(g => (
          <div key={g.id} className={styles.groupCard}>
            <div className={styles.groupCardHeader}>
              <div className={styles.groupAvatar} style={{ background: g.color }}>
                {g.name[0]}
              </div>
              <span className={`${styles.groupStatusBadge} ${
                g.status === 'active' ? styles.groupActive :
                g.status === 'review' ? styles.groupReview :
                styles.groupSuspended
              }`}>
                {g.status === 'active' ? '활성' : g.status === 'review' ? '검토중' : '정지'}
              </span>
            </div>

            <div className={styles.groupName}>{g.name}</div>
            <div className={styles.groupCategory}>
              {g.category} · {g.visibility === '공개' ? (
                <><Eye size={12} style={{ display: 'inline', verticalAlign: -1 }} /> 공개</>
              ) : g.visibility === '비공개' ? (
                <><Lock size={12} style={{ display: 'inline', verticalAlign: -1 }} /> 비공개</>
              ) : (
                <><Eye size={12} style={{ display: 'inline', verticalAlign: -1 }} /> 일부공개</>
              )}
            </div>

            <div className={styles.groupTags}>
              {g.tags.map(t => <span key={t} className={styles.groupTag}>{t}</span>)}
            </div>

            <div className={styles.groupStats}>
              <div className={styles.groupStatItem}>
                <div className={styles.groupStatLabel}>멤버</div>
                <div className={styles.groupStatValue}>{g.members}</div>
              </div>
              <div className={styles.groupStatItem}>
                <div className={styles.groupStatLabel}>게시글</div>
                <div className={styles.groupStatValue}>{g.posts}</div>
              </div>
              <div className={styles.groupStatItem}>
                <div className={styles.groupStatLabel}>모집</div>
                <div className={styles.groupStatValue}>{g.recruits}</div>
              </div>
            </div>

            <div className={styles.groupFooter}>
              <div className={styles.groupOwner}>
                <div className={styles.groupOwnerAvatar}>{g.owner[0]}</div>
                {g.owner}
              </div>
              <div className={styles.groupActionBtns}>
                <button className={styles.groupActionBtn}><Eye size={13} /></button>
                <button className={styles.groupActionBtn}><Settings size={13} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
