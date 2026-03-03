import React from 'react';
import styles from './Avatar.module.css';

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback: string;
  size?: 'small' | 'medium' | 'large';
  isAnonymous?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'User avatar',
  fallback,
  size = 'medium',
  isAnonymous = false,
}) => {
  const displayFallback = isAnonymous ? '익명' : fallback.substring(0, 2).toUpperCase();
  const baseClass = `${styles.avatar} ${styles[size]} ${isAnonymous ? styles.anonymous : ''}`;

  return (
    <div className={baseClass}>
      {src && !isAnonymous ? (
        <img src={src} alt={alt} className={styles.image} />
      ) : (
        <span className={styles.fallback}>{displayFallback}</span>
      )}
    </div>
  );
};
