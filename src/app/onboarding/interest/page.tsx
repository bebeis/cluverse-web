'use client';

import React, { useState } from 'react';
import styles from './Interest.module.css';
import { AuthHeader } from '@/components/ui/AuthHeader';
import { 
  Network, 
  Terminal, 
  PenTool, 
  Lightbulb, 
  Gamepad2, 
  Check, 
  Plus, 
  ArrowRight 
} from 'lucide-react';

const categories = [
  {
    id: 'it',
    title: 'IT / 개발',
    icon: <Terminal size={24} />,
    tags: ['웹 개발', '앱 개발', 'AI / 머신러닝', '데이터 사이언스', 'DevOps', '블록체인']
  },
  {
    id: 'design',
    title: '디자인',
    icon: <PenTool size={24} />,
    tags: ['UI/UX 디자인', '3D 모델링', '그래픽 디자인', '모션 그래픽', '영상 편집']
  },
  {
    id: 'planning',
    title: '기획 / 마케팅',
    icon: <Lightbulb size={24} />,
    tags: ['서비스 기획', '퍼포먼스 마케팅', '콘텐츠 마케팅', '프로젝트 관리']
  },
  {
    id: 'etc',
    title: '취미 / 기타',
    icon: <Gamepad2 size={24} />,
    tags: ['게임', '독서', '운동', '맛집 탐방', '영화/드라마']
  }
];

export default function InterestSelectionPage() {
  const [selectedTags, setSelectedTags] = useState<string[]>(['웹 개발', 'AI / 머신러닝', 'UI/UX 디자인']);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className={styles.container}>
      <AuthHeader rightElement={
          <div className={styles.headerProgress}>
            <p className={styles.progressText}>2/3 단계</p>
            <div className={styles.progressBar}>
              <div className={styles.progressFill}></div>
            </div>
          </div>
        } />

      <main className={styles.main}>
        <div className={styles.contentWrapper}>
          <div className={styles.titleArea}>
            <h1 className={styles.title}>어떤 분야에 관심이 있으신가요?</h1>
            <p className={styles.subtitle}>
              선택하신 관심사를 바탕으로 좋아할 만한 동아리와 친구를 추천해 드릴게요.
            </p>
            <div className={styles.selectionInfo}>
              <span className={styles.selectedBadge}>
                {selectedTags.length}개 선택됨
              </span>
              <span className={styles.selectionHint}>최소 3개 이상 선택해주세요</span>
            </div>
          </div>

          <div className={styles.categoriesList}>
            {categories.map(category => (
              <div key={category.id} className={styles.categoryGroup}>
                <div className={styles.categoryHeader}>
                  <div className={styles.categoryIcon}>
                    {category.icon}
                  </div>
                  <h3 className={styles.categoryTitle}>{category.title}</h3>
                </div>
                <div className={styles.tagsWrapper}>
                  {category.tags.map(tag => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <label key={tag} className={styles.tagLabel}>
                        <input 
                          type="checkbox" 
                          className={styles.tagInput}
                          checked={isSelected}
                          onChange={() => toggleTag(tag)}
                        />
                        <div className={styles.tagVisual}>
                          <p className={styles.tagText}>{tag}</p>
                          {isSelected ? (
                            <Check size={18} className={styles.tagIcon} />
                          ) : (
                            <Plus size={18} className={styles.tagIcon} />
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <button type="button" className={styles.prevBtn}>이전</button>
          <button type="button" className={styles.completeBtn}>
            <span>완료</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </footer>
    </div>
  );
}
