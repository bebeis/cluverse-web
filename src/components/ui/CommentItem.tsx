import React, { useState } from 'react';
import styles from './CommentItem.module.css';
import { Avatar } from './Avatar';
import { Badge } from './Badge';
import { Heart } from 'lucide-react';
export interface CommentItemProps {
  authorNickname: string;
  schoolName: string;
  timeAgo: string;
  content: string;
  likes: number;
  subCommentsCount?: number;
  isAnonymous?: boolean;
  isAuthor?: boolean; // Is it the author of the post?
  children?: React.ReactNode;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  authorNickname,
  schoolName,
  timeAgo,
  content,
  likes,
  subCommentsCount = 0,
  isAnonymous = false,
  isAuthor = false,
  children,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className={styles.commentContainer}>
      <div className={styles.avatarWrapper}>
        <Avatar fallback={authorNickname} size="small" isAnonymous={isAnonymous} />
      </div>
      
      <div className={styles.contentWrapper}>
        <div className={styles.header}>
          <div className={styles.authorInfo}>
            <span className={styles.authorName}>{isAnonymous ? '익명' : authorNickname}</span>
            {!isAnonymous && <span className={styles.schoolName}>{schoolName}</span>}
            {isAuthor && <Badge variant="status" label="작성자" />}
          </div>
        </div>
        
        <p className={styles.content}>{content}</p>
        
        <div className={styles.footer}>
          <span className={styles.time}>{timeAgo}</span>
          <button className={styles.actionBtn} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Heart size={12} /> 좋아요 {likes}
          </button>
          <button className={styles.actionBtn}>답글 달기</button>
        </div>
        
        {subCommentsCount > 0 && !children && (
          <button className={styles.loadMoreBtn}>
            ㅡ 답글 {subCommentsCount}개 더보기
          </button>
        )}
        
        {children && (
          <div className={styles.childrenContainer}>
            {children}
          </div>
        )}
      </div>
    </div>
  );
};
