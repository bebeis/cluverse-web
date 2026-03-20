'use client';

import React, { useEffect, useMemo, useState } from 'react';
import styles from './MajorTags.module.css';
import {
  Building2, Check, GraduationCap, PlusCircle, RotateCcw, Search, Sparkles, Trash2,
} from 'lucide-react';
import { AuthRequiredOverlay } from '@/components/ui/AuthRequiredOverlay';
import {
  ApiError, cluverseApi, InterestNode, MajorNode, MemberInterest, MemberMajor, Profile,
} from '@/lib/cluverse-api';

const MAJOR_TYPE_LABELS: Record<string, string> = {
  PRIMARY: '주전공',
  DOUBLE_MAJOR: '복수전공',
  MINOR: '부전공',
};

export default function MajorTagsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [majors, setMajors] = useState<MemberMajor[]>([]);
  const [interests, setInterests] = useState<MemberInterest[]>([]);
  const [authRequired, setAuthRequired] = useState(false);

  // Available data for search
  const [allMajors, setAllMajors] = useState<MajorNode[]>([]);
  const [allInterests, setAllInterests] = useState<InterestNode[]>([]);

  // Major add state
  const [majorSearch, setMajorSearch] = useState('');
  const [selectedMajorToAdd, setSelectedMajorToAdd] = useState<MajorNode | null>(null);
  const [majorType, setMajorType] = useState('PRIMARY');
  const [showMajorDropdown, setShowMajorDropdown] = useState(false);

  // Interest search state
  const [interestSearch, setInterestSearch] = useState('');

  // School info
  const [entranceYear, setEntranceYear] = useState('');
  const [savingYear, setSavingYear] = useState(false);

  const reload = () => {
    cluverseApi.getMyProfile()
      .then(data => {
        setProfile(data);
        setEntranceYear(data.entranceYear ? String(data.entranceYear) : '');
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
    // Load all majors (root + one level deep)
    cluverseApi.getMajors().then(async roots => {
      const childrenArrays = await Promise.all(
        roots.map(r => cluverseApi.getMajors(r.majorId).catch(() => [] as MajorNode[])),
      );
      setAllMajors([...roots, ...childrenArrays.flat()]);
    }).catch(() => {});
    // Load all interests
    cluverseApi.getInterests().then(setAllInterests).catch(() => {});
  }, []);

  const addMajor = async () => {
    if (!selectedMajorToAdd) return;
    await cluverseApi.addMajor(selectedMajorToAdd.majorId, majorType);
    setSelectedMajorToAdd(null);
    setMajorSearch('');
    reload();
  };

  const addInterest = async (interestId: number) => {
    await cluverseApi.addInterest(interestId);
    reload();
  };

  const saveEntranceYear = async () => {
    if (!entranceYear) return;
    setSavingYear(true);
    try {
      await cluverseApi.updateMyProfile({ entranceYear: Number(entranceYear) });
      reload();
    } finally {
      setSavingYear(false);
    }
  };

  const selectedInterestIds = useMemo(
    () => new Set(interests.map(i => i.interestId)),
    [interests],
  );

  const filteredMajors = useMemo(() => {
    if (!majorSearch.trim()) return [];
    const term = majorSearch.toLowerCase();
    return allMajors.filter(m => m.name.toLowerCase().includes(term)).slice(0, 10);
  }, [majorSearch, allMajors]);

  const filteredInterests = useMemo(() => {
    const term = interestSearch.toLowerCase().trim();
    if (!term) return allInterests.slice(0, 40);
    return allInterests.filter(i =>
      i.name.toLowerCase().includes(term) ||
      (i.category && i.category.toLowerCase().includes(term)),
    );
  }, [interestSearch, allInterests]);

  return (
    <AuthRequiredOverlay active={authRequired}>
      <div className={styles.page}>
        <div className={styles.headerBar}>
          <h1>전공 및 관심 태그 설정</h1>
          <p>전공 및 관심사를 추가하거나 삭제할 수 있습니다.</p>
        </div>

        {/* School Info Card */}
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
              <div className={styles.schoolInfoGrid}>
                <div className={styles.schoolInfoItem}>
                  <div className={styles.schoolInfoItemLabel}>입학년도</div>
                  <div className={styles.entranceYearRow}>
                    <input
                      className={styles.entranceYearInput}
                      type="number"
                      placeholder="예: 2022"
                      value={entranceYear}
                      min={1900}
                      max={2100}
                      onChange={e => setEntranceYear(e.target.value)}
                    />
                    <button className={styles.addBtn} onClick={saveEntranceYear} disabled={savingYear}>
                      {savingYear ? '저장 중...' : '저장'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Major Section */}
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
                    <span className={styles.majorType}>
                      {MAJOR_TYPE_LABELS[major.majorType] ?? major.majorType}
                    </span>
                    <div className={styles.majorName}>{major.majorName || `전공 ID ${major.majorId}`}</div>
                    {major.collegeName && <div className={styles.majorCollege}>{major.collegeName}</div>}
                  </div>
                </div>
                <div className={styles.majorActions}>
                  <button
                    className={`${styles.majorActionBtn} ${styles.majorActionBtnDanger}`}
                    onClick={() => cluverseApi.deleteMajor(major.memberMajorId).then(reload)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Major Search & Add */}
          <div className={styles.majorSearchBox} style={{ marginTop: 16 }}>
            <div className={styles.majorSearchRow}>
              <div className={styles.majorSearchInputWrap}>
                <Search size={16} style={{ color: '#9CA3AF', flexShrink: 0 }} />
                <input
                  className={styles.majorSearchInput}
                  placeholder="전공명 검색..."
                  value={selectedMajorToAdd ? selectedMajorToAdd.name : majorSearch}
                  onChange={e => {
                    setMajorSearch(e.target.value);
                    setSelectedMajorToAdd(null);
                    setShowMajorDropdown(true);
                  }}
                  onFocus={() => setShowMajorDropdown(true)}
                  onBlur={() => setTimeout(() => setShowMajorDropdown(false), 150)}
                />
              </div>
              <select
                className={styles.majorTypeSelect}
                value={majorType}
                onChange={e => setMajorType(e.target.value)}
              >
                <option value="PRIMARY">주전공</option>
                <option value="DOUBLE_MAJOR">복수전공</option>
                <option value="MINOR">부전공</option>
              </select>
              <button className={styles.addBtn} onClick={addMajor} disabled={!selectedMajorToAdd}>
                <PlusCircle size={18} />
                전공 추가
              </button>
            </div>
            {showMajorDropdown && filteredMajors.length > 0 && (
              <div className={styles.majorDropdown}>
                {filteredMajors.map(m => (
                  <button
                    key={m.majorId}
                    className={styles.majorDropdownItem}
                    onMouseDown={() => {
                      setSelectedMajorToAdd(m);
                      setMajorSearch(m.name);
                      setShowMajorDropdown(false);
                    }}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.divider} />

        {/* Interest Section */}
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
              <button
                className={styles.resetBtn}
                onClick={() =>
                  Promise.all(interests.map(item => cluverseApi.deleteInterest(item.interestId))).then(reload)
                }
              >
                <RotateCcw size={12} />
                전체 초기화
              </button>
            </div>

            <div className={styles.selectedTags}>
              {interests.map(interest => (
                <button
                  key={interest.interestId}
                  className={styles.selectedTag}
                  onClick={() => cluverseApi.deleteInterest(interest.interestId).then(reload)}
                >
                  #{interest.interestName || interest.interestId}
                  {interest.category ? ` (${interest.category})` : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Interest Search */}
          <div className={styles.interestSearchBox}>
            <div className={styles.interestSearchInputWrap}>
              <Search size={16} style={{ color: '#9CA3AF', flexShrink: 0 }} />
              <input
                className={styles.interestSearchInput}
                placeholder="관심사 검색..."
                value={interestSearch}
                onChange={e => setInterestSearch(e.target.value)}
              />
            </div>
            <div className={styles.interestChips}>
              {filteredInterests.length === 0 ? (
                <p style={{ color: '#9CA3AF', fontSize: 13 }}>검색 결과가 없습니다.</p>
              ) : (
                filteredInterests.map(interest => {
                  const added = selectedInterestIds.has(interest.interestId);
                  return (
                    <button
                      key={interest.interestId}
                      className={`${styles.interestChip} ${added ? styles.interestChipAdded : ''}`}
                      onClick={() => !added && addInterest(interest.interestId)}
                      disabled={added}
                    >
                      {added && <Check size={12} />}
                      #{interest.name}
                      {interest.category ? ` · ${interest.category}` : ''}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthRequiredOverlay>
  );
}
