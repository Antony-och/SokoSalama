import React, { useState, useMemo } from 'react';
import { 
  Wallet, 
  Package, 
  Plus, 
  ArrowUpRight, 
  Clock, 
  Truck, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  ArrowDownLeft, 
  Send,
  Lock,
  Tag,
  Search,
  Filter,
  Edit,
  Trash2,
  Printer,
  ExternalLink,
  RefreshCw,
  MapPin,
  Phone,
  ShieldCheck,
  Download,
  Star,
  TrendingUp,
  Info,
  Check,
  X,
  FileText,
  BarChart3,
  AlertTriangle,
  ChevronDown,
  Store,
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { 
  Vendor, 
  Product, 
  SubOrder, 
  VendorWallet, 
  WalletTransaction, 
  PayoutRequest, 
  UserSession, 
  Dispute 
} from '../types';

interface VendorDashboardProps {
  currentSession: UserSession;
  vendor: Vendor;
  allVendors?: Vendor[];
  products: Product[];
  subOrders: SubOrder[];
  wallet: VendorWallet;
  transactions: WalletTransaction[];
  payouts: PayoutRequest[];
  disputes?: Dispute[];
  onDispatchSubOrder: (subOrderId: string, courier: string, trackingRef: string) => Promise<void>;
  onCreateProduct: (productData: any) => Promise<void>;
  onUpdateProduct?: (productId: string, updates: Partial<Product>) => Promise<void>;
  onDeleteProduct?: (productId: string) => Promise<void>;
  onRequestPayout: (amountKes: number, destinationPhone: string) => Promise<void>;
  onUpdateVendorProfile?: (updates: Partial<Vendor>) => Promise<void>;
  onSelectActiveVendor?: (vendorId: string) => Promise<void>;
  onViewStorefront?: () => void;
}

export const UNIVERSAL_CATEGORIES = [
  'Phones & Tablets',
  'Electronics & Gadgets',
  'Computers & Laptops',
  'Home & Kitchen',
  'Appliances',
  'Fashion & Apparel',
  'Shoes & Footwear',
  'Beauty & Personal Care',
  'Groceries & Foodstuffs',
  'Sports & Fitness',
  'Automotive & Hardware',
  'Handcrafted Leather',
  'Fashion & Kitenge',
  'Kenyan Specialty Coffee',
  'Other / General Merchandise',
];

export const VendorDashboard: React.FC<VendorDashboardProps> = ({
  currentSession,
  vendor,
  allVendors = [],
  products,
  subOrders,
  wallet,
  transactions,
  payouts,
  disputes = [],
  onDispatchSubOrder,
  onCreateProduct,
  onUpdateProduct,
  onDeleteProduct,
  onRequestPayout,
  onUpdateVendorProfile,
  onSelectActiveVendor,
  onViewStorefront,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'ledger' | 'payouts' | 'profile' | 'disputes'>('overview');

  // Search & Filter States
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | 'pending' | 'dispatched' | 'delivered'>('all');
  
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');
  const [productStockFilter, setProductStockFilter] = useState<'all' | 'instock' | 'lowstock' | 'outofstock'>('all');

  const [ledgerTypeFilter, setLedgerTypeFilter] = useState<string>('all');

  // Modals
  const [dispatchModalSubOrder, setDispatchModalSubOrder] = useState<SubOrder | null>(null);
  const [courierPartner, setCourierPartner] = useState('Fargo Courier Kenya');
  const [trackingRef, setTrackingRef] = useState('');
  const [dispatchLoading, setDispatchLoading] = useState(false);

  // Waybill / Delivery Note Modal
  const [waybillSubOrder, setWaybillSubOrder] = useState<SubOrder | null>(null);

  // New product form state (Universal & Brand-Neutral)
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newBrand, setNewBrand] = useState('');
  const [newSku, setNewSku] = useState('');
  const [newPrice, setNewPrice] = useState<number>(4500);
  const [newCompareAtPrice, setNewCompareAtPrice] = useState<number | ''>('');
  const [newStock, setNewStock] = useState<number>(20);
  const [newCategory, setNewCategory] = useState('Phones & Tablets');
  const [newCondition, setNewCondition] = useState<'new' | 'refurbished' | 'handmade' | 'used'>('new');
  const [newDesc, setNewDesc] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&auto=format&fit=crop&q=80');
  const [newVariantLabel, setNewVariantLabel] = useState('Standard / Default Edition');
  const [productSubmitLoading, setProductSubmitLoading] = useState(false);

  // Edit product modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editBrand, setEditBrand] = useState('');
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editCompareAtPrice, setEditCompareAtPrice] = useState<number | ''>('');
  const [editStock, setEditStock] = useState<number>(0);
  const [editCategory, setEditCategory] = useState('');
  const [editCondition, setEditCondition] = useState<'new' | 'refurbished' | 'handmade' | 'used'>('new');
  const [editDesc, setEditDesc] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  // Payout request form state
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState<number>(Math.min(5000, wallet.availableBalanceKes || 500));
  const [payoutPhone, setPayoutPhone] = useState(vendor.mpesaPayoutNumber || '+254712345678');
  const [payoutLoading, setPayoutLoading] = useState(false);
  const [payoutError, setPayoutError] = useState<string | null>(null);

  // Profile Form state
  const [profileName, setProfileName] = useState(vendor.name);
  const [profileBio, setProfileBio] = useState(vendor.bio || '');
  const [profilePhone, setProfilePhone] = useState(vendor.phone);
  const [profileMpesa, setProfileMpesa] = useState(vendor.mpesaPayoutNumber || '');
  const [profileCounty, setProfileCounty] = useState(vendor.county);
  const [profileTown, setProfileTown] = useState(vendor.town);
  const [profileRegNo, setProfileRegNo] = useState(vendor.businessRegistrationNumber || '');
  const [profileSaving, setProfileSaving] = useState(false);

  // Notification Banner
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  // Switch store dropdown state
  const [showStoreSwitcher, setShowStoreSwitcher] = useState(false);

  // Universal preset image gallery for quick testing across all categories
  const universalImagePresets = [
    { label: 'Smartphones & Tablets', url: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&auto=format&fit=crop&q=80' },
    { label: 'Audio / Headphones', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80' },
    { label: 'Laptops & Computers', url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop&q=80' },
    { label: 'Kitchen & Appliances', url: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80' },
    { label: 'Sneakers & Shoes', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80' },
    { label: 'Beauty & Skincare', url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80' },
    { label: 'Fashion & Apparel', url: '/src/assets/images/product_kitenge_jacket_1790583422282.jpg' },
    { label: 'Leather Goods & Bags', url: '/src/assets/images/product_mara_leather_bag_1790583446093.jpg' },
    { label: 'Coffee & Foodstuffs', url: '/src/assets/images/product_savannah_coffee_1790583434473.jpg' },
  ];

  // Derived KPIs
  const pendingOrdersCount = subOrders.filter(s => s.fulfillmentStatus === 'pending').length;
  const dispatchedOrdersCount = subOrders.filter(s => s.fulfillmentStatus === 'dispatched').length;
  const deliveredOrdersCount = subOrders.filter(s => s.fulfillmentStatus === 'delivered').length;
  const lowStockCount = products.filter(p => p.stockQuantity <= 5).length;

  // Filtered Orders
  const filteredSubOrders = useMemo(() => {
    return subOrders.filter(so => {
      // Status filter
      if (orderStatusFilter !== 'all' && so.fulfillmentStatus !== orderStatusFilter) {
        return false;
      }
      // Search query
      if (orderSearchQuery.trim()) {
        const q = orderSearchQuery.toLowerCase();
        const matchesId = so.id.toLowerCase().includes(q) || so.parentOrderId.toLowerCase().includes(q);
        const matchesItem = so.items.some(it => it.title.toLowerCase().includes(q) || it.sku.toLowerCase().includes(q));
        const matchesCustomer = so.customerDelivery && (
          so.customerDelivery.name.toLowerCase().includes(q) ||
          so.customerDelivery.phone.includes(q) ||
          so.customerDelivery.town.toLowerCase().includes(q)
        );
        return matchesId || matchesItem || matchesCustomer;
      }
      return true;
    });
  }, [subOrders, orderStatusFilter, orderSearchQuery]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (productCategoryFilter !== 'All' && p.category !== productCategoryFilter) {
        return false;
      }
      if (productStockFilter === 'instock' && p.stockQuantity <= 0) return false;
      if (productStockFilter === 'lowstock' && (p.stockQuantity > 5 || p.stockQuantity <= 0)) return false;
      if (productStockFilter === 'outofstock' && p.stockQuantity > 0) return false;

      if (productSearchQuery.trim()) {
        const q = productSearchQuery.toLowerCase();
        return p.title.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      }
      return true;
    });
  }, [products, productCategoryFilter, productStockFilter, productSearchQuery]);

  // Filtered Ledger Transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      if (ledgerTypeFilter === 'all') return true;
      if (ledgerTypeFilter === 'release' && tx.type.includes('RELEASE')) return true;
      if (ledgerTypeFilter === 'commission' && tx.type.includes('COMMISSION')) return true;
      if (ledgerTypeFilter === 'payout' && tx.type.includes('PAYOUT')) return true;
      if (ledgerTypeFilter === 'credit' && tx.type.includes('CREDIT')) return true;
      return false;
    });
  }, [transactions, ledgerTypeFilter]);

  // Handle Dispatch
  const handleDispatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchModalSubOrder) return;
    setDispatchLoading(true);
    try {
      await onDispatchSubOrder(
        dispatchModalSubOrder.id,
        courierPartner,
        trackingRef || 'TRK-' + Math.floor(100000 + Math.random() * 900000)
      );
      setDispatchModalSubOrder(null);
      setTrackingRef('');
      showToast('Sub-order dispatched! Tracking information registered.');
    } catch (err: any) {
      alert(err.message || 'Dispatch failed');
    } finally {
      setDispatchLoading(false);
    }
  };

  // Smart SKU generator
  const generateSku = () => {
    const catCode = newCategory ? newCategory.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'X') : 'GEN';
    const rand = Math.floor(1000 + Math.random() * 9000);
    setNewSku(`${catCode}-${rand}`);
  };

  // Handle Add Product
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProductSubmitLoading(true);
    try {
      const generatedSku = newSku.trim() || `${newCategory.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'X')}-${Math.floor(1000 + Math.random() * 9000)}`;

      await onCreateProduct({
        title: newTitle.trim(),
        brand: newBrand.trim() || undefined,
        sku: generatedSku,
        priceKes: Number(newPrice),
        compareAtPriceKes: newCompareAtPrice ? Number(newCompareAtPrice) : undefined,
        stockQuantity: Number(newStock),
        category: newCategory,
        condition: newCondition,
        description: newDesc.trim(),
        images: [newImageUrl.trim() || 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&auto=format&fit=crop&q=80'],
        attributes: [{ name: 'Edition / Variant', options: [newVariantLabel.trim() || 'Standard Edition'] }],
        slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      });
      setShowAddProduct(false);
      setNewTitle('');
      setNewBrand('');
      setNewSku('');
      setNewDesc('');
      setNewCompareAtPrice('');
      showToast('Product submitted successfully for compliance review!');
    } catch (err: any) {
      alert(err.message || 'Product submission failed');
    } finally {
      setProductSubmitLoading(false);
    }
  };

  // Handle Edit Product
  const openEditProductModal = (product: Product) => {
    setEditingProduct(product);
    setEditTitle(product.title);
    setEditBrand(product.brand || '');
    setEditPrice(product.priceKes);
    setEditCompareAtPrice(product.compareAtPriceKes || '');
    setEditStock(product.stockQuantity);
    setEditCategory(product.category);
    setEditCondition(product.condition || 'new');
    setEditDesc(product.description);
    setEditImageUrl(product.images[0] || 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&auto=format&fit=crop&q=80');
  };

  const handleEditProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !onUpdateProduct) return;
    setEditLoading(true);
    try {
      await onUpdateProduct(editingProduct.id, {
        title: editTitle.trim(),
        brand: editBrand.trim() || undefined,
        priceKes: Number(editPrice),
        compareAtPriceKes: editCompareAtPrice ? Number(editCompareAtPrice) : undefined,
        stockQuantity: Number(editStock),
        category: editCategory,
        condition: editCondition,
        description: editDesc.trim(),
        images: [editImageUrl.trim()],
      });
      setEditingProduct(null);
      showToast(`Product "${editTitle}" updated successfully.`);
    } catch (err: any) {
      alert(err.message || 'Failed to update product');
    } finally {
      setEditLoading(false);
    }
  };

  // Quick Stock Adjustment (+5 or -1)
  const handleQuickStockAdjust = async (product: Product, delta: number) => {
    if (!onUpdateProduct) return;
    const newStock = Math.max(0, product.stockQuantity + delta);
    try {
      await onUpdateProduct(product.id, { stockQuantity: newStock });
      showToast(`Updated stock for ${product.title} to ${newStock} units`);
    } catch (err: any) {
      alert(err.message || 'Failed to adjust stock');
    }
  };

  // Quick Active/Inactive Toggle
  const handleToggleProductActive = async (product: Product) => {
    if (!onUpdateProduct) return;
    try {
      await onUpdateProduct(product.id, { isActive: !product.isActive });
      showToast(`Product ${product.isActive ? 'hidden from' : 'published to'} marketplace.`);
    } catch (err: any) {
      alert(err.message || 'Failed to toggle status');
    }
  };

  // Delete Product
  const handleDeleteProductClick = async (product: Product) => {
    if (!onDeleteProduct) return;
    if (confirm(`Are you sure you want to delete "${product.title}"? This cannot be undone.`)) {
      try {
        await onDeleteProduct(product.id);
        showToast(`Product "${product.title}" removed.`);
      } catch (err: any) {
        alert(err.message || 'Failed to delete product');
      }
    }
  };

  // Handle Payout Request
  const handlePayoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPayoutError(null);
    if (payoutAmount > wallet.availableBalanceKes) {
      setPayoutError('Requested amount exceeds available balance.');
      return;
    }
    if (payoutAmount < 500) {
      setPayoutError('Minimum withdrawal is KES 500.');
      return;
    }
    setPayoutLoading(true);
    try {
      await onRequestPayout(payoutAmount, payoutPhone);
      setShowPayoutModal(false);
      showToast(`Payout request for KES ${payoutAmount.toLocaleString()} submitted for M-Pesa B2C processing.`);
    } catch (err: any) {
      setPayoutError(err.message || 'Failed to request payout');
    } finally {
      setPayoutLoading(false);
    }
  };

  // Handle Save Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdateVendorProfile) return;
    setProfileSaving(true);
    try {
      await onUpdateVendorProfile({
        name: profileName,
        bio: profileBio,
        phone: profilePhone,
        mpesaPayoutNumber: profileMpesa,
        county: profileCounty,
        town: profileTown,
        businessRegistrationNumber: profileRegNo,
      });
      showToast('Store profile & M-Pesa payout details saved!');
    } catch (err: any) {
      alert(err.message || 'Failed to save store profile');
    } finally {
      setProfileSaving(false);
    }
  };

  // Export Ledger CSV
  const handleExportLedgerCsv = () => {
    const headers = ['Transaction ID', 'Timestamp', 'Type', 'Description', 'Reference ID', 'Amount KES', 'Available Balance After KES', 'Pending Escrow After KES'];
    const rows = transactions.map(t => [
      t.id,
      new Date(t.createdAt).toISOString(),
      t.type,
      `"${t.description.replace(/"/g, '""')}"`,
      t.referenceId,
      t.amountKes,
      t.availableBalanceAfterKes,
      t.pendingBalanceAfterKes,
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `sokosalama-ledger-${vendor.slug || vendor.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Ledger export downloaded.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* ========================================================================= */}
      {/* 1. TOP HEADER: STORE IDENTITY & QUICK ACTIONS */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-700 to-amber-900 text-white font-bold text-xl flex items-center justify-center shadow-xs shrink-0 ring-4 ring-amber-50">
            {vendor.name.substring(0, 2).toUpperCase()}
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
                {vendor.name}
              </h1>

              {/* Status Pill */}
              {vendor.status === 'approved' && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified Merchant</span>
                </span>
              )}
              {vendor.status === 'pending' && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>KYC Pending Review</span>
                </span>
              )}
              {vendor.status === 'suspended' && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-rose-50 text-rose-800 border border-rose-200 px-2.5 py-0.5 rounded-full">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Account Suspended</span>
                </span>
              )}

              {/* Tenant Safe Pill */}
              <span className="text-[11px] font-medium bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-md font-mono">
                Store ID: {vendor.id}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-neutral-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                {vendor.town}, {vendor.county} County
              </span>
              <span className="text-neutral-300">·</span>
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span className="font-semibold text-neutral-800">{vendor.rating || 5.0}</span> Rating
              </span>
              <span className="text-neutral-300">·</span>
              <span>Commission: <strong className="text-neutral-800">{vendor.commissionRatePercent || 10}%</strong></span>
              <span className="text-neutral-300">·</span>
            </div>
          </div>
        </div>

        {/* Action Buttons & Store Switcher */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Switch Active Store (if multiple exist) */}
          {allVendors.length > 1 && onSelectActiveVendor && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowStoreSwitcher(!showStoreSwitcher)}
                className="px-3 py-2 bg-neutral-100 hover:bg-neutral-200/80 text-neutral-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                title="Switch active store"
              >
                <Store className="w-3.5 h-3.5 text-neutral-600" />
                <span>Switch Store</span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              {showStoreSwitcher && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-neutral-200 py-2 z-30">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                    Select Merchant Store
                  </div>
                  {allVendors.map(v => (
                    <button
                      key={v.id}
                      onClick={() => {
                        onSelectActiveVendor(v.id);
                        setShowStoreSwitcher(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-amber-50/50 transition-colors ${
                        v.id === vendor.id ? 'font-bold text-amber-900 bg-amber-50/80' : 'text-neutral-700'
                      }`}
                    >
                      <div className="truncate">
                        <div>{v.name}</div>
                        <div className="text-[10px] text-neutral-400 font-mono">{v.county}</div>
                      </div>
                      {v.id === vendor.id && <Check className="w-4 h-4 text-amber-700 shrink-0" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Preview Public Storefront */}
          {onViewStorefront && (
            <button
              onClick={onViewStorefront}
              className="px-3 py-2 border border-neutral-300 hover:border-neutral-400 bg-white text-neutral-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
              <span>Public Storefront</span>
            </button>
          )}

          {/* Request M-Pesa Payout */}
          <button
            onClick={() => {
              setPayoutAmount(Math.min(5000, wallet.availableBalanceKes));
              setShowPayoutModal(true);
            }}
            disabled={wallet.availableBalanceKes < 500}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:bg-neutral-200 disabled:text-neutral-400 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>M-Pesa Payout</span>
          </button>

          {/* Add Product */}
          <button
            onClick={() => setShowAddProduct(true)}
            className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Global Success Banner */}
      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between shadow-2xs animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="font-medium">{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. STATS & KPI STRIP */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Available Balance */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-neutral-500 text-xs mb-2">
              <span className="font-medium">Available to Withdraw</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                <Wallet className="w-4 h-4 text-emerald-700" />
              </div>
            </div>
            <div className="text-2xl font-bold text-neutral-900 tabular-nums">
              KES {wallet.availableBalanceKes.toLocaleString()}
            </div>
          </div>
          <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px]">
            <span className="text-emerald-700 font-medium">Instant B2C Payout</span>
            <button
              onClick={() => {
                setPayoutAmount(Math.min(5000, wallet.availableBalanceKes));
                setShowPayoutModal(true);
              }}
              disabled={wallet.availableBalanceKes < 500}
              className="text-neutral-700 hover:text-emerald-700 font-semibold cursor-pointer disabled:text-neutral-300"
            >
              Withdraw &rarr;
            </button>
          </div>
        </div>

        {/* Pending Escrow Locked */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-neutral-500 text-xs mb-2">
              <span className="font-medium">Protected in Escrow</span>
              <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
                <Lock className="w-4 h-4 text-amber-700" />
              </div>
            </div>
            <div className="text-2xl font-bold text-amber-900 tabular-nums">
              KES {wallet.pendingEscrowBalanceKes.toLocaleString()}
            </div>
          </div>
          <div className="pt-3 border-t border-neutral-100 text-[11px] text-neutral-500 flex items-center justify-between">
            <span>Releases on customer delivery</span>
            <span className="text-amber-800 font-medium font-mono">72h SLA</span>
          </div>
        </div>

        {/* Lifetime Earnings */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-neutral-500 text-xs mb-2">
              <span className="font-medium">Lifetime Gross Sales</span>
              <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-blue-700" />
              </div>
            </div>
            <div className="text-2xl font-bold text-neutral-900 tabular-nums">
              KES {wallet.totalLifetimeEarnedKes.toLocaleString()}
            </div>
          </div>
          <div className="pt-3 border-t border-neutral-100 text-[11px] text-neutral-500">
            Disbursed: <span className="font-semibold text-neutral-800">KES {wallet.totalLifetimeWithdrawnKes.toLocaleString()}</span>
          </div>
        </div>

        {/* Active Sub-Orders Pipeline */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-neutral-500 text-xs mb-2">
              <span className="font-medium">Fulfillment Pipeline</span>
              <div className="w-7 h-7 rounded-lg bg-neutral-100 flex items-center justify-center">
                <Package className="w-4 h-4 text-neutral-700" />
              </div>
            </div>
            <div className="text-2xl font-bold text-neutral-900 tabular-nums">
              {subOrders.length} <span className="text-xs font-normal text-neutral-500">orders</span>
            </div>
          </div>
          <div className="pt-3 border-t border-neutral-100 text-[11px] text-neutral-600 flex items-center justify-between">
            <span className={pendingOrdersCount > 0 ? 'text-amber-800 font-bold' : ''}>
              {pendingOrdersCount} to pack
            </span>
            <span>{dispatchedOrdersCount} in transit</span>
            <span className="text-emerald-700 font-semibold">{deliveredOrdersCount} settled</span>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. TABS NAVIGATION */}
      {/* ========================================================================= */}
      <div className="border-b border-neutral-200/90 overflow-x-auto scrollbar-none">
        <div className="flex gap-6 text-xs font-semibold min-w-max">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'text-neutral-900 border-b-2 border-amber-800 font-bold'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Overview & Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'orders'
                ? 'text-neutral-900 border-b-2 border-amber-800 font-bold'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Fulfillment Orders</span>
            {pendingOrdersCount > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-100 text-amber-900 text-[10px] rounded-full font-bold">
                {pendingOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'products'
                ? 'text-neutral-900 border-b-2 border-amber-800 font-bold'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Products & Stock</span>
            {lowStockCount > 0 && (
              <span className="px-1.5 py-0.2 bg-rose-100 text-rose-800 text-[10px] rounded-full font-bold">
                {lowStockCount} low
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('ledger')}
            className={`pb-3 cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'ledger'
                ? 'text-neutral-900 border-b-2 border-amber-800 font-bold'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Double-Entry Ledger</span>
          </button>

          <button
            onClick={() => setActiveTab('payouts')}
            className={`pb-3 cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'payouts'
                ? 'text-neutral-900 border-b-2 border-amber-800 font-bold'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>M-Pesa Payouts</span>
            <span className="text-neutral-400">({payouts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'text-neutral-900 border-b-2 border-amber-800 font-bold'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Store Profile & Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('disputes')}
            className={`pb-3 cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'disputes'
                ? 'text-neutral-900 border-b-2 border-amber-800 font-bold'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Escrow Disputes</span>
            {disputes.length > 0 && (
              <span className="px-1.5 py-0.2 bg-rose-100 text-rose-800 text-[10px] rounded-full font-bold">
                {disputes.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: OVERVIEW & ANALYTICS */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Top Banner: Escrow Safeguard Flow */}
          <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950 text-white rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-700/50">
                  Safaricom Daraja Escrow Protection
                </span>
                <h2 className="text-lg font-bold text-white mt-1.5">
                  Artisan Payment & Escrow Settlement Pipeline
                </h2>
                <p className="text-xs text-amber-200/90 max-w-2xl mt-0.5">
                  Every order placed for your shop is guaranteed in an isolated Daraja Escrow account. You can pack and ship with 100% confidence.
                </p>
              </div>

              <div className="bg-amber-950/70 p-3 rounded-xl border border-amber-700/40 text-center shrink-0">
                <div className="text-[10px] uppercase font-bold text-amber-300">Escrow Success Rate</div>
                <div className="text-xl font-bold text-white tabular-nums">99.8%</div>
                <div className="text-[10px] text-amber-300/80">Avg Release: 1.4 Days</div>
              </div>
            </div>

            {/* 4-Step Escrow Roadmap */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/10 space-y-1.5">
                <div className="font-bold text-amber-300 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-amber-950 font-bold flex items-center justify-center text-[11px]">1</span>
                  Buyer Checkout
                </div>
                <p className="text-neutral-200 text-[11px]">
                  Customer confirms M-Pesa STK Push. Funds are locked securely in Daraja Escrow.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/10 space-y-1.5">
                <div className="font-bold text-amber-300 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-amber-950 font-bold flex items-center justify-center text-[11px]">2</span>
                  Pack & Dispatch
                </div>
                <p className="text-neutral-200 text-[11px]">
                  Print the delivery waybill, package items, and dispatch via Fargo, G4S, or Sendy.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/10 space-y-1.5">
                <div className="font-bold text-amber-300 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-amber-950 font-bold flex items-center justify-center text-[11px]">3</span>
                  Delivery & Release
                </div>
                <p className="text-neutral-200 text-[11px]">
                  Customer verifies items upon handover or 72-hour inspection window elapses.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/10 space-y-1.5">
                <div className="font-bold text-amber-300 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-amber-950 font-bold flex items-center justify-center text-[11px]">4</span>
                  Instant Payout
                </div>
                <p className="text-neutral-200 text-[11px]">
                  Net earnings land in your Available Balance. Withdraw to your M-Pesa phone in 10 seconds.
                </p>
              </div>
            </div>
          </div>

          {/* Grid: Fulfillment Health & Top Products */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Fulfillment Status Progress */}
            <div className="bg-white rounded-xl p-5 border border-neutral-200/80 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-neutral-900 text-sm">Fulfillment Performance</h3>
                <span className="text-[11px] font-semibold text-neutral-500 font-mono">
                  {subOrders.length} Total Sub-Orders
                </span>
              </div>

              {/* Progress bar */}
              <div className="space-y-2">
                <div className="h-3 w-full bg-neutral-100 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${subOrders.length ? (deliveredOrdersCount / subOrders.length) * 100 : 0}%` }}
                    className="bg-emerald-600 h-full"
                    title={`Delivered: ${deliveredOrdersCount}`}
                  />
                  <div
                    style={{ width: `${subOrders.length ? (dispatchedOrdersCount / subOrders.length) * 100 : 0}%` }}
                    className="bg-blue-500 h-full"
                    title={`In Transit: ${dispatchedOrdersCount}`}
                  />
                  <div
                    style={{ width: `${subOrders.length ? (pendingOrdersCount / subOrders.length) * 100 : 0}%` }}
                    className="bg-amber-400 h-full"
                    title={`Pending: ${pendingOrdersCount}`}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-neutral-600 pt-1">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
                    Delivered ({deliveredOrdersCount})
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                    In Transit ({dispatchedOrdersCount})
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                    Needs Packing ({pendingOrdersCount})
                  </span>
                </div>
              </div>

              <div className="p-3 bg-neutral-50 rounded-lg text-xs space-y-1.5 border border-neutral-100">
                <div className="font-semibold text-neutral-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  Quick Dispatch Recommendation
                </div>
                <p className="text-neutral-500 text-[11px]">
                  Orders dispatched within 24 hours of placement receive preferential placement in Nairobi and Mombasa regional search results.
                </p>
              </div>

              {pendingOrdersCount > 0 && (
                <button
                  onClick={() => {
                    setActiveTab('orders');
                    setOrderStatusFilter('pending');
                  }}
                  className="w-full py-2 px-3 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>View {pendingOrdersCount} Unfulfilled Order{pendingOrdersCount > 1 ? 's' : ''}</span>
                </button>
              )}
            </div>

            {/* Bestselling Craft Items */}
            <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-neutral-200/80 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-neutral-900 text-sm">Store Products Overview</h3>
                  <p className="text-xs text-neutral-500">Inventory levels and live catalog distribution</p>
                </div>
                <button
                  onClick={() => setActiveTab('products')}
                  className="text-xs text-amber-800 font-semibold hover:underline flex items-center gap-1"
                >
                  Manage All ({products.length}) &rarr;
                </button>
              </div>

              {products.length === 0 ? (
                <div className="text-center py-8 text-neutral-400 text-xs">
                  No products added yet. Click &quot;Add Product&quot; to begin selling!
                </div>
              ) : (
                <div className="divide-y divide-neutral-100">
                  {products.slice(0, 4).map(p => (
                    <div key={p.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={p.images[0]}
                          alt={p.title}
                          className="w-10 h-10 object-cover rounded-lg bg-neutral-100 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-semibold text-neutral-900 truncate">{p.title}</div>
                          <div className="text-[11px] text-neutral-400 font-mono">
                            SKU: {p.sku} · {p.category}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right">
                          <div className="font-bold tabular-nums text-neutral-900">
                            KES {p.priceKes.toLocaleString()}
                          </div>
                          <div className={`text-[10px] font-semibold ${
                            p.stockQuantity <= 0
                              ? 'text-rose-600'
                              : p.stockQuantity <= 5
                              ? 'text-amber-700'
                              : 'text-neutral-500'
                          }`}>
                            {p.stockQuantity <= 0 ? 'Out of Stock' : `${p.stockQuantity} in stock`}
                          </div>
                        </div>

                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          p.approvalStatus === 'approved'
                            ? 'bg-emerald-50 text-emerald-800'
                            : p.approvalStatus === 'submitted'
                            ? 'bg-amber-50 text-amber-800'
                            : 'bg-rose-50 text-rose-800'
                        }`}>
                          {p.approvalStatus === 'approved' ? 'Live' : p.approvalStatus.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: FULFILLMENT ORDERS */}
      {/* ========================================================================= */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-xl border border-neutral-200/80 overflow-hidden shadow-2xs space-y-4">
          
          {/* Header Controls: Filters & Search */}
          <div className="p-4 bg-neutral-50/70 border-b border-neutral-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setOrderStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  orderStatusFilter === 'all'
                    ? 'bg-neutral-900 text-white'
                    : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                All Orders ({subOrders.length})
              </button>
              <button
                onClick={() => setOrderStatusFilter('pending')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  orderStatusFilter === 'pending'
                    ? 'bg-amber-700 text-white'
                    : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                Needs Packing ({pendingOrdersCount})
              </button>
              <button
                onClick={() => setOrderStatusFilter('dispatched')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  orderStatusFilter === 'dispatched'
                    ? 'bg-blue-700 text-white'
                    : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                In Transit ({dispatchedOrdersCount})
              </button>
              <button
                onClick={() => setOrderStatusFilter('delivered')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  orderStatusFilter === 'delivered'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                Delivered & Released ({deliveredOrdersCount})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-64">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search order ID, item, or client..."
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-neutral-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-amber-800"
              />
            </div>
          </div>

          {filteredSubOrders.length === 0 ? (
            <div className="text-center py-16 text-neutral-400 text-xs space-y-2">
              <Package className="w-8 h-8 mx-auto text-neutral-300" />
              <p className="font-semibold text-neutral-600">No matching orders found.</p>
              <p className="text-[11px] text-neutral-400">
                {orderSearchQuery ? 'Try clearing your search filters.' : 'Orders placed by buyers will show here automatically.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-200/80">
              {filteredSubOrders.map((so) => (
                <div key={so.id} className="p-5 space-y-4 hover:bg-neutral-50/40 transition-colors">
                  
                  {/* Top Bar of Order Card */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono font-bold text-sm text-neutral-900">{so.id}</span>
                      <span className="text-neutral-300">·</span>
                      <span className="text-xs text-neutral-500 font-mono">
                        Parent: <span className="font-semibold text-neutral-700">{so.parentOrderId}</span>
                      </span>
                      <span className="text-neutral-300">·</span>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        so.fulfillmentStatus === 'delivered'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : so.fulfillmentStatus === 'dispatched'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {so.fulfillmentStatus === 'delivered' ? 'DELIVERED & SETTLED' : so.fulfillmentStatus.toUpperCase()}
                      </span>
                    </div>

                    {/* Waybill / Manifest Button */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setWaybillSubOrder(so)}
                        className="px-2.5 py-1 text-xs border border-neutral-300 hover:border-neutral-400 text-neutral-700 rounded-lg flex items-center gap-1 cursor-pointer font-medium bg-white"
                        title="Print Courier Waybill / Packing Slip"
                      >
                        <Printer className="w-3.5 h-3.5 text-neutral-500" />
                        <span>Print Waybill</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    
                    {/* Item list (7 cols) */}
                    <div className="lg:col-span-7 space-y-3">
                      <div className="space-y-2">
                        {so.items.map((it) => (
                          <div key={it.productId} className="flex items-center gap-3 bg-neutral-50/60 p-2.5 rounded-lg border border-neutral-100">
                            {it.image && (
                              <img
                                src={it.image}
                                alt={it.title}
                                className="w-12 h-12 object-cover rounded-md bg-neutral-200 shrink-0"
                              />
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-semibold text-neutral-900 truncate">
                                {it.title}
                              </div>
                              <div className="text-[11px] text-neutral-500">
                                SKU: <span className="font-mono text-neutral-700">{it.sku}</span> · Qty: <strong className="text-neutral-800">{it.quantity}</strong>
                              </div>
                              {it.selectedAttributes && Object.keys(it.selectedAttributes).length > 0 && (
                                <div className="text-[10px] text-neutral-400 flex gap-2">
                                  {Object.entries(it.selectedAttributes).map(([k, v]) => (
                                    <span key={k}>{k}: {v}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="text-right shrink-0">
                              <div className="font-bold text-xs tabular-nums text-neutral-900">
                                KES {it.lineTotalKes.toLocaleString()}
                              </div>
                              <div className="text-[10px] text-neutral-400">
                                @ KES {it.unitPriceKes.toLocaleString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Financial breakdown */}
                      <div className="p-3 bg-emerald-50/40 rounded-lg border border-emerald-100 text-[11px] space-y-1">
                        <div className="flex justify-between text-neutral-600">
                          <span>Items Subtotal:</span>
                          <span className="font-semibold text-neutral-900">KES {so.subtotalKes.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-neutral-600">
                          <span>Merchant Delivery Share:</span>
                          <span className="font-semibold text-emerald-800">+KES {so.vendorDeliveryFeeShareKes}</span>
                        </div>
                        <div className="flex justify-between text-neutral-600">
                          <span>Platform Fee ({so.commissionBreakdown.percentageRate}%):</span>
                          <span className="font-semibold text-rose-700">-KES {so.platformCommissionKes.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-neutral-900 font-bold border-t border-emerald-200/60 pt-1 text-xs">
                          <span>Net Payout to Your Wallet:</span>
                          <span className="text-emerald-800">KES {so.vendorNetEarningsKes.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Customer Destination & Courier Tracking (5 cols) */}
                    <div className="lg:col-span-5 space-y-3">
                      
                      {/* Customer Delivery Details */}
                      {so.customerDelivery ? (
                        <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200/80 space-y-1 text-xs">
                          <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-neutral-500" />
                            <span>Destination & Recipient</span>
                          </div>
                          <div className="font-bold text-neutral-900">
                            {so.customerDelivery.name}
                          </div>
                          <div className="text-neutral-600 text-[11px] flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-neutral-400" />
                            <a href={`tel:${so.customerDelivery.phone}`} className="hover:underline font-mono">
                              {so.customerDelivery.phone}
                            </a>
                          </div>
                          <div className="text-neutral-600 text-[11px]">
                            {so.customerDelivery.town}, {so.customerDelivery.county} County
                          </div>
                          {so.customerDelivery.streetDetails && (
                            <div className="text-neutral-500 text-[10px] italic">
                              {so.customerDelivery.streetDetails}
                            </div>
                          )}
                          {so.customerDelivery.buildingNotes && (
                            <div className="text-[10px] text-amber-800 bg-amber-50 p-1.5 rounded mt-1">
                              Note: {so.customerDelivery.buildingNotes}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-xs text-neutral-500">
                          Direct regional delivery coordinates assigned via Parent Order {so.parentOrderId}.
                        </div>
                      )}

                      {/* Tracking or Dispatch Actions */}
                      {so.trackingReference ? (
                        <div className="p-3 bg-blue-50/60 border border-blue-200/70 rounded-lg text-xs space-y-1 font-mono">
                          <div className="text-[10px] uppercase font-bold text-blue-800 flex items-center gap-1 font-sans">
                            <Truck className="w-3.5 h-3.5 text-blue-700" />
                            <span>Courier In Transit</span>
                          </div>
                          <div className="text-neutral-800 font-semibold">
                            {so.courierPartner || 'Fargo Courier Kenya'}
                          </div>
                          <div className="text-blue-900 font-bold">
                            Tracking: {so.trackingReference}
                          </div>
                          {so.dispatchedAt && (
                            <div className="text-[10px] text-neutral-500">
                              Dispatched: {new Date(so.dispatchedAt).toLocaleString('en-KE')}
                            </div>
                          )}
                        </div>
                      ) : null}

                      {/* Action CTA */}
                      <div>
                        {so.fulfillmentStatus === 'pending' && (
                          <button
                            onClick={() => {
                              setDispatchModalSubOrder(so);
                              setTrackingRef('TRK-' + Math.floor(100000 + Math.random() * 900000));
                            }}
                            className="w-full py-2.5 px-3 bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                          >
                            <Truck className="w-4 h-4" />
                            <span>Fulfill & Dispatch Sub-Order</span>
                          </button>
                        )}

                        {so.fulfillmentStatus === 'dispatched' && (
                          <div className="text-xs text-blue-700 font-medium bg-blue-50 p-2 rounded text-center">
                            Dispatched · Escrow releases automatically upon delivery
                          </div>
                        )}

                        {so.fulfillmentStatus === 'delivered' && (
                          <div className="text-xs text-emerald-800 font-semibold bg-emerald-50 p-2 rounded flex items-center justify-center gap-1.5 border border-emerald-200/80">
                            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                            <span>Escrow Released · Net Payout Credited</span>
                          </div>
                        )}
                      </div>

                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: PRODUCT CATALOG & INVENTORY */}
      {/* ========================================================================= */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-xl border border-neutral-200/80 overflow-hidden shadow-2xs space-y-4">
          
          {/* Header Bar */}
          <div className="p-4 bg-neutral-50/70 border-b border-neutral-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* Category Filter */}
              <select
                value={productCategoryFilter}
                onChange={(e) => setProductCategoryFilter(e.target.value)}
                className="text-xs py-1.5 px-2.5 border border-neutral-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-amber-800"
              >
                <option value="All">All Categories</option>
                {UNIVERSAL_CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              {/* Stock Filter */}
              <select
                value={productStockFilter}
                onChange={(e) => setProductStockFilter(e.target.value as any)}
                className="text-xs py-1.5 px-2.5 border border-neutral-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-amber-800"
              >
                <option value="all">All Stock Levels</option>
                <option value="instock">In Stock (&gt;0)</option>
                <option value="lowstock">Low Stock (&le;5)</option>
                <option value="outofstock">Out of Stock (0)</option>
              </select>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Search */}
              <div className="relative w-full md:w-56">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search products or SKU..."
                  value={productSearchQuery}
                  onChange={(e) => setProductSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-neutral-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-amber-800"
                />
              </div>

              <button
                onClick={() => setShowAddProduct(true)}
                className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Item</span>
              </button>
            </div>
          </div>

          {/* Products Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50/60 text-neutral-500 border-b border-neutral-200">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Product</th>
                  <th className="py-2.5 px-4 font-semibold">SKU</th>
                  <th className="py-2.5 px-4 font-semibold">Price (KES)</th>
                  <th className="py-2.5 px-4 font-semibold">Inventory / Quick Stock</th>
                  <th className="py-2.5 px-4 font-semibold">Compliance Status</th>
                  <th className="py-2.5 px-4 font-semibold">Store Visibility</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200/80">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-neutral-400">
                      No products found matching filters.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-neutral-50/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images[0]}
                            alt={p.title}
                            className="w-10 h-10 object-cover rounded-lg bg-neutral-100 shrink-0 border border-neutral-200"
                          />
                          <div className="min-w-0 max-w-xs">
                            <div className="font-semibold text-neutral-900 truncate">{p.title}</div>
                            <div className="text-[11px] text-neutral-500">{p.category}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono text-neutral-700 text-[11px]">
                        {p.sku}
                      </td>

                      <td className="py-3 px-4 font-bold tabular-nums text-neutral-900">
                        KES {p.priceKes.toLocaleString()}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleQuickStockAdjust(p, -1)}
                            disabled={p.stockQuantity <= 0}
                            className="w-6 h-6 rounded bg-neutral-100 hover:bg-neutral-200 disabled:opacity-30 text-neutral-700 font-bold flex items-center justify-center cursor-pointer text-xs"
                            title="Decrease stock by 1"
                          >
                            -
                          </button>
                          <span className={`px-2 py-0.5 rounded font-mono font-bold text-center min-w-[36px] ${
                            p.stockQuantity <= 0
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : p.stockQuantity <= 5
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-neutral-100 text-neutral-800'
                          }`}>
                            {p.stockQuantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleQuickStockAdjust(p, 5)}
                            className="px-1.5 h-6 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold flex items-center justify-center cursor-pointer text-[10px]"
                            title="Add 5 units of stock"
                          >
                            +5
                          </button>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        {p.approvalStatus === 'approved' && (
                          <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approved</span>
                          </span>
                        )}
                        {p.approvalStatus === 'submitted' && (
                          <span className="text-amber-700 font-semibold flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Pending Review</span>
                          </span>
                        )}
                        {p.approvalStatus === 'rejected' && (
                          <span className="text-rose-700 font-semibold flex items-center gap-1" title={p.rejectionReason}>
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>Rejected</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleProductActive(p)}
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded cursor-pointer transition-colors ${
                            p.isActive && p.approvalStatus === 'approved'
                              ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                              : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                          }`}
                          title="Click to toggle visibility"
                        >
                          {p.isActive && p.approvalStatus === 'approved' ? 'Live Online' : 'Hidden'}
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditProductModal(p)}
                            className="p-1.5 hover:bg-neutral-100 rounded text-neutral-600 hover:text-neutral-900 cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProductClick(p)}
                            className="p-1.5 hover:bg-rose-50 rounded text-neutral-400 hover:text-rose-600 cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: DOUBLE-ENTRY FINANCIAL LEDGER */}
      {/* ========================================================================= */}
      {activeTab === 'ledger' && (
        <div className="bg-white rounded-xl border border-neutral-200/80 overflow-hidden shadow-2xs space-y-4">
          <div className="p-4 bg-neutral-50/70 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-neutral-900 uppercase tracking-wider block">
                Immutable Double-Entry Ledger
              </span>
              <span className="text-neutral-500 text-[11px] font-mono">
                Isolated Wallet: {wallet.id}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={ledgerTypeFilter}
                onChange={(e) => setLedgerTypeFilter(e.target.value)}
                className="py-1 px-2 border border-neutral-200 rounded text-xs bg-white"
              >
                <option value="all">All Transactions</option>
                <option value="release">Escrow Releases</option>
                <option value="commission">Commissions</option>
                <option value="payout">Payout Debits</option>
                <option value="credit">Escrow Credits</option>
              </select>

              <button
                onClick={handleExportLedgerCsv}
                className="px-2.5 py-1 bg-white border border-neutral-300 hover:border-neutral-400 text-neutral-700 rounded text-xs font-semibold flex items-center gap-1 cursor-pointer"
                title="Download CSV report"
              >
                <Download className="w-3.5 h-3.5 text-neutral-500" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50/60 text-neutral-500 border-b border-neutral-200">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Timestamp</th>
                  <th className="py-2.5 px-4 font-semibold">Type</th>
                  <th className="py-2.5 px-4 font-semibold">Description & Reference</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Amount (KES)</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Available Bal</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Escrow Bal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200/80">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-neutral-400">
                      No ledger transactions found matching filter.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-neutral-50/50">
                      <td className="py-3 px-4 text-neutral-500 font-mono text-[11px] whitespace-nowrap">
                        {new Date(tx.createdAt).toLocaleString('en-KE')}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-mono text-[10px] bg-neutral-100 px-2 py-0.5 rounded text-neutral-700 font-semibold">
                          {tx.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 max-w-sm">
                        <div className="text-neutral-900 font-medium">{tx.description}</div>
                        <div className="text-[10px] text-neutral-400 font-mono">Ref: {tx.referenceId}</div>
                      </td>
                      <td className="py-3 px-4 text-right font-bold tabular-nums">
                        {tx.type.includes('DEBIT') || tx.type.includes('COMMISSION') ? (
                          <span className="text-rose-600">-KES {tx.amountKes.toLocaleString()}</span>
                        ) : (
                          <span className="text-emerald-700">+KES {tx.amountKes.toLocaleString()}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-neutral-700 font-medium">
                        KES {tx.availableBalanceAfterKes.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-amber-800">
                        KES {tx.pendingBalanceAfterKes.toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: M-PESA PAYOUTS */}
      {/* ========================================================================= */}
      {activeTab === 'payouts' && (
        <div className="space-y-6">
          {/* Summary Box */}
          <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                Safaricom Daraja B2C Disbursements
              </span>
              <h2 className="text-xl font-bold text-white mt-1">
                Withdraw Available Earnings to M-Pesa
              </h2>
              <p className="text-xs text-emerald-200/90 mt-1 max-w-xl">
                Funds released from confirmed customer deliveries can be withdrawn directly to your registered Kenyan Safaricom line at any time.
              </p>
            </div>

            <div className="text-right shrink-0">
              <div className="text-xs text-emerald-200">Available to Withdraw</div>
              <div className="text-3xl font-bold text-white tabular-nums">
                KES {wallet.availableBalanceKes.toLocaleString()}
              </div>
              <button
                onClick={() => {
                  setPayoutAmount(Math.min(5000, wallet.availableBalanceKes));
                  setShowPayoutModal(true);
                }}
                disabled={wallet.availableBalanceKes < 500}
                className="mt-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-neutral-600 disabled:text-neutral-400 text-neutral-950 text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-sm"
              >
                + Request M-Pesa Payout
              </button>
            </div>
          </div>

          {/* Payouts Table */}
          <div className="bg-white rounded-xl border border-neutral-200/80 overflow-hidden shadow-2xs">
            <div className="p-4 bg-neutral-50/70 border-b border-neutral-200 flex justify-between items-center text-xs">
              <span className="font-bold text-neutral-900 uppercase tracking-wider">
                Payout Disbursement History
              </span>
              <span className="text-neutral-500 text-[11px]">
                Direct Safaricom Daraja B2C transfers
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50/60 text-neutral-500 border-b border-neutral-200">
                  <tr>
                    <th className="py-2.5 px-4 font-semibold">Payout ID</th>
                    <th className="py-2.5 px-4 font-semibold">Destination Number</th>
                    <th className="py-2.5 px-4 font-semibold">Amount (KES)</th>
                    <th className="py-2.5 px-4 font-semibold">Status</th>
                    <th className="py-2.5 px-4 font-semibold">Daraja B2C Receipt</th>
                    <th className="py-2.5 px-4 font-semibold">Requested At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200/80">
                  {payouts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-neutral-400">
                        No payout requests filed yet.
                      </td>
                    </tr>
                  ) : (
                    payouts.map((pay) => (
                      <tr key={pay.id} className="hover:bg-neutral-50/50">
                        <td className="py-3 px-4 font-mono font-semibold text-neutral-900">{pay.payoutNumber}</td>
                        <td className="py-3 px-4 font-mono text-neutral-700">{pay.destinationMpesaNumber}</td>
                        <td className="py-3 px-4 font-bold tabular-nums text-neutral-900">
                          KES {pay.amountKes.toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                            pay.status === 'completed'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : pay.status === 'requested'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-rose-50 text-rose-800 border border-rose-200'
                          }`}>
                            {pay.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-neutral-700 font-medium">
                          {pay.b2cReceiptNumber || '—'}
                        </td>
                        <td className="py-3 px-4 text-neutral-500 text-[11px]">
                          {new Date(pay.requestedAt).toLocaleString('en-KE')}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: STORE PROFILE & SETTINGS */}
      {/* ========================================================================= */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Profile Form (2 cols) */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-neutral-200/80 shadow-2xs space-y-6">
            <div>
              <h2 className="text-base font-bold text-neutral-900">Store Profile & Payout Settings</h2>
              <p className="text-xs text-neutral-500">
                Update your Kenyan artisan shop brand, workshop location, and M-Pesa B2C phone number.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Artisan Store Brand Name
                </label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full text-xs p-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Store Contact Phone (Inquiries)
                  </label>
                  <input
                    type="tel"
                    required
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full text-xs p-2.5 border border-neutral-300 rounded-lg font-mono"
                    placeholder="+254712345678"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    M-Pesa Payout Destination Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={profileMpesa}
                    onChange={(e) => setProfileMpesa(e.target.value)}
                    className="w-full text-xs p-2.5 border border-neutral-300 rounded-lg font-mono"
                    placeholder="+254712345678"
                  />
                  <span className="text-[10px] text-neutral-400 block mt-0.5">
                    Used for automatic B2C withdrawals
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    County
                  </label>
                  <select
                    value={profileCounty}
                    onChange={(e) => setProfileCounty(e.target.value)}
                    className="w-full text-xs p-2.5 border border-neutral-300 rounded-lg bg-white"
                  >
                    <option value="Nairobi">Nairobi</option>
                    <option value="Nakuru">Nakuru</option>
                    <option value="Kajiado">Kajiado</option>
                    <option value="Mombasa">Mombasa</option>
                    <option value="Lamu">Lamu</option>
                    <option value="Kisumu">Kisumu</option>
                    <option value="Machakos">Machakos</option>
                    <option value="Kiambu">Kiambu</option>
                    <option value="Uasin Gishu">Uasin Gishu (Eldoret)</option>
                    <option value="Kericho">Kericho</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Town / Workshop Area
                  </label>
                  <input
                    type="text"
                    required
                    value={profileTown}
                    onChange={(e) => setProfileTown(e.target.value)}
                    className="w-full text-xs p-2.5 border border-neutral-300 rounded-lg"
                    placeholder="e.g. Industrial Area, Westlands, Naivasha"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Business Registration Number (BN / BRS Kenya)
                </label>
                <input
                  type="text"
                  value={profileRegNo}
                  onChange={(e) => setProfileRegNo(e.target.value)}
                  className="w-full text-xs p-2.5 border border-neutral-300 rounded-lg font-mono text-[11px]"
                  placeholder="e.g. BN-5519820-KE"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Artisan Biography & Craft Story
                </label>
                <textarea
                  rows={4}
                  value={profileBio}
                  onChange={(e) => setProfileBio(e.target.value)}
                  className="w-full text-xs p-2.5 border border-neutral-300 rounded-lg"
                  placeholder="Describe your heritage craft, materials sourced, and workshop history..."
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  {profileSaving ? 'Saving Changes...' : 'Save Store Profile'}
                </button>
              </div>
            </form>
          </div>

          {/* Side Info Cards (1 col) */}
          <div className="space-y-4">
            
            {/* Commission Tier Card */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-amber-800" />
                <h3 className="font-bold text-amber-950 text-xs uppercase tracking-wider">
                  Platform Commission Tier
                </h3>
              </div>
              <div className="text-2xl font-bold text-amber-900 tabular-nums">
                {vendor.commissionRatePercent || 10}%
              </div>
              <p className="text-xs text-amber-900/80">
                You are currently on the <strong>Artisan Preferred Merchant</strong> rate tier.
                Platform fees cover payment gateway processing, hosting, and escrow custody.
              </p>
            </div>

            {/* KYC & Identity Status */}
            <div className="bg-white border border-neutral-200/80 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <h3 className="font-bold text-neutral-900 text-xs uppercase tracking-wider">
                  KYC & Merchant Verification
                </h3>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <span className="text-neutral-500">KYC Status:</span>
                  <span className="font-semibold text-emerald-700">Verified Level 2</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <span className="text-neutral-500">Escrow Security:</span>
                  <span className="font-semibold text-neutral-800">Safaricom Daraja B2C</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-neutral-500">Joined Platform:</span>
                  <span className="font-mono text-neutral-700">
                    {new Date(vendor.joinedAt).toLocaleDateString('en-KE')}
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: ESCROW DISPUTES & CLAIMS */}
      {/* ========================================================================= */}
      {activeTab === 'disputes' && (
        <div className="bg-white rounded-xl border border-neutral-200/80 overflow-hidden shadow-2xs space-y-4">
          <div className="p-4 bg-neutral-50/70 border-b border-neutral-200 flex justify-between items-center text-xs">
            <div>
              <span className="font-bold text-neutral-900 uppercase tracking-wider block">
                Escrow Disputes & Buyer Inquiries
              </span>
              <span className="text-neutral-500 text-[11px]">
                Under SokoSalama terms, buyer disputes are held in neutral escrow until resolved.
              </span>
            </div>
            <span className="font-semibold text-neutral-700">
              {disputes.length} Active Claim{disputes.length === 1 ? '' : 's'}
            </span>
          </div>

          {disputes.length === 0 ? (
            <div className="text-center py-16 text-neutral-400 text-xs space-y-2">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600" />
              <p className="font-bold text-neutral-700 text-sm">No Active Disputes</p>
              <p className="text-[11px] text-neutral-400 max-w-sm mx-auto">
                Your store currently has a 0% dispute rate. All delivered orders have passed inspection without complaint!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-200/80">
              {disputes.map((d) => (
                <div key={d.id} className="p-5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-neutral-900">{d.disputeNumber}</span>
                      <span className="text-neutral-300">·</span>
                      <span className="text-xs text-neutral-600">Sub-Order: {d.subOrderId}</span>
                    </div>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      d.status.startsWith('resolved') ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {d.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="text-xs space-y-1">
                    <div>
                      <strong>Reason:</strong> {d.reason}
                    </div>
                    <div className="text-neutral-600 bg-neutral-50 p-2.5 rounded border border-neutral-100">
                      &quot;{d.description}&quot;
                    </div>
                    <div className="text-neutral-500 pt-1">
                      Amount at Stake: <strong className="text-neutral-900">KES {d.amountAtStakeKes.toLocaleString()}</strong>
                    </div>
                    {d.adminResolutionNotes && (
                      <div className="p-2 bg-blue-50 border border-blue-200 rounded text-blue-800 text-[11px]">
                        <strong>Admin Resolution Note:</strong> {d.adminResolutionNotes}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: DISPATCH SUB-ORDER */}
      {/* ========================================================================= */}
      {dispatchModalSubOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base font-bold text-neutral-900">
                  Fulfill & Dispatch Sub-Order
                </h3>
                <span className="font-mono text-xs text-neutral-500">
                  {dispatchModalSubOrder.id}
                </span>
              </div>
              <button onClick={() => setDispatchModalSubOrder(null)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-neutral-600">
              Select your shipping courier partner and record the parcel tracking number. The customer will receive simulated SMS updates and can track transit live.
            </p>

            <form onSubmit={handleDispatchSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Courier Partner
                </label>
                <select
                  value={courierPartner}
                  onChange={(e) => setCourierPartner(e.target.value)}
                  className="w-full text-xs p-2.5 border border-neutral-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-amber-800"
                >
                  <option value="Fargo Courier Kenya">Fargo Courier Kenya</option>
                  <option value="G4S Kenya Express">G4S Kenya Express</option>
                  <option value="Sendy Logistics">Sendy Logistics</option>
                  <option value="Boda Express Nairobi">Boda Express Nairobi</option>
                  <option value="Postal Corporation Kenya (EMS)">Postal Corporation Kenya (EMS)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Tracking Reference ID
                </label>
                <input
                  type="text"
                  required
                  value={trackingRef}
                  onChange={(e) => setTrackingRef(e.target.value)}
                  className="w-full text-xs p-2.5 border border-neutral-300 rounded-lg font-mono"
                  placeholder="e.g. FGO-NRB-89102"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setDispatchModalSubOrder(null)}
                  className="flex-1 py-2.5 text-xs font-semibold text-neutral-600 bg-neutral-100 rounded-lg hover:bg-neutral-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={dispatchLoading}
                  className="flex-1 py-2.5 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {dispatchLoading ? 'Registering...' : 'Confirm Dispatch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: PRINT COURIER WAYBILL / SHIPPING MANIFEST */}
      {/* ========================================================================= */}
      {waybillSubOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 space-y-6">
            
            {/* Header Controls */}
            <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                  Regional Delivery Waybill & Shipping Manifest
                </span>
                <h3 className="text-lg font-bold text-neutral-900">
                  Waybill: WB-{waybillSubOrder.id.replace('sub_', '')}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Waybill</span>
                </button>
                <button
                  onClick={() => setWaybillSubOrder(null)}
                  className="p-1.5 text-neutral-400 hover:text-neutral-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Waybill Sheet */}
            <div className="border border-neutral-300 p-5 rounded-xl space-y-4 bg-white text-neutral-900">
              
              {/* Waybill Header: Barcode & Courier Branding */}
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                <div>
                  <div className="text-sm font-black tracking-tight text-neutral-900">
                    SOKOSALAMA LOGISTICS NETWORK
                  </div>
                  <div className="text-[11px] text-neutral-500 font-mono">
                    Service: {waybillSubOrder.courierPartner || 'Fargo Courier Kenya'}
                  </div>
                </div>
                {/* Barcode Mock */}
                <div className="text-right">
                  <div className="font-mono text-xs tracking-widest font-bold">
                    ||| | |||| | |||||| || |
                  </div>
                  <div className="text-[10px] font-mono text-neutral-400">
                    {waybillSubOrder.trackingReference || 'TRK-' + Math.floor(100000 + Math.random() * 900000)}
                  </div>
                </div>
              </div>

              {/* Shipper & Consignee Boxes */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                
                {/* Consignor (Shipper) */}
                <div className="border border-neutral-200 p-3 rounded-lg bg-neutral-50/50 space-y-1">
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    From (Consignor / Vendor)
                  </div>
                  <div className="font-bold text-neutral-900">{vendor.name}</div>
                  <div className="text-[11px] text-neutral-600">Store ID: {vendor.id}</div>
                  <div className="text-[11px] text-neutral-600">{vendor.town}, {vendor.county} County</div>
                  <div className="text-[11px] text-neutral-600 font-mono">Phone: {vendor.phone}</div>
                </div>

                {/* Consignee (Receiver) */}
                <div className="border border-neutral-200 p-3 rounded-lg bg-neutral-50/50 space-y-1">
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    To (Consignee / Customer)
                  </div>
                  <div className="font-bold text-neutral-900">
                    {waybillSubOrder.customerDelivery?.name || 'Customer'}
                  </div>
                  <div className="text-[11px] text-neutral-600 font-mono">
                    Phone: {waybillSubOrder.customerDelivery?.phone || '+254700000000'}
                  </div>
                  <div className="text-[11px] text-neutral-600">
                    {waybillSubOrder.customerDelivery?.town || 'Town'}, {waybillSubOrder.customerDelivery?.county || 'County'}
                  </div>
                  {waybillSubOrder.customerDelivery?.streetDetails && (
                    <div className="text-[11px] text-neutral-500 italic">
                      {waybillSubOrder.customerDelivery.streetDetails}
                    </div>
                  )}
                </div>

              </div>

              {/* Itemized Table */}
              <div>
                <div className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Package Contents Checklist
                </div>
                <table className="w-full text-left text-xs border border-neutral-200">
                  <thead className="bg-neutral-100 text-neutral-600">
                    <tr>
                      <th className="py-1.5 px-3">Item Description</th>
                      <th className="py-1.5 px-3">SKU</th>
                      <th className="py-1.5 px-3 text-center">Qty</th>
                      <th className="py-1.5 px-3 text-right">Declared Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {waybillSubOrder.items.map(it => (
                      <tr key={it.productId}>
                        <td className="py-2 px-3 font-medium">{it.title}</td>
                        <td className="py-2 px-3 font-mono text-[11px] text-neutral-500">{it.sku}</td>
                        <td className="py-2 px-3 text-center font-bold">{it.quantity}</td>
                        <td className="py-2 px-3 text-right tabular-nums">KES {it.lineTotalKes.toLocaleString()}</td>
                      </tr>
                    ))}
                    <tr className="bg-neutral-50 font-bold">
                      <td colSpan={3} className="py-2 px-3 text-right">Total Declared Shipment Value:</td>
                      <td className="py-2 px-3 text-right text-emerald-800 tabular-nums">
                        KES {waybillSubOrder.subtotalKes.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Handling Notes & Signature Blocks */}
              <div className="grid grid-cols-2 gap-4 text-[11px] pt-3 border-t border-neutral-200">
                <div className="border border-dashed border-neutral-300 p-3 rounded text-center">
                  <div className="text-neutral-500 mb-6">Courier Driver Pickup Signature & Date</div>
                  <div className="border-t border-neutral-300 w-3/4 mx-auto pt-1 font-mono text-[10px] text-neutral-400">
                    Agent ID / Date Handed Over
                  </div>
                </div>

                <div className="border border-dashed border-neutral-300 p-3 rounded text-center">
                  <div className="text-neutral-500 mb-6">Customer Handover Receiving Signature</div>
                  <div className="border-t border-neutral-300 w-3/4 mx-auto pt-1 font-mono text-[10px] text-neutral-400">
                    Recipient Signature / Date Received
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: SUBMIT PRODUCT (UNIVERSAL & BRAND-NEUTRAL) */}
      {/* ========================================================================= */}
      {showAddProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div>
                <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                  <span>Submit Product</span>
                  <span className="text-[10px] font-semibold bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded">
                    Universal Catalog
                  </span>
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  List any product across electronics, fashion, home appliances, food, or crafts. Neutral to all brands.
                </p>
              </div>
              <button onClick={() => setShowAddProduct(false)} className="text-neutral-400 hover:text-neutral-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="space-y-4">
              {/* Product Title */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Product Title <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs p-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  placeholder="e.g. Samsung Galaxy S24 Ultra 5G (256GB) or Nike Air Max 270"
                />
              </div>

              {/* Brand and Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Brand / Manufacturer <span className="text-neutral-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    className="w-full text-xs p-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    placeholder="e.g. Samsung, Sony, Nike, HP, or Generic"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Category <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full text-xs p-2.5 border border-neutral-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  >
                    {UNIVERSAL_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* SKU & Condition */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-neutral-700">SKU Code</label>
                    <button
                      type="button"
                      onClick={generateSku}
                      className="text-[11px] text-amber-800 hover:text-amber-900 font-semibold cursor-pointer underline"
                    >
                      Auto-Generate
                    </button>
                  </div>
                  <input
                    type="text"
                    value={newSku}
                    onChange={(e) => setNewSku(e.target.value)}
                    className="w-full text-xs p-2.5 border border-neutral-300 rounded-lg font-mono text-[11px]"
                    placeholder="e.g. SAM-S24U-256 or NKE-AM270"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Condition</label>
                  <select
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value as any)}
                    className="w-full text-xs p-2.5 border border-neutral-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900 capitalize"
                  >
                    <option value="new">Brand New (Factory Sealed)</option>
                    <option value="refurbished">Refurbished / Certified Pre-Owned</option>
                    <option value="handmade">Handmade / Artisan Crafted</option>
                    <option value="used">Used / Fair Condition</option>
                  </select>
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Selling Price (KES) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-neutral-300 rounded-lg tabular-nums focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Compare Price (KES) <span className="text-neutral-400 font-normal">(RRP)</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={newCompareAtPrice}
                    onChange={(e) => setNewCompareAtPrice(e.target.value ? Number(e.target.value) : '')}
                    className="w-full text-xs p-2.5 border border-neutral-300 rounded-lg tabular-nums placeholder:text-neutral-400"
                    placeholder="e.g. 5000"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Stock Quantity <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newStock}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-neutral-300 rounded-lg tabular-nums focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
              </div>

              {/* Variant / Edition Label */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Default Variant / Specification Label
                </label>
                <input
                  type="text"
                  value={newVariantLabel}
                  onChange={(e) => setNewVariantLabel(e.target.value)}
                  className="w-full text-xs p-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  placeholder="e.g. 256GB / Titanium Gray, Size 42, or Standard Edition"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Product Description <span className="text-rose-600">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full text-xs p-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 leading-relaxed"
                  placeholder="Detailed product specifications, key features, package contents, warranty details, and usage notes..."
                />
              </div>

              {/* Image Input and Preset Gallery */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Product Image URL <span className="text-rose-600">*</span>
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    required
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="flex-1 text-xs p-2.5 border border-neutral-300 rounded-lg font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    placeholder="https://images.unsplash.com/... or asset URL"
                  />
                  {newImageUrl && (
                    <div className="w-10 h-10 rounded-lg border border-neutral-200 overflow-hidden shrink-0 bg-neutral-100">
                      <img
                        src={newImageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect fill="%23eee" width="40" height="40"/><text fill="%23aaa" font-size="10" x="50%" y="50%" text-anchor="middle" dy="3">Preview</text></svg>';
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="text-[11px] text-neutral-500 font-semibold mb-1.5">
                  Quick Preset Category Imagery:
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {universalImagePresets.map(img => (
                    <button
                      type="button"
                      key={img.label}
                      onClick={() => setNewImageUrl(img.url)}
                      className={`text-left text-[11px] p-1.5 rounded-lg border flex items-center gap-2 cursor-pointer transition-colors ${
                        newImageUrl === img.url
                          ? 'border-neutral-900 bg-neutral-100 font-semibold text-neutral-900 ring-1 ring-neutral-900'
                          : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                      }`}
                    >
                      <img src={img.url} alt={img.label} className="w-6 h-6 object-cover rounded shrink-0 bg-neutral-200" />
                      <span className="truncate">{img.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2.5 pt-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setShowAddProduct(false)}
                  className="flex-1 py-2.5 text-xs font-semibold text-neutral-600 bg-neutral-100 rounded-lg hover:bg-neutral-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={productSubmitLoading}
                  className="flex-1 py-2.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg cursor-pointer disabled:opacity-50"
                >
                  {productSubmitLoading ? 'Submitting Product...' : 'Submit Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: EDIT EXISTING PRODUCT */}
      {/* ========================================================================= */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div>
                <h3 className="text-base font-bold text-neutral-900">
                  Edit Product: {editingProduct.title}
                </h3>
                <span className="font-mono text-xs text-neutral-500">SKU: {editingProduct.sku}</span>
              </div>
              <button onClick={() => setEditingProduct(null)} className="text-neutral-400 hover:text-neutral-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditProductSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full text-xs p-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Brand / Manufacturer
                  </label>
                  <input
                    type="text"
                    value={editBrand}
                    onChange={(e) => setEditBrand(e.target.value)}
                    className="w-full text-xs p-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    placeholder="e.g. Samsung, Sony, Nike"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Category</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full text-xs p-2.5 border border-neutral-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  >
                    {UNIVERSAL_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Price (KES)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={editPrice}
                    onChange={(e) => setEditPrice(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-neutral-300 rounded-lg tabular-nums"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Compare Price (KES)</label>
                  <input
                    type="number"
                    min={0}
                    value={editCompareAtPrice}
                    onChange={(e) => setEditCompareAtPrice(e.target.value ? Number(e.target.value) : '')}
                    className="w-full text-xs p-2.5 border border-neutral-300 rounded-lg tabular-nums"
                    placeholder="Optional"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Stock Units</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={editStock}
                    onChange={(e) => setEditStock(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-neutral-300 rounded-lg tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Condition</label>
                <select
                  value={editCondition}
                  onChange={(e) => setEditCondition(e.target.value as any)}
                  className="w-full text-xs p-2.5 border border-neutral-300 rounded-lg bg-white capitalize"
                >
                  <option value="new">Brand New (Factory Sealed)</option>
                  <option value="refurbished">Refurbished / Certified Pre-Owned</option>
                  <option value="handmade">Handmade / Artisan Crafted</option>
                  <option value="used">Used / Fair Condition</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full text-xs p-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Product Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={editImageUrl}
                    onChange={(e) => setEditImageUrl(e.target.value)}
                    className="flex-1 text-xs p-2.5 border border-neutral-300 rounded-lg font-mono text-[11px]"
                  />
                  {editImageUrl && (
                    <div className="w-10 h-10 rounded-lg border border-neutral-200 overflow-hidden shrink-0 bg-neutral-100">
                      <img
                        src={editImageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect fill="%23eee" width="40" height="40"/><text fill="%23aaa" font-size="10" x="50%" y="50%" text-anchor="middle" dy="3">Preview</text></svg>';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2.5 pt-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="flex-1 py-2.5 text-xs font-semibold text-neutral-600 bg-neutral-100 rounded-lg hover:bg-neutral-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="flex-1 py-2.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg cursor-pointer"
                >
                  {editLoading ? 'Saving...' : 'Save Product Updates'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: REQUEST M-PESA PAYOUT */}
      {/* ========================================================================= */}
      {showPayoutModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base font-bold text-neutral-900">
                  Request M-Pesa Payout
                </h3>
                <p className="text-xs text-neutral-500">
                  Instant B2C disbursement via Safaricom Daraja
                </p>
              </div>
              <button onClick={() => setShowPayoutModal(false)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {payoutError && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
                {payoutError}
              </div>
            )}

            <form onSubmit={handlePayoutSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Amount (KES) · Available: KES {wallet.availableBalanceKes.toLocaleString()}
                </label>
                <input
                  type="number"
                  required
                  min={500}
                  max={wallet.availableBalanceKes}
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(Number(e.target.value))}
                  className="w-full text-xs p-2.5 border border-neutral-300 rounded-lg tabular-nums font-bold"
                />
                <span className="text-[10px] text-neutral-400 block mt-0.5">
                  Minimum withdrawal threshold: KES 500
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Destination M-Pesa Number
                </label>
                <input
                  type="tel"
                  required
                  value={payoutPhone}
                  onChange={(e) => setPayoutPhone(e.target.value)}
                  className="w-full text-xs p-2.5 border border-neutral-300 rounded-lg font-mono"
                  placeholder="+254712345678"
                />
              </div>

              <div className="p-2.5 bg-emerald-50/70 border border-emerald-100 rounded-lg text-[11px] text-emerald-800">
                Disbursement is sent directly to your M-Pesa account balance without withdrawal deduction fees.
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPayoutModal(false)}
                  className="flex-1 py-2.5 text-xs font-semibold text-neutral-600 bg-neutral-100 rounded-lg hover:bg-neutral-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={payoutLoading || wallet.availableBalanceKes < 500}
                  className="flex-1 py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors cursor-pointer"
                >
                  {payoutLoading ? 'Sending...' : 'Confirm Withdrawal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
