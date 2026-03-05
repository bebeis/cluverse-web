import React from 'react';
import styles from './Messages.module.css';
import { MessageSquareDashed } from 'lucide-react';

export default function MessagesPlaceholderPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <MessageSquareDashed size={48} strokeWidth={1.5} color="#64748B" />
        </div>
        <h1 className={styles.title}>채팅 기능 준비 중</h1>
        <p className={styles.description}>
          해당 기능은 다음 버전에 추가될 예정입니다.<br />
          조금만 기다려주세요!
        </p>
      </div>
    </div>
  );
}
