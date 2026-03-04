'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import { BottomNav } from '@/components/ui/BottomNav';
import styles from './layout.module.css';

export default function GroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.mainWrapper}>
        {children}
      </main>

      <div className="lg:hidden">
        <BottomNav activeTab="group" onTabChange={() => {}} />
      </div>
    </div>
  );
}
