'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import LeftAside from '@/components/layout/LeftAside';
import RightAside from '@/components/layout/RightAside';
import { BottomNav } from '@/components/ui/BottomNav';
import styles from './layout.module.css';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  // Client component state could be used for bottom nav selection, but we'll manage it via page or global state in a real app.
  // For layout structure, we add it here.
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.mainWrapper}>
        <div className={styles.grid}>
          <div className={styles.leftColumn}>
            <LeftAside />
          </div>
          
          <div className={styles.centerColumn}>
            {children}
          </div>
          
          <div className={styles.rightColumn}>
            <RightAside />
          </div>
        </div>
      </main>

      <div className="lg:hidden">
        {/* Render responsive bottom navbar. Realistically this bottomNav should be position fixed in UI component */}
        <BottomNav activeTab="home" onTabChange={() => {}} />
      </div>
    </div>
  );
}
