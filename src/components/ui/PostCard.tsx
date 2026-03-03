import React from 'react';
import styles from './PostCard.module.css';
import { Badge } from './Badge';

export interface PostCardProps {
  title: string;
  excerpt: string;
  authorNickname: string;
  schoolName: string;
  timeAgo: string;
  views: number;
  likes: number;
  comments: number;
  category: string;
  isAnonymous?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({
  title,
  excerpt,
  authorNickname,
  schoolName,
  timeAgo,
  views,
  likes,
  comments,
  category,
  isAnonymous = false,
}) => {
  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <Badge variant="interest" label={category} />
        <span className={styles.time}>{timeAgo}</span>
      </div>
      
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.excerpt}>{excerpt}</p>
      
      <div className={styles.footer}>
        <div className={styles.authorInfo}>
          {!isAnonymous && <Badge variant="school" label={schoolName} />}
          <span className={styles.author}>{isAnonymous ? '익명' : authorNickname}</span>
        </div>
        
        <div className={styles.stats}>
          <span className={styles.statItem}>👁 {views}</span>
          <span className={styles.statItem}>♥ {likes}</span>
          <span className={styles.statItem}>💬 {comments}</span>
        </div>
      </div>
    </article>
  );
};
