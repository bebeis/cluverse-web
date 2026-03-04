'use client';

import React, { useState } from 'react';
import styles from './Trending.module.css';
import { User, Heart, MessageCircle, Bookmark } from 'lucide-react';

const trendingPosts = [
  {
    id: 1, rank: 1, category: '정보', catStyle: 'catInfo', time: '10분 전',
    title: '이번 학기 수강신청 꿀팁 공유합니다! (절대 실패 안 함)',
    excerpt: '수강신청 대란 속에서 살아남는 법, 저만의 노하우를 공개합니다. 서버 시간 확인부터 광클 팁까지, 신입생 분들은 꼭 읽어보세요.',
    author: '김철수', likes: 120, comments: 45, bookmarked: true,
    thumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD52ol4v9sy-gpsluidZRHAugxKJiYpHMkAUbcjZu0CqAadK3lqaQaDz0-z6UugLj-KWaFKwgGG5RwSrUQj_zPca8FXNOmTXAvRtYzXCrUye5RIsOA9LSKdc3fGa9G1jvvdQmQkGEQ7-OA9qNNHi8pGlVq04feNtvvKeBL7cN1-8Sf3P9ahHpwr4_JjuypOCltSIBK83lxtiKH9DZvoEfxdpVtGTGU8GawdFIhJjY7uCDN20-yqLnF1lKrZ7-yAiE-9vSLG_sx72X-0'
  },
  {
    id: 2, rank: 2, category: 'HOT', catStyle: 'catHot', time: '35분 전',
    title: '오늘 학식 메뉴 추천 좀 해주세요',
    excerpt: '1학관이랑 2학관 중에서 어디가 더 맛있나요? 오늘 돈가스 나온다는데 드셔보신 분 후기 좀 부탁드려요!',
    author: '익명', likes: 85, comments: 32, bookmarked: false, thumb: null
  },
  {
    id: 3, rank: 3, category: '질문', catStyle: 'catQuestion', time: '1시간 전',
    title: '교환학생 준비하는데 토플 점수 어느 정도 받아야 할까요?',
    excerpt: '미국 쪽 생각하고 있는데, 안정권 점수가 궁금합니다. 지금 80점 정도 나오는데 학원 다니는 게 나을까요?',
    author: '글로벌도전', likes: 56, comments: 18, bookmarked: false,
    thumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeKgc5anBGjMiTG--mHYAWo0pG_BGVs99CRaZhbbsxmRZXlq8468uQ026MtDvbf0NMw3JCin-4TUleD9zt0p7QeBY5mfpE6dUGelwp6My0ppHgisHfBUIsN5CKFoaVSzMptgbF0IY8jYkjbKQ0nm5aInzYogsVtyFZIJIIVbbGc0waBfOtsUzcYGqckKzgxuzB8o5KhjZXPGMJ3HMjGXEe3VR9kgnFsi5IOvVK1TlVZEpZ3-BmXUf7RfY1mTfkkXBiiTIwklpbhqI7'
  },
  {
    id: 4, rank: 4, category: '동아리', catStyle: 'catClub', time: '2시간 전',
    title: '사진 동아리 "포커스" 신입 부원 모집합니다!',
    excerpt: '카메라가 없어도 괜찮아요! 사진을 사랑하는 마음만 있다면 누구나 환영합니다. 매주 출사 나가고 전시회도 열어요.',
    author: '포커스회장', likes: 42, comments: 12, bookmarked: false, thumb: null
  },
  {
    id: 5, rank: 5, category: '장터', catStyle: 'catMarket', time: '3시간 전',
    title: '전공 서적 팝니다 (미적분학, 일반물리학)',
    excerpt: '필기감 거의 없는 S급입니다. 반값에 넘겨요. 쪽지 주세요. 쿨거래시 네고 가능합니다.',
    author: '팝니다', likes: 28, comments: 5, bookmarked: false,
    thumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9TnI4mZoKwiFY17cCDIM6CiYz4a48O8XPWooPLR1jkkuUVwtrUvrkk46hDb7iDUM2MmOGXyvFuQ_naIyzn5UbznOJiB_peZJiIfAWwrj1LDwgW0eQhXH_cdWRLPP_zKgvQOLZyfInF80GiaH72zUcCA9a2pFyidNxTTJ4Il-fVOmENN04aHvJTUOfRqY1N5qeTgophuc-UFOW_XHOIBZDIN2a-H-CIIMKldDEit-CH_1m5w4AzPBo5n3KxmIr1WCB4ESXYE3EtdX9'
  }
];

export default function TrendingPage() {
  const [activeTab, setActiveTab] = useState('trending');
  const [activeFilter, setActiveFilter] = useState('all');

  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>트렌딩 및 북마크</h1>
        <p className={styles.pageDesc}>캠퍼스의 핫한 소식과 내가 저장한 유용한 글들을 확인하세요.</p>
      </div>

      <div className={styles.tabNav}>
        <button 
          className={`${styles.tab} ${activeTab === 'trending' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('trending')}
        >
          실시간 트렌딩
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'bookmarks' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('bookmarks')}
        >
          내 북마크
        </button>
      </div>

      <div className={styles.filters}>
        {['all', 'question', 'info', 'chat', 'career'].map(f => (
          <button 
            key={f}
            className={`${styles.filterBtn} ${activeFilter === f ? styles.filterBtnActive : ''}`}
            onClick={() => setActiveFilter(f)}
          >
            {f === 'all' ? '전체' : f === 'question' ? '질문' : f === 'info' ? '정보' : f === 'chat' ? '자유수다' : '취업/진로'}
          </button>
        ))}
      </div>

      <div className={styles.trendList}>
        {trendingPosts.map(post => (
          <div key={post.id} className={styles.trendItem}>
            <div className={styles.rankBadge}>
              <div className={`${styles.rankNum} ${post.rank <= 3 ? styles.rankTop : styles.rankNormal}`}>
                {post.rank}
              </div>
            </div>
            <div className={styles.trendContent}>
              <div className={styles.metaRow}>
                <span className={`${styles.categoryBadge} ${styles[post.catStyle]}`}>{post.category}</span>
                <span className={styles.metaTime}>{post.time}</span>
              </div>
              <h3 className={styles.trendTitle}>{post.title}</h3>
              <p className={styles.trendExcerpt}>{post.excerpt}</p>
              <div className={styles.statsRow}>
                <div className={styles.statsLeft}>
                  <span className={styles.statIcon}><User size={14} /> {post.author}</span>
                  <span className={styles.statIcon}><Heart size={14} /> {post.likes}</span>
                  <span className={styles.statIcon}><MessageCircle size={14} /> {post.comments}</span>
                </div>
                <button className={styles.bookmarkBtn}>
                  <Bookmark size={18} fill={post.bookmarked ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>
            {post.thumb && (
              <div className={styles.trendThumb}>
                <img src={post.thumb} alt="" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={styles.loadMore}>
        <button className={styles.loadMoreBtn}>더 보기</button>
      </div>
    </>
  );
}
