'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { EyeOff, Send } from 'lucide-react';
import { AuthRequiredOverlay } from '@/components/ui/AuthRequiredOverlay';
import { RichEditor } from '@/components/ui/RichEditor';
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
  const [initialContent, setInitialContent] = useState('');
  const [editorContent, setEditorContent] = useState('');

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
        const content = post.content ?? '';
        setInitialContent(content);
        setEditorContent(content);
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

  const handleImagePaste = async (blob: File): Promise<string> => {
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
      return imageUrl;
    } catch {
      setError('이미지 업로드에 실패했습니다.');
      throw new Error('upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !editorContent.trim()) {
      setError('제목과 내용을 입력하세요.');
      return;
    }

    const parser = typeof window !== 'undefined' ? new DOMParser() : null;
    const doc = parser?.parseFromString(editorContent, 'text/html');
    const imageUrls = Array.from(doc?.querySelectorAll('img') ?? []).map(img => img.src);

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

            <div className={styles.formGroup}>
              {/* 초기 콘텐츠가 준비된 이후에만 에디터를 마운트합니다 */}
              {!loading && (
                <RichEditor
                  initialValue={initialContent}
                  onChange={setEditorContent}
                  onImagePaste={handleImagePaste}
                  uploading={uploading}
                />
              )}
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
                <span className={styles.anonDesc}>작성자 정보가 숨겨집니다.</span>
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
