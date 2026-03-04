'use client';

import React, { useState } from 'react';
import { Wrench, X } from 'lucide-react';

interface MaintenanceModalProps {
  onClose: () => void;
}

export default function MaintenanceModal({ onClose }: MaintenanceModalProps) {
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
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '128px', height: '128px', background: 'rgba(64,81,181,0.1)', borderRadius: '50%', filter: 'blur(32px)' }} />
        <div style={{ position: 'absolute', bottom: '-40px', left: '-40px', width: '128px', height: '128px', background: 'rgba(0,229,255,0.1)', borderRadius: '50%', filter: 'blur(32px)' }} />
        
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
          <div style={{
            margin: '0 auto 24px',
            width: '64px', height: '64px',
            background: '#F3F4F6',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Wrench size={32} color="#6B7280" />
          </div>
          
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>
            현재 시스템 점검 중입니다
          </h2>
          <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '24px', lineHeight: 1.6 }}>
            보다 안정적인 서비스 제공을 위해 서버 점검을 진행하고 있습니다.<br/>
            점검 중에는 글쓰기 및 일부 기능 사용이 제한됩니다.
          </p>
          
          <div style={{
            background: '#F9FAFB',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
            textAlign: 'left',
            border: '1px solid #F3F4F6',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280' }}>점검 일시</span>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>2024.05.20 (월)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280' }}>완료 예정</span>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#4051B5' }}>14:00 ~ 16:00 (2시간)</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
            >
              확인
            </button>
            <a href="#" style={{ fontSize: '14px', color: '#6B7280', textDecoration: 'underline', textUnderlineOffset: '4px' }}>
              고객센터에 문의하기
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
