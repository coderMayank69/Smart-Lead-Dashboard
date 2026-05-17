import React from 'react';

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "w-8 h-8", ...props }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <rect width="100" height="100" rx="24" fill="white" />
      <path 
        d="M65 30 L65 50 L45 50 L45 65 L65 65 L65 55 L80 70 L65 85 L65 75 L35 75 L35 55 L55 55 L55 40 L35 40 L35 50 L20 35 L35 20 L35 30 Z" 
        fill="url(#blueGrad)" 
      />
      <defs>
        <linearGradient id="blueGrad" x1="20" y1="85" x2="80" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3B82F6" />
          <stop offset="1" stopColor="#2563EB" />
        </linearGradient>
      </defs>
    </svg>
  );
};
