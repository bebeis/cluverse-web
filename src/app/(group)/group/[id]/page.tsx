'use client';

import React, { useState } from 'react';
import styles from './GroupDetail.module.css';
import {
  Users, MapPin, Calendar, SquarePen,
  Eye, MessageCircle, Heart,
  MessageSquare, MoreHorizontal,
  Camera, Pin, Megaphone,
  Image, CalendarDays,
} from 'lucide-react';

const tags = ['#사진', '#출사', '#대학생', '#친목'];
const quickTags = ['#DSLR', '#미러리스', '#필름카메라', '#서울출사'];

const posts = [
  {
    author: '김민수',
    time: '2시간 전',
    title: '지난주 한강 출사 사진 공유합니다!',
    excerpt: '날씨가 너무 좋아서 색감이 정말 예쁘게 나왔네요. 보정본 몇 장 올려봅니다. 특히 노을 질 때 찍은 사진들이 마음에 드네요. 다들 고생하셨습니다!',
    hasThumb: true,
    likes: 24,
    comments: 5,
    liked: false,
  },
  {
    author: '이하은',
    time: '5시간 전',
    title: '필름 카메라 입문하려고 하는데 추천 부탁드려요',
    excerpt: '자동카메라부터 시작하는게 좋을까요 아니면 수동으로 바로 입문해도 괜찮을까요? 예산은 20만원 정도로 생각하고 있습니다.',
    hasThumb: false,
    likes: 12,
    comments: 18,
    liked: true,
  },
  {
    author: '박지훈',
    time: '1일 전',
    title: '혹시 렌즈 중고거래 하실 분 계신가요?',
    excerpt: '소니 50mm f1.8 렌즈 판매합니다. 상태 S급이고 박스 풀셋입니다. 관심 있으신 분 댓글이나 쪽지 주세요! 직거래 선호합니다.',
    hasThumb: true,
    likes: 5,
    comments: 2,
    liked: false,
  },
];

const galleryImages = [
  { bg: 'linear-gradient(135deg, #06b6d4, #0284c7)' },
  { bg: 'linear-gradient(135deg, #f472b6, #db2777)' },
  { bg: 'linear-gradient(135deg, #a78bfa, #7c3aed)' },
  { bg: 'linear-gradient(135deg, #fb923c, #ea580c)' },
  { bg: 'linear-gradient(135deg, #34d399, #059669)' },
  { bg: 'linear-gradient(135deg, #fbbf24, #d97706)' },
];

const schedules = [
  { date: '11.02', day: '토', title: '남산 공원 정기 출사', time: '14:00 - 17:00', spot: '명동역 3번 출구 집결' },
  { date: '11.09', day: '토', title: '서촌 골목 출사', time: '13:00 - 16:00', spot: '경복궁역 2번 출구 집결' },
  { date: '11.16', day: '토', title: '야경 촬영 (여의도)', time: '18:00 - 21:00', spot: '여의나루역 1번 출구 집결' },
];

export default function GroupDetailPage() {
  const [activeTab, setActiveTab] = useState('board');

  return (
    <>
      {/* Hero Section */}
      <div className={styles.hero}>
        <div
          className={styles.heroCover}
          style={{ backgroundImage: "url('/images/groups/photography-club-cover.png')" }}
        />
        <div className={styles.heroGradient} />
        <div className={styles.heroContent}>
          <div className={styles.heroInfo}>
            <div className={styles.heroTags}>
              {tags.map(tag => (
                <span key={tag} className={styles.heroTag}>{tag}</span>
              ))}
            </div>
            <h1 className={styles.heroTitle}>사진찍는 사람들</h1>
            <div className={styles.heroMeta}>
              <span className={styles.heroMetaItem}>
                <Users size={18} /> 멤버 24명
              </span>
              <span className={styles.heroMetaItem}>
                <MapPin size={18} /> 서울/경기 지역
              </span>
              <span className={styles.heroMetaItem}>
                <Calendar size={18} /> 매주 토요일 출사
              </span>
            </div>
          </div>
          <button className={styles.applyBtn}>
            <SquarePen size={18} />
            지원하기
          </button>
        </div>
      </div>

      {/* Content Grid */}
      <div className={styles.gridLayout}>
        {/* Left Column: Main Feed */}
        <div className={styles.mainCol}>
          {/* Tab Navigation */}
          <div className={styles.tabs}>
            <button
              className={activeTab === 'board' ? styles.tabActive : styles.tabInactive}
              onClick={() => setActiveTab('board')}
            >
              게시판
            </button>
            <button
              className={activeTab === 'gallery' ? styles.tabActive : styles.tabInactive}
              onClick={() => setActiveTab('gallery')}
            >
              사진첩
            </button>
            <button
              className={activeTab === 'schedule' ? styles.tabActive : styles.tabInactive}
              onClick={() => setActiveTab('schedule')}
            >
              일정
            </button>
          </div>

          {/* ===== Board Tab ===== */}
          {activeTab === 'board' && (
            <>
              {/* Write Box */}
              <div className={styles.writeBox}>
                <div className={styles.writeBoxInner}>
                  <div className={styles.writeBoxAvatar} />
                  <div className={styles.writeBoxContent}>
                    <input
                      className={styles.writeBoxInput}
                      placeholder="새로운 소식을 멤버들에게 공유해보세요."
                    />
                    <div className={styles.writeBoxActions}>
                      <div className={styles.writeBoxMedia}>
                        <button className={styles.writeBoxMediaBtn} title="사진 첨부">
                          <Image size={18} />
                        </button>
                        <button className={styles.writeBoxMediaBtn} title="일정 추가">
                          <CalendarDays size={18} />
                        </button>
                      </div>
                      <button className={styles.writeBoxSubmit}>등록</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pinned Notice */}
              <div className={styles.pinnedSection}>
                <div className={styles.pinnedLabel}>
                  <Pin size={16} style={{ color: '#4051B5' }} />
                  <span>필독 공지사항</span>
                </div>
                <div className={styles.noticeCard}>
                  <div className={styles.noticeAccent} />
                  <div className={styles.noticeHeader}>
                    <div className={styles.noticeHeaderLeft}>
                      <span className={styles.noticeBadge}>공지사항</span>
                      <span className={styles.noticeDate}>2023.10.24</span>
                    </div>
                    <button className={styles.moreBtn}>
                      <MoreHorizontal size={20} />
                    </button>
                  </div>
                  <h3 className={styles.noticeTitle}>
                    <Camera size={16} style={{ display: 'inline', marginRight: 4 }} />
                    11월 첫째주 정기 출사 안내 (남산 공원)
                  </h3>
                  <p className={styles.noticeBody}>
                    안녕하세요 사진찍는 사람들 여러분! 이번 주 출사는 가을 정취를 물씬 느낄 수 있는 남산 공원으로 떠납니다.
                    오후 2시에 명동역 3번 출구에서 집결하여 천천히 걸어 올라갈 예정이니 늦지 않게 와주세요.
                  </p>
                  <div className={styles.noticeMeta}>
                    <span className={styles.metaItem}><Eye size={14} /> 142</span>
                    <span className={styles.metaItem}><MessageCircle size={14} /> 8</span>
                  </div>
                </div>
              </div>

              {/* Post List */}
              <div className={styles.postList}>
                {posts.map((post, idx) => (
                  <div key={idx} className={styles.postCard}>
                    <div className={styles.postRow}>
                      <div className={styles.postContent}>
                        <div className={styles.postAuthor}>
                          <div className={styles.postAuthorAvatar} style={{
                            background: `linear-gradient(${135 + idx * 40}deg, hsl(${idx * 80}, 60%, 70%), hsl(${idx * 80 + 40}, 70%, 60%))`,
                          }} />
                          <span className={styles.postAuthorName}>{post.author}</span>
                          <span className={styles.postAuthorTime}>• {post.time}</span>
                        </div>
                        <h4 className={styles.postTitle}>{post.title}</h4>
                        <p className={styles.postExcerpt}>{post.excerpt}</p>
                      </div>
                      {post.hasThumb && (
                        <div className={styles.postThumb}>
                          <div style={{
                            width: '100%',
                            height: '100%',
                            background: `linear-gradient(135deg, ${idx === 0 ? '#fbbf24, #f59e0b' : '#8b5cf6, #6d28d9'})`,
                          }} />
                        </div>
                      )}
                    </div>
                    <div className={styles.postFooter}>
                      <div className={styles.postFooterLeft}>
                        <button className={post.liked ? styles.postFooterItemLiked : styles.postFooterItem}>
                          <Heart size={14} /> {post.likes}
                        </button>
                        <span className={styles.postFooterItem}>
                          <MessageCircle size={14} /> {post.comments}
                        </span>
                      </div>
                      <span className={styles.postFooterViews}>
                        <Eye size={14} /> {(post.likes + post.comments) * 3}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.loadMoreBtn}>
                <button>더 보기</button>
              </div>
            </>
          )}

          {/* ===== Gallery Tab ===== */}
          {activeTab === 'gallery' && (
            <div className={styles.galleryTabContent}>
              <div className={styles.galleryTabGrid}>
                {galleryImages.map((item, i) => (
                  <div key={i} className={styles.galleryTabItem}>
                    <div style={{ width: '100%', height: '100%', background: item.bg }} />
                    <div className={styles.galleryTabItemOverlay}>
                      <div className={styles.galleryTabItemMeta}>
                        <span><Heart size={14} /> {12 + i * 3}</span>
                        <span><MessageCircle size={14} /> {2 + i}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.loadMoreBtn}>
                <button>더 보기</button>
              </div>
            </div>
          )}

          {/* ===== Schedule Tab ===== */}
          {activeTab === 'schedule' && (
            <div className={styles.scheduleTabContent}>
              {schedules.map((s, i) => (
                <div key={i} className={styles.scheduleCard}>
                  <div className={styles.scheduleDateBox}>
                    <span className={styles.scheduleDateNum}>{s.date}</span>
                    <span className={styles.scheduleDateDay}>{s.day}</span>
                  </div>
                  <div className={styles.scheduleInfo}>
                    <h4 className={styles.scheduleTitle}>{s.title}</h4>
                    <div className={styles.scheduleMeta}>
                      <span className={styles.scheduleMetaItem}>
                        <Calendar size={14} /> {s.time}
                      </span>
                      <span className={styles.scheduleMetaItem}>
                        <MapPin size={14} /> {s.spot}
                      </span>
                    </div>
                  </div>
                  <button className={styles.scheduleJoinBtn}>참석</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Sidebar */}
        <div className={styles.sidebar}>
          {/* Leader & Members */}
          <div className={styles.sideCard}>
            <div className={styles.sideCardTitle}>모임장</div>
            <div className={styles.leader}>
              <div className={styles.leaderAvatar} />
              <div className={styles.leaderInfo}>
                <div className={styles.leaderName}>최성민</div>
                <div className={styles.leaderDesc}>사진학과 18학번 · 캐논 유저</div>
              </div>
              <button className={styles.leaderChatBtn}>
                <MessageSquare size={18} />
              </button>
            </div>

            <div className={styles.divider} />

            <div className={styles.membersHeader}>
              <div className={styles.membersTitle}>
                멤버 <span className={styles.membersCount}>24</span>
              </div>
              <button className={styles.membersViewAll}>모두 보기</button>
            </div>

            <div className={styles.membersGrid}>
              {[1,2,3,4,5,6,7,8,9].map(i => (
                <div key={i} className={styles.memberAvatar} style={{
                  background: `linear-gradient(${135 + i * 20}deg, hsl(${i * 40}, 60%, 85%), hsl(${i * 40 + 30}, 70%, 75%))`,
                }} />
              ))}
              <div className={styles.memberMore}>+15</div>
            </div>
          </div>

          {/* Gallery Preview */}
          <div className={styles.sideCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div className={styles.sideCardTitle} style={{ margin: 0 }}>최근 활동 사진</div>
              <button className={styles.membersViewAll} onClick={() => setActiveTab('gallery')}>더 보기</button>
            </div>
            <div className={styles.galleryGrid}>
              {galleryImages.slice(0, 4).map((item, i) => (
                <div key={i} className={styles.galleryItem}>
                  <div style={{ width: '100%', height: '100%', background: item.bg }} />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Tags */}
          <div className={styles.quickTags}>
            {quickTags.map(tag => (
              <span key={tag} className={styles.quickTag}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
