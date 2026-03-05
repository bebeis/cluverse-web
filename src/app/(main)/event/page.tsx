import React from 'react';
import styles from './Event.module.css';
import { CalendarDays, MapPin } from 'lucide-react';

const mockEvents = [
  {
    id: 1,
    title: '2024 통합 축제 라인업 안내 및 부스 배치도',
    host: '총학생회',
    date: '2024.11.05 - 11.07',
    location: '대운동장 및 잔디광장',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9LgkF6xirT-mqqGsr-bdm6wtRs7ilEtQK4WyIRICXDr6EfyuSDPuBYg8Cx6XRN1htEzo0fgJ7d8uaMehw1rM0PHK2xbt0UE4OO17RcbHpOgPccTeQbW_lhgHfBA69Y0M5kzTPy-vkn1BH1mZOBZ--tdGnKuCkqb7uSzaUuOR8VrRk15n6rcg2NTZwJd_UCjLz_qUGa0faW_Nu15nZsR35kt_O7a6HKbk1i50GDGuNcJqOnHM0wxAVyGk5Fkv8iVcY2ScZdgV-JSlx',
    isOngoing: true,
  },
  {
    id: 2,
    title: '글로벌 교환학생 모집 (2025학년도 1학기 파견)',
    host: '국제교류원',
    date: '2024.10.15 - 10.30',
    location: '본관 1층 제출처',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaJqFw-9pC8_L99Bf1u_vM_A3YvB_GjM9rZyV3o58A8W5m8_h5E3YcTf_o2F07GgN4d6C52N6OaJ8VzR-bKw5D6jAExbZ_-4tX7dE2n9u4ZzZtO8WJ35A03Wl4i8_6rW3W9yUqZ5Z6hA5o6g4A0tHhV6J5bC4uV9iK2E1D2iVn7lKp7C7Z9d5rZq7j9o5L5h-zE-56mH5A_2w',
    isOngoing: true,
  }
];

export default function EventPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTitles}>
          <h1 className={styles.title}>캠퍼스 이벤트</h1>
          <p className={styles.subtitle}>학교 행사 및 주요 일정을 확인하세요.</p>
        </div>
      </header>

      <div className={styles.eventList}>
        {mockEvents.map((event) => (
          <div key={event.id} className={styles.eventCard}>
            <div className={styles.imageWrapper}>
              {/* Fallback pattern background if image fails */}
              <div className={styles.imageFallback}></div>
              {event.isOngoing && <div className={styles.badge}>진행중</div>}
            </div>
            
            <div className={styles.content}>
              <div className={styles.host}>{event.host}</div>
              <h2 className={styles.eventTitle}>{event.title}</h2>
              
              <div className={styles.metaRow}>
                <div className={styles.metaItem}>
                  <CalendarDays size={14} />
                  <span>{event.date}</span>
                </div>
                <div className={styles.metaItem}>
                  <MapPin size={14} />
                  <span>{event.location}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
