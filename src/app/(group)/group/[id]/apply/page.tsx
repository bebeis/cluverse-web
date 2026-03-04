'use client';

import React, { useState } from 'react';
import styles from './Apply.module.css';
import {
  ArrowLeft, Music, Clock, Users, Calendar,
  Link2, Info, AlertCircle,
} from 'lucide-react';

const questions = [
  {
    num: 'Q1',
    required: true,
    text: '동아리에 지원하게 된 계기가 무엇인가요? 자유롭게 작성해주세요.',
    placeholder: '지원 동기를 자세히 작성해주세요. (최소 50자)',
    maxLen: 500,
  },
  {
    num: 'Q2',
    required: true,
    text: '관련된 음악 활동 경험이 있다면 구체적으로 서술해주세요. (역할, 활동 기간, 성과 등)',
    placeholder: '활동 경험과 본인의 역할을 상세히 적어주세요.',
    maxLen: 500,
  },
  {
    num: 'Q3',
    required: false,
    text: '가입 후 동아리에서 어떤 활동을 해보고 싶은지 자유롭게 작성해주세요.',
    placeholder: '구체적인 활동 계획이나 해보고 싶은 프로젝트 등을 적어주세요.',
    maxLen: 300,
  },
];

export default function ApplicationFormPage() {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleChange = (num: string, value: string) => {
    setAnswers(prev => ({ ...prev, [num]: value }));
  };

  const filledCount = Object.values(answers).filter(v => v.trim().length > 0).length;
  const totalCount = questions.length + 1; // +1 for portfolio link
  const progress = Math.round((filledCount / totalCount) * 100);

  return (
    <div className={styles.page}>
      {/* Back Navigation */}
      <button className={styles.backNav}>
        <ArrowLeft size={18} />
        SoundWave 동아리 페이지로 돌아가기
      </button>

      {/* Hero Card */}
      <div className={styles.heroCard}>
        <div className={styles.heroTop}>
          <div className={styles.heroIcon}>
            <Music size={28} color="white" />
          </div>
          <div className={styles.heroInfo}>
            <span className={styles.heroBadge}>
              <Clock size={14} />
              D-14 마감
            </span>
            <h1 className={styles.heroTitle}>
              SoundWave 5기<br />보컬/세션 모집 지원서
            </h1>
            <p className={styles.heroDesc}>
              SoundWave와 함께할 새로운 멤버를 찾고 있습니다. 아래 질문에 성심껏 답변해주세요.
            </p>
          </div>
        </div>
        <div className={styles.heroChips}>
          <span className={styles.heroChip}>
            <Calendar size={16} /> 활동기간: 6개월
          </span>
          <span className={styles.heroChip}>
            <Users size={16} /> 모집인원: 3명
          </span>
          <span className={styles.heroChip}>
            <Clock size={16} /> 마감일: 2024.04.15
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className={styles.progressBar}>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
        <span className={styles.progressLabel}>{filledCount}/{totalCount} 완료</span>
      </div>

      {/* Questions */}
      <div className={styles.questions}>
        {questions.map(q => {
          const val = answers[q.num] || '';
          return (
            <div key={q.num} className={styles.questionCard}>
              <div className={styles.questionMeta}>
                <div className={styles.questionMetaLeft}>
                  <span className={styles.questionNum}>{q.num}</span>
                  {q.required && <span className={styles.questionRequired}>*필수</span>}
                </div>
                <span className={styles.questionCharCount}>
                  {val.length} / {q.maxLen}
                </span>
              </div>
              <h3 className={styles.questionText}>{q.text}</h3>
              <textarea
                className={styles.questionTextarea}
                placeholder={q.placeholder}
                value={val}
                onChange={e => handleChange(q.num, e.target.value)}
                maxLength={q.maxLen}
              />
            </div>
          );
        })}

        {/* Portfolio Link */}
        <div className={styles.linkInputCard}>
          <div className={styles.questionMeta}>
            <div className={styles.questionMetaLeft}>
              <span className={styles.questionNum}>포트폴리오</span>
              <span style={{ fontSize: 12, color: '#9CA3AF' }}>(선택)</span>
            </div>
          </div>
          <h3 className={styles.questionText}>
            포트폴리오나 참고 자료 링크가 있다면 첨부해주세요.
          </h3>
          <div className={styles.linkInputWrap}>
            <div className={styles.linkInputPrefix}>
              <Link2 size={18} />
            </div>
            <input
              className={styles.linkInput}
              placeholder="https://notion.so/portfolio 또는 YouTube 링크"
              onChange={e => {
                if (e.target.value.trim()) {
                  setAnswers(prev => ({ ...prev, 'link': e.target.value }));
                } else {
                  setAnswers(prev => {
                    const next = { ...prev };
                    delete next['link'];
                    return next;
                  });
                }
              }}
            />
          </div>
          <p className={styles.linkHint}>
            <Info size={14} />
            Notion, Google Drive, YouTube 등의 링크를 첨부할 수 있습니다.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.footerHint}>
          <AlertCircle size={16} />
          제출 후에는 수정이 불가능하니 신중히 확인해주세요.
        </div>
        <div className={styles.footerActions}>
          <button className={styles.saveDraftBtn}>임시 저장</button>
          <button className={styles.submitBtn}>지원서 제출하기</button>
        </div>
      </div>
    </div>
  );
}
