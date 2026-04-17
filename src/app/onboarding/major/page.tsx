'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthHeader } from '@/components/ui/AuthHeader';
import { AuthRequiredOverlay } from '@/components/ui/AuthRequiredOverlay';
import { ArrowRight, BookOpen, GraduationCap, Info, Library } from 'lucide-react';
import { ApiError, cluverseApi, University } from '@/lib/cluverse-api';
import styles from './Major.module.css';

export default function MajorSelectionPage() {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const [universities, setUniversities] = useState<University[]>([]);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [primaryMajorId, setPrimaryMajorId] = useState('');
  const [secondaryMajorId, setSecondaryMajorId] = useState('');
  const [authRequired, setAuthRequired] = useState(false);

  useEffect(() => {
    cluverseApi.getMyProfile().then(profileData => {
      setSelectedUniversity(profileData.university);
      setKeyword(profileData.university?.universityName || '');
      setAuthRequired(false);
    }).catch(caught => {
      setAuthRequired(caught instanceof ApiError && caught.statusCode === 401);
    });
  }, []);

  useEffect(() => {
    if (keyword.trim().length < 2 || selectedUniversity?.universityName === keyword.trim()) {
      return;
    }

    const timer = window.setTimeout(async () => {
      try {
        setUniversities(await cluverseApi.searchUniversities(keyword.trim()));
      } catch {
        setUniversities([]);
      }
    }, 250);

    return () => window.clearTimeout(timer);
  }, [keyword, selectedUniversity]);

  const saveMajors = async () => {
    if (primaryMajorId) {
      await cluverseApi.addMajor(Number(primaryMajorId), 'PRIMARY');
    }
    if (secondaryMajorId) {
      await cluverseApi.addMajor(Number(secondaryMajorId), 'DOUBLE_MAJOR');
    }
    router.push('/onboarding/interest');
  };

  return (
    <AuthRequiredOverlay active={authRequired}>
      <div className={styles.container}>
      <AuthHeader
        rightElement={
          <div className={styles.headerActions}>
            <Link href="/home" className={styles.headerLink}>나가기</Link>
          </div>
        }
      />

      <main className={styles.main}>
        <div className={styles.contentWrapper}>
          <div className={styles.stepper}>
            <div className={styles.stepperHeader}>
              <p className={styles.stepperStep}>Step 1/3</p>
              <span className={styles.stepperDesc}>학교 및 전공 선택</span>
            </div>
            <div className={styles.stepperBar}>
              <div className={styles.stepperProgress} />
            </div>
          </div>

          <div className={styles.titleArea}>
            <h1 className={styles.title}>소속 학교와 전공을 알려주세요</h1>
            <p className={styles.subtitle}>전공 lookup API가 문서에 없어 현재는 전공 ID 직접 입력 방식으로 연결했습니다.</p>
          </div>

          <div className={styles.formCard}>
            <div className={styles.inputGroup}>
              <label htmlFor="school-search" className={styles.inputLabel}>학교 검색</label>
              <div className={styles.inputRel}>
                <div className={styles.inputIcon}><GraduationCap size={20} /></div>
                <input
                  type="text"
                  id="school-search"
                  placeholder="학교명을 입력하세요"
                  value={keyword}
                  onChange={e => {
                    setKeyword(e.target.value);
                    setSelectedUniversity(null);
                    setUniversities([]);
                  }}
                  className={styles.input}
                />
              </div>
              {universities.length > 0 ? (
                <div style={{ display: 'grid', gap: 8, marginTop: 12 }}>
                  {universities.map(university => (
                    <button
                      key={university.universityId}
                      type="button"
                      className={styles.changeBtn}
                      onClick={() => {
                        setSelectedUniversity(university);
                        setKeyword(university.universityName);
                        setUniversities([]);
                      }}
                    >
                      {university.universityName}
                    </button>
                  ))}
                </div>
              ) : null}

              {selectedUniversity ? (
                <div className={styles.selectedSchool}>
                  <div className={styles.schoolInfo}>
                    <span className={styles.schoolName}>{selectedUniversity.universityName}</span>
                    <span className={styles.schoolLoc}>ID {selectedUniversity.universityId}</span>
                  </div>
                </div>
              ) : null}
            </div>

            <div className={styles.divider} />

            <div className={styles.majorsGrid}>
              <div className={styles.inputGroup}>
                <label htmlFor="main-major" className={styles.inputLabel}>주전공 ID</label>
                <div className={styles.inputRel}>
                  <div className={styles.inputIcon}><BookOpen size={20} /></div>
                  <input type="number" id="main-major" placeholder="예: 100" className={styles.input} value={primaryMajorId} onChange={e => setPrimaryMajorId(e.target.value)} />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="sub-major" className={styles.inputLabel}>복수/부전공 ID</label>
                <div className={styles.inputRel}>
                  <div className={styles.inputIcon}><Library size={20} /></div>
                  <input type="number" id="sub-major" placeholder="예: 200" className={styles.input} value={secondaryMajorId} onChange={e => setSecondaryMajorId(e.target.value)} />
                </div>
              </div>
            </div>

            <div className={styles.helperBox}>
              <div className={styles.helperIcon}><Info size={20} /></div>
              <div className={styles.helperText}>
                <p>제한사항</p>
                <ul>
                  <li>현재 API 문서에는 전공 검색/목록 조회 엔드포인트가 없습니다.</li>
                  <li>멤버 전공 등록 API만 공개되어 있어 ID 기반 입력으로 연결했습니다.</li>
                </ul>
              </div>
            </div>

            <div className={styles.actionArea}>
              <button type="button" className={styles.nextBtn} onClick={saveMajors}>
                다음 단계로
                <ArrowRight size={24} />
              </button>
            </div>
          </div>
        </div>
      </main>
      </div>
    </AuthRequiredOverlay>
  );
}
