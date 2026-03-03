import React from 'react';
import styles from './TopAppBar.module.css';

interface TopAppBarProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  title,
  showBack = false,
  onBack,
  rightAction
}) => {
  return (
    <header className={styles.topAppBar}>
      <div className={styles.left}>
        {showBack && (
          <button className={styles.iconBtn} onClick={onBack} aria-label="Go back">
            ←
          </button>
        )}
      </div>
      
      <h1 className={styles.title}>{title}</h1>
      
      <div className={styles.right}>
        {rightAction}
      </div>
    </header>
  );
};
