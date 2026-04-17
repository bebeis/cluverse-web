'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, BookOpen, Users, ShieldCheck } from 'lucide-react';
import { AuthHeader } from '@/components/ui/AuthHeader';
import { cluverseApi } from '@/lib/cluverse-api';
import { buildSocialAuthUrl, buildSocialCallbackUrl, type SocialProvider } from '@/lib/oauth';
import { setLoggedIn } from '@/lib/auth';
import styles from './Login.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await cluverseApi.login(email, password);
      setLoggedIn();
      router.replace('/home');
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '로그인에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const redirectSocial = (provider: SocialProvider) => {
    const origin = process.env.NEXT_PUBLIC_OAUTH_REDIRECT_ORIGIN || window.location.origin;
    const redirectUri = buildSocialCallbackUrl(provider, origin);
    const authUrl = buildSocialAuthUrl(provider, redirectUri);
    window.location.href = authUrl;
  };

  return (
    <div className={styles.container}>
      <AuthHeader
        rightElement={
          <div className={styles.headerActions}>
            <Link href="/signup" className={styles.signupBtn}>회원가입</Link>
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
                <span className={styles.tagText}>University Hub</span>
              </div>
              <h1 className={styles.title}>대학 간 장벽을 넘는<br />연결, 클루버스</h1>
              <p className={styles.description}>이메일과 카카오/구글 소셜 계정으로 시작하세요.</p>
              <div className={styles.imageArea}>
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=600&auto=format&fit=crop"
                  alt="Students connecting across universities"
                  className={styles.illustration}
                />
              </div>
              <div className={styles.statsList}>
                <div className={styles.statItem}>
                  <Users size={18} />
                  <span>관심 기반 피드와 그룹 탐색</span>
                </div>
                <div className={styles.statItem}>
                  <ShieldCheck size={18} />
                  <span>JSESSIONID 쿠키 세션 유지</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.rightSide}>
            <div className={styles.formContainer}>
              <h2 className={styles.welcomeTitle}>로그인</h2>
              <p className={styles.welcomeDesc}>이메일 또는 소셜 계정으로 계속하세요.</p>

              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <div className={styles.labelRow}>
                    <label className={styles.label} htmlFor="email">이메일</label>
                  </div>
                  <div className={styles.inputWrapper}>
                    <Mail className={styles.inputIcon} size={20} />
                    <input
                      id="email"
                      type="email"
                      className={styles.input}
                      placeholder="example@university.ac.kr"
                      value={email}
                      onChange={event => setEmail(event.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <div className={styles.labelRow}>
                    <label className={styles.label} htmlFor="password">비밀번호</label>
                  </div>
                  <div className={styles.inputWrapper}>
                    <Lock className={styles.inputIcon} size={20} />
                    <input
                      id="password"
                      type="password"
                      className={styles.input}
                      placeholder="••••••••"
                      value={password}
                      onChange={event => setPassword(event.target.value)}
                      required
                    />
                  </div>
                </div>

                {error ? <p className={styles.welcomeDesc} style={{ color: '#b91c1c' }}>{error}</p> : null}

                <button type="submit" className={styles.loginBtn} disabled={submitting}>
                  {submitting ? '로그인 중...' : '로그인'} <ArrowRight size={20} />
                </button>
              </form>

              <div className={styles.divider}>
                <div className={styles.dividerLine}>
                  <div className={styles.dividerLineInner} />
                </div>
                <div className={styles.dividerText}>
                  <span>소셜 계정으로 계속하기</span>
                </div>
              </div>

              <div className={styles.socialButtons}>
                <button type="button" className={`${styles.socialBtn} ${styles.kakaoBtn}`} onClick={() => redirectSocial('kakao')}>
                  카카오로 시작하기
                </button>
                <button type="button" className={`${styles.socialBtn} ${styles.googleBtn}`} onClick={() => redirectSocial('google')}>
                  Google로 시작하기
                </button>
              </div>

              <p className={styles.signupPrompt}>
                아직 회원이 아니신가요? <Link href="/signup" className={styles.signupLink}>회원가입 하기</Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
