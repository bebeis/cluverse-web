'use client';

import React, { useState, useEffect } from 'react';
import styles from './HomePage.module.css';
import { PenTool, Flame, MessageSquare, Music, BookOpen, ShoppingBag } from 'lucide-react';
import { PostCard } from '@/components/ui/PostCard';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const fetchHomeFeed = async () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
  const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

  const mockFallback = [
    {
      id: 1,
      title: '이번 주말 한강에서 보드게임 피크닉 하실 분!',
      excerpt: '날씨도 풀렸는데 반포 한강공원에서 치맥하면서 보드게임 해요! 루미큐브랑 스플랜더 챙겨갈게요. 타 학교 친구들도 환영합니다 :)',
      authorNickname: '박현우',
      schoolName: '연세대학교',
      timeAgo: '20분 전',
      views: 0,
      likes: 24,
      comments: 8,
      category: '모임',
      isAnonymous: false,
    },
    {
      id: 2,
      title: '프론트엔드 개발자 취업 준비 질문있습니다.',
      excerpt: '선배님들의 조언 부탁드려요!',
      authorNickname: '익명',
      schoolName: '고려대학교',
      timeAgo: '1시간 전',
      views: 12,
      likes: 56,
      comments: 32,
      category: '자유게시판',
      isAnonymous: true,
    }
  ];

  if (USE_MOCK) return mockFallback;

  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/feeds/home?filter=ALL&limit=20`);
    if (!res.ok) throw new Error('Feed API is not ready');
    const json = await res.json();
    return json.data.posts.map((post: any) => ({
      id: post.postId,
      title: post.title,
      excerpt: post.contentPreview,
      authorNickname: post.author?.nickname || '알 수 없음',
      schoolName: post.author?.universityName || post.board?.name || '소속 미상', // API 스펙상 author.universityName 누락됨
      timeAgo: '방금 전', // created_at 포맷팅 처리 필요
      views: post.viewCount || 0,
      likes: post.likeCount || 0,
      comments: post.commentCount || 0,
      category: post.category || '일반',
      isAnonymous: post.isAnonymous,
    }));
  } catch (error) {
    console.warn('API 연동 실패로 Mock 데이터를 반환합니다.', error);
    return mockFallback;
  }
};

export default function HomePage() {
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    fetchHomeFeed().then(data => setPosts(data));
  }, []);
  
  return (
    <>
      <div className={styles.bannerGroup}>
        <div className={styles.bannerContent}>
          <h2 className={styles.bannerHeadline}>오늘의 캠퍼스 라이프, <br/>Cluverse에서 시작하세요!</h2>
          <p className={styles.bannerSubline}>타 학교 친구들과 교류하고, 새로운 취미를 발견해보세요.</p>
          <div className={styles.bannerBtnsRow}>
            <Link href="/explore/groups" className={styles.btnSolid}>동아리 찾기</Link>
            <button className={styles.btnGlass} onClick={() => alert('친구 초대 링크가 복사되었습니다.')}>친구 초대하기</button>
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
        {posts.map(post => (
          <PostCard
            key={post.id}
            id={post.id}
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

      <button className={styles.fabBtn} aria-label="글쓰기" onClick={() => router.push('/write')}>
        <PenTool size={24} />
      </button>
    </>
  );
}
