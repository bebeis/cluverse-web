import React from 'react';
import Link from 'next/link';
import { TrendingUp, Plus } from 'lucide-react';
import styles from './RightAside.module.css';

export default function RightAside() {
  return (
    <aside className={styles.container}>
      {/* Trending Keywords Box */}
      <div className={styles.box}>
        <div className={styles.headerRow}>
          <h3 className={styles.title}>실시간 인기 키워드</h3>
          <TrendingUp size={16} className={styles.iconTrending} />
        </div>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            <div className={styles.itemLeft}>
              <span className={styles.rankTop}>1</span>
              <span className={styles.keyword}>중간고사</span>
            </div>
            <span className={styles.badgeNew}>new</span>
          </li>
          <li className={styles.listItem}>
            <div className={styles.itemLeft}>
              <span className={styles.rankTop}>2</span>
              <span className={styles.keyword}>축제 라인업</span>
            </div>
          </li>
          <li className={styles.listItem}>
            <div className={styles.itemLeft}>
              <span className={styles.rankTop}>3</span>
              <span className={styles.keyword}>해외봉사</span>
            </div>
          </li>
          <li className={styles.listItem}>
            <div className={styles.itemLeft}>
              <span className={styles.rankNormal}>4</span>
              <span className={styles.keyword}>자취방 양도</span>
            </div>
          </li>
          <li className={styles.listItem}>
            <div className={styles.itemLeft}>
              <span className={styles.rankNormal}>5</span>
              <span className={styles.keyword}>공모전 팀원</span>
            </div>
            <span className={styles.badgeNew}>up</span>
          </li>
        </ul>
      </div>

      {/* Recommended Groups Box */}
      <div className={styles.box}>
        <div className={styles.headerRow}>
          <h3 className={styles.title}>추천 모임</h3>
          <Link href="/explore/groups" className={styles.linkBtn}>더보기</Link>
        </div>
        
        <div className={styles.groupList}>
          <div className={styles.groupItem}>
            <img 
              alt="Film Club" 
              className={styles.groupImg} 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9LgkF6xirT-mqqGsr-bdm6wtRs7ilEtQK4WyIRICXDr6EfyuSDPuBYg8Cx6XRN1htEzo0fgJ7d8uaMehw1rM0PHK2xbt0UE4OO17RcbHpOgPccTeQbW_lhgHfBA69Y0M5kzTPy-vkn1BH1mZOBZ--tdGnKuCkqb7uSzaUuOR8VrRk15n6rcg2NTZwJd_UCjLz_qUGa0faW_Nu15nZsR35kt_O7a6HKbk1i50GDGuNcJqOnHM0wxAVyGk5Fkv8iVcY2ScZdgV-JSlx"
            />
            <div className={styles.groupInfo}>
              <h4 className={styles.groupName}>시네마 천국</h4>
              <p className={styles.groupDesc}>매주 금요일 영화 감상 모임</p>
            </div>
            <button className={styles.addBtn}><Plus size={20} /></button>
          </div>

          <div className={styles.groupItem}>
            <img 
              alt="Coding Club" 
              className={styles.groupImg} 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCaLlSuEloXdjIbiw9qVt9vGpNSzxeoP7g2m9tTTl6AVmyAzSCCYMt_2bqbE9-xMHtNNOfVZ9sX_eecTgJ94HeJS5trxbd9V9mGV-UtXQi95U3Csv9zh2wtP6d46IMUPKgKhSJUWQsikTNRTPuG9ZAwg7eoWKTlmhgLDbRomJbLUhh3zUOZX9XU1eEAdk64VVulVB9wutDU9EELj8SvYW-kJBjLNAcMTQzoFPjHn6zhEpAVZzr5wXYdnCNbXMwdY2g71YoS7hb_J9lE"
            />
            <div className={styles.groupInfo}>
              <h4 className={styles.groupName}>알고리즘 뿌셔</h4>
              <p className={styles.groupDesc}>백준 플래티넘 도전 스터디</p>
            </div>
            <button className={styles.addBtn}><Plus size={20} /></button>
          </div>

          <div className={styles.groupItem}>
            <img 
              alt="Hiking Club" 
              className={styles.groupImg} 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7fFKNVLvUxg_IbeDa3JRTMfmiLNMvAiba7CWQXyFcQxN334a5ZBiMFrd0eBy5YXDPA2u1eHxKndbByqtxeRYI4lRWhdvlXZvWEFq0dbXOiUaXZmhfSLLE0S7fIp2hVZALsYTL3xEAqkbEhK3XJYnlneacmcNXw2Plc6I_8oMTEbHxeIgA3u5apHBafEIUVjtjsBghDWhDuzPchsotaKC4t57seSrXu_DBKm9D7p0fPWg1C1xlNUEjdNGMaw-InWnnPZyor_Fyy5f0"
            />
            <div className={styles.groupInfo}>
              <h4 className={styles.groupName}>산악회 '오르자'</h4>
              <p className={styles.groupDesc}>주말 근교 산행 함께해요</p>
            </div>
            <button className={styles.addBtn}><Plus size={20} /></button>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.footerLinks}>
          <a href="#" className={styles.footerLink}>이용약관</a>
          <a href="#" className={styles.footerLink}>개인정보처리방침</a>
          <a href="#" className={styles.footerLink}>커뮤니티 가이드라인</a>
          <a href="#" className={styles.footerLink}>문의하기</a>
        </div>
        <p>© 2024 Cluverse Inc.</p>
      </div>
    </aside>
  );
}
