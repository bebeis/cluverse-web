'use client';

import React from 'react';
import { AuthHeader } from '@/components/ui/AuthHeader';
import styles from './Major.module.css';
import { BookOpen, GraduationCap, Library, CheckCircle2, Info, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function MajorSelectionPage() {
  return (
    <div className={styles.container}>
      {/* Header */}
      <AuthHeader rightElement={
          <div className={styles.headerActions}>
            <a href="#" className={styles.headerLink}>도움말</a>
            <a href="#" className={styles.headerLink}>나가기</a>
          </div>
        } />

      {/* Main Content Area */}
      <main className={styles.main}>
        <div className={styles.contentWrapper}>
          
          {/* Stepper */}
          <div className={styles.stepper}>
            <div className={styles.stepperHeader}>
              <p className={styles.stepperStep}>Step 1/3</p>
              <span className={styles.stepperDesc}>학교 및 전공 선택</span>
            </div>
            <div className={styles.stepperBar}>
              <div className={styles.stepperProgress}></div>
            </div>
          </div>

          {/* Title Section */}
          <div className={styles.titleArea}>
            <h1 className={styles.title}>소속 학교와 전공을 알려주세요</h1>
            <p className={styles.subtitle}>정확한 정보를 입력하면 학교 인증과 커뮤니티 매칭이 쉬워집니다.</p>
          </div>

          {/* Form Section */}
          <div className={styles.formCard}>
            
            {/* School Search */}
            <div className={styles.inputGroup}>
              <label htmlFor="school-search" className={styles.inputLabel}>
                학교 검색
              </label>
              <div className={styles.inputRel}>
                <div className={styles.inputIcon}>
                  <GraduationCap size={20} />
                </div>
                <input 
                  type="text" 
                  id="school-search" 
                  placeholder="학교명을 입력하세요 (예: 한국대학교)" 
                  defaultValue="한국대학교"
                  className={styles.input}
                />
                <div className={styles.inputRightIcon}>
                  <CheckCircle2 size={20} />
                </div>
              </div>
              
              {/* Selected School Badge Preview */}
              <div className={styles.selectedSchool}>
                <div className={styles.schoolLogo}>
                  <img 
                    src="https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=40&auto=format&fit=crop" 
                    alt="University Logo" 
                  />
                </div>
                <div className={styles.schoolInfo}>
                  <span className={styles.schoolName}>한국대학교</span>
                  <span className={styles.schoolLoc}>Seoul, Korea</span>
                </div>
                <button type="button" className={styles.changeBtn}>변경</button>
              </div>
            </div>

            <div className={styles.divider}></div>

            {/* Major Inputs */}
            <div className={styles.majorsGrid}>
              
              {/* Main Major */}
              <div className={styles.inputGroup}>
                <label htmlFor="main-major" className={styles.inputLabel}>
                  주전공 <span className={styles.required}>*</span>
                </label>
                <div className={styles.inputRel}>
                  <div className={styles.inputIcon}>
                    <BookOpen size={20} />
                  </div>
                  <input 
                    type="text" 
                    id="main-major" 
                    placeholder="학과/학부 입력" 
                    className={styles.input}
                  />
                </div>
              </div>

              {/* Double/Minor Major */}
              <div className={styles.inputGroup}>
                <label htmlFor="sub-major" className={styles.inputLabel}>
                  복수/부전공
                  <span className={styles.optionalBadge}>선택사항</span>
                </label>
                <div className={styles.inputRel}>
                  <div className={styles.inputIcon}>
                    <Library size={20} />
                  </div>
                  <input 
                    type="text" 
                    id="sub-major" 
                    placeholder="학과/학부 입력" 
                    className={styles.input}
                  />
                </div>
              </div>

            </div>

            {/* Helper info */}
            <div className={styles.helperBox}>
              <div className={styles.helperIcon}>
                <Info size={20} />
              </div>
              <div className={styles.helperText}>
                <p>입력 가이드</p>
                <ul>
                  <li>재학 증명서에 기재된 정확한 학교명과 전공명을 입력해주세요.</li>
                  <li>아직 전공이 정해지지 않은 경우 '학부' 또는 '자율전공'으로 입력 가능합니다.</li>
                </ul>
              </div>
            </div>

            {/* Action Button */}
            <div className={styles.actionArea}>
              <button type="button" className={styles.nextBtn}>
                다음 단계로 
                <ArrowRight size={24} />
              </button>
              <button type="button" className={styles.skipBtn}>
                나중에 입력하기
              </button>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
