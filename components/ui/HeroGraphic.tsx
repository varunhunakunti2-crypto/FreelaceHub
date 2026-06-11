import React from 'react';

interface HeroGraphicProps {
  className?: string;
}

const HeroGraphic: React.FC<HeroGraphicProps> = ({ className }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 800 500" 
      width="100%" 
      height="100%"
      className={className}
    >
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#1e1b4b" />
        </linearGradient>

        <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        
        <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>

        <linearGradient id="glowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
        </linearGradient>

        <filter id="dropShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="10" stdDeviation="8" floodColor="#000000" floodOpacity="0.5" />
        </filter>
        
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <rect width="100%" height="100%" fill="url(#bgGrad)" />

      <g stroke="#ffffff" strokeOpacity="0.04" strokeWidth="1">
        <line x1="100" y1="0" x2="100" y2="500" />
        <line x1="200" y1="0" x2="200" y2="500" />
        <line x1="300" y1="0" x2="300" y2="500" />
        <line x1="400" y1="0" x2="400" y2="500" />
        <line x1="500" y1="0" x2="500" y2="500" />
        <line x1="600" y1="0" x2="600" y2="500" />
        <line x1="700" y1="0" x2="700" y2="500" />
        <line x1="0" y1="100" x2="800" y2="100" />
        <line x1="0" y1="200" x2="800" y2="200" />
        <line x1="0" y1="300" x2="800" y2="300" />
        <line x1="0" y1="400" x2="800" y2="400" />
      </g>

      <circle cx="150" cy="400" r="80" fill="#3b82f6" opacity="0.1" filter="url(#glow)" />
      <circle cx="650" cy="150" r="100" fill="#ec4899" opacity="0.08" filter="url(#glow)" />

      <g transform="translate(480, 230)" filter="url(#dropShadow)">
        <rect x="-140" y="-130" width="280" height="180" rx="20" fill="url(#glowGrad)" filter="url(#glow)" opacity="0.6"/>
        <rect x="-150" y="-120" width="300" height="190" rx="12" fill="#1e293b" stroke="#475569" strokeWidth="3" />
        <rect x="-140" y="-110" width="280" height="165" rx="6" fill="#0f172a" />
        
        <rect x="-125" y="-95" width="70" height="8" rx="4" fill="#3b82f6" opacity="0.8" />
        <circle cx="130" cy="-91" r="5" fill="#ef4444" />
        <circle cx="115" cy="-91" r="5" fill="#eab308" />
        <circle cx="100" cy="-91" r="5" fill="#22c55e" />
        
        <rect x="-125" y="-70" width="120" height="5" rx="2.5" fill="#475569" />
        <rect x="-125" y="-55" width="180" height="5" rx="2.5" fill="#8b5cf6" />
        <rect x="-125" y="-40" width="140" height="5" rx="2.5" fill="#ec4899" />
        <rect x="-125" y="-25" width="90" height="5" rx="2.5" fill="#06b6d4" />

        <circle cx="60" cy="15" r="25" fill="none" stroke="#3b82f6" strokeWidth="6" strokeDasharray="100 40" />
        <path d="M-125 15 L-80 35 L-40 10 L0 30" fill="none" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" />

        <path d="M-150 70 L-170 85 L170 85 L150 70 Z" fill="#475569" />
        <rect x="-40" y="80" width="80" height="5" rx="2.5" fill="#334155" />
        
        <g transform="translate(-160, -140)" filter="url(#dropShadow)">
          <circle cx="0" cy="0" r="28" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
          <path d="M-10 -6 L-16 0 L-10 6 M10 -6 L16 0 L10 6 M-3 10 L3 -10" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        <g transform="translate(160, -90)" filter="url(#dropShadow)">
          <circle cx="0" cy="0" r="28" fill="#1e293b" stroke="#ec4899" strokeWidth="2" />
          <path d="M-8 8 L-8 2 L6 -12 L12 -6 L2 8 Z M2 -8 L8 -2" fill="none" stroke="#ec4899" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="-8" cy="8" r="2" fill="#ec4899" />
        </g>

        <g transform="translate(150, 40)" filter="url(#dropShadow)">
          <circle cx="0" cy="0" r="28" fill="#1e293b" stroke="#22c55e" strokeWidth="2" />
          <path d="M-6 12 L-2 8 L2 8 L6 12 M-2 -12 C-2 -12 8 -8 8 2 L4 6 L-4 6 L-8 2 C-8 -8 -2 -12 -2 -12 Z" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinejoin="round"/>
          <path d="M-4 6 L-6 10 L-2 8 M4 6 L6 10 L2 8" fill="none" stroke="#22c55e" strokeWidth="2" />
        </g>

        <g transform="translate(-170, 10)" filter="url(#dropShadow)">
          <circle cx="0" cy="0" r="28" fill="#1e293b" stroke="#eab308" strokeWidth="2" />
          <path d="M-12 10 L-12 -2 M-4 10 L-4 -10 M4 10 L4 2 M12 10 L12 -6" stroke="#eab308" strokeWidth="3" strokeLinecap="round" />
        </g>

        <path d="M-60 -150 L-57 -143 L-50 -140 L-57 -137 L-60 -130 L-63 -137 L-70 -140 L-63 -143 Z" fill="#ffffff" opacity="0.7" />
        <path d="M80 -160 L82 -154 L88 -152 L82 -150 L80 -144 L78 -150 L72 -152 L78 -154 Z" fill="#eab308" opacity="0.6" />
        <path d="M0 120 L2 124 L6 126 L2 128 L0 132 L-2 128 L-6 126 L-2 124 Z" fill="#06b6d4" opacity="0.8" />
      </g>
    </svg>
  );
};

export default HeroGraphic;
