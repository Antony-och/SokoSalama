import React from 'react';
import iconLogo from '../assets/images/logo/Icon_Logo_Transparent.png';
import textLogo from '../assets/images/logo/Text_Logo_Cropped.png';

interface BrandLogoProps {
  name?: string;
  size?: 'navbar' | 'footer' | 'auth';
}

const sizeClasses = {
  navbar: { icon: 'h-9 w-9 sm:h-10 sm:w-10', text: 'h-12 w-32 sm:h-14 sm:w-36' },
  footer: { icon: 'h-10 w-10', text: 'h-14 w-36' },
  auth: { icon: 'h-8 w-8', text: 'h-10 w-28' },
};

export const BrandLogo: React.FC<BrandLogoProps> = ({ name = 'Soko Salama', size = 'navbar' }) => (
  <span className="inline-flex shrink-0 items-center gap-0.5 sm:gap-1" role="img" aria-label={name}>
    <img src={iconLogo} alt="" className={`${sizeClasses[size].icon} shrink-0 object-contain`} />
    <span className={`${sizeClasses[size].text} relative block shrink-0 overflow-hidden`}>
      <img src={textLogo} alt="" className="h-full w-full object-contain" />
    </span>
  </span>
);
