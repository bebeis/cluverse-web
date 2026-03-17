'use client';

import React, { useEffect, useState } from 'react';
import styles from './Blocked.module.css';
import { AlertTriangle, UserX, EyeOff } from 'lucide-react';
import { AuthRequiredOverlay } from '@/components/ui/AuthRequiredOverlay';
import { ApiError, BlockedMember, cluverseApi, formatRelativeTime } from '@/lib/cluverse-api';

export default function BlockedUsersPage() {
  const [blockedUsers, setBlockedUsers] = useState<BlockedMember[]>([]);
  const [authRequired, setAuthRequired] = useState(false);

  const reload = () => {
    cluverseApi.getBlockedMembers()
      .then(items => {
        setBlockedUsers(items);
        setAuthRequired(false);
      })
      .catch(caught => {
        setBlockedUsers([]);
        setAuthRequired(caught instanceof ApiError && caught.statusCode === 401);
      });
  };

  useEffect(() => {
    reload();
  }, []);

  return (
    <AuthRequiredOverlay active={authRequired}>
      <div className={styles.page}>
      <div className={styles.header}>
        <h1>차단 관리</h1>
        <p>`/api/v1/members/me/blocks`와 차단 해제 API가 연결되어 있습니다.</p>
      </div>

      <div className={styles.infoBanner}>
        <AlertTriangle size={18} style={{ color: '#D97706', flexShrink: 0, marginTop: 2 }} />
        <div className={styles.infoBannerText}>
          <span className={styles.infoBannerBold}>차단 정책 안내</span>
          차단 시 서로의 게시글, 댓글, 알림이 제한됩니다.
        </div>
      </div>

      <div className={styles.blockedCard}>
        <div className={styles.blockedHeader}>
          <span className={styles.blockedTitle}>차단된 사용자</span>
        </div>
        {blockedUsers.map(user => (
          <div key={user.memberId} className={styles.blockedItem}>
            <div className={styles.blockedUser}>
              <div className={styles.blockedAvatar}>
                <UserX size={16} />
              </div>
              <div>
                <div className={styles.blockedName}>{user.nickname}</div>
                <div className={styles.blockedSchool}>{user.universityName} · {formatRelativeTime(user.blockedAt)}</div>
              </div>
            </div>
            <button className={styles.unblockBtn} onClick={() => cluverseApi.unblockMember(user.memberId).then(reload)}>해제</button>
          </div>
        ))}
      </div>

      <div className={styles.hiddenPost}>
        <div className={styles.hiddenPostIcon}>
          <EyeOff size={24} />
        </div>
        <div className={styles.hiddenPostTitle}>차단된 콘텐츠 예시</div>
        <div className={styles.hiddenPostDesc}>실제 숨김 처리는 게시글 응답의 `hiddenByBlock` 필드로 판별합니다.</div>
      </div>
      </div>
    </AuthRequiredOverlay>
  );
}
