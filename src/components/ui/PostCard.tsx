'use client';

import React from 'react';
import styles from './PostCard.module.css';
import { Badge } from './Badge';
import { Eye, Heart, MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
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
  id?: number | string;
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
  id,
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (id) {
      router.push(`/post/${id}`);
    }
  };

  return (
    <article 
      className={styles.card} 
      onClick={handleClick}
      style={{ cursor: id ? 'pointer' : 'default' }}
    >
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
          <span className={styles.statItem}><Eye size={14} /> {views}</span>
          <span className={styles.statItem}><Heart size={14} /> {likes}</span>
          <span className={styles.statItem}><MessageSquare size={14} /> {comments}</span>
        </div>
      </div>
    </article>
  );
};
