import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import {
  ShieldCheck,
  Lock,
  Mail,
  Phone,
  User,
  Store,
  MapPin,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ArrowLeft,
  Building,
  Check,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { UserRole, UserSession, Vendor } from '../types';

interface AuthPageProps {
  currentSession: UserSession;
  onLoginSuccess: (session: UserSession, message?: string) => void;
  onRegisterCustomer: (data: {
    name: string;
    email: string;
    phone: string;
    password?: string;
    county?: string;
    town?: string;
  }) => Promise<{ session: UserSession; message?: string }>;
  onRegisterVendor: (data: {
    storeName: string;
    category?: string;
    ownerName: string;
    email: string;
    phone: string;
    county: string;
    town: string;
    mpesaPayoutNumber: string;
    bio: string;
    password?: string;
    businessRegistrationNumber?: string;
  }) => Promise<{ session: UserSession; vendor: Vendor; message?: string }>;
  onLogin: (identifier: string, password?: string) => Promise<{ session: UserSession; message?: string }>;
  onResetPassword: (identifier: string, newPassword?: string) => Promise<{ success: boolean; message: string }>;
  onNavigateHome: () => void;
  initialMode?: 'login' | 'signup';
}

const KENYAN_COUNTIES = [
  'Nairobi',
  'Mombasa',
  'Nakuru',
  'Kiambu',
  'Kisumu',
  'Kajiado',
  'Nyeri',
  'Lamu',
  'Kericho',
  'Turkana',
  'Machakos',
  'Uasin Gishu (Eldoret)',
  'Kilifi',
  'Meru',
];

const VENDOR_CATEGORIES = [
  'Fashion & Kitenge',
  'Handcrafted Leather',
  'Kenyan Specialty Coffee',
  'African Jewelry & Beadwork',
  'Recycled Glass & Home Decor',
  'Terracotta & Studio Pottery',
  'Artisan Foods & Organic Honey',
  'Woodcarvings & Sculpture',
];

export const AuthPage: React.FC<AuthPageProps> = ({
  currentSession,
  onLoginSuccess,
  onRegisterCustomer,
  onRegisterVendor,
  onLogin,
  onResetPassword,
  onNavigateHome,
  initialMode = 'login',
}) => {
  // Mode: 'login' | 'signup' | 'forgot'
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);
  const [signupType, setSignupType] = useState<'customer' | 'vendor'>('customer');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Customer Sign-Up State
  const [custName, setCustName] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custCounty, setCustCounty] = useState('Nairobi');
  const [custTown, setCustTown] = useState('Westlands');
  const [custPassword, setCustPassword] = useState('');
  const [custConfirmPassword, setCustConfirmPassword] = useState('');
  const [custTermsAgreed, setCustTermsAgreed] = useState(false);

  // Vendor Sign-Up State
  const [venStoreName, setVenStoreName] = useState('');
  const [venCategory, setVenCategory] = useState(VENDOR_CATEGORIES[0]);
  const [venOwnerName, setVenOwnerName] = useState('');
  const [venEmail, setVenEmail] = useState('');
  const [venPhone, setVenPhone] = useState('');
  const [venCounty, setVenCounty] = useState('Nairobi');
  const [venTown, setVenTown] = useState('');
  const [venMpesa, setVenMpesa] = useState('');
  const [venBio, setVenBio] = useState('');
  const [venPassword, setVenPassword] = useState('');
  const [venRegNumber, setVenRegNumber] = useState('');
  const [venTermsAgreed, setVenTermsAgreed] = useState(true);

  // Forgot Password State
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [simulatedOtp, setSimulatedOtp] = useState<string | null>(null);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Clear messages on mode switch
  const switchMode = (mode: 'login' | 'signup' | 'forgot') => {
    setAuthMode(mode);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  // Quick Demo Accounts Fill
  const fillDemoAccount = (role: UserRole, email: string, pass: string) => {
    setAuthMode('login');
    setLoginIdentifier(email);
    setLoginPassword(pass);
    setErrorMsg(null);
    setSuccessMsg(`Loaded credentials for ${role === 'ADMIN' ? 'Platform Admin' : role === 'VENDOR' ? 'Kenyan Vendor' : 'Customer Buyer'}. Click 'Sign In' or proceed!`);
  };

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim()) {
      setErrorMsg('Please enter your email address or Kenyan phone number.');
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await onLogin(loginIdentifier.trim(), loginPassword);
      setSuccessMsg(res.message || 'Login successful!');
      setTimeout(() => {
        onLoginSuccess(res.session, res.message);
      }, 400);
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Customer Sign-Up Submit
  const handleCustomerSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName.trim() || !custEmail.trim() || !custPhone.trim()) {
      setErrorMsg('Please fill in your name, email, and Kenyan phone number.');
      return;
    }
    if (custPassword.length < 8) { setErrorMsg('Choose a password with at least 8 characters.'); return; }
    if (custPassword !== custConfirmPassword) { setErrorMsg('Your passwords do not match.'); return; }
    if (!custTermsAgreed) {
      setErrorMsg('Please accept the SokoSalama Buyer & Escrow Terms.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await onRegisterCustomer({
        name: custName.trim(),
        email: custEmail.trim(),
        phone: custPhone.trim(),
        county: custCounty,
        town: custTown.trim(),
        password: custPassword || 'password123',
      });
      setSuccessMsg(res.message || 'Account created successfully!');
      setTimeout(() => {
        onLoginSuccess(res.session, res.message);
      }, 500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Vendor Store Registration Submit
  const handleVendorSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!venStoreName.trim() || !venEmail.trim() || !venPhone.trim() || !venMpesa.trim()) {
      setErrorMsg('Store name, email, phone, and M-Pesa payout number are required.');
      return;
    }
    if (!venTermsAgreed) {
      setErrorMsg('Please agree to the Marketplace Seller Commission & Escrow Policy.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await onRegisterVendor({
        storeName: venStoreName.trim(),
        category: venCategory,
        ownerName: venOwnerName.trim() || venStoreName.trim(),
        email: venEmail.trim(),
        phone: venPhone.trim(),
        county: venCounty,
        town: venTown.trim() || venCounty,
        mpesaPayoutNumber: venMpesa.trim(),
        bio: venBio.trim(),
        password: venPassword || 'vendor123',
        businessRegistrationNumber: venRegNumber.trim(),
      });
      setSuccessMsg(`Welcome to SokoSalama! ${venStoreName} store registered successfully.`);
      setTimeout(() => {
        onLoginSuccess(res.session, `Welcome, ${venStoreName}! Your store is ready.`);
      }, 600);
    } catch (err: any) {
      setErrorMsg(err.message || 'Vendor onboarding failed.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Forgot Password Request OTP
  const handleForgotRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotIdentifier.trim()) {
      setErrorMsg('Please enter your registered email address or phone number.');
      return;
    }
    setErrorMsg(null);
    setLoading(true);

    // Simulate OTP generation
    setTimeout(() => {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setSimulatedOtp(code);
      setEnteredOtp(code); // Pre-fill for frictionless review
      setForgotStep(2);
      setLoading(false);
      setSuccessMsg(`Safaricom Daraja OTP sent to ${forgotIdentifier}! Code: ${code}`);
    }, 600);
  };

  // Handle Forgot Password Set New
  const handleForgotSubmitNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) {
      setErrorMsg('Please enter a new password.');
      return;
    }
    if (enteredOtp !== simulatedOtp) {
      setErrorMsg('Invalid verification OTP code.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await onResetPassword(forgotIdentifier.trim(), newPassword.trim());
      setSuccessMsg(res.message);
      setTimeout(() => {
        setAuthMode('login');
        setLoginIdentifier(forgotIdentifier.trim());
        setLoginPassword(newPassword.trim());
        setForgotStep(1);
        setSimulatedOtp(null);
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Password reset failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-neutral-50/70 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation & Trust Bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Marketplace</span>
          </button>

          <BrandLogo size="auth" />
        </div>

        {/* Main Authentication Card */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Column: Visual & Trust Showcase (Hidden on small screens) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-amber-950 via-stone-900 to-amber-900 p-8 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-600/20 via-transparent to-transparent pointer-events-none" />
            
            <div className="relative z-10">
              <div className="inline-block px-3 py-1 bg-amber-500/20 border border-amber-400/30 rounded-full text-[11px] font-semibold tracking-wider uppercase text-amber-200 mb-4">
                SokoSalama Kenya
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white mb-3">
                Authentic Crafts, Protected Trade.
              </h2>
              <p className="text-xs text-stone-300 leading-relaxed">
                Connect directly with master artisans and discover distinctive Kenyan-made goods.
              </p>

              {/* Value Props */}
              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-2.5 text-xs text-stone-200">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0 mt-0.5 text-emerald-400 font-bold text-[10px]">
                    ✓
                  </div>
                  <div>
                    <span className="font-semibold text-white">Multi-Vendor Cart</span>
                    <p className="text-[11px] text-stone-300">Shop from leather tanners, coffee roasters, and fashion studios in one transaction.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-xs text-stone-200">
                  <div className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-400/30 flex items-center justify-center shrink-0 mt-0.5 text-amber-400 font-bold text-[10px]">
                    🛡️
                  </div>
                  <div>
                    <span className="font-semibold text-white">Guaranteed Escrow Protection</span>
                    <p className="text-[11px] text-stone-300">Safaricom B2C payout is only released after customer verification or inspection window.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-xs text-stone-200">
                  <div className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-400/30 flex items-center justify-center shrink-0 mt-0.5 text-amber-400 font-bold text-[10px]">
                    🚚
                  </div>
                  <div>
                    <span className="font-semibold text-white">County-Wide Logistics</span>
                    <p className="text-[11px] text-stone-300">Integrated tracking across Nairobi, Mombasa, Rift Valley, and Western hubs.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Demo Credentials Footer */}
            <div className="mt-8 pt-6 border-t border-white/10 relative z-10">
              <div className="text-[11px] font-semibold text-amber-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Instant Demo Login</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => fillDemoAccount('CUSTOMER', 'demo.customer@sokosalama.co.ke', 'DemoCustomer2026')}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition flex items-center justify-between text-[11px] font-medium text-stone-200"
                >
                  <span>Demo Customer · demo.customer@sokosalama.co.ke</span>
                  <span className="text-[10px] text-amber-300 font-mono">Use</span>
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoAccount('CUSTOMER', 'wambui.k@gmail.com', 'password123')}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition flex items-center justify-between text-[11px] font-medium text-stone-200"
                >
                  <span>👤 Customer: Wambui Kariuki</span>
                  <span className="text-[10px] text-amber-300 font-mono">Fill</span>
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoAccount('VENDOR', 'leather@olkaria.co.ke', 'vendor123')}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition flex items-center justify-between text-[11px] font-medium text-stone-200"
                >
                  <span>🏪 Vendor: Olkaria Leather</span>
                  <span className="text-[10px] text-amber-300 font-mono">Fill</span>
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoAccount('ADMIN', 'admin@sokosalama.co.ke', 'admin2026')}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition flex items-center justify-between text-[11px] font-medium text-stone-200"
                >
                  <span>🛡️ Admin: Antony Onyi</span>
                  <span className="text-[10px] text-amber-300 font-mono">Fill</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Forms */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Mode Toggle Header: Sign In vs Sign Up */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200 mb-6">
                <div className="flex gap-2 p-1 bg-neutral-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => switchMode('login')}
                    className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      authMode === 'login'
                        ? 'bg-white text-neutral-900 shadow-xs'
                        : 'text-neutral-500 hover:text-neutral-900'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => switchMode('signup')}
                    className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      authMode === 'signup'
                        ? 'bg-white text-neutral-900 shadow-xs'
                        : 'text-neutral-500 hover:text-neutral-900'
                    }`}
                  >
                    Create Account
                  </button>
                </div>

                {authMode === 'forgot' && (
                  <button
                    type="button"
                    onClick={() => switchMode('login')}
                    className="text-xs font-medium text-amber-700 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                  </button>
                )}
              </div>

              {/* Status Notifications */}
              {errorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* ========================================================= */}
              {/* VIEW 1: SIGN IN (LOG IN) */}
              {/* ========================================================= */}
              {authMode === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900">Welcome Back</h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Log in to access your escrow orders, vendor portal, or administrative controls.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                      Email Address or Kenyan Phone (+254)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        placeholder="e.g. wambui.k@gmail.com or +254720987654"
                        required
                        className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-amber-600 text-neutral-900 placeholder-neutral-400"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-medium text-neutral-700">Password</label>
                      <button
                        type="button"
                        onClick={() => switchMode('forgot')}
                        className="text-[11px] font-medium text-amber-700 hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••••••"
                        required
                        className="w-full pl-9 pr-10 py-2.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-amber-600 text-neutral-900"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-600">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded border-neutral-300 text-amber-700 focus:ring-amber-600 w-3.5 h-3.5"
                      />
                      <span>Remember this device</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 bg-amber-700 hover:bg-amber-800 disabled:opacity-60 text-white font-semibold text-xs rounded-lg shadow-sm transition flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    {loading ? (
                      <span className="inline-flex items-center gap-2">
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Verifying credentials...</span>
                      </span>
                    ) : (
                      <>
                        <span>Sign In to Account</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* ========================================================= */}
              {/* VIEW 2: SIGN UP / REGISTRATION */}
              {/* ========================================================= */}
              {authMode === 'signup' && (
                <div>
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-neutral-900">Create an Account</h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Create your customer account to start shopping.
                    </p>

                    {/* Account Type Selector Tabs */}
                    <div className="grid grid-cols-1 gap-2 mt-4 p-1 bg-neutral-100 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setSignupType('customer')}
                        className={`py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
                          signupType === 'customer'
                            ? 'bg-white text-neutral-900 shadow-xs'
                            : 'text-neutral-500 hover:text-neutral-900'
                        }`}
                      >
                        <User className="w-3.5 h-3.5 text-amber-700" />
                        <span>Shopper (Buyer)</span>
                      </button>

                      {false && <button
                        type="button"
                        onClick={() => setSignupType('vendor')}
                        className={`py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
                          signupType === 'vendor'
                            ? 'bg-white text-neutral-900 shadow-xs'
                            : 'text-neutral-500 hover:text-neutral-900'
                        }`}
                      >
                        <Store className="w-3.5 h-3.5 text-amber-700" />
                        <span>Artisan (Seller)</span>
                      </button>}
                    </div>
                  </div>

                  {/* 2A: Customer Sign-Up Form */}
                  {signupType === 'customer' && (
                    <form onSubmit={handleCustomerSignUp} className="space-y-3.5">
                      <div>
                        <label className="block text-xs font-medium text-neutral-700 mb-1">Full Legal Name</label>
                        <div className="relative">
                          <User className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
                          <input
                            type="text"
                            value={custName}
                            onChange={(e) => setCustName(e.target.value)}
                            placeholder="e.g. Grace Nyambura"
                            required
                            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 text-neutral-900"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-neutral-700 mb-1">Email Address</label>
                          <div className="relative">
                            <Mail className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
                            <input
                              type="email"
                              value={custEmail}
                              onChange={(e) => setCustEmail(e.target.value)}
                              placeholder="grace@example.co.ke"
                              required
                              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 text-neutral-900"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-neutral-700 mb-1">M-Pesa Phone Number</label>
                          <div className="relative">
                            <Phone className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
                            <input
                              type="tel"
                              value={custPhone}
                              onChange={(e) => setCustPhone(e.target.value)}
                              placeholder="+254 7XX XXX XXX"
                              required
                              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 text-neutral-900"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-neutral-700 mb-1">County</label>
                          <select
                            value={custCounty}
                            onChange={(e) => setCustCounty(e.target.value)}
                            className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 text-neutral-900"
                          >
                            {KENYAN_COUNTIES.map((c) => (
                              <option key={c} value={c}>
                                {c} County
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-neutral-700 mb-1">Town / Area</label>
                          <div className="relative">
                            <MapPin className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
                            <input
                              type="text"
                              value={custTown}
                              onChange={(e) => setCustTown(e.target.value)}
                              placeholder="e.g. Kilimani, Nyali, etc."
                              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 text-neutral-900"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-neutral-700 mb-1">Create Password</label>
                        <div className="relative">
                          <Lock className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={custPassword}
                            onChange={(e) => setCustPassword(e.target.value)}
                            placeholder="At least 6 characters"
                            required
                            className="w-full pl-9 pr-10 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 text-neutral-900"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-600 cursor-pointer"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="pt-1">
                        <label className="flex items-start gap-2 cursor-pointer text-xs text-neutral-600">
                          <input
                            type="checkbox"
                            checked={custTermsAgreed}
                            onChange={(e) => setCustTermsAgreed(e.target.checked)}
                            className="rounded border-neutral-300 text-amber-700 focus:ring-amber-600 w-3.5 h-3.5 mt-0.5"
                          />
                          <span>
                            I agree to SokoSalama's <span className="font-semibold text-neutral-900">Terms &amp; Conditions</span> and privacy policy.
                          </span>
                        </label>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-neutral-700 mb-1">Confirm Password</label>
                        <input type={showPassword ? 'text' : 'password'} value={custConfirmPassword} onChange={(e) => setCustConfirmPassword(e.target.value)} placeholder="Re-enter your password" required className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 text-neutral-900" />
                        <p className="mt-1.5 text-[11px] text-neutral-500">Password strength: {custPassword.length < 6 ? 'Weak' : custPassword.length < 10 || !/[A-Z]/.test(custPassword) || !/\d/.test(custPassword) ? 'Fair' : 'Strong'}</p>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 px-4 bg-amber-700 hover:bg-amber-800 disabled:opacity-60 text-white font-semibold text-xs rounded-lg shadow-sm transition flex items-center justify-center gap-2 cursor-pointer mt-2"
                      >
                        {loading ? 'Creating Buyer Account...' : 'Complete Buyer Registration'}
                      </button>
                    </form>
                  )}

                  {/* 2B: Vendor Sign-Up Form */}
                  {signupType === 'vendor' && (
                    <form onSubmit={handleVendorSignUp} className="space-y-3.5">
                      <div className="p-3 bg-amber-50/70 border border-amber-200/70 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                        <Building className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold">Merchant Escrow Guarantee:</span>
                          <p className="text-[11px] text-amber-800 mt-0.5">
                            Upon delivery confirmation, your earnings are automatically disbursed to your M-Pesa business line via Safaricom Daraja B2C.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-neutral-700 mb-1">Store / Business Name</label>
                          <input
                            type="text"
                            value={venStoreName}
                            onChange={(e) => setVenStoreName(e.target.value)}
                            placeholder="e.g. Tsavo Leather Crafts"
                            required
                            className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 text-neutral-900"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-neutral-700 mb-1">Craft Category</label>
                          <select
                            value={venCategory}
                            onChange={(e) => setVenCategory(e.target.value)}
                            className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 text-neutral-900"
                          >
                            {VENDOR_CATEGORIES.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-neutral-700 mb-1">Owner / Lead Artisan Name</label>
                          <input
                            type="text"
                            value={venOwnerName}
                            onChange={(e) => setVenOwnerName(e.target.value)}
                            placeholder="e.g. David Mwangi"
                            required
                            className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 text-neutral-900"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-neutral-700 mb-1">Business Email</label>
                          <input
                            type="email"
                            value={venEmail}
                            onChange={(e) => setVenEmail(e.target.value)}
                            placeholder="info@tsavocrafts.co.ke"
                            required
                            className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 text-neutral-900"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-neutral-700 mb-1">Contact Phone</label>
                          <input
                            type="tel"
                            value={venPhone}
                            onChange={(e) => setVenPhone(e.target.value)}
                            placeholder="+254 7XX XXX XXX"
                            required
                            className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 text-neutral-900"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-neutral-700 mb-1">
                            M-Pesa Payout Number
                          </label>
                          <input
                            type="tel"
                            value={venMpesa}
                            onChange={(e) => setVenMpesa(e.target.value)}
                            placeholder="+254 7XX XXX XXX (Payouts)"
                            required
                            className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 text-neutral-900 font-mono"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-neutral-700 mb-1">Workshop County</label>
                          <select
                            value={venCounty}
                            onChange={(e) => setVenCounty(e.target.value)}
                            className="w-full px-2.5 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 text-neutral-900"
                          >
                            {KENYAN_COUNTIES.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-neutral-700 mb-1">Town / Center</label>
                          <input
                            type="text"
                            value={venTown}
                            onChange={(e) => setVenTown(e.target.value)}
                            placeholder="e.g. Voi Town"
                            required
                            className="w-full px-2.5 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 text-neutral-900"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-neutral-700 mb-1">Reg / KRA PIN (Opt)</label>
                          <input
                            type="text"
                            value={venRegNumber}
                            onChange={(e) => setVenRegNumber(e.target.value)}
                            placeholder="BN-XXXXXX or P051..."
                            className="w-full px-2.5 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 text-neutral-900"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-neutral-700 mb-1">Store Bio & Craft Story</label>
                        <textarea
                          rows={2}
                          value={venBio}
                          onChange={(e) => setVenBio(e.target.value)}
                          placeholder="Briefly describe your workshop, materials used, and heritage..."
                          className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 text-neutral-900 resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-neutral-700 mb-1">Create Vendor Password</label>
                        <div className="relative">
                          <Lock className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={venPassword}
                            onChange={(e) => setVenPassword(e.target.value)}
                            placeholder="••••••••••••"
                            required
                            className="w-full pl-9 pr-10 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 text-neutral-900"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-600 cursor-pointer"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="pt-1">
                        <label className="flex items-start gap-2 cursor-pointer text-xs text-neutral-600">
                          <input
                            type="checkbox"
                            checked={venTermsAgreed}
                            onChange={(e) => setVenTermsAgreed(e.target.checked)}
                            className="rounded border-neutral-300 text-amber-700 focus:ring-amber-600 w-3.5 h-3.5 mt-0.5"
                          />
                          <span>
                            I agree to the <span className="font-semibold text-neutral-900">10% Platform Commission Tier</span>, automated Daraja payout terms, and genuine artisan craft standards.
                          </span>
                        </label>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 px-4 bg-amber-700 hover:bg-amber-800 disabled:opacity-60 text-white font-semibold text-xs rounded-lg shadow-sm transition flex items-center justify-center gap-2 cursor-pointer mt-2"
                      >
                        {loading ? 'Registering Store...' : 'Register Store & Open Vendor Portal'}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* ========================================================= */}
              {/* VIEW 3: FORGOT PASSWORD RECOVERY (INTERACTIVE OTP) */}
              {/* ========================================================= */}
              {authMode === 'forgot' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900">Reset Password</h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Verify via your registered email or Safaricom phone number to reset your credentials.
                    </p>
                  </div>

                  {forgotStep === 1 ? (
                    <form onSubmit={handleForgotRequestOtp} className="space-y-3.5">
                      <div>
                        <label className="block text-xs font-medium text-neutral-700 mb-1">
                          Registered Email or Phone (+254)
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
                          <input
                            type="text"
                            value={forgotIdentifier}
                            onChange={(e) => setForgotIdentifier(e.target.value)}
                            placeholder="wambui.k@gmail.com or +254720987654"
                            required
                            className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 text-neutral-900"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 px-4 bg-amber-700 hover:bg-amber-800 disabled:opacity-60 text-white font-semibold text-xs rounded-lg transition flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {loading ? 'Sending OTP code...' : 'Send Verification OTP'}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleForgotSubmitNewPassword} className="space-y-3.5">
                      <div className="p-3 bg-neutral-100 rounded-xl text-xs text-neutral-700">
                        <div className="flex items-center justify-between font-medium">
                          <span>Verification sent to:</span>
                          <span className="font-mono text-neutral-900">{forgotIdentifier}</span>
                        </div>
                        {simulatedOtp && (
                          <div className="mt-2 pt-2 border-t border-neutral-200 flex items-center justify-between text-amber-800">
                            <span>Safaricom SMS Preview:</span>
                            <span className="font-mono font-bold bg-amber-100 px-2 py-0.5 rounded text-amber-900">
                              {simulatedOtp}
                            </span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-neutral-700 mb-1">
                          6-Digit OTP Code
                        </label>
                        <div className="relative">
                          <KeyRound className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
                          <input
                            type="text"
                            maxLength={6}
                            value={enteredOtp}
                            onChange={(e) => setEnteredOtp(e.target.value)}
                            placeholder="e.g. 482910"
                            required
                            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 text-neutral-900 font-mono tracking-widest"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-neutral-700 mb-1">New Password</label>
                        <div className="relative">
                          <Lock className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
                          <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new strong password"
                            required
                            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 text-neutral-900"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 px-4 bg-amber-700 hover:bg-amber-800 disabled:opacity-60 text-white font-semibold text-xs rounded-lg transition flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {loading ? 'Updating Password...' : 'Save New Password & Sign In'}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Footer Details */}
            <div className="mt-8 pt-4 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" /> 256-Bit SSL Encrypted
              </span>
              <span>SokoSalama Kenya © 2026</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
