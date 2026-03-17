'use client';

import React, { useEffect, useState } from 'react';
import styles from './MajorTags.module.css';
import {
  Building2, GraduationCap, PlusCircle, Trash2, Sparkles, RotateCcw,
} from 'lucide-react';
import { AuthRequiredOverlay } from '@/components/ui/AuthRequiredOverlay';
import { ApiError, cluverseApi, MemberInterest, MemberMajor, Profile } from '@/lib/cluverse-api';

export default function MajorTagsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [majors, setMajors] = useState<MemberMajor[]>([]);
  const [interests, setInterests] = useState<MemberInterest[]>([]);
  const [majorId, setMajorId] = useState('');
  const [majorType, setMajorType] = useState('PRIMARY');
  const [interestId, setInterestId] = useState('');
  const [authRequired, setAuthRequired] = useState(false);

  const reload = () => {
    cluverseApi.getMyProfile()
      .then(data => {
        setProfile(data);
        setAuthRequired(false);
      })
      .catch(caught => {
        setProfile(null);
        setAuthRequired(caught instanceof ApiError && caught.statusCode === 401);
      });
    cluverseApi.getMyMajors().then(setMajors).catch(() => setMajors([]));
    cluverseApi.getMyInterests().then(setInterests).catch(() => setInterests([]));
  };

  useEffect(() => {
    reload();
  }, []);

  const addMajor = async () => {
    if (!majorId) return;
    await cluverseApi.addMajor(Number(majorId), majorType);
    setMajorId('');
    reload();
  };

  const addInterest = async () => {
    if (!interestId) return;
    await cluverseApi.addInterest(Number(interestId));
    setInterestId('');
    reload();
  };

  return (
    <AuthRequiredOverlay active={authRequired}>
      <div className={styles.page}>
      <div className={styles.headerBar}>
        <h1>전공 및 관심 태그 설정</h1>
        <p>API 문서에는 전공/관심사 lookup 엔드포인트가 없어 현재는 ID 기반 추가/삭제로 연결했습니다.</p>
      </div>

      <div className={styles.schoolCard}>
        <div className={styles.schoolHeader}>
          <span className={styles.schoolHeaderTitle}>
            <Building2 size={20} style={{ color: '#4051B5' }} />
            학교 정보
          </span>
        </div>
        <div className={styles.schoolBody}>
          <div className={styles.schoolDetails}>
            <div className={styles.schoolName}>
              <h2>{profile?.university?.universityName || '학교 미등록'}</h2>
            </div>
          </div>
        </div>
      </div>

      <div id="major-list">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionHeaderTitle}>
            <GraduationCap size={20} style={{ color: '#4051B5' }} />
            전공 목록
          </span>
        </div>

        <div className={styles.majorGrid} style={{ marginTop: 16 }}>
          {majors.map(major => (
            <div key={major.memberMajorId} className={styles.majorCard}>
              <div className={styles.majorAccent} style={{ background: '#3B82F6' }} />
              <div className={styles.majorInfo}>
                <div>
                  <span className={styles.majorType}>{major.majorType}</span>
                  <div className={styles.majorName}>전공 ID {major.majorId}</div>
                  <div className={styles.majorCollege}>매핑 ID {major.memberMajorId}</div>
                </div>
              </div>
              <div className={styles.majorActions}>
                <button className={`${styles.majorActionBtn} ${styles.majorActionBtnDanger}`} onClick={() => cluverseApi.deleteMajor(major.memberMajorId).then(reload)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.tagSearch} style={{ marginTop: 16 }}>
          <input className={styles.tagSearchInput} placeholder="전공 ID 입력" value={majorId} onChange={e => setMajorId(e.target.value)} />
          <input className={styles.tagSearchInput} placeholder="PRIMARY / DOUBLE_MAJOR / MINOR" value={majorType} onChange={e => setMajorType(e.target.value)} />
          <button className={styles.addBtn} onClick={addMajor}>
            <PlusCircle size={18} />
            전공 추가
          </button>
        </div>
      </div>

      <div className={styles.divider} />

      <div id="tag-settings" className={styles.tagSection}>
        <div className={styles.headerBar}>
          <span className={styles.sectionHeaderTitle}>
            <Sparkles size={20} style={{ color: '#4051B5' }} />
            관심 태그 설정
          </span>
        </div>

        <div className={styles.selectedPanel}>
          <div className={styles.selectedHeader}>
            <div className={styles.selectedTitle}>
              내 관심 태그
              <span className={styles.selectedCount}>{interests.length}</span>
            </div>
            <button className={styles.resetBtn} onClick={() => Promise.all(interests.map(item => cluverseApi.deleteInterest(item.interestId))).then(reload)}>
              <RotateCcw size={12} />
              전체 초기화
            </button>
          </div>

          <div className={styles.selectedTags}>
            {interests.map(interest => (
              <button key={interest.interestId} className={styles.selectedTag} onClick={() => cluverseApi.deleteInterest(interest.interestId).then(reload)}>
                #{interest.interestId}
              </button>
            ))}
          </div>

          <div className={styles.tagSearch} style={{ marginTop: 16 }}>
            <input className={styles.tagSearchInput} placeholder="관심사 ID 입력" value={interestId} onChange={e => setInterestId(e.target.value)} />
            <button className={styles.addBtn} onClick={addInterest}>
              <PlusCircle size={18} />
              관심사 추가
            </button>
          </div>
        </div>
      </div>
      </div>
    </AuthRequiredOverlay>
  );
}
