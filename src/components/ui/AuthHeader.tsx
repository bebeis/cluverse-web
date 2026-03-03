import React from 'react';
import Link from 'next/link';
import { GraduationCap } from 'lucide-react';

export interface AuthHeaderProps {
  rightElement?: React.ReactNode;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ rightElement }) => {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      width: '100%',
      borderBottom: '1px solid #E2E8F0',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(12px)',
    }}>
      <div style={{
        margin: '0 auto',
        height: '64px',
        maxWidth: '1200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '32px', height: '32px', borderRadius: '8px',
              backgroundColor: '#4F46E5', color: 'white',
              boxShadow: '0 2px 4px rgba(79, 70, 229, 0.2)'
            }}>
              <GraduationCap size={20} strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.025em' }}>
              Cluverse
            </span>
          </Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {rightElement}
        </div>
      </div>
    </header>
  );
};
