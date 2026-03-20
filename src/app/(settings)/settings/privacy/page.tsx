'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Eye, Globe2, GraduationCap, BookOpen, Wifi, X, Lock, AlertTriangle } from 'lucide-react';
import { AuthRequiredOverlay } from '@/components/ui/AuthRequiredOverlay';
import { ApiError, Profile, cluverseApi } from '@/lib/cluverse-api';
import styles from './Privacy.module.css';

const FIELD_KEYS = {
  university: 'UNIVERSITY',
  major: 'MAJOR',
  online: 'ONLINE_STATUS',
} as const;

export default function PrivacySettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [allowMsg, setAllowMsg] = useState(false);
  const [authRequired, setAuthRequired] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Password change
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [changingPw, setChangingPw] = useState(false);

  // Account deletion
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    cluverseApi.getMyProfile()
      .then(result => {
        setProfile(result);
        setAuthRequired(false);
      })
      .catch(caught => {
        if (caught instanceof ApiError && caught.statusCode === 401) {
          setAuthRequired(true);
          return;
        }
        setError(caught instanceof Error ? caught.message : '개인정보 설정을 불러오지 못했습니다.');
      });
  }, []);

  const visibleFields = useMemo(() => new Set(profile?.visibleFields || []), [profile]);

  const updateVisibility = async (field: string, enabled: boolean) => {
    if (!profile) {
      return;
    }

    const nextFields = new Set(profile.visibleFields);
    if (enabled) {
      nextFields.add(field);
    } else {
      nextFields.delete(field);
    }

    const updated = await cluverseApi.updateMyProfile({
      isPublic: profile.isPublic,
      visibleFields: Array.from(nextFields),
    });
    setProfile(updated);
  };

  const showUni = visibleFields.has(FIELD_KEYS.university);
  const showMajor = visibleFields.has(FIELD_KEYS.major);
  const showOnline = visibleFields.has(FIELD_KEYS.online);

  const handleChangePassword = async () => {
    setPwError(null);
    setPwSuccess(false);
    if (!currentPw || !newPw || !confirmPw) {
      setPwError('모든 항목을 입력해주세요.');
      return;
    }
    if (newPw !== confirmPw) {
      setPwError('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    if (newPw.length < 8) {
      setPwError('비밀번호는 8자 이상이어야 합니다.');
      return;
    }
    setChangingPw(true);
    try {
      await cluverseApi.changePassword({ currentPassword: currentPw, newPassword: newPw });
      setPwSuccess(true);
      setCurrentPw('');
      setNewPw('');
      setConfirmPw('');
    } catch (e) {
      setPwError(e instanceof ApiError ? e.message : '비밀번호 변경에 실패했습니다.');
    } finally {
      setChangingPw(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== '탈퇴합니다') return;
    setDeleting(true);
    try {
      await cluverseApi.deleteMyAccount();
      localStorage.removeItem('accessToken');
      window.location.href = '/';
    } catch (e) {
      alert(e instanceof ApiError ? e.message : '회원 탈퇴에 실패했습니다.');
      setDeleting(false);
    }
  };

  return (
    <AuthRequiredOverlay active={authRequired}>
      <>
        <div className={styles.header}>
          <h1>개인정보 보호 설정</h1>
          <p>프로필 공개 범위를 `/api/v1/members/me/profile` 기준으로 저장합니다.</p>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Profile Visibility</span>
            <span className={styles.statusBadge}>
              <span className={styles.statusDot} />
              {profile?.isPublic ? 'Public' : 'Private'}
            </span>
          </div>
          <div className={styles.cardBody}>
            <SettingRow
              icon={<GraduationCap size={22} />}
              name="Show University Name"
              desc="학교명 표시 여부"
              checked={showUni}
              onChange={() => updateVisibility(FIELD_KEYS.university, !showUni)}
            />
            <SettingRow
              icon={<BookOpen size={22} />}
              name="Show Major"
              desc="전공 표시 여부"
              checked={showMajor}
              onChange={() => updateVisibility(FIELD_KEYS.major, !showMajor)}
            />
            <SettingRow
              icon={<Wifi size={22} />}
              name="Show Online Status"
              desc="온라인 상태 표시 여부"
              checked={showOnline}
              onChange={() => updateVisibility(FIELD_KEYS.online, !showOnline)}
            />
          </div>
          <div className={styles.cardFooter}>
            <span className={styles.footerNote}>변경사항은 즉시 저장됩니다.</span>
            <button className={styles.previewBtn} onClick={() => setPreviewOpen(true)} type="button">
              <Eye size={16} />
              타인에게 보이는 내 프로필 미리보기
            </button>
          </div>
        </div>

        <div className={styles.msgCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Messaging Privacy</span>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.msgRow}>
              <span className={styles.msgLabel}>Allow messages from non-verified users</span>
              <label className={styles.toggle}>
                <input className={styles.toggleInput} type="checkbox" checked={allowMsg} onChange={() => setAllowMsg(!allowMsg)} />
                <span className={styles.toggleSlider} />
              </label>
            </div>
            <p className={styles.footerNote}>메시지 수신 정책 API는 문서에 없어 현재 UI 상태만 유지합니다.</p>
          </div>
        </div>

        {/* Password Change */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}><Lock size={16} style={{ display: 'inline', marginRight: 6 }} />비밀번호 변경</span>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.pwForm}>
              <label className={styles.pwLabel}>현재 비밀번호</label>
              <input className={styles.pwInput} type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} placeholder="현재 비밀번호" />
              <label className={styles.pwLabel}>새 비밀번호</label>
              <input className={styles.pwInput} type="password" value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="새 비밀번호 (8자 이상)" />
              <label className={styles.pwLabel}>새 비밀번호 확인</label>
              <input className={styles.pwInput} type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} placeholder="새 비밀번호 재입력" />
              {pwError && <p className={styles.pwError}>{pwError}</p>}
              {pwSuccess && <p className={styles.pwSuccess}>비밀번호가 변경되었습니다.</p>}
              <button className={styles.pwBtn} onClick={handleChangePassword} disabled={changingPw} type="button">
                {changingPw ? '변경 중...' : '비밀번호 변경'}
              </button>
            </div>
          </div>
        </div>

        {/* Account Deletion */}
        <div className={styles.deleteCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle} style={{ color: '#DC2626' }}>
              <AlertTriangle size={16} style={{ display: 'inline', marginRight: 6 }} />회원 탈퇴
            </span>
          </div>
          <div className={styles.cardBody}>
            <p className={styles.deleteWarning}>
              탈퇴 시 모든 게시글, 댓글, 그룹 정보가 삭제되며 복구할 수 없습니다.<br />
              계속하려면 아래에 <strong>탈퇴합니다</strong>를 입력하세요.
            </p>
            <div className={styles.pwForm}>
              <input
                className={styles.pwInput}
                type="text"
                value={deleteConfirmText}
                onChange={e => setDeleteConfirmText(e.target.value)}
                placeholder="탈퇴합니다"
              />
              <button
                className={styles.deleteBtn}
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== '탈퇴합니다' || deleting}
                type="button"
              >
                {deleting ? '처리 중...' : '회원 탈퇴'}
              </button>
            </div>
          </div>
        </div>

        {error ? <p style={{ color: '#b91c1c' }}>{error}</p> : null}

        {previewOpen && profile ? (
          <div className={styles.overlay} onClick={() => setPreviewOpen(false)}>
            <div className={styles.modal} onClick={event => event.stopPropagation()}>
              <div className={styles.modalHeader}>
                <span className={styles.modalTitle}>
                  <Eye size={18} style={{ color: '#4051B5' }} />
                  타인에게 보여지는 모습
                </span>
                <button className={styles.modalCloseBtn} onClick={() => setPreviewOpen(false)} type="button">
                  <X size={20} />
                </button>
              </div>
              <div className={styles.modalBody}>
                <div className={styles.previewCard}>
                  <div className={styles.previewBadgeTop}>
                    <Globe2 size={10} /> 공개 프로필
                  </div>
                  <div className={styles.previewAvatar}>
                    {showOnline ? <div className={styles.previewOnline} /> : null}
                  </div>
                  <div className={styles.previewName}>{profile.nickname}</div>
                  <div className={styles.previewVerified}>
                    {showUni ? profile.university?.universityName ?? '학교 미설정' : '인증된 대학생'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </>
    </AuthRequiredOverlay>
  );
}

function SettingRow({
  icon,
  name,
  desc,
  checked,
  onChange,
}: {
  icon: React.ReactNode;
  name: string;
  desc: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className={styles.settingRow}>
      <div className={styles.settingInfo}>
        <div className={styles.settingIcon}>{icon}</div>
        <div>
          <div className={styles.settingName}>{name}</div>
          <div className={styles.settingDesc}>{desc}</div>
        </div>
      </div>
      <label className={styles.toggle}>
        <input className={styles.toggleInput} type="checkbox" checked={checked} onChange={onChange} />
        <span className={styles.toggleSlider} />
      </label>
    </div>
  );
}
