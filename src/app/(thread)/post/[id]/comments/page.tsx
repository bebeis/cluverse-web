'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronRight, Heart, MessageCircle } from 'lucide-react';
import { AuthRequiredOverlay } from '@/components/ui/AuthRequiredOverlay';
import { ApiError, Comment, FeedPost, cluverseApi, formatRelativeTime } from '@/lib/cluverse-api';
import styles from './CommentTree.module.css';

export default function CommentTreePage() {
  const params = useParams<{ id: string }>();
  const postId = Number(params.id);
  const invalidPostId = !Number.isFinite(postId);
  const [post, setPost] = useState<FeedPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [draft, setDraft] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [authRequired, setAuthRequired] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshComments = async () => {
    const commentResult = await cluverseApi.getComments({ postId, offset: 0, limit: 50 });
    setComments(commentResult.comments);
  };

  useEffect(() => {
    if (invalidPostId) {
      return;
    }

    let cancelled = false;

    const run = async () => {
      try {
        const [postResult, commentResult] = await Promise.all([
          cluverseApi.getPost(postId),
          cluverseApi.getComments({ postId, offset: 0, limit: 50 }),
        ]);
        if (cancelled) {
          return;
        }
        setPost(postResult);
        setComments(commentResult.comments);
        setError(null);
        setAuthRequired(false);
      } catch (caught) {
        if (cancelled) {
          return;
        }
        if (caught instanceof ApiError && caught.statusCode === 401) {
          setAuthRequired(true);
          return;
        }
        setError(caught instanceof Error ? caught.message : '댓글을 불러오지 못했습니다.');
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [invalidPostId, postId]);

  const topLevelComments = comments.filter(comment => comment.parentCommentId === null);
  const replyMap = new Map<number, Comment[]>();

  comments
    .filter(comment => comment.parentCommentId !== null)
    .forEach(comment => {
      const parentId = comment.parentCommentId as number;
      replyMap.set(parentId, [...(replyMap.get(parentId) || []), comment]);
    });

  const handleSubmit = async (parentCommentId: number | null = null) => {
    if (!draft.trim()) {
      return;
    }

    await cluverseApi.createComment(postId, {
      parentCommentId,
      content: draft.trim(),
      isAnonymous,
    });

    setDraft('');
    setIsAnonymous(false);
    await refreshComments();
  };

  const toggleCommentLike = async (comment: Comment) => {
    if (comment.likedByMe) {
      await cluverseApi.unlikeComment(comment.commentId);
    } else {
      await cluverseApi.likeComment(comment.commentId);
    }
    await refreshComments();
  };

  return (
    <AuthRequiredOverlay active={authRequired}>
      <div className={styles.page}>
        <div className={styles.postHeader}>
          <div className={styles.breadcrumb}>
            <span className={styles.breadcrumbTag}>{post?.board?.name ?? '게시판'}</span>
            <span className={styles.breadcrumbPath}>
              <Link href={`/post/${postId}`}>{post?.title ?? '게시글'}</Link>
              <ChevronRight size={14} />
              댓글
            </span>
          </div>
          <h1 className={styles.postTitle}>{post?.title ?? '댓글'}</h1>
          <p className={styles.postDesc}>{post?.contentPreview || post?.content}</p>
        </div>

        <div className={styles.commentsCard}>
          <div className={styles.commentsHeader}>
            <div className={styles.commentCount}>
              댓글 <span>{comments.length}</span>
            </div>
          </div>

          <div className={styles.commentInput}>
            <div className={styles.inputBody}>
              <textarea
                className={styles.inputTextarea}
                placeholder="댓글을 입력하세요..."
                value={draft}
                onChange={event => setDraft(event.target.value)}
              />
              <div className={styles.inputActions}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="checkbox" checked={isAnonymous} onChange={event => setIsAnonymous(event.target.checked)} />
                  익명
                </label>
                <button className={styles.submitBtn} onClick={() => handleSubmit()} type="button">댓글 작성</button>
              </div>
            </div>
          </div>

          <div className={styles.threadList}>
            {topLevelComments.map(comment => (
              <div key={comment.commentId} className={styles.commentThread}>
                <CommentBlock comment={comment} onToggleLike={toggleCommentLike} />
                {(replyMap.get(comment.commentId) || []).map(reply => (
                  <div key={reply.commentId} className={styles.replies}>
                    <div className={styles.replyConnector} />
                    <CommentBlock comment={reply} compact onToggleLike={toggleCommentLike} />
                  </div>
                ))}
              </div>
            ))}
            {!topLevelComments.length && !error ? <div className={styles.commentThread}>아직 댓글이 없습니다.</div> : null}
            {error || invalidPostId ? <div className={styles.commentThread}>{error || '잘못된 게시글 ID입니다.'}</div> : null}
          </div>
        </div>
      </div>
    </AuthRequiredOverlay>
  );
}

function CommentBlock({
  comment,
  compact = false,
  onToggleLike,
}: {
  comment: Comment;
  compact?: boolean;
  onToggleLike: (comment: Comment) => Promise<void>;
}) {
  return (
    <div className={styles.comment}>
      <div className={styles.avatarCol}>
        {comment.author.profileImageUrl ? (
          <img className={`${styles.commentAvatar} ${compact ? styles.avatarSm : ''}`} src={comment.author.profileImageUrl} alt={comment.author.nickname} />
        ) : (
          <div className={`${styles.commentAvatar} ${compact ? styles.avatarSm : ''}`} />
        )}
      </div>
      <div className={styles.commentBody}>
        <div className={styles.commentMeta}>
          <div className={styles.commentMetaLeft}>
            <span className={styles.authorLabel}>{comment.isAnonymous ? '익명' : comment.author.nickname}</span>
            <span className={styles.timeLabel}>• {formatRelativeTime(comment.createdAt)}</span>
          </div>
        </div>
        <p className={styles.commentText}>{comment.content}</p>
        <div className={styles.commentActions}>
          <button className={styles.actionItem} onClick={() => onToggleLike(comment)} type="button">
            <Heart size={16} /> <span>{comment.likeCount}</span>
          </button>
          <span className={styles.actionItem}>
            <MessageCircle size={16} /> <span>답글 {comment.replyCount}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
