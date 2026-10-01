import React from 'react';
import { ShieldCheck, MapPin, Phone, Mail, UserPlus, LogIn } from 'lucide-react';
import { SocialPlatform, SocialProfileIcon, socialProfileHref } from './SocialProfileIcon';
import { readPublicContent } from './publicContent';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  onOpenAuth?: (mode?: 'login' | 'signup') => void;
  siteSettings?: Record<string, unknown>;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAuth, siteSettings = {} }) => {
  const text = (key: string, fallback = '') => typeof siteSettings[key] === 'string' && siteSettings[key] ? String(siteSettings[key]) : fallback;
  const socialLinks = text('socialLinks').split('\n').map((line) => {
    const [label, url] = line.split('|').map((part) => part.trim());
    const platform = ['Instagram', 'Facebook', 'Email', 'TikTok'].find((known) => known.toLowerCase() === label?.toLowerCase()) as SocialPlatform | undefined;
    return label && url ? { label, url: platform ? socialProfileHref(platform, url) : url, platform } : null;
  }).filter((link) => link !== null);
  const legalLinks = [['Terms', text('termsUrl')], ['Privacy', text('privacyPolicyUrl')], ['Returns', text('returnPolicyUrl')]].filter(([, url]) => url);
  const aboutItems = readPublicContent(siteSettings.aboutPageContent);
  const contactItems = readPublicContent(siteSettings.contactPageContent);
  const footerItems = readPublicContent(siteSettings.footerContent);
  const faqItems = readPublicContent(siteSettings.faqContent);
  return (
    <footer className="bg-neutral-900 text-neutral-400 text-xs border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand info */}
          <div className="space-y-3">
            <BrandLogo name={text('marketplaceName', 'Soko Salama')} size="footer" />
            <div className="space-y-2 text-neutral-400 leading-relaxed text-xs">
              {aboutItems.length ? aboutItems.map((item, index) => <p key={`about-${index}`} className="whitespace-pre-line">{item.heading && <span className="mb-0.5 block font-semibold text-neutral-300">{item.heading}</span>}{item.body}</p>) : <p>A Kenyan marketplace connecting independent makers with shoppers across East Africa.</p>}
            </div>
            {footerItems.length > 0 && <ul className="space-y-1 text-neutral-500 leading-relaxed">{footerItems.map((item, index) => <li key={`footer-${index}`} className="whitespace-pre-line">{item.body}</li>)}</ul>}
            {socialLinks.length > 0 && <div className="flex flex-wrap gap-2">{socialLinks.map((link) => <a key={link.label} href={link.url} target={link.platform === 'Email' ? undefined : '_blank'} rel={link.platform === 'Email' ? undefined : 'noreferrer'} aria-label={link.label} title={link.label} className="rounded-xl transition hover:-translate-y-0.5 hover:opacity-80">{link.platform ? <SocialProfileIcon platform={link.platform} /> : <span className="inline-flex h-8 items-center rounded-lg border border-white/15 px-2 text-[11px] text-amber-300">{link.label}</span>}</a>)}</div>}
            {onOpenAuth && (
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 hover:text-amber-300 transition text-left cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Create a Customer Account</span>
                </button>
                <button
                  onClick={() => onOpenAuth('login')}
                  className="inline-flex items-center gap-2 text-xs text-neutral-300 hover:text-white transition text-left cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              </div>
            )}
          </div>

          {/* Site information */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Information</h4>
            {contactItems.map((item, index) => <p key={`contact-${index}`} className="whitespace-pre-line leading-relaxed">{item.heading && <span className="font-semibold text-neutral-300">{item.heading}: </span>}{item.body}</p>)}
            {faqItems.length > 0 && <div className="space-y-2">{faqItems.map((item, index) => <details key={`faq-${index}`}><summary className="cursor-pointer text-neutral-300 hover:text-white">{item.heading || 'Frequently asked questions'}</summary><p className="mt-2 whitespace-pre-line leading-relaxed">{item.body}</p></details>)}</div>}
          </div>

          {/* Trust and Security */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Trust &amp; Security
            </h4>
            <div className="flex items-start gap-2 text-xs leading-relaxed">
              <ShieldCheck className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
              <p><span className="block text-neutral-300 font-medium">Secure Shopping</span>Payments are securely held until your order is successfully processed.</p>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Contact
            </h4>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-neutral-400" />
                <a href={`tel:${text('supportPhone', '+254 700 000 001')}`} className="hover:text-white">{text('supportPhone', '+254 700 000 001')}</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-neutral-400" />
                <a href={`mailto:${text('supportEmail', 'support@sokosalama.co.ke')}`} className="hover:text-white">{text('supportEmail', 'support@sokosalama.co.ke')}</a>
              </div>
              {text('businessEmail') && text('businessEmail') !== text('supportEmail') && <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-neutral-400" /><a href={`mailto:${text('businessEmail')}`} className="hover:text-white">{text('businessEmail')}</a></div>}
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                <span>{text('businessAddress', 'Delta Corner Tower, Westlands, Nairobi')}</span>
              </div>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <div>
            Â© {new Date().getFullYear()} {text('marketplaceName', 'SokoSalama')}. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            {legalLinks.map(([label, url]) => <a key={label} href={url} className="hover:text-neutral-300">{label}</a>)}
            {!legalLinks.length && <span>Terms of Escrow Service</span>}
            <span>Â·</span>
            {!legalLinks.length && <span>Vendor Merchant Policy</span>}
            <span>Â·</span>
            {!legalLinks.length && <span>Buyer Protection</span>}
          </div>
        </div>
      </div>
    </footer>
  );
};

