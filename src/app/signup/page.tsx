'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, CheckCircle2, Lock, Mail, User } from 'lucide-react';
import { AuthHeader } from '@/components/ui/AuthHeader';
import { cluverseApi, Term, University } from '@/lib/cluverse-api';
import styles from './Signup.module.css';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [nickname, setNickname] = useState('');
  const [keyword, setKeyword] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [universities, setUniversities] = useState<University[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);
  const [agreedTermsIds, setAgreedTermsIds] = useState<number[]>([]);
  const [termsLoading, setTermsLoading] = useState(true);
  const [termsError, setTermsError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    const loadTerms = async () => {
      try {
        setTermsLoading(true);
        setTermsError(null);
        const nextTerms = await cluverseApi.getTerms();

        if (!active) {
          return;
        }

        setTerms(nextTerms);
        setAgreedTermsIds([]);
      } catch (caught) {
        if (!active) {
          return;
        }

        setTerms([]);
        setTermsError(caught instanceof Error ? caught.message : '약관 목록을 불러오지 못했습니다.');
      } finally {
        if (active) {
          setTermsLoading(false);
        }
      }
    };

    void loadTerms();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (keyword.trim().length < 2 || selectedUniversity?.universityName === keyword.trim()) {
      setUniversities([]);
      return;
    }

    const timer = window.setTimeout(async () => {
      try {
        setUniversities(await cluverseApi.searchUniversities(keyword.trim()));
      } catch {
        setUniversities([]);
      }
    }, 250);

    return () => window.clearTimeout(timer);
  }, [keyword, selectedUniversity]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (password !== passwordConfirm) {
      setError('비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    if (!selectedUniversity) {
      setError('학교를 선택해 주세요.');
      return;
    }

    if (termsLoading) {
      setError('약관 목록을 불러오는 중입니다.');
      return;
    }

    if (terms.length === 0) {
      setError('약관 목록을 불러오지 못해 회원가입을 진행할 수 없습니다.');
      return;
    }

    const requiredTermsIds = terms.filter(term => term.required).map(term => term.termsId);
    const hasAllRequiredTerms = requiredTermsIds.every(termsId => agreedTermsIds.includes(termsId));

    if (!hasAllRequiredTerms) {
      setError('필수 약관에 모두 동의해 주세요.');
      return;
    }

    setSubmitting(true);

    try {
      await cluverseApi.register({
        email,
        password,
        nickname,
        universityId: selectedUniversity.universityId,
        agreedTermsIds,
      });
      await cluverseApi.login(email, password);
      router.replace('/onboarding/major');
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '회원가입에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleTermAgreement = (termsId: number) => {
    setAgreedTermsIds(current =>
      current.includes(termsId) ? current.filter(id => id !== termsId) : [...current, termsId],
    );
  };

  return (
    <div className={styles.container}>
      <AuthHeader
        rightElement={
          <div className={styles.headerActions}>
            <span className={styles.loginPrompt}>이미 계정이 있나요?</span>
            <Link href="/login" className={styles.loginBtn}>로그인</Link>
          </div>
        }
      />

      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.leftSide}>
            <div className={styles.leftTexture} />
            <div className={styles.leftContent}>
              <div className={styles.tag}>
                <BookOpen size={16} />
                <span className={styles.tagText}>Cluverse Join</span>
              </div>
              <h1 className={styles.title}>학교를 선택하고 바로 시작하세요</h1>
              <p className={styles.description}>회원가입은 실제 대학 검색 API와 연결되며, 완료 후 온보딩으로 이어집니다.</p>
              <div className={styles.featureList}>
                <div className={styles.featureItem}>
                  <div className={styles.featureIcon}><CheckCircle2 size={18} /></div>
                  프록시 경유 인증 요청
                </div>
                <div className={styles.featureItem}>
                  <div className={styles.featureIcon}><CheckCircle2 size={18} /></div>
                  대학 검색 API 연동
                </div>
                <div className={styles.featureItem}>
                  <div className={styles.featureIcon}><CheckCircle2 size={18} /></div>
                  가입 후 즉시 로그인
                </div>
              </div>
            </div>
          </div>

          <div className={styles.rightSide}>
            <div className={styles.formContainer}>
              <h2 className={styles.welcomeTitle}>회원가입</h2>
              <p className={styles.welcomeDesc}>API 문서 기준으로 약관 목록을 조회한 뒤 선택한 `termsId` 배열을 전송합니다.</p>
              {error ? <div className={styles.errorBox}>{error}</div> : null}

              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="signup-email">이메일</label>
                  <div className={styles.inputWrapper}>
                    <Mail className={styles.inputIcon} size={18} />
                    <input id="signup-email" className={styles.input} type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="signup-nickname">닉네임</label>
                  <div className={styles.inputWrapper}>
                    <User className={styles.inputIcon} size={18} />
                    <input id="signup-nickname" className={styles.input} value={nickname} onChange={e => setNickname(e.target.value)} required />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="signup-university">학교 검색</label>
                  <div className={styles.universityWrapper}>
                    <div className={styles.inputWrapper}>
                      <BookOpen className={styles.inputIcon} size={18} />
                      <input
                        id="signup-university"
                        className={`${styles.input} ${selectedUniversity ? styles.inputSuccess : ''}`}
                        value={keyword}
                        onChange={e => {
                          setKeyword(e.target.value);
                          setSelectedUniversity(null);
                        }}
                        placeholder="학교명을 2자 이상 입력"
                        required
                      />
                      {selectedUniversity ? <CheckCircle2 className={styles.successIcon} size={18} /> : null}
                    </div>
                    {universities.length > 0 ? (
                      <div className={styles.universityDropdown}>
                        {universities.map(university => (
                          <button
                            key={university.universityId}
                            type="button"
                            className={styles.universityDropdownItem}
                            onClick={() => {
                              setSelectedUniversity(university);
                              setKeyword(university.universityName);
                              setUniversities([]);
                            }}
                          >
                            {university.universityName}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="signup-password">비밀번호</label>
                  <div className={styles.inputWrapper}>
                    <Lock className={styles.inputIcon} size={18} />
                    <input id="signup-password" className={styles.input} type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="signup-password-confirm">비밀번호 확인</label>
                  <div className={styles.inputWrapper}>
                    <Lock className={styles.inputIcon} size={18} />
                    <input id="signup-password-confirm" className={styles.input} type="password" value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)} required />
                  </div>
                </div>

                <div className={styles.termsBox}>
                  <div className={styles.termsHeader}>
                    <span className={styles.termsTitle}>약관 동의</span>
                    {termsLoading ? <span className={styles.termsHint}>불러오는 중...</span> : null}
                  </div>
                  {termsError ? <p className={styles.termsError}>{termsError}</p> : null}
                  {!termsLoading && !termsError && terms.length === 0 ? (
                    <p className={styles.termsEmpty}>표시할 약관이 없습니다.</p>
                  ) : null}
                  {!termsLoading && terms.length > 0 ? (
                    <div className={styles.termsList}>
                      {terms.map(term => (
                        <label key={term.termsId} className={styles.termsLabel}>
                          <input
                            type="checkbox"
                            className={styles.termsCheckbox}
                            checked={agreedTermsIds.includes(term.termsId)}
                            onChange={() => toggleTermAgreement(term.termsId)}
                          />
                          <span className={styles.termsContent}>
                            <span className={styles.termsText}>
                              {term.title}{' '}
                              {term.required ? <span className={styles.required}>(필수)</span> : <span className={styles.optional}>(선택)</span>}
                            </span>
                            <span className={styles.termsMeta}>v{term.version} · 시행일 {term.effectiveAt.slice(0, 10)}</span>
                          </span>
                        </label>
                      ))}
                    </div>
                  ) : null}
                </div>

                <button type="submit" className={styles.signupBtn} disabled={submitting || termsLoading || !!termsError}>
                  {submitting ? '가입 중...' : '회원가입'}
                </button>
              </form>

              <p className={styles.loginPromptBottom}>
                이미 회원이신가요? <Link href="/login" className={styles.loginLink}>로그인</Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
