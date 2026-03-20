'use client';

import React, { Suspense, useEffect, useState } from 'react';
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
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [category, setCategory] = useState('GENERAL');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [authRequired, setAuthRequired] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = async () => {
    if (!boardId || !title.trim() || !content.trim()) {
      setError('게시판, 제목, 내용을 모두 입력하세요.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const created = await cluverseApi.createPost({
        boardId: Number(boardId),
        category,
        title: title.trim(),
        content: content.trim(),
        tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
        isAnonymous,
        isPinned: false,
        isExternalVisible: true,
        imageUrls: [],
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

            <div className={styles.editorWrapper}>
              <textarea
                className={styles.editorTextarea}
                placeholder="내용을 입력하세요..."
                rows={12}
                value={content}
                onChange={event => setContent(event.target.value)}
              />
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
              <li className={styles.guideItem}>이미지 업로드 API는 문서에 없어 현재 텍스트 게시만 연결했습니다.</li>
            </ul>
          </div>
        </aside>
      </div>
    </AuthRequiredOverlay>
  );
}
