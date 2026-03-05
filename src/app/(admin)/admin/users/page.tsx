'use client';

import React, { useState } from 'react';
import styles from './UserManagement.module.css';
import {
  Users, UserCheck, Clock, ShieldAlert,
  Search, SlidersHorizontal, Eye, Ban,
  ChevronLeft, ChevronRight, Mail, Shield,
  FileText, AlertTriangle, School, Calendar,
} from 'lucide-react';

const statCards = [
  { icon: <Users size={18} />, iconClass: 'statIconBlue', label: '전체 유저', value: '24,893', change: '+342 이번 주' },
  { icon: <UserCheck size={18} />, iconClass: 'statIconGreen', label: '인증 완료', value: '21,204', change: '85.2%' },
  { icon: <Clock size={18} />, iconClass: 'statIconYellow', label: '인증 대기', value: '1,847', change: '심사 필요' },
  { icon: <ShieldAlert size={18} />, iconClass: 'statIconRed', label: '제재 중', value: '142', change: '0.6%' },
];

const users = [
  { id: 1, name: '김민수', email: 'minsu@hangu.ac.kr', school: '한국대', dept: '컴퓨터공학과', verified: true, status: 'active', joinDate: '2025-03-15', lastLogin: '2시간 전', posts: 47, warns: 0, color: '#4051B5' },
  { id: 2, name: '이서연', email: 'seoyeon@hangu.ac.kr', school: '한국대', dept: '경영학과', verified: true, status: 'active', joinDate: '2025-04-02', lastLogin: '30분 전', posts: 123, warns: 0, color: '#7C3AED' },
  { id: 3, name: '박준호', email: 'junho@snu.ac.kr', school: '서울대', dept: '물리학과', verified: false, status: 'pending', joinDate: '2025-11-28', lastLogin: '1일 전', posts: 3, warns: 0, color: '#059669' },
  { id: 4, name: 'bad_user_99', email: 'bad99@hangu.ac.kr', school: '한국대', dept: '전기공학과', verified: true, status: 'suspended', joinDate: '2025-01-10', lastLogin: '7일 전', posts: 89, warns: 3, color: '#EF4444' },
  { id: 5, name: '최예진', email: 'yejin@korea.ac.kr', school: '고려대', dept: '미디어학부', verified: true, status: 'active', joinDate: '2025-06-20', lastLogin: '5분 전', posts: 256, warns: 0, color: '#D97706' },
  { id: 6, name: '정현우', email: 'hyunwoo@yonsei.ac.kr', school: '연세대', dept: '소프트웨어학과', verified: true, status: 'active', joinDate: '2025-07-14', lastLogin: '1시간 전', posts: 34, warns: 1, color: '#2563EB' },
];

export default function UserManagementPage() {
  const [selectedUser, setSelectedUser] = useState(users[0]);
  const [filter, setFilter] = useState('all');

  return (
    <>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>유저 관리</h1>
          <p className={styles.pageSubtitle}>전체 회원 현황 및 제재/인증 관리를 수행합니다.</p>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsRow}>
        {statCards.map((s, i) => (
          <div key={i} className={styles.statCard}>
            <div className={styles.statTop}>
              <div className={`${styles.statIcon} ${styles[s.iconClass]}`}>{s.icon}</div>
              <span className={styles.statChange}>{s.change}</span>
            </div>
            <div className={styles.statLabel}>{s.label}</div>
            <div className={styles.statValue}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className={styles.layout}>
        <div>
          {/* Toolbar */}
          <div className={styles.toolbar}>
            <div className={styles.searchWrap}>
              <Search size={16} className={styles.searchIcon} />
              <input className={styles.searchInput} placeholder="유저 이름, 이메일, 학교로 검색..." />
            </div>
            {['all', 'verified', 'pending', 'suspended'].map(f => (
              <button
                key={f}
                className={filter === f ? styles.filterBtnActive : styles.filterBtn}
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? '전체' : f === 'verified' ? '인증완료' : f === 'pending' ? '대기' : '제재중'}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className={styles.tableCard}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>유저</th>
                  <th>학교/학과</th>
                  <th>인증</th>
                  <th>상태</th>
                  <th>게시글</th>
                  <th>경고</th>
                  <th>최근 로그인</th>
                  <th>액션</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} onClick={() => setSelectedUser(u)} style={{ cursor: 'pointer' }}>
                    <td>
                      <div className={styles.userCell}>
                        <div className={styles.userAvatar} style={{ background: u.color }}>{u.name[0]}</div>
                        <div className={styles.userInfo}>
                          <div className={styles.userName}>{u.name}</div>
                          <div className={styles.userEmail}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={styles.schoolBadge}>
                        <School size={12} /> {u.school}
                      </span>
                      <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{u.dept}</div>
                    </td>
                    <td>
                      <span className={`${styles.badge} ${u.verified ? styles.badgeVerified : styles.badgePending}`}>
                        {u.verified ? '인증완료' : '미인증'}
                      </span>
                    </td>
                    <td>
                      <span className={`${styles.badge} ${
                        u.status === 'active' ? styles.badgeActive :
                        u.status === 'pending' ? styles.badgePending :
                        styles.badgeSuspended
                      }`}>
                        {u.status === 'active' ? '활성' : u.status === 'pending' ? '대기' : '정지'}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{u.posts}</td>
                    <td>
                      {u.warns > 0 ? (
                        <span className={`${styles.badge} ${styles.badgeSuspended}`}>{u.warns}회</span>
                      ) : (
                        <span style={{ color: '#9CA3AF' }}>-</span>
                      )}
                    </td>
                    <td style={{ fontSize: 13, color: '#6B7280' }}>{u.lastLogin}</td>
                    <td>
                      <div className={styles.actionBtns}>
                        <button className={styles.actionBtn}><Eye size={14} /></button>
                        <button className={`${styles.actionBtn} ${styles.actionBtnDanger}`}><Ban size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className={styles.pagination}>
              <span className={styles.paginationInfo}>1-6 / 24,893 유저</span>
              <div className={styles.paginationBtns}>
                <button className={styles.pageBtn}><ChevronLeft size={14} /></button>
                <button className={styles.pageBtnActive}>1</button>
                <button className={styles.pageBtn}>2</button>
                <button className={styles.pageBtn}>3</button>
                <button className={styles.pageBtn}>...</button>
                <button className={styles.pageBtn}>4149</button>
                <button className={styles.pageBtn}><ChevronRight size={14} /></button>
              </div>
            </div>
          </div>
        </div>

        {/* Detail Panel */}
        <div className={styles.detailCard}>
          <div className={styles.detailAvatar} style={{ background: selectedUser.color }}>
            {selectedUser.name[0]}
          </div>
          <div className={styles.detailName}>{selectedUser.name}</div>
          <div className={styles.detailEmail}>{selectedUser.email}</div>
          <div className={styles.detailBadgeRow}>
            <span className={`${styles.badge} ${selectedUser.verified ? styles.badgeVerified : styles.badgePending}`}>
              {selectedUser.verified ? '인증완료' : '미인증'}
            </span>
            <span className={`${styles.badge} ${
              selectedUser.status === 'active' ? styles.badgeActive :
              selectedUser.status === 'suspended' ? styles.badgeSuspended :
              styles.badgePending
            }`}>
              {selectedUser.status === 'active' ? '활성' : selectedUser.status === 'suspended' ? '정지' : '대기'}
            </span>
          </div>

          <div className={styles.detailSection}>
            <div className={styles.detailSectionTitle}>기본 정보</div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>학교</span>
              <span className={styles.detailValue}>{selectedUser.school}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>학과</span>
              <span className={styles.detailValue}>{selectedUser.dept}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>가입일</span>
              <span className={styles.detailValue}>{selectedUser.joinDate}</span>
            </div>
          </div>

          <div className={styles.detailSection}>
            <div className={styles.detailSectionTitle}>활동 통계</div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>게시글</span>
              <span className={styles.detailValue}>{selectedUser.posts}개</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>경고 횟수</span>
              <span className={styles.detailValue}>{selectedUser.warns}회</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>최근 로그인</span>
              <span className={styles.detailValue}>{selectedUser.lastLogin}</span>
            </div>
          </div>

          <div className={styles.detailActions}>
            <button className={styles.detailActionBtn}>
              <FileText size={14} /> 활동 로그 보기
            </button>
            <button className={styles.detailActionBtn}>
              <Mail size={14} /> 메시지 발송
            </button>
            <button className={styles.detailActionBtn}>
              <Shield size={14} /> 권한 변경
            </button>
            <button className={styles.detailActionBtnDanger}>
              <AlertTriangle size={14} /> 제재 처리
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
