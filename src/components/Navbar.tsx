import React from 'react';
import { ShoppingBag, ChevronDown, User, Store, ShieldAlert, LogIn, LogOut, UserPlus } from 'lucide-react';
import { UserRole, UserSession } from '../types';
import { BrandLogo } from './BrandLogo';

interface NavbarProps {
  currentSession: UserSession;
  activeView: 'storefront' | 'orders' | 'vendor' | 'admin' | 'auth';
  setActiveView: (view: 'storefront' | 'orders' | 'vendor' | 'admin' | 'auth') => void;
  cartCount: number;
  openCart: () => void;
  onSwitchRole: (role: UserRole, vendorId?: string) => void;
  vendorsList: { id: string; name: string }[];
  onLogout?: () => void;
  onOpenAuth?: (mode?: 'login' | 'signup') => void;
  onNavigate?: (view: 'storefront' | 'orders' | 'vendor' | 'admin' | 'auth') => void;
  onCustomerPanel?: (section: 'account' | 'settings') => void;
  brandName?: string;
  announcementEnabled?: boolean;
  announcementText?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentSession,
  activeView,
  setActiveView,
  cartCount,
  openCart,
  onSwitchRole,
  vendorsList,
  onLogout,
  onOpenAuth,
  onNavigate,
  onCustomerPanel,
  brandName = 'SokoSalama',
  announcementEnabled = false,
  announcementText = '',
}) => {
  const [roleMenuOpen, setRoleMenuOpen] = React.useState(false);
  const announcements = announcementText.split('|').map((message) => message.trim()).filter(Boolean);

  const handleOpenAuth = (mode: 'login' | 'signup' = 'login') => {
    if (onOpenAuth) {
      onOpenAuth(mode);
    } else {
      setActiveView('auth');
    }
  };
  const navigate = (view: 'storefront' | 'orders' | 'vendor' | 'admin' | 'auth') => onNavigate ? onNavigate(view) : setActiveView(view);

  return (
    <header className="sticky top-0 z-40 bg-white/65 supports-[backdrop-filter]:bg-white/55 backdrop-blur-xl border-b border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.04)] relative">
      {announcementEnabled && announcements.length > 0 && <div className="h-8 overflow-hidden bg-neutral-900 text-amber-100" role="region" aria-label="Store announcements">
        <div className="announcement-marquee flex h-full w-max items-center whitespace-nowrap text-[11px] font-medium tracking-wide" aria-hidden="true">
          {[0, 1].map((copy) => <div key={copy} className="flex h-full shrink-0 items-center">{announcements.map((message, index) => <span key={`${copy}-${index}`} className="flex items-center gap-5 px-5">{message}<span className="text-amber-500">•</span></span>)}</div>)}
        </div>
        <span className="sr-only">{announcements.join('. ')}</span>
      </div>}
      {/* Specular Edge Highlights */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />
      
      {/* Top Bar strictly complying with Universal Frontend Design Constitution (Zone 1 - Zone 2 - Zone 3) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('storefront')}
            className="text-left group cursor-pointer focus-visible:outline-none"
          >
            <span className="inline-flex items-center gap-2 text-xl font-extrabold tracking-tight text-neutral-900 group-hover:text-amber-700 transition-colors">
              <BrandLogo name={brandName} size="navbar" />
            </span>
          </button>
        </div>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600">
          <button
            onClick={() => navigate('storefront')}
            className={`transition-colors cursor-pointer py-1 ${
              activeView === 'storefront' ? 'text-neutral-900 border-b-2 border-neutral-900 font-semibold' : 'hover:text-neutral-900'
            }`}
          >
            Marketplace
          </button>

          <button
            onClick={() => navigate('orders')}
            className={`transition-colors cursor-pointer py-1 ${
              activeView === 'orders' ? 'text-neutral-900 border-b-2 border-neutral-900 font-semibold' : 'hover:text-neutral-900'
            }`}
          >
            Track Orders
          </button>

          {currentSession.role === 'VENDOR' && (
            <button
              onClick={() => setActiveView('vendor')}
              className={`transition-colors cursor-pointer py-1 ${
                activeView === 'vendor' ? 'text-neutral-900 border-b-2 border-neutral-900 font-semibold' : 'hover:text-neutral-900'
              }`}
            >
              Vendor Portal
            </button>
          )}

          {currentSession.role === 'ADMIN' && (
            <button
              onClick={() => setActiveView('admin')}
              className={`transition-colors cursor-pointer py-1 ${
                activeView === 'admin' ? 'text-neutral-900 border-b-2 border-neutral-900 font-semibold' : 'hover:text-neutral-900'
              }`}
            >
              Admin Console
            </button>
          )}

          {currentSession.isGuest && <button
            onClick={() => handleOpenAuth('login')}
            className={`transition-colors cursor-pointer py-1 flex items-center gap-1.5 ${
              activeView === 'auth' ? 'text-neutral-900 border-b-2 border-neutral-900 font-semibold' : 'hover:text-neutral-900'
            }`}
          >
            <LogIn className="w-3.5 h-3.5 text-amber-700" />
            <span>Sign In / Sign Up</span>
          </button>}
        </nav>

        {/* Zone 3: Primary Actions (Cart + Role Switcher / Auth) */}
        <div className="flex items-center gap-2.5">
          {/* Shopping Bag Button (Customer view) */}
          <button
            onClick={openCart}
            className="relative flex items-center gap-2 px-3 py-2 text-sm font-medium text-neutral-800 bg-white/70 hover:bg-white backdrop-blur-xl border border-white/80 rounded-xl shadow-2xs transition-all cursor-pointer"
            aria-label="View Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4 text-neutral-700" />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="tabular-nums font-semibold text-xs bg-amber-700 text-white rounded-full px-1.5 py-0.2 min-w-5 text-center shadow-xs">
                {cartCount}
              </span>
            )}
          </button>

          {/* Quick RBAC Role Switcher & Account Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-neutral-800 bg-white/75 hover:bg-white backdrop-blur-xl border border-white/80 rounded-xl shadow-2xs transition-all cursor-pointer"
            >
              {currentSession.isGuest ? (
                <User className="w-3.5 h-3.5 text-neutral-400" />
              ) : currentSession.role === 'ADMIN' ? (
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              ) : currentSession.role === 'VENDOR' ? (
                <Store className="w-3.5 h-3.5 text-amber-700" />
              ) : (
                <User className="w-3.5 h-3.5 text-neutral-600" />
              )}
              
              <span className="max-w-[130px] truncate">
                {currentSession.isGuest ? (
                  'Guest'
                ) : currentSession.role === 'ADMIN' ? (
                  'Admin'
                ) : currentSession.role === 'VENDOR' ? (
                  currentSession.name.replace(' Rep', '') || 'Vendor'
                ) : (
                  currentSession.name.split(' ')[0] || 'Customer'
                )}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
            </button>

            {roleMenuOpen && (
              <div 
                className="absolute right-0 mt-2 w-72 bg-white/85 backdrop-blur-2xl border border-white/70 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] py-2 z-50 text-left text-xs divide-y divide-white/60 overflow-hidden"
                onMouseLeave={() => setRoleMenuOpen(false)}
              >
                {/* Active User Summary */}
                <div className="px-3.5 py-2.5 bg-neutral-100/50 backdrop-blur-sm">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                    Logged in as
                  </div>
                  <div className="font-semibold text-neutral-900 truncate mt-0.5">
                    {currentSession.isGuest ? 'Guest' : currentSession.name}
                  </div>
                  <div className="text-[11px] text-neutral-500 truncate flex items-center justify-between mt-0.5">
                    <span>{currentSession.isGuest ? 'Sign in to access your account' : currentSession.email || currentSession.phone}</span>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-neutral-200 text-neutral-700 font-semibold uppercase">
                      {currentSession.role}
                    </span>
                  </div>
                </div>

                {/* Account / Auth Links */}
                {currentSession.isGuest ? <div className="py-1">
                  <button
                    onClick={() => {
                      handleOpenAuth('login');
                      setRoleMenuOpen(false);
                    }}
                    className="w-full px-3.5 py-2 text-left flex items-center gap-2 hover:bg-neutral-50 transition-colors text-neutral-700"
                  >
                    <LogIn className="w-4 h-4 text-amber-700" />
                    <span>Sign In</span>
                  </button>

                  <button
                    onClick={() => {
                      handleOpenAuth('signup');
                      setRoleMenuOpen(false);
                    }}
                    className="w-full px-3.5 py-2 text-left flex items-center gap-2 hover:bg-neutral-50 transition-colors text-neutral-700"
                  >
                    <UserPlus className="w-4 h-4 text-emerald-600" />
                    <span>Create Account</span>
                  </button>
                </div> : <div className="py-1">
                  {['My Account', 'My Orders', 'Track Orders', 'Settings'].map((label) => (
                    <button key={label} onClick={() => {
                      if (label === 'My Orders' || label === 'Track Orders') navigate('orders');
                      else onCustomerPanel?.(label === 'Settings' ? 'settings' : 'account');
                      setRoleMenuOpen(false);
                    }} className="w-full px-3.5 py-2 text-left hover:bg-neutral-50 text-neutral-700">{label}</button>
                  ))}
                </div>}

                {/* Role Switcher Shortcuts */}
                {!currentSession.isGuest && <div className="py-1">
                  <div className="px-3.5 py-1 text-neutral-400 font-semibold uppercase tracking-wider text-[10px]">
                    Quick Switch Role
                  </div>

                  {/* Customer Option */}
                  <button
                    onClick={() => {
                      onSwitchRole('CUSTOMER');
                      setActiveView('storefront');
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full px-3.5 py-1.5 text-left flex items-center gap-2 hover:bg-neutral-50 transition-colors ${
                      currentSession.role === 'CUSTOMER' && !currentSession.isGuest ? 'bg-neutral-100 font-medium' : ''
                    }`}
                  >
                    <User className="w-3.5 h-3.5 text-neutral-500" />
                    <span className="text-neutral-900">Buyer (Wambui Kariuki)</span>
                  </button>

                  {/* Vendor Option */}
                  <button
                    onClick={() => {
                      const vId = vendorsList[0] ? vendorsList[0].id : 'ven_olkaria_leather';
                      onSwitchRole('VENDOR', vId);
                      setActiveView('vendor');
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full px-3.5 py-1.5 text-left flex items-center gap-2 hover:bg-neutral-50 transition-colors ${
                      currentSession.role === 'VENDOR' ? 'bg-amber-50 font-medium' : ''
                    }`}
                  >
                    <Store className="w-3.5 h-3.5 text-amber-700" />
                    <span className="text-neutral-900 truncate">Vendor ({vendorsList[0]?.name || 'Olkaria Leather'})</span>
                  </button>

                  {/* Admin Option */}
                  <button
                    onClick={() => {
                      onSwitchRole('ADMIN');
                      setActiveView('admin');
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full px-3.5 py-1.5 text-left flex items-center gap-2 hover:bg-neutral-50 transition-colors ${
                      currentSession.role === 'ADMIN' ? 'bg-rose-50 font-medium' : ''
                    }`}
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                    <span className="text-neutral-900">Platform Admin (Antony)</span>
                  </button>
                </div>}

                {/* Sign Out Action */}
                {onLogout && !currentSession.isGuest && (
                  <div className="py-1">
                    <button
                      onClick={() => {
                        onLogout();
                        setRoleMenuOpen(false);
                      }}
                      className="w-full px-3.5 py-2 text-left flex items-center gap-2 hover:bg-rose-50 transition-colors text-rose-700"
                    >
                      <LogOut className="w-4 h-4 text-rose-600" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-white/60 bg-white/65 supports-[backdrop-filter]:bg-white/55 backdrop-blur-xl py-2 text-xs font-medium">
        <button
          onClick={() => navigate('storefront')}
          className={`py-1 px-2 ${activeView === 'storefront' ? 'text-amber-800 font-semibold' : 'text-neutral-600'}`}
        >
          Marketplace
        </button>
        <button
          onClick={() => navigate('orders')}
          className={`py-1 px-2 ${activeView === 'orders' ? 'text-amber-800 font-semibold' : 'text-neutral-600'}`}
        >
          Orders
        </button>
        {currentSession.role === 'VENDOR' && (
          <button
            onClick={() => setActiveView('vendor')}
            className={`py-1 px-2 ${activeView === 'vendor' ? 'text-amber-800 font-semibold' : 'text-neutral-600'}`}
          >
            Vendor Portal
          </button>
        )}
        {currentSession.role === 'ADMIN' && (
          <button
            onClick={() => setActiveView('admin')}
            className={`py-1 px-2 ${activeView === 'admin' ? 'text-amber-800 font-semibold' : 'text-neutral-600'}`}
          >
            Admin Console
          </button>
        )}
        {currentSession.isGuest && <button
          onClick={() => handleOpenAuth('login')}
          className={`py-1 px-2 ${activeView === 'auth' ? 'text-amber-800 font-semibold' : 'text-neutral-600'}`}
        >
          Sign In
        </button>}
      </div>
    </header>
  );
};
