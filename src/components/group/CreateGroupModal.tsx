'use client';

import React, { useEffect, useRef, useState } from 'react';
import { X, Plus, Check } from 'lucide-react';
import { cluverseApi, InterestNode } from '@/lib/cluverse-api';
import styles from './CreateGroupModal.module.css';

interface CreateGroupModalProps {
  onClose: () => void;
  onCreated: (groupId: number) => void;
}

const CATEGORIES = [
  { value: 'PROJECT', label: '프로젝트' },
  { value: 'STUDY', label: '스터디' },
  { value: 'CLUB', label: '동아리' },
];

const ACTIVITY_TYPES = [
  { value: 'ONLINE', label: '온라인' },
  { value: 'OFFLINE', label: '오프라인' },
  { value: 'HYBRID', label: '온·오프라인 혼합' },
];

const REGIONS = [
  '전국', '서울', '경기', '인천', '부산', '대구', '대전', '광주', '울산', '세종',
  '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주',
];

const VISIBILITY_OPTIONS = [
  { value: 'PUBLIC', label: '공개' },
  { value: 'PRIVATE', label: '비공개' },
];

export default function CreateGroupModal({ onClose, onCreated }: CreateGroupModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [category, setCategory] = useState('PROJECT');
  const [activityType, setActivityType] = useState('HYBRID');
  const [region, setRegion] = useState('전국');
  const [visibility, setVisibility] = useState('PUBLIC');
  const [maxMembers, setMaxMembers] = useState(20);
  const [selectedInterestIds, setSelectedInterestIds] = useState<number[]>([]);
  const [interests, setInterests] = useState<InterestNode[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    cluverseApi.getInterests().then(setInterests).catch(() => setInterests([]));
  }, []);

  const toggleInterest = (id: number) => {
    setSelectedInterestIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      setError('그룹 이름과 소개를 입력해 주세요.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const result = await cluverseApi.createGroup({
        name: name.trim(),
        description: description.trim(),
        coverImageUrl: coverImageUrl.trim(),
        category,
        activityType,
        region,
        visibility,
        maxMembers,
        interestIds: selectedInterestIds,
      });
      onCreated(result.groupId);
    } catch (err) {
      setError(err instanceof Error ? err.message : '그룹 생성에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div className={styles.overlay} ref={overlayRef} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>새 그룹 만들기</h2>
          <button className={styles.closeBtn} onClick={onClose} type="button" aria-label="닫기">
            <X size={20} />
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.fields}>
            <div className={styles.field}>
              <label className={styles.label}>그룹 이름 <span className={styles.required}>*</span></label>
              <input
                className={styles.input}
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="그룹 이름을 입력하세요"
                maxLength={50}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>그룹 소개 <span className={styles.required}>*</span></label>
              <textarea
                className={styles.textarea}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="그룹을 간단히 소개해 주세요"
                rows={3}
                maxLength={500}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>커버 이미지 URL</label>
              <input
                className={styles.input}
                value={coverImageUrl}
                onChange={e => setCoverImageUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>카테고리</label>
                <select className={styles.select} value={category} onChange={e => setCategory(e.target.value)}>
                  {CATEGORIES.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>활동 방식</label>
                <select className={styles.select} value={activityType} onChange={e => setActivityType(e.target.value)}>
                  {ACTIVITY_TYPES.map(a => (
                    <option key={a.value} value={a.value}>{a.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>활동 지역</label>
                <select className={styles.select} value={region} onChange={e => setRegion(e.target.value)}>
                  {REGIONS.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>공개 범위</label>
                <select className={styles.select} value={visibility} onChange={e => setVisibility(e.target.value)}>
                  {VISIBILITY_OPTIONS.map(v => (
                    <option key={v.value} value={v.value}>{v.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>최대 인원</label>
              <input
                className={styles.input}
                type="number"
                min={2}
                max={500}
                value={maxMembers}
                onChange={e => setMaxMembers(Number(e.target.value))}
              />
            </div>

            {interests.length > 0 && (
              <div className={styles.field}>
                <label className={styles.label}>관심사 태그</label>
                <div className={styles.interestGrid}>
                  {interests.map(interest => {
                    const selected = selectedInterestIds.includes(interest.interestId);
                    return (
                      <button
                        key={interest.interestId}
                        type="button"
                        className={selected ? styles.interestChipSelected : styles.interestChip}
                        onClick={() => toggleInterest(interest.interestId)}
                      >
                        {selected && <Check size={12} />}
                        {interest.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.actions}>
            <button className={styles.cancelBtn} type="button" onClick={onClose}>취소</button>
            <button className={styles.submitBtn} type="submit" disabled={submitting}>
              {submitting ? '생성 중...' : (
                <><Plus size={16} /> 그룹 만들기</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
