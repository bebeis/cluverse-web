'use client';

import React, { useState, useEffect, useCallback } from 'react';
import styles from './Notifications.module.css';
import {
  MessageSquare, CheckCircle, Megaphone,
  UserPlus, FileText, XCircle,
  Settings2, CheckCheck, ChevronDown, X,
  Bell, BellOff, Mail, Users,
} from 'lucide-react';
import { cluverseApi, Notification, NotificationPreferences } from '@/lib/cluverse-api';

type Tab = 'all' | 'comments' | 'groups' | 'announcements' | 'follows';

const tabs: { key: Tab; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'comments', label: '댓글/답글' },
  { key: 'groups', label: '그룹 지원' },
  { key: 'announcements', label: '그룹 공지' },
  { key: 'follows', label: '팔로우' },
];

const typeToTab: Record<string, Tab[]> = {
  COMMENT: ['all', 'comments'],
  REPLY: ['all', 'comments'],
  GROUP_APPROVED: ['all', 'groups'],
  GROUP_REJECTED: ['all', 'groups'],
  ANNOUNCEMENT: ['all', 'announcements'],
  FOLLOW: ['all', 'follows'],
  POST: ['all', 'follows'],
};

function notifTabs(type: string): Tab[] {
  return typeToTab[type] ?? ['all'];
}

const settingsItems = [
  { id: 'comments' as keyof NotificationPreferences, icon: 'comment', title: '댓글/답글 알림', desc: '내 글에 달린 반응' },
  { id: 'groupNotifications' as keyof NotificationPreferences, icon: 'group', title: '그룹 지원 결과', desc: '승인 및 거절 상태' },
  { id: 'announcements' as keyof NotificationPreferences, icon: 'announce', title: '그룹 공지사항', desc: '중요 공지 푸시' },
  { id: 'follows' as keyof NotificationPreferences, icon: 'follow', title: '새 팔로워 알림', desc: '누가 나를 팔로우했는지' },
  { id: 'marketing' as keyof NotificationPreferences, icon: 'marketing', title: '마케팅 정보 수신', desc: '이벤트 및 프로모션' },
];

function getNotifIcon(type: string) {
  switch (type) {
    case 'COMMENT':
    case 'REPLY': return <MessageSquare size={20} />;
    case 'GROUP_APPROVED': return <CheckCircle size={20} />;
    case 'ANNOUNCEMENT': return <Megaphone size={20} />;
    case 'FOLLOW': return <UserPlus size={20} />;
    case 'POST': return <FileText size={20} />;
    case 'GROUP_REJECTED': return <XCircle size={20} />;
    default: return <Bell size={20} />;
  }
}

function getNotifIconClass(type: string) {
  switch (type) {
    case 'COMMENT':
    case 'REPLY': return styles.notifIconComment;
    case 'GROUP_APPROVED': return styles.notifIconApprove;
    case 'ANNOUNCEMENT': return styles.notifIconAnnounce;
    case 'FOLLOW': return styles.notifIconFollow;
    case 'POST': return styles.notifIconPost;
    case 'GROUP_REJECTED': return styles.notifIconReject;
    default: return styles.notifIconComment;
  }
}

function getSettingsIconClass(icon: string) {
  switch (icon) {
    case 'comment': return styles.settingsItemIconComment;
    case 'group': return styles.settingsItemIconGroup;
    case 'announce': return styles.settingsItemIconAnnounce;
    case 'follow': return styles.settingsItemIconFollow;
    case 'marketing': return styles.settingsItemIconMarketing;
    default: return styles.settingsItemIconComment;
  }
}

function getSettingsIcon(icon: string) {
  switch (icon) {
    case 'comment': return <MessageSquare size={18} />;
    case 'group': return <Users size={18} />;
    case 'announce': return <Megaphone size={18} />;
    case 'follow': return <UserPlus size={18} />;
    case 'marketing': return <Mail size={18} />;
    default: return <Bell size={18} />;
  }
}

function formatTime(createdAt: string) {
  const diff = Date.now() - new Date(createdAt).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  return `${days}일 전`;
}

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [showSettings, setShowSettings] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [prefs, setPrefs] = useState<NotificationPreferences>({
    comments: true,
    groupNotifications: true,
    announcements: true,
    follows: false,
    marketing: false,
  });
  const [hasNext, setHasNext] = useState(false);
  const [page, setPage] = useState(1);

  const loadNotifications = useCallback((p = 1) => {
    cluverseApi.getNotifications({ page: p, size: 20 })
      .then(data => {
        setNotifications(prev => p === 1 ? (data?.notifications ?? []) : [...prev, ...(data?.notifications ?? [])]);
        setHasNext(data.hasNext);
        setPage(p);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadNotifications(1);
    cluverseApi.getNotificationPreferences()
      .then(setPrefs)
      .catch(() => {});
  }, [loadNotifications]);

  const filtered = notifications.filter(n => notifTabs(n.type).includes(activeTab));

  const markAllRead = () => {
    cluverseApi.markAllNotificationsRead()
      .then(() => setNotifications(prev => prev.map(n => ({ ...n, isRead: true }))))
      .catch(() => {});
  };

  const toggleRead = (notif: Notification) => {
    if (!notif.isRead) {
      cluverseApi.markNotificationRead(notif.notificationId)
        .then(() => setNotifications(prev =>
          prev.map(n => n.notificationId === notif.notificationId ? { ...n, isRead: true } : n),
        ))
        .catch(() => {});
    } else {
      setNotifications(prev =>
        prev.map(n => n.notificationId === notif.notificationId ? { ...n, isRead: false } : n),
      );
    }
  };

  const toggleSetting = (id: keyof NotificationPreferences) => {
    const updated = { ...prefs, [id]: !prefs[id] };
    setPrefs(updated);
    cluverseApi.updateNotificationPreferences(updated).catch(() => {});
  };

  return (
    <>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <h1 className={styles.pageTitle}>알림 센터</h1>
          <p className={styles.pageSubtitle}>새로운 소식과 활동 내역을 확인하세요.</p>
        </div>
        <button className={styles.settingsBtn} onClick={() => setShowSettings(true)}>
          <Settings2 size={16} />
          알림 설정
        </button>
      </div>

      <div className={styles.tabs}>
        {tabs.map(t => (
          <button
            key={t.key}
            className={activeTab === t.key ? styles.tabBtnActive : styles.tabBtn}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className={styles.markAllRow}>
        <button className={styles.markAllBtn} onClick={markAllRead}>
          <CheckCheck size={16} />
          모두 읽음으로 표시
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}><BellOff size={28} /></div>
          <div className={styles.emptyTitle}>알림이 없습니다</div>
          <div className={styles.emptyDesc}>새로운 활동이 있으면 여기에 표시됩니다.</div>
        </div>
      ) : (
        <div className={styles.notifList}>
          {filtered.map(n => {
            const isRejected = n.type === 'GROUP_REJECTED';
            const cardClass = isRejected
              ? styles.notifCardRejected
              : n.isRead ? styles.notifCard : styles.notifCardUnread;

            return (
              <div key={n.notificationId} className={cardClass}>
                <div className={`${styles.notifIcon} ${getNotifIconClass(n.type)}`}>
                  {getNotifIcon(n.type)}
                </div>
                <div className={styles.notifBody}>
                  <div className={styles.notifTitleRow}>
                    <span className={styles.notifTitle}>{n.title}</span>
                    {!n.isRead && <span className={styles.notifUnreadDot} />}
                  </div>
                  <p className={styles.notifDesc}>{n.content}</p>
                  {n.excerpt && <div className={styles.notifQuote}>{n.excerpt}</div>}
                </div>
                <div className={styles.notifMeta}>
                  <span className={styles.notifTime}>{formatTime(n.createdAt)}</span>
                  <button
                    className={n.isRead ? styles.notifReadBtnDone : styles.notifReadBtn}
                    onClick={(e) => { e.stopPropagation(); toggleRead(n); }}
                    title={n.isRead ? '읽지 않음으로 표시' : '읽음으로 표시'}
                  >
                    <CheckCircle size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {hasNext && (
        <div className={styles.loadMore}>
          <button className={styles.loadMoreBtn} onClick={() => loadNotifications(page + 1)}>
            이전 알림 더보기
            <ChevronDown size={16} />
          </button>
        </div>
      )}

      {showSettings && (
        <div className={styles.settingsOverlay} onClick={() => setShowSettings(false)}>
          <div className={styles.settingsPanel} onClick={e => e.stopPropagation()}>
            <div className={styles.settingsPanelHeader}>
              <div>
                <h2 className={styles.settingsPanelTitle}>알림 설정</h2>
                <p className={styles.settingsPanelSubtitle}>수신할 알림 유형을 선택하세요.</p>
              </div>
              <button className={styles.settingsCloseBtn} onClick={() => setShowSettings(false)}>
                <X size={18} />
              </button>
            </div>

            <div className={styles.settingsList}>
              {settingsItems.map(item => (
                <div key={item.id} className={styles.settingsItem}>
                  <div className={`${styles.settingsItemIcon} ${getSettingsIconClass(item.icon)}`}>
                    {getSettingsIcon(item.icon)}
                  </div>
                  <div className={styles.settingsItemInfo}>
                    <div className={styles.settingsItemTitle}>{item.title}</div>
                    <div className={styles.settingsItemDesc}>{item.desc}</div>
                  </div>
                  <button
                    className={`${styles.toggle} ${prefs[item.id] ? styles.toggleOn : ''}`}
                    onClick={() => toggleSetting(item.id)}
                  >
                    <div className={`${styles.toggleKnob} ${prefs[item.id] ? styles.toggleKnobOn : ''}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
