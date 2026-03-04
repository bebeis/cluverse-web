'use client';

import React, { useState } from 'react';
import styles from './Notifications.module.css';
import {
  MessageSquare, CheckCircle, Megaphone,
  UserPlus, FileText, XCircle,
  Settings2, CheckCheck, ChevronDown, X,
  Bell, BellOff, Mail, Users,
} from 'lucide-react';

type Tab = 'all' | 'comments' | 'groups' | 'announcements' | 'follows';

interface Notification {
  id: number;
  type: 'comment' | 'approve' | 'announce' | 'follow' | 'post' | 'reject';
  title: string;
  desc: string;
  quote?: string;
  rejectReason?: string;
  time: string;
  read: boolean;
  actions?: { label: string; primary?: boolean }[];
  tab: Tab[];
}

const notifications: Notification[] = [
  {
    id: 1,
    type: 'comment',
    title: '새 댓글',
    desc: '김철수님이 회원님의 게시글에 새로운 댓글을 남겼습니다.',
    quote: '"정말 유용한 정보네요! 저도 이 그룹에 참여하고 싶습니다. 방법이..."',
    time: '2분 전',
    read: false,
    tab: ['all', 'comments'],
  },
  {
    id: 2,
    type: 'approve',
    title: '지원 승인',
    desc: "'코딩 스터디' 그룹 지원이 승인되었습니다. 환영합니다!",
    time: '15분 전',
    read: false,
    actions: [{ label: '그룹으로 이동', primary: true }],
    tab: ['all', 'groups'],
  },
  {
    id: 3,
    type: 'announce',
    title: '그룹 공지',
    desc: "'사진 동호회'의 새로운 공지사항이 등록되었습니다.",
    quote: '이번 주 주말 출사 장소가 변경되었습니다. 확인 부탁드립니다.',
    time: '1시간 전',
    read: false,
    tab: ['all', 'announcements'],
  },
  {
    id: 4,
    type: 'follow',
    title: '새 팔로워',
    desc: '이영희님이 회원님을 팔로우하기 시작했습니다.',
    time: '2시간 전',
    read: true,
    actions: [{ label: '맞팔로우', primary: true }, { label: '프로필 보기' }],
    tab: ['all', 'follows'],
  },
  {
    id: 5,
    type: 'comment',
    title: '대댓글',
    desc: '박지민님이 대댓글을 남겼습니다.',
    quote: '"동감합니다. 다음 모임 때 뵙겠습니다!"',
    time: '3시간 전',
    read: true,
    tab: ['all', 'comments'],
  },
  {
    id: 6,
    type: 'post',
    title: '새 게시글',
    desc: '팔로우 중인 사용자가 새 글을 올렸습니다.',
    time: '3시간 전',
    read: true,
    tab: ['all', 'follows'],
  },
  {
    id: 7,
    type: 'reject',
    title: '지원 거절',
    desc: "'고급 알고리즘' 그룹 가입이 거절되었습니다.",
    rejectReason: '사유: 현재 인원 모집이 마감되었습니다.',
    time: '3일 전',
    read: true,
    tab: ['all', 'groups'],
  },
  {
    id: 8,
    type: 'post',
    title: '새 게시글',
    desc: '팔로우 중인 사용자가 새 글을 올렸습니다.',
    time: '5시간 전',
    read: true,
    tab: ['all', 'follows'],
  },
];

const tabs: { key: Tab; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'comments', label: '댓글/답글' },
  { key: 'groups', label: '그룹 지원' },
  { key: 'announcements', label: '그룹 공지' },
  { key: 'follows', label: '팔로우' },
];

const settingsItems = [
  { id: 'comments', icon: 'comment', title: '댓글/답글 알림', desc: '내 글에 달린 반응', defaultOn: true },
  { id: 'groups', icon: 'group', title: '그룹 지원 결과', desc: '승인 및 거절 상태', defaultOn: true },
  { id: 'announcements', icon: 'announce', title: '그룹 공지사항', desc: '중요 공지 푸시', defaultOn: true },
  { id: 'follows', icon: 'follow', title: '새 팔로워 알림', desc: '누가 나를 팔로우했는지', defaultOn: false },
  { id: 'marketing', icon: 'marketing', title: '마케팅 정보 수신', desc: '이벤트 및 프로모션', defaultOn: false },
];

function getNotifIcon(type: string) {
  switch (type) {
    case 'comment': return <MessageSquare size={20} />;
    case 'approve': return <CheckCircle size={20} />;
    case 'announce': return <Megaphone size={20} />;
    case 'follow': return <UserPlus size={20} />;
    case 'post': return <FileText size={20} />;
    case 'reject': return <XCircle size={20} />;
    default: return <Bell size={20} />;
  }
}

function getNotifIconClass(type: string) {
  switch (type) {
    case 'comment': return styles.notifIconComment;
    case 'approve': return styles.notifIconApprove;
    case 'announce': return styles.notifIconAnnounce;
    case 'follow': return styles.notifIconFollow;
    case 'post': return styles.notifIconPost;
    case 'reject': return styles.notifIconReject;
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

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [showSettings, setShowSettings] = useState(false);
  const [readIds, setReadIds] = useState<Set<number>>(() => {
    const s = new Set<number>();
    notifications.filter(n => n.read).forEach(n => s.add(n.id));
    return s;
  });
  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>(() => {
    const s: Record<string, boolean> = {};
    settingsItems.forEach(item => { s[item.id] = item.defaultOn; });
    return s;
  });

  const filtered = notifications.filter(n => n.tab.includes(activeTab));

  const markAllRead = () => {
    const all = new Set<number>();
    notifications.forEach(n => all.add(n.id));
    setReadIds(all);
  };

  const toggleRead = (id: number) => {
    setReadIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSetting = (id: string) => {
    setToggleStates(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const resetSettings = () => {
    const s: Record<string, boolean> = {};
    settingsItems.forEach(item => { s[item.id] = item.defaultOn; });
    setToggleStates(s);
  };

  return (
    <>
      {/* Page header */}
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

      {/* Tabs */}
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

      {/* Mark all read */}
      <div className={styles.markAllRow}>
        <button className={styles.markAllBtn} onClick={markAllRead}>
          <CheckCheck size={16} />
          모두 읽음으로 표시
        </button>
      </div>

      {/* Notification list */}
      {filtered.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}><BellOff size={28} /></div>
          <div className={styles.emptyTitle}>알림이 없습니다</div>
          <div className={styles.emptyDesc}>새로운 활동이 있으면 여기에 표시됩니다.</div>
        </div>
      ) : (
        <div className={styles.notifList}>
          {filtered.map(n => {
            const isRead = readIds.has(n.id);
            const cardClass = n.type === 'reject'
              ? styles.notifCardRejected
              : isRead ? styles.notifCard : styles.notifCardUnread;

            return (
              <div key={n.id} className={cardClass}>
                <div className={`${styles.notifIcon} ${getNotifIconClass(n.type)}`}>
                  {getNotifIcon(n.type)}
                </div>
                <div className={styles.notifBody}>
                  <div className={styles.notifTitleRow}>
                    <span className={styles.notifTitle}>{n.title}</span>
                    {!isRead && <span className={styles.notifUnreadDot} />}
                  </div>
                  <p className={styles.notifDesc}>{n.desc}</p>
                  {n.quote && <div className={styles.notifQuote}>{n.quote}</div>}
                  {n.rejectReason && <div className={styles.notifRejectReason}>{n.rejectReason}</div>}
                  {n.actions && (
                    <div className={styles.notifActions}>
                      {n.actions.map(a => (
                        <button
                          key={a.label}
                          className={a.primary ? styles.notifActionPrimary : styles.notifActionSecondary}
                        >
                          {a.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className={styles.notifMeta}>
                  <span className={styles.notifTime}>{n.time}</span>
                  <button
                    className={isRead ? styles.notifReadBtnDone : styles.notifReadBtn}
                    onClick={(e) => { e.stopPropagation(); toggleRead(n.id); }}
                    title={isRead ? '읽지 않음으로 표시' : '읽음으로 표시'}
                  >
                    <CheckCircle size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Load more */}
      <div className={styles.loadMore}>
        <button className={styles.loadMoreBtn}>
          이전 알림 더보기
          <ChevronDown size={16} />
        </button>
      </div>

      {/* Settings Panel */}
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
                    className={`${styles.toggle} ${toggleStates[item.id] ? styles.toggleOn : ''}`}
                    onClick={() => toggleSetting(item.id)}
                  >
                    <div className={`${styles.toggleKnob} ${toggleStates[item.id] ? styles.toggleKnobOn : ''}`} />
                  </button>
                </div>
              ))}
            </div>

            <div className={styles.settingsReset}>
              <button className={styles.settingsResetBtn} onClick={resetSettings}>
                설정을 기본값으로 되돌리기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
