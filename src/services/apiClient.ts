import {
  Product,
  Vendor,
  DeliveryZone,
  ParentOrder,
  SubOrder,
  VendorWallet,
  WalletTransaction,
  PayoutRequest,
  CommissionRule,
  AuditLog,
  UserSession,
  CartItem,
  PlatformSettings,
  Dispute,
  HotDeal,
} from '../types';
import { db } from './dataStore';

// Client-side API layer that interacts with Express /api endpoints or in-memory DB
export const api = {
  // Session
  async getSession(): Promise<UserSession> {
    try {
      const res = await fetch('/api/auth/session');
      if (res.ok) {
        const data = await res.json();
        return data.session;
      }
    } catch (e) {
      // Fallback
    }
    return { id: 'guest', name: 'Guest', email: '', phone: '', role: 'CUSTOMER', isGuest: true };
  },

  async login(identifier: string, password?: string): Promise<{ session: UserSession; message?: string }> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to log in');
      }
      return data;
    } catch (e: any) {
      if (e.message && !e.message.includes('fetch')) {
        throw e;
      }
      // Direct in-memory DB fallback
      const session = db.authenticateUser(identifier, password);
      return { session, message: `Welcome back, ${session.name}!` };
    }
  },

  async registerCustomer(data: {
    name: string;
    email: string;
    phone: string;
    password?: string;
    county?: string;
    town?: string;
  }): Promise<{ session: UserSession; message?: string }> {
    try {
      const res = await fetch('/api/auth/register-customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || 'Registration failed');
      }
      return resData;
    } catch (e: any) {
      if (e.message && !e.message.includes('fetch')) {
        throw e;
      }
      const session = db.registerCustomerUser(data);
      return { session, message: 'Account created successfully! Welcome to SokoSalama.' };
    }
  },

  async registerVendor(data: {
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
  }): Promise<{ session: UserSession; vendor: Vendor; message?: string }> {
    try {
      const res = await fetch('/api/auth/register-vendor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || 'Vendor registration failed');
      }
      return resData;
    } catch (e: any) {
      if (e.message && !e.message.includes('fetch')) {
        throw e;
      }
      const result = db.registerVendorStore(data);
      return { session: result.session, vendor: result.vendor, message: 'Store registered!' };
    }
  },

  async createAdminVendor(data: {
    storeName: string;
    ownerName: string;
    email: string;
    phone: string;
    county: string;
    town: string;
    mpesaPayoutNumber: string;
    bio: string;
    businessRegistrationNumber?: string;
  }): Promise<Vendor> {
    // Admin-created demo merchants are provisioned directly in the shared local store.
    // The public registration flow is intentionally avoided so the admin session stays active.
    const { vendor } = db.registerVendorStore({ ...data, password: `Soko-${Math.random().toString(36).slice(2, 10)}!` });
    return vendor;
  },

  async logout(): Promise<UserSession> {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        return data.session;
      }
    } catch (e) {
      // fallback
    }
    return {
      id: 'guest_' + Date.now(),
      name: 'Guest Shopper',
      email: '',
      phone: '',
      role: 'CUSTOMER',
      isGuest: true,
    };
  },

  async resetPassword(identifier: string, newPassword?: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Password reset failed');
      }
      return data;
    } catch (e: any) {
      if (e.message && !e.message.includes('fetch')) {
        throw e;
      }
      db.resetUserPassword(identifier, newPassword);
      return { success: true, message: 'Password reset successful! You can now log in.' };
    }
  },

  async getDemoUsers(): Promise<any[]> {
    try {
      const res = await fetch('/api/auth/users');
      if (res.ok) {
        const data = await res.json();
        return data.users;
      }
    } catch (e) {
      // fallback
    }
    return db.getAllUsers().map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      role: u.role,
      vendorId: u.vendorId,
      county: u.county,
      town: u.town,
    }));
  },

  async switchRole(role: 'ADMIN' | 'VENDOR' | 'CUSTOMER', vendorId?: string): Promise<UserSession> {
    try {
      const res = await fetch('/api/auth/switch-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, vendorId }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.session;
      }
    } catch (e) {
      // fallback
    }

    if (role === 'ADMIN') {
      return {
        id: 'usr_admin_main',
        name: 'Antony Onyi (Platform Admin)',
        email: 'admin@sokosalama.co.ke',
        phone: '+254700000001',
        role: 'ADMIN',
      };
    } else if (role === 'VENDOR') {
      const vId = vendorId || 'ven_olkaria_leather';
      const vendor = db.vendors.find(v => v.id === vId) || db.vendors[0];
      return {
        id: 'usr_ven_' + vendor.id,
        name: `${vendor.name} Rep`,
        email: vendor.ownerEmail,
        phone: vendor.phone,
        role: 'VENDOR',
        vendorId: vendor.id,
      };
    } else {
      return {
        id: 'cust_wambui_01',
        name: 'Wambui Kariuki',
        email: 'wambui.k@gmail.com',
        phone: '+254720987654',
        role: 'CUSTOMER',
      };
    }
  },

  // Products
  async getPublicProducts(category?: string, search?: string): Promise<Product[]> {
    try {
      const params = new URLSearchParams();
      if (category && category !== 'All') params.set('category', category);
      if (search) params.set('search', search);
      const res = await fetch(`/api/products?${params.toString()}`);
      if (res.ok) return await res.json();
    } catch (e) {
      // fallback
    }
    let list = db.products.filter(p => p.approvalStatus === 'approved' && p.isActive);
    if (category && category !== 'All') list = list.filter(p => p.category === category);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    return list;
  },

  async getVendorProducts(vendorId: string): Promise<Product[]> {
    try {
      const res = await fetch('/api/vendor/products', {
        headers: { 'x-vendor-id': vendorId },
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // fallback
    }
    return db.products.filter(p => p.vendorId === vendorId);
  },

  async createVendorProduct(vendorId: string, productData: any): Promise<Product> {
    try {
      const res = await fetch('/api/vendor/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-vendor-id': vendorId,
        },
        body: JSON.stringify(productData),
      });
      if (res.ok) return await res.json();
      const err = await res.json();
      throw new Error(err.error || 'Failed to submit product');
    } catch (e: any) {
      if (e.message && e.message !== 'Failed to fetch') throw e;
      return db.createProduct(vendorId, productData);
    }
  },

  async updateVendorProduct(vendorId: string, productId: string, updates: Partial<Product>): Promise<Product> {
    try {
      const res = await fetch(`/api/vendor/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-vendor-id': vendorId,
        },
        body: JSON.stringify(updates),
      });
      if (res.ok) return await res.json();
      const err = await res.json();
      throw new Error(err.error || 'Failed to update product');
    } catch (e: any) {
      if (e.message && e.message !== 'Failed to fetch') throw e;
      return db.updateProduct(vendorId, productId, updates);
    }
  },

  async deleteVendorProduct(vendorId: string, productId: string): Promise<{ success: boolean; productId: string }> {
    try {
      const res = await fetch(`/api/vendor/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'x-vendor-id': vendorId,
        },
      });
      if (res.ok) return await res.json();
      const err = await res.json();
      throw new Error(err.error || 'Failed to delete product');
    } catch (e: any) {
      if (e.message && e.message !== 'Failed to fetch') throw e;
      return db.deleteProduct(vendorId, productId);
    }
  },

  async updateVendorProfile(vendorId: string, updates: Partial<Vendor>): Promise<Vendor> {
    try {
      const res = await fetch(`/api/vendor/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-vendor-id': vendorId,
        },
        body: JSON.stringify(updates),
      });
      if (res.ok) return await res.json();
      const err = await res.json();
      throw new Error(err.error || 'Failed to update profile');
    } catch (e: any) {
      if (e.message && e.message !== 'Failed to fetch') throw e;
      return db.updateVendorProfile(vendorId, updates);
    }
  },

  // Admin Products Pending Approval
  async getAdminPendingProducts(): Promise<Product[]> {
    try {
      const res = await fetch('/api/admin/products/pending');
      if (res.ok) return await res.json();
    } catch (e) {}
    return db.products.filter(p => p.approvalStatus === 'submitted');
  },

  async moderateProduct(productId: string, approve: boolean, reason?: string): Promise<Product> {
    try {
      const res = await fetch(`/api/admin/products/${productId}/moderate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approve, reason }),
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return db.moderateProduct(productId, approve, { id: 'usr_admin_main', name: 'Admin', role: 'ADMIN', email: '', phone: '' }, reason);
  },

  async bulkModerateProducts(productIds: string[], approve: boolean, reason?: string): Promise<{ success: boolean; count: number; products?: Product[] }> {
    try {
      const res = await fetch('/api/admin/products/bulk-moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds, approve, reason }),
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    const adminSess: UserSession = { id: 'usr_admin_main', name: 'Admin', role: 'ADMIN', email: '', phone: '' };
    const updated = db.bulkModerateProducts(productIds, approve, adminSess, reason);
    return { success: true, count: updated.length, products: updated };
  },

  // Vendors
  async getApprovedVendors(): Promise<Vendor[]> {
    try {
      const res = await fetch('/api/vendors');
      if (res.ok) return await res.json();
    } catch (e) {}
    return db.vendors.filter(v => v.status === 'approved');
  },

  async getAdminAllVendors(): Promise<Vendor[]> {
    try {
      const res = await fetch('/api/admin/vendors');
      if (res.ok) return await res.json();
    } catch (e) {}
    return db.vendors;
  },

  async updateVendorStatus(vendorId: string, status: Vendor['status']): Promise<Vendor> {
    try {
      const res = await fetch(`/api/admin/vendors/${vendorId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return db.updateVendorStatus(vendorId, status, { id: 'usr_admin', name: 'Admin', role: 'ADMIN', email: '', phone: '' });
  },

  // Delivery Zones
  async getDeliveryZones(): Promise<DeliveryZone[]> {
    try {
      const res = await fetch('/api/delivery-zones');
      if (res.ok) return await res.json();
    } catch (e) {}
    return db.deliveryZones;
  },

  async saveDeliveryZone(zone: DeliveryZone): Promise<DeliveryZone[]> {
    try {
      const res = await fetch('/api/admin/delivery-zones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(zone),
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    const idx = db.deliveryZones.findIndex(z => z.id === zone.id);
    if (idx >= 0) db.deliveryZones[idx] = zone;
    else db.deliveryZones.push({ ...zone, id: 'zone_' + Date.now() });
    return db.deliveryZones;
  },

  // Checkout with Server-Side Price & Stock Verification
  async checkout(orderPayload: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    deliveryAddress: ParentOrder['deliveryAddress'];
    cartItems: {
      productId: string;
      quantity: number;
      selectedAttributes: Record<string, string>;
    }[];
  }): Promise<{ parentOrder: ParentOrder; subOrders: SubOrder[]; checkoutRequestId: string; merchantRequestId: string }> {
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });
      if (res.ok) return await res.json();
      const err = await res.json();
      throw new Error(err.error || 'Checkout validation failed');
    } catch (e: any) {
      if (e.message && e.message !== 'Failed to fetch') throw e;
      return db.createOrder(orderPayload);
    }
  },

  // M-Pesa STK Push trigger
  async triggerMpesaStkPush(checkoutRequestId: string, phoneNumber: string, amountKes: number) {
    try {
      const res = await fetch('/api/mpesa/stk-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkoutRequestId, phoneNumber, amountKes }),
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return {
      ResponseCode: '0',
      ResponseDescription: 'Success. Request accepted for processing',
      CheckoutRequestID: checkoutRequestId,
      CustomerMessage: `Success. M-Pesa prompt has been sent to ${phoneNumber} for KES ${amountKes}.`,
    };
  },

  // Simulate/Receive M-Pesa STK Callback
  async confirmMpesaPayment(checkoutRequestId: string, mpesaReceiptNumber: string, resultCode: number = 0) {
    try {
      const res = await fetch('/api/mpesa/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkoutRequestId, mpesaReceiptNumber, resultCode }),
      });
      if (res.ok) return await res.json();
      const err = await res.json();
      throw new Error(err.error || 'Payment confirmation failed');
    } catch (e: any) {
      if (e.message && e.message !== 'Failed to fetch') throw e;
      return db.confirmMpesaPayment(checkoutRequestId, mpesaReceiptNumber, resultCode);
    }
  },

  // Orders: Customer view
  async getCustomerOrders(phone: string): Promise<{ parentOrders: ParentOrder[]; subOrders: SubOrder[] }> {
    try {
      const res = await fetch(`/api/orders/customer?phone=${encodeURIComponent(phone)}`);
      if (res.ok) return await res.json();
    } catch (e) {}
    const parentOrders = db.parentOrders.filter(
      p => p.customerPhone.replace(/\D/g, '') === phone.replace(/\D/g, '')
    );
    const parentIds = parentOrders.map(p => p.id);
    const subOrders = db.subOrders.filter(so => parentIds.includes(so.parentOrderId));
    return { parentOrders, subOrders };
  },

  // Sub-Orders: Vendor view (Tenant-isolated)
  async getVendorSubOrders(vendorId: string): Promise<SubOrder[]> {
    try {
      const res = await fetch('/api/vendor/sub-orders', {
        headers: { 'x-vendor-id': vendorId },
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return db.subOrders.filter(so => so.vendorId === vendorId);
  },

  // Sub-Orders: Admin view
  async getAdminSubOrders(): Promise<{ parentOrders: ParentOrder[]; subOrders: SubOrder[] }> {
    try {
      const res = await fetch('/api/admin/sub-orders');
      if (res.ok) return await res.json();
    } catch (e) {}
    return { parentOrders: db.parentOrders, subOrders: db.subOrders };
  },

  // Sub-Order fulfillment actions
  async dispatchSubOrder(subOrderId: string, courierPartner: string, trackingReference: string, vendorId: string): Promise<SubOrder> {
    try {
      const res = await fetch(`/api/sub-orders/${subOrderId}/dispatch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-vendor-id': vendorId,
        },
        body: JSON.stringify({ courierPartner, trackingReference }),
      });
      if (res.ok) return await res.json();
      const err = await res.json();
      throw new Error(err.error || 'Failed to dispatch order');
    } catch (e: any) {
      if (e.message && e.message !== 'Failed to fetch') throw e;
      return db.dispatchSubOrder(subOrderId, courierPartner, trackingReference, vendorId);
    }
  },

  async deliverSubOrder(subOrderId: string, userSession: UserSession): Promise<any> {
    try {
      const res = await fetch(`/api/sub-orders/${subOrderId}/deliver`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) return await res.json();
      const err = await res.json();
      throw new Error(err.error || 'Failed to confirm delivery');
    } catch (e: any) {
      if (e.message && e.message !== 'Failed to fetch') throw e;
      return db.confirmSubOrderDelivery(subOrderId, userSession);
    }
  },

  // Wallet & Double-Entry Ledger (Tenant-Isolated)
  async getVendorWallet(vendorId: string): Promise<{ wallet: VendorWallet; transactions: WalletTransaction[]; payouts: PayoutRequest[] }> {
    try {
      const res = await fetch('/api/vendor/wallet', {
        headers: { 'x-vendor-id': vendorId },
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    const wallet = db.wallets[vendorId] || {
      id: 'wal_' + vendorId,
      vendorId,
      availableBalanceKes: 0,
      pendingEscrowBalanceKes: 0,
      totalLifetimeEarnedKes: 0,
      totalLifetimeWithdrawnKes: 0,
      updatedAt: new Date().toISOString(),
    };
    const transactions = db.transactions.filter(t => t.vendorId === vendorId);
    const payouts = db.payouts.filter(p => p.vendorId === vendorId);
    return { wallet, transactions, payouts };
  },

  async requestPayout(vendorId: string, amountKes: number, destinationMpesa: string): Promise<any> {
    try {
      const res = await fetch('/api/vendor/payouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-vendor-id': vendorId,
        },
        body: JSON.stringify({ amountKes, destinationMpesa }),
      });
      if (res.ok) return await res.json();
      const err = await res.json();
      throw new Error(err.error || 'Payout request failed');
    } catch (e: any) {
      if (e.message && e.message !== 'Failed to fetch') throw e;
      return db.requestPayout(vendorId, amountKes, destinationMpesa);
    }
  },

  // Admin Payouts & Commissions
  async getAdminPayouts(): Promise<PayoutRequest[]> {
    try {
      const res = await fetch('/api/admin/payouts');
      if (res.ok) return await res.json();
    } catch (e) {}
    return db.payouts;
  },

  async processPayout(payoutId: string, approve: boolean, notes?: string): Promise<PayoutRequest> {
    try {
      const res = await fetch(`/api/admin/payouts/${payoutId}/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approve, notes }),
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return db.processPayout(payoutId, approve, { id: 'usr_admin', name: 'Admin', role: 'ADMIN', email: '', phone: '' }, notes);
  },

  async getCommissionRules(): Promise<CommissionRule[]> {
    try {
      const res = await fetch('/api/admin/commissions');
      if (res.ok) return await res.json();
    } catch (e) {}
    return db.commissionRules;
  },

  async saveCommissionRule(rule: CommissionRule): Promise<CommissionRule> {
    try {
      const res = await fetch('/api/admin/commissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rule),
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return db.saveCommissionRule(rule, { id: 'usr_admin', name: 'Admin', role: 'ADMIN', email: '', phone: '' });
  },

  // Audit Logs & Analytics
  async getAuditLogs(): Promise<AuditLog[]> {
    try {
      const res = await fetch('/api/admin/audit-logs');
      if (res.ok) return await res.json();
    } catch (e) {}
    return db.auditLogs;
  },

  async getFinancialAnalytics(): Promise<any> {
    try {
      const res = await fetch('/api/admin/financial-summary');
      if (res.ok) return await res.json();
    } catch (e) {}
    const totalEscrowLockedKes = Object.values(db.wallets).reduce((sum, w) => sum + w.pendingEscrowBalanceKes, 0);
    const totalVendorAvailableKes = Object.values(db.wallets).reduce((sum, w) => sum + w.availableBalanceKes, 0);
    const totalPlatformCommissionsKes = db.subOrders.reduce((sum, so) => {
      return so.fulfillmentStatus === 'delivered' ? sum + so.platformCommissionKes : sum;
    }, 0);
    const pendingCommissionsInEscrowKes = db.subOrders.reduce((sum, so) => {
      return so.fulfillmentStatus !== 'delivered' ? sum + so.platformCommissionKes : sum;
    }, 0);
    const grossMerchandiseValueKes = db.parentOrders.reduce((sum, po) => {
      return po.paymentStatus === 'paid' ? sum + po.totalAmountKes : sum;
    }, 0);
    return {
      totalEscrowLockedKes,
      totalVendorAvailableKes,
      totalPlatformCommissionsKes,
      pendingCommissionsInEscrowKes,
      grossMerchandiseValueKes,
      totalOrdersCount: db.parentOrders.length,
      activeVendorsCount: db.vendors.filter(v => v.status === 'approved').length,
    };
  },

  // Settings
  async getSettings(): Promise<PlatformSettings> {
    try {
      const res = await fetch('/api/admin/settings');
      if (res.ok) return await res.json();
    } catch (e) {}
    return db.settings;
  },

  async updateSettings(settings: Partial<PlatformSettings>): Promise<PlatformSettings> {
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) return await res.json();
      const err = await res.json();
      throw new Error(err.error || 'Failed to update settings');
    } catch (e: any) {
      if (e.message && e.message !== 'Failed to fetch') throw e;
      return db.updateSettings(settings, { id: 'usr_admin', name: 'Admin', role: 'ADMIN', email: '', phone: '' });
    }
  },

  // Disputes & Arbitration
  async getDisputes(): Promise<Dispute[]> {
    try {
      const res = await fetch('/api/admin/disputes');
      if (res.ok) return await res.json();
    } catch (e) {}
    return db.disputes;
  },

  async resolveDispute(
    disputeId: string,
    resolutionType: 'FULL_REFUND' | 'RELEASE_TO_VENDOR' | 'SPLIT_ESCROW',
    notes: string
  ): Promise<Dispute> {
    try {
      const res = await fetch(`/api/admin/disputes/${disputeId}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resolutionType, notes }),
      });
      if (res.ok) return await res.json();
      const err = await res.json();
      throw new Error(err.error || 'Failed to resolve dispute');
    } catch (e: any) {
      if (e.message && e.message !== 'Failed to fetch') throw e;
      return db.resolveDispute(disputeId, resolutionType, notes, { id: 'usr_admin', name: 'Admin', role: 'ADMIN', email: '', phone: '' });
    }
  },

  // Vendor Custom Commission
  async updateVendorCommission(vendorId: string, commissionRatePercent: number, customFixedFeeKes: number): Promise<Vendor> {
    try {
      const res = await fetch(`/api/admin/vendors/${vendorId}/commission`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commissionRatePercent, customFixedFeeKes }),
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return db.updateVendorCommission(vendorId, commissionRatePercent, customFixedFeeKes, { id: 'usr_admin', name: 'Admin', role: 'ADMIN', email: '', phone: '' });
  },

  // Delivery Zone Deletion
  async deleteDeliveryZone(zoneId: string): Promise<DeliveryZone[]> {
    try {
      const res = await fetch(`/api/admin/delivery-zones/${zoneId}`, {
        method: 'DELETE',
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return db.deleteDeliveryZone(zoneId, { id: 'usr_admin', name: 'Admin', role: 'ADMIN', email: '', phone: '' });
  },

  // Auto Release Escrow Simulation
  async triggerAutoRelease(): Promise<{ releasedCount: number; subOrderIds: string[] }> {
    try {
      const res = await fetch('/api/admin/escrow/auto-release', {
        method: 'POST',
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return db.autoReleaseDeliveredEscrows({ id: 'usr_admin', name: 'Admin', role: 'ADMIN', email: '', phone: '' });
  },

  // Hot Deals (Admin & Storefront)
  async getHotDeals(): Promise<HotDeal[]> {
    try {
      const res = await fetch('/api/hot-deals');
      if (res.ok) return await res.json();
    } catch (e) {}
    return db.getHotDeals();
  },

  async saveHotDeal(dealData: Partial<HotDeal> & { productId: string }): Promise<HotDeal> {
    try {
      const res = await fetch('/api/admin/hot-deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dealData),
      });
      if (res.ok) return await res.json();
      const err = await res.json();
      throw new Error(err.error || 'Failed to save hot deal');
    } catch (e: any) {
      if (e.message && e.message !== 'Failed to fetch') throw e;
      return db.createOrUpdateHotDeal(dealData, { id: 'usr_admin', name: 'Admin', role: 'ADMIN', email: '', phone: '' });
    }
  },

  async deleteHotDeal(dealId: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/admin/hot-deals/${dealId}`, {
        method: 'DELETE',
      });
      if (res.ok) return true;
    } catch (e) {}
    return db.deleteHotDeal(dealId, { id: 'usr_admin', name: 'Admin', role: 'ADMIN', email: '', phone: '' });
  },

  async toggleHotDeal(dealId: string, isActive: boolean): Promise<HotDeal> {
    try {
      const res = await fetch(`/api/admin/hot-deals/${dealId}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive }),
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return db.toggleHotDeal(dealId, isActive);
  },

  async extendHotDealTimer(dealId: string, hours: number): Promise<HotDeal> {
    try {
      const res = await fetch(`/api/admin/hot-deals/${dealId}/extend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hours }),
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return db.extendHotDealTimer(dealId, hours);
  },
};
