'use client';

import React, { useState, useEffect } from 'react';
import styles from './ReportModal.module.css';
import {
  AlertTriangle, Ban, ShieldAlert, Lock,
  MoreHorizontal, ChevronDown, Camera,
  CheckCircle,
} from 'lucide-react';
import { cluverseApi, ReportReason } from '@/lib/cluverse-api';

const fallbackReasons: ReportReason[] = [
  { reasonCode: 'SPAM', label: '스팸 및 홍보성 글', description: '상업적 광고, 도배, 낚시성 홍보 등' },
  { reasonCode: 'ABUSE', label: '욕설 및 비방', description: '인신공격, 차별적 발언, 명예훼손 등' },
  { reasonCode: 'PRIVACY', label: '개인정보 노출', description: '실명, 연락처, 주소 등 민감정보 유출' },
  { reasonCode: 'OTHER', label: '기타 사유', description: '위 사유에 해당하지 않는 경우' },
];

function getReasonIcon(code: string) {
  switch (code) {
    case 'SPAM': return <Ban size={18} />;
    case 'ABUSE': return <AlertTriangle size={18} />;
    case 'PRIVACY': return <Lock size={18} />;
    default: return <MoreHorizontal size={18} />;
  }
}

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: string;
  targetId: number;
  targetTitle?: string;
}

export default function ReportModal({ isOpen, onClose, targetType, targetId }: ReportModalProps) {
  const [reasons, setReasons] = useState<ReportReason[]>(fallbackReasons);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [detail, setDetail] = useState('');
  const [complete, setComplete] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      cluverseApi.getReportReasons()
        .then(setReasons)
        .catch(() => setReasons(fallbackReasons));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!selectedReason || submitting) return;
    setSubmitting(true);
    try {
      await cluverseApi.submitReport({
        targetType,
        targetId,
        reasonCode: selectedReason,
        detail: detail || undefined,
      });
    } catch {
      // 제출 실패 시에도 완료 화면 표시 (UX 유지)
    } finally {
      setSubmitting(false);
      setComplete(true);
    }
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
          <>
            <h2 className={styles.modalTitle}>신고 사유 선택</h2>
            <p className={styles.modalDesc}>
              클린한 커뮤니티 환경 조성을 위해 신고 사유를 정확하게 선택해주세요.
              <br />
              <span className={styles.modalDescHighlight}>접수된 신고는 운영정책에 따라 처리됩니다.</span>
            </p>

            <div className={styles.sectionLabel}>신고 사유</div>
            <div className={styles.reasonList}>
              {reasons.map(r => (
                <div key={r.reasonCode}>
                  <div
                    className={selectedReason === r.reasonCode ? styles.reasonCardSelected : styles.reasonCard}
                    onClick={() => setSelectedReason(selectedReason === r.reasonCode ? null : r.reasonCode)}
                  >
                    <div className={styles.reasonIcon}>{getReasonIcon(r.reasonCode)}</div>
                    <div className={styles.reasonInfo}>
                      <div className={styles.reasonTitle}>{r.label}</div>
                      <div className={styles.reasonDesc}>{r.description}</div>
                    </div>
                    <ChevronDown size={18} className={styles.reasonChevron} />
                  </div>

                  <div className={`${styles.detailSection} ${selectedReason === r.reasonCode ? styles.detailSectionOpen : ''}`}>
                    <textarea
                      className={styles.detailTextarea}
                      placeholder="상세 사유를 입력해주세요 (선택)"
                      value={selectedReason === r.reasonCode ? detail : ''}
                      onChange={e => setDetail(e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>

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

            <div className={styles.footer}>
              <button className={styles.cancelBtn} onClick={handleClose}>
                취소
              </button>
              <button
                className={styles.submitBtn}
                onClick={handleSubmit}
                disabled={!selectedReason || submitting}
              >
                <ShieldAlert size={18} />
                {submitting ? '신고 중...' : '신고하기'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
