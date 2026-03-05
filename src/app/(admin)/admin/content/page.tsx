'use client';

import React, { useState } from 'react';
import styles from './BoardManagement.module.css';
import {
  Clock, Save, FolderTree, School, Settings,
  ChevronDown, Building2, FolderOpen, FileText,
  Sparkles, Merge, Move, Trash2, GripVertical,
  Upload, X, CheckCircle,
} from 'lucide-react';

const treeData = {
  name: '한국대학교 (본교)',
  type: 'root' as const,
  badge: 'ADMIN',
  children: [
    {
      name: '공과대학',
      type: 'folder' as const,
      count: '3개 학과',
      children: [
        { name: '컴퓨터공학과', type: 'leaf' as const, active: true, selected: true },
        { name: '전자전기공학부', type: 'leaf' as const },
        { name: '기계공학과', type: 'leaf' as const },
      ],
    },
    { name: '인문대학', type: 'folder' as const, count: '5개 학과', collapsed: true },
    { name: '자연과학대학', type: 'folder' as const, count: '4개 학과', collapsed: true },
    { name: '경영대학', type: 'folder' as const, count: '2개 학과', collapsed: true },
  ],
};

type TreeNode = {
  name: string;
  type: 'root' | 'folder' | 'leaf';
  badge?: string;
  count?: string;
  active?: boolean;
  selected?: boolean;
  collapsed?: boolean;
  children?: TreeNode[];
};

function TreeNodeComponent({ node, depth = 0 }: { node: TreeNode; depth?: number }) {
  const [isOpen, setIsOpen] = useState(!node.collapsed);
  const hasChildren = node.children && node.children.length > 0;

  const iconClass = node.type === 'root' ? styles.treeIconRoot :
    node.type === 'folder' ? styles.treeIconFolder : styles.treeIconLeaf;
  const IconComp = node.type === 'root' ? Building2 :
    node.type === 'folder' ? FolderOpen : FileText;

  return (
    <div className={styles.treeNode}>
      <div className={node.selected ? styles.treeNodeRowSelected : styles.treeNodeRow}>
        {hasChildren ? (
          <div
            className={`${styles.treeToggle} ${isOpen ? styles.treeToggleOpen : styles.treeToggleClosed}`}
            onClick={() => setIsOpen(!isOpen)}
          >
            <ChevronDown size={16} />
          </div>
        ) : (
          <div style={{ width: 20 }} />
        )}
        <div className={`${styles.treeIcon} ${iconClass}`}>
          <IconComp size={14} />
        </div>
        <span className={styles.treeLabel}>{node.name}</span>
        {node.badge && (
          <span className={`${styles.treeBadge} ${styles.treeBadgeAdmin}`}>{node.badge}</span>
        )}
        {node.count && (
          <span className={`${styles.treeBadge} ${styles.treeBadgeCount}`}>{node.count}</span>
        )}
        {node.active && (
          <span className={`${styles.treeBadge} ${styles.treeBadgeActive}`}>Active</span>
        )}
        {node.selected && (
          <CheckCircle size={16} className={styles.treeCheck} />
        )}
      </div>
      {hasChildren && isOpen && (
        <div className={styles.treeChildren}>
          {node.children!.map((child, i) => (
            <TreeNodeComponent key={i} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function BoardManagementPage() {
  const [activeTab, setActiveTab] = useState('structure');

  return (
    <>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <div className={styles.pageRefBadges}>
            <span className={styles.refBadge}>FR-054</span>
            <span className={styles.refBadge}>FR-177</span>
          </div>
          <h1 className={styles.pageTitle}>운영자 보드 및 학교 관리</h1>
          <p className={styles.pageSubtitle}>
            트리 구조를 통해 학과와 보드를 직관적으로 관리하고, 신규 학교 정보를 체계적으로 등록합니다.
          </p>
        </div>
        <div className={styles.pageActions}>
          <button className={styles.historyBtn}>
            <Clock size={16} /> 변경 이력
          </button>
          <button className={styles.saveBtn}>
            <Save size={16} /> 전체 저장
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabNav}>
        <button
          className={activeTab === 'structure' ? styles.tabBtnActive : styles.tabBtn}
          onClick={() => setActiveTab('structure')}
        >
          <FolderTree size={16} /> 보드 구조 관리
        </button>
        <button
          className={activeTab === 'school' ? styles.tabBtnActive : styles.tabBtn}
          onClick={() => setActiveTab('school')}
        >
          <School size={16} /> 학교 정보 등록
        </button>
        <button
          className={activeTab === 'settings' ? styles.tabBtnActive : styles.tabBtn}
          onClick={() => setActiveTab('settings')}
        >
          <Settings size={16} /> 고급 설정
        </button>
      </div>

      <div className={styles.mainLayout}>
        {/* Left — Tree */}
        <div>
          <div className={styles.toolbar}>
            <div className={styles.toolbarLabel}>
              <Sparkles size={16} /> 선택한 보드 작업
            </div>
            <div className={styles.toolbarActions}>
              <button className={styles.toolbarBtn}><Merge size={14} /> 보드 통합</button>
              <button className={styles.toolbarBtn}><Move size={14} /> 하위 보드 이동</button>
              <button className={styles.toolbarBtnDelete}><Trash2 size={14} /> 삭제</button>
            </div>
          </div>

          <div className={styles.treeCard}>
            <div className={styles.treeTitleRow}>
              <h2 className={styles.treeTitle}>
                <FolderTree size={18} /> 학과 보드 구조도
              </h2>
              <span className={styles.dragHint}>
                <GripVertical size={14} /> 드래그 앤 드롭으로 이동 가능
              </span>
            </div>
            <TreeNodeComponent node={treeData} />
          </div>
        </div>

        {/* Right — Detail Panel */}
        <div className={styles.detailPanel}>
          {/* Board Detail */}
          <div className={styles.detailCard}>
            <span className={styles.selectedBadge}>Selected</span>
            <h2 className={styles.detailName}>컴퓨터공학과</h2>
            <p className={styles.detailId}>Board ID: 29381</p>

            <div className={styles.detailFieldLabel}>보드 표시 이름</div>
            <input className={styles.detailFieldInput} defaultValue="컴퓨터공학과" />

            <div className={styles.detailStats}>
              <div className={styles.detailStatBox}>
                <div className={styles.detailStatLabel}>총 게시글</div>
                <div className={styles.detailStatValue}>1,248</div>
              </div>
              <div className={styles.detailStatBox}>
                <div className={styles.detailStatLabel}>구독자</div>
                <div className={styles.detailStatValue}>450명</div>
              </div>
            </div>

            <div className={styles.detailToggleRow}>
              <span className={styles.detailToggleLabel}>익명 게시판 활성화</span>
              <div className={styles.toggleActive}>
                <div className={styles.toggleDot} />
              </div>
            </div>

            <button className={styles.detailViewBtn}>상세 설정 보기</button>
          </div>

          {/* School Registration */}
          <div className={styles.schoolCard}>
            <div className={styles.schoolCardHeader}>
              <h3 className={styles.schoolCardTitle}>
                <Building2 size={18} /> 신규 학교 등록
              </h3>
              <span className={styles.schoolStep}>Step 1/2</span>
            </div>

            <div className={styles.schoolFieldLabel}>학교명 *</div>
            <input className={styles.schoolInput} placeholder="예: 한국대학교" />

            <div className={styles.schoolFieldLabelNormal}>학교 로고</div>
            <div className={styles.logoUpload}>
              <div className={styles.logoUploadIcon}>
                <Upload size={20} />
              </div>
              <div>
                <div className={styles.logoUploadText}>이미지를 드래그하거나 클릭하세요</div>
                <div className={styles.logoUploadHint}>SVG, PNG, JPG (최대 2MB)</div>
              </div>
            </div>

            <div className={styles.domainLabel}>
              이메일 도메인 Allowlist
              <span className={styles.domainLabelHint}>학생 인증용</span>
            </div>
            <div className={styles.domainInputRow}>
              <input className={styles.domainInput} placeholder="@hangu.ac.kr" />
              <button className={styles.domainAddBtn}>추가</button>
            </div>
            <div className={styles.domainTags}>
              <span className={styles.domainTag}>
                @hangu.ac.kr <X size={12} className={styles.domainTagRemove} />
              </span>
              <span className={styles.domainTag}>
                @g.hangu.ac.kr <X size={12} className={styles.domainTagRemove} />
              </span>
            </div>
            <div className={styles.domainCount}>도메인 2개 등록됨</div>

            <button className={styles.schoolSubmitBtn}>
              <CheckCircle size={16} /> 학교 등록 완료
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
