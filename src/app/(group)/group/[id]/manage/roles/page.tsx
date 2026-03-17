'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AlertTriangle, Award, BadgeCheck, ChevronRight, Info, Users } from 'lucide-react';
import { AuthRequiredOverlay } from '@/components/ui/AuthRequiredOverlay';
import { ApiError, GroupMember, GroupRole, cluverseApi, formatRelativeTime } from '@/lib/cluverse-api';
import styles from './Roles.module.css';

export default function RolesPermissionsPage() {
  const params = useParams<{ id: string }>();
  const groupId = Number(params.id);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [roles, setRoles] = useState<GroupRole[]>([]);
  const [titleName, setTitleName] = useState('');
  const [authRequired, setAuthRequired] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const [memberResult, roleResult] = await Promise.all([
      cluverseApi.getGroupMembers(groupId),
      cluverseApi.getGroupRoles(groupId),
    ]);
    setMembers(memberResult);
    setRoles(roleResult);
  };

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const [memberResult, roleResult] = await Promise.all([
          cluverseApi.getGroupMembers(groupId),
          cluverseApi.getGroupRoles(groupId),
        ]);
        if (cancelled) {
          return;
        }
        setMembers(memberResult);
        setRoles(roleResult);
        setAuthRequired(false);
        setError(null);
      } catch (caught) {
        if (cancelled) {
          return;
        }
        if (caught instanceof ApiError && caught.statusCode === 401) {
          setAuthRequired(true);
          return;
        }
        setError(caught instanceof Error ? caught.message : '권한 정보를 불러오지 못했습니다.');
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [groupId]);

  const handleCreateRole = async () => {
    if (!titleName.trim()) {
      return;
    }
    await cluverseApi.createGroupRole(groupId, {
      title: titleName.trim(),
      displayOrder: roles.length + 1,
    });
    setTitleName('');
    await load();
  };

  const handleAssign = async (memberId: number, role: string, customTitleId: number | null) => {
    await cluverseApi.updateGroupMember(groupId, memberId, {
      role,
      customTitleId,
      reason: '관리 화면에서 권한 조정',
    });
    await load();
  };

  return (
    <AuthRequiredOverlay active={authRequired}>
      <div className={styles.page}>
        <nav className={styles.breadcrumb}>
          <span className={styles.breadcrumbLink}>내 그룹</span>
          <ChevronRight size={14} className={styles.breadcrumbSep} />
          <span className={styles.breadcrumbCurrent}>멤버 권한 관리</span>
        </nav>

        <div className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.headerInfo}>
              <h1 className={styles.headerTitle}>멤버 권한 및 직책 관리</h1>
              <p className={styles.headerDesc}>
                <code>/api/v1/groups/{"{groupId}"}/members</code>, <code>/roles</code>를 사용해 실제 권한과 커스텀 직책을 조정합니다.
              </p>
            </div>
            <button className={styles.delegateBtn} type="button">
              <AlertTriangle size={18} />
              그룹장 위임은 별도 확인 후 진행
            </button>
          </div>
        </div>

        <div className={styles.grid}>
          <div className={styles.membersSection}>
            <div className={styles.membersSectionHeader}>
              <div className={styles.membersSectionTitle}>
                <Users size={20} style={{ color: '#4051B5' }} />
                멤버 목록 <span className={styles.membersBadge}>{members.length}명</span>
              </div>
            </div>

            <div className={styles.tableCard}>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr className={styles.tableHead}>
                      <th style={{ width: 64 }}>프로필</th>
                      <th>이름</th>
                      <th style={{ width: 160 }}>현재 역할</th>
                      <th style={{ width: 180 }}>커스텀 직책</th>
                    </tr>
                  </thead>
                  <tbody className={styles.tableBody}>
                    {members.map(member => (
                      <tr key={member.memberId}>
                        <td>
                          <div className={member.role === 'OWNER' ? styles.memberAvatarOwner : styles.memberAvatar}>
                            {member.profileImageUrl ? <img src={member.profileImageUrl} alt={member.nickname} style={{ width: '100%', height: '100%', borderRadius: '50%' }} /> : null}
                          </div>
                        </td>
                        <td>
                          <div>
                            <div className={styles.memberName}>
                              {member.nickname}
                              {member.role === 'OWNER' ? <BadgeCheck size={14} style={{ color: '#4051B5' }} /> : null}
                            </div>
                            <div className={styles.memberDept}>가입 {formatRelativeTime(member.joinedAt)}</div>
                          </div>
                        </td>
                        <td>
                          <select
                            className={styles.roleDropdownBtn}
                            value={member.role}
                            onChange={event => handleAssign(member.memberId, event.target.value, member.customTitleId)}
                            disabled={member.role === 'OWNER'}
                          >
                            <option value="OWNER">오너</option>
                            <option value="ADMIN">관리자</option>
                            <option value="MEMBER">멤버</option>
                          </select>
                        </td>
                        <td>
                          <select
                            className={styles.roleDropdownBtn}
                            value={member.customTitleId ?? ''}
                            onChange={event => handleAssign(member.memberId, member.role, event.target.value ? Number(event.target.value) : null)}
                            disabled={member.role === 'OWNER'}
                          >
                            <option value="">없음</option>
                            {roles.map(role => (
                              <option key={role.groupRoleId} value={role.groupRoleId}>
                                {role.title}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className={styles.sidebarCol}>
            <div className={styles.createTitleCard}>
              <div className={styles.createTitleHeader}>
                <div className={styles.createTitleTitle}>
                  <Award size={20} style={{ color: '#4051B5' }} />
                  커스텀 직책 만들기
                </div>
              </div>

              <div className={styles.createTitleForm}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>직책 이름</label>
                  <input
                    className={styles.formInput}
                    placeholder="예: 운영진"
                    value={titleName}
                    onChange={event => setTitleName(event.target.value)}
                  />
                </div>

                <div className={styles.previewSection}>
                  <div className={styles.previewLabel}>현재 직책</div>
                  <div className={styles.previewBox}>
                    {roles.map(role => (
                      <span key={role.groupRoleId} className={styles.previewBadge}>
                        {role.displayOrder}. {role.title}
                      </span>
                    ))}
                  </div>
                </div>

                <button className={styles.createSubmitBtn} onClick={handleCreateRole} type="button">
                  직책 생성하기
                </button>
                {error ? <p style={{ color: '#b91c1c' }}>{error}</p> : null}
              </div>
            </div>

            <div className={styles.infoCard}>
              <h4 className={styles.infoCardTitle}>
                <Info size={16} />
                권한 안내
              </h4>
              <ul className={styles.infoCardList}>
                <li className={styles.infoCardItem}><code>OWNER</code>는 수정 불가로 잠가두었습니다.</li>
                <li className={styles.infoCardItem}>멤버 역할 변경은 <code>/members/{"{memberId}"}</code> PATCH를 사용합니다.</li>
                <li className={styles.infoCardItem}>직책 생성은 <code>POST /roles</code>를 사용합니다.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AuthRequiredOverlay>
  );
}
