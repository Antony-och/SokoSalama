import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Shield, 
  Truck, 
  RefreshCw, 
  Star, 
  ArrowRight, 
  Eye, 
  Store, 
  Sparkles, 
  CheckCircle2, 
  ArrowUpDown, 
  Filter,
  Flame,
  Clock,
  Zap,
  Tag,
  Check
} from 'lucide-react';
import { Product, Vendor, HotDeal } from '../types';
import { MerchantDirectory } from './MerchantDirectory';

// ============================================================================
// LIVE TICKING COUNTDOWN COMPONENT (Updates every second)
// ============================================================================
interface DealCountdownProps {
  endsAt: string;
}

export const DealCountdown: React.FC<DealCountdownProps> = ({ endsAt }) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
    totalSeconds: number;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
    totalSeconds: 0,
  });

  useEffect(() => {
    const calculate = () => {
      const diff = new Date(endsAt).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true, totalSeconds: 0 });
        return;
      }
      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      setTimeLeft({ days, hours, minutes, seconds, isExpired: false, totalSeconds });
    };

    calculate();
    const timer = setInterval(calculate, 1000);
    return () => clearInterval(timer);
  }, [endsAt]);

  if (timeLeft.isExpired) {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-400 bg-neutral-900/60 backdrop-blur-md px-2 py-0.5 rounded-md border border-neutral-700/60">
        <Clock className="w-3 h-3 text-neutral-500" />
        <span>Deal Concluded</span>
      </span>
    );
  }

  const isUrgent = timeLeft.totalSeconds < 7200; // < 2 hours
  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div
      className={`inline-flex items-center gap-1 font-mono text-xs font-bold px-2.5 py-1 rounded-lg border backdrop-blur-md shadow-xs transition-colors ${
        isUrgent
          ? 'bg-rose-950/80 text-rose-300 border-rose-500/40 animate-pulse'
          : 'bg-neutral-950/80 text-amber-300 border-amber-500/30'
      }`}
    >
      <Clock className={`w-3.5 h-3.5 ${isUrgent ? 'text-rose-400' : 'text-amber-400'}`} />
      {timeLeft.days > 0 && (
        <>
          <span className="tabular-nums">{timeLeft.days}d</span>
          <span className="text-white/40">:</span>
        </>
      )}
      <span className="tabular-nums">{pad(timeLeft.hours)}</span>
      <span className={isUrgent ? 'text-rose-400/80' : 'text-amber-500/80'}>:</span>
      <span className="tabular-nums">{pad(timeLeft.minutes)}</span>
      <span className={isUrgent ? 'text-rose-400/80' : 'text-amber-500/80'}>:</span>
      <span className="tabular-nums">{pad(timeLeft.seconds)}</span>
    </div>
  );
};

interface CustomerStorefrontProps {
  products: Product[];
  vendors: Vendor[];
  hotDeals?: HotDeal[];
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product, overridePriceKes?: number) => void;
  onFilterByVendor?: (vendorId: string) => void;
  onClaimDeal?: (deal: HotDeal, product: Product) => void;
}

export const CustomerStorefront: React.FC<CustomerStorefrontProps> = ({
  products,
  vendors,
  hotDeals = [],
  onSelectProduct,
  onQuickAdd,
  onClaimDeal,
}) => {
  const [claimedDealId, setClaimedDealId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedVendorFilter, setSelectedVendorFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'discount'>('featured');
  const categories = [
    'All',
    'Phones & Tablets',
    'Electronics & Gadgets',
    'Computers & Laptops',
    'Home & Kitchen',
    'Fashion & Apparel',
    'Beauty & Personal Care',
    'Handcrafted Leather',
    'Kenyan Specialty Coffee',
  ];

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    const list = products.filter((prod) => {
      const matchesCategory = selectedCategory === 'All' || prod.category === selectedCategory;
      const matchesVendor = selectedVendorFilter === 'All' || prod.vendorId === selectedVendorFilter;
      const matchesSearch =
        !searchQuery ||
        prod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (prod.brand && prod.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
        prod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.vendorName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesVendor && matchesSearch;
    });

    return list.sort((a, b) => {
      if (sortBy === 'price-asc') return a.priceKes - b.priceKes;
      if (sortBy === 'price-desc') return b.priceKes - a.priceKes;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'discount') {
        const discA = a.compareAtPriceKes ? (a.compareAtPriceKes - a.priceKes) / a.compareAtPriceKes : 0;
        const discB = b.compareAtPriceKes ? (b.compareAtPriceKes - b.priceKes) / b.compareAtPriceKes : 0;
        return discB - discA;
      }
      return 0; // 'featured' retains natural ranking
    });
  }, [products, selectedCategory, selectedVendorFilter, searchQuery, sortBy]);

  return (
    <div className="relative space-y-12 pb-20 overflow-hidden">
      
      {/* ========================================================================= */}
      {/* AMBIENT BACKGROUND GLOWS FOR GLASS REFRACTION & FROSTING DEPTH */}
      {/* ========================================================================= */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[38rem] h-[38rem] bg-gradient-to-br from-amber-300/18 via-orange-200/12 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-80 right-0 w-[42rem] h-[42rem] bg-gradient-to-bl from-blue-300/15 via-teal-200/12 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[50rem] left-0 w-[38rem] h-[38rem] bg-gradient-to-tr from-purple-300/14 via-indigo-200/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[36rem] h-[36rem] bg-gradient-to-tl from-emerald-300/12 via-amber-200/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION: FROSTED GLASS PAVILION */}
      {/* ========================================================================= */}
      <section className="relative mx-4 sm:mx-6 lg:mx-8 mt-4">
        <div className="relative overflow-hidden rounded-3xl bg-neutral-950/85 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.25)] text-white">
          
          {/* Inner glass luminous accents */}
          <div className="absolute -top-32 -left-32 w-80 h-80 bg-amber-500/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
          
          {/* Specular Top Edge Glare */}
          <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
            
            <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 flex flex-col justify-center relative z-10">
              
              {/* Glass Kicker Capsule */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-amber-300 tracking-wider mb-4 shadow-xs w-fit">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Kenya's Escrow Marketplace</span>
                <span aria-hidden="true" className="text-white/40">Â·</span>
                <span className="text-white/80">Neutral to Every Brand</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4 leading-[1.12] text-balance">
                <>
                Shop Any Product. <br />
                <span className="bg-gradient-to-r from-white via-white/95 to-amber-200 bg-clip-text text-transparent">
                  Protected in Escrow.
                </span>
                </>
              </h1>

              <p className="text-sm sm:text-base text-neutral-300 max-w-xl mb-8 leading-relaxed font-normal">
                <>Order directly from verified Kenyan merchants across Nairobi, Mombasa, and countrywide hubs. 
                From consumer electronics and smartphones to fashion, appliances, and local goods. 
                Your M-Pesa payment is locked in neutral escrow until you inspect and approve delivery.</>
              </p>

              {/* Glass Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 mb-8">
                <a
                  href="#catalog-grid"
                  className="px-6 py-3.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white text-sm font-semibold rounded-xl transition-all shadow-[0_8px_25px_-5px_rgba(217,119,6,0.5)] border border-amber-400/30 inline-flex items-center gap-2 cursor-pointer active:scale-98"
                >
                  <span>Explore Catalog</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="#how-it-works"
                  className="px-5 py-3.5 bg-white/10 hover:bg-white/15 backdrop-blur-md text-white text-sm font-semibold rounded-xl transition-all border border-white/20 inline-flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span>How Escrow Works</span>
                </a>
              </div>

              {/* Glass Floating Proof Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <div className="bg-white/8 hover:bg-white/12 backdrop-blur-md border border-white/15 rounded-xl p-2.5 transition-colors">
                  <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold mb-0.5">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Daraja Escrow</span>
                  </div>
                  <div className="text-[11px] text-neutral-300">Funds locked until delivery</div>
                </div>

                <div className="bg-white/8 hover:bg-white/12 backdrop-blur-md border border-white/15 rounded-xl p-2.5 transition-colors">
                  <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold mb-0.5">
                    <Truck className="w-3.5 h-3.5" />
                    <span>Fargo & G4S</span>
                  </div>
                  <div className="text-[11px] text-neutral-300">Tracked doorstep transit</div>
                </div>

                <div className="bg-white/8 hover:bg-white/12 backdrop-blur-md border border-white/15 rounded-xl p-2.5 transition-colors col-span-2 sm:col-span-1">
                  <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold mb-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>100% KYC Verified</span>
                  </div>
                  <div className="text-[11px] text-neutral-300">Audited local merchants</div>
                </div>
              </div>

            </div>

            {/* Hero Visual Media with Glass Overlay */}
            <div className="lg:col-span-5 relative min-h-[340px] lg:min-h-full overflow-hidden">
              <img src="/src/assets/images/hero_nairobi_crafts_1790583409822.jpg" alt="SokoSalama Kenyan marketplace" referrerPolicy="no-referrer" className="h-full w-full scale-102 object-cover object-center transition-transform duration-700 hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent lg:bg-gradient-to-r lg:from-neutral-950/90 lg:via-transparent lg:to-transparent" />

              {/* Floating Frosted Glass Live Badge */}
              <div className="absolute bottom-6 left-6 right-6 lg:right-auto bg-neutral-950/60 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">
                      Multi-Vendor Cart Split & Escrow Lock
                    </div>
                    <div className="text-[11px] text-neutral-300 truncate">
                      Sub-orders dispatch independently with real-time tracking
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. HOT DEALS & FLASH SALES PAVILION (ADMIN PICKED COUNTDOWN DEALS) */}
      {/* ========================================================================= */}
      {(() => {
        const activeDeals = hotDeals.filter((d) => d.isActive);
        if (activeDeals.length === 0) {
          return (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="relative overflow-hidden bg-white/55 backdrop-blur-2xl rounded-3xl p-8 border border-white/80 shadow-[0_12px_40px_rgba(0,0,0,0.03)] text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 mb-3">
                  <Flame className="w-6 h-6 text-amber-500 animate-pulse" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900 tracking-tight">
                  Hot Deals & Flash Drops
                </h3>
                <p className="text-xs text-neutral-500 max-w-md mx-auto mt-1">
                  New admin flash sales and limited countdown specials are scheduled soon. Check back shortly for exclusive limited-quota prices!
                </p>
              </div>
            </section>
          );
        }

        return (
          <section id="hot-deals" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Luminous Warm Backlight for Frosted Refraction */}
            <div className="absolute -top-10 left-1/3 w-96 h-96 bg-gradient-to-br from-amber-500/15 via-rose-500/12 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="absolute top-1/2 -right-10 w-96 h-96 bg-gradient-to-bl from-orange-400/15 via-amber-300/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

            {/* Master Glass Pavilion */}
            <div className="relative overflow-hidden bg-white/50 hover:bg-white/55 backdrop-blur-3xl rounded-3xl p-6 sm:p-8 lg:p-10 border border-white/85 shadow-[0_20px_50px_rgba(0,0,0,0.04)] space-y-6 transition-colors duration-500">
              
              {/* Top Hairline Amber-Rose Specular Glaze */}
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/70 to-transparent pointer-events-none" />

              {/* Header Deck */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-white/60">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/15 to-rose-500/15 backdrop-blur-md border border-amber-400/30 text-xs font-bold text-amber-800 tracking-wide mb-2 shadow-2xs">
                    <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
                    <span>FLASH SALES & LIMITED DROPS</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight flex items-center gap-2.5">
                    <span>Hot Deals of the Day</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-2xl font-normal leading-relaxed">
                    Admin-curated limited-time offers with live countdown timers and exclusive marketplace savings.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900/5 backdrop-blur-md border border-neutral-200/80 text-xs font-semibold text-neutral-800 shadow-2xs">
                    <Zap className="w-3.5 h-3.5 text-amber-600" />
                    <span>{activeDeals.length} Live Drops Active</span>
                  </div>
                </div>
              </div>

              {/* Deal Cards Grid - Square Redesign */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {activeDeals.map((deal) => {
                  const product = products.find((p) => p.id === deal.productId);
                  if (!product) return null;

                  const isClaimedNow = claimedDealId === deal.id;

                  return (
                    <div
                      key={deal.id}
                      className="group relative bg-white/60 hover:bg-white/75 backdrop-blur-xl rounded-2xl p-4 border border-white/80 hover:border-white shadow-[0_8px_32px_0_rgba(31,38,135,0.06)] hover:shadow-[0_20px_45px_0_rgba(31,38,135,0.12)] transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden"
                    >
                      {/* Top Specular Edge Glaze */}
                      <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none" />

                      {/* Card Header: Badge & Live Countdown Timer */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wide uppercase bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-xs">
                          <Flame className="w-3 h-3 text-amber-200 fill-amber-200" />
                          <span>{deal.badgeText || 'HOT DEAL'}</span>
                        </span>

                        <DealCountdown endsAt={deal.endsAt} />
                      </div>

                      {/* Square Product Image Frame */}
                      <div 
                        onClick={() => onSelectProduct(product)}
                        className="relative w-full aspect-square rounded-xl overflow-hidden bg-neutral-100/50 backdrop-blur-xs mb-3 border border-white/60 cursor-pointer"
                      >
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect fill="%23f4f4f0" width="400" height="400"/><text fill="%23999" font-family="sans-serif" font-size="14" dy="5" font-weight="bold" x="50%" y="50%" text-anchor="middle">Deal Image</text></svg>';
                          }}
                        />

                        {/* Store & Category Overlays */}
                        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-1 pointer-events-none">
                          <span className="bg-neutral-950/75 backdrop-blur-md text-[10px] text-white px-2 py-0.5 rounded-md font-medium truncate max-w-[70%] shadow-xs">
                            {product.vendorName}
                          </span>
                          {product.condition && (
                            <span className="bg-white/90 backdrop-blur-md text-[9px] font-bold text-neutral-800 px-1.5 py-0.5 rounded-md uppercase shadow-xs">
                              {product.condition}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Product Information */}
                      <div className="flex-1 flex flex-col justify-between space-y-2.5">
                        <div>
                          {product.brand && (
                            <div className="text-[10px] font-semibold text-amber-800 tracking-wider uppercase mb-0.5">
                              {product.brand}
                            </div>
                          )}
                          <h3
                            onClick={() => onSelectProduct(product)}
                            className="text-sm font-bold text-neutral-900 group-hover:text-amber-800 transition-colors line-clamp-2 cursor-pointer leading-snug"
                          >
                            {deal.title || product.title}
                          </h3>
                        </div>

                        {/* Price Deck */}
                        <div className="pt-2 border-t border-neutral-100">
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg font-extrabold text-neutral-950 font-mono tracking-tight">
                              KES {deal.dealPriceKes.toLocaleString()}
                            </span>
                            <span className="text-xs text-neutral-400 line-through font-mono">
                              KES {deal.originalPriceKes.toLocaleString()}
                            </span>
                          </div>

                          <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/60 text-[10px] font-bold">
                            <span>Save KES {(deal.originalPriceKes - deal.dealPriceKes).toLocaleString()}</span>
                            <span>({deal.discountPercentage}% OFF)</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-1 grid grid-cols-5 gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (onClaimDeal) {
                                onClaimDeal(deal, product);
                              } else {
                                onQuickAdd(product, deal.dealPriceKes);
                              }
                              setClaimedDealId(deal.id);
                              setTimeout(() => setClaimedDealId(null), 2200);
                            }}
                            className={`col-span-3 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-98 ${
                              isClaimedNow
                                ? 'bg-emerald-600 text-white'
                                : 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white shadow-[0_4px_15px_-3px_rgba(217,119,6,0.4)]'
                            }`}
                          >
                            {isClaimedNow ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Claimed!</span>
                              </>
                            ) : (
                              <>
                                <Zap className="w-3.5 h-3.5" />
                                <span>Claim Deal</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => onSelectProduct(product)}
                            className="col-span-2 py-2.5 px-2 bg-neutral-900/5 hover:bg-neutral-900/10 text-neutral-700 hover:text-neutral-900 font-semibold text-xs rounded-xl border border-neutral-200/60 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Details</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </section>
        );
      })()}

      {/* ========================================================================= */}
      {/* 3. MARKETPLACE CATALOG - DEDICATED FROSTED GLASS PAVILION DECK */}
      {/* ========================================================================= */}
      <section id="catalog-grid" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Localized Glass Refractive Backing Glows */}
        <div className="absolute -top-12 -left-10 w-96 h-96 bg-gradient-to-br from-indigo-300/18 via-sky-200/12 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/2 -right-12 w-[32rem] h-[32rem] bg-gradient-to-bl from-amber-300/16 via-rose-200/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Master Frosted Glass Enclosure */}
        <div className="relative overflow-hidden bg-white/45 hover:bg-white/50 backdrop-blur-3xl rounded-3xl p-6 sm:p-8 lg:p-10 border border-white/85 shadow-[0_20px_50px_rgba(0,0,0,0.04)] space-y-8 transition-colors duration-500">
          
          {/* Top Hairline Specular Glaze */}
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-95 pointer-events-none" />

          {/* Section Header: Command Console & Search */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-6 border-b border-white/80">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 backdrop-blur-md border border-white/80 text-[11px] font-semibold text-neutral-700 mb-2 shadow-2xs">
                <Store className="w-3.5 h-3.5 text-amber-700" />
                <span>Verified Kenya Inventory</span>
                <span aria-hidden="true" className="text-neutral-300">Â·</span>
                <span className="text-amber-800 font-bold">{filteredProducts.length} Items Listed</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
                Marketplace Catalog
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Explore authentic electronics, smartphones, laptops, fashion, kitchen appliances, and goods protected in Escrow
              </p>
            </div>

            {/* Right Controls: Glass Search Bar & Sort Dropdown */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto">
              
              {/* Frosted Glass Search Input */}
              <div className="relative w-full sm:w-80 group">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-neutral-900 transition-colors" />
                <input
                  type="text"
                  placeholder="Search products, brands (Samsung, Sony...), SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-white/75 hover:bg-white/90 focus:bg-white backdrop-blur-xl border border-white/90 focus:border-neutral-300 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all placeholder:text-neutral-400 font-medium"
                />
              </div>

              {/* Frosted Glass Sort Dropdown */}
              <div className="relative flex items-center bg-white/75 hover:bg-white/90 backdrop-blur-xl border border-white/90 rounded-xl px-3 py-2 text-xs text-neutral-700 shadow-[0_4px_20px_rgba(0,0,0,0.03)] shrink-0 gap-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-xs text-neutral-900 font-semibold focus:outline-none cursor-pointer pr-1"
                >
                  <option value="featured">Featured Order</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="discount">Biggest Discount</option>
                </select>
              </div>

            </div>
          </div>

          {/* Frosted Glass Category Bar & Store Selector */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            
            {/* Category Segmented Pills */}
            <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-white/60 backdrop-blur-2xl border border-white/90 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 text-xs rounded-xl transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-neutral-900 text-white font-semibold shadow-xs ring-1 ring-white/20'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/80 font-medium'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Filter by Merchant Store */}
            <div className="flex items-center gap-2 text-xs text-neutral-700 bg-white/65 hover:bg-white/85 backdrop-blur-xl border border-white/90 px-3.5 py-2 rounded-xl shadow-2xs transition-colors">
              <Filter className="w-3.5 h-3.5 text-neutral-500" />
              <span className="font-semibold text-neutral-700">Store:</span>
              <select
                value={selectedVendorFilter}
                onChange={(e) => setSelectedVendorFilter(e.target.value)}
                className="bg-transparent text-xs text-neutral-900 font-bold focus:outline-none cursor-pointer"
              >
                <option value="All">All Verified Stores ({vendors.length})</option>
                {vendors.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.county})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* PRODUCT CARDS: ELEVATED LAYERED GLASS CARDS */}
          {/* ========================================================================= */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white/55 backdrop-blur-2xl rounded-3xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.03)] space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-neutral-800">No matching products found</h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Try adjusting your search terms, selecting "All Categories", or resetting your store filters.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedVendorFilter('All');
                  setSearchQuery('');
                  setSortBy('featured');
                }}
                className="px-4 py-2 bg-neutral-900 text-white text-xs font-semibold rounded-xl hover:bg-neutral-800 transition-all cursor-pointer shadow-xs active:scale-98"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {filteredProducts.map((prod) => (
                <article
                  key={prod.id}
                  className="group relative bg-white/60 hover:bg-white/75 backdrop-blur-xl rounded-2xl border border-white/80 hover:border-white shadow-[0_8px_32px_0_rgba(31,38,135,0.06)] hover:shadow-[0_20px_45px_0_rgba(31,38,135,0.12)] overflow-hidden transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5"
                >
                  {/* Top Specular Hairline Glaze */}
                  <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent opacity-90 z-20 pointer-events-none" />

                  <div>
                    {/* Image Box */}
                    <div 
                      className="relative aspect-4/3 bg-neutral-100/50 backdrop-blur-xs overflow-hidden cursor-pointer"
                      onClick={() => onSelectProduct(prod)}
                    >
                      <img
                        src={prod.images[0]}
                        alt={prod.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500 ease-out"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect fill="%23f4f4f2" width="400" height="300"/><text fill="%23888" font-family="sans-serif" font-size="16" dy="10.5" font-weight="bold" x="50%" y="50%" text-anchor="middle">SokoSalama Product</text></svg>';
                        }}
                      />

                      {/* Floating Glass Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {prod.brand && (
                            <span className="bg-neutral-950/75 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md shadow-xs tracking-wide">
                              {prod.brand}
                            </span>
                          )}
                          {prod.condition && (
                            <span className="bg-emerald-950/75 backdrop-blur-md border border-emerald-400/30 text-emerald-300 text-[10px] font-semibold px-2 py-0.5 rounded-md shadow-xs capitalize">
                              {prod.condition}
                            </span>
                          )}
                        </div>

                        {prod.compareAtPriceKes && prod.compareAtPriceKes > prod.priceKes && (
                          <div className="bg-gradient-to-r from-rose-600 to-pink-600 text-white backdrop-blur-md border border-rose-300/40 text-[10px] font-bold px-2.5 py-0.5 rounded-md shadow-xs">
                            {Math.round(((prod.compareAtPriceKes - prod.priceKes) / prod.compareAtPriceKes) * 100)}% OFF
                          </div>
                        )}
                      </div>

                      {/* Hover Glass Pill */}
                      <div className="absolute inset-0 bg-neutral-950/20 backdrop-blur-2xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                        <span className="px-4 py-2 bg-white/95 backdrop-blur-md text-neutral-900 text-xs font-bold rounded-xl shadow-lg border border-white/90 flex items-center gap-1.5 transform translate-y-1 group-hover:translate-y-0 transition-transform">
                          <Eye className="w-3.5 h-3.5 text-neutral-700" />
                          <span>View Specifications</span>
                        </span>
                      </div>
                    </div>

                    {/* Card Content Area */}
                    <div className="p-5 space-y-2">
                      <div className="flex items-center gap-2 text-[11px] text-neutral-500 flex-wrap">
                        <span className="font-semibold text-neutral-600">{prod.category}</span>
                        <span aria-hidden="true" className="text-neutral-300">Â·</span>
                        <span className="text-amber-800 font-bold">{prod.vendorName}</span>
                      </div>

                      <h3 
                        onClick={() => onSelectProduct(prod)}
                        className="text-base font-bold text-neutral-900 group-hover:text-amber-800 transition-colors line-clamp-2 cursor-pointer leading-snug"
                      >
                        {prod.title}
                      </h3>

                      <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed font-normal">
                        {prod.description}
                      </p>
                    </div>
                  </div>

                  {/* Card Bottom Area (Pricing & Glass Actions) */}
                  <div className="p-5 pt-0">
                    <div className="flex items-baseline justify-between pt-3 border-t border-neutral-200/70 mb-3.5">
                      <div>
                        <span className="text-lg font-extrabold text-neutral-900 tabular-nums">
                          KES {prod.priceKes.toLocaleString()}
                        </span>
                        {prod.compareAtPriceKes && (
                          <span className="text-xs text-neutral-400 line-through tabular-nums ml-2 font-normal">
                            KES {prod.compareAtPriceKes.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-[11px] text-neutral-700 bg-white/70 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/70 shadow-2xs">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span className="font-bold tabular-nums">{prod.rating.toFixed(1)}</span>
                        <span className="text-neutral-400 font-medium">({prod.reviewsCount})</span>
                      </div>
                    </div>

                    {/* Dual Action Buttons */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => onSelectProduct(prod)}
                        className="w-full py-2.5 px-3 text-xs font-semibold text-neutral-700 bg-white/70 hover:bg-white/95 border border-white/80 rounded-xl backdrop-blur-md transition-all cursor-pointer text-center shadow-2xs hover:shadow-xs active:scale-98"
                      >
                        Details
                      </button>

                      <button
                        type="button"
                        onClick={() => onQuickAdd(prod)}
                        className="w-full py-2.5 px-3 text-xs font-semibold text-white bg-gradient-to-r from-neutral-900 to-neutral-800 hover:from-neutral-800 hover:to-neutral-700 border border-neutral-900 rounded-xl backdrop-blur-md transition-all cursor-pointer text-center shadow-xs hover:shadow-md active:scale-98"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>

                </article>
              ))}
            </div>
          )}

        </div>
      </section>

      <MerchantDirectory vendors={vendors} onSelectVendor={(vendorId) => {
        setSelectedVendorFilter(vendorId);
        const el = document.getElementById('catalog-grid');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }} />
    </div>
  );
};
