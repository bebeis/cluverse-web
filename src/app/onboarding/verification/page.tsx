'use client';

import React from 'react';
import { AuthHeader } from '@/components/ui/AuthHeader';
import styles from './Verification.module.css';
import { School, ShieldCheck, Lock, Mail, Info } from 'lucide-react';
import Link from 'next/link';

export default function VerificationPage() {
  return (
    <div className={styles.container}>
      {/* Header / Navbar */}
      <AuthHeader rightElement={
          <div className={styles.headerActions}>
            <button className={styles.loginBtn}>로그인</button>
            <button className={styles.signupBtn}>회원가입</button>
          </div>
        } />

      {/* Main Layout */}
      <main className={styles.main}>
        {/* Left Side */}
        <div className={styles.leftSide}>
          <div className={styles.bgDeco1}></div>
          <div className={styles.bgDeco2}></div>
          <div className={styles.leftContent}>
            <div className={styles.imagePlaceholder}>
              <div className={styles.imageBg}></div>
              <div className={styles.imageOverlay}></div>
            </div>
            
            <h2 className={styles.leftTitle}>
              대학생 인증이 <br/>필요한 이유
            </h2>
            
            <div className={styles.features}>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>
                  <ShieldCheck size={24} />
                </div>
                <div className={styles.featureContent}>
                  <h3>신뢰할 수 있는 커뮤니티</h3>
                  <p>Cluverse는 검증된 대학생들만 참여하는 안전한 공간입니다. 익명성 뒤에 숨지 않는 건강한 문화를 만듭니다.</p>
                </div>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>
                  <School size={24} />
                </div>
                <div className={styles.featureContent}>
                  <h3>동문 네트워크</h3>
                  <p>같은 학교 학생들과 더 쉽게 교류하고 정보를 나누세요. 선후배 간의 멘토링 기회도 제공됩니다.</p>
                </div>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>
                  <Lock size={24} />
                </div>
                <div className={styles.featureContent}>
                  <h3>안전한 모임</h3>
                  <p>투명한 신원 인증으로 오프라인 모임도 안심하고 참여할 수 있습니다.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form Action */}
        <div className={styles.rightSide}>
          <div className={styles.formWrapper}>
            <div className={styles.formContent}>
              
              {/* Stepper */}
              <div className={styles.stepper}>
                <div className={styles.stepperHeader}>
                  <span className={styles.stepperStep}>단계 1/3</span>
                  <span className={styles.stepperDesc}>학교 인증 &gt; 정보 입력 &gt; 완료</span>
                </div>
                <div className={styles.stepperBar}>
                  <div className={styles.stepperProgress}></div>
                </div>
              </div>

              <div className={styles.formTitleArea}>
                <h2 className={styles.formTitle}>학교 이메일 인증</h2>
                <p className={styles.formDesc}>
                  학교에서 발급받은 웹메일 주소를 입력해주세요.<br className="hidden sm:block"/>
                  인증 코드가 해당 메일로 전송됩니다.
                </p>
              </div>

              <form className={styles.form} onSubmit={e => e.preventDefault()}>
                <div className={styles.inputGroup}>
                  <label htmlFor="email" className={styles.inputLabel}>
                    학교 이메일 주소
                  </label>
                  <div className={styles.inputRel}>
                    <div className={styles.inputIcon}>
                      <Mail size={20} />
                    </div>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      placeholder="example@univ.ac.kr" 
                      className={styles.input}
                    />
                  </div>
                  <p className={styles.inputNotice}>
                    <Info size={14} />
                    ac.kr 또는 edu 도메인만 사용 가능합니다.
                  </p>
                </div>

                <div className={styles.inputGroupDisabled} aria-hidden="true">
                  <label htmlFor="code" className={styles.inputLabel}>
                    인증 코드
                  </label>
                  <div className={styles.codeLayout}>
                    <div className={styles.codeInputWrapper}>
                      <input 
                        type="text" 
                        id="code" 
                        name="code" 
                        placeholder="000000" 
                        disabled 
                        className={styles.codeInput}
                      />
                    </div>
                    <div className={styles.timer}>남은 시간 02:59</div>
                  </div>
                </div>

                <div className={styles.submitBtnWrapper}>
                  <button type="button" className={styles.submitBtn}>
                     인증 코드 전송
                  </button>
                </div>
              </form>

              <div className={styles.helpSection}>
                <div className={styles.divider}>
                  <div className={styles.dividerLine}>
                    <div className={styles.dividerLineInner}></div>
                  </div>
                  <div className={styles.dividerText}>
                    <span>도움이 필요하신가요?</span>
                  </div>
                </div>
                <div className={styles.helpLinks}>
                  <Link href="#" className={styles.helpLink}>이메일이 오지 않아요</Link>
                  <span className={styles.helpDot}>|</span>
                  <Link href="#" className={styles.helpLink}>학교 이메일이 없어요</Link>
                </div>
              </div>

            </div>
          </div>
          
          <div className={styles.formFooter}>
            <p>© 2026 Cluverse Inc. All rights reserved.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
