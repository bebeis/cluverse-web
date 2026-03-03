import React from 'react';
import styles from './GroupCard.module.css';
import { Badge } from './Badge';
import { Users } from 'lucide-react';
export interface GroupCardProps {
  title: string;
  description: string;
  category: string;
  tags: string[];
  visibility: 'PUBLIC' | 'PARTIAL' | 'PRIVATE';
  memberCount: number;
  imageUrl?: string;
}

export const GroupCard: React.FC<GroupCardProps> = ({
  title,
  description,
  category,
  tags,
  visibility,
  memberCount,
  imageUrl,
}) => {
  return (
    <article className={styles.card}>
      {imageUrl ? (
        <div className={styles.imageContainer}>
          <img src={imageUrl} alt={title} className={styles.image} />
        </div>
      ) : (
        <div className={styles.imagePlaceholder}>
          <span>{title.substring(0, 1)}</span>
        </div>
      )}
      
      <div className={styles.content}>
        <div className={styles.header}>
          <Badge variant="interest" label={category} />
          {visibility === 'PRIVATE' && <Badge variant="status" label="비공개" />}
        </div>
        
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        
        <div className={styles.tags}>
          {tags.map((tag, index) => (
            <span key={index} className={styles.tag}>#{tag}</span>
          ))}
        </div>
        
        <div className={styles.footer}>
          <span className={styles.memberCount} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Users size={14} /> {memberCount}명 참여중
          </span>
        </div>
      </div>
    </article>
  );
};
