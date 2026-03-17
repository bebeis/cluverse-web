'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, MoreVertical, Plus } from 'lucide-react';
import { AuthRequiredOverlay } from '@/components/ui/AuthRequiredOverlay';
import { ApiError, cluverseApi, GroupSummary } from '@/lib/cluverse-api';
import styles from './Groups.module.css';

export default function GroupsPage() {
  const [groups, setGroups] = useState<GroupSummary[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [authRequired, setAuthRequired] = useState(false);

  useEffect(() => {
    cluverseApi.getMyGroups()
      .then(data => {
        setGroups(data);
        setAuthRequired(false);
      })
      .catch(caught => {
        setAuthRequired(caught instanceof ApiError && caught.statusCode === 401);
        setError(caught instanceof Error ? caught.message : '그룹 목록을 불러오지 못했습니다.');
      });
  }, []);

  return (
    <AuthRequiredOverlay active={authRequired}>
      <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTitles}>
          <h1 className={styles.title}>내 동아리</h1>
          <p className={styles.subtitle}>`/api/v1/groups/me` 결과를 표시합니다.</p>
        </div>
        <Link href="/explore/groups" className={styles.createBtn}>
          <Plus size={18} /> 그룹 찾기
        </Link>
      </header>

      {error ? <p style={{ color: '#b91c1c' }}>{error}</p> : null}

      <div className={styles.groupGrid}>
        {groups.map(group => (
          <Link key={group.groupId} href={`/group/${group.groupId}`} className={styles.groupCard}>
            <div className={styles.coverImageWrapper}>
              <img src={group.coverImageUrl || '/images/groups/photography-club-cover.png'} alt={group.name} className={styles.coverImage} />
              {group.openRecruitmentCount > 0 ? <div className={styles.badge}>{group.openRecruitmentCount}</div> : null}
            </div>
            <div className={styles.content}>
              <div className={styles.cardHeader}>
                <span className={styles.category}>{group.category}</span>
                <button className={styles.moreBtn} type="button"><MoreVertical size={16} /></button>
              </div>
              <h3 className={styles.groupName}>{group.name}</h3>
              <div className={styles.metaRow}>
                <span className={group.myRole === 'OWNER' || group.myRole === 'ADMIN' ? styles.roleAdmin : styles.roleMember}>
                  {group.myRole || '멤버'}
                </span>
                <span className={styles.memberCount}>
                  <Users size={14} /> {group.memberCount}명
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      </div>
    </AuthRequiredOverlay>
  );
}
