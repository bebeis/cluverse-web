'use client';

import React, { useState } from 'react';
import styles from './SettingsPage.module.css';
import {
  Settings, Globe, Shield, Bell,
  Database, Palette, Save, AlertTriangle,
  Server, Clock, Trash2,
} from 'lucide-react';

const sections = [
  { id: 'general', icon: <Settings size={16} />, label: '일반 설정' },
  { id: 'auth', icon: <Shield size={16} />, label: '인증 정책' },
  { id: 'moderation', icon: <AlertTriangle size={16} />, label: '모더레이션' },
  { id: 'notification', icon: <Bell size={16} />, label: '알림 설정' },
  { id: 'system', icon: <Server size={16} />, label: '시스템' },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('general');
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    maintenance: false,
    emailVerify: true,
    altAuth: true,
    autoModeration: true,
    profanityFilter: true,
    imageModeration: false,
    emailNotif: true,
    pushNotif: true,
    adminAlert: true,
  });

  const toggle = (key: string) => setToggles(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>시스템 설정</h1>
          <p className={styles.pageSubtitle}>서비스 전반의 설정과 정책을 관리합니다.</p>
        </div>
        <button className={styles.saveBtn}>
          <Save size={16} /> 변경사항 저장
        </button>
      </div>

      <div className={styles.layout}>
        {/* Left Nav */}
        <nav className={styles.sectionNav}>
          {sections.map(s => (
            <button
              key={s.id}
              className={activeSection === s.id ? styles.sectionNavItemActive : styles.sectionNavItem}
              onClick={() => setActiveSection(s.id)}
            >
              {s.icon} {s.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className={styles.content}>
          {/* System Status */}
          <div className={styles.statusRow}>
            <div className={styles.statusDot} />
            <span className={styles.statusText}>시스템 정상 운영중</span>
            <span className={styles.statusTime}>
              <Clock size={12} style={{ display: 'inline', verticalAlign: -1 }} /> 마지막 점검: 2026-02-25 03:00
            </span>
          </div>

          {/* General */}
          <div className={styles.card} id="general">
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}><Globe size={18} /> 일반 설정</h2>
              <p className={styles.cardSubtitle}>서비스 기본 정보와 운영 모드를 설정합니다.</p>
            </div>

            <div className={styles.fieldGroup}>
              <div className={styles.fieldLabel}>서비스명</div>
              <input className={styles.fieldInput} defaultValue="Cluverse" />
            </div>

            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <div className={styles.fieldLabel}>서비스 URL</div>
                <input className={styles.fieldInput} defaultValue="https://cluverse.com" />
              </div>
              <div className={styles.fieldGroup}>
                <div className={styles.fieldLabel}>관리자 이메일</div>
                <input className={styles.fieldInput} defaultValue="admin@cluverse.com" />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <div className={styles.fieldLabel}>서비스 설명</div>
              <textarea
                className={styles.fieldTextarea}
                defaultValue="대학생을 위한 학과 기반 커뮤니티 플랫폼"
              />
            </div>

            <div className={styles.toggleRow}>
              <div className={styles.toggleInfo}>
                <div className={styles.toggleLabel}>점검 모드</div>
                <div className={styles.toggleDesc}>활성화 시 일반 유저 접근이 차단됩니다.</div>
              </div>
              <div
                className={toggles.maintenance ? styles.toggleActive : styles.toggle}
                onClick={() => toggle('maintenance')}
              >
                <div className={styles.toggleDot} />
              </div>
            </div>
          </div>

          {/* Auth Policy */}
          <div className={styles.card} id="auth">
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}><Shield size={18} /> 인증 정책</h2>
              <p className={styles.cardSubtitle}>학생 인증 및 가입 관련 정책을 설정합니다.</p>
            </div>

            <div className={styles.toggleRow}>
              <div className={styles.toggleInfo}>
                <div className={styles.toggleLabel}>학교 이메일 인증</div>
                <div className={styles.toggleDesc}>도메인 allowlist 기반 이메일 인증을 사용합니다.</div>
              </div>
              <div
                className={toggles.emailVerify ? styles.toggleActive : styles.toggle}
                onClick={() => toggle('emailVerify')}
              >
                <div className={styles.toggleDot} />
              </div>
            </div>

            <div className={styles.toggleRow}>
              <div className={styles.toggleInfo}>
                <div className={styles.toggleLabel}>대체 인증 (학생증/재학증명서)</div>
                <div className={styles.toggleDesc}>수동 검수 방식의 대체 인증을 허용합니다.</div>
              </div>
              <div
                className={toggles.altAuth ? styles.toggleActive : styles.toggle}
                onClick={() => toggle('altAuth')}
              >
                <div className={styles.toggleDot} />
              </div>
            </div>

            <div className={styles.fieldGroup} style={{ marginTop: 16 }}>
              <div className={styles.fieldLabel}>미인증 유저 권한</div>
              <select className={styles.selectInput}>
                <option>읽기/검색만 허용 (기본값)</option>
                <option>읽기만 허용</option>
                <option>완전 차단</option>
              </select>
            </div>

            <div className={styles.fieldGroup}>
              <div className={styles.fieldLabel}>인증 만료 기간</div>
              <div className={styles.fieldHint}>설정된 기간 후 재인증을 요청합니다.</div>
              <select className={styles.selectInput}>
                <option>1년 (기본값)</option>
                <option>6개월</option>
                <option>2년</option>
                <option>만료 없음</option>
              </select>
            </div>
          </div>

          {/* Moderation */}
          <div className={styles.card} id="moderation">
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}><AlertTriangle size={18} /> 모더레이션 설정</h2>
              <p className={styles.cardSubtitle}>자동 필터링과 신고 처리 규칙을 설정합니다.</p>
            </div>

            <div className={styles.toggleRow}>
              <div className={styles.toggleInfo}>
                <div className={styles.toggleLabel}>자동 모더레이션</div>
                <div className={styles.toggleDesc}>AI 기반 콘텐츠 자동 분류 및 필터링</div>
              </div>
              <div
                className={toggles.autoModeration ? styles.toggleActive : styles.toggle}
                onClick={() => toggle('autoModeration')}
              >
                <div className={styles.toggleDot} />
              </div>
            </div>

            <div className={styles.toggleRow}>
              <div className={styles.toggleInfo}>
                <div className={styles.toggleLabel}>비속어 필터</div>
                <div className={styles.toggleDesc}>등록된 비속어 사전 기반 자동 마스킹</div>
              </div>
              <div
                className={toggles.profanityFilter ? styles.toggleActive : styles.toggle}
                onClick={() => toggle('profanityFilter')}
              >
                <div className={styles.toggleDot} />
              </div>
            </div>

            <div className={styles.toggleRow}>
              <div className={styles.toggleInfo}>
                <div className={styles.toggleLabel}>이미지 모더레이션</div>
                <div className={styles.toggleDesc}>부적절한 이미지 자동 감지 및 블라인드 처리</div>
              </div>
              <div
                className={toggles.imageModeration ? styles.toggleActive : styles.toggle}
                onClick={() => toggle('imageModeration')}
              >
                <div className={styles.toggleDot} />
              </div>
            </div>

            <div className={styles.fieldRow} style={{ marginTop: 16 }}>
              <div className={styles.fieldGroup}>
                <div className={styles.fieldLabel}>자동 블라인드 임계값</div>
                <div className={styles.fieldHint}>신고 N건 이상 시 자동 숨김</div>
                <select className={styles.selectInput}>
                  <option>3건 (기본값)</option>
                  <option>5건</option>
                  <option>10건</option>
                </select>
              </div>
              <div className={styles.fieldGroup}>
                <div className={styles.fieldLabel}>가중 처벌 기준</div>
                <div className={styles.fieldHint}>최근 N개월 내 재위반 시 가중</div>
                <select className={styles.selectInput}>
                  <option>6개월 (기본값)</option>
                  <option>3개월</option>
                  <option>12개월</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notification */}
          <div className={styles.card} id="notification">
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}><Bell size={18} /> 알림 설정</h2>
              <p className={styles.cardSubtitle}>시스템 알림 채널과 관리자 알림을 설정합니다.</p>
            </div>

            <div className={styles.toggleRow}>
              <div className={styles.toggleInfo}>
                <div className={styles.toggleLabel}>이메일 알림</div>
                <div className={styles.toggleDesc}>유저에게 이메일 알림을 발송합니다.</div>
              </div>
              <div
                className={toggles.emailNotif ? styles.toggleActive : styles.toggle}
                onClick={() => toggle('emailNotif')}
              >
                <div className={styles.toggleDot} />
              </div>
            </div>

            <div className={styles.toggleRow}>
              <div className={styles.toggleInfo}>
                <div className={styles.toggleLabel}>푸시 알림</div>
                <div className={styles.toggleDesc}>모바일/웹 푸시 알림을 발송합니다.</div>
              </div>
              <div
                className={toggles.pushNotif ? styles.toggleActive : styles.toggle}
                onClick={() => toggle('pushNotif')}
              >
                <div className={styles.toggleDot} />
              </div>
            </div>

            <div className={styles.toggleRow}>
              <div className={styles.toggleInfo}>
                <div className={styles.toggleLabel}>관리자 긴급 알림</div>
                <div className={styles.toggleDesc}>높은 위험도 신고 접수 시 관리자에게 실시간 알림</div>
              </div>
              <div
                className={toggles.adminAlert ? styles.toggleActive : styles.toggle}
                onClick={() => toggle('adminAlert')}
              >
                <div className={styles.toggleDot} />
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className={styles.dangerCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle} style={{ color: '#EF4444' }}>
                <AlertTriangle size={18} /> 위험 설정
              </h2>
              <p className={styles.cardSubtitle}>되돌릴 수 없는 작업이 포함되어 있습니다.</p>
            </div>

            <div className={styles.toggleRow}>
              <div className={styles.toggleInfo}>
                <div className={styles.toggleLabel}>전체 데이터 내보내기</div>
                <div className={styles.toggleDesc}>모든 유저/게시글/그룹 데이터를 CSV로 내보냅니다.</div>
              </div>
              <button className={styles.dangerBtn}>
                <Database size={14} /> 내보내기
              </button>
            </div>

            <div className={styles.toggleRow}>
              <div className={styles.toggleInfo}>
                <div className={styles.toggleLabel}>캐시 전체 초기화</div>
                <div className={styles.toggleDesc}>서버 캐시를 모두 삭제하고 재생성합니다.</div>
              </div>
              <button className={styles.dangerBtn}>
                <Trash2 size={14} /> 초기화
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
