'use client';

import React from 'react';
import Link from 'next/link';
import { Lock } from 'lucide-react';
import styles from './AuthRequiredOverlay.module.css';

type AuthRequiredOverlayProps = {
  active: boolean;
  children: React.ReactNode;
  title?: string;
  description?: string;
};

export function AuthRequiredOverlay({
  active,
  children,
  title = '계속 보려면 로그인이 필요합니다',
  description = '클루버스는 인증 후 피드, 프로필, 그룹, 설정 정보를 불러옵니다. 로그인하거나 새 계정을 만들어 이어서 이용하세요.',
}: AuthRequiredOverlayProps) {
  return (
    <div className={styles.root}>
      <div className={`${styles.content} ${active ? styles.locked : ''}`}>{children}</div>
      {active ? (
        <div className={styles.overlay}>
          <div className={styles.panel}>
            <div className={styles.eyebrow}>
              <Lock size={14} />
              인증 필요
            </div>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.description}>{description}</p>
            <div className={styles.actions}>
              <Link href="/login" className={styles.primary}>로그인</Link>
              <Link href="/signup" className={styles.secondary}>회원가입</Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
