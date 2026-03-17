'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { cluverseApi } from '@/lib/cluverse-api';

type AuthBootstrapContextValue = {
  authVersion: number;
  isAuthBootstrapping: boolean;
};

const AuthBootstrapContext = createContext<AuthBootstrapContextValue>({
  authVersion: 0,
  isAuthBootstrapping: false,
});

const buildCleanUrl = (pathname: string, searchParams: URLSearchParams) => {
  const nextParams = new URLSearchParams(searchParams.toString());
  nextParams.delete('oauth_token');
  const nextQuery = nextParams.toString();
  return nextQuery ? `${pathname}?${nextQuery}` : pathname;
};

export function AuthBootstrapProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [authVersion, setAuthVersion] = useState(0);
  const [isAuthBootstrapping, setIsAuthBootstrapping] = useState(false);

  useEffect(() => {
    const oauthToken = searchParams.get('oauth_token');
    if (!oauthToken) {
      setIsAuthBootstrapping(false);
      return;
    }

    let cancelled = false;

    const exchangeOauthToken = async () => {
      setIsAuthBootstrapping(true);

      try {
        await cluverseApi.exchangeOauthToken(oauthToken);
        if (!cancelled) {
          setAuthVersion(prev => prev + 1);
        }
      } catch (error) {
        console.error('OAuth 세션 교환에 실패했습니다.', error);
      } finally {
        if (!cancelled) {
          setIsAuthBootstrapping(false);
          router.replace(buildCleanUrl(pathname, searchParams));
        }
      }
    };

    exchangeOauthToken();

    return () => {
      cancelled = true;
    };
  }, [pathname, router, searchParams]);

  const value = useMemo(
    () => ({ authVersion, isAuthBootstrapping }),
    [authVersion, isAuthBootstrapping],
  );

  return <AuthBootstrapContext.Provider value={value}>{children}</AuthBootstrapContext.Provider>;
}

export const useAuthBootstrap = () => useContext(AuthBootstrapContext);
