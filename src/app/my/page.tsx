import { TopAppBar } from '@/components/ui/TopAppBar';
import { Toggle } from '@/components/ui/Toggle';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BottomNav } from '@/components/ui/BottomNav';

export default function MyProfileSettings() {
  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', paddingBottom: '80px' }}>
      <TopAppBar 
        title="나의 프로필 설정" 
        showBack
      />

      <div style={{ padding: '24px 16px', background: 'white', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ 
            width: '64px', height: '64px', borderRadius: '50%', background: '#E2E8F0', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px'
          }}>
            NE
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px 0' }}>Neo</h2>
            <div style={{ display: 'flex', gap: '6px' }}>
              <Badge variant="school" label="서울대학교" />
              <Badge variant="major" label="컴퓨터공학과" />
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '16px', background: 'white', marginBottom: '12px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0F172A', marginBottom: '16px' }}>
          개인정보 공개 설정
        </h3>
        <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '24px' }}>
           이름/닉네임은 필수 공개이며, 나머지 정보를 선택적으로 비공개할 수 있습니다.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '15px', fontWeight: 500, color: '#334155' }}>전체 프로필 공개 여부</span>
            <Toggle checked={true} onChange={() => {}} />
          </div>
          
          <div style={{ height: '1px', background: '#F1F5F9' }}></div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '15px', color: '#334155' }}>소속 대학교</span>
            <Toggle checked={true} onChange={() => {}} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '15px', color: '#334155' }}>주/복수/부전공 목록</span>
            <Toggle checked={false} onChange={() => {}} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '15px', color: '#334155' }}>등록된 관심 태그</span>
            <Toggle checked={true} onChange={() => {}} />
          </div>
        </div>
      </div>

      <div style={{ padding: '0 16px', marginTop: '24px' }}>
        <Button variant="outline" fullWidth style={{ borderColor: '#EF4444', color: '#EF4444' }}>
          로그아웃
        </Button>
      </div>
      
      <BottomNav activeTab="my" onTabChange={() => {}} />
    </div>
  );
}
