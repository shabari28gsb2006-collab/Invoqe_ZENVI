import React from 'react';

interface ZenviLogoProps {
  className?: string;
  showWordmark?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'white';
}

export const ZenviLogo: React.FC<ZenviLogoProps> = ({
  className = '',
  showWordmark = true,
  size = 'md',
}) => {
  const sizeMap = {
    sm: { icon: 24, text: 'text-lg', dot: 'w-1 h-1' },
    md: { icon: 32, text: 'text-xl', dot: 'w-1.5 h-1.5' },
    lg: { icon: 42, text: 'text-2xl', dot: 'w-2 h-2' },
    xl: { icon: 54, text: 'text-3xl', dot: 'w-2.5 h-2.5' },
  };

  const current = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Abstract Orbit Connection Symbol */}
      <div className="relative flex items-center justify-center shrink-0">
        <svg
          width={current.icon}
          height={current.icon}
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 hover:rotate-12"
        >
          <defs>
            <linearGradient id="zenviGrad" x1="4" y1="4" x2="40" y2="40" gradientUnits="userSpaceOnUse">
              <stop stopColor="#7667FF" />
              <stop offset="0.5" stopColor="#9384FF" />
              <stop offset="1" stopColor="#3B82F6" />
            </linearGradient>
            <linearGradient id="zenviRing" x1="2" y1="22" x2="42" y2="22" gradientUnits="userSpaceOnUse">
              <stop stopColor="#C4B5FD" />
              <stop offset="0.5" stopColor="#7667FF" />
              <stop offset="1" stopColor="#38BDF8" />
            </linearGradient>
          </defs>

          {/* Central orb */}
          <circle cx="22" cy="22" r="13" fill="url(#zenviGrad)" />
          
          {/* Subtle inner highlight */}
          <circle cx="18" cy="18" r="4.5" fill="#FFFFFF" fillOpacity="0.45" />

          {/* Planetary orbital ring */}
          <ellipse
            cx="22"
            cy="22"
            rx="20"
            ry="7.5"
            transform="rotate(-28 22 22)"
            stroke="url(#zenviRing)"
            strokeWidth="2.75"
            strokeLinecap="round"
          />

          {/* Connection node satellite */}
          <circle cx="37" cy="14" r="2.5" fill="#60A5FA" />
          <circle cx="7" cy="30" r="1.8" fill="#A78BFA" />
        </svg>
      </div>

      {showWordmark && (
        <div className="flex flex-col leading-none">
          <span
            className={`font-extrabold tracking-wider text-slate-900 dark:text-white ${current.text}`}
            style={{ letterSpacing: '0.08em' }}
          >
            ZENVI
          </span>
        </div>
      )}
    </div>
  );
};
