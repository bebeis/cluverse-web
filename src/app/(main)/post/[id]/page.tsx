'use client';

import React from 'react';
import styles from './PostDetail.module.css';
import { ChevronRight, UserPlus, MoreVertical, Heart, MessageCircle, Bookmark, Share2, Palette, User } from 'lucide-react';

export default function PostDetailPage() {
  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb}>
        <a href="#" className={styles.breadcrumbLink}>커뮤니티</a>
        <span className={styles.breadcrumbSep}><ChevronRight size={14} /></span>
        <a href="#" className={styles.breadcrumbLink}>자유게시판</a>
        <span className={styles.breadcrumbSep}><ChevronRight size={14} /></span>
        <span className={styles.breadcrumbCurrent}>게시글 상세</span>
      </nav>

      {/* Article */}
      <article className={styles.article}>
        <div className={styles.articleHeader}>
          <div className={styles.authorArea}>
            <div className={styles.authorAvatar}>
              <img 
                className={styles.avatarImg}
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnW_InPoiRxQtpoE2FMGXleKhqe5Y32A9E_aSZe13NsP-q4iLgoBkK-KJrjw-c56Dy4MuHPDU2R6aYavRkaZXLJbZ-ODBCT8hkZ5PmqRyyk5yxPkuzEJIEMgLmPc8Qiy6DqGgZDpq0wPizVLFmrHnXKfDWkZgmogK1mfxgu7OKcFloHxfS1czTmpy0Fq44jUM46q5ReHbMx9A5OJaL3dS7RwDC6eKnYSDW1111FhSDLI_6GAUYt-nncjmyxFW84TIA-NplqdLDrtyF"
                alt="Author"
              />
              <div className={styles.schoolBadge}>SNU</div>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className={styles.authorName}>김클루</span>
                <span className={styles.authorDept}>컴퓨터공학부 21</span>
              </div>
              <div className={styles.authorMeta}>
                <span>10분 전</span>
                <span style={{ color: '#D1D5DB' }}>•</span>
                <span>조회 1.2k</span>
              </div>
            </div>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.followBtn}>
              <UserPlus size={16} /> 팔로우
            </button>
            <button className={styles.moreBtn}>
              <MoreVertical size={20} />
            </button>
          </div>
        </div>

        <div className={styles.articleBody}>
          <div className={styles.tags}>
            <span className={styles.tagRecruiting}>모집중</span>
            <span className={styles.tagGeneral}>공모전</span>
          </div>

          <h1 className={styles.postTitle}>
            이번 AI 해커톤 공모전 팀원 구합니다! (디자이너/개발자)
          </h1>

          <p className={styles.postContent}>
{`안녕하세요! 이번 2024 대학생 연합 AI 해커톤에 참가할 팀원을 모집하고 있습니다. 
현재 백엔드 개발자 1명, 기획자 1명 있습니다.
프론트엔드 개발자 분과 UI/UX 디자이너 분을 간절히 찾고 있습니다.
수상 경력보다는 열정적으로 끝까지 함께하실 분이면 좋겠습니다!
매주 토요일 강남역 부근에서 오프라인 회의 가능하신 분 연락주세요.`}
          </p>

          <div className={styles.imageGrid}>
            <div className={styles.gridImg}>
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLH9Qt8Ni_2BrcRe1pBGp0MZ6G2SjDgdxkHjcXIjpEVdxj7Xl21GHoDSwaO7NqQrSigUUYYrOLKhard34WCCifA_QdMQI5xidT_Mlv7yS83mq4av9lSONyzZu5hapFwmyw3-mlx54nFVfvPYD-wr8X6gKN457hS6w5GeLMkBak-ZydBOmU4AoK6xfD0_ggVxsEK_8ZieWnm7VaDIDPBnn7P_Hyx0maQ_jm72Lw6Fc14vWyYKBCNayggd1YwWnJ8S7wPI0ucy_X96sM"
                alt="Hackathon Poster"
              />
            </div>
            <div className={styles.gridImg}>
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuASKGaRn1b_CznRqX3RW47UGAw8NU47w69xXDPBQQevYghawH7Waz3bTb1oLnDRzFFdVMy9-m_iOyPV5OxoC3Y_xOxPWDHj4I2h4K6drWCzu30Zm0iJhGczqNaRXAOP0btgCnkutUijH7vdO_gqCj3Fxzbi4KN-qNl8FJNX7jVF_JdkE45SkkEda5QVlrirq-OuHm8HZtqA0JK24YNO_k6XJv5wH5ol27b3A1q4t65hN46OFUH5IHQNMfDwecWvwudqdzIhzywC35US"
                alt="Meeting"
              />
            </div>
          </div>

          <div className={styles.hashTags}>
            <a href="#" className={styles.hashTag}>#해커톤</a>
            <a href="#" className={styles.hashTag}>#팀원모집</a>
            <a href="#" className={styles.hashTag}>#AI</a>
            <a href="#" className={styles.hashTag}>#대학생</a>
          </div>

          <div className={styles.actionBar}>
            <div className={styles.actionBtns}>
              <button className={`${styles.actionBtn} ${styles.likeBtn}`}>
                <Heart size={22} /> 24
              </button>
              <button className={`${styles.actionBtn} ${styles.commentBtn}`}>
                <MessageCircle size={22} /> 12
              </button>
              <button className={`${styles.actionBtn} ${styles.bookmarkBtn}`}>
                <Bookmark size={22} /> 5
              </button>
            </div>
            <button className={styles.shareBtn}>
              <Share2 size={18} /> 공유
            </button>
          </div>
        </div>
      </article>

      {/* Comments */}
      <section className={styles.commentsSection}>
        <div className={styles.commentsHeader}>
          <h3 className={styles.commentsTitle}>
            댓글 <span className={styles.commentCount}>12</span>
          </h3>
          <div className={styles.sortOptions}>
            <button className={styles.sortOptionActive}>등록순</button>
            <span className={styles.sortOptionDivider}>|</span>
            <button className={styles.sortOption}>최신순</button>
          </div>
        </div>

        <div className={styles.commentsList}>
          {/* Comment 1 with replies */}
          <div className={styles.commentGroup}>
            <div className={styles.commentThread}></div>
            <div className={styles.comment}>
              <div className={styles.commentAvatar}>
                <img className={styles.commentAvatarImg}
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBG2mvZip96mYwypQA54OJjgah7oFHw17G7P6hapYHue85qaQ6Fw01wyicS2v1oWihcij1N-cj1nyqjaGoI2il0jUjmyWcMu8lMqzFnj-9ub0afPiM6JFSg_QGlQQ0QbjRYUp9Bgyf5zOnf9lO_E0NcdWFFy9786eYYG0OG-YBOJc5TW0T2P-UyBS61MfQFwyhEW6hocpVR0dvZulucdVy3AHb3DlBUpMwO181tiqYl7rqiebN86fhFd-8Ar10K_fidk1MBgm0FDZyM"
                  alt="Avatar"
                />
              </div>
              <div className={styles.commentBody}>
                <div className={styles.commentMeta}>
                  <div className={styles.commentMetaLeft}>
                    <span className={styles.commentAuthorName}>코딩하는라이언</span>
                    <span className={styles.commentSchool}>연세대학교</span>
                    <span className={styles.commentTime}>5분 전</span>
                  </div>
                  <button className={styles.commentMoreBtn}><MoreVertical size={16} /></button>
                </div>
                <div className={styles.commentBubble}>
                  <p className={styles.commentText}>혹시 프론트엔드 기술 스택이 어떻게 되나요? React 사용하시나요?</p>
                  <div className={styles.commentActions}>
                    <button className={styles.commentAction}><Heart size={14} /> 좋아요</button>
                    <button className={styles.commentAction}><MessageCircle size={14} /> 답글 쓰기</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Reply from author */}
            <div className={styles.reply}>
              <div className={styles.replyConnector}></div>
              <div className={styles.comment}>
                <div className={styles.commentAvatar}>
                  <div className={styles.commentAvatarAuthor}>작성자</div>
                </div>
                <div className={styles.commentBody}>
                  <div className={styles.commentMeta}>
                    <div className={styles.commentMetaLeft}>
                      <span className={`${styles.commentAuthorName} ${styles.commentAuthorPrimary}`}>김클루</span>
                      <span className={styles.commentSchool}>서울대학교</span>
                      <span className={styles.commentTime}>3분 전</span>
                    </div>
                  </div>
                  <div className={`${styles.commentBubble} ${styles.commentBubbleAuthor}`}>
                    <p className={styles.commentText}>네 맞습니다! React와 TypeScript 사용 예정입니다. Next.js 도입도 고려중이에요.</p>
                    <div className={styles.commentActions}>
                      <button className={styles.commentAction} style={{ color: '#4051B5', fontWeight: 700 }}><Heart size={14} fill="currentColor" /> 2</button>
                      <button className={styles.commentAction}><MessageCircle size={14} /> 답글 쓰기</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Comment 2 */}
          <div className={styles.commentGroup}>
            <div className={styles.comment}>
              <div className={styles.commentAvatar}>
                <div className={styles.commentAvatarIcon} style={{ background: '#F3E8FF', color: '#9333EA' }}>
                  <Palette size={20} />
                </div>
              </div>
              <div className={styles.commentBody}>
                <div className={styles.commentMeta}>
                  <div className={styles.commentMetaLeft}>
                    <span className={styles.commentAuthorName}>디자인꿈나무</span>
                    <span className={styles.commentSchool}>홍익대학교</span>
                    <span className={styles.commentTime}>1시간 전</span>
                  </div>
                  <button className={styles.commentMoreBtn}><MoreVertical size={16} /></button>
                </div>
                <div className={styles.commentBubble}>
                  <p className={styles.commentText}>디자이너 지원하고 싶은데 포트폴리오 필수인가요? 아직 학생이라 작업물이 많지 않아서요 ㅠㅠ</p>
                  <div className={styles.commentActions}>
                    <button className={styles.commentAction}><Heart size={14} /> 좋아요</button>
                    <button className={styles.commentAction}><MessageCircle size={14} /> 답글 쓰기</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Comment 3 (Anonymous) */}
          <div className={styles.commentGroup}>
            <div className={styles.comment}>
              <div className={styles.commentAvatar}>
                <div className={styles.commentAvatarIcon} style={{ background: '#F3F4F6', color: '#9CA3AF' }}>
                  <User size={22} />
                </div>
              </div>
              <div className={styles.commentBody}>
                <div className={styles.commentMeta}>
                  <div className={styles.commentMetaLeft}>
                    <span className={styles.commentAuthorName} style={{ color: '#6B7280' }}>익명</span>
                    <span className={styles.commentTime}>2시간 전</span>
                  </div>
                  <button className={styles.commentMoreBtn}><MoreVertical size={16} /></button>
                </div>
                <div className={styles.commentBubble}>
                  <p className={styles.commentText}>저번 공모전 대상팀인가요?</p>
                  <div className={styles.commentActions}>
                    <button className={styles.commentAction}><Heart size={14} /> 좋아요</button>
                    <button className={styles.commentAction}><MessageCircle size={14} /> 답글 쓰기</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fixed Comment Input */}
      <div className={styles.commentInput}>
        <div className={styles.commentInputInner}>
          <div className={styles.inputTopRow}>
            <label className={styles.anonLabel}>
              <input type="checkbox" className={styles.anonCheckbox} />
              <span className={styles.anonText}>익명으로 작성</span>
            </label>
            <span className={styles.charCount}>0/300</span>
          </div>
          <div className={styles.inputRow}>
            <textarea className={styles.textarea} placeholder="따뜻한 댓글을 남겨주세요." rows={1} />
            <button className={styles.submitBtn}>등록</button>
          </div>
        </div>
      </div>
    </div>
  );
}
