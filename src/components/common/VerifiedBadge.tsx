import React from 'react';

interface VerifiedBadgeProps {
  className?: string;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} shrink-0 inline-block`}
    aria-label="Verified Account"
  >
    <path
      d="M10.29 2.308a2.5 2.5 0 0 1 3.42 0l.91.82a2.5 2.5 0 0 0 2.21.61l1.2-.24a2.5 2.5 0 0 1 2.92 1.69l.41 1.15a2.5 2.5 0 0 0 1.62 1.55l1.17.37a2.5 2.5 0 0 1 1.69 2.92l-.24 1.2a2.5 2.5 0 0 0 .61 2.21l.82.91a2.5 2.5 0 0 1 0 3.42l-.82.91a2.5 2.5 0 0 0-.61 2.21l.24 1.2a2.5 2.5 0 0 1-1.69 2.92l-1.17.37a2.5 2.5 0 0 0-1.62 1.55l-.41 1.15a2.5 2.5 0 0 1-2.92 1.69l-1.2-.24a2.5 2.5 0 0 0-2.21.61l-.91.82a2.5 2.5 0 0 1-3.42 0l-.91-.82a2.5 2.5 0 0 0-2.21-.61l-1.2.24a2.5 2.5 0 0 1-2.92-1.69l-.41-1.15a2.5 2.5 0 0 0-1.62-1.55l-1.17-.37a2.5 2.5 0 0 1-1.69-2.92l.24-1.2a2.5 2.5 0 0 0-.61-2.21l-.82-.91a2.5 2.5 0 0 1 0-3.42l.82-.91a2.5 2.5 0 0 0 .61-2.21l-.24-1.2a2.5 2.5 0 0 1 1.69-2.92l1.17-.37a2.5 2.5 0 0 0 1.62-1.55l.41-1.15a2.5 2.5 0 0 1 2.92-1.69l1.2.24a2.5 2.5 0 0 0 2.21-.61l.91-.82Z"
      fill="#3B82F6"
    />
    <path
      d="m8.5 12 2.5 2.5 5-5"
      stroke="#FFFFFF"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
