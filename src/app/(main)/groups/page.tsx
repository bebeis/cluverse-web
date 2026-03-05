import React from 'react';
import styles from './Groups.module.css';
import { Users, MoreVertical, Plus } from 'lucide-react';

const myGroups = [
  {
    id: 1,
    name: '시네마 천국',
    category: '문화/예술',
    role: '멤버',
    memberCount: 24,
    unreadMessages: 3,
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9LgkF6xirT-mqqGsr-bdm6wtRs7ilEtQK4WyIRICXDr6EfyuSDPuBYg8Cx6XRN1htEzo0fgJ7d8uaMehw1rM0PHK2xbt0UE4OO17RcbHpOgPccTeQbW_lhgHfBA69Y0M5kzTPy-vkn1BH1mZOBZ--tdGnKuCkqb7uSzaUuOR8VrRk15n6rcg2NTZwJd_UCjLz_qUGa0faW_Nu15nZsR35kt_O7a6HKbk1i50GDGuNcJqOnHM0wxAVyGk5Fkv8iVcY2ScZdgV-JSlx'
  },
  {
    id: 2,
    name: '프론트엔드 딥다이브',
    category: 'IT/개발',
    role: '운영자',
    memberCount: 8,
    unreadMessages: 0,
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCaLlSuEloXdjIbiw9qVt9vGpNSzxeoP7g2m9tTTl6AVmyAzSCCYMt_2bqbE9-xMHtNNOfVZ9sX_eecTgJ94HeJS5trxbd9V9mGV-UtXQi95U3Csv9zh2wtP6d46IMUPKgKhSJUWQsikTNRTPuG9ZAwg7eoWKTlmhgLDbRomJbLUhh3zUOZX9XU1eEAdk64VVulVB9wutDU9EELj8SvYW-kJBjLNAcMTQzoFPjHn6zhEpAVZzr5wXYdnCNbXMwdY2g71YoS7hb_J9lE'
  }
];

export default function GroupsPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTitles}>
          <h1 className={styles.title}>내 동아리</h1>
          <p className={styles.subtitle}>내가 가입했거나 관리하는 동아리/소모임입니다.</p>
        </div>
        <button className={styles.createBtn}>
          <Plus size={18} /> 그룹 만들기
        </button>
      </header>

      <div className={styles.groupGrid}>
        {myGroups.map((group) => (
          <div key={group.id} className={styles.groupCard}>
            <div className={styles.coverImageWrapper}>
              <img src={group.coverUrl} alt={group.name} className={styles.coverImage} />
              {group.unreadMessages > 0 && (
                <div className={styles.badge}>{group.unreadMessages}</div>
              )}
            </div>
            <div className={styles.content}>
              <div className={styles.cardHeader}>
                <span className={styles.category}>{group.category}</span>
                <button className={styles.moreBtn}><MoreVertical size={16} /></button>
              </div>
              <h3 className={styles.groupName}>{group.name}</h3>
              <div className={styles.metaRow}>
                <span className={group.role === '운영자' ? styles.roleAdmin : styles.roleMember}>
                  {group.role}
                </span>
                <span className={styles.memberCount}>
                  <Users size={14} /> {group.memberCount}명
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
