import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LoginPage() {
  return (
    <div style={{ padding: '24px', maxWidth: '400px', margin: '0 auto', marginTop: '10vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '28px', color: '#0F172A', marginBottom: '8px' }}>Cluverse</h1>
        <p style={{ color: '#64748B', fontSize: '15px' }}>대학생들의 관심사 기반 협업 네트워크</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Input 
          type="email" 
          placeholder="이메일" 
          fullWidth 
        />
        <Input 
          type="password" 
          placeholder="비밀번호" 
          fullWidth 
        />
        
        <Button variant="primary" size="large" fullWidth style={{ marginTop: '8px' }}>
          로그인
        </Button>
      </div>

      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: '12px',
        marginTop: '32px',
        marginBottom: '32px'
      }}>
        <div style={{ height: '1px', background: '#E2E8F0', flex: 1 }}></div>
        <span style={{ fontSize: '13px', color: '#94A3B8' }}>또는 소셜 로그인</span>
        <div style={{ height: '1px', background: '#E2E8F0', flex: 1 }}></div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Button variant="secondary" fullWidth style={{ background: '#FEE500', color: '#000000' }}>
          카카오로 시작하기
        </Button>
        <Button variant="outline" fullWidth>
          Google로 시작하기
        </Button>
      </div>

      <div style={{ textAlign: 'center', marginTop: '32px', fontSize: '14px', color: '#64748B' }}>
        계정이 없으신가요? <a href="/signup" style={{ color: '#3B82F6', fontWeight: 600, textDecoration: 'none' }}>회원가입</a>
      </div>
    </div>
  );
}
