import React from 'react';
import styles from './Bookmarks.module.css';
import { PostCard } from '@/components/ui/PostCard';
import { Bookmark } from 'lucide-react';

const mockBookmarks = [
  {
    id: 1,
    title: '프론트엔드 레포지토리 정리 모음',
    excerpt: '취업을 위해 참고하면 좋을만한 오픈소스 레포들을 정리해봤습니다...',
    authorNickname: '개발자A',
    schoolName: '서울대학교',
    timeAgo: '2일 전',
    views: 120,
    likes: 85,
    comments: 12,
    category: '정보',
    isAnonymous: false,
  },
  {
    id: 2,
    title: '학교 앞 혼밥하기 좋은 식당 리스트 (24년도 최신)',
    excerpt: '신입생 분들 참고하세요~ 제 기준 탑 5 식당 공유합니다.',
    authorNickname: '익명',
    schoolName: '고려대학교',
    timeAgo: '1주일 전',
    views: 400,
    likes: 215,
    comments: 50,
    category: '팁',
    isAnonymous: true,
  }
];

export default function BookmarksPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerIcon}>
          <Bookmark size={24} color="#3B82F6" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className={styles.title}>관심 게시글</h1>
          <p className={styles.subtitle}>내가 북마크한 게시물을 모아볼 수 있습니다.</p>
        </div>
      </header>

      <div className={styles.feedContainer}>
        {mockBookmarks.map(post => (
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
        {mockBookmarks.length === 0 && (
          <div className={styles.emptyState}>
            아직 북마크한 게시글이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
