import express, { Request, Response } from 'express';
import { createCipheriv, randomBytes } from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './src/services/dataStore';
import { UserSession } from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '12mb' }));
  const encryptedPaymentSecrets = new Map<string, { iv: string; tag: string; ciphertext: string }>();

  // Start with a guest session; authenticated sessions are established by login.
  let currentSession: UserSession = {
    id: 'guest',
    name: 'Guest',
    email: '',
    phone: '',
    role: 'CUSTOMER',
    isGuest: true,
  };

  // Auth / Role Switcher Endpoint
  app.get('/api/auth/session', (req: Request, res: Response) => {
    res.json({ session: currentSession });
  });

  app.put('/api/auth/profile', (req: Request, res: Response) => {
    if (currentSession.isGuest || currentSession.role !== 'CUSTOMER') {
      return res.status(401).json({ error: 'Sign in with a customer account to edit your profile.' });
    }
    try {
      currentSession = db.updateCustomerProfile(currentSession.id, req.body);
      res.json({ session: currentSession });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Could not update your profile.' });
    }
  });

  // User Login (Email or Phone + Password)
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { identifier, password } = req.body;
    try {
      if (!identifier) {
        return res.status(400).json({ error: 'Please enter your email or phone number.' });
      }
      currentSession = db.authenticateUser(identifier, password);
      res.json({ session: currentSession, message: `Welcome back, ${currentSession.name}!` });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Customer Sign-Up
  app.post('/api/auth/register-customer', (req: Request, res: Response) => {
    const { name, email, phone, password, county, town } = req.body;
    try {
      if (!name || !email || !phone) {
        return res.status(400).json({ error: 'Name, email, and phone number are required.' });
      }
      currentSession = db.registerCustomerUser({ name, email, phone, password, county, town });
      res.json({ session: currentSession, message: 'Account created successfully! Welcome to SokoSalama.' });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Vendor Store Registration & Onboarding
  app.post('/api/auth/register-vendor', (req: Request, res: Response) => {
    const {
      storeName,
      category,
      ownerName,
      email,
      phone,
      county,
      town,
      mpesaPayoutNumber,
      bio,
      password,
      businessRegistrationNumber,
    } = req.body;
    try {
      if (!storeName || !email || !phone || !mpesaPayoutNumber) {
        return res.status(400).json({ error: 'Store name, email, phone, and M-Pesa payout number are required.' });
      }
      const result = db.registerVendorStore({
        storeName,
        category,
        ownerName,
        email,
        phone,
        county: county || 'Nairobi',
        town: town || 'CBD',
        mpesaPayoutNumber,
        bio: bio || '',
        password,
        businessRegistrationNumber,
      });
      currentSession = result.session;
      res.json({ session: currentSession, vendor: result.vendor, message: `Store registered! Welcome to the vendor portal.` });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Log Out / Reset to Guest
  app.post('/api/auth/logout', (req: Request, res: Response) => {
    currentSession = {
      id: 'guest_' + Date.now(),
      name: 'Guest',
      email: '',
      phone: '',
      role: 'CUSTOMER',
      isGuest: true,
    };
    res.json({ session: currentSession, message: 'Logged out successfully.' });
  });

  // Password Reset
  app.post('/api/auth/reset-password', (req: Request, res: Response) => {
    const { identifier, newPassword } = req.body;
    try {
      if (!identifier) {
        return res.status(400).json({ error: 'Email or phone number is required.' });
      }
      db.resetUserPassword(identifier, newPassword);
      res.json({ success: true, message: 'Password reset successful! You can now log in.' });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Get Demo Accounts for Quick Login
  app.get('/api/auth/users', (req: Request, res: Response) => {
    const users = db.getAllUsers().map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      role: u.role,
      vendorId: u.vendorId,
      county: u.county,
      town: u.town,
    }));
    res.json({ users });
  });

  app.post('/api/auth/switch-role', (req: Request, res: Response) => {
    const { role, vendorId } = req.body;
    if (role === 'ADMIN') {
      currentSession = {
        id: 'usr_admin_main',
        name: 'Antony Onyi (Platform Admin)',
        email: 'admin@sokosalama.co.ke',
        phone: '+254700000001',
        role: 'ADMIN',
      };
    } else if (role === 'VENDOR') {
      const targetVendorId = vendorId || 'ven_olkaria_leather';
      const vendor = db.vendors.find(v => v.id === targetVendorId) || db.vendors[0];
      currentSession = {
        id: 'usr_ven_' + vendor.id,
        name: `${vendor.name} Rep`,
        email: vendor.ownerEmail,
        phone: vendor.phone,
        role: 'VENDOR',
        vendorId: vendor.id,
      };
    } else {
      currentSession = {
        id: 'cust_wambui_01',
        name: 'Wambui Kariuki',
        email: 'wambui.k@gmail.com',
        phone: '+254720987654',
        role: 'CUSTOMER',
      };
    }
    res.json({ session: currentSession });
  });

  // Public Catalog: Approved and Active products only
  app.get('/api/products', (req: Request, res: Response) => {
    const { category, search, vendorId } = req.query;
    let list = db.products.filter(p => p.approvalStatus === 'approved' && p.isActive);

    if (category && category !== 'All') {
      list = list.filter(p => p.category === category);
    }
    if (vendorId) {
      list = list.filter(p => p.vendorId === vendorId);
    }
    if (search) {
      const q = String(search).toLowerCase();
      list = list.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
    }
    res.json(list);
  });

  // Vendor Catalog: strictly isolated by vendorId (prevent IDOR)
  app.get('/api/vendor/products', (req: Request, res: Response) => {
    const vendorId = req.headers['x-vendor-id'] as string || currentSession.vendorId;
    if (!vendorId) {
      return res.status(403).json({ error: 'Vendor authentication required' });
    }
    const products = db.products.filter(p => p.vendorId === vendorId);
    res.json(products);
  });

  // Vendor creates product
  app.post('/api/vendor/products', (req: Request, res: Response) => {
    const vendorId = req.headers['x-vendor-id'] as string || currentSession.vendorId;
    if (!vendorId) {
      return res.status(403).json({ error: 'Vendor authentication required' });
    }
    try {
      const product = db.createProduct(vendorId, req.body);
      res.json(product);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Vendor updates product
  app.put('/api/vendor/products/:id', (req: Request, res: Response) => {
    const vendorId = req.headers['x-vendor-id'] as string || currentSession.vendorId;
    if (!vendorId) {
      return res.status(403).json({ error: 'Vendor authentication required' });
    }
    try {
      const product = db.updateProduct(vendorId, req.params.id, req.body);
      res.json(product);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });
  app.post('/api/vendor/products/:id/update', (req: Request, res: Response) => {
    const vendorId = req.headers['x-vendor-id'] as string || currentSession.vendorId;
    if (!vendorId) {
      return res.status(403).json({ error: 'Vendor authentication required' });
    }
    try {
      const product = db.updateProduct(vendorId, req.params.id, req.body);
      res.json(product);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Vendor deletes product
  app.delete('/api/vendor/products/:id', (req: Request, res: Response) => {
    const vendorId = req.headers['x-vendor-id'] as string || currentSession.vendorId;
    if (!vendorId) {
      return res.status(403).json({ error: 'Vendor authentication required' });
    }
    try {
      const result = db.deleteProduct(vendorId, req.params.id);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Vendor updates store profile
  app.put('/api/vendor/profile', (req: Request, res: Response) => {
    const vendorId = req.headers['x-vendor-id'] as string || currentSession.vendorId;
    if (!vendorId) {
      return res.status(403).json({ error: 'Vendor authentication required' });
    }
    try {
      const vendor = db.updateVendorProfile(vendorId, req.body);
      res.json(vendor);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });
  app.post('/api/vendor/profile', (req: Request, res: Response) => {
    const vendorId = req.headers['x-vendor-id'] as string || currentSession.vendorId;
    if (!vendorId) {
      return res.status(403).json({ error: 'Vendor authentication required' });
    }
    try {
      const vendor = db.updateVendorProfile(vendorId, req.body);
      res.json(vendor);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Admin Pending Products
  app.get('/api/admin/products/pending', (req: Request, res: Response) => {
    if (currentSession.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin permission required' });
    }
    const pending = db.products.filter(p => p.approvalStatus === 'submitted');
    res.json(pending);
  });

  // Admin Moderate Product (Approve / Reject)
  app.post('/api/admin/products/:id/moderate', (req: Request, res: Response) => {
    if (currentSession.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin permission required' });
    }
    const { approve, reason } = req.body;
    try {
      const product = db.moderateProduct(req.params.id, Boolean(approve), currentSession, reason);
      res.json(product);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Admin Bulk Moderate Products (Approve / Reject multiple)
  app.post('/api/admin/products/bulk-moderate', (req: Request, res: Response) => {
    if (currentSession.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin permission required' });
    }
    const { productIds, approve, reason } = req.body;
    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ error: 'productIds array is required' });
    }
    try {
      const results = db.bulkModerateProducts(productIds, Boolean(approve), currentSession, reason);
      res.json({ success: true, count: results.length, products: results });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Vendors: Public Directory & Admin List
  app.get('/api/vendors', (req: Request, res: Response) => {
    // Only approved vendors are publicly shown
    const approved = db.vendors.filter(v => v.status === 'approved');
    res.json(approved);
  });

  app.get('/api/admin/vendors', (req: Request, res: Response) => {
    if (currentSession.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin permission required' });
    }
    res.json(db.vendors);
  });

  app.post('/api/admin/vendors/:id/status', (req: Request, res: Response) => {
    if (currentSession.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin permission required' });
    }
    try {
      const vendor = db.updateVendorStatus(req.params.id, req.body.status, currentSession);
      res.json(vendor);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Delivery Zones
  app.get('/api/delivery-zones', (req: Request, res: Response) => {
    res.json(db.deliveryZones);
  });

  app.post('/api/admin/delivery-zones', (req: Request, res: Response) => {
    if (currentSession.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin permission required' });
    }
    const zone = req.body;
    const existingIndex = db.deliveryZones.findIndex(z => z.id === zone.id);
    if (existingIndex >= 0) {
      db.deliveryZones[existingIndex] = zone;
    } else {
      db.deliveryZones.push({ ...zone, id: 'zone_' + Date.now() });
    }
    res.json(db.deliveryZones);
  });

  // CHECKOUT: Server-side price & stock verification, creates Parent + Sub-orders
  app.post('/api/checkout', (req: Request, res: Response) => {
    try {
      const result = db.createOrder(req.body);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // M-Pesa STK Push Simulation & Callback Verification
  app.post('/api/mpesa/stk-push', (req: Request, res: Response) => {
    const { checkoutRequestId, phoneNumber, amountKes } = req.body;
    // In production, this calls https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest
    res.json({
      ResponseCode: '0',
      ResponseDescription: 'Success. Request accepted for processing',
      MerchantRequestID: 'MR-' + Math.floor(1000 + Math.random() * 9000),
      CheckoutRequestID: checkoutRequestId,
      CustomerMessage: `Success. M-Pesa prompt has been sent to ${phoneNumber} for KES ${amountKes}.`,
    });
  });

  // Idempotent Callback Verification (simulating Daraja Webhook)
  app.post('/api/mpesa/callback', (req: Request, res: Response) => {
    const { checkoutRequestId, mpesaReceiptNumber, resultCode } = req.body;
    try {
      const result = db.confirmMpesaPayment(
        checkoutRequestId,
        mpesaReceiptNumber || 'QK' + Math.floor(10000000 + Math.random() * 90000000),
        resultCode !== undefined ? resultCode : 0
      );
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Sub-Orders: Customer tracking
  app.get('/api/orders/customer', (req: Request, res: Response) => {
    const phone = req.query.phone as string || currentSession.phone;
    const parentOrders = db.parentOrders.filter(
      p => p.customerPhone.replace(/\D/g, '') === phone.replace(/\D/g, '')
    );
    const parentIds = parentOrders.map(p => p.id);
    const subOrders = db.subOrders.filter(so => parentIds.includes(so.parentOrderId));
    res.json({ parentOrders, subOrders });
  });

  // Sub-Orders: Vendor Dashboard (Tenant-Isolated, strictly IDOR prevented)
  app.get('/api/vendor/sub-orders', (req: Request, res: Response) => {
    const vendorId = req.headers['x-vendor-id'] as string || currentSession.vendorId;
    if (!vendorId) {
      return res.status(403).json({ error: 'Vendor authentication required' });
    }
    const subOrders = db.subOrders.filter(so => so.vendorId === vendorId);
    res.json(subOrders);
  });

  // Sub-Orders: Admin View All
  app.get('/api/admin/sub-orders', (req: Request, res: Response) => {
    if (currentSession.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin permission required' });
    }
    res.json({
      parentOrders: db.parentOrders,
      subOrders: db.subOrders,
    });
  });

  // Sub-Order Fulfillment: Vendor Dispatches
  app.post('/api/sub-orders/:id/dispatch', (req: Request, res: Response) => {
    const vendorId = req.headers['x-vendor-id'] as string || currentSession.vendorId;
    const { courierPartner, trackingReference } = req.body;
    try {
      const subOrder = db.dispatchSubOrder(
        req.params.id,
        courierPartner || 'Fargo Courier Kenya',
        trackingReference || 'TRK-' + Math.floor(100000 + Math.random() * 900000),
        currentSession.role === 'VENDOR' ? vendorId : undefined
      );
      res.json(subOrder);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Sub-Order Delivery Confirmation (Atomic Escrow Release to Vendor Wallet)
  app.post('/api/sub-orders/:id/deliver', (req: Request, res: Response) => {
    try {
      const result = db.confirmSubOrderDelivery(req.params.id, currentSession);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Hot Deals: Public & Admin Endpoints
  app.get('/api/hot-deals', (req: Request, res: Response) => {
    res.json(db.getHotDeals());
  });

  app.post('/api/admin/hot-deals', (req: Request, res: Response) => {
    if (currentSession.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin permission required' });
    }
    try {
      const deal = db.createOrUpdateHotDeal(req.body, currentSession);
      res.json(deal);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.delete('/api/admin/hot-deals/:id', (req: Request, res: Response) => {
    if (currentSession.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin permission required' });
    }
    try {
      db.deleteHotDeal(req.params.id, currentSession);
      res.json({ success: true });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.post('/api/admin/hot-deals/:id/toggle', (req: Request, res: Response) => {
    if (currentSession.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin permission required' });
    }
    try {
      const deal = db.toggleHotDeal(req.params.id, Boolean(req.body.isActive));
      res.json(deal);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.post('/api/admin/hot-deals/:id/extend', (req: Request, res: Response) => {
    if (currentSession.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin permission required' });
    }
    try {
      const deal = db.extendHotDealTimer(req.params.id, Number(req.body.hours || 12));
      res.json(deal);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Vendor Wallet & Ledger: Tenant-Isolated
  app.get('/api/vendor/wallet', (req: Request, res: Response) => {
    const vendorId = req.headers['x-vendor-id'] as string || currentSession.vendorId;
    if (!vendorId) {
      return res.status(403).json({ error: 'Vendor authentication required' });
    }
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
    res.json({ wallet, transactions, payouts });
  });

  // Vendor Payout Request
  app.post('/api/vendor/payouts', (req: Request, res: Response) => {
    const vendorId = req.headers['x-vendor-id'] as string || currentSession.vendorId;
    if (!vendorId) {
      return res.status(403).json({ error: 'Vendor authentication required' });
    }
    const { amountKes, destinationMpesa } = req.body;
    try {
      const result = db.requestPayout(vendorId, Number(amountKes), destinationMpesa);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Admin Payouts List
  app.get('/api/admin/payouts', (req: Request, res: Response) => {
    if (currentSession.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin permission required' });
    }
    res.json(db.payouts);
  });

  // Admin Process Payout (Approve B2C or Reject)
  app.post('/api/admin/payouts/:id/process', (req: Request, res: Response) => {
    if (currentSession.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin permission required' });
    }
    const { approve, notes } = req.body;
    try {
      const result = db.processPayout(req.params.id, Boolean(approve), currentSession, notes);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Commission Rules
  app.get('/api/admin/commissions', (req: Request, res: Response) => {
    res.json(db.commissionRules);
  });

  app.post('/api/admin/commissions', (req: Request, res: Response) => {
    if (currentSession.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin permission required' });
    }
    try {
      const rule = db.saveCommissionRule(req.body, currentSession);
      res.json(rule);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Audit Logs
  app.get('/api/admin/audit-logs', (req: Request, res: Response) => {
    if (currentSession.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin permission required' });
    }
    res.json(db.auditLogs);
  });

  // Admin Financial Analytics
  app.get('/api/admin/financial-summary', (req: Request, res: Response) => {
    if (currentSession.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin permission required' });
    }

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

    res.json({
      totalEscrowLockedKes,
      totalVendorAvailableKes,
      totalPlatformCommissionsKes,
      pendingCommissionsInEscrowKes,
      grossMerchandiseValueKes,
      totalOrdersCount: db.parentOrders.length,
      activeVendorsCount: db.vendors.filter(v => v.status === 'approved').length,
    });
  });

  // Admin Platform Settings
  const safeSettingsResponse = () => ({
    ...db.settings,
    darajaConsumerKeyMasked: encryptedPaymentSecrets.has('darajaConsumerKeyMasked') ? '••••••••' : '',
    darajaPasskeyMasked: encryptedPaymentSecrets.has('darajaPasskeyMasked') ? '••••••••' : '',
    adminConfig: { ...(db.settings.adminConfig || {}), paymentSecretsConfigured: {
      consumerKey: encryptedPaymentSecrets.has('darajaConsumerKeyMasked'),
      consumerSecret: encryptedPaymentSecrets.has('darajaConsumerSecretMasked'),
      passkey: encryptedPaymentSecrets.has('darajaPasskeyMasked'),
    } },
  });

  app.get('/api/admin/settings', (req: Request, res: Response) => {
    if (currentSession.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin permission required' });
    }
    res.json(safeSettingsResponse());
  });

  app.post('/api/admin/settings', (req: Request, res: Response) => {
    if (currentSession.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin permission required' });
    }
    try {
      const { secretDrafts = {}, ...settingsPayload } = req.body || {};
      const secretEntries = Object.entries(secretDrafts).filter((entry): entry is [string, string] => typeof entry[1] === 'string' && Boolean(entry[1]));
      if (secretEntries.length) {
        const rawKey = process.env.MARKETPLACE_SETTINGS_ENCRYPTION_KEY || '';
        if (!/^[a-fA-F0-9]{64}$/.test(rawKey)) return res.status(503).json({ error: 'Configure MARKETPLACE_SETTINGS_ENCRYPTION_KEY (32-byte hex) before saving payment credentials.' });
        const allowedSecrets = new Set(['darajaConsumerKeyMasked', 'darajaConsumerSecretMasked', 'darajaPasskeyMasked']);
        if (secretEntries.some(([key]) => !allowedSecrets.has(key))) return res.status(400).json({ error: 'Unknown payment credential field.' });
        const encryptionKey = Buffer.from(rawKey, 'hex');
        for (const [key, secret] of secretEntries) {
          const iv = randomBytes(12);
          const cipher = createCipheriv('aes-256-gcm', encryptionKey, iv);
          const ciphertext = Buffer.concat([cipher.update(secret, 'utf8'), cipher.final()]);
          encryptedPaymentSecrets.set(key, { iv: iv.toString('hex'), tag: cipher.getAuthTag().toString('hex'), ciphertext: ciphertext.toString('hex') });
        }
      }
      db.updateSettings(settingsPayload, currentSession);
      res.json(safeSettingsResponse());
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Admin Disputes & Escrow Arbitration
  app.get('/api/admin/disputes', (req: Request, res: Response) => {
    if (currentSession.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin permission required' });
    }
    res.json(db.disputes);
  });

  app.post('/api/admin/disputes/:id/resolve', (req: Request, res: Response) => {
    if (currentSession.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin permission required' });
    }
    const { resolutionType, notes } = req.body;
    try {
      const dispute = db.resolveDispute(req.params.id, resolutionType, notes, currentSession);
      res.json(dispute);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Admin Vendor Custom Commission Rate Override
  app.post('/api/admin/vendors/:id/commission', (req: Request, res: Response) => {
    if (currentSession.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin permission required' });
    }
    const { commissionRatePercent, customFixedFeeKes } = req.body;
    try {
      const vendor = db.updateVendorCommission(
        req.params.id,
        Number(commissionRatePercent),
        Number(customFixedFeeKes || 0),
        currentSession
      );
      res.json(vendor);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Admin Delete Delivery Zone
  app.delete('/api/admin/delivery-zones/:id', (req: Request, res: Response) => {
    if (currentSession.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin permission required' });
    }
    try {
      const zones = db.deleteDeliveryZone(req.params.id, currentSession);
      res.json(zones);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Admin Auto-Release Escrows for Dispatched Orders
  app.post('/api/admin/escrow/auto-release', (req: Request, res: Response) => {
    if (currentSession.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin permission required' });
    }
    try {
      const result = db.autoReleaseDeliveredEscrows(currentSession);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Mount Vite middleware in development or static dist in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`SokoSalama Multi-Vendor Marketplace running on port ${port}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
