'use client';

import React, { useState } from 'react';
import styles from './Following.module.css';
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  UserCog,
  MessageSquare,
  GraduationCap,
  Globe,
  Loader2,
} from 'lucide-react';

/* ── Mock Data ─────────────────────────── */
const followingPosts = [
  {
    id: 1,
    type: 'image',
    author: '이영희',
    school: '고려대학교',
    schoolShort: '고려대',
    schoolColor: '#8B0000',
    schoolTagBg: 'rgba(139,0,0,0.08)',
    schoolTagColor: '#8B0000',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmIgB3lN2ejdDg_qT9n573HU6ZRHVCpPWA9QQb8X7dOmxDNYvUxnxnYdBZgBhvR9DNjbdfacZkAVaZHvP5Q74K2mFzXBsacV0DrVB6hK8q8nQdH_zLlvtXBwYExbL9X-xLAOaDAET0x5c6Gy3OS-4pSDKKMCxq9-NHgCBCKe166dp8aZsVtRYO7gZxlMRxa3uIxembyLXflqaZLX23X_KcdZJntBorPwH2XzjuYqPsA09v7GP86NccW6ugsR415oGuMIfjCk_T9AO0',
    time: '30분 전',
    visibility: '전체 공개',
    body: '중간고사 기간이라 도서관 자리 잡기 너무 힘드네요 ㅠㅠ 다들 열공하세요!',
    tags: '#중간고사 #도서관 #열공',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXhG9OyV0GMdihynwNwpfM03fdxeQwWs_5odGsRj8hJ1gbN5LFAYzN-62iaIPPD1rEec6CeP0tXFMQWWhbcKDSAp0RLgqVHTZSQTrX_YptR0ZY9dPJV4NzhcTse6uZWcMwQzsrYVf7-vwDHhf00cJ0CE0vHtDPJYAYtsiKb5lAtbRn0TdQMI543a451CqbH2DhneW5LrkVOKg4jpJK6clSthdhltGHGTQoe2_zHwxO2tWQe1Hd2P6mE60aDPRZ_c9kulXYO1fyafJI',
    likes: 124,
    comments: 18,
  },
  {
    id: 2,
    type: 'comment_activity',
    commenter: '박지성',
    commenterSchool: '연세대학교',
    commenterAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4QRNbxtnpl9_A56LZkkiJWAaYdjOdEw-CxqWGx1bxaLOgZz9dCOj0IjUMbH5UvL1axViJCOk4aZTEgRstZbjJa4aPI582LDoXLKGN-DSDOPg0s7qvUhuwZ_R0iVI02GaJQYQ5dkH7euWmXQ_FlKp7HFcNHHbdZGSuraNIZizSZOstIg1Tp7t5EkugNSsRwVAPDvVR7262hwcYGvOtodjSWgrDjcvRedCbZGhbi1qRkzl8GWHo3ws28RKOAYqOaaQ4uNcoSJ5qGbhL',
    schoolColor: '#1a237e',
    time: '2시간 전',
    commentText: '저도 참가하고 싶습니다! 백엔드 개발 경험 있습니다. DM 드릴게요.',
    originalAuthor: '김철수 (서울대학교)',
    originalText: '이번 주말에 있을 연합 해커톤 같이 나갈 팀원 구합니다! 프론트엔드...',
  },
  {
    id: 3,
    type: 'text',
    author: '최현우',
    school: '이화여자대학교',
    schoolShort: '이화여대',
    schoolColor: '#15803d',
    schoolTagBg: 'rgba(21,128,61,0.08)',
    schoolTagColor: '#15803d',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANdWQ6d9r-N5rfuEA_RDPNcSmSszz7Q-1xxesrHvrO4GdrtyN9pksBZi_s0MOFhSBDJab_C8GSjabUG-tZzA13J55vv9N0sHTjSrcSjf7ljksNjZY7rmOEqSvWUpIv3PbBC0FLpxg3CB4G_Z2eHPD2veEpomMYZ7OIQ67VKSFEY_PvnU4B8m-DnAulHet0Jc_26j0v3vhnAxkIbBvanEAr_nyCavPatiaxO4tgtvPighOhdlFsTbTs68eQD0ZtdMXTMhj-9xO9NwNB',
    time: '5시간 전',
    body: '졸업작품 전시회 드디어 끝났습니다! 와주신 분들 모두 감사해요',
    likes: 256,
    comments: 42,
  },
];

/* ── Component ─────────────────────────── */
export default function FollowingFeedPage() {
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { key: 'all', label: '전체 활동' },
    { key: 'posts', label: '새 게시글' },
    { key: 'comments', label: '댓글 활동' },
    { key: 'likes', label: '좋아요한 글' },
  ];

  return (
    <>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.titleBlock}>
          <h1 className={styles.pageTitle}>팔로잉 피드</h1>
          <p className={styles.pageDesc}>내가 팔로우한 친구들의 최신 소식을 확인하세요.</p>
        </div>
        <button className={styles.manageBtn}>
          <UserCog size={18} />
          <span>팔로우 관리</span>
        </button>
      </div>

      {/* Filter Chips */}
      <div className={styles.filters}>
        {filters.map(f => (
          <button
            key={f.key}
            className={`${styles.filterBtn} ${activeFilter === f.key ? styles.filterBtnActive : ''}`}
            onClick={() => setActiveFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Feed */}
      <div className={styles.feed}>
        {followingPosts.map(post => {
          if (post.type === 'image') return <ImagePost key={post.id} post={post} />;
          if (post.type === 'comment_activity') return <CommentActivityPost key={post.id} post={post} />;
          return <TextPost key={post.id} post={post} />;
        })}
      </div>

      {/* Loader */}
      <div className={styles.loader}>
        <div className={styles.spinner} />
      </div>
    </>
  );
}

/* ── Image Post ────────────────────────── */
function ImagePost({ post }: { post: typeof followingPosts[0] }) {
  return (
    <article className={styles.card}>
      <div className={styles.authorRow}>
        <div className={styles.author}>
          <div className={styles.avatarWrap}>
            <img className={styles.avatar} src={post.avatar} alt={post.author!} />
            <div className={styles.schoolBadge} style={{ background: post.schoolColor }}>
              <GraduationCap size={11} strokeWidth={2.5} />
            </div>
          </div>
          <div className={styles.authorInfo}>
            <div className={styles.authorName}>
              <h3>{post.author}</h3>
              <span
                className={styles.schoolTag}
                style={{ background: post.schoolTagBg, color: post.schoolTagColor }}
              >
                {post.schoolShort}
              </span>
            </div>
            <div className={styles.authorMeta}>
              <span>{post.time}</span>
              <span>·</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                <Globe size={11} /> {post.visibility}
              </span>
            </div>
          </div>
        </div>
        <button className={styles.moreBtn}>
          <MoreHorizontal size={20} />
        </button>
      </div>

      <div className={styles.bodyText}>
        <p>
          {post.body} <span className={styles.tags}>{post.tags}</span>
        </p>
      </div>

      {post.image && <img className={styles.bodyImage} src={post.image} alt="" />}

      <div className={styles.actionsBar}>
        <div className={styles.actionsLeft}>
          <button className={styles.actionBtn}>
            <Heart size={20} /> <span>{post.likes}</span>
          </button>
          <button className={styles.actionBtn}>
            <MessageCircle size={20} /> <span>{post.comments}</span>
          </button>
        </div>
        <button className={styles.shareBtn}>
          <Share2 size={20} />
        </button>
      </div>
    </article>
  );
}

/* ── Comment Activity Post ─────────────── */
function CommentActivityPost({ post }: { post: typeof followingPosts[1] }) {
  return (
    <article className={styles.card}>
      <div className={styles.activityLabel}>
        <MessageSquare size={14} />
        <span>{post.commenter}님이 댓글을 남겼습니다</span>
      </div>

      <div className={styles.commentBody}>
        <div className={styles.avatarWrap} style={{ alignSelf: 'flex-start' }}>
          <img className={styles.commentAvatar} src={post.commenterAvatar} alt={post.commenter!} />
          <div className={styles.schoolBadge} style={{ background: post.schoolColor, width: 16, height: 16 }}>
            <GraduationCap size={9} strokeWidth={2.5} />
          </div>
        </div>

        <div className={styles.commentBubble}>
          <div className={styles.bubble}>
            <div className={styles.bubbleHeader}>
              <h4>{post.commenter}</h4>
              <span>{post.time}</span>
            </div>
            <p className={styles.bubbleText}>{post.commentText}</p>
          </div>

          <div className={styles.originalContext}>
            <p className={styles.originalLabel}>원문: {post.originalAuthor}</p>
            <p className={styles.originalText}>{post.originalText}</p>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ── Text Post ─────────────────────────── */
function TextPost({ post }: { post: typeof followingPosts[2] }) {
  return (
    <article className={styles.card}>
      <div className={styles.authorRow}>
        <div className={styles.author}>
          <div className={styles.avatarWrap}>
            <img className={styles.avatar} src={post.avatar} alt={post.author!} />
            <div className={styles.schoolBadge} style={{ background: post.schoolColor }}>
              <GraduationCap size={11} strokeWidth={2.5} />
            </div>
          </div>
          <div className={styles.authorInfo}>
            <div className={styles.authorName}>
              <h3>{post.author}</h3>
              <span
                className={styles.schoolTag}
                style={{ background: post.schoolTagBg, color: post.schoolTagColor }}
              >
                {post.schoolShort}
              </span>
            </div>
            <div className={styles.authorMeta}>
              <span>{post.time}</span>
            </div>
          </div>
        </div>
        <button className={styles.moreBtn}>
          <MoreHorizontal size={20} />
        </button>
      </div>

      <div className={styles.inlineBody}>
        <p className={styles.inlineText}>{post.body}</p>
        <div className={styles.inlineActions}>
          <button className={styles.actionBtn}>
            <Heart size={18} /> <span>{post.likes}</span>
          </button>
          <button className={styles.actionBtn}>
            <MessageCircle size={18} /> <span>{post.comments}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
