'use client';

import React from 'react';
import { Construction } from 'lucide-react';

interface UnderConstructionModalProps {
  onClose: () => void;
}

export default function UnderConstructionModal({ onClose }: UnderConstructionModalProps) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '16px',
      backgroundColor: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(4px)',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
        maxWidth: '448px',
        width: '100%',
        padding: '32px',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid #F3F4F6',
      }}>
        {/* Decorative glows */}
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '128px', height: '128px', background: 'rgba(245,158,11,0.1)', borderRadius: '50%', filter: 'blur(32px)' }} />
        <div style={{ position: 'absolute', bottom: '-40px', left: '-40px', width: '128px', height: '128px', background: 'rgba(239,68,68,0.1)', borderRadius: '50%', filter: 'blur(32px)' }} />
        
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
          <div style={{
            margin: '0 auto 24px',
            width: '64px', height: '64px',
            background: '#FFFBEB',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '4px solid #FEF3C7',
          }}>
            <Construction size={28} color="#D97706" />
          </div>
          
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>
            준비 중인 기능입니다
          </h2>
          <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '24px', lineHeight: 1.6 }}>
            더 나은 서비스를 제공하기 위해 열심히 기획/개발 중입니다.<br/>
            조금만 기다려주시면 멋진 기능으로 찾아오겠습니다!
          </p>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={onClose}
              style={{
                width: '100%', padding: '12px',
                background: '#4051B5', color: 'white',
                borderRadius: '12px', fontWeight: 700, fontSize: '14px',
                border: 'none', cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(64,81,181,0.2)',
                transition: 'background 0.2s',
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#313e93'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4051B5'}
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
