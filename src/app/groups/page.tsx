import { Badge } from '@/components/ui/Badge';
import { GroupCard } from '@/components/ui/GroupCard';
import { TopAppBar } from '@/components/ui/TopAppBar';
import { BottomNav } from '@/components/ui/BottomNav';

// Mock Data
const mockGroups = [
  {
    id: 1,
    title: 'AI 딥러닝 서비스 개발 프젝',
    description: '이번 학기에 음성인식 기반 생성형 AI 앱을 출시할 초기 3개월 단기 프로젝트 모임입니다. 백엔드 및 디자이너 2명 모집중.',
    category: 'IT/개발',
    tags: ['AI', '사이드프로젝트', '온라인'],
    visibility: 'PUBLIC' as const,
    memberCount: 5,
  },
  {
    id: 2,
    title: '스타트업 공모전 대비 연합 동아리',
    description: '대학별 기획자와 개발자들이 모여 실제 스타트업 필드처럼 업무를 나눠 공모전을 준비하는 연합 동아리입니다. 지원서 제출 후 면접 있습니다.',
    category: '기획/경영',
    tags: ['공모전', '창업', '오프라인'],
    visibility: 'PARTIAL' as const,
    memberCount: 12,
  },
  {
    id: 3,
    title: 'Frontend CS 스터디 3기',
    description: '매주 토요일 오전에 모여 프론트엔드 CS 지식을 딥다이브하는 스터디입니다. 현재 T/O 마감되었습니다.',
    category: 'IT/개발',
    tags: ['스터디', '프론트엔드', '온오프병행'],
    visibility: 'PRIVATE' as const,
    memberCount: 8,
  }
];

export default function GroupsPage() {
  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', paddingBottom: '80px' }}>
      <TopAppBar 
        title="그룹 디렉토리" 
        rightAction={<div style={{ fontSize: '20px', cursor: 'pointer' }}>➕</div>} 
      />

      <div style={{ padding: '16px', background: 'white', marginBottom: '8px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#0F172A', marginBottom: '12px' }}>
          추천 카테고리
        </h2>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
          <Badge variant="school" label="IT/개발" />
          <Badge variant="interest" label="기획/경영" />
          <Badge variant="interest" label="어학/자격증" />
          <Badge variant="interest" label="디자인/예술" />
          <Badge variant="school" label="취업준비" />
        </div>
      </div>

      <div style={{ padding: '16px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#0F172A', marginBottom: '16px' }}>
          전체 모집 중인 그룹
        </h2>
        
        {mockGroups.map(group => (
          <GroupCard
            key={group.id}
            title={group.title}
            description={group.description}
            category={group.category}
            tags={group.tags}
            visibility={group.visibility}
            memberCount={group.memberCount}
          />
        ))}
      </div>

      <BottomNav 
        activeTab="groups"
        onTabChange={() => {}} // Usually router.push('/...')
      />
    </div>
  );
}
