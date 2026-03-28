'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Bookmark, Check, Heart, MessageCircle, Pencil, Send, Share2, X } from 'lucide-react';
import { Comment, cluverseApi, FeedPost, formatRelativeTime } from '@/lib/cluverse-api';
import { removeImgTags } from '@/lib/html-utils';
import styles from './PostModal.module.css';
import inlineStyles from './PostInlineView.module.css';

interface PostInlineViewProps {
  postId: number;
  onBack: () => void;
}

export function PostInlineView({ postId, onBack }: PostInlineViewProps) {
  const [post, setPost] = useState<FeedPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [pendingLike, setPendingLike] = useState(false);
  const [pendingBookmark, setPendingBookmark] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentMemberId, setCurrentMemberId] = useState<number | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    cluverseApi.getMyProfile()
      .then(p => setCurrentMemberId(p.memberId))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setPost(null);
    setComments([]);
    Promise.all([
      cluverseApi.getPost(postId),
      cluverseApi.getComments({ postId, offset: 0, limit: 50 }),
    ])
      .then(([postResult, commentResult]) => {
        setPost(postResult);
        setComments(commentResult.comments);
      })
      .catch(() => {});
  }, [postId]);

  const handleLike = async () => {
    if (!post || pendingLike) return;
    setPendingLike(true);
    try {
      if (post.liked) {
        await cluverseApi.unlikePost(post.postId);
        setPost(p => p ? { ...p, liked: false, likeCount: Math.max(0, p.likeCount - 1) } : p);
      } else {
        await cluverseApi.likePost(post.postId);
        setPost(p => p ? { ...p, liked: true, likeCount: p.likeCount + 1 } : p);
      }
    } finally {
      setPendingLike(false);
    }
  };

  const handleBookmark = async () => {
    if (!post || pendingBookmark) return;
    setPendingBookmark(true);
    try {
      if (post.bookmarked) {
        await cluverseApi.unbookmarkPost(post.postId);
        setPost(p => p ? { ...p, bookmarked: false, bookmarkCount: Math.max(0, p.bookmarkCount - 1) } : p);
      } else {
        await cluverseApi.bookmarkPost(post.postId);
        setPost(p => p ? { ...p, bookmarked: true, bookmarkCount: p.bookmarkCount + 1 } : p);
      }
    } finally {
      setPendingBookmark(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!post || !commentText.trim() || submitting) return;
    setSubmitting(true);
    try {
      const newComment = await cluverseApi.createComment(post.postId, {
        parentCommentId: null,
        content: commentText.trim(),
        isAnonymous: false,
      });
      setComments(prev => [...prev, newComment]);
      setPost(p => p ? { ...p, commentCount: p.commentCount + 1 } : p);
      setCommentText('');
    } catch {
      // silently fail
    } finally {
      setSubmitting(false);
    }
  };

  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmitComment();
    }
  };

  const startEditComment = (comment: { commentId: number; content: string }) => {
    setEditingCommentId(comment.commentId);
    setEditingContent(comment.content);
  };

  const saveEditComment = async (commentId: number) => {
    if (!editingContent.trim() || savingEdit) return;
    setSavingEdit(true);
    try {
      const updated = await cluverseApi.updateComment(commentId, editingContent.trim());
      setComments(prev => prev.map(c => c.commentId === commentId ? { ...c, content: updated.content } : c));
      setEditingCommentId(null);
    } catch {
      // silently fail
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <div className={inlineStyles.container}>
      {/* Back bar */}
      <div className={inlineStyles.backBar}>
        <button className={inlineStyles.backBtn} onClick={onBack} type="button">
          <ArrowLeft size={15} />
          목록으로
        </button>
        {post && <span className={inlineStyles.boardName}>{post.board?.name}</span>}
      </div>

      {!post ? (
        <div className={styles.loading}>불러오는 중...</div>
      ) : (
        <>
          {/* Article */}
          <div className={styles.article}>
            <div className={styles.articleHeader}>
              <div className={styles.authorAvatar}>
                {post.author.profileImageUrl ? (
                  <img className={styles.avatarImg} src={post.author.profileImageUrl} alt={post.author.nickname} />
                ) : (
                  <div className={styles.avatarImg} />
                )}
                {post.board?.name && (
                  <div className={styles.schoolBadge}>{post.board.name.slice(0, 3)}</div>
                )}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className={styles.authorName}>{post.isAnonymous ? '익명' : post.author.nickname}</span>
                  <span className={styles.authorDept}>{post.category}</span>
                </div>
                <div className={styles.authorMeta}>
                  <span>{formatRelativeTime(post.createdAt)}</span>
                  <span>·</span>
                  <span>조회 {post.viewCount}</span>
                </div>
              </div>
            </div>

            <div className={styles.articleBody}>
              <div className={styles.tags}>
                {post.board?.name && <span className={styles.tag}>{post.board.name}</span>}
                <span className={styles.tag}>{post.category}</span>
              </div>
              <h2 className={styles.postTitle}>{post.title}</h2>
              {(() => {
                const content = post.content || post.contentPreview || '';
                const isHtml = content.includes('<');
                if (isHtml) {
                  return (
                    <div
                      className={`${styles.postContent} ${styles.postContentHtmlPreview}`}
                      dangerouslySetInnerHTML={{ __html: removeImgTags(content) }}
                    />
                  );
                }
                return <p className={styles.postContent}>{content}</p>;
              })()}

              {post.imageUrls?.length ? (
                <div className={styles.imageGrid}>
                  {post.imageUrls.map(url => (
                    <div key={url} className={styles.gridImg}>
                      <img src={url} alt="" />
                    </div>
                  ))}
                </div>
              ) : null}

              {post.tags?.length ? (
                <div className={styles.hashTags}>
                  {post.tags.map(tag => (
                    <span key={tag} className={styles.hashTag}>#{tag}</span>
                  ))}
                </div>
              ) : null}

              <div className={styles.actionBar}>
                <div className={styles.actionBtns}>
                  <button
                    className={`${styles.actionBtn} ${styles.likeBtn} ${post.liked ? styles.liked : ''}`}
                    onClick={handleLike}
                    type="button"
                  >
                    <Heart size={20} fill={post.liked ? 'currentColor' : 'none'} />
                    {post.likeCount}
                  </button>
                  <button
                    className={`${styles.actionBtn} ${styles.commentBtn}`}
                    type="button"
                    onClick={() => textareaRef.current?.focus()}
                  >
                    <MessageCircle size={20} />
                    {post.commentCount}
                  </button>
                  <button
                    className={`${styles.actionBtn} ${styles.bookmarkBtn} ${post.bookmarked ? styles.bookmarked : ''}`}
                    onClick={handleBookmark}
                    type="button"
                  >
                    <Bookmark size={20} fill={post.bookmarked ? 'currentColor' : 'none'} />
                    {post.bookmarkCount}
                  </button>
                </div>
                <button className={styles.shareBtn} type="button">
                  <Share2 size={16} /> 공유
                </button>
              </div>
            </div>
          </div>

          {/* Comments */}
          <div className={styles.commentsSection}>
            <div className={styles.commentsHeader}>
              댓글<span>{post.commentCount}</span>
            </div>
            <div className={styles.commentsList}>
              {comments.length === 0 ? (
                <div className={styles.noComments}>첫 댓글을 남겨보세요.</div>
              ) : comments.map(comment => (
                <div key={comment.commentId} className={styles.commentItem}>
                  <div className={styles.commentAvatar}>
                    {comment.author.profileImageUrl && (
                      <img src={comment.author.profileImageUrl} alt={comment.author.nickname} />
                    )}
                  </div>
                  <div className={styles.commentBody}>
                    <div className={styles.commentMeta}>
                      <span className={styles.commentAuthor}>{comment.isAnonymous ? '익명' : comment.author.nickname}</span>
                      <span className={styles.commentTime}>{formatRelativeTime(comment.createdAt)}</span>
                      {currentMemberId && comment.author.memberId === currentMemberId && editingCommentId !== comment.commentId && (
                        <button className={styles.editCommentBtn} onClick={() => startEditComment(comment)} type="button">
                          <Pencil size={12} />
                        </button>
                      )}
                    </div>
                    {editingCommentId === comment.commentId ? (
                      <div className={styles.commentEditRow}>
                        <input
                          className={styles.commentEditInput}
                          value={editingContent}
                          onChange={e => setEditingContent(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') saveEditComment(comment.commentId); if (e.key === 'Escape') setEditingCommentId(null); }}
                          autoFocus
                        />
                        <button className={styles.commentEditSaveBtn} onClick={() => saveEditComment(comment.commentId)} disabled={savingEdit} type="button">
                          <Check size={12} />
                        </button>
                        <button className={styles.commentEditCancelBtn} onClick={() => setEditingCommentId(null)} type="button">
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <p className={styles.commentText}>{comment.content}</p>
                    )}
                    <div className={styles.commentLikes}>
                      <Heart size={12} />
                      <span>{comment.likeCount}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comment input */}
          <div className={inlineStyles.commentInput}>
            <textarea
              ref={textareaRef}
              className={styles.commentTextarea}
              placeholder="댓글을 입력하세요... (Ctrl+Enter로 등록)"
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              onKeyDown={handleTextareaKeyDown}
              rows={1}
            />
            <button
              className={styles.commentSubmitBtn}
              onClick={handleSubmitComment}
              disabled={!commentText.trim() || submitting}
              aria-label="댓글 등록"
            >
              <Send size={16} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
