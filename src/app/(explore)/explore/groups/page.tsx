'use client';

import React, { useState } from 'react';
import styles from './GroupExplore.module.css';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Users,
  Eye,
} from 'lucide-react';

/* ── Mock Data ─────────────────────────── */
const groups = [
  {
    id: 1,
    name: 'AI 연구소',
    desc: '딥러닝 모델과 실용적인 응용 프로그램에 대한 공동 연구.',
    category: '프로젝트',
    tags: ['#AI', '#Python', '#연구'],
    members: '12/15',
    views: '1.2k',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCt8-8tOIOEpccRkg5XIIrIwAN02VH4LMv0TqjhuXFarQI13_dUB238LcnOX8PQUmxJYZyvH7zM-ZRZsdLF8MAohE9C_BrTMff7WAxLjr19RvNdtUR7QYhpnF28Fv2AVrOSz1wF5AQvVlqhCO9KecK7DL_NaelBCB_L789DbOx-nYh6uYLfxuqvwg_dRLHrEG-H1kTvyoYJu3NDA1B9s4wiI_4yeEJoQ2OW5NRzg3zhysyC7UqY16Cd1yr690_tzntj7F_j6JIasb0r',
    recruiting: true,
    role: '데이터 과학자',
  },
  {
    id: 2,
    name: '크리에이티브 아트 클럽',
    desc: '학생들을 위한 주간 디지털 아트 워크숍 및 공동 전시회.',
    category: '동아리',
    tags: ['#디자인', '#예술'],
    members: '28/30',
    views: '840',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnICQr2qePRDIihWtxVplImbtV0vaYeKTpc-R8CAIOPfomX4zFgfeysQSGezdp95WeaqQ0rMJNe_BiNf5LXWSzQ0axqPtCs7mhXWEGSKauZ9qA4oRtrNsTpIxNGm6L44E1_9Dy28WWykSQCUICJw-yf2op0jdymqnNknRW_-0LUTlOuRWYMgbGju9qfFiD90L4c-4ezAeq5913MeU_in2QNDMMg-ZFeQLj4Dg4ZtnrOevSAVz8ppc3zXBcp6SZQZQvEbkcSt-G-o83',
    recruiting: true,
    role: '일반 회원',
  },
  {
    id: 3,
    name: '알고 마스터즈',
    desc: '코딩 인터뷰를 준비 중이신가요? 매일 진행되는 리트코드 챌린지에 참여하세요.',
    category: '스터디',
    tags: ['#알고리즘', '#코딩'],
    members: '4/6',
    views: '2.5k',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbui9f6BuDqGW9D095tY_F7iaM1MQGDu-8Xg_iPjndPklHYHfEh4p_VT3TXUaZBdrS72k5tvfVEjM2LkMxzJutVTE7IeqFw7_CKVYO5cSOob-Wh_v823nGjQKGSxwLJ_0rgm8UMAjRV9H8uAo8V20w52w9cJp4P_Q00MgtFwaZAdmpgXTwCTAjFYnSNkaCj0T9tuY_4NeAIf_oUZ2JhxGrtVnQogv74jzadaStWnE_fiR6ecPMe0dXKXXOxQUhWvrbdE3sg2IYIjDN',
    recruiting: true,
    role: '백엔드 개발자',
  },
  {
    id: 4,
    name: '스타트업 인큐베이터',
    desc: '다음 유니콘 기업을 만듭니다. MVP 개발에 열정적인 분들을 찾습니다.',
    category: '프로젝트',
    tags: ['#스타트업', '#비즈니스'],
    members: '3/5',
    views: '562',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPf13zOWWofJEQVkTpIoKh73T8Yjow8Fno6bgJKPl1da1YDbOZUXrH25ibKs_M5xwuT8J_VkggJ4FEd1BM6fTuxizmKcTMOPYWqjHTWHzY6grm2Ka5D81uFLJbpWSYZNpIDEOXErOlOj3lU5jZs-hDUlns_PYVB3vNJNczF9ivF5C_yczPJnS-hi4CqnqkcJeVoFJD837RggjqR7PugE4cbASOflMMbGmbTEn-ZkPtkyxtxI073_YnOGIGwOMfogFMSIABHeoChCYv',
    recruiting: true,
    role: 'UI/UX 디자이너',
  },
  {
    id: 5,
    name: '주말 등산 모임',
    desc: '매주 토요일 아침, 경기도의 아름다운 산들을 탐험하세요.',
    category: '동아리',
    tags: ['#아웃도어', '#건강'],
    members: '45/50',
    views: '3.1k',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpcjmXQ2rDwpZ8aY0aa8NJ1ngHn6AVqbexNqPKg8cfDGYRsicAqq8xcusYivMiTemsBAlGLo783TaidYzb5JvXw45Dc7xDjKeDMzwxzr4QQHkIHlSKnAEGMqJc81_5fnBu1V29DJ0iwekPZznmlYczQjyCK3q38yYslEFj_m3iN_rr2PylrUnJkbDnmJKC6sry0AGZ0XNI0hU4fGVgSo_EJEbQ7Bcb4lnQKffBUAfAZw3Bd475LrYDNdJBclSyw3hWxJ_yAygIRcuK',
    recruiting: true,
    role: '신입 회원',
  },
  {
    id: 6,
    name: '리액트 네이티브 앱',
    desc: '리액트 네이티브를 사용하여 피트니스 트래킹 앱을 함께 만들 파트너를 찾습니다.',
    category: '프로젝트',
    tags: ['#모바일', '#리액트'],
    members: '2/4',
    views: '150',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOR7nCx0N4ZOZ6qpR10xGqLZrJuCfr37F_4MZYcu9tK0DxJJ7pk3DpBeKO83cdGpSfyB-FE4TqzdeOC9wIvY_LWN4LOziLead9mwTR_UOCYrjTH95INkZtih-_AcxUzA7j6ZFGGcOkFFwb6myxLVa7mw56h-MAcpNP4xtHfOAzt3Jh3z0T8pDwdjHZx3RKSe0pSFsUTeAE-MVjdnzpV2uy5KZsHm1ezZMJiXPV0qpWuNLKTy6iOi3TWH_a5ohQ33CuykzD68es0TOF',
    recruiting: true,
    role: '프론트엔드 개발자',
  },
  {
    id: 7,
    name: '영어 회화',
    desc: '중급 학습자를 위한 캐주얼 영어 회화 연습.',
    category: '스터디',
    tags: ['#언어', '#글로벌'],
    members: '5/8',
    views: '420',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaalxYzYOuW1fTqzhjcyNJeumQ9IRLD_411SRo972dFPjfn2J_FFaVmiccT43i3Z4G9bY8sq3j2WPmDk1RZMVp1IPe3K0JuKcfXQywwyvW9nU6frDhbTFSWrI9uO6Bx38bdrS9I2-4R2qokqhgrzKnM-twEZolSWmkldpoNqbMSPpBIS8nSHD7UDYkZ0rkFUaSL5_iZknZOvcBBZicQt2k1kGmeCYR6z5JaGLWQEDfhgZPhzJyOWvrM8pzRLOUqwaDfN9JYGl1ODml',
    recruiting: false,
    role: '모집 마감',
  },
  {
    id: 8,
    name: '인디 뮤직 잼',
    desc: '인디 음악 애호가들을 위한 주간 잼 세션. 모든 악기 환영!',
    category: '동아리',
    tags: ['#음악', '#밴드'],
    members: '8/10',
    views: '2.1k',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCr-4vxUUksbSAIX1JcWDVVMR7ycPSn40G1lcHlTlnWWrl0TAvW_sUW4_S5JogwUoJOYgddhTJioztvuA_yWtn13wUb3moKEHwv4eoAnuedfqxTVhc8dawEjWkWKZ4elTOBEUmuRYMrMYhtyMlA1153rPGIuE7km4mOgKnTb-kGNoKDDqKllSngN5-Xs9H6vZ60X5gDe5B4_XVfRFXu9MDqjPxNhH6fP8zpQzZpCLZdconqD6G-GrAaEqiGbTETDwSEUSwhh7_E8uTu',
    recruiting: true,
    role: '드러머',
  },
];

/* ── Component ─────────────────────────── */
export default function GroupExplorePage() {
  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>그룹 탐색</h1>
        <p className={styles.subtitle}>
          대학 간의 다음 프로젝트, 동아리 또는 스터디 그룹을 찾아보세요. 같은 관심사를 가진 동료들과 연결되고 함께 성장하세요.
        </p>
      </div>

      {/* Filter Bar */}
      <div className={styles.filterBar}>
        <div className={styles.filterBtns}>
          <button className={styles.filterDropdown}>
            카테고리: <strong>전체</strong>
            <ChevronDown size={18} />
          </button>
          <button className={styles.filterDropdown}>
            지역: <strong>서울</strong>
            <ChevronDown size={18} />
          </button>
          <button className={styles.filterDropdown}>
            활동 방식: <strong>온/오프라인</strong>
            <ChevronDown size={18} />
          </button>
        </div>
        <div className={styles.sortArea}>
          <span className={styles.sortLabel}>정렬:</span>
          <select className={styles.sortSelect}>
            <option>추천순</option>
            <option>최신순</option>
            <option>인기순</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className={styles.grid}>
        {groups.map(g => (
          <article key={g.id} className={styles.card}>
            <div className={styles.cardImage}>
              <span className={styles.cardBadge}>{g.category}</span>
              <img className={styles.cardImg} src={g.image} alt={g.name} />
              <div className={styles.cardGrad} />
              <div className={styles.cardOverlay}>
                <div className={styles.cardStat}>
                  <Users size={14} />
                  <span>{g.members}</span>
                </div>
                <div className={styles.cardStat} style={{ opacity: 0.9 }}>
                  <Eye size={14} />
                  <span>{g.views}</span>
                </div>
              </div>
            </div>
            <div className={styles.cardBody}>
              <div>
                <h3 className={styles.cardTitle}>{g.name}</h3>
                <p className={styles.cardDesc}>{g.desc}</p>
              </div>
              <div className={styles.tags}>
                {g.tags.map(t => (
                  <span key={t} className={styles.tag}>{t}</span>
                ))}
              </div>
              <div className={styles.cardFooter}>
                <div className={styles.recruitInfo}>
                  <div className={g.recruiting ? styles.recruitDot : styles.recruitDotClosed} />
                  <span className={styles.recruitLabel}>모집 중:</span>
                </div>
                {g.recruiting ? (
                  <span className={styles.recruitRole}>{g.role}</span>
                ) : (
                  <span className={styles.recruitClosed}>{g.role}</span>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Pagination */}
      <div className={styles.pagination}>
        <button className={styles.pageBtn}>
          <ChevronLeft size={18} />
        </button>
        <button className={styles.pageBtnActive}>1</button>
        <button className={styles.pageBtn}>2</button>
        <button className={styles.pageBtn}>3</button>
        <span className={styles.pageEllipsis}>...</span>
        <button className={styles.pageBtn}>12</button>
        <button className={styles.pageBtn}>
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
