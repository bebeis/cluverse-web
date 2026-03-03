import React from 'react';
import styles from './Badge.module.css';

interface BadgeProps {
  label: string;
  variant?: 'school' | 'major' | 'interest' | 'customRole' | 'status';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'interest', icon }) => {
  return (
    <span className={`${styles.badge} ${styles[variant]}`}>
      {icon && <span className={styles.icon}>{icon}</span>}
      {label}
    </span>
  );
};
