'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Interest.module.css';
import { AuthHeader } from '@/components/ui/AuthHeader';
import { AuthRequiredOverlay } from '@/components/ui/AuthRequiredOverlay';
import { ArrowRight, Plus, Check } from 'lucide-react';
import { ApiError, cluverseApi, MemberInterest } from '@/lib/cluverse-api';

export default function InterestSelectionPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<number[]>([]);
  const [draft, setDraft] = useState('');
  const [authRequired, setAuthRequired] = useState(false);

  useEffect(() => {
    cluverseApi.getMyInterests()
      .then(items => {
        setSelected(items.map((item: MemberInterest) => item.interestId));
        setAuthRequired(false);
      })
      .catch(caught => {
        setSelected([]);
        setAuthRequired(caught instanceof ApiError && caught.statusCode === 401);
      });
  }, []);

  const addInterest = async () => {
    const nextId = Number(draft);
    if (!nextId) {
      return;
    }
    await cluverseApi.addInterest(nextId);
    setSelected(prev => [...new Set([...prev, nextId])]);
    setDraft('');
  };

  const removeInterest = async (interestId: number) => {
    await cluverseApi.deleteInterest(interestId);
    setSelected(prev => prev.filter(item => item !== interestId));
  };

  return (
    <AuthRequiredOverlay active={authRequired}>
      <div className={styles.container}>
      <AuthHeader
        rightElement={
          <div className={styles.headerProgress}>
            <p className={styles.progressText}>2/3 단계</p>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} />
            </div>
          </div>
        }
      />

      <main className={styles.main}>
        <div className={styles.contentWrapper}>
          <div className={styles.titleArea}>
            <h1 className={styles.title}>관심사를 추가하세요</h1>
            <p className={styles.subtitle}>문서상 관심사 lookup 엔드포인트가 없어 현재는 관심사 ID 직접 입력 방식입니다.</p>
            <div className={styles.selectionInfo}>
              <span className={styles.selectedBadge}>{selected.length}개 선택됨</span>
            </div>
          </div>

          <div className={styles.categoriesList}>
            <div className={styles.categoryGroup}>
              <div className={styles.categoryHeader}>
                <h3 className={styles.categoryTitle}>관심사 ID 추가</h3>
              </div>
              <div className={styles.tagsWrapper}>
                <label className={styles.tagLabel}>
                  <input className={styles.tagInput} value={draft} onChange={e => setDraft(e.target.value)} />
                  <div className={styles.tagVisual}>
                    <p className={styles.tagText}>관심사 ID</p>
                    <button type="button" onClick={addInterest} style={{ background: 'transparent', border: 0 }}>
                      <Plus size={18} className={styles.tagIcon} />
                    </button>
                  </div>
                </label>

                {selected.map(interestId => (
                  <label key={interestId} className={styles.tagLabel}>
                    <input type="checkbox" className={styles.tagInput} checked readOnly />
                    <div className={styles.tagVisual} onClick={() => removeInterest(interestId)}>
                      <p className={styles.tagText}>#{interestId}</p>
                      <Check size={18} className={styles.tagIcon} />
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <button type="button" className={styles.prevBtn} onClick={() => router.push('/onboarding/major')}>이전</button>
          <button type="button" className={styles.completeBtn} onClick={() => router.push('/onboarding/complete')}>
            <span>완료</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </footer>
      </div>
    </AuthRequiredOverlay>
  );
}
