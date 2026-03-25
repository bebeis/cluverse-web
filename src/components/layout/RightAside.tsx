'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Flame, Plus } from 'lucide-react';
import styles from './RightAside.module.css';

interface RecentCommentPost {
  postId: number;
  title: string;
  lastCommentRepliedAt: string;
}

const PAGE_SIZE = 5;

const MOCK_RECENT_POSTS: RecentCommentPost[] = [
  { postId: 1, title: '스프링 스터디 모집합니다', lastCommentRepliedAt: '2026-03-21T15:40:00' },
  { postId: 2, title: 'JPA 질문 있습니다', lastCommentRepliedAt: '2026-03-21T14:10:00' },
  { postId: 3, title: '중간고사 범위 어디까지예요?', lastCommentRepliedAt: '2026-03-21T13:30:00' },
  { postId: 4, title: '축제 라인업 아시는 분?', lastCommentRepliedAt: '2026-03-21T12:00:00' },
  { postId: 5, title: '자취방 양도합니다', lastCommentRepliedAt: '2026-03-21T11:20:00' },
  { postId: 6, title: '공모전 팀원 구해요', lastCommentRepliedAt: '2026-03-21T10:50:00' },
  { postId: 7, title: '알고리즘 스터디 같이 해요', lastCommentRepliedAt: '2026-03-21T09:30:00' },
  { postId: 8, title: '해외봉사 후기 공유합니다', lastCommentRepliedAt: '2026-03-21T08:45:00' },
  { postId: 9, title: '학식 오늘 뭐 나왔나요', lastCommentRepliedAt: '2026-03-21T08:10:00' },
  { postId: 10, title: '도서관 자리 현황 어떤가요', lastCommentRepliedAt: '2026-03-21T07:55:00' },
];

export default function RightAside() {
  const [recentPosts, setRecentPosts] = useState<RecentCommentPost[]>([]);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
        const headers: HeadersInit = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const res = await fetch(`${API_BASE_URL}/api/v1/posts/recent-comment-replied?size=10`, { headers });
        if (!res.ok) throw new Error('fetch failed');
        const json = await res.json();
        setRecentPosts(json.data);
      } catch {
        console.warn('API 연동 실패로 Mock 데이터를 반환합니다.');
        setRecentPosts(MOCK_RECENT_POSTS);
      }
    };
    fetchRecentPosts();
  }, []);

  const totalPages = Math.ceil(recentPosts.length / PAGE_SIZE);
  const pagePosts = recentPosts.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

  return (
    <aside className={styles.container}>
      {/* Trending Keywords Box */}
      <div className={styles.box}>
        <div className={styles.headerRow}>
          <h3 className={styles.title}>실시간 인기 키워드</h3>
          <Flame size={15} className={styles.iconTrending} />
        </div>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            <div className={styles.itemLeft}>
              <span className={styles.rankTop}>1</span>
              <span className={styles.keyword}>중간고사</span>
            </div>
            <span className={styles.badgeNew}>new</span>
          </li>
          <li className={styles.listItem}>
            <div className={styles.itemLeft}>
              <span className={styles.rankTop}>2</span>
              <span className={styles.keyword}>축제 라인업</span>
            </div>
          </li>
          <li className={styles.listItem}>
            <div className={styles.itemLeft}>
              <span className={styles.rankTop}>3</span>
              <span className={styles.keyword}>해외봉사</span>
            </div>
          </li>
          <li className={styles.listItem}>
            <div className={styles.itemLeft}>
              <span className={styles.rankNormal}>4</span>
              <span className={styles.keyword}>자취방 양도</span>
            </div>
          </li>
          <li className={styles.listItem}>
            <div className={styles.itemLeft}>
              <span className={styles.rankNormal}>5</span>
              <span className={styles.keyword}>공모전 팀원</span>
            </div>
            <span className={styles.badgeNew}>▲</span>
          </li>
        </ul>
      </div>

      {/* Recommended Groups Box */}
      <div className={styles.box}>
        <div className={styles.headerRow}>
          <h3 className={styles.title}>추천 모임</h3>
          <Link href="/explore/groups" className={styles.linkBtn}>더보기</Link>
        </div>
        
        <div className={styles.groupList}>
          <div className={styles.groupItem}>
            <img 
              alt="Film Club" 
              className={styles.groupImg} 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9LgkF6xirT-mqqGsr-bdm6wtRs7ilEtQK4WyIRICXDr6EfyuSDPuBYg8Cx6XRN1htEzo0fgJ7d8uaMehw1rM0PHK2xbt0UE4OO17RcbHpOgPccTeQbW_lhgHfBA69Y0M5kzTPy-vkn1BH1mZOBZ--tdGnKuCkqb7uSzaUuOR8VrRk15n6rcg2NTZwJd_UCjLz_qUGa0faW_Nu15nZsR35kt_O7a6HKbk1i50GDGuNcJqOnHM0wxAVyGk5Fkv8iVcY2ScZdgV-JSlx"
            />
            <div className={styles.groupInfo}>
              <h4 className={styles.groupName}>시네마 천국</h4>
              <p className={styles.groupDesc}>매주 금요일 영화 감상 모임</p>
            </div>
            <button className={styles.addBtn}><Plus size={20} /></button>
          </div>

          <div className={styles.groupItem}>
            <img 
              alt="Coding Club" 
              className={styles.groupImg} 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCaLlSuEloXdjIbiw9qVt9vGpNSzxeoP7g2m9tTTl6AVmyAzSCCYMt_2bqbE9-xMHtNNOfVZ9sX_eecTgJ94HeJS5trxbd9V9mGV-UtXQi95U3Csv9zh2wtP6d46IMUPKgKhSJUWQsikTNRTPuG9ZAwg7eoWKTlmhgLDbRomJbLUhh3zUOZX9XU1eEAdk64VVulVB9wutDU9EELj8SvYW-kJBjLNAcMTQzoFPjHn6zhEpAVZzr5wXYdnCNbXMwdY2g71YoS7hb_J9lE"
            />
            <div className={styles.groupInfo}>
              <h4 className={styles.groupName}>알고리즘 뿌셔</h4>
              <p className={styles.groupDesc}>백준 플래티넘 도전 스터디</p>
            </div>
            <button className={styles.addBtn}><Plus size={20} /></button>
          </div>

          <div className={styles.groupItem}>
            <img 
              alt="Hiking Club" 
              className={styles.groupImg} 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7fFKNVLvUxg_IbeDa3JRTMfmiLNMvAiba7CWQXyFcQxN334a5ZBiMFrd0eBy5YXDPA2u1eHxKndbByqtxeRYI4lRWhdvlXZvWEFq0dbXOiUaXZmhfSLLE0S7fIp2hVZALsYTL3xEAqkbEhK3XJYnlneacmcNXw2Plc6I_8oMTEbHxeIgA3u5apHBafEIUVjtjsBghDWhDuzPchsotaKC4t57seSrXu_DBKm9D7p0fPWg1C1xlNUEjdNGMaw-InWnnPZyor_Fyy5f0"
            />
            <div className={styles.groupInfo}>
              <h4 className={styles.groupName}>산악회 '오르자'</h4>
              <p className={styles.groupDesc}>주말 근교 산행 함께해요</p>
            </div>
            <button className={styles.addBtn}><Plus size={20} /></button>
          </div>
        </div>
      </div>

      {/* Recent Commented Posts Box */}
      <div className={styles.box}>
        <div className={styles.headerRow}>
          <h3 className={styles.titleSm}>최근 댓글 달린 글</h3>
          <span className={styles.pageIndicator}>{currentPage + 1} / {totalPages}</span>
        </div>
        <ul className={styles.recentPostList}>
          {pagePosts.map((post) => (
            <li key={post.postId} className={styles.recentPostItem}>
              <Link href={`/post/${post.postId}`} className={styles.recentPostLink}>
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage === 0}
          >
            이전
          </button>
          <button
            className={styles.pageBtn}
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === totalPages - 1}
          >
            다음
          </button>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.footerLinks}>
          <a href="#" className={styles.footerLink}>이용약관</a>
          <a href="#" className={styles.footerLink}>개인정보처리방침</a>
          <a href="#" className={styles.footerLink}>커뮤니티 가이드라인</a>
          <a href="#" className={styles.footerLink}>문의하기</a>
        </div>
        <p>© 2024 Cluverse Inc.</p>
      </div>
    </aside>
  );
}
