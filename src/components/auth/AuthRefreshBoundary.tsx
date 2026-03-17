'use client';

import React from 'react';
import { useAuthBootstrap } from '@/components/auth/AuthBootstrapContext';

export function AuthRefreshBoundary({ children }: { children: React.ReactNode }) {
  const { authVersion } = useAuthBootstrap();

  return <React.Fragment key={authVersion}>{children}</React.Fragment>;
}
