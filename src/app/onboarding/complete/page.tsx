'use client';

import React from 'react';
import styles from './Complete.module.css';
import { ShieldCheck, Check, School, GraduationCap, Users, CalendarDays, ArrowRight } from 'lucide-react';

export default function OnboardingCompletePage() {
  return (
    <div className={styles.container}>
      {/* Background Content (Blurred fake app layout) */}
      <div className={styles.blurredBg}>
        <header className={styles.fakeHeader}>
          <div className={styles.fakeLogo}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '32px', height: '32px', borderRadius: '8px',
              backgroundColor: '#4F46E5', color: 'white',
              boxShadow: '0 2px 4px rgba(79, 70, 229, 0.2)'
            }}>
              <GraduationCap size={20} strokeWidth={2.5} />
            </div>
            <span className={styles.fakeLogoText}>Cluverse</span>
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            <span style={{ width: '40px', height: '16px', backgroundColor: '#e7e7f3', borderRadius: '4px' }}></span>
            <span style={{ width: '40px', height: '16px', backgroundColor: '#e7e7f3', borderRadius: '4px' }}></span>
            <span style={{ width: '40px', height: '16px', backgroundColor: '#e7e7f3', borderRadius: '4px' }}></span>
            <span style={{ width: '40px', height: '16px', backgroundColor: '#e7e7f3', borderRadius: '4px' }}></span>
          </div>
        </header>
        <div className={styles.fakeHero}>
          <div style={{ width: '60px', height: '20px', backgroundColor: '#1313ec', borderRadius: '12px', marginBottom: '16px' }}></div>
          <div style={{ width: '300px', height: '40px', backgroundColor: '#4c4c9a', borderRadius: '8px', marginBottom: '12px' }}></div>
          <div style={{ width: '240px', height: '24px', backgroundColor: '#4c4c9a', borderRadius: '8px', opacity: 0.6 }}></div>
        </div>
      </div>

      {/* Modal Overlay */}
      <div className={styles.overlay}>
        <div className={styles.modal}>
          
          <div className={styles.modalHeader}>
            <div className={styles.iconContainer}>
              <div className={styles.iconGlow}></div>
              <div className={styles.iconCircle}>
                <ShieldCheck size={48} strokeWidth={1.5} />
              </div>
              <div className={styles.checkBadge}>
                <Check size={12} strokeWidth={4} />
              </div>
            </div>
            
            <h2 className={styles.welcomeTitle}>환영합니다!</h2>
            <p className={styles.welcomeDesc}>
              Cluverse에 오신 것을 환영합니다.<br/>
              더 많은 활동을 위해 학생 인증을 완료해주세요.
            </p>
          </div>

          <div className={styles.benefitsList}>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>
                <School size={18} />
              </div>
              <div className={styles.benefitText}>
                <span className={styles.benefitTitle}>학교 인증 배지 획득</span>
                <span className={styles.benefitDesc}>프로필에 소속 학교 배지가 표시됩니다.</span>
              </div>
            </div>

            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>
                <Users size={18} />
              </div>
              <div className={styles.benefitText}>
                <span className={styles.benefitTitle}>전용 게시판 이용</span>
                <span className={styles.benefitDesc}>학교별 익명/실명 게시판을 이용해보세요.</span>
              </div>
            </div>

            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>
                <CalendarDays size={18} />
              </div>
              <div className={styles.benefitText}>
                <span className={styles.benefitTitle}>교내 이벤트 참여</span>
                <span className={styles.benefitDesc}>검증된 학생들만 참여하는 이벤트에 초대됩니다.</span>
              </div>
            </div>
          </div>

          <div className={styles.modalActions}>
            <button className={styles.verifyBtn} onClick={() => window.location.href='/onboarding/verification'}>
              학생 인증하기
              <ArrowRight size={16} strokeWidth={3} />
            </button>
            <button className={styles.skipBtn} onClick={() => window.location.href='/home'}>
              나중에 하기
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
