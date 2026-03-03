'use client';

import React from 'react';
import { AuthHeader } from '@/components/ui/AuthHeader';
import styles from './Login.module.css';
import { Mail, Lock, ArrowRight, BookOpen, Users, ShieldCheck, HelpCircle } from 'lucide-react';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <AuthHeader rightElement={
          <div className={styles.headerActions}>
            <a href="#" className={styles.contactBtn}>문의하기</a>
            <button className={styles.signupBtn}>회원가입</button>
          </div>
        } />

      <main className={styles.main}>
        <div className={styles.card}>
          {/* Left Side */}
          <div className={styles.leftSide}>
            <div className={styles.leftTexture}></div>
            <div className={styles.leftContent}>
              <div className={styles.tag}>
                <BookOpen size={16} />
                <span className={styles.tagText}>University Hub</span>
              </div>
              <h1 className={styles.title}>대학 간 장벽을 넘는<br/>연결, 클루버스</h1>
              <p className={styles.description}>
                전국 400여개 대학의 친구들과 관심사로 연결되세요. 학업, 취미, 프로젝트까지 모든 것이 가능합니다.
              </p>
              
              <div className={styles.imageArea}>
                <img 
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=600&auto=format&fit=crop" 
                  alt="Students connecting across universities" 
                  className={styles.illustration}
                />
              </div>

              <div className={styles.statsList}>
                <div className={styles.statItem}>
                  <Users size={18} />
                  <span>누적 가입자 50만+</span>
                </div>
                <div className={styles.statItem}>
                  <ShieldCheck size={18} />
                  <span>학교 인증 100%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className={styles.rightSide}>
            <div className={styles.formContainer}>
              <h2 className={styles.welcomeTitle}>다시 오신 것을 환영해요! 👋</h2>
              <p className={styles.welcomeDesc}>오늘도 클루버스에서 새로운 영감을 얻어가세요.</p>

              <form onSubmit={e => e.preventDefault()}>
                <div className={styles.formGroup}>
                  <div className={styles.labelRow}>
                    <label className={styles.label} htmlFor="email">이메일</label>
                  </div>
                  <div className={styles.inputWrapper}>
                    <Mail className={styles.inputIcon} size={20} />
                    <input 
                      type="email" 
                      id="email" 
                      placeholder="example@university.ac.kr" 
                      className={styles.input} 
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <div className={styles.labelRow}>
                    <label className={styles.label} htmlFor="password">비밀번호</label>
                    <a href="#" className={styles.forgotLink}>비밀번호 찾기</a>
                  </div>
                  <div className={styles.inputWrapper}>
                    <Lock className={styles.inputIcon} size={20} />
                    <input 
                      type="password" 
                      id="password" 
                      placeholder="••••••••" 
                      className={styles.input} 
                    />
                  </div>
                </div>

                <button type="button" className={styles.loginBtn}>
                  로그인 <ArrowRight size={20} />
                </button>
              </form>

              <div className={styles.divider}>
                <div className={styles.dividerLine}>
                  <div className={styles.dividerLineInner}></div>
                </div>
                <div className={styles.dividerText}>
                  <span>소셜 계정으로 계속하기</span>
                </div>
              </div>

              <div className={styles.socialButtons}>
                <button type="button" className={`${styles.socialBtn} ${styles.kakaoBtn}`}>
                  <svg className="w-5 h-5" style={{ width: 20, height: 20 }} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 3C6.477 3 2 6.425 2 10.65C2 13.375 3.793 15.772 6.536 17.068C6.384 17.625 5.918 19.344 5.862 19.64C5.839 19.824 6.069 19.957 6.223 19.845C7.265 19.121 9.873 17.265 10.59 16.766C11.047 16.822 11.521 16.85 12 16.85C17.523 16.85 22 13.425 22 9.2C22 4.975 17.523 3 12 3Z"></path>
                  </svg>
                  카카오로 시작하기
                </button>
                <button type="button" className={`${styles.socialBtn} ${styles.googleBtn}`}>
                  <svg className="w-5 h-5" style={{ width: 20, height: 20 }} fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05"></path>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                  </svg>
                  Google로 시작하기
                </button>
              </div>

              <p className={styles.signupPrompt}>
                아직 회원이 아니신가요? <a href="/signup" className={styles.signupLink}>회원가입 하기</a>
              </p>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <a href="#" className={styles.footerLink}>이용약관</a>
          <div className={styles.footerDivider}></div>
          <a href="#" className={styles.footerLink}>개인정보처리방침</a>
          <div className={styles.footerDivider}></div>
          <a href="#" className={styles.footerLink}>도움말</a>
        </div>
      </main>
    </div>
  );
}
