'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronLeft, ChevronRight, Plus, Users, Eye, Search } from 'lucide-react';
import { cluverseApi, GroupSummary } from '@/lib/cluverse-api';
import CreateGroupModal from '@/components/group/CreateGroupModal';
import styles from './GroupExplore.module.css';

const PAGE_SIZE = 8;

const CATEGORIES = [
  { value: '', label: '전체' },
  { value: 'PROJECT', label: '프로젝트' },
  { value: 'STUDY', label: '스터디' },
  { value: 'CLUB', label: '동아리' },
];

const ACTIVITY_TYPES = [
  { value: '', label: '전체' },
  { value: 'ONLINE', label: '온라인' },
  { value: 'OFFLINE', label: '오프라인' },
  { value: 'HYBRID', label: '온·오프라인 혼합' },
];

const REGIONS = [
  { value: '', label: '전체' },
  ...['전국', '서울', '경기', '인천', '부산', '대구', '대전', '광주', '울산', '세종',
    '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'].map(r => ({ value: r, label: r })),
];

const VISIBILITY_OPTIONS = [
  { value: '', label: '전체' },
  { value: 'PUBLIC', label: '공개' },
  { value: 'PRIVATE', label: '비공개' },
];

export default function GroupExplorePage() {
  const router = useRouter();
  const [groups, setGroups] = useState<GroupSummary[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);

  const [keywordInput, setKeywordInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [activityType, setActivityType] = useState('');
  const [region, setRegion] = useState('');
  const [visibility, setVisibility] = useState('');
  const [recruitableOnly, setRecruitableOnly] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const result = await cluverseApi.getGroups({
          keyword: keyword || undefined,
          category: category || undefined,
          activityType: activityType || undefined,
          region: region || undefined,
          visibility: visibility || undefined,
          recruitableOnly: recruitableOnly || undefined,
          page,
          size: PAGE_SIZE,
        });
        setGroups(result.groups);
        setHasNext(result.hasNext);
      } catch {
        setGroups([]);
        setHasNext(false);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [page, keyword, category, activityType, region, visibility, recruitableOnly]);

  const changeFilter = <T,>(setter: React.Dispatch<React.SetStateAction<T>>, value: T) => {
    setter(value);
    setPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setKeyword(keywordInput);
    setPage(1);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <h1 className={styles.title}>그룹 탐색</h1>
          <button className={styles.createBtn} type="button" onClick={() => setShowCreateModal(true)}>
            <Plus size={16} /> 그룹 만들기
          </button>
        </div>
        <p className={styles.subtitle}>관심사가 맞는 그룹을 찾거나 직접 만들어 보세요.</p>
      </div>

      <div className={styles.filterBar}>
        <form className={styles.searchRow} onSubmit={handleSearch}>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="그룹명, 키워드로 검색..."
            value={keywordInput}
            onChange={e => setKeywordInput(e.target.value)}
          />
          <button className={styles.searchBtn} type="submit">
            <Search size={16} />
          </button>
        </form>

        <div className={styles.filterBtns}>
          <div className={styles.selectWrap}>
            <select
              className={`${styles.filterSelect} ${category ? styles.filterSelectActive : ''}`}
              value={category}
              onChange={e => changeFilter(setCategory, e.target.value)}
            >
              {CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>
                  {c.value ? c.label : `카테고리: ${c.label}`}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className={styles.selectArrow} />
          </div>

          <div className={styles.selectWrap}>
            <select
              className={`${styles.filterSelect} ${activityType ? styles.filterSelectActive : ''}`}
              value={activityType}
              onChange={e => changeFilter(setActivityType, e.target.value)}
            >
              {ACTIVITY_TYPES.map(a => (
                <option key={a.value} value={a.value}>
                  {a.value ? a.label : `활동 방식: ${a.label}`}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className={styles.selectArrow} />
          </div>

          <div className={styles.selectWrap}>
            <select
              className={`${styles.filterSelect} ${region ? styles.filterSelectActive : ''}`}
              value={region}
              onChange={e => changeFilter(setRegion, e.target.value)}
            >
              {REGIONS.map(r => (
                <option key={r.value} value={r.value}>
                  {r.value ? r.label : `지역: ${r.label}`}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className={styles.selectArrow} />
          </div>

          <div className={styles.selectWrap}>
            <select
              className={`${styles.filterSelect} ${visibility ? styles.filterSelectActive : ''}`}
              value={visibility}
              onChange={e => changeFilter(setVisibility, e.target.value)}
            >
              {VISIBILITY_OPTIONS.map(v => (
                <option key={v.value} value={v.value}>
                  {v.value ? v.label : `공개 범위: ${v.label}`}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className={styles.selectArrow} />
          </div>

          <button
            type="button"
            className={`${styles.recruitToggle} ${recruitableOnly ? styles.recruitToggleActive : ''}`}
            onClick={() => changeFilter(setRecruitableOnly, !recruitableOnly)}
          >
            <span className={recruitableOnly ? styles.recruitDotGreen : styles.recruitDotGray} />
            모집 중만 보기
          </button>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>불러오는 중...</div>
      ) : groups.length === 0 ? (
        <div className={styles.empty}>조건에 맞는 그룹이 없습니다.</div>
      ) : (
        <div className={styles.grid}>
          {groups.map(group => (
            <Link key={group.groupId} href={`/group/${group.groupId}`} className={styles.card}>
              <div className={styles.cardImage}>
                <span className={styles.cardBadge}>{group.category}</span>
                <img className={styles.cardImg} src={group.coverImageUrl || '/images/groups/photography-club-cover.png'} alt={group.name} />
                <div className={styles.cardGrad} />
                <div className={styles.cardOverlay}>
                  <div className={styles.cardStat}>
                    <Users size={14} />
                    <span>{group.memberCount}/{group.maxMembers}</span>
                  </div>
                  <div className={styles.cardStat} style={{ opacity: 0.9 }}>
                    <Eye size={14} />
                    <span>{group.openRecruitmentCount}</span>
                  </div>
                </div>
              </div>
              <div className={styles.cardBody}>
                <div>
                  <h3 className={styles.cardTitle}>{group.name}</h3>
                  <p className={styles.cardDesc}>{group.description}</p>
                </div>
                <div className={styles.tags}>
                  {group.interests.map(tag => (
                    <span key={tag.interestId} className={styles.tag}>#{tag.name}</span>
                  ))}
                </div>
                <div className={styles.cardFooter}>
                  <div className={styles.recruitInfo}>
                    <div className={group.recruiting ? styles.recruitDot : styles.recruitDotClosed} />
                    <span className={styles.recruitLabel}>{group.activityType}</span>
                  </div>
                  <span className={group.recruiting ? styles.recruitRole : styles.recruitClosed}>
                    {group.recruiting ? '모집 중' : '모집 마감'}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className={styles.pagination}>
        <button
          className={styles.pageBtn}
          onClick={() => setPage(p => p - 1)}
          disabled={page === 1}
        >
          <ChevronLeft size={18} />
        </button>
        <button className={styles.pageBtnActive}>{page}</button>
        <button
          className={styles.pageBtn}
          onClick={() => setPage(p => p + 1)}
          disabled={!hasNext}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {showCreateModal && (
        <CreateGroupModal
          onClose={() => setShowCreateModal(false)}
          onCreated={(groupId) => {
            setShowCreateModal(false);
            router.push(`/group/${groupId}`);
          }}
        />
      )}
    </div>
  );
}
