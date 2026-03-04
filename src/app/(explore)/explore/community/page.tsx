'use client';

import React, { useState } from 'react';
import styles from './CommunityExplore.module.css';
import {
  ChevronUp,
  ChevronDown,
  ChevronRight,
  MessageCircle,
  Bookmark,
  Share2,
  Filter,
  Rss,
  X,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Heart,
  Send,
  MoreHorizontal,
} from 'lucide-react';

/* ── Post Mock Data ──────────────────── */
const posts = [
  {
    id: 1,
    author: '개발새발123',
    time: '15분 전',
    tag: '자유',
    title: '오늘부터 매일 TIL(Today I Learned) 쓰기 시작합니다',
    preview: '보통 개발 공부하시는 분들 TIL 어디에 작성하시나요? 블로그를 따로 만들어야 하는지, 노션이 좋은지 고민입니다. 요즘 깃헙 잔디 채우기 겸 TIL 레포 만들어서 쓰려고 하는데...',
    votes: 23,
    comments: 8,
    bookmarks: 4,
  },
  {
    id: 2,
    author: '대학원가지마',
    time: '1시간 전',
    tag: '정보',
    title: '2024 하반기 IT기업 신입 공채 일정 정리 (네카라쿠배당토)',
    preview: '이번 하반기 공채 일정이 대부분 떴습니다. 주요 기업들 일정 정리해서 공유합니다. 자소서 항목도 작년이랑 크게 달라지지 않은 것 같네요.',
    votes: 342,
    comments: 56,
    bookmarks: 128,
  },
  {
    id: 3,
    author: '익명',
    time: '3시간 전',
    tag: '질문',
    title: '리액트 vs Vue.js 취업 시장에서 어떤 게 더 유리할까요?',
    preview: '프론트엔드 개발자로 취업 준비 중인데, 리액트와 Vue.js 중 어떤 것을 먼저 깊게 배울지 고민입니다.',
    votes: 45,
    comments: 33,
    bookmarks: 12,
  },
  {
    id: 4,
    author: '코딩마스터',
    time: '5시간 전',
    tag: '후기',
    title: '삼성 SSAFY 10기 수료 후기 (비전공자 관점)',
    preview: '비전공자로 SSAFY에 합격해서 1년간 교육을 받은 후기를 작성해봅니다. 결론부터 말하면, 정말 많이 성장했습니다.',
    votes: 156,
    comments: 42,
    bookmarks: 68,
  },
  {
    id: 5,
    author: '컴공19학번',
    time: '1일 전',
    tag: '자유',
    title: '대학생 사이드 프로젝트 팀원 모집합니다 (웹 서비스)',
    preview: '교내 해커톤에 나갈 팀원을 구하고 있습니다. 프론트/백엔드 각 1명씩 구합니다.',
    votes: 12,
    comments: 5,
    bookmarks: 2,
  },
];

const tagColors: Record<string, { bg: string; color: string }> = {
  '자유': { bg: '#DCFCE7', color: '#15803D' },
  '정보': { bg: '#DBEAFE', color: '#1D4ED8' },
  '질문': { bg: '#FCE7F3', color: '#BE185D' },
  '후기': { bg: '#FEF9C3', color: '#A16207' },
};

/* ── Component ─────────────────────────── */
export default function CommunityExplorePage() {
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const post = posts.find(p => p.id === selectedPost);

  return (
    <div className={styles.page}>
      {/* Breadcrumbs */}
      <nav className={styles.breadcrumbs}>
        <a href="/explore">탐색</a>
        <ChevronRight size={14} />
        <span className={styles.breadcrumbActive}>커뮤니티</span>
      </nav>

      {/* Title Section */}
      <div className={styles.titleSection}>
        <div className={styles.titleWrap}>
          <h1>커뮤니티 게시판</h1>
          <p>자유롭게 의견을 나누고, 정보를 공유하고, 질문하세요.</p>
        </div>
        <div className={styles.titleActions}>
          <button className={styles.filterBtn}>
            <Filter size={16} />
            필터
          </button>
          <button className={styles.followingBtn}>
            <Rss size={16} />
            팔로잉
          </button>
        </div>
      </div>

      {/* Post List */}
      <div className={styles.postList}>
        {posts.map(p => {
          const tc = tagColors[p.tag] || { bg: '#F3F4F6', color: '#4B5563' };
          return (
            <article
              key={p.id}
              className={styles.postCard}
              onClick={() => setSelectedPost(p.id)}
            >
              {/* Vote Col */}
              <div className={styles.voteCol}>
                <button className={styles.voteBtn}><ChevronUp size={20} /></button>
                <span className={styles.voteCount}>{p.votes}</span>
                <button className={`${styles.voteBtn} ${styles.voteBtnDown}`}><ChevronDown size={20} /></button>
              </div>
              {/* Content */}
              <div className={styles.postContent}>
                <div className={styles.postMeta}>
                  <div className={styles.postAvatar} style={{ background: tc.bg }} />
                  <span className={styles.postAuthor}>{p.author}</span>
                  <span className={styles.postTime}>{p.time}</span>
                  <span className={styles.postTag} style={{ background: tc.bg, color: tc.color }}>{p.tag}</span>
                </div>
                <h3 className={styles.postTitle}>{p.title}</h3>
                <p className={styles.postPreview}>{p.preview}</p>
                <div className={styles.postActions}>
                  <button className={styles.actionBtn}>
                    <MessageCircle size={14} />
                    {p.comments}개 댓글
                  </button>
                  <button className={styles.actionBtn}>
                    <Bookmark size={14} />
                    {p.bookmarks}
                  </button>
                  <button className={styles.actionBtn}>
                    <Share2 size={14} />
                    공유
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Modal Overlay */}
      {selectedPost !== null && post && (
        <div className={styles.overlay} onClick={() => setSelectedPost(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className={styles.modalHeader}>
              <div className={styles.modalHeaderLeft}>
                <button className={styles.modalCloseBtn} onClick={() => setSelectedPost(null)}>
                  <X size={20} />
                </button>
                <span className={styles.modalLabel}>{post.tag} 게시판</span>
              </div>
              <div className={styles.modalActions}>
                <button className={styles.modalIconBtn}><Bookmark size={18} /></button>
                <button className={styles.modalIconBtn}><Share2 size={18} /></button>
                <button className={styles.modalIconBtn}><MoreHorizontal size={18} /></button>
              </div>
            </div>

            {/* Modal Content */}
            <div className={styles.modalContent}>
              {/* Author */}
              <div className={styles.detailAuthorRow}>
                <div className={styles.detailAuthorInfo}>
                  <div className={styles.detailAvatar} style={{ background: '#E0E7FF' }} />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className={styles.detailAuthorName}>{post.author}</span>
                      <span className={styles.detailAuthorBadge}>AUTHOR</span>
                    </div>
                    <div className={styles.detailAuthorSub}>서울대학교 · {post.time}</div>
                  </div>
                </div>
                <button className={styles.followBtn}>+ 팔로우</button>
              </div>

              {/* Title & Body */}
              <h2 className={styles.detailTitle}>{post.title}</h2>
              <div className={styles.detailBody}>
                <p>{post.preview}</p>
                <p>
                  안녕하세요, 혹시 비슷한 경험이 있으신 분들의 조언을 구합니다.
                  특히 실무에서 어떤 기술 스택이 가장 많이 사용되는지 궁금합니다.
                </p>
                <div className={styles.codeBlock}>
                  {'# 예시 코드\nprint("Hello, Cluverse!")\n# 이런 식으로 코드 블록도 지원합니다'}
                </div>
                <p>감사합니다. 좋은 하루 되세요!</p>
              </div>

              {/* Stats */}
              <div className={styles.detailStats}>
                <div className={styles.statLeft}>
                  <button className={styles.likeBtn}>
                    <ThumbsUp size={18} />
                    {post.votes}
                  </button>
                  <button className={styles.dislikeBtn}>
                    <ThumbsDown size={18} />
                  </button>
                </div>
                <div className={styles.statRight}>
                  <span className={styles.statItem}><Eye size={16} /> 1.2k</span>
                  <span className={styles.statItem}><MessageCircle size={16} /> {post.comments}</span>
                  <span className={styles.statItem}><Bookmark size={16} /> {post.bookmarks}</span>
                </div>
              </div>

              {/* Comments */}
              <div className={styles.commentSection}>
                <h3 className={styles.commentTitle}>댓글 {post.comments}개</h3>

                {/* Comment 1 */}
                <div className={styles.commentItem}>
                  <div className={styles.commentAvatar} style={{ background: '#FEF9C3' }} />
                  <div>
                    <div className={styles.commentHighlight}>
                      <div className={styles.commentHead}>
                        <span>
                          <span className={styles.commentAuthor}>김코딩</span>
                          <span className={styles.authorTag}>TOP</span>
                        </span>
                        <span className={styles.commentTime}>30분 전</span>
                      </div>
                      <p className={styles.commentText}>
                        정말 좋은 글이네요! 저도 비슷한 경험을 했었는데, 꾸준히 하는 게 가장 중요한 것 같습니다.
                      </p>
                    </div>
                    <div className={styles.commentActions}>
                      <button className={styles.commentActionActive}><Heart size={12} /> 24</button>
                      <button className={styles.commentActionBtn}>답글</button>
                    </div>
                  </div>
                </div>

                {/* Nested Reply */}
                <div className={styles.replyThread}>
                  <div className={styles.commentItem}>
                    <div className={styles.commentAvatar} style={{ background: '#E0E7FF' }} />
                    <div>
                      <div className={styles.commentBubble}>
                        <div className={styles.commentHead}>
                          <span className={styles.commentAuthor}>{post.author}</span>
                          <span className={styles.commentTime}>15분 전</span>
                        </div>
                        <p className={styles.commentText}>
                          감사합니다! 꾸준히 해보겠습니다 💪
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comment 2 */}
                <div className={styles.commentItem} style={{ marginTop: 16 }}>
                  <div className={styles.commentAvatar} style={{ background: '#DCFCE7' }} />
                  <div>
                    <div className={styles.commentBubble}>
                      <div className={styles.commentHead}>
                        <span className={styles.commentAuthor}>개발하는감자</span>
                        <span className={styles.commentTime}>1시간 전</span>
                      </div>
                      <p className={styles.commentText}>
                        저는 개인 블로그를 추천합니다. 나중에 포트폴리오로도 활용할 수 있거든요.
                      </p>
                    </div>
                    <div className={styles.commentActions}>
                      <button className={styles.commentActionBtn}><Heart size={12} /> 8</button>
                      <button className={styles.commentActionBtn}>답글</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Input */}
            <div className={styles.modalFooter}>
              <div className={styles.commentInput}>
                <div className={styles.commentInputAvatar} style={{ background: '#E0E7FF' }} />
                <div className={styles.inputWrapper}>
                  <input
                    className={styles.commentInputField}
                    placeholder="댓글을 입력하세요..."
                  />
                  <button className={styles.sendBtn}>
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
