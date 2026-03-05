'use client';

import React from 'react';
import styles from './HomePage.module.css';
import { PenTool, Flame, MessageSquare, Music, BookOpen, ShoppingBag } from 'lucide-react';
import { PostCard } from '@/components/ui/PostCard';

const mockPosts = [
  {
    id: 1,
    title: '이번 주말 한강에서 보드게임 피크닉 하실 분! 🎲',
    excerpt: '날씨도 풀렸는데 반포 한강공원에서 치맥하면서 보드게임 해요! 루미큐브랑 스플랜더 챙겨갈게요. 타 학교 친구들도 환영합니다 :)',
    authorNickname: '박현우',
    schoolName: '연세대학교',
    timeAgo: '20분 전',
    views: 0,
    likes: 24,
    comments: 8,
    category: '모임',
    isAnonymous: false,
    boardType: 'recommend'
  },
  {
    id: 2,
    title: '프론트엔드 개발자 취업 준비 질문있습니다.',
    excerpt: '현재 4학년 막학기인데 포트폴리오 프로젝트를 하나 더 하는게 좋을까요 아니면 코딩테스트 준비에 올인하는게 맞을까요? 현재 React 프로젝트 2개 정도 있는데, 백엔드 연동 경험이 좀 부족한 것 같아서 고민입니다. 선배님들의 조언 부탁드려요!',
    authorNickname: '익명',
    schoolName: '고려대학교',
    timeAgo: '1시간 전',
    views: 0,
    likes: 56,
    comments: 32,
    category: '자유게시판',
    isAnonymous: true,
    boardType: 'subscription'
  },
  {
    id: 3,
    title: '연합 밴드 동아리 "SoundWave" 5기 모집',
    excerpt: '음악을 사랑하는 대학생이라면 누구나! 보컬/드럼/베이스 모집중',
    authorNickname: '운영진',
    schoolName: '연합',
    timeAgo: '마감 D-3',
    views: 0,
    likes: 120,
    comments: 45,
    category: '동아리 모집',
    isAnonymous: false,
    boardType: 'recommend'
  }
];

export default function HomePage() {
  return (
    <>
      <div className={styles.bannerGroup}>
        <div className={styles.bannerContent}>
          <h2 className={styles.bannerHeadline}>오늘의 캠퍼스 라이프, <br/>Cluverse에서 시작하세요!</h2>
          <p className={styles.bannerSubline}>타 학교 친구들과 교류하고, 새로운 취미를 발견해보세요.</p>
          <div className={styles.bannerBtnsRow}>
            <button className={styles.btnSolid}>동아리 찾기</button>
            <button className={styles.btnGlass}>친구 초대하기</button>
          </div>
        </div>
        <div className={styles.glowTopRight}></div>
        <div className={styles.glowBottomRight}></div>
      </div>

      <div className={styles.tagsContainer}>
        <button className={`${styles.tagBtn} ${styles.tagBtnActive}`}>전체</button>
        <button className={styles.tagBtn}><Flame size={16} className={styles.tagIcon} /> 인기글</button>
        <button className={styles.tagBtn}><MessageSquare size={16} className={styles.tagIcon} /> 자유게시판</button>
        <button className={styles.tagBtn}><Music size={16} className={styles.tagIcon} /> 동아리 모집</button>
        <button className={styles.tagBtn}><BookOpen size={16} className={styles.tagIcon} /> 스터디</button>
        <button className={styles.tagBtn}><ShoppingBag size={16} className={styles.tagIcon} /> 중고장터</button>
      </div>

      <div className={styles.feedContainer}>
        {mockPosts.map(post => (
          <PostCard
            key={post.id}
            title={post.title}
            excerpt={post.excerpt}
            authorNickname={post.authorNickname}
            schoolName={post.schoolName}
            timeAgo={post.timeAgo}
            views={post.views}
            likes={post.likes}
            comments={post.comments}
            category={post.category}
            isAnonymous={post.isAnonymous}
          />
        ))}
      </div>

      <button className={styles.fabBtn} aria-label="글쓰기">
        <PenTool size={24} />
      </button>
    </>
  );
}
