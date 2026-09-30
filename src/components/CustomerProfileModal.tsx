import React, { useEffect, useState } from 'react';
import { ArrowLeft, Bell, Check, LoaderCircle, Pencil, Settings, UserRound, X } from 'lucide-react';
import { UserSession } from '../types';

interface CustomerProfileModalProps {
  currentSession: UserSession;
  section: 'account' | 'settings';
  onClose: () => void;
  onSaveProfile: (updates: { name: string; email: string; phone: string }) => Promise<void>;
}

export const CustomerProfileModal: React.FC<CustomerProfileModalProps> = ({ currentSession, section, onClose, onSaveProfile }) => {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(currentSession.name);
  const [email, setEmail] = useState(currentSession.email);
  const [phone, setPhone] = useState(currentSession.phone);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [offers, setOffers] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const isAccount = section === 'account';

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => { if (event.key === 'Escape' && !saving) onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, saving]);

  const saveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSaved(false);
    if (name.trim().length < 2) return setError('Enter your full name.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError('Enter a valid email address.');
    if (!/^\+?[\d\s()-]{9,16}$/.test(phone.trim())) return setError('Enter a valid phone number.');

    setSaving(true);
    try {
      await onSaveProfile({ name: name.trim(), email: email.trim(), phone: phone.trim() });
      setEditing(false);
      setSaved(true);
    } catch (saveError: any) {
      setError(saveError.message || 'Your changes could not be saved. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = 'mt-1.5 w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10';

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-neutral-950/45 p-3 backdrop-blur-sm sm:p-5" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="customer-profile-title" className="w-full max-w-xl overflow-hidden rounded-[1.75rem] border border-white/80 bg-[#fbfbfa]/95 shadow-[0_28px_90px_rgba(0,0,0,.24)] backdrop-blur-2xl">
        <header className="flex items-start justify-between border-b border-neutral-200/70 px-5 py-5 sm:px-7 sm:py-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-800">Customer profile</p>
            <h2 id="customer-profile-title" className="mt-1 text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">{isAccount ? (editing ? 'Edit account details' : 'My Account') : 'Settings'}</h2>
            <p className="mt-1 text-sm text-neutral-500">{isAccount ? (editing ? 'Keep your contact details up to date.' : 'Manage your personal details and contact information.') : 'Choose which updates you want to receive.'}</p>
          </div>
          <button type="button" onClick={onClose} disabled={saving} aria-label="Close profile" className="rounded-full p-2 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900 disabled:opacity-50"><X className="h-5 w-5" /></button>
        </header>

        {isAccount ? (editing ? <form onSubmit={saveProfile} className="space-y-5 p-5 sm:p-7" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-neutral-700 sm:col-span-2">Full name<input autoFocus autoComplete="name" className={inputClass} value={name} onChange={(event) => setName(event.target.value)} placeholder="Your full name" /></label>
            <label className="text-sm font-medium text-neutral-700">Email address<input type="email" autoComplete="email" className={inputClass} value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></label>
            <label className="text-sm font-medium text-neutral-700">Phone number<input type="tel" autoComplete="tel" className={inputClass} value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+254 7xx xxx xxx" /></label>
          </div>
          {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
          <div className="flex flex-col-reverse gap-2 border-t border-neutral-200/70 pt-4 sm:flex-row sm:justify-end">
            <button type="button" onClick={() => { setEditing(false); setName(currentSession.name); setEmail(currentSession.email); setPhone(currentSession.phone); setError(''); }} disabled={saving} className="rounded-xl px-5 py-3 text-sm font-semibold text-neutral-600 transition hover:bg-neutral-100 disabled:opacity-50">Cancel</button>
            <button type="submit" disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-neutral-900/10 transition hover:bg-neutral-800 disabled:cursor-wait disabled:opacity-70">{saving && <LoaderCircle className="h-4 w-4 animate-spin" />}{saving ? 'Saving changes…' : 'Save changes'}</button>
          </div>
        </form> : <div className="space-y-5 p-5 sm:p-7">
          <div className="flex items-center gap-4 rounded-2xl border border-white bg-white/75 p-4 shadow-sm">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-900"><UserRound className="h-6 w-6" /></div>
            <div className="min-w-0 flex-1"><div className="truncate font-semibold text-neutral-900">{currentSession.name}</div><div className="mt-0.5 text-sm text-neutral-500">Customer account</div></div>
            <button type="button" onClick={() => { setEditing(true); setSaved(false); setError(''); }} className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-900 sm:px-3.5 sm:text-sm"><Pencil className="h-3.5 w-3.5" /> Edit</button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-neutral-200/80 bg-white/55 p-4"><div className="text-xs font-medium text-neutral-500">Email address</div><div className="mt-1.5 break-all text-sm font-semibold text-neutral-900">{currentSession.email || 'Not provided'}</div></div>
            <div className="rounded-2xl border border-neutral-200/80 bg-white/55 p-4"><div className="text-xs font-medium text-neutral-500">Phone number</div><div className="mt-1.5 text-sm font-semibold text-neutral-900">{currentSession.phone || 'Not provided'}</div></div>
          </div>
          {saved ? <div role="status" className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"><Check className="h-4 w-4" /> Account details saved.</div> : <p className="text-xs leading-relaxed text-neutral-500">Use <span className="font-semibold text-neutral-700">Edit</span> to update your name, email, or phone number.</p>}
        </div>) : <div className="space-y-4 p-5 sm:p-7">
          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-neutral-200/80 bg-white/60 p-4 transition hover:bg-white">
            <span className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-800"><Bell className="h-4 w-4" /></span><span><span className="block text-sm font-semibold text-neutral-900">Order updates</span><span className="text-xs text-neutral-500">Status and delivery notifications</span></span></span>
            <input type="checkbox" checked={orderUpdates} onChange={(event) => setOrderUpdates(event.target.checked)} className="h-4 w-4 accent-amber-700" />
          </label>
          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-neutral-200/80 bg-white/60 p-4 transition hover:bg-white">
            <span className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-800"><Settings className="h-4 w-4" /></span><span><span className="block text-sm font-semibold text-neutral-900">Offers and recommendations</span><span className="text-xs text-neutral-500">Occasional marketplace news and deals</span></span></span>
            <input type="checkbox" checked={offers} onChange={(event) => setOffers(event.target.checked)} className="h-4 w-4 accent-amber-700" />
          </label>
          <p className="text-xs text-neutral-400">Notification preferences apply to this session.</p>
        </div>}
      </section>
    </div>
  );
};
