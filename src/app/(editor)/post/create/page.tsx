'use client';

import React, { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BookOpen, EyeOff, Save, Send } from 'lucide-react';
import { AuthRequiredOverlay } from '@/components/ui/AuthRequiredOverlay';
import { ApiError, cluverseApi } from '@/lib/cluverse-api';
import styles from './CreatePost.module.css';

type BoardOption = {
  boardId: number;
  name: string;
  description: string;
};

export default function CreatePostPage() {
  return (
    <Suspense>
      <CreatePostForm />
    </Suspense>
  );
}

function CreatePostForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [boards, setBoards] = useState<BoardOption[]>([]);
  const [boardId, setBoardId] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [category, setCategory] = useState('GENERAL');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [authRequired, setAuthRequired] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const editorWrapperRef = useRef<HTMLDivElement>(null);
  const [imgOverlay, setImgOverlay] = useState<{ top: number; left: number; width: number; img: HTMLImageElement } | null>(null);

  useEffect(() => {
    cluverseApi.getBoards({ activeOnly: true, depth: 2 })
      .then(result => {
        const writable = result.boards.filter(board => board.isWritable).map(board => ({
          boardId: board.boardId,
          name: board.name,
          description: board.description,
        }));
        setBoards(writable);
        setAuthRequired(false);
        const preselect = searchParams.get('boardId');
        if (preselect && writable.some(b => b.boardId === Number(preselect))) {
          setBoardId(preselect);
        }
      })
      .catch(caught => {
        if (caught instanceof ApiError && caught.statusCode === 401) {
          setAuthRequired(true);
          return;
        }
        setError(caught instanceof Error ? caught.message : '게시판 목록을 불러오지 못했습니다.');
      });
  }, []);

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
    if (!boardId || !title.trim() || !editorContent.trim()) {
      setError('게시판, 제목, 내용을 모두 입력하세요.');
      return;
    }

    const imageUrls = Array.from(editorRef.current?.querySelectorAll('img') ?? [])
      .map(img => img.src);

    setSubmitting(true);
    setError(null);

    try {
      const created = await cluverseApi.createPost({
        boardId: Number(boardId),
        category,
        title: title.trim(),
        content: editorContent,
        tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
        isAnonymous,
        isPinned: false,
        isExternalVisible: true,
        imageUrls,
      });
      router.push(`/post/${created.postId}`);
    } catch (caught) {
      if (caught instanceof ApiError && caught.statusCode === 401) {
        setAuthRequired(true);
      } else {
        setError(caught instanceof Error ? caught.message : '게시글을 등록하지 못했습니다.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthRequiredOverlay active={authRequired}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>게시글 작성</h1>
        <button className={styles.draftBtn} type="button">
          <Save size={16} /> 임시저장은 아직 제공되지 않습니다
        </button>
      </div>

      <div className={styles.contentArea}>
        <div className={styles.formSection}>
          <div className={styles.formCard}>
            <div className={styles.formGroup}>
              <label className={styles.label}>게시판 선택</label>
              <select className={styles.select} value={boardId} onChange={event => setBoardId(event.target.value)}>
                <option value="">게시판을 선택하세요</option>
                {boards.map(board => (
                  <option key={board.boardId} value={board.boardId}>
                    {board.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>카테고리</label>
              <select className={styles.select} value={category} onChange={event => setCategory(event.target.value)}>
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
                onChange={event => setTitle(event.target.value)}
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
                onChange={event => setTags(event.target.value)}
              />
            </div>

            <div className={styles.anonRow} style={{ marginTop: '32px' }}>
              <div className={styles.anonInfo}>
                <span className={styles.anonTitle}>
                  <EyeOff size={20} className={styles.anonIcon} />
                  익명으로 게시
                </span>
                <span className={styles.anonDesc}>API의 `isAnonymous` 값을 사용합니다.</span>
              </div>
              <label className={styles.toggleLabel}>
                <input
                  type="checkbox"
                  className={styles.toggleInput}
                  checked={isAnonymous}
                  onChange={event => setIsAnonymous(event.target.checked)}
                />
                <div className={styles.toggleTrack}></div>
              </label>
            </div>

            {error ? <p style={{ color: '#b91c1c', marginTop: 16 }}>{error}</p> : null}

            <div className={styles.actionRow}>
              <button className={styles.cancelBtn} onClick={() => router.back()} type="button">취소</button>
              <button className={styles.publishBtn} onClick={handleSubmit} disabled={submitting} type="button">
                <span>{submitting ? '게시 중...' : '게시하기'}</span>
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.guideBox}>
            <div className={styles.guideHeader}>
              <div className={styles.guideIconBox}>
                <BookOpen size={20} />
              </div>
              <h3 className={styles.guideTitle}>연동 상태</h3>
            </div>
            <ul className={styles.guideList}>
              <li className={styles.guideItem}>게시판 목록은 `/api/v1/boards`에서 가져옵니다.</li>
              <li className={styles.guideItem}>게시는 `/api/v1/posts`로 생성합니다.</li>
              <li className={styles.guideItem}>이미지를 에디터에 붙여넣기(Ctrl+V)하면 `/api/v1/posts/images/presigned-url`을 통해 자동 업로드됩니다.</li>
            </ul>
          </div>
        </aside>
      </div>
    </AuthRequiredOverlay>
  );
}
