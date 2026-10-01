import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CustomerStorefront } from './components/CustomerStorefront';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartCheckoutModal } from './components/CartCheckoutModal';
import { MpesaPaymentModal } from './components/MpesaPaymentModal';
import { CustomerOrders } from './components/CustomerOrders';
import { VendorDashboard } from './components/VendorDashboard';
import { AdminConsole } from './components/AdminConsole';
import { AuthPage } from './components/AuthPage';
import { CustomerProfileModal } from './components/CustomerProfileModal';
import { Footer } from './components/Footer';
import iconLogo from './assets/images/logo/Icon_Logo_Transparent.png';
import { api } from './services/apiClient';
import { 
  UserSession, 
  Product, 
  Vendor, 
  CartItem, 
  DeliveryZone, 
  ParentOrder, 
  SubOrder, 
  VendorWallet, 
  WalletTransaction, 
  PayoutRequest, 
  CommissionRule, 
  AuditLog, 
  UserRole,
  PlatformSettings,
  Dispute,
  HotDeal
} from './types';
import { INITIAL_REVIEWS, INITIAL_SETTINGS } from './services/dataStore';

export default function App() {
  // Session & View
  const [currentSession, setCurrentSession] = useState<UserSession>({ id: 'guest', name: 'Guest', email: '', phone: '', role: 'CUSTOMER', isGuest: true });
  const [authReturnView, setAuthReturnView] = useState<'storefront' | 'orders' | 'vendor' | 'admin'>('storefront');
  const [activeView, setActiveView] = useState<'storefront' | 'orders' | 'vendor' | 'admin' | 'auth'>('storefront');
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'signup'>('login');
  const [customerProfileSection, setCustomerProfileSection] = useState<'account' | 'settings' | null>(null);

  // Core Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  // Orders
  const [parentOrders, setParentOrders] = useState<ParentOrder[]>([]);
  const [subOrders, setSubOrders] = useState<SubOrder[]>([]);

  // Vendor-Specific State (Tenant Isolated)
  const [vendorProducts, setVendorProducts] = useState<Product[]>([]);
  const [vendorSubOrders, setVendorSubOrders] = useState<SubOrder[]>([]);
  const [vendorWallet, setVendorWallet] = useState<VendorWallet>({
    id: 'wal_olkaria',
    vendorId: 'ven_olkaria_leather',
    availableBalanceKes: 48500,
    pendingEscrowBalanceKes: 14500,
    totalLifetimeEarnedKes: 186000,
    totalLifetimeWithdrawnKes: 123000,
    updatedAt: new Date().toISOString(),
  });
  const [vendorTransactions, setVendorTransactions] = useState<WalletTransaction[]>([]);
  const [vendorPayouts, setVendorPayouts] = useState<PayoutRequest[]>([]);

  // Admin-Specific State
  const [adminPayouts, setAdminPayouts] = useState<PayoutRequest[]>([]);
  const [commissionRules, setCommissionRules] = useState<CommissionRule[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [financialStats, setFinancialStats] = useState<any>({});
  const [settings, setSettings] = useState<PlatformSettings>(INITIAL_SETTINGS);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [hotDeals, setHotDeals] = useState<HotDeal[]>([]);

  // Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMpesaModalOpen, setIsMpesaModalOpen] = useState(false);
  const [currentCheckoutOrder, setCurrentCheckoutOrder] = useState<ParentOrder | null>(null);
  const [currentCheckoutSubOrders, setCurrentCheckoutSubOrders] = useState<SubOrder[]>([]);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Initialize initial cart with demo multi-vendor items so user immediately sees order splitting!
  useEffect(() => {
    // Refresh all data
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const sess = await api.getSession();
      setCurrentSession(sess);

      const [prods, vends, zones, deals] = await Promise.all([
        api.getPublicProducts(),
        api.getApprovedVendors(),
        api.getDeliveryZones(),
        api.getHotDeals(),
      ]);

      setProducts(prods);
      setVendors(vends);
      setDeliveryZones(zones);
      setHotDeals(deals);

      // Preload cart with 2 items from different vendors to demonstrate multi-vendor checkout right away
      if (prods.length >= 2) {
        setCartItems([
          {
            productId: prods[0].id,
            vendorId: prods[0].vendorId,
            vendorName: prods[0].vendorName,
            title: prods[0].title,
            sku: prods[0].sku,
            priceKes: prods[0].priceKes,
            quantity: 1,
            selectedAttributes: { Color: 'Cognac Tan' },
            image: prods[0].images[0],
          },
          {
            productId: prods[1].id,
            vendorId: prods[1].vendorId,
            vendorName: prods[1].vendorName,
            title: prods[1].title,
            sku: prods[1].sku,
            priceKes: prods[1].priceKes,
            quantity: 1,
            selectedAttributes: { Size: 'M (40R)' },
            image: prods[1].images[0],
          },
        ]);
      }

      // Customer orders
      const custOrders = await api.getCustomerOrders(sess.phone);
      setParentOrders(custOrders.parentOrders);
      setSubOrders(custOrders.subOrders);

      // Load vendor specific if vendor
      const targetVendorId = sess.vendorId || (vends[0] ? vends[0].id : 'ven_olkaria_leather');
      await refreshVendorData(targetVendorId);

      // Load admin data
      await refreshAdminData();
    } catch (err) {
      console.error('Error loading initial data:', err);
    }
  };

  const refreshVendorData = async (vendorId: string) => {
    try {
      const [vProds, vSubs, vWal] = await Promise.all([
        api.getVendorProducts(vendorId),
        api.getVendorSubOrders(vendorId),
        api.getVendorWallet(vendorId),
      ]);
      setVendorProducts(vProds);
      setVendorSubOrders(vSubs);
      setVendorWallet(vWal.wallet);
      setVendorTransactions(vWal.transactions);
      setVendorPayouts(vWal.payouts);
    } catch (err) {
      console.error('Failed refreshing vendor data:', err);
    }
  };

  const refreshAdminData = async () => {
    try {
      const [pays, rules, logs, stats, allOrders, currentSettings, currentDisputes, currentDeals] = await Promise.all([
        api.getAdminPayouts(),
        api.getCommissionRules(),
        api.getAuditLogs(),
        api.getFinancialAnalytics(),
        api.getAdminSubOrders(),
        api.getSettings(),
        api.getDisputes(),
        api.getHotDeals(),
      ]);
      setAdminPayouts(pays);
      setCommissionRules(rules);
      setAuditLogs(logs);
      setFinancialStats(stats);
      setSettings(currentSettings);
      setDisputes(currentDisputes);
      setHotDeals(currentDeals);
      if (allOrders.parentOrders) {
        setParentOrders(allOrders.parentOrders);
        setSubOrders(allOrders.subOrders);
      }
    } catch (err) {
      console.error('Failed refreshing admin data:', err);
    }
  };

  // Switch role handler
  const handleSwitchRole = async (role: UserRole, vendorId?: string) => {
    const updated = await api.switchRole(role, vendorId);
    setCurrentSession(updated);

    if (role === 'VENDOR') {
      const vId = vendorId || updated.vendorId || 'ven_olkaria_leather';
      await refreshVendorData(vId);
      setActiveView('vendor');
    } else if (role === 'ADMIN') {
      await refreshAdminData();
      setActiveView('admin');
    } else {
      const custOrders = await api.getCustomerOrders(updated.phone);
      setParentOrders(custOrders.parentOrders);
      setSubOrders(custOrders.subOrders);
      setActiveView('storefront');
    }
  };

  // Auth Handlers (Log In, Sign Up, Log Out)
  const handleLogout = async () => {
    const guestSession = await api.logout();
    setCurrentSession(guestSession);
    setActiveView('storefront');
  };

  const handleLoginSuccess = async (newSession: UserSession, message?: string) => {
    setCurrentSession(newSession);
    if (newSession.role === 'VENDOR') {
      const vId = newSession.vendorId || (vendors[0] ? vendors[0].id : 'ven_olkaria_leather');
      await refreshVendorData(vId);
      setActiveView('vendor');
    } else if (newSession.role === 'ADMIN') {
      await refreshAdminData();
      setActiveView('admin');
    } else {
      if (newSession.phone) {
        try {
          const custOrders = await api.getCustomerOrders(newSession.phone);
          setParentOrders(custOrders.parentOrders);
          setSubOrders(custOrders.subOrders);
        } catch (e) {
          // ignore
        }
      }
      setActiveView(authReturnView);
    }
  };

  // Cart Handlers
  const handleAddToCart = (
    product: Product,
    quantity: number,
    selectedAttributes: Record<string, string>,
    overridePriceKes?: number
  ) => {
    const effectivePrice = overridePriceKes !== undefined ? overridePriceKes : product.priceKes;
    setCartItems((prev) => {
      const existingIdx = prev.findIndex((item) => item.productId === product.id);
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx].quantity += quantity;
        if (overridePriceKes !== undefined) {
          copy[existingIdx].priceKes = overridePriceKes;
        }
        return copy;
      }
      return [
        ...prev,
        {
          productId: product.id,
          vendorId: product.vendorId,
          vendorName: product.vendorName,
          title: product.title,
          sku: product.sku,
          priceKes: effectivePrice,
          quantity,
          selectedAttributes,
          image: product.images[0],
        },
      ];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  // Checkout Initiation (Server-Side Price & Stock Verification)
  const handleProceedToMpesa = async (orderPayload: any) => {
    setCheckoutLoading(true);
    try {
      const result = await api.checkout(orderPayload);
      setCurrentCheckoutOrder(result.parentOrder);
      setCurrentCheckoutSubOrders(result.subOrders);
      setIsCartOpen(false);
      setIsMpesaModalOpen(true);
    } catch (err: any) {
      throw err;
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Confirm Mpesa Callback (Simulated or Webhook)
  const handleConfirmMpesaCallback = async (checkoutRequestId: string, mpesaReceiptNumber: string, resultCode: number) => {
    const res = await api.confirmMpesaPayment(checkoutRequestId, mpesaReceiptNumber, resultCode);
    if (res.success) {
      setCartItems([]); // Clear cart
      // Refresh orders
      const custOrders = await api.getCustomerOrders(currentSession.phone);
      setParentOrders(custOrders.parentOrders);
      setSubOrders(custOrders.subOrders);
      // Refresh admin & vendor metrics
      if (currentSession.vendorId) await refreshVendorData(currentSession.vendorId);
      await refreshAdminData();
    }
    return res;
  };

  // Confirm Delivery & Release Escrow
  const handleConfirmDelivery = async (subOrderId: string) => {
    await api.deliverSubOrder(subOrderId, currentSession);
    const custOrders = await api.getCustomerOrders(currentSession.phone);
    setParentOrders(custOrders.parentOrders);
    setSubOrders(custOrders.subOrders);
    if (currentSession.vendorId) await refreshVendorData(currentSession.vendorId);
    await refreshAdminData();
  };

  // Vendor actions
  const handleDispatchSubOrder = async (subOrderId: string, courier: string, trackingRef: string) => {
    const vId = currentSession.vendorId || 'ven_olkaria_leather';
    await api.dispatchSubOrder(subOrderId, courier, trackingRef, vId);
    await refreshVendorData(vId);
    await refreshAdminData();
  };

  const handleCreateProduct = async (productData: any) => {
    const vId = currentSession.vendorId || 'ven_olkaria_leather';
    await api.createVendorProduct(vId, productData);
    await refreshVendorData(vId);
    const allProds = await api.getPublicProducts();
    setProducts(allProds);
  };

  const handleRequestPayout = async (amountKes: number, destinationPhone: string) => {
    const vId = currentSession.vendorId || 'ven_olkaria_leather';
    await api.requestPayout(vId, amountKes, destinationPhone);
    await refreshVendorData(vId);
    await refreshAdminData();
  };

  // Admin actions
  const handleApproveProduct = async (productId: string, approve: boolean, reason?: string) => {
    await api.moderateProduct(productId, approve, reason);
    const [allProds, adminProds] = await Promise.all([
      api.getPublicProducts(),
      api.getAdminPendingProducts(),
    ]);
    setProducts(allProds);
    if (currentSession.vendorId) await refreshVendorData(currentSession.vendorId);
    await refreshAdminData();
  };

  const handleBulkModerateProducts = async (productIds: string[], approve: boolean, reason?: string) => {
    await api.bulkModerateProducts(productIds, approve, reason);
    const [allProds, adminProds] = await Promise.all([
      api.getPublicProducts(),
      api.getAdminPendingProducts(),
    ]);
    setProducts(allProds);
    if (currentSession.vendorId) await refreshVendorData(currentSession.vendorId);
    await refreshAdminData();
  };

  const handleUpdateVendorStatus = async (vendorId: string, status: Vendor['status']) => {
    await api.updateVendorStatus(vendorId, status);
    const vends = await api.getApprovedVendors();
    setVendors(vends);
    await refreshAdminData();
  };

  const handleProcessPayout = async (payoutId: string, approve: boolean, notes?: string) => {
    await api.processPayout(payoutId, approve, notes);
    if (currentSession.vendorId) await refreshVendorData(currentSession.vendorId);
    await refreshAdminData();
  };

  const handleSaveCommissionRule = async (rule: CommissionRule) => {
    await api.saveCommissionRule(rule);
    await refreshAdminData();
  };

  const handleSaveDeliveryZone = async (zone: DeliveryZone) => {
    const updatedZones = await api.saveDeliveryZone(zone);
    setDeliveryZones(updatedZones);
  };

  const handleDeleteDeliveryZone = async (zoneId: string) => {
    const updatedZones = await api.deleteDeliveryZone(zoneId);
    setDeliveryZones(updatedZones);
    await refreshAdminData();
  };

  const handleUpdateSettings = async (newSettings: Partial<PlatformSettings>) => {
    const updated = await api.updateSettings(newSettings);
    setSettings(updated);
    await refreshAdminData();
  };

  const handleResolveDispute = async (
    disputeId: string, 
    resolutionType: 'FULL_REFUND' | 'RELEASE_TO_VENDOR' | 'SPLIT_ESCROW', 
    notes: string
  ) => {
    await api.resolveDispute(disputeId, resolutionType, notes);
    await refreshAdminData();
    if (currentSession.vendorId) await refreshVendorData(currentSession.vendorId);
  };

  const handleUpdateVendorCommission = async (
    vendorId: string, 
    commissionRatePercent: number, 
    customFixedFeeKes: number
  ) => {
    await api.updateVendorCommission(vendorId, commissionRatePercent, customFixedFeeKes);
    const vends = await api.getApprovedVendors();
    setVendors(vends);
    await refreshAdminData();
  };

  const handleTriggerAutoRelease = async () => {
    const result = await api.triggerAutoRelease();
    await refreshAdminData();
    if (currentSession.vendorId) await refreshVendorData(currentSession.vendorId);
    return result;
  };

  // Hot Deal Admin Handlers
  const handleSaveHotDeal = async (dealData: Partial<HotDeal> & { productId: string }) => {
    await api.saveHotDeal(dealData);
    const updated = await api.getHotDeals();
    setHotDeals(updated);
  };

  const handleDeleteHotDeal = async (dealId: string) => {
    await api.deleteHotDeal(dealId);
    const updated = await api.getHotDeals();
    setHotDeals(updated);
  };

  const handleToggleHotDeal = async (dealId: string, isActive: boolean) => {
    await api.toggleHotDeal(dealId, isActive);
    const updated = await api.getHotDeals();
    setHotDeals(updated);
  };

  const handleExtendHotDealTimer = async (dealId: string, hours: number) => {
    await api.extendHotDealTimer(dealId, hours);
    const updated = await api.getHotDeals();
    setHotDeals(updated);
  };

  const handleUpdateProduct = async (productId: string, updates: Partial<Product>) => {
    const vId = currentSession.vendorId || currentVendor.id;
    await api.updateVendorProduct(vId, productId, updates);
    await refreshVendorData(vId);
    const pubProds = await api.getPublicProducts();
    setProducts(pubProds);
  };

  const handleDeleteProduct = async (productId: string) => {
    const vId = currentSession.vendorId || currentVendor.id;
    await api.deleteVendorProduct(vId, productId);
    await refreshVendorData(vId);
    const pubProds = await api.getPublicProducts();
    setProducts(pubProds);
  };

  const handleUpdateVendorProfile = async (updates: Partial<Vendor>) => {
    const vId = currentSession.vendorId || currentVendor.id;
    await api.updateVendorProfile(vId, updates);
    const vends = await api.getApprovedVendors();
    setVendors(vends);
    await refreshVendorData(vId);
  };

  const handleSelectActiveVendor = async (vendorId: string) => {
    await handleSwitchRole('VENDOR', vendorId);
  };

  const currentVendor = vendors.find(v => v.id === currentSession.vendorId) || vendors[0] || {
    id: 'ven_olkaria_leather',
    name: 'Olkaria Artisan Leather',
    slug: 'olkaria-artisan-leather',
    ownerEmail: 'leather@olkaria.co.ke',
    phone: '+254712345678',
    county: 'Nairobi',
    town: 'Industrial Area',
    status: 'approved' as const,
    commissionRatePercent: 8,
    mpesaPayoutNumber: '+254712345678',
    bio: 'Master artisans crafting vegetable-tanned, full-grain Kenyan cowhide luggage.',
    rating: 4.9,
    joinedAt: '2025-08-15T09:00:00Z',
  };

  const cartCount = cartItems.reduce((acc, it) => acc + it.quantity, 0);
  const siteSettings: Record<string, unknown> = { ...(settings.adminConfig || {}), ...settings };
  const siteValue = (key: string, fallback = '') => typeof siteSettings[key] === 'string' && siteSettings[key] ? String(siteSettings[key]) : fallback;
  const storefrontAvailable = siteValue('websiteStatus', 'Live') === 'Live' && settings.maintenanceMode !== true;

  useEffect(() => {
    const brand = siteValue('marketplaceName', 'SokoSalama');
    document.title = brand;
    let icon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!icon) {
      icon = document.createElement('link');
      icon.rel = 'icon';
      document.head.appendChild(icon);
    }
    icon.href = siteValue('faviconUrl') || iconLogo;
  }, [settings]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#F7F7F4] via-[#F4F4F0] to-[#EFEFEA] text-neutral-900 font-sans selection:bg-amber-100 selection:text-amber-900 relative">
      
      {/* Top Bar strictly obeying Top Bar Contract (Single text element wordmark, clean links, primary actions) */}
      <Navbar
        currentSession={currentSession}
        activeView={activeView}
        setActiveView={setActiveView}
        cartCount={storefrontAvailable ? cartCount : 0}
        openCart={() => { if (storefrontAvailable) setIsCartOpen(true); }}
        onSwitchRole={handleSwitchRole}
        vendorsList={vendors.map(v => ({ id: v.id, name: v.name }))}
        brandName={siteValue('marketplaceName', 'SokoSalama')}
        announcementEnabled={siteSettings.announcementBarEnabled === true}
        announcementText={siteValue('announcementBarText')}
        onLogout={handleLogout}
        onCustomerPanel={setCustomerProfileSection}
        onOpenAuth={(mode = 'login') => {
          setAuthInitialMode(mode);
          setActiveView('auth');
        }}
        onNavigate={(view) => {
          if (view === 'orders' && currentSession.isGuest) {
            setAuthReturnView('orders');
            setAuthInitialMode('login');
            setActiveView('auth');
            return;
          }
          setActiveView(view);
        }}
      />

      {customerProfileSection && !currentSession.isGuest && <CustomerProfileModal
        currentSession={currentSession}
        section={customerProfileSection}
        onClose={() => setCustomerProfileSection(null)}
        onSaveProfile={async (updates) => {
          const updatedSession = await api.updateCustomerProfile(currentSession.id, updates);
          setCurrentSession(updatedSession);
        }}
      />}

      {/* Main Content Area */}
      <main className="flex-1">
        {activeView === 'auth' && (
          <AuthPage
            currentSession={currentSession}
            initialMode={authInitialMode}
            onNavigateHome={() => setActiveView('storefront')}
            onLoginSuccess={handleLoginSuccess}
            onLogin={api.login}
            onRegisterCustomer={api.registerCustomer}
            onRegisterVendor={async (data) => {
              const res = await api.registerVendor(data);
              const updatedVendors = await api.getApprovedVendors();
              setVendors(updatedVendors);
              return res;
            }}
            onResetPassword={api.resetPassword}
          />
        )}

        {activeView === 'storefront' && (
          storefrontAvailable ? <CustomerStorefront
            products={products}
            vendors={vendors}
            hotDeals={hotDeals}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onQuickAdd={(p, overridePrice) => handleAddToCart(p, 1, {}, overridePrice)}
            onClaimDeal={(deal, p) => handleAddToCart(p, 1, {}, deal.dealPriceKes)}
            onFilterByVendor={() => {}}
          /> : <section className="mx-auto my-20 max-w-xl px-5 text-center"><div className="rounded-3xl border border-white/80 bg-white/75 p-10 shadow-xl backdrop-blur-xl"><h1 className="text-2xl font-bold text-neutral-900">{siteValue('websiteStatus') === 'Coming soon' ? 'We’ll be back soon' : siteValue('websiteStatus') === 'Private' ? 'This marketplace is private' : 'We’re making a few updates'}</h1><p className="mt-3 text-sm leading-relaxed text-neutral-600">{siteValue('footerContent', 'The marketplace is temporarily unavailable. Please check back soon.')}</p>{siteValue('supportEmail') && <a className="mt-5 inline-block font-semibold text-amber-800 hover:underline" href={`mailto:${siteValue('supportEmail')}`}>{siteValue('supportEmail')}</a>}</div></section>
        )}

        {activeView === 'orders' && (
          <CustomerOrders
            parentOrders={parentOrders}
            subOrders={subOrders}
            onConfirmDelivery={handleConfirmDelivery}
            currentSession={currentSession}
          />
        )}

        {activeView === 'vendor' && (
          <VendorDashboard
            currentSession={currentSession}
            vendor={currentVendor}
            allVendors={vendors}
            products={vendorProducts}
            subOrders={vendorSubOrders}
            wallet={vendorWallet}
            transactions={vendorTransactions}
            payouts={vendorPayouts}
            disputes={disputes.filter(d => d.vendorId === currentVendor.id)}
            onDispatchSubOrder={handleDispatchSubOrder}
            onCreateProduct={handleCreateProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onRequestPayout={handleRequestPayout}
            onUpdateVendorProfile={handleUpdateVendorProfile}
            onSelectActiveVendor={handleSelectActiveVendor}
            onViewStorefront={() => setActiveView('storefront')}
          />
        )}

        {activeView === 'admin' && (
          <AdminConsole
            currentSession={currentSession}
            vendors={vendors}
            products={products}
            payouts={adminPayouts}
            commissionRules={commissionRules}
            deliveryZones={deliveryZones}
            auditLogs={auditLogs}
            parentOrders={parentOrders}
            subOrders={subOrders}
            financialStats={financialStats}
            settings={settings}
            disputes={disputes}
            onApproveProduct={handleApproveProduct}
            onBulkModerateProducts={handleBulkModerateProducts}
            onUpdateVendorStatus={handleUpdateVendorStatus}
            onCreateVendor={async (data) => {
              const created = await api.createAdminVendor(data);
              const updated = await api.getAdminAllVendors();
              setVendors(updated);
              return created;
            }}
            onProcessPayout={handleProcessPayout}
            onSaveCommissionRule={handleSaveCommissionRule}
            onSaveDeliveryZone={handleSaveDeliveryZone}
            onDeleteDeliveryZone={handleDeleteDeliveryZone}
            onUpdateSettings={handleUpdateSettings}
            onResolveDispute={handleResolveDispute}
            onUpdateVendorCommission={handleUpdateVendorCommission}
            onTriggerAutoRelease={handleTriggerAutoRelease}
            hotDeals={hotDeals}
            onSaveHotDeal={handleSaveHotDeal}
            onDeleteHotDeal={handleDeleteHotDeal}
            onToggleHotDeal={handleToggleHotDeal}
            onExtendHotDealTimer={handleExtendHotDealTimer}
          />
        )}
      </main>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        reviews={INITIAL_REVIEWS}
      />

      {/* Cart & Multi-Vendor Checkout Drawer/Modal */}
      <CartCheckoutModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        deliveryZones={deliveryZones}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToMpesa={handleProceedToMpesa}
        isLoading={checkoutLoading}
      />

      {/* Interactive M-Pesa STK Push Verification Modal */}
      <MpesaPaymentModal
        isOpen={isMpesaModalOpen}
        onClose={() => setIsMpesaModalOpen(false)}
        order={currentCheckoutOrder}
        subOrders={currentCheckoutSubOrders}
        onConfirmCallback={handleConfirmMpesaCallback}
        onPaymentSuccessRedirect={() => {
          setIsMpesaModalOpen(false);
          setActiveView('orders');
        }}
      />

      {/* Footer */}
      <Footer
        siteSettings={siteSettings}
        onOpenAuth={(mode = 'login') => {
          setAuthInitialMode(mode);
          setActiveView('auth');
        }}
      />

    </div>
  );
}
