'use client';

import React, { useState } from 'react';
import styles from './CreatePost.module.css';
import { Save, Building, ChevronDown, HelpCircle, Info, BarChart3, MessagesSquare, CalendarDays, Bold, Italic, Link as LinkIcon, List, Code, ImagePlus, FileCode, EyeOff, Send, BookOpen, ArrowRight, Lightbulb } from 'lucide-react';

const categories = [
  { id: 'question', label: '질문', icon: <HelpCircle size={16} /> },
  { id: 'info', label: '정보', icon: <Info size={16} /> },
  { id: 'resource', label: '자료', icon: <BarChart3 size={16} /> },
  { id: 'free', label: '자유주제', icon: <MessagesSquare size={16} /> },
  { id: 'event', label: '이벤트', icon: <CalendarDays size={16} /> },
];

export default function CreatePostPage() {
  const [selectedCat, setSelectedCat] = useState('question');
  const [isAnon, setIsAnon] = useState(false);

  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>게시글 작성</h1>
        <button className={styles.draftBtn}>
          <Save size={16} /> 임시저장 (2)
        </button>
      </div>

      <div className={styles.contentArea}>
        <div className={styles.formSection}>
          <div className={styles.formCard}>
            {/* Board Select */}
            <div className={styles.formGroup}>
              <label className={styles.label}>게시판 선택</label>
              <div className={styles.selectWrapper}>
                <div className={styles.selectIcon}>
                  <Building size={20} />
                </div>
                <select className={styles.select} defaultValue="">
                  <option value="" disabled>커뮤니티 게시판을 선택하세요...</option>
                  <option value="cs">컴퓨터 공학 (Computer Science)</option>
                  <option value="eng">공학 허브 (Engineering Hub)</option>
                  <option value="arts">예술 &amp; 창작 (Creative Arts)</option>
                  <option value="biz">경영 &amp; 금융 (Business &amp; Finance)</option>
                </select>
                <div className={styles.selectChevron}>
                  <ChevronDown size={20} />
                </div>
              </div>
            </div>

            {/* Category */}
            <div className={styles.formGroup}>
              <p className={styles.label}>카테고리 선택</p>
              <div className={styles.categoryChips}>
                {categories.map(cat => (
                  <label key={cat.id} className={styles.categoryLabel}>
                    <input 
                      type="radio" 
                      name="category" 
                      className={styles.categoryRadio}
                      checked={selectedCat === cat.id}
                      onChange={() => setSelectedCat(cat.id)}
                    />
                    <div className={styles.categoryChip}>
                      {cat.icon}
                      <span>{cat.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Title */}
            <div className={styles.formGroup}>
              <input 
                type="text" 
                className={styles.titleInput} 
                placeholder="글 제목을 입력하세요" 
              />
            </div>

            {/* Editor */}
            <div className={styles.editorWrapper}>
              <div className={styles.toolbar}>
                <button className={styles.toolBtn}><Bold size={18} /></button>
                <button className={styles.toolBtn}><Italic size={18} /></button>
                <button className={styles.toolBtn}><LinkIcon size={18} /></button>
                <div className={styles.toolDivider}></div>
                <button className={styles.toolBtn}><List size={18} /></button>
                <button className={styles.toolBtn}><Code size={18} /></button>
              </div>
              <textarea 
                className={styles.editorTextarea} 
                placeholder="내용을 입력하세요..."
                rows={12}
              />
              <div className={styles.editorFooter}>
                <button className={styles.addImageBtn}>
                  <ImagePlus size={18} /> 이미지 추가
                </button>
                <span className={styles.mdBadge}>
                  <FileCode size={12} /> Markdown 지원
                </span>
              </div>
            </div>

            {/* Anonymous Toggle */}
            <div className={styles.anonRow} style={{ marginTop: '32px' }}>
              <div className={styles.anonInfo}>
                <span className={styles.anonTitle}>
                  <EyeOff size={20} className={styles.anonIcon} />
                  익명으로 게시
                </span>
                <span className={styles.anonDesc}>작성자의 이름이 다른 사용자에게 공개되지 않습니다.</span>
              </div>
              <label className={styles.toggleLabel}>
                <input 
                  type="checkbox" 
                  className={styles.toggleInput}
                  checked={isAnon}
                  onChange={() => setIsAnon(!isAnon)}
                />
                <div className={styles.toggleTrack}></div>
              </label>
            </div>

            {/* Actions */}
            <div className={styles.actionRow}>
              <button className={styles.cancelBtn}>취소</button>
              <button className={styles.publishBtn}>
                <span>게시하기</span>
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.guideBox}>
            <div className={styles.guideHeader}>
              <div className={styles.guideIconBox}>
                <BookOpen size={20} />
              </div>
              <h3 className={styles.guideTitle}>게시글 작성 가이드</h3>
            </div>
            <ul className={styles.guideList}>
              <li className={styles.guideItem}>
                <span className={styles.guideNum}>1</span>
                <p>
                  <strong className={styles.guideItemTitle}>상호 존중하기</strong>
                  <span className={styles.guideItemDesc}>비방이나 혐오 표현은 엄격히 금지됩니다. 예의를 지켜주세요.</span>
                </p>
              </li>
              <li className={styles.guideItem}>
                <span className={styles.guideNum}>2</span>
                <p>
                  <strong className={styles.guideItemTitle}>주제 준수하기</strong>
                  <span className={styles.guideItemDesc}>게시판 성격에 맞는 글을 작성해주세요.</span>
                </p>
              </li>
              <li className={styles.guideItem}>
                <span className={styles.guideNum}>3</span>
                <p>
                  <strong className={styles.guideItemTitle}>스팸 금지</strong>
                  <span className={styles.guideItemDesc}>홍보성 게시글은 지정된 게시판을 이용해주세요.</span>
                </p>
              </li>
              <li className={styles.guideItem}>
                <span className={styles.guideNum}>4</span>
                <p>
                  <strong className={styles.guideItemTitle}>출처 확인</strong>
                  <span className={styles.guideItemDesc}>뉴스나 자료 공유 시 출처를 명확히 해주세요.</span>
                </p>
              </li>
            </ul>
            <div className={styles.guideFooter}>
              <a href="#" className={styles.guideLink}>
                가이드 전문 보기 <ArrowRight size={14} />
              </a>
            </div>
          </div>

          <div className={styles.tipBox}>
            <div className={styles.tipBg}>
              <Lightbulb size={100} />
            </div>
            <div className={styles.tipContent}>
              <div className={styles.tipHeader}>
                <Lightbulb size={24} className={styles.tipIcon} />
                <h4 className={styles.tipTitle}>꿀팁</h4>
              </div>
              <p className={styles.tipText}>
                명확하고 간결한 제목과 적절한 태그를 사용하면 커뮤니티에서 <strong>3배 더 많은 반응</strong>을 얻을 수 있습니다.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
