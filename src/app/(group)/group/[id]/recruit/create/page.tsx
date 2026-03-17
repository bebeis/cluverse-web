'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, FileEdit, Plus, Smartphone } from 'lucide-react';
import { AuthRequiredOverlay } from '@/components/ui/AuthRequiredOverlay';
import { ApiError, cluverseApi } from '@/lib/cluverse-api';
import styles from './Recruit.module.css';

export default function CreateRecruitmentPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const groupId = Number(params.id);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [positionName, setPositionName] = useState('');
  const [positionCount, setPositionCount] = useState(1);
  const [requirements, setRequirements] = useState('');
  const [duration, setDuration] = useState('');
  const [goal, setGoal] = useState('');
  const [processDescription, setProcessDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [questions, setQuestions] = useState([
    { question: '지원 동기를 적어주세요.', isRequired: true },
  ]);
  const [authRequired, setAuthRequired] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !positionName.trim() || !deadline) {
      setError('제목, 포지션, 마감일은 필수입니다.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await cluverseApi.createRecruitment(groupId, {
        title: title.trim(),
        description: description.trim(),
        positions: [{ name: positionName.trim(), count: positionCount }],
        requirements: requirements.trim(),
        duration: duration.trim(),
        goal: goal.trim(),
        processDescription: processDescription.trim(),
        deadline: new Date(deadline).toISOString(),
        formItems: questions.map((item, index) => ({
          question: item.question,
          questionType: 'TEXT',
          isRequired: item.isRequired,
          options: [],
          displayOrder: index + 1,
        })),
      });
      router.push(`/group/${groupId}/manage/applicants`);
    } catch (caught) {
      if (caught instanceof ApiError && caught.statusCode === 401) {
        setAuthRequired(true);
      } else {
        setError(caught instanceof Error ? caught.message : '모집글을 생성하지 못했습니다.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthRequiredOverlay active={authRequired}>
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <div className={styles.pageHeaderLeft}>
            <div className={styles.adminLabel}>
              <FileEdit size={16} />
              관리자 모드
            </div>
            <h1 className={styles.pageTitle}>모집 공고 생성</h1>
            <p className={styles.pageSubtitle}>`POST /api/v1/recruitments?groupId=...`로 실제 모집 공고를 생성합니다.</p>
          </div>
        </div>

        <div className={styles.grid}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionNumber}>1</div>
                <div>
                  <h2 className={styles.sectionTitle}>기본 정보 입력</h2>
                </div>
              </div>

              <div className={styles.formGrid}>
                <div>
                  <label className={styles.formLabel}>모집 제목</label>
                  <input className={styles.formInput} value={title} onChange={event => setTitle(event.target.value)} />
                </div>
                <div className={`${styles.formGrid} ${styles.formGrid2}`} style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: 24 }}>
                  <div>
                    <label className={styles.formLabel}>모집 포지션</label>
                    <input className={styles.formInput} value={positionName} onChange={event => setPositionName(event.target.value)} />
                  </div>
                  <div>
                    <label className={styles.formLabel}>인원</label>
                    <input className={styles.formInput} type="number" min={1} value={positionCount} onChange={event => setPositionCount(Number(event.target.value))} />
                  </div>
                </div>
                <div>
                  <label className={styles.formLabel}>소개</label>
                  <textarea className={styles.formTextarea} value={description} onChange={event => setDescription(event.target.value)} />
                </div>
                <div>
                  <label className={styles.formLabel}>요구 조건</label>
                  <textarea className={styles.formTextarea} value={requirements} onChange={event => setRequirements(event.target.value)} />
                </div>
                <div>
                  <label className={styles.formLabel}>활동 기간</label>
                  <input className={styles.formInput} value={duration} onChange={event => setDuration(event.target.value)} />
                </div>
                <div>
                  <label className={styles.formLabel}>목표</label>
                  <input className={styles.formInput} value={goal} onChange={event => setGoal(event.target.value)} />
                </div>
                <div>
                  <label className={styles.formLabel}>진행 방식</label>
                  <input className={styles.formInput} value={processDescription} onChange={event => setProcessDescription(event.target.value)} />
                </div>
                <div>
                  <label className={styles.formLabel}>모집 마감일</label>
                  <div className={styles.formDateWrap}>
                    <div className={styles.formDateIcon}>
                      <Calendar size={18} />
                    </div>
                    <input className={styles.formDateInput} type="datetime-local" value={deadline} onChange={event => setDeadline(event.target.value)} />
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionNumber}>2</div>
                <div>
                  <h2 className={styles.sectionTitle}>지원서 질문 구성</h2>
                </div>
              </div>

              <div className={styles.questions}>
                {questions.map((item, index) => (
                  <div key={index} className={styles.questionCard}>
                    <div className={styles.questionMeta}>
                      <span className={styles.questionNum}>Q{index + 1}</span>
                      <span className={styles.questionRequired}>{item.isRequired ? '필수' : '선택'}</span>
                    </div>
                    <input
                      className={styles.formInput}
                      value={item.question}
                      onChange={event => {
                        setQuestions(current => current.map((question, questionIndex) => (
                          questionIndex === index ? { ...question, question: event.target.value } : question
                        )));
                      }}
                    />
                  </div>
                ))}

                <button
                  className={styles.addQuestionBtn}
                  type="button"
                  onClick={() => setQuestions(current => [...current, { question: '', isRequired: true }])}
                >
                  <div className={styles.addQuestionInner}>
                    <div className={styles.addQuestionIcon}>
                      <Plus size={20} />
                    </div>
                    <span className={styles.addQuestionLabel}>질문 추가</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className={styles.previewCol}>
            <div className={styles.previewHeader}>
              <h3 className={styles.previewTitle}>
                <Smartphone size={20} style={{ color: '#4051B5' }} />
                미리보기
              </h3>
            </div>

            <div className={styles.phoneFrame}>
              <div className={styles.phoneInner}>
                <div className={styles.phoneContent}>
                  <div className={styles.phoneHero}>
                    <span className={styles.phoneHeroBadge}>Preview</span>
                    <div className={styles.phoneHeroTitle}>{title || '모집 제목'}</div>
                  </div>
                  <div className={styles.phoneBody}>
                    <div className={styles.phoneInfoChips}>
                      <div className={styles.phoneChip}>{positionName || '포지션'} {positionCount}명</div>
                      <div className={styles.phoneChip}>{duration || '활동 기간'}</div>
                    </div>
                    <p>{description || '소개 문구'}</p>
                    {questions.map((item, index) => (
                      <div key={index} style={{ marginTop: 12 }}>
                        <strong>{index + 1}. {item.question || '질문'}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {error ? <p style={{ color: '#b91c1c' }}>{error}</p> : null}
            <div className={styles.footerActions}>
              <button className={styles.footerBtnSecondary} type="button" onClick={() => router.back()}>
                취소
              </button>
              <button className={styles.footerBtnPrimary} type="button" onClick={handleSubmit} disabled={submitting}>
                {submitting ? '게시 중...' : '공고 게시하기'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </AuthRequiredOverlay>
  );
}
