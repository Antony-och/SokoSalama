import React from 'react';
import { Facebook, Instagram, Mail } from 'lucide-react';

export type SocialPlatform = 'Instagram' | 'Facebook' | 'Email' | 'TikTok';

const styles: Record<SocialPlatform, string> = {
  Instagram: 'bg-gradient-to-br from-fuchsia-500 via-rose-500 to-amber-400 text-white',
  Facebook: 'bg-[#1877F2] text-white',
  Email: 'bg-neutral-700 text-white',
  TikTok: 'bg-neutral-950 text-white',
};

export const SocialProfileIcon: React.FC<{ platform: SocialPlatform; className?: string }> = ({ platform, className = 'h-4 w-4' }) => {
  const icon = platform === 'Instagram'
    ? <Instagram className={className} />
    : platform === 'Facebook'
      ? <Facebook className={className} />
      : platform === 'Email'
        ? <Mail className={className} />
        : <svg viewBox="0 0 24 24" className={className} aria-hidden="true"><path fill="#25F4EE" d="M14.2 3v11.1a3.1 3.1 0 1 1-2.3-3V8.7a6.2 6.2 0 1 0 5.5 6.2V9.4c1.4 1 3 1.6 4.6 1.7V7.7c-3.1-.2-5.5-2.1-6-4.7h-1.8Z"/><path fill="#FE2C55" d="M16 3.2c.6 2.6 2.8 4.4 5.5 4.7v3.3c-1.5-.1-2.9-.6-4.1-1.4v5.1a6.2 6.2 0 1 1-6.2-6.2c.3 0 .5 0 .8.1v3.4a3.1 3.1 0 1 0 2.3 3V3.2H16Z"/><path fill="#fff" d="M14.5 3v11.1a3.1 3.1 0 1 1-2.3-3v3.4a.9.9 0 1 0 .1-.3V8.8a6.2 6.2 0 1 0 5.4 6.1V9.4c1.3.9 2.8 1.5 4.2 1.6V7.8c-2.8-.4-5-2.2-5.5-4.8h-1.9Z"/></svg>;

  return <span className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${styles[platform]}`}>{icon}</span>;
};

export const socialProfileHref = (platform: SocialPlatform, value: string) => {
  const address = value.trim();
  if (platform === 'Email' && address && !/^(mailto:|https?:)/i.test(address)) return `mailto:${address}`;
  return address;
};
