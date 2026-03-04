'use client';

import React, { useState } from 'react';
import styles from './MajorExplore.module.css';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Star,
  PenLine,
  Eye,
  Heart,
  MessageCircle,
  Lightbulb,
  Cpu,
  BookOpen,
  Users,
  FlaskConical,
  Palette,
} from 'lucide-react';

/* ── Sidebar Data ──────────────────────── */
const faculties = [
  {
    name: '공학계열',
    icon: <Cpu size={18} />,
    color: '#4f46e5',
    subs: [
      {
        name: 'IT',
        items: ['컴퓨터공학', '소프트웨어공학', '인공지능학과', '정보보호학과'],
      },
      {
        name: '기계/전자',
        items: ['기계공학', '전자공학'],
      },
      {
        name: '건축/토목',
        items: ['건축공학', '토목공학'],
      },
    ],
  },
  {
    name: '인문계열',
    icon: <BookOpen size={18} />,
    color: '#6B7280',
    subs: [
      { name: '어문학', items: ['국어국문학', '영어영문학'] },
    ],
  },
  {
    name: '사회계열',
    icon: <Users size={18} />,
    color: '#6B7280',
    subs: [
      { name: '상경', items: ['경영학', '경제학'] },
    ],
  },
  {
    name: '자연계열',
    icon: <FlaskConical size={18} />,
    color: '#6B7280',
    subs: [
      { name: '기초과학', items: ['수학', '물리학'] },
    ],
  },
  {
    name: '예체능계열',
    icon: <Palette size={18} />,
    color: '#6B7280',
    subs: [
      { name: '미술/체육', items: ['디자인', '체육학'] },
    ],
  },
];

/* ── Post Data ─────────────────────────── */
const posts = [
  {
    id: 1,
    badges: [{ type: 'hot', text: '인기' }, { type: 'default', text: '정보' }],
    title: '2024년도 하반기 IT기업 신입 공채 일정 정리 (네카라쿠배)',
    preview: '이번 하반기 공채 일정이 대부분 떴습니다. 주요 기업들 일정 정리해서 공유합니다. 자소서 항목도 작년이랑 크게 달라지지 않은 것 같네요.',
    authorColor: 'bg-blue-100 text-blue-700',
    authorInitial: 'K',
    authorName: '컴공19학번',
    time: '1시간 전',
    views: '1.2k',
    likes: 342,
    likesHigh: true,
    comments: 56,
    commentsHigh: true,
  },
  {
    id: 2,
    badges: [{ type: 'question', text: '질문' }],
    title: '알고리즘 공부 시작하려는데 백준 vs 프로그래머스 추천 좀 해주세요',
    preview: '코딩테스트 준비 처음입니다. 언어는 파이썬으로 하려고 하는데 어디서부터 시작하는 게 좋을까요?',
    authorColor: 'bg-slate-100 text-slate-500',
    authorInitial: '?',
    authorName: '익명',
    time: '3시간 전',
    views: '450',
    likes: 12,
    likesHigh: false,
    comments: 8,
    commentsHigh: false,
  },
  {
    id: 3,
    badges: [{ type: 'default', text: '후기' }],
    title: '맥북 프로 M3 14인치 한 달 사용 후기 (개발자 관점)',
    preview: '',
    authorColor: 'bg-green-100 text-green-700',
    authorInitial: 'S',
    authorName: '코딩하는사과',
    time: '5시간 전',
    views: '892',
    likes: 45,
    likesHigh: false,
    comments: 23,
    commentsHigh: false,
  },
  {
    id: 4,
    badges: [{ type: 'default', text: '정보' }],
    title: '졸업작품 주제 선정 팁 및 피해야 할 주제 리스트',
    preview: '졸작 시즌이 다가오는데 주제 선정 어려우신 분들 많으시죠? 제가 겪었던 시행착오랑 교수님들이 선호하는 주제 방향성 정리.',
    authorColor: 'bg-purple-100 text-purple-700',
    authorInitial: 'Y',
    authorName: '졸업하고싶다',
    time: '1일 전',
    views: '2.3k',
    likes: 156,
    likesHigh: true,
    comments: 42,
    commentsHigh: true,
  },
  {
    id: 5,
    badges: [{ type: 'question', text: '질문' }],
    title: '운영체제 전공 서적 공룡책 원서로 보는 게 나을까요?',
    preview: '번역본이 좀 읽기 힘들다는 평이 많아서 고민입니다. 영어 실력이 그렇게 뛰어나진 않은데 전공 용어 익힐 겸 원서 도전해볼만 한가요?',
    authorColor: 'bg-slate-100 text-slate-500',
    authorInitial: '?',
    authorName: '익명',
    time: '2일 전',
    views: '320',
    likes: 5,
    likesHigh: false,
    comments: 11,
    commentsHigh: false,
  },
];

/* ── Component ─────────────────────────── */
export default function MajorExplorePage() {
  const [openFaculty, setOpenFaculty] = useState(0);
  const [openSub, setOpenSub] = useState(0);
  const [activeChip, setActiveChip] = useState('전체');

  const chips = ['전체', '질문', '정보', '후기'];

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div>
          <h1 className={styles.sideTitle}>학과 탐색</h1>
          <p className={styles.sideSubtitle}>관심있는 학과를 선택하세요.</p>
        </div>

        <div className={styles.accordionList}>
          {faculties.map((fac, fi) => (
            <div key={fac.name} className={styles.accordionItem}>
              <div
                className={styles.accordionHeader}
                onClick={() => setOpenFaculty(openFaculty === fi ? -1 : fi)}
              >
                <div className={styles.accordionLeft}>
                  <div
                    className={styles.accordionIcon}
                    style={{ background: fi === openFaculty ? fac.color : '#F3F4F6', color: fi === openFaculty ? 'white' : '#6B7280' }}
                  >
                    {fac.icon}
                  </div>
                  <span className={fi === openFaculty ? styles.accordionName : styles.accordionNameInactive}>
                    {fac.name}
                  </span>
                </div>
                <ChevronDown
                  size={18}
                  className={`${styles.accordionChevron} ${openFaculty === fi ? styles.accordionChevronOpen : ''}`}
                />
              </div>
              {openFaculty === fi && (
                <div className={styles.accordionBody}>
                  {fac.subs.map((sub, si) => (
                    <div key={sub.name}>
                      <div
                        className={styles.subHeader}
                        onClick={() => setOpenSub(openSub === si ? -1 : si)}
                      >
                        <span>{sub.name}</span>
                        <ChevronDown
                          size={16}
                          className={`${styles.subChevron} ${openSub === si ? styles.subChevronOpen : ''}`}
                        />
                      </div>
                      {openSub === si && (
                        <div className={styles.subBodyList}>
                          {sub.items.map((item, ii) => (
                            <a
                              key={item}
                              className={ii === 0 ? styles.subLinkActive : styles.subLink}
                            >
                              {item}
                              {ii === 0 && fi === 0 && si === 0 && (
                                <span className={styles.newBadge}>NEW</span>
                              )}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Tip */}
        <div className={styles.tipCard}>
          <div className={styles.tipTitle}>
            <Lightbulb size={16} />
            관심 학과를 찾으시나요?
          </div>
          <p className={styles.tipDesc}>
            관심 있는 키워드를 설정하면 내 성향에 맞는 학과를 추천받을 수 있습니다.
          </p>
          <button className={styles.tipBtn}>내 성향 분석하기</button>
        </div>
      </aside>

      {/* Main Content */}
      <section className={styles.main}>
        {/* Board Header */}
        <div className={styles.boardHeader}>
          <div className={styles.boardTopRow}>
            <div className={styles.boardTitleWrap}>
              <div className={styles.boardTitleRow}>
                <h1 className={styles.boardTitle}>컴퓨터공학 게시판</h1>
                <button className={styles.starBtn}>
                  <Star size={24} />
                </button>
              </div>
              <p className={styles.boardDesc}>
                컴퓨터공학 전공생들과 전공 지식, 진로 고민, 학교 생활을 공유해보세요.
              </p>
            </div>
            <button className={styles.writeBtn}>
              <PenLine size={18} />
              글쓰기
            </button>
          </div>
          <div className={styles.separator} />
          <div className={styles.filterRow}>
            <div className={styles.chips}>
              {chips.map(c => (
                <button
                  key={c}
                  className={activeChip === c ? styles.chipActive : styles.chip}
                  onClick={() => setActiveChip(c)}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className={styles.sortRow}>
              최신순 <ChevronDown size={14} />
            </div>
          </div>
        </div>

        {/* Mobile Write */}
        <button className={styles.writeBtnMobile}>
          <PenLine size={18} />
          새 글 작성하기
        </button>

        {/* Post List */}
        <div className={styles.postList}>
          {posts.map(p => (
            <article key={p.id} className={styles.postCard}>
              <div className={styles.postBadges}>
                {p.badges.map(b => (
                  <span
                    key={b.text}
                    className={
                      b.type === 'hot'
                        ? styles.postBadgeHot
                        : b.type === 'question'
                        ? styles.postBadgeQ
                        : styles.postBadge
                    }
                  >
                    {b.text}
                  </span>
                ))}
              </div>
              <h3 className={styles.postTitle}>{p.title}</h3>
              {p.preview && <p className={styles.postPreview}>{p.preview}</p>}
              <div className={styles.postFooter}>
                <div className={styles.postAuthor}>
                  <div
                    className={styles.authorCircle}
                    style={{
                      background: p.authorColor.includes('blue') ? '#DBEAFE'
                        : p.authorColor.includes('green') ? '#DCFCE7'
                        : p.authorColor.includes('purple') ? '#F3E8FF'
                        : '#F3F4F6',
                      color: p.authorColor.includes('blue') ? '#1D4ED8'
                        : p.authorColor.includes('green') ? '#15803D'
                        : p.authorColor.includes('purple') ? '#7E22CE'
                        : '#6B7280',
                    }}
                  >
                    {p.authorInitial}
                  </div>
                  <span className={styles.authorName}>{p.authorName}</span>
                  <span className={styles.authorDot}>•</span>
                  <span className={styles.authorTime}>{p.time}</span>
                </div>
                <div className={styles.postStats}>
                  <div className={styles.stat}>
                    <Eye size={16} />
                    <span>{p.views}</span>
                  </div>
                  <div className={p.likesHigh ? styles.statHighlight : styles.stat}>
                    <Heart size={16} />
                    <span>{p.likes}</span>
                  </div>
                  <div className={p.commentsHigh ? styles.statBlue : styles.stat}>
                    <MessageCircle size={16} />
                    <span>{p.comments}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Pagination */}
        <div className={styles.pagination}>
          <button className={styles.pageBtn}>
            <ChevronLeft size={18} />
          </button>
          <button className={styles.pageBtnActive}>1</button>
          <button className={styles.pageBtn}>2</button>
          <button className={styles.pageBtn}>3</button>
          <span className={styles.pageEllipsis}>...</span>
          <button className={styles.pageBtn}>10</button>
          <button className={styles.pageBtn}>
            <ChevronRight size={18} />
          </button>
        </div>
      </section>
    </div>
  );
}
