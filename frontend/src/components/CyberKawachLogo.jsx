import React from 'react';

export default function CyberKawachLogo({ className = "w-8 h-8" }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_10px_rgba(245,158,11,0.4)]">
        <defs>
          <linearGradient id="kawachGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <linearGradient id="coreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>

        <path
          d="M50 10 L84 25 C84 56 50 86 50 90 C50 86 16 56 16 25 Z"
          fill="#0F172A"
          stroke="url(#kawachGrad)"
          strokeWidth="6"
          strokeLinejoin="round"
        />

        <path
          d="M50 24 L72 34 C72 54 50 72 50 75 C50 72 28 54 28 34 Z"
          fill="rgba(245, 158, 11, 0.12)"
          stroke="#F59E0B"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        <circle cx="50" cy="48" r="6.5" fill="url(#coreGrad)" />
        <line x1="50" y1="24" x2="50" y2="41" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="50" y1="55" x2="50" y2="74" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="33" y1="48" x2="43" y2="48" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="57" y1="48" x2="67" y2="48" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}
