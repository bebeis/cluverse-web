'use client';

import React, { useState } from 'react';
import styles from './Calendar.module.css';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';

export default function CalendarPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  
  // Dummy data for simple display
  const currentMonth = "2024년 10월";
  
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.monthSelector}>
          <button className={styles.iconBtn}><ChevronLeft size={20} /></button>
          <h2 className={styles.monthTitle}>{currentMonth}</h2>
          <button className={styles.iconBtn}><ChevronRight size={20} /></button>
        </div>
        <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          일정 추가
        </button>
      </header>
      
      <div className={styles.calendarGrid}>
        {/* Days Header */}
        {days.map((day, idx) => (
          <div key={idx} className={`${styles.dayHeader} ${idx === 0 ? styles.sunday : idx === 6 ? styles.saturday : ''}`}>
            {day}
          </div>
        ))}
        
        {/* Grid Cells (Dummy 35 cells for 5 weeks) */}
        {Array.from({ length: 35 }).map((_, i) => {
          const dayNum = (i - 2) > 0 && (i - 2) <= 31 ? (i - 2) : '';
          const isToday = dayNum === 24;
          return (
            <div key={i} className={`${styles.cell} ${dayNum === '' ? styles.emptyCell : ''} ${isToday ? styles.today : ''}`}>
              <span className={styles.dateNum}>{dayNum}</span>
              {dayNum === 15 && (
                <div className={styles.eventItem}>컴퓨터구조 중간고사</div>
              )}
              {dayNum === 20 && (
                <div className={`${styles.eventItem} ${styles.eventClub}`}>동아리 회의</div>
              )}
              {dayNum === 24 && (
                <div className={`${styles.eventItem} ${styles.eventPersonal}`}>스터디 모임</div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className={styles.upcomingSection}>
        <h3 className={styles.sectionTitle}>다가오는 일정</h3>
        <div className={styles.upcomingList}>
          <div className={styles.upcomingCard}>
            <div className={styles.upcomingDate}>10.24 (목)</div>
            <div className={styles.upcomingInfo}>
              <h4>스터디 모임</h4>
              <p>오후 6:00 · 강남 토즈</p>
            </div>
          </div>
          <div className={styles.upcomingCard}>
            <div className={styles.upcomingDate}>10.28 (월)</div>
            <div className={styles.upcomingInfo}>
              <h4>과제 제출 마감</h4>
              <p>오후 11:59 · 온라인</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
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
                <input className={styles.input} type="text" placeholder="일정 제목을 입력하세요" />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>일정 분류</label>
                <select className={styles.select}>
                  <option>개인 일정</option>
                  <option>동아리/모임</option>
                  <option>학교 행사</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>날짜</label>
                  <input className={styles.input} type="date" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>시간</label>
                  <input className={styles.input} type="time" />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>메모 (선택)</label>
                <textarea className={styles.textarea} placeholder="일정에 대한 상세 메모를 남겨보세요." />
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>취소</button>
              <button className={styles.submitBtn} onClick={() => setIsModalOpen(false)}>등록하기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
