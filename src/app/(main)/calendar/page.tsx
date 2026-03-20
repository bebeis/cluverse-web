'use client';

import React, { useState, useEffect } from 'react';
import styles from './Calendar.module.css';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { cluverseApi, CalendarEvent } from '@/lib/cluverse-api';

export default function CalendarPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [upcomingEvents, setUpcomingEvents] = useState<CalendarEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);

  const [form, setForm] = useState({
    title: '',
    category: '개인 일정',
    date: '',
    time: '',
    description: '',
    allDay: false,
    visibility: 'PRIVATE',
  });

  const days = ['일', '월', '화', '수', '목', '금', '토'];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthLabel = `${year}년 ${month + 1}월`;

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const categoryMap: Record<string, string> = {
    '개인 일정': 'PERSONAL',
    '동아리/모임': 'CLUB',
    '학교 행사': 'SCHOOL',
  };

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const [reloadTick, setReloadTick] = useState(0);

  useEffect(() => {
    const from = new Date(year, month, 1).toISOString().slice(0, 10);
    const to = new Date(year, month + 1, 0).toISOString().slice(0, 10);
    cluverseApi.getCalendarEvents({ from, to })
      .then(setCalendarEvents)
      .catch(() => setCalendarEvents([]));
    cluverseApi.getUpcomingCalendarEvents()
      .then(setUpcomingEvents)
      .catch(() => setUpcomingEvents([]));
  }, [year, month, reloadTick]);

  const getEventsForDay = (dayNum: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    return calendarEvents.filter(evt => evt.startAt.startsWith(dateStr));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.date) return;
    const startAt = form.allDay
      ? `${form.date}T00:00:00`
      : `${form.date}T${form.time || '00:00'}:00`;
    const endAt = form.allDay
      ? `${form.date}T23:59:59`
      : `${form.date}T${form.time || '00:00'}:00`;

    try {
      await cluverseApi.createCalendarEvent({
        title: form.title,
        description: form.description,
        category: categoryMap[form.category] ?? 'PERSONAL',
        startAt,
        endAt,
        allDay: form.allDay,
        visibility: form.visibility,
      });
      setIsModalOpen(false);
      setForm({ title: '', category: '개인 일정', date: '', time: '', description: '', allDay: false, visibility: 'PRIVATE' });
      setReloadTick(t => t + 1);
    } catch {
      console.warn('일정 추가 실패');
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.monthSelector}>
          <button className={styles.iconBtn} onClick={prevMonth}><ChevronLeft size={20} /></button>
          <h2 className={styles.monthTitle}>{monthLabel}</h2>
          <button className={styles.iconBtn} onClick={nextMonth}><ChevronRight size={20} /></button>
        </div>
        <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          일정 추가
        </button>
      </header>

      <div className={styles.calendarGrid}>
        {days.map((day, idx) => (
          <div key={idx} className={`${styles.dayHeader} ${idx === 0 ? styles.sunday : idx === 6 ? styles.saturday : ''}`}>
            {day}
          </div>
        ))}

        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className={`${styles.cell} ${styles.emptyCell}`} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum = i + 1;
          const isToday =
            today.getFullYear() === year &&
            today.getMonth() === month &&
            today.getDate() === dayNum;
          const dayEvents = getEventsForDay(dayNum);
          return (
            <div key={dayNum} className={`${styles.cell} ${isToday ? styles.today : ''}`}>
              <span className={styles.dateNum}>{dayNum}</span>
              {dayEvents.slice(0, 2).map(evt => (
                <div key={evt.eventId} className={styles.eventItem}>{evt.title}</div>
              ))}
            </div>
          );
        })}
      </div>

      <div className={styles.upcomingSection}>
        <h3 className={styles.sectionTitle}>다가오는 일정</h3>
        <div className={styles.upcomingList}>
          {upcomingEvents.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>다가오는 일정이 없습니다.</p>
          ) : upcomingEvents.map((evt) => (
            <div key={evt.eventId} className={styles.upcomingCard}>
              <div className={styles.upcomingDate}>{new Date(evt.startAt).toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric', weekday: 'short' })}</div>
              <div className={styles.upcomingInfo}>
                <h4>{evt.title}</h4>
                <p>{evt.location || evt.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>새 일정 추가</h3>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label className={styles.label}>일정 제목</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="일정 제목을 입력하세요"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>일정 분류</label>
                <select
                  className={styles.select}
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                >
                  <option>개인 일정</option>
                  <option>동아리/모임</option>
                  <option>학교 행사</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>날짜</label>
                  <input
                    className={styles.input}
                    type="date"
                    value={form.date}
                    onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>시간</label>
                  <input
                    className={styles.input}
                    type="time"
                    value={form.time}
                    disabled={form.allDay}
                    onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>메모 (선택)</label>
                <textarea
                  className={styles.textarea}
                  placeholder="일정에 대한 상세 메모를 남겨보세요."
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                />
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>취소</button>
              <button className={styles.submitBtn} onClick={handleSubmit} disabled={!form.title || !form.date}>등록하기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
