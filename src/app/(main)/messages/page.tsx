'use client';

import React, { useState } from 'react';
import styles from './Messages.module.css';
import { Search, Send, MessageSquareDashed, MoreVertical, Phone, Video, Info } from 'lucide-react';

const mockChats = [
  {
    id: 1,
    name: '김개발',
    lastMessage: '네, 프론트엔드 파트 맡겠습니다.',
    time: '오후 2:30',
    unread: 2,
    avatarColor: '#818CF8',
    isOnline: true,
  },
  {
    id: 2,
    name: '멋사 해커톤 팀',
    lastMessage: '오늘 저녁 8시에 게더타운에서 회의 가능하신가요?',
    time: '오전 11:15',
    unread: 0,
    avatarColor: '#F472B6',
    isOnline: false,
  },
  {
    id: 3,
    name: '알고리즘 스터디',
    lastMessage: '이번 주차 백준 문제 리스트 공유드립니다.',
    time: '어제',
    unread: 0,
    avatarColor: '#34D399',
    isOnline: true,
  },
  {
    id: 4,
    name: '대학원가지마',
    lastMessage: '감사합니다! 다음에 또 질문 드릴게요.',
    time: '월요일',
    unread: 0,
    avatarColor: '#A78BFA',
    isOnline: false,
  },
];

export default function MessagesPage() {
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [inputText, setInputText] = useState('');

  const chat = mockChats.find((c) => c.id === activeChat);

  const handleSend = () => {
    if (!inputText.trim()) return;
    alert('메시지 전송 기능은 준비 중입니다.');
    setInputText('');
  };

  return (
    <div className={styles.messagesLayout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h1 className={styles.headerTitle}>메시지</h1>
        </div>
        <div className={styles.searchBox}>
          <Search size={16} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="이름, 내용 검색" 
            className={styles.searchInput}
          />
        </div>
        <div className={styles.chatList}>
          {mockChats.map((c) => (
            <div 
              key={c.id} 
              className={c.id === activeChat ? styles.chatItemActive : styles.chatItem}
              onClick={() => setActiveChat(c.id)}
            >
              <div className={styles.avatar} style={{ backgroundColor: c.avatarColor }}>
                {c.name.charAt(0)}
              </div>
              <div className={styles.chatInfo}>
                <div className={styles.chatHeader}>
                  <span className={styles.chatName}>{c.name}</span>
                  <span className={styles.chatTime}>{c.time}</span>
                </div>
                <div className={styles.chatPreview}>{c.lastMessage}</div>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={styles.mainPane}>
        {!activeChat || !chat ? (
          <div className={styles.emptyState}>
            <MessageSquareDashed size={64} className={styles.emptyIcon} />
            <div className={styles.emptyText}>채팅방을 선택해주세요.</div>
          </div>
        ) : (
          <>
            <div className={styles.chatDetailHeader}>
              <div className={styles.detailHeaderLeft}>
                <div className={styles.avatar} style={{ backgroundColor: chat.avatarColor }}>
                  {chat.name.charAt(0)}
                </div>
                <div>
                  <div className={styles.detailTitle}>{chat.name}</div>
                  <div className={styles.detailSubtitle}>
                    {chat.isOnline ? '현재 활동 중' : '오프라인'}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px', color: '#64748B' }}>
                <Phone size={20} style={{ cursor: 'pointer' }} onClick={() => alert('음성 통화 기능은 준비 중입니다.')} />
                <Video size={20} style={{ cursor: 'pointer' }} onClick={() => alert('영상 통화 기능은 준비 중입니다.')} />
                <MoreVertical size={20} style={{ cursor: 'pointer' }} />
              </div>
            </div>
            
            <div className={styles.messageArea}>
              <div className={styles.messageReceivedInfo}>
                <div className={`${styles.messageBubble} ${styles.messageReceived}`}>
                  안녕하세요! 저번에 올리신 글 보고 연락드렸습니다.
                </div>
                <div className={styles.messageTime}>오후 2:15</div>
              </div>
              
              <div className={styles.messageSentInfo}>
                <div className={`${styles.messageBubble} ${styles.messageSent}`}>
                  네 안녕하세요! 어떤 점이 궁금하신가요?
                </div>
                <div className={styles.messageTime}>오후 2:20</div>
              </div>

              <div className={styles.messageReceivedInfo}>
                <div className={`${styles.messageBubble} ${styles.messageReceived}`}>
                  {chat.lastMessage}
                </div>
                <div className={styles.messageTime}>{chat.time}</div>
              </div>
            </div>

            <div className={styles.messageInputArea}>
              <div className={styles.inputWrapper}>
                <input 
                  type="text" 
                  placeholder="메시지를 입력하세요..." 
                  className={styles.messageInput}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSend();
                  }}
                />
                <button className={styles.sendBtn} onClick={handleSend}>
                  <Send size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
