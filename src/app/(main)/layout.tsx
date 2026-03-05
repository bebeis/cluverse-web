'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import LeftAside from '@/components/layout/LeftAside';
import RightAside from '@/components/layout/RightAside';
import { BottomNav } from '@/components/ui/BottomNav';
import styles from './layout.module.css';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCalendarPage = pathname?.startsWith('/calendar');

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.mainWrapper}>
        <div className={styles.grid}>
          <div className={styles.leftColumn}>
            <LeftAside />
          </div>
          
          <div className={`${styles.centerColumn} ${isCalendarPage ? styles.centerColumnExpanded : ''}`}>
            {children}
          </div>
          
          {!isCalendarPage && (
            <div className={styles.rightColumn}>
              <RightAside />
            </div>
          )}
        </div>
      </main>

      <div className="lg:hidden">
        {/* Render responsive bottom navbar. Realistically this bottomNav should be position fixed in UI component */}
        <BottomNav />
      </div>
    </div>
  );
}
