'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronLeft, ChevronRight, Users, Eye } from 'lucide-react';
import { cluverseApi, GroupSummary } from '@/lib/cluverse-api';
import styles from './GroupExplore.module.css';

export default function GroupExplorePage() {
  const [groups, setGroups] = useState<GroupSummary[]>([]);

  useEffect(() => {
    cluverseApi.getGroups({ page: 1, size: 20 })
      .then(result => setGroups(result.groups))
      .catch(() => setGroups([]));
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>그룹 탐색</h1>
        <p className={styles.subtitle}>`/api/v1/groups` 실제 응답으로 렌더링합니다.</p>
      </div>

      <div className={styles.filterBar}>
        <div className={styles.filterBtns}>
          <button className={styles.filterDropdown}>
            카테고리: <strong>전체</strong>
            <ChevronDown size={18} />
          </button>
          <button className={styles.filterDropdown}>
            공개 범위: <strong>전체</strong>
            <ChevronDown size={18} />
          </button>
          <button className={styles.filterDropdown}>
            모집 상태: <strong>전체</strong>
            <ChevronDown size={18} />
          </button>
        </div>
      </div>

      <div className={styles.grid}>
        {groups.map(group => (
          <Link key={group.groupId} href={`/group/${group.groupId}`} className={styles.card}>
            <div className={styles.cardImage}>
              <span className={styles.cardBadge}>{group.category}</span>
              <img className={styles.cardImg} src={group.coverImageUrl || '/images/groups/photography-club-cover.png'} alt={group.name} />
              <div className={styles.cardGrad} />
              <div className={styles.cardOverlay}>
                <div className={styles.cardStat}>
                  <Users size={14} />
                  <span>{group.memberCount}/{group.maxMembers}</span>
                </div>
                <div className={styles.cardStat} style={{ opacity: 0.9 }}>
                  <Eye size={14} />
                  <span>{group.openRecruitmentCount}</span>
                </div>
              </div>
            </div>
            <div className={styles.cardBody}>
              <div>
                <h3 className={styles.cardTitle}>{group.name}</h3>
                <p className={styles.cardDesc}>{group.description}</p>
              </div>
              <div className={styles.tags}>
                {group.interests.map(tag => (
                  <span key={tag.interestId} className={styles.tag}>#{tag.name}</span>
                ))}
              </div>
              <div className={styles.cardFooter}>
                <div className={styles.recruitInfo}>
                  <div className={group.recruiting ? styles.recruitDot : styles.recruitDotClosed} />
                  <span className={styles.recruitLabel}>{group.activityType}</span>
                </div>
                <span className={group.recruiting ? styles.recruitRole : styles.recruitClosed}>
                  {group.recruiting ? '모집 중' : '모집 마감'}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className={styles.pagination}>
        <button className={styles.pageBtn}><ChevronLeft size={18} /></button>
        <button className={styles.pageBtnActive}>1</button>
        <button className={styles.pageBtn}><ChevronRight size={18} /></button>
      </div>
    </div>
  );
}
