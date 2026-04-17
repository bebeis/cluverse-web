'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { cluverseApi } from '@/lib/cluverse-api';
import { setLoggedIn } from '@/lib/auth';
import { type SocialProvider } from '@/lib/oauth';
import styles from './Callback.module.css';

const SOCIAL_PROVIDERS: SocialProvider[] = ['kakao', 'google'];

function isSocialProvider(value: string): value is SocialProvider {
  return SOCIAL_PROVIDERS.includes(value as SocialProvider);
}

export function SocialLoginCallbackClient({ provider }: { provider: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const code = searchParams.get('code');

  const validatedProvider = useMemo(
    () => (isSocialProvider(provider) ? provider : null),
    [provider],
  );

  const immediateError = !validatedProvider
    ? '지원하지 않는 소셜 로그인 경로입니다.'
    : !code
      ? '인가 코드가 없어 로그인을 완료할 수 없습니다.'
      : null;

  useEffect(() => {
    if (immediateError || !validatedProvider || !code) {
      return;
    }

    let cancelled = false;

    const exchangeOauthCode = async () => {
      try {
        await cluverseApi.exchangeOauthCode({
          provider: validatedProvider,
          code,
        });

        if (!cancelled) {
          setLoggedIn();
          router.replace('/home');
          router.refresh();
        }
      } catch (caught) {
        if (!cancelled) {
          setError(caught instanceof Error ? caught.message : '소셜 로그인에 실패했습니다.');
        }
      }
    };

    void exchangeOauthCode();

    return () => {
      cancelled = true;
    };
  }, [code, immediateError, router, validatedProvider]);

  const message = error ?? immediateError;

  return (
    <main className={styles.container}>
      <section className={styles.card}>
        <h1 className={styles.title}>{message ? '로그인에 실패했습니다' : '로그인 처리 중입니다'}</h1>
        <p className={`${styles.description} ${message ? styles.error : ''}`}>
          {message ?? '소셜 인증 정보를 확인하고 있습니다. 잠시만 기다려 주세요.'}
        </p>
        {message ? (
          <p className={styles.description}>
            <Link href="/login">로그인 페이지로 돌아가기</Link>
          </p>
        ) : null}
      </section>
    </main>
  );
}
