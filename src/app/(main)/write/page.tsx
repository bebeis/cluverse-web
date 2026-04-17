'use client';

import React, { useState } from 'react';
import styles from './Write.module.css';
import { Camera, Hash, LayoutList, MapPin, Smile, X, Check, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function WritePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('자유게시판');

  const handleSubmit = () => {
    if (!title || !content) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }
    alert('게시글이 등록되었습니다!');
    router.push('/home');
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <button className={styles.closeBtn} onClick={() => router.back()}>
          <X size={24} />
        </button>
        <h1 className={styles.title}>새 글 쓰기</h1>
        <button 
          className={styles.submitBtn} 
          onClick={handleSubmit}
          disabled={!title || !content}
        >
          등록
        </button>
      </header>

      {/* Main Form */}
      <div className={styles.formArea}>
        {/* Category selector */}
        <div className={styles.categoryRow}>
          <select 
            className={styles.categorySelect} 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="자유게시판">자유게시판</option>
            <option value="정보/팁">정보/팁</option>
            <option value="동아리/모임">동아리/모임</option>
            <option value="질문">질문</option>
          </select>
          <div className={styles.badgeRow}>
            <label className={styles.anonToggle}>
              <input type="checkbox" />
              <span>익명 설정</span>
            </label>
            <label className={styles.anonToggle}>
              <input type="checkbox" />
              <span>검색 허용</span>
            </label>
          </div>
        </div>

        {/* Title Input */}
        <input 
          type="text" 
          className={styles.titleInput} 
          placeholder="제목을 입력하세요" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Editor Area */}
        <textarea 
          className={styles.contentInput} 
          placeholder="내용을 자유롭게 작성해주세요. 사진은 최대 10장까지 첨부 가능합니다."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* Toolbar */}
        <div className={styles.toolbar}>
          <button className={styles.toolBtn}>
            <Camera size={20} />
          </button>
          <button className={styles.toolBtn}>
            <Hash size={20} />
          </button>
          <button className={styles.toolBtn}>
            <LayoutList size={20} />
          </button>
          <button className={styles.toolBtn}>
            <MapPin size={20} />
          </button>
          <button className={styles.toolBtn}>
            <Smile size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
