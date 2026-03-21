'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { EyeOff, Send } from 'lucide-react';
import { AuthRequiredOverlay } from '@/components/ui/AuthRequiredOverlay';
import { ApiError, cluverseApi } from '@/lib/cluverse-api';
import styles from '../../create/CreatePost.module.css';

export default function EditPostPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const postId = Number(params.id);

  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [category, setCategory] = useState('GENERAL');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [isExternalVisible, setIsExternalVisible] = useState(true);
  const [authRequired, setAuthRequired] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const editorWrapperRef = useRef<HTMLDivElement>(null);
  const [imgOverlay, setImgOverlay] = useState<{ top: number; left: number; width: number; img: HTMLImageElement } | null>(null);

  useEffect(() => {
    if (!Number.isFinite(postId)) {
      setError('잘못된 게시글 ID입니다.');
      setLoading(false);
      return;
    }
    cluverseApi.getPost(postId)
      .then(post => {
        setTitle(post.title);
        setCategory(post.category);
        setIsAnonymous(post.isAnonymous);
        setIsPinned(post.isPinned);
        setIsExternalVisible(post.isExternalVisible);
        setTags(post.tags.join(', '));
        if (editorRef.current) {
          editorRef.current.innerHTML = post.content ?? '';
        }
        setLoading(false);
      })
      .catch(caught => {
        if (caught instanceof ApiError && caught.statusCode === 401) {
          setAuthRequired(true);
        } else {
          setError(caught instanceof Error ? caught.message : '게시글을 불러오지 못했습니다.');
        }
        setLoading(false);
      });
  }, [postId]);

  const handleEditorClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLImageElement && editorWrapperRef.current) {
      const wrapperRect = editorWrapperRef.current.getBoundingClientRect();
      const imgRect = e.target.getBoundingClientRect();
      setImgOverlay({
        top: imgRect.top - wrapperRect.top,
        left: imgRect.left - wrapperRect.left,
        width: imgRect.width,
        img: e.target,
      });
    } else {
      setImgOverlay(null);
    }
  };

  const handleDeleteImg = () => {
    if (imgOverlay) {
      imgOverlay.img.remove();
      setImgOverlay(null);
    }
  };

  const handleImagePaste = async (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = Array.from(e.clipboardData.items);
    const imageItem = items.find(item => item.type.startsWith('image/'));
    if (!imageItem) return;

    e.preventDefault();
    const blob = imageItem.getAsFile();
    if (!blob) return;

    setUploading(true);
    setError(null);
    try {
      const ext = blob.type.split('/')[1] || 'png';
      const { uploadUrl, imageUrl } = await cluverseApi.getPostImagePresignedUrl({
        originalFileName: `paste-${Date.now()}.${ext}`,
        contentType: blob.type,
      });
      await fetch(uploadUrl, {
        method: 'PUT',
        body: blob,
        headers: { 'Content-Type': blob.type },
      });
      const img = document.createElement('img');
      img.src = imageUrl;
      img.style.maxWidth = '100%';
      img.style.borderRadius = '8px';
      img.style.marginTop = '8px';
      img.style.marginBottom = '8px';
      img.style.display = 'block';
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(img);
        range.setStartAfter(img);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        editorRef.current?.appendChild(img);
      }
    } catch {
      setError('이미지 업로드에 실패했습니다.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    const editorContent = editorRef.current?.innerHTML ?? '';
    if (!title.trim() || !editorContent.trim()) {
      setError('제목과 내용을 입력하세요.');
      return;
    }

    const imageUrls = Array.from(editorRef.current?.querySelectorAll('img') ?? [])
      .map(img => img.src);

    setSubmitting(true);
    setError(null);
    try {
      await cluverseApi.updatePost(postId, {
        category,
        title: title.trim(),
        content: editorContent,
        tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
        isAnonymous,
        isPinned,
        isExternalVisible,
        imageUrls,
      });
      router.push(`/post/${postId}`);
    } catch (caught) {
      if (caught instanceof ApiError && caught.statusCode === 401) {
        setAuthRequired(true);
      } else {
        setError(caught instanceof Error ? caught.message : '게시글을 수정하지 못했습니다.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return null;

  return (
    <AuthRequiredOverlay active={authRequired}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>게시글 수정</h1>
      </div>

      <div className={styles.contentArea}>
        <div className={styles.formSection}>
          <div className={styles.formCard}>
            <div className={styles.formGroup}>
              <label className={styles.label}>카테고리</label>
              <select className={styles.select} value={category} onChange={e => setCategory(e.target.value)}>
                <option value="GENERAL">자유</option>
                <option value="QUESTION">질문</option>
                <option value="INFORMATION">정보</option>
                <option value="CAREER">진로</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <input
                type="text"
                className={styles.titleInput}
                placeholder="글 제목을 입력하세요"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>

            <div className={styles.editorWrapper} ref={editorWrapperRef} style={{ position: 'relative' }}>
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                className={styles.editorTextarea}
                data-placeholder="내용을 입력하세요..."
                onPaste={handleImagePaste}
                onClick={handleEditorClick}
              />
              {imgOverlay && (
                <button
                  type="button"
                  className={styles.imgDeleteBtn}
                  style={{ top: imgOverlay.top + 8, left: imgOverlay.left + imgOverlay.width - 36 }}
                  onClick={handleDeleteImg}
                >
                  ×
                </button>
              )}
              {uploading && <div className={styles.uploadingBanner}>이미지 업로드 중...</div>}
            </div>

            <div className={styles.formGroup} style={{ marginTop: 24 }}>
              <label className={styles.label}>태그</label>
              <input
                type="text"
                className={styles.titleInput}
                placeholder="쉼표로 구분해서 입력하세요. 예: 해커톤, 프론트엔드"
                value={tags}
                onChange={e => setTags(e.target.value)}
              />
            </div>

            <div className={styles.anonRow} style={{ marginTop: '32px' }}>
              <div className={styles.anonInfo}>
                <span className={styles.anonTitle}>
                  <EyeOff size={20} className={styles.anonIcon} />
                  익명으로 게시
                </span>
              </div>
              <label className={styles.toggleLabel}>
                <input
                  type="checkbox"
                  className={styles.toggleInput}
                  checked={isAnonymous}
                  onChange={e => setIsAnonymous(e.target.checked)}
                />
                <div className={styles.toggleTrack}></div>
              </label>
            </div>

            {error ? <p style={{ color: '#b91c1c', marginTop: 16 }}>{error}</p> : null}

            <div className={styles.actionRow}>
              <button className={styles.cancelBtn} onClick={() => router.back()} type="button">취소</button>
              <button className={styles.publishBtn} onClick={handleSubmit} disabled={submitting} type="button">
                <span>{submitting ? '수정 중...' : '수정 완료'}</span>
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AuthRequiredOverlay>
  );
}
