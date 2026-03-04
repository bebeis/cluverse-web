'use client';

import React, { useState } from 'react';
import styles from './Blocked.module.css';
import {
  AlertTriangle,
  UserX,
  EyeOff,
  Ban,
} from 'lucide-react';

const blockedUsers = [
  { id: 1, name: '악성댓글러', school: '연세대학교' },
  { id: 2, name: '광고계정123', school: '고려대학교' },
  { id: 3, name: '도배빌런', school: '성균관대학교' },
];

export default function BlockedUsersPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>차단 관리</h1>
        <p>차단한 사용자를 관리하고, 차단된 콘텐츠 표시 방식을 확인하세요.</p>
      </div>

      {/* Info Banner */}
      <div className={styles.infoBanner}>
        <AlertTriangle size={18} style={{ color: '#D97706', flexShrink: 0, marginTop: 2 }} />
        <div className={styles.infoBannerText}>
          <span className={styles.infoBannerBold}>차단 정책 안내</span>
          차단 시 서로의 게시글, 댓글, 알림이 제한됩니다. 신중하게 결정해주세요.
        </div>
      </div>

      {/* Blocked Users */}
      <div className={styles.blockedCard}>
        <div className={styles.blockedHeader}>
          <span className={styles.blockedTitle}>차단된 사용자</span>
          <a href="#" className={styles.viewAllLink}>전체보기</a>
        </div>
        {blockedUsers.map(u => (
          <div key={u.id} className={styles.blockedItem}>
            <div className={styles.blockedUser}>
              <div className={styles.blockedAvatar}>
                <UserX size={16} />
              </div>
              <div>
                <div className={styles.blockedName}>{u.name}</div>
                <div className={styles.blockedSchool}>{u.school}</div>
              </div>
            </div>
            <button className={styles.unblockBtn}>해제</button>
          </div>
        ))}
      </div>

      {/* Hidden Post Example */}
      <div className={styles.hiddenPost}>
        <div className={styles.hiddenPostIcon}>
          <EyeOff size={24} />
        </div>
        <div className={styles.hiddenPostTitle}>차단한 사용자의 게시글입니다</div>
        <div className={styles.hiddenPostDesc}>해당 게시글의 내용을 보시려면 아래 버튼을 눌러주세요.</div>
        <button className={styles.hiddenPostBtn}>게시글 보기</button>
      </div>

      {/* Block Confirm Modal Demo Button */}
      <button
        onClick={() => setShowModal(true)}
        style={{
          padding: '10px 20px', borderRadius: 10,
          background: '#F3F4F6', border: '1px solid #E5E7EB',
          fontWeight: 700, fontSize: 14, color: '#6B7280',
          cursor: 'pointer', alignSelf: 'flex-start',
        }}
      >
        차단 확인 모달 미리보기
      </button>

      {/* Block Confirm Modal */}
      {showModal && (
        <div className={styles.overlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalBody}>
              <div className={styles.modalIcon}>
                <Ban size={28} />
              </div>
              <div className={styles.modalTitle}>사용자를 차단하시겠습니까?</div>
              <div className={styles.modalDesc}>
                차단 시 서로의 게시글, 댓글, 알림이<br />모두 제한됩니다.
              </div>
              <div className={styles.modalActions}>
                <button className={styles.cancelBtn} onClick={() => setShowModal(false)}>취소</button>
                <button className={styles.blockBtn} onClick={() => setShowModal(false)}>차단하기</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
