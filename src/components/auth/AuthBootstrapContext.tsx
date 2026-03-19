'use client';

import React, { createContext, useContext, useMemo, useState } from 'react';

type AuthBootstrapContextValue = {
  authVersion: number;
  isAuthBootstrapping: boolean;
};

const AuthBootstrapContext = createContext<AuthBootstrapContextValue>({
  authVersion: 0,
  isAuthBootstrapping: false,
});

export function AuthBootstrapProvider({ children }: { children: React.ReactNode }) {
  const [authVersion] = useState(0);
  const [isAuthBootstrapping] = useState(false);

  const value = useMemo(
    () => ({ authVersion, isAuthBootstrapping }),
    [authVersion, isAuthBootstrapping],
  );

  return <AuthBootstrapContext.Provider value={value}>{children}</AuthBootstrapContext.Provider>;
}

export const useAuthBootstrap = () => useContext(AuthBootstrapContext);
