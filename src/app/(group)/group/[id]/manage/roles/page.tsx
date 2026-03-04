'use client';

import React, { useState } from 'react';
import styles from './Roles.module.css';
import {
  ChevronRight, AlertTriangle, Users, Filter, ArrowUpDown,
  ChevronDown, MoreVertical, BadgeCheck, Info,
  ChevronLeft, Award,
} from 'lucide-react';

const colors = [
  { name: 'indigo', bg: '#EEF2FF', active: '#4051B5', dot: '#4051B5' },
  { name: 'rose', bg: '#FFF1F2', active: '#E11D48', dot: '#E11D48' },
  { name: 'emerald', bg: '#ECFDF5', active: '#059669', dot: '#059669' },
  { name: 'amber', bg: '#FFFBEB', active: '#D97706', dot: '#D97706' },
  { name: 'purple', bg: '#F5F3FF', active: '#7C3AED', dot: '#7C3AED' },
  { name: 'sky', bg: '#F0F9FF', active: '#0284C7', dot: '#0284C7' },
  { name: 'slate', bg: '#F1F5F9', active: '#475569', dot: '#475569' },
];

const members = [
  {
    name: '김철수',
    dept: '컴퓨터공학과 19학번',
    role: '오너',
    isOwner: true,
    title: { text: '스터디장', bg: '#FFFBEB', color: '#92400E', border: '#FDE68A' },
  },
  {
    name: '이영희',
    dept: '시각디자인과 20학번',
    role: '관리자',
    title: { text: '금손', bg: '#F5F3FF', color: '#6D28D9', border: '#DDD6FE' },
  },
  {
    name: '박지민',
    dept: '경영학과 21학번',
    role: '멤버',
    title: null,
  },
  {
    name: '최준호',
    dept: '산업공학과 20학번',
    role: '멤버',
    title: { text: '새싹', bg: '#ECFDF5', color: '#065F46', border: '#A7F3D0' },
  },
];

export default function RolesPermissionsPage() {
  const [selectedColor, setSelectedColor] = useState('indigo');
  const [titleName, setTitleName] = useState('분위기 메이커');

  const activeColor = colors.find(c => c.name === selectedColor) || colors[0];

  return (
    <div className={styles.page}>
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb}>
        <span className={styles.breadcrumbLink}>내 그룹</span>
        <ChevronRight size={14} className={styles.breadcrumbSep} />
        <span className={styles.breadcrumbLink}>코딩 스터디</span>
        <ChevronRight size={14} className={styles.breadcrumbSep} />
        <span className={styles.breadcrumbCurrent}>멤버 관리</span>
      </nav>

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.headerInfo}>
            <h1 className={styles.headerTitle}>
              멤버 권한 및 <span className={styles.headerTitleAccent}>직책 관리</span>
            </h1>
            <p className={styles.headerDesc}>
              그룹의 질서를 위해 멤버들의 역할과 권한을 설정하고, 특별한 멤버에게 새로운 직책 배지를 부여하여 동기를 부여하세요.
            </p>
          </div>
          <button className={styles.delegateBtn}>
            <AlertTriangle size={18} />
            그룹장 위임
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className={styles.grid}>
        {/* Left: Members Table */}
        <div className={styles.membersSection}>
          <div className={styles.membersSectionHeader}>
            <div className={styles.membersSectionTitle}>
              <Users size={20} style={{ color: '#4051B5' }} />
              멤버 목록 <span className={styles.membersBadge}>14명</span>
            </div>
            <div className={styles.membersFilterBtns}>
              <button className={styles.membersFilterBtn}><Filter size={20} /></button>
              <button className={styles.membersFilterBtn}><ArrowUpDown size={20} /></button>
            </div>
          </div>

          <div className={styles.tableCard}>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr className={styles.tableHead}>
                    <th style={{ width: 64 }}>프로필</th>
                    <th>이름 (소속)</th>
                    <th style={{ width: 160 }}>현재 역할</th>
                    <th style={{ width: 160 }}>커스텀 직책</th>
                    <th style={{ width: 60 }}></th>
                  </tr>
                </thead>
                <tbody className={styles.tableBody}>
                  {members.map((member, idx) => (
                    <tr key={idx}>
                      <td>
                        <div className={member.isOwner ? styles.memberAvatarOwner : styles.memberAvatar}>
                          <div style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, hsl(${idx * 70 + 200}, 60%, 65%), hsl(${idx * 70 + 240}, 70%, 55%))`,
                          }} />
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className={styles.memberName}>
                            {member.name}
                            {member.isOwner && <BadgeCheck size={14} style={{ color: '#4051B5' }} />}
                          </div>
                          <div className={styles.memberDept}>{member.dept}</div>
                        </div>
                      </td>
                      <td>
                        {member.isOwner ? (
                          <span className={styles.ownerBadge}>오너</span>
                        ) : (
                          <div className={styles.roleDropdown}>
                            <button className={styles.roleDropdownBtn} style={{
                              color: member.role === '관리자' ? '#4051B5' : '#4B5563',
                            }}>
                              {member.role}
                              <ChevronDown size={14} style={{ color: '#9CA3AF' }} />
                            </button>
                          </div>
                        )}
                      </td>
                      <td>
                        {member.title ? (
                          <span
                            className={styles.titleBadge}
                            style={{
                              background: member.title.bg,
                              color: member.title.color,
                              border: `1px solid ${member.title.border}`,
                            }}
                          >
                            {member.title.text}
                          </span>
                        ) : (
                          <span className={styles.titleBadgeEmpty}>—</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {member.isOwner ? (
                          <button className={styles.moreBtnDisabled} disabled>
                            <MoreVertical size={18} />
                          </button>
                        ) : (
                          <button className={styles.moreBtn}>
                            <MoreVertical size={18} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.tablePagination}>
              <p className={styles.paginationInfo}>
                전체 <span className={styles.paginationInfoBold}>14</span>명 중{' '}
                <span className={styles.paginationInfoBold}>1</span> -{' '}
                <span className={styles.paginationInfoBold}>4</span> 표시
              </p>
              <nav className={styles.paginationNav}>
                <button className={styles.paginationArrow} style={{ borderRadius: '6px 0 0 6px' }}>
                  <ChevronLeft size={16} />
                </button>
                <button className={styles.paginationBtnActive}>1</button>
                <button className={styles.paginationBtn}>2</button>
                <button className={styles.paginationBtn}>3</button>
                <button className={styles.paginationArrow} style={{ borderRadius: '0 6px 6px 0' }}>
                  <ChevronRight size={16} />
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className={styles.sidebarCol}>
          {/* Create Custom Title */}
          <div className={styles.createTitleCard}>
            <div className={styles.createTitleGlow} />
            <div className={styles.createTitleHeader}>
              <div className={styles.createTitleTitle}>
                <Award size={20} style={{ color: '#4051B5' }} />
                커스텀 직책 만들기
              </div>
              <p className={styles.createTitleDesc}>
                멤버들에게 특별한 역할을 부여해보세요.<br />
                직책 이름과 배지 색상을 설정할 수 있습니다.
              </p>
            </div>

            <div className={styles.createTitleForm}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>직책 이름</label>
                <input
                  className={styles.formInput}
                  placeholder="예: 분위기 메이커"
                  value={titleName}
                  onChange={e => setTitleName(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>배지 색상 선택</label>
                <div className={styles.colorGrid}>
                  {colors.map(c => (
                    <button
                      key={c.name}
                      className={selectedColor === c.name ? styles.colorOptionActive : styles.colorOption}
                      style={{
                        background: c.bg,
                        borderColor: selectedColor === c.name ? c.active : 'transparent',
                      }}
                      onClick={() => setSelectedColor(c.name)}
                    >
                      <div
                        className={styles.colorDot}
                        style={{
                          background: c.dot,
                          opacity: selectedColor === c.name ? 1 : 0,
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.previewSection}>
                <div className={styles.previewLabel}>미리보기</div>
                <div className={styles.previewBox}>
                  <span
                    className={styles.previewBadge}
                    style={{
                      background: activeColor.bg,
                      color: activeColor.active,
                      border: `1px solid ${activeColor.active}30`,
                    }}
                  >
                    {titleName || '직책 이름'}
                  </span>
                </div>
              </div>

              <button className={styles.createSubmitBtn}>직책 생성하기</button>
            </div>
          </div>

          {/* Info Card */}
          <div className={styles.infoCard}>
            <h4 className={styles.infoCardTitle}>
              <Info size={16} />
              권한 안내
            </h4>
            <ul className={styles.infoCardList}>
              <li className={styles.infoCardItem}>
                <span className={styles.infoCardDot} />
                <span><span className={styles.infoCardBold}>오너:</span> 모든 권한 보유, 그룹 삭제 가능</span>
              </li>
              <li className={styles.infoCardItem}>
                <span className={styles.infoCardDot} />
                <span><span className={styles.infoCardBold}>관리자:</span> 멤버 관리, 게시글 관리 가능</span>
              </li>
              <li className={styles.infoCardItem}>
                <span className={styles.infoCardDot} />
                <span><span className={styles.infoCardBold}>멤버:</span> 게시글 작성 및 댓글 작성 가능</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
