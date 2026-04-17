import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Compass,
  GraduationCap,
  LockKeyhole,
  Sparkles,
  Users,
} from 'lucide-react';
import styles from './page.module.css';

const trustItems = ['학교 기반 가입', '관심사 피드', '동아리 탐색'];

const featureCards = [
  {
    icon: <LockKeyhole size={18} />,
    title: '내 학교로 시작',
    description: '학교를 선택하고 같은 캠퍼스의 대화와 모임을 빠르게 이어가세요.',
  },
  {
    icon: <Compass size={18} />,
    title: '관심사 중심 탐색',
    description: '학과, 커뮤니티, 그룹을 한 번에 살펴보고 필요한 소식만 따라가세요.',
  },
  {
    icon: <Users size={18} />,
    title: '캠퍼스 모임 연결',
    description: '동아리와 프로젝트 팀을 찾고, 모집 일정과 활동을 놓치지 마세요.',
  },
];

export default function LandingPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="Cluverse 홈">
          <span className={styles.brandMark}>
            <GraduationCap size={18} strokeWidth={2.4} />
          </span>
          <span className={styles.brandName}>Cluverse</span>
        </Link>

        <nav className={styles.nav} aria-label="시작하기">
          <Link href="/login" className={styles.navLink}>로그인</Link>
          <Link href="/signup" className={styles.navCta}>회원가입</Link>
        </nav>
      </header>

      <section className={styles.hero} aria-labelledby="landing-title">
        <div className={styles.heroImage} aria-hidden="true" />
        <div className={styles.heroOverlay} />
        <div className={styles.heroLines} />

        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>
            <Sparkles size={15} />
            Cluverse Campus Network
          </p>
          <h1 id="landing-title" className={styles.title}>
            내 캠퍼스의 대화와 모임을 한 곳에서 시작하세요
          </h1>
          <p className={styles.lead}>
            학교, 관심사, 학과, 동아리까지 이어지는 캠퍼스 네트워크. 가입 후 나에게 맞는 피드와 그룹을 바로 만나보세요.
          </p>

          <div className={styles.actions}>
            <Link href="/signup" className={styles.primaryAction}>
              회원가입
              <ArrowRight size={16} />
            </Link>
            <Link href="/login" className={styles.secondaryAction}>로그인</Link>
          </div>

          <div className={styles.trustRow} aria-label="가입 후 이용할 수 있는 기능">
            {trustItems.map(item => (
              <span key={item} className={styles.trustItem}>
                <CheckCircle2 size={14} />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.featureBand} aria-label="Cluverse 시작">
        <div className={styles.featureHeader}>
          <p className={styles.sectionKicker}>Start with Cluverse</p>
          <h2 className={styles.sectionTitle}>가입하면 캠퍼스 흐름이 바로 정리됩니다</h2>
        </div>

        <div className={styles.featureGrid}>
          {featureCards.map(card => (
            <article key={card.title} className={styles.featureCard}>
              <span className={styles.featureIcon}>{card.icon}</span>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
