'use client';

import React from 'react';
import styles from './Messages.module.css';
import { MessageSquareDashed } from 'lucide-react';

export default function MessagesPage() {
  return (
    <div className={styles.messagesLayout} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <div className={styles.emptyState} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#64748B' }}>
        <MessageSquareDashed size={64} style={{ marginBottom: '16px', color: '#CBD5E1' }} />
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '8px' }}>메시지 기능 준비 중</h2>
        <p>DM 및 그룹 채팅 기능은 현재 열심히 준비하고 있습니다!</p>
      </div>
    </div>
  );
}
