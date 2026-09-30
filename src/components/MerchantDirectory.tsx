import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, MapPin, Search, Shield, Star, Store } from 'lucide-react';
import { Vendor } from '../types';

interface MerchantDirectoryProps {
  vendors: Vendor[];
  onSelectVendor: (vendorId: string) => void;
}

const avatarStyles = [
  'bg-amber-100 text-amber-900',
  'bg-emerald-100 text-emerald-900',
  'bg-sky-100 text-sky-900',
  'bg-rose-100 text-rose-900',
  'bg-violet-100 text-violet-900',
];

export const MerchantDirectory: React.FC<MerchantDirectoryProps> = ({ vendors, onSelectVendor }) => {
  const [query, setQuery] = useState('');
  const sliderRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const visibleVendors = vendors.filter((vendor) =>
    `${vendor.name} ${vendor.county} ${vendor.town} ${vendor.bio}`.toLowerCase().includes(query.trim().toLowerCase())
  );

  const moveSlider = (direction: 1 | -1) => {
    const slider = sliderRef.current;
    if (!slider) return;
    const card = slider.querySelector<HTMLElement>('[data-merchant-card]');
    const gap = Number.parseFloat(getComputedStyle(slider).columnGap || '16') || 16;
    const distance = card ? card.offsetWidth + gap : slider.clientWidth;
    const atEnd = slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 8;
    slider.scrollTo({ left: direction > 0 && atEnd ? 0 : Math.max(0, slider.scrollLeft + distance * direction), behavior: 'smooth' });
  };

  useEffect(() => {
    if (visibleVendors.length < 2) return;
    const timer = window.setInterval(() => {
      if (!pausedRef.current) moveSlider(1);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [visibleVendors.length]);

  return (
    <section className="mx-auto max-w-7xl px-4 pb-5 pt-3 sm:px-6 lg:px-8">
      <div className="relative isolate overflow-hidden rounded-3xl border border-white/90 bg-white/65 px-4 py-4 shadow-[0_12px_34px_rgba(28,35,32,0.05)] backdrop-blur-2xl sm:px-6 sm:py-5">
        <div className="pointer-events-none absolute -right-16 -top-24 -z-10 h-56 w-56 rounded-full bg-amber-200/30 blur-3xl" />
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800"><Store className="h-5 w-5" /></div>
            <div className="min-w-0"><div className="flex flex-wrap items-center gap-x-2 gap-y-1"><h2 className="text-base font-bold tracking-tight text-neutral-950 sm:text-lg">Meet our local merchants</h2><span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-800"><CheckCircle2 className="h-3 w-3" /> Verified network</span></div><p className="mt-0.5 text-xs text-neutral-500">Discover {vendors.length} independent Kenyan stores.</p></div>
          </div>
          <div className="flex items-center gap-2">
            <label className="relative hidden sm:block"><Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a store" aria-label="Search merchants" className="w-40 rounded-xl border border-neutral-200 bg-white/85 py-2 pl-9 pr-3 text-xs text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-amber-400 focus:ring-4 focus:ring-amber-100/70 md:w-52" /></label>
            <button type="button" onClick={() => moveSlider(-1)} aria-label="Previous merchants" className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 bg-white/85 text-neutral-700 transition hover:border-amber-200 hover:bg-amber-50"><ChevronLeft className="h-4 w-4" /></button>
            <button type="button" onClick={() => moveSlider(1)} aria-label="Next merchants" className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 bg-white/85 text-neutral-700 transition hover:border-amber-200 hover:bg-amber-50"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
        <label className="relative mb-3 block sm:hidden"><Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search stores by name or location" aria-label="Search merchants" className="w-full rounded-xl border border-neutral-200 bg-white/85 py-2.5 pl-9 pr-3 text-xs text-neutral-900 outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100/70" /></label>

        {visibleVendors.length ? <div ref={sliderRef} onMouseEnter={() => { pausedRef.current = true; }} onMouseLeave={() => { pausedRef.current = false; }} onFocus={() => { pausedRef.current = true; }} onBlur={() => { pausedRef.current = false; }} className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-4">
          {visibleVendors.map((vendor, index) => {
            const monogram = vendor.name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
            return <article data-merchant-card key={vendor.id} className="group flex min-h-[146px] w-[84%] shrink-0 snap-start flex-col rounded-2xl border border-neutral-200/80 bg-white/85 p-3.5 shadow-[0_2px_8px_rgba(28,35,32,0.025)] transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-200 hover:bg-white hover:shadow-[0_14px_30px_rgba(28,35,32,0.08)] sm:w-[calc((100%-1rem)/2)] sm:p-4 xl:w-[calc((100%-2rem)/3)]">
              <div className="flex items-start gap-2.5">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold tracking-wide ${avatarStyles[index % avatarStyles.length]}`}>{monogram}</div>
                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <h4 className="min-w-0 flex-1 text-sm font-bold leading-snug text-neutral-900 transition-colors group-hover:text-amber-900">{vendor.name}</h4>
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-800"><Shield className="h-3 w-3" /> Verified</span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs text-neutral-500"><MapPin className="h-3.5 w-3.5 shrink-0 text-neutral-400" /><span className="truncate">{vendor.town}, {vendor.county}</span><span className="text-neutral-300">·</span><span className="shrink-0">Since {new Date(vendor.joinedAt).getFullYear()}</span></div>
                </div>
              </div>
              <p className="mt-2 line-clamp-2 min-h-[34px] text-[11px] leading-relaxed text-neutral-600">{vendor.bio}</p>
              <div className="mt-auto flex items-center justify-between gap-2 border-t border-neutral-100 pt-2.5">
                <div className="inline-flex items-center gap-1 text-[11px] text-neutral-600"><Star className="h-3 w-3 fill-amber-400 text-amber-500" /><span className="font-semibold text-neutral-800">{vendor.rating.toFixed(1)}</span><span className="text-neutral-400">rating</span></div>
                <button onClick={() => onSelectVendor(vendor.id)} className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold text-amber-800 transition-colors hover:bg-amber-50 hover:text-amber-950">View store <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" /></button>
              </div>
            </article>;
          })}
        </div> : <div className="rounded-2xl border border-dashed border-neutral-300 bg-white/50 px-5 py-12 text-center"><div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-500"><Search className="h-5 w-5" /></div><h4 className="text-sm font-semibold text-neutral-800">No merchants found</h4><p className="mt-1 text-xs text-neutral-500">Try another store name, town, or county.</p><button onClick={() => setQuery('')} className="mt-3 text-xs font-semibold text-amber-800 hover:underline">Clear search</button></div>}
      </div>
    </section>
  );
};
