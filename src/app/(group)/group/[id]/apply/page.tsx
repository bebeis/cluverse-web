'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { AlertCircle, ArrowLeft, Calendar, Clock, Info, Link2, Users } from 'lucide-react';
import { AuthRequiredOverlay } from '@/components/ui/AuthRequiredOverlay';
import { ApiError, RecruitmentDetail, RecruitmentSummary, cluverseApi, formatRelativeTime } from '@/lib/cluverse-api';
import styles from './Apply.module.css';

export default function ApplicationFormPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const groupId = Number(params.id);
  const [recruitments, setRecruitments] = useState<RecruitmentSummary[]>([]);
  const [selectedRecruitmentId, setSelectedRecruitmentId] = useState<number | null>(null);
  const [recruitment, setRecruitment] = useState<RecruitmentDetail | null>(null);
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [authRequired, setAuthRequired] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    cluverseApi.getRecruitments({ groupId, recruitingOnly: true, page: 1, size: 20 })
      .then(result => {
        setRecruitments(result.recruitments);
        setSelectedRecruitmentId(result.recruitments[0]?.recruitmentId ?? null);
      })
      .catch(caught => {
        if (caught instanceof ApiError && caught.statusCode === 401) {
          setAuthRequired(true);
          return;
        }
        setError(caught instanceof Error ? caught.message : '모집 정보를 불러오지 못했습니다.');
      });
  }, [groupId]);

  useEffect(() => {
    if (!selectedRecruitmentId) {
      setRecruitment(null);
      return;
    }

    cluverseApi.getRecruitment(selectedRecruitmentId)
      .then(result => {
        setRecruitment(result);
        setError(null);
      })
      .catch(caught => {
        setError(caught instanceof Error ? caught.message : '지원서 폼을 불러오지 못했습니다.');
      });
  }, [selectedRecruitmentId]);

  const totalCount = useMemo(() => {
    return (recruitment?.formItems.length ?? 0) + 1;
  }, [recruitment]);

  const filledCount = useMemo(() => {
    const answerCount = Object.values(answers).filter(value => value.trim()).length;
    return answerCount + (portfolioUrl.trim() ? 1 : 0);
  }, [answers, portfolioUrl]);

  const progress = totalCount ? Math.round((filledCount / totalCount) * 100) : 0;

  const handleSubmit = async () => {
    if (!recruitment) {
      return;
    }

    const firstPosition = recruitment.positions[0]?.name;
    if (!firstPosition) {
      setError('지원 가능한 포지션이 없습니다.');
      return;
    }

    const missingRequired = recruitment.formItems.some(item => item.isRequired && !answers[item.formItemId!]?.trim());
    if (missingRequired) {
      setError('필수 문항을 모두 작성하세요.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await cluverseApi.createRecruitmentApplication(recruitment.recruitmentId, {
        position: firstPosition,
        portfolioUrl: portfolioUrl.trim() || null,
        answers: recruitment.formItems.map(item => ({
          formItemId: item.formItemId!,
          answer: answers[item.formItemId!] || '',
        })),
      });
      router.push(`/group/${groupId}`);
    } catch (caught) {
      if (caught instanceof ApiError && caught.statusCode === 401) {
        setAuthRequired(true);
      } else {
        setError(caught instanceof Error ? caught.message : '지원서를 제출하지 못했습니다.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthRequiredOverlay active={authRequired}>
      <div className={styles.page}>
        <Link href={`/group/${groupId}`} className={styles.backNav}>
          <ArrowLeft size={18} />
          그룹 페이지로 돌아가기
        </Link>

        <div className={styles.heroCard}>
          <div className={styles.heroTop}>
            <div className={styles.heroInfo}>
              <span className={styles.heroBadge}>
                <Clock size={14} />
                {recruitment ? formatRelativeTime(recruitment.deadline) : '모집 조회 중'}
              </span>
              <h1 className={styles.heroTitle}>{recruitment?.title ?? '모집 공고를 선택하세요'}</h1>
              <p className={styles.heroDesc}>{recruitment?.description ?? '현재 열려 있는 모집글을 `/api/v1/recruitments`에서 불러옵니다.'}</p>
            </div>
          </div>
          <div className={styles.heroChips}>
            <span className={styles.heroChip}>
              <Calendar size={16} /> 마감일: {recruitment ? new Date(recruitment.deadline).toLocaleString('ko-KR') : '-'}
            </span>
            <span className={styles.heroChip}>
              <Users size={16} /> 모집 포지션: {recruitment?.positions.map(position => `${position.name} ${position.count}명`).join(', ') || '-'}
            </span>
          </div>
        </div>

        <div className={styles.progressBar}>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
          <span className={styles.progressLabel}>{filledCount}/{totalCount} 완료</span>
        </div>

        <div className={styles.linkInputCard} style={{ marginBottom: 24 }}>
          <h3 className={styles.questionText}>지원할 모집글</h3>
          <select
            className={styles.linkInput}
            value={selectedRecruitmentId ?? ''}
            onChange={event => setSelectedRecruitmentId(Number(event.target.value))}
          >
            <option value="">선택하세요</option>
            {recruitments.map(item => (
              <option key={item.recruitmentId} value={item.recruitmentId}>
                {item.title}
              </option>
            ))}
          </select>
          <p className={styles.linkHint}>
            <Info size={14} />
            라우트에 `recruitmentId`가 없어서 현재 그룹의 오픈 모집글 중 하나를 선택하는 방식으로 연결했습니다.
          </p>
        </div>

        <div className={styles.questions}>
          {recruitment?.formItems.map((item, index) => {
            const value = answers[item.formItemId!] || '';
            return (
              <div key={item.formItemId} className={styles.questionCard}>
                <div className={styles.questionMeta}>
                  <div className={styles.questionMetaLeft}>
                    <span className={styles.questionNum}>Q{index + 1}</span>
                    {item.isRequired ? <span className={styles.questionRequired}>*필수</span> : null}
                  </div>
                  <span className={styles.questionCharCount}>{value.length}</span>
                </div>
                <h3 className={styles.questionText}>{item.question}</h3>
                <textarea
                  className={styles.questionTextarea}
                  value={value}
                  onChange={event => setAnswers(current => ({ ...current, [item.formItemId!]: event.target.value }))}
                />
              </div>
            );
          })}

          <div className={styles.linkInputCard}>
            <div className={styles.questionMeta}>
              <div className={styles.questionMetaLeft}>
                <span className={styles.questionNum}>포트폴리오</span>
              </div>
            </div>
            <h3 className={styles.questionText}>포트폴리오 링크</h3>
            <div className={styles.linkInputWrap}>
              <div className={styles.linkInputPrefix}>
                <Link2 size={18} />
              </div>
              <input
                className={styles.linkInput}
                placeholder="https://..."
                value={portfolioUrl}
                onChange={event => setPortfolioUrl(event.target.value)}
              />
            </div>
          </div>
        </div>

        {error ? <div className={styles.footerHint}>{error}</div> : null}

        <div className={styles.footer}>
          <div className={styles.footerHint}>
            <AlertCircle size={16} />
            제출 후 수정이 어려울 수 있습니다.
          </div>
          <div className={styles.footerActions}>
            <button className={styles.saveDraftBtn} type="button" disabled>
              임시 저장
            </button>
            <button className={styles.submitBtn} type="button" onClick={handleSubmit} disabled={submitting || !recruitment}>
              {submitting ? '제출 중...' : '지원서 제출하기'}
            </button>
          </div>
        </div>
      </div>
    </AuthRequiredOverlay>
  );
}
