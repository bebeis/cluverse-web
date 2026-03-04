'use client';

import React, { useState } from 'react';
import styles from './ReportModal.module.css';
import {
  AlertTriangle, Ban, ShieldAlert, Lock,
  MoreHorizontal, ChevronDown, Camera, X,
  CheckCircle,
} from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType?: string; // e.g. '게시글', '댓글', '사용자'
  targetTitle?: string;
}

const reasons = [
  {
    id: 'spam',
    icon: <Ban size={18} />,
    title: '스팸 및 홍보성 글',
    desc: '상업적 광고, 도배, 낚시성 홍보 등',
  },
  {
    id: 'abuse',
    icon: <AlertTriangle size={18} />,
    title: '욕설 및 비방',
    desc: '인신공격, 차별적 발언, 명예훼손 등',
  },
  {
    id: 'privacy',
    icon: <Lock size={18} />,
    title: '개인정보 노출',
    desc: '실명, 연락처, 주소 등 민감정보 유출',
  },
  {
    id: 'other',
    icon: <MoreHorizontal size={18} />,
    title: '기타 사유',
    desc: '위 사유에 해당하지 않는 경우',
  },
];

export default function ReportModal({ isOpen, onClose, targetType = '게시글', targetTitle }: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [detail, setDetail] = useState('');
  const [complete, setComplete] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!selectedReason) return;
    setComplete(true);
  };

  const handleClose = () => {
    setSelectedReason(null);
    setDetail('');
    setComplete(false);
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        {complete ? (
          /* ===== G-03 Report Complete ===== */
          <div className={styles.completeContainer}>
            <div className={styles.completeIcon}>
              <CheckCircle size={36} />
            </div>
            <h2 className={styles.completeTitle}>신고가 접수되었습니다</h2>
            <p className={styles.completeDesc}>
              신고가 성공적으로 접수되었습니다. 곧 검토하겠습니다.
              {'\n'}운영정책에 따라 처리되며, 결과는 알림으로 안내드립니다.
            </p>
            <button className={styles.completeBtn} onClick={handleClose}>
              확인
            </button>
          </div>
        ) : (
          /* ===== G-02 Report Form ===== */
          <>
            <h2 className={styles.modalTitle}>신고 사유 선택</h2>
            <p className={styles.modalDesc}>
              클린한 커뮤니티 환경 조성을 위해 신고 사유를 정확하게 선택해주세요.
              <br />
              <span className={styles.modalDescHighlight}>접수된 신고는 운영정책에 따라 처리됩니다.</span>
            </p>

            {/* Reason cards */}
            <div className={styles.sectionLabel}>신고 사유</div>
            <div className={styles.reasonList}>
              {reasons.map(r => (
                <div key={r.id}>
                  <div
                    className={selectedReason === r.id ? styles.reasonCardSelected : styles.reasonCard}
                    onClick={() => setSelectedReason(selectedReason === r.id ? null : r.id)}
                  >
                    <div className={styles.reasonIcon}>{r.icon}</div>
                    <div className={styles.reasonInfo}>
                      <div className={styles.reasonTitle}>{r.title}</div>
                      <div className={styles.reasonDesc}>{r.desc}</div>
                    </div>
                    <ChevronDown size={18} className={styles.reasonChevron} />
                  </div>

                  {/* Detail textarea for selected reason */}
                  <div className={`${styles.detailSection} ${selectedReason === r.id ? styles.detailSectionOpen : ''}`}>
                    <textarea
                      className={styles.detailTextarea}
                      placeholder="상세 사유를 입력해주세요 (선택)"
                      value={selectedReason === r.id ? detail : ''}
                      onChange={e => setDetail(e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Evidence */}
            <div className={styles.evidenceSection}>
              <div className={styles.evidenceHeader}>
                <span className={styles.evidenceLabel}>증거 첨부</span>
                <span className={styles.evidenceLimit}>(선택, 최대 3장)</span>
              </div>
              <div className={styles.evidenceGrid}>
                <label className={styles.evidenceAdd}>
                  <Camera size={20} />
                  <span>추가하기</span>
                  <input type="file" accept="image/*" hidden />
                </label>
              </div>
            </div>

            <p className={styles.notice}>
              * 정확한 처리를 위해 문제되는 게시글이나 댓글의 스크린샷을 첨부해주세요.
            </p>

            {/* Actions */}
            <div className={styles.footer}>
              <button className={styles.cancelBtn} onClick={handleClose}>
                취소
              </button>
              <button
                className={styles.submitBtn}
                onClick={handleSubmit}
                disabled={!selectedReason}
              >
                <ShieldAlert size={18} />
                신고하기
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
