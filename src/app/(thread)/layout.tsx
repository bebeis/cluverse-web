'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import styles from './layout.module.css';

export default function ThreadLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.mainWrapper}>
        {children}
      </main>
    </div>
  );
}
