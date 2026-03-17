'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Bookmark, Heart, MessageCircle, Share2 } from 'lucide-react';
import { AuthRequiredOverlay } from '@/components/ui/AuthRequiredOverlay';
import { ApiError, Comment, cluverseApi, FeedPost, formatRelativeTime } from '@/lib/cluverse-api';
import styles from './PostDetail.module.css';

export default function PostDetailPage() {
  const params = useParams<{ id: string }>();
  const postId = Number(params.id);
  const [post, setPost] = useState<FeedPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [authRequired, setAuthRequired] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingLike, setPendingLike] = useState(false);
  const [pendingBookmark, setPendingBookmark] = useState(false);

  const safeComments = useMemo(() => comments.slice(0, 3), [comments]);

  useEffect(() => {
    if (!Number.isFinite(postId)) {
      setError('잘못된 게시글 ID입니다.');
      return;
    }

    Promise.all([
      cluverseApi.getPost(postId),
      cluverseApi.getComments({ postId, offset: 0, limit: 3 }),
    ])
      .then(([postResult, commentResult]) => {
        setPost(postResult);
        setComments(commentResult.comments);
        setAuthRequired(false);
        setError(null);
      })
      .catch(caught => {
        setPost(null);
        setComments([]);
        if (caught instanceof ApiError && caught.statusCode === 401) {
          setAuthRequired(true);
          setError(null);
          return;
        }
        setError(caught instanceof Error ? caught.message : '게시글을 불러오지 못했습니다.');
      });
  }, [postId]);

  const handleLike = async () => {
    if (!post || pendingLike) {
      return;
    }

    setPendingLike(true);
    try {
      if (post.liked) {
        await cluverseApi.unlikePost(post.postId);
        setPost(current => current ? { ...current, liked: false, likeCount: Math.max(0, current.likeCount - 1) } : current);
      } else {
        await cluverseApi.likePost(post.postId);
        setPost(current => current ? { ...current, liked: true, likeCount: current.likeCount + 1 } : current);
      }
    } finally {
      setPendingLike(false);
    }
  };

  const handleBookmark = async () => {
    if (!post || pendingBookmark) {
      return;
    }

    setPendingBookmark(true);
    try {
      if (post.bookmarked) {
        await cluverseApi.unbookmarkPost(post.postId);
        setPost(current => current ? { ...current, bookmarked: false, bookmarkCount: Math.max(0, current.bookmarkCount - 1) } : current);
      } else {
        await cluverseApi.bookmarkPost(post.postId);
        setPost(current => current ? { ...current, bookmarked: true, bookmarkCount: current.bookmarkCount + 1 } : current);
      }
    } finally {
      setPendingBookmark(false);
    }
  };

  return (
    <AuthRequiredOverlay active={authRequired}>
      <div className={styles.container}>
        {post ? (
          <>
            <nav className={styles.breadcrumb}>
              <Link href="/" className={styles.breadcrumbLink}>홈</Link>
              <span className={styles.breadcrumbCurrent}>{post.board.name}</span>
            </nav>

            <article className={styles.article}>
              <div className={styles.articleHeader}>
                <div className={styles.authorArea}>
                  <div className={styles.authorAvatar}>
                    {post.author.profileImageUrl ? (
                      <img className={styles.avatarImg} src={post.author.profileImageUrl} alt={post.author.nickname} />
                    ) : (
                      <div className={styles.avatarImg} />
                    )}
                    <div className={styles.schoolBadge}>{post.board.name.slice(0, 3)}</div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={styles.authorName}>{post.isAnonymous ? '익명' : post.author.nickname}</span>
                      <span className={styles.authorDept}>{post.category}</span>
                    </div>
                    <div className={styles.authorMeta}>
                      <span>{formatRelativeTime(post.createdAt)}</span>
                      <span style={{ color: '#D1D5DB' }}>•</span>
                      <span>조회 {post.viewCount}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.articleBody}>
                <div className={styles.tags}>
                  <span className={styles.tagGeneral}>{post.board.name}</span>
                  <span className={styles.tagGeneral}>{post.category}</span>
                </div>

                <h1 className={styles.postTitle}>{post.title}</h1>
                <p className={styles.postContent}>{post.content || post.contentPreview}</p>

                {post.imageUrls?.length ? (
                  <div className={styles.imageGrid}>
                    {post.imageUrls.map(imageUrl => (
                      <div key={imageUrl} className={styles.gridImg}>
                        <img src={imageUrl} alt="" />
                      </div>
                    ))}
                  </div>
                ) : null}

                {!!post.tags.length && (
                  <div className={styles.hashTags}>
                    {post.tags.map(tag => (
                      <span key={tag} className={styles.hashTag}>#{tag}</span>
                    ))}
                  </div>
                )}

                <div className={styles.actionBar}>
                  <div className={styles.actionBtns}>
                    <button className={`${styles.actionBtn} ${styles.likeBtn}`} onClick={handleLike} type="button">
                      <Heart size={22} fill={post.liked ? 'currentColor' : 'none'} /> {post.likeCount}
                    </button>
                    <Link href={`/post/${post.postId}/comments`} className={`${styles.actionBtn} ${styles.commentBtn}`}>
                      <MessageCircle size={22} /> {post.commentCount}
                    </Link>
                    <button className={`${styles.actionBtn} ${styles.bookmarkBtn}`} onClick={handleBookmark} type="button">
                      <Bookmark size={22} fill={post.bookmarked ? 'currentColor' : 'none'} /> {post.bookmarkCount}
                    </button>
                  </div>
                  <button className={styles.shareBtn} type="button">
                    <Share2 size={18} /> 공유
                  </button>
                </div>
              </div>
            </article>

            <section className={styles.commentsSection}>
              <div className={styles.commentsHeader}>
                <h3 className={styles.commentsTitle}>
                  댓글 <span className={styles.commentCount}>{post.commentCount}</span>
                </h3>
                <Link href={`/post/${post.postId}/comments`} className={styles.sortOptionActive}>전체 보기</Link>
              </div>

              <div className={styles.commentsList}>
                {safeComments.map(comment => (
                  <div key={comment.commentId} className={styles.commentGroup}>
                    <div className={styles.comment}>
                      <div className={styles.commentAvatar}>
                        {comment.author.profileImageUrl ? (
                          <img className={styles.commentAvatarImg} src={comment.author.profileImageUrl} alt={comment.author.nickname} />
                        ) : (
                          <div className={styles.commentAvatarImg} />
                        )}
                      </div>
                      <div className={styles.commentBody}>
                        <div className={styles.commentMeta}>
                          <div className={styles.commentMetaLeft}>
                            <span className={styles.commentAuthorName}>{comment.isAnonymous ? '익명' : comment.author.nickname}</span>
                            <span className={styles.commentTime}>{formatRelativeTime(comment.createdAt)}</span>
                          </div>
                        </div>
                        <div className={styles.commentBubble}>
                          <p className={styles.commentText}>{comment.content}</p>
                          <div className={styles.commentActions}>
                            <span className={styles.commentAction}><Heart size={14} /> {comment.likeCount}</span>
                            <span className={styles.commentAction}><MessageCircle size={14} /> 답글 {comment.replyCount}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {!safeComments.length ? <div className={styles.commentGroup}>첫 댓글을 남겨보세요.</div> : null}
              </div>
            </section>
          </>
        ) : null}

        {error ? <div className={styles.commentsSection}>{error}</div> : null}
      </div>
    </AuthRequiredOverlay>
  );
}
