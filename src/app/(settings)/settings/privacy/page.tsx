'use client';

import React, { useState } from 'react';
import styles from './Privacy.module.css';
import {
  GraduationCap, BookOpen, Wifi,
  Eye, X, Mail, ShieldCheck,
  Globe2,
} from 'lucide-react';

export default function PrivacySettingsPage() {
  const [showUni, setShowUni] = useState(false);
  const [showMajor, setShowMajor] = useState(true);
  const [showOnline, setShowOnline] = useState(true);
  const [allowMsg, setAllowMsg] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <>
      <div className={styles.header}>
        <h1>개인정보 보호 설정</h1>
        <p>다른 사용자에게 내 프로필이 어떻게 보일지 관리하고 상호작용 방식을 설정하세요.</p>
      </div>

      {/* Profile Visibility */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>Profile Visibility</span>
          <span className={styles.statusBadge}>
            <span className={styles.statusDot} />
            Active
          </span>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.settingRow}>
            <div className={styles.settingInfo}>
              <div className={styles.settingIcon} style={{ background: '#E0E7FF', color: '#4338CA' }}>
                <GraduationCap size={22} />
              </div>
              <div>
                <div className={styles.settingName}>Show University Name</div>
                <div className={styles.settingDesc}>
                  When disabled, your specific university name (e.g., &quot;Yonsei Univ.&quot;) will be hidden from public view. Instead, a &quot;Verified Student&quot; badge will be shown.
                </div>
              </div>
            </div>
            <label className={styles.toggle}>
              <input className={styles.toggleInput} type="checkbox" checked={showUni} onChange={() => setShowUni(!showUni)} />
              <span className={styles.toggleSlider} />
            </label>
          </div>

          <div className={styles.settingRow}>
            <div className={styles.settingInfo}>
              <div className={styles.settingIcon} style={{ background: '#DBEAFE', color: '#1D4ED8' }}>
                <BookOpen size={22} />
              </div>
              <div>
                <div className={styles.settingName}>Show Major</div>
                <div className={styles.settingDesc}>Allow others to see your specific field of study.</div>
              </div>
            </div>
            <label className={styles.toggle}>
              <input className={styles.toggleInput} type="checkbox" checked={showMajor} onChange={() => setShowMajor(!showMajor)} />
              <span className={styles.toggleSlider} />
            </label>
          </div>

          <div className={styles.settingRow}>
            <div className={styles.settingInfo}>
              <div className={styles.settingIcon} style={{ background: '#DCFCE7', color: '#15803D' }}>
                <Wifi size={22} />
              </div>
              <div>
                <div className={styles.settingName}>Show Online Status</div>
                <div className={styles.settingDesc}>Let others know when you are currently active on Cluverse.</div>
              </div>
            </div>
            <label className={styles.toggle}>
              <input className={styles.toggleInput} type="checkbox" checked={showOnline} onChange={() => setShowOnline(!showOnline)} />
              <span className={styles.toggleSlider} />
            </label>
          </div>
        </div>
        <div className={styles.cardFooter}>
          <span className={styles.footerNote}>변경사항은 자동으로 저장됩니다</span>
          <button className={styles.previewBtn} onClick={() => setPreviewOpen(true)}>
            <Eye size={16} />
            타인에게 보이는 내 프로필 미리보기
          </button>
        </div>
      </div>

      {/* Messaging Privacy */}
      <div className={styles.msgCard}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>Messaging Privacy</span>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.msgRow}>
            <span className={styles.msgLabel}>
              <Mail size={18} style={{ color: '#9CA3AF' }} />
              Allow messages from non-verified users
            </span>
            <label className={styles.toggle}>
              <input className={styles.toggleInput} type="checkbox" checked={allowMsg} onChange={() => setAllowMsg(!allowMsg)} />
              <span className={styles.toggleSlider} />
            </label>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewOpen && (
        <div className={styles.overlay} onClick={() => setPreviewOpen(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <span className={styles.modalTitle}>
                <Eye size={18} style={{ color: '#4051B5' }} />
                타인에게 보여지는 모습
              </span>
              <button className={styles.modalCloseBtn} onClick={() => setPreviewOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.previewCard}>
                <div className={styles.previewBadgeTop}>
                  <Globe2 size={10} /> 공개 프로필
                </div>
                <div className={styles.previewAvatar}>
                  {showOnline && <div className={styles.previewOnline} />}
                </div>
                <div className={styles.previewName}>김지민</div>
                <div className={styles.previewVerified}>
                  <ShieldCheck size={14} />
                  {showUni ? '서울대학교' : '인증된 대학생'}
                </div>
                <div className={styles.previewStats}>
                  <div className={styles.previewStatItem}>
                    <span className={styles.previewStatNum}>12</span>
                    <span className={styles.previewStatLabel}>게시글</span>
                  </div>
                  <div className={styles.previewStatDivider} />
                  <div className={styles.previewStatItem}>
                    <span className={styles.previewStatNum}>48</span>
                    <span className={styles.previewStatLabel}>팔로잉</span>
                  </div>
                  <div className={styles.previewStatDivider} />
                  <div className={styles.previewStatItem}>
                    <span className={styles.previewStatNum}>156</span>
                    <span className={styles.previewStatLabel}>팔로워</span>
                  </div>
                </div>
              </div>
              <div className={styles.infoAlert}>
                <Eye size={18} style={{ color: '#3B82F6', flexShrink: 0, marginTop: 2 }} />
                <div className={styles.infoAlertText}>
                  <span className={styles.infoAlertBold}>
                    {showUni ? '학교명이 공개됩니다' : '학교명 숨김 설정이 적용되었습니다.'}
                  </span>
                  {showUni
                    ? '다른 사용자들에게 학교명이 프로필에 표시됩니다.'
                    : "다른 사용자들에게는 학교명 대신 '인증된 대학생' 배지가 표시됩니다."
                  }
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.btnSecondary} onClick={() => setPreviewOpen(false)}>
                다시 설정하기
              </button>
              <button className={styles.btnPrimary} onClick={() => setPreviewOpen(false)}>
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
