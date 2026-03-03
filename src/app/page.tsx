'use client';

import { useState } from 'react';
import { TopAppBar } from '@/components/ui/TopAppBar';
import { Tabs } from '@/components/ui/Tabs';
import { PostCard } from '@/components/ui/PostCard';
import { BottomNav } from '@/components/ui/BottomNav';
import { FilterChipGroup } from '@/components/ui/FilterChipGroup';

// Mock Data for demonstration
const mockPosts = [
  {
    id: 1,
    title: 'AI 딥러닝 프로젝트 팀원 모집합니다',
    excerpt: '이번 학기에 진행할 음성인식 기반의 생성형 AI 서비스를 기획 중입니다. 프론트엔드와 백엔드 개발자 구합니다.',
    authorNickname: 'Neo',
    schoolName: '서울대학교',
    timeAgo: '10분 전',
    views: 142,
    likes: 12,
    comments: 4,
    category: '모집',
    isAnonymous: false,
    boardType: 'recommend'
  },
  {
    id: 2,
    title: '이번 컴공 알고리즘 과제 질문있습니다',
    excerpt: 'DP 문제 푸는데 점화식이 도저히 안 세워집니다. 비슷한 문제 풀어보신 분 팁 좀 주실 수 있나요?',
    authorNickname: '학생A',
    schoolName: '한국대학교',
    timeAgo: '45분 전',
    views: 89,
    likes: 3,
    comments: 11,
    category: '질문',
    isAnonymous: true,
    boardType: 'subscription'
  },
  {
    id: 3,
    title: '스타트업 인턴 3개월 후기 적어봅니다',
    excerpt: '우선 가장 많이 배운 점은 실무 환경에서의 협업 방식이었습니다. 학교 과제와 다르게 코드 리뷰 문화가...',
    authorNickname: '개발자지망생',
    schoolName: '연세대학교',
    timeAgo: '2시간 전',
    views: 450,
    likes: 85,
    comments: 20,
    category: '후기',
    isAnonymous: false,
    boardType: 'recommend'
  }
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('home');
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeBottomNav, setActiveBottomNav] = useState('home');

  const filterOptions = [
    { id: 'all', label: '전체' },
    { id: 'subscription', label: '구독한 보드' },
    { id: 'recommend', label: '추천글' },
    { id: 'hot', label: '인기글🔥' },
  ];

  const filteredPosts = activeFilter === 'all' 
    ? mockPosts 
    : mockPosts.filter(post => post.boardType === activeFilter || (activeFilter === 'hot' && post.likes > 50));

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', paddingBottom: '80px' }}>
      <TopAppBar 
        title="Cluverse 홈" 
        rightAction={<div style={{ fontSize: '20px', cursor: 'pointer' }}>🔍</div>} 
      />
      
      <Tabs 
        tabs={[
          { id: 'home', label: '모아보기' },
          { id: 'trending', label: '트렌딩' }
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
        fullWidth
      />

      {activeTab === 'home' && (
        <div style={{ padding: '0 16px', backgroundColor: 'white' }}>
          <FilterChipGroup 
            options={filterOptions}
            selectedId={activeFilter}
            onChange={setActiveFilter}
          />
        </div>
      )}

      <main style={{ padding: '16px' }}>
        {filteredPosts.map(post => (
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
        
        {filteredPosts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#94A3B8' }}>
            해당 조건의 글이 없습니다.
          </div>
        )}
      </main>

      <button style={{
        position: 'fixed',
        bottom: '90px',
        right: '20px',
        width: '56px',
        height: '56px',
        borderRadius: '28px',
        backgroundColor: '#2F80ED',
        color: 'white',
        fontSize: '24px',
        border: 'none',
        boxShadow: '0 4px 12px rgba(47, 128, 237, 0.4)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100
      }}>
        ✍️
      </button>

      <BottomNav 
        activeTab={activeBottomNav}
        onTabChange={setActiveBottomNav}
      />
    </div>
  );
}
