'use client';

import React, { useState } from 'react';
import styles from './Board.module.css';
import { ChevronRight, Eye, Heart, MessageCircle, SlidersHorizontal, ChevronDown, Megaphone, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const boardPosts = [
  { id: 1, badge: '질문', time: '방금 전', title: 'CS 전공과목 공부 순서 질문드립니다!', excerpt: '1학년 마치고 군대 다녀와서 복학하는데 운영체제랑 컴퓨터구조랑 동시에 들어도 괜찮을까요? 선배님들의 조언 부탁드립니다.', author: '복학생', color: '#6B7280', views: 42, likes: 0, comments: 0 },
  { id: 2, badge: '질문', time: '14분 전', title: '맥북 에어 M2 vs M3 개발용으로 큰 차이 있나요?', excerpt: '이번에 노트북 새로 장만하려고 하는데 가격 차이가 꽤 나서 고민입니다. 주로 웹 개발(React, Node.js) 위주로 할 것 같고 가끔 도커 정도 돌릴 것 같습니다.', author: '앱등이', color: '#3B82F6', views: 128, likes: 5, comments: 12 },
  { id: 3, badge: '질문', time: '32분 전', title: '파이썬 딥러닝 입문 강의 추천 부탁드려요', excerpt: '혼자 책으로 공부하다가 한계가 와서 인강 들어보려고 합니다. 유료 무료 상관없이 기초부터 탄탄하게 잡아주는 강의 있으면 추천 부탁드립니다!', author: '데이터조아', color: '#A855F7', views: 89, likes: 12, comments: 6 },
  { id: 4, badge: '질문', time: '1시간 전', title: '이번 학기 알고리즘 수업 팀플 있나요?', excerpt: '김철수 교수님 알고리즘 수업 신청했는데 강의계획서에 팀 프로젝트 관련 내용이 없어서요. 작년에 들으신 분들 계신가요?', author: '익명', color: '#22C55E', views: 210, likes: 3, comments: 8 },
];

const hotIssues = [
  { rank: 1, title: '네이버 하반기 공채 코테 후기', comments: 45, likes: 120 },
  { rank: 2, title: '3학년 여름방학 인턴 준비 팁', comments: 32, likes: 85 },
  { rank: 3, title: '맥북 프로 14인치 공동구매 하실 분', comments: 28, likes: 56 },
];

export default function BoardPage() {
  const [activeChip, setActiveChip] = useState('질문');
  const chips = ['전체', '정보', '질문', '진로/취업', '프로젝트'];

  return (
    <>
      {/* Left sidebar content is in the layout, this is center content */}
      <div className={styles.filterBox}>
        <div className={styles.filterRow}>
          <div className={styles.chipRow}>
            {chips.map(chip => (
              <button 
                key={chip} 
                className={`${styles.chip} ${activeChip === chip ? styles.chipActive : ''}`}
                onClick={() => setActiveChip(chip)}
              >
                {chip}
              </button>
            ))}
          </div>
          <div className={styles.sortRow}>
            <div className={styles.sortBtns}>
              <button className={styles.sortActive}>
                최신순 <ChevronDown size={14} />
              </button>
              <button className={styles.sortInactive}>인기순</button>
              <button className={styles.sortInactive}>댓글 많은순</button>
            </div>
            <div className={styles.filterBadge}>
              <span className={styles.filterText}>필터 적용됨</span>
              <button className={styles.tuneBtn}>
                <SlidersHorizontal size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.postList}>
        {boardPosts.map(post => (
          <div key={post.id} className={styles.postItem}>
            <div className={styles.postTop}>
              <span className={styles.postBadge}>{post.badge}</span>
              <span className={styles.postTime}>{post.time}</span>
            </div>
            <h3 className={styles.postTitle}>{post.title}</h3>
            <p className={styles.postExcerpt}>{post.excerpt}</p>
            <div className={styles.postFooter}>
              <div className={styles.postAuthor}>
                <div className={styles.avatarInitial} style={{ background: `${post.color}20`, color: post.color }}>
                  {post.author.charAt(0)}
                </div>
                <span className={styles.authorName}>{post.author}</span>
                <span className={styles.postAuthorDivider}>|</span>
                <div className={styles.postStats}>
                  <span className={styles.postStat}><Eye size={14} /> {post.views}</span>
                  <span className={styles.postStat}><Heart size={14} /> {post.likes}</span>
                  <span className={`${styles.postStat} ${styles.postStatPrimary}`}><MessageCircle size={14} /> {post.comments}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
