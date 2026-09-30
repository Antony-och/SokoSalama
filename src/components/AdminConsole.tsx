import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  DollarSign, 
  Settings as SettingsIcon, 
  MapPin, 
  FileText, 
  TrendingUp, 
  Store, 
  Package, 
  Lock, 
  Percent, 
  Plus, 
  Check, 
  AlertCircle,
  Scale,
  Download,
  Search,
  RefreshCw,
  Sliders,
  Send,
  Trash2,
  Edit2,
  Clock,
  ExternalLink,
  Smartphone,
  Info,
  ShieldCheck,
  Building2,
  CheckSquare,
  Square,
  MinusSquare,
  Filter,
  Layers,
  Trophy,
  Award,
  Star,
  Truck,
  BarChart3,
  Flame,
  Zap,
  Tag,
  Timer,
  Play,
  Pause,
  Sparkles
} from 'lucide-react';
import { 
  Vendor, 
  Product, 
  PayoutRequest, 
  CommissionRule, 
  DeliveryZone, 
  AuditLog, 
  ParentOrder, 
  SubOrder, 
  UserSession,
  PlatformSettings,
  Dispute,
  HotDeal
} from '../types';
import { AdminSettings } from './AdminSettings';

interface AdminConsoleProps {
  currentSession: UserSession;
  vendors: Vendor[];
  products: Product[];
  payouts: PayoutRequest[];
  commissionRules: CommissionRule[];
  deliveryZones: DeliveryZone[];
  auditLogs: AuditLog[];
  parentOrders: ParentOrder[];
  subOrders: SubOrder[];
  financialStats: any;
  settings: PlatformSettings;
  disputes: Dispute[];
  hotDeals?: HotDeal[];
  onApproveProduct: (productId: string, approve: boolean, reason?: string) => Promise<void>;
  onBulkModerateProducts?: (productIds: string[], approve: boolean, reason?: string) => Promise<void>;
  onUpdateVendorStatus: (vendorId: string, status: Vendor['status']) => Promise<void>;
  onCreateVendor: (data: { storeName: string; ownerName: string; email: string; phone: string; county: string; town: string; mpesaPayoutNumber: string; bio: string; businessRegistrationNumber?: string }) => Promise<Vendor>;
  onProcessPayout: (payoutId: string, approve: boolean, notes?: string) => Promise<void>;
  onSaveCommissionRule: (rule: CommissionRule) => Promise<void>;
  onSaveDeliveryZone: (zone: DeliveryZone) => Promise<void>;
  onDeleteDeliveryZone: (zoneId: string) => Promise<void>;
  onUpdateSettings: (settings: Partial<PlatformSettings>) => Promise<void>;
  onResolveDispute: (disputeId: string, resolutionType: 'FULL_REFUND' | 'RELEASE_TO_VENDOR' | 'SPLIT_ESCROW', notes: string) => Promise<void>;
  onUpdateVendorCommission: (vendorId: string, commissionRatePercent: number, customFixedFeeKes: number) => Promise<void>;
  onTriggerAutoRelease: () => Promise<any>;
  onSaveHotDeal?: (dealData: Partial<HotDeal> & { productId: string }) => Promise<void>;
  onDeleteHotDeal?: (dealId: string) => Promise<void>;
  onToggleHotDeal?: (dealId: string, isActive: boolean) => Promise<void>;
  onExtendHotDealTimer?: (dealId: string, hours: number) => Promise<void>;
}

export const AdminConsole: React.FC<AdminConsoleProps> = ({
  currentSession,
  vendors,
  products,
  payouts,
  commissionRules,
  deliveryZones,
  auditLogs,
  parentOrders,
  subOrders,
  financialStats,
  settings,
  disputes,
  hotDeals = [],
  onApproveProduct,
  onBulkModerateProducts,
  onUpdateVendorStatus,
  onCreateVendor,
  onProcessPayout,
  onSaveCommissionRule,
  onSaveDeliveryZone,
  onDeleteDeliveryZone,
  onUpdateSettings,
  onResolveDispute,
  onUpdateVendorCommission,
  onTriggerAutoRelease,
  onSaveHotDeal,
  onDeleteHotDeal,
  onToggleHotDeal,
  onExtendHotDealTimer,
}) => {
  const [adminTab, setAdminTab] = useState<
    'analytics' | 'insights' | 'disputes' | 'products' | 'hotdeals' | 'vendors' | 'commissions' | 'payouts' | 'zones' | 'settings' | 'audit'
  >('analytics');

  const [notification, setNotification] = useState<string | null>(null);
  const [globalFilterText, setGlobalFilterText] = useState('');
  const [leaderboardSortMetric, setLeaderboardSortMetric] = useState<
    'overall' | 'sales' | 'deliveries' | 'fulfillmentRate'
  >('overall');

  // Auto Release Loading
  const [autoReleaseLoading, setAutoReleaseLoading] = useState(false);

  // New Commission Rule state
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleType, setNewRuleType] = useState<'global' | 'category' | 'vendor'>('category');
  const [newRuleTarget, setNewRuleTarget] = useState('Tech & Electronics');
  const [newRulePercent, setNewRulePercent] = useState<number>(7);
  const [newRuleFixedFee, setNewRuleFixedFee] = useState<number>(50);
  const [showAddRuleModal, setShowAddRuleModal] = useState(false);

  // Delivery Zone Modal state
  const [showZoneModal, setShowZoneModal] = useState(false);
  const [editingZoneId, setEditingZoneId] = useState<string | null>(null);
  const [zoneCounty, setZoneCounty] = useState('Nairobi');
  const [zoneName, setZoneName] = useState('');
  const [zoneTownsText, setZoneTownsText] = useState('');
  const [zoneFee, setZoneFee] = useState<number>(300);
  const [zoneHours, setZoneHours] = useState('Within 24 Hours');

  // Vendor Commission Edit Modal
  const [commissionModalVendor, setCommissionModalVendor] = useState<Vendor | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [showAddVendorModal, setShowAddVendorModal] = useState(false);
  const [addingVendor, setAddingVendor] = useState(false);
  const [vendorFormError, setVendorFormError] = useState('');
  const [newVendor, setNewVendor] = useState({ storeName: '', ownerName: '', email: '', phone: '', county: '', town: '', mpesaPayoutNumber: '', bio: '', businessRegistrationNumber: '' });
  const [vendorRateInput, setVendorRateInput] = useState<number>(10);
  const [vendorFixedFeeInput, setVendorFixedFeeInput] = useState<number>(0);

  // Dispute Arbitration Modal
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [disputeResolutionType, setDisputeResolutionType] = useState<'FULL_REFUND' | 'RELEASE_TO_VENDOR' | 'SPLIT_ESCROW'>('FULL_REFUND');
  const [disputeNotes, setDisputeNotes] = useState('');
  const [disputeLoading, setDisputeLoading] = useState(false);

  // Platform Settings Form state
  const [settingsForm, setSettingsForm] = useState<PlatformSettings>({ ...settings });
  const [settingsSaving, setSettingsSaving] = useState(false);

  // Audit Logs Filter
  const [auditActionFilter, setAuditActionFilter] = useState('ALL');

  // Product Moderation & Bulk Action state
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [productStatusFilter, setProductStatusFilter] = useState<'all' | 'submitted' | 'approved' | 'rejected'>('all');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [showBulkRejectModal, setShowBulkRejectModal] = useState(false);
  const [selectedPresetReason, setSelectedPresetReason] = useState('Missing or expired KEBS / regulatory safety standard certificate');
  const [bulkRejectCustomReason, setBulkRejectCustomReason] = useState('');

  // Pending counts
  const pendingProducts = products.filter(p => p.approvalStatus === 'submitted');
  const pendingVendors = vendors.filter(v => v.status === 'pending');
  const pendingPayouts = payouts.filter(p => p.status === 'requested');
  const openDisputes = disputes.filter(d => d.status === 'opened' || d.status === 'under_review');
  const activeHotDealsCount = hotDeals.filter(d => d.isActive).length;

  // Hot Deals State
  const [showHotDealModal, setShowHotDealModal] = useState(false);
  const [editingDealId, setEditingDealId] = useState<string | null>(null);
  const [dealProductId, setDealProductId] = useState<string>('');
  const [dealTitle, setDealTitle] = useState<string>('');
  const [dealBadgeText, setDealBadgeText] = useState<string>('🔥 FLASH SALE');
  const [dealPriceInput, setDealPriceInput] = useState<number>(0);
  const [dealDiscountInput, setDealDiscountInput] = useState<number>(20);
  const [dealEndsAt, setDealEndsAt] = useState<string>('');
  const [dealTotalQuota, setDealTotalQuota] = useState<number>(25);
  const [dealClaimedCount, setDealClaimedCount] = useState<number>(0);
  const [dealIsActive, setDealIsActive] = useState<boolean>(true);
  const [dealFeatured, setDealFeatured] = useState<boolean>(true);
  const [dealSaving, setDealSaving] = useState(false);
  const [hotDealFilterStatus, setHotDealFilterStatus] = useState<'all' | 'active' | 'inactive' | 'expired'>('all');
  const [hotDealSearch, setHotDealSearch] = useState('');
  const [productPickerFilter, setProductPickerFilter] = useState('');

  const handleOpenCreateHotDealModal = (preselectedProductId?: string) => {
    setEditingDealId(null);
    const targetProduct = preselectedProductId
      ? products.find(p => p.id === preselectedProductId)
      : (products.find(p => p.approvalStatus === 'approved') || products[0]);

    if (targetProduct) {
      setDealProductId(targetProduct.id);
      setDealTitle(targetProduct.title);
      const discount = 20;
      const calculatedDealPrice = Math.round(targetProduct.priceKes * 0.8);
      setDealDiscountInput(discount);
      setDealPriceInput(calculatedDealPrice);
    } else {
      setDealProductId('');
      setDealTitle('');
      setDealPriceInput(0);
      setDealDiscountInput(20);
    }

    const defaultTimer = new Date(Date.now() + 24 * 3600 * 1000).toISOString().slice(0, 16);
    setDealEndsAt(defaultTimer);
    setDealBadgeText('🔥 FLASH 20% OFF');
    setDealTotalQuota(25);
    setDealClaimedCount(0);
    setDealIsActive(true);
    setDealFeatured(true);
    setShowHotDealModal(true);
  };

  const handleOpenEditHotDealModal = (deal: HotDeal) => {
    setEditingDealId(deal.id);
    setDealProductId(deal.productId);
    setDealTitle(deal.title);
    setDealBadgeText(deal.badgeText);
    setDealPriceInput(deal.dealPriceKes);
    setDealDiscountInput(deal.discountPercentage);
    setDealEndsAt(new Date(deal.endsAt).toISOString().slice(0, 16));
    setDealTotalQuota(deal.totalQuota);
    setDealClaimedCount(deal.claimedCount);
    setDealIsActive(deal.isActive);
    setDealFeatured(Boolean(deal.featured));
    setShowHotDealModal(true);
  };

  const handleProductSelectInModal = (selectedId: string) => {
    setDealProductId(selectedId);
    const prod = products.find(p => p.id === selectedId);
    if (prod) {
      setDealTitle(prod.title);
      const calculatedPrice = Math.round(prod.priceKes * (1 - dealDiscountInput / 100));
      setDealPriceInput(calculatedPrice);
    }
  };

  const handlePriceChangeInModal = (price: number) => {
    setDealPriceInput(price);
    const prod = products.find(p => p.id === dealProductId);
    if (prod && prod.priceKes > 0) {
      const disc = Math.max(1, Math.min(95, Math.round(((prod.priceKes - price) / prod.priceKes) * 100)));
      setDealDiscountInput(disc);
    }
  };

  const handleDiscountChangeInModal = (disc: number) => {
    setDealDiscountInput(disc);
    const prod = products.find(p => p.id === dealProductId);
    if (prod && prod.priceKes > 0) {
      const price = Math.round(prod.priceKes * (1 - disc / 100));
      setDealPriceInput(price);
    }
  };

  const handleApplyDurationShortcut = (hours: number) => {
    const targetTime = new Date(Date.now() + hours * 3600 * 1000).toISOString().slice(0, 16);
    setDealEndsAt(targetTime);
  };

  const handleSaveHotDealSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dealProductId) {
      alert('Please select a product for the deal.');
      return;
    }
    const product = products.find(p => p.id === dealProductId);
    if (!product) {
      alert('Selected product not found.');
      return;
    }

    setDealSaving(true);
    try {
      if (onSaveHotDeal) {
        await onSaveHotDeal({
          id: editingDealId || undefined,
          productId: dealProductId,
          title: dealTitle || product.title,
          badgeText: dealBadgeText,
          dealPriceKes: Number(dealPriceInput) || Math.round(product.priceKes * 0.8),
          originalPriceKes: product.priceKes,
          discountPercentage: Number(dealDiscountInput) || 20,
          endsAt: dealEndsAt ? new Date(dealEndsAt).toISOString() : new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
          totalQuota: Number(dealTotalQuota) || 25,
          claimedCount: Number(dealClaimedCount) || 0,
          isActive: dealIsActive,
          featured: dealFeatured,
        });
      }
      setShowHotDealModal(false);
      notify(editingDealId ? 'Hot Deal updated successfully.' : 'New Hot Deal launched live on storefront!');
    } catch (err: any) {
      alert(err.message || 'Failed saving hot deal');
    } finally {
      setDealSaving(false);
    }
  };

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleProductAction = async (id: string, approve: boolean, reason?: string) => {
    try {
      await onApproveProduct(id, approve, approve ? undefined : (reason || 'Declined compliance review'));
      notify(approve ? 'Product approved and published to catalog.' : 'Product rejected.');
      // Remove from selected if present
      setSelectedProductIds(prev => prev.filter(pId => pId !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleToggleProduct = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    );
  };

  const handleSelectAllFiltered = (currentFiltered: Product[]) => {
    const allFilteredIds = currentFiltered.map((p) => p.id);
    const areAllSelected = allFilteredIds.length > 0 && allFilteredIds.every((id) => selectedProductIds.includes(id));
    if (areAllSelected) {
      setSelectedProductIds((prev) => prev.filter((id) => !allFilteredIds.includes(id)));
    } else {
      setSelectedProductIds((prev) => Array.from(new Set([...prev, ...allFilteredIds])));
    }
  };

  const handleSelectOnlyPending = () => {
    const pendingIds = products.filter((p) => p.approvalStatus === 'submitted').map((p) => p.id);
    setSelectedProductIds(pendingIds);
    setProductStatusFilter('submitted');
  };

  const handleClearSelection = () => {
    setSelectedProductIds([]);
  };

  const handleBulkApprove = async () => {
    if (selectedProductIds.length === 0) return;
    const count = selectedProductIds.length;
    setBulkActionLoading(true);
    try {
      if (onBulkModerateProducts) {
        await onBulkModerateProducts(selectedProductIds, true);
      } else {
        for (const id of selectedProductIds) {
          await onApproveProduct(id, true);
        }
      }
      notify(`Successfully approved and published ${count} product${count > 1 ? 's' : ''} to marketplace.`);
      setSelectedProductIds([]);
    } catch (err: any) {
      alert('Bulk approval failed: ' + err.message);
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleConfirmBulkReject = async () => {
    if (selectedProductIds.length === 0) return;
    const count = selectedProductIds.length;
    const finalReason = bulkRejectCustomReason.trim() || selectedPresetReason || 'Declined compliance review';
    setBulkActionLoading(true);
    try {
      if (onBulkModerateProducts) {
        await onBulkModerateProducts(selectedProductIds, false, finalReason);
      } else {
        for (const id of selectedProductIds) {
          await onApproveProduct(id, false, finalReason);
        }
      }
      notify(`Rejected ${count} product${count > 1 ? 's' : ''} with compliance feedback.`);
      setSelectedProductIds([]);
      setShowBulkRejectModal(false);
      setBulkRejectCustomReason('');
    } catch (err: any) {
      alert('Bulk rejection failed: ' + err.message);
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleVendorAction = async (id: string, status: Vendor['status']) => {
    try {
      await onUpdateVendorStatus(id, status);
      notify(`Vendor status updated to ${status}.`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCreateVendor = async (event: React.FormEvent) => {
    event.preventDefault();
    setVendorFormError('');
    setAddingVendor(true);
    try {
      const created = await onCreateVendor(newVendor);
      setNewVendor({ storeName: '', ownerName: '', email: '', phone: '', county: '', town: '', mpesaPayoutNumber: '', bio: '', businessRegistrationNumber: '' });
      setShowAddVendorModal(false);
      notify(`${created.name} was added to the marketplace.`);
    } catch (cause) {
      setVendorFormError(cause instanceof Error ? cause.message : 'Could not add this vendor. Please try again.');
    } finally {
      setAddingVendor(false);
    }
  };

  const handlePayoutAction = async (id: string, approve: boolean) => {
    try {
      await onProcessPayout(id, approve, approve ? 'Approved via M-Pesa B2C' : 'Declined by Admin');
      notify(approve ? 'M-Pesa B2C payout disbursed!' : 'Payout request declined and refunded.');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const rule: CommissionRule = {
        id: 'rule_' + Date.now(),
        name: newRuleName,
        type: newRuleType,
        targetCategory: newRuleType === 'category' ? newRuleTarget : undefined,
        targetVendorId: newRuleType === 'vendor' ? newRuleTarget : undefined,
        ratePercent: Number(newRulePercent),
        fixedFeeKes: Number(newRuleFixedFee),
        isActive: true,
        updatedAt: new Date().toISOString(),
      };
      await onSaveCommissionRule(rule);
      setShowAddRuleModal(false);
      setNewRuleName('');
      notify('New multi-tier commission rule saved!');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSaveZoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const towns = zoneTownsText
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      const zone: DeliveryZone = {
        id: editingZoneId || 'zone_' + Date.now(),
        county: zoneCounty,
        name: zoneName,
        towns: towns.length > 0 ? towns : ['Major County Towns'],
        feeKes: Number(zoneFee),
        estimatedDeliveryHours: zoneHours,
        isActive: true,
      };

      await onSaveDeliveryZone(zone);
      setShowZoneModal(false);
      setEditingZoneId(null);
      setZoneName('');
      setZoneTownsText('');
      notify('Delivery zone saved successfully.');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteZone = async (id: string) => {
    if (confirm('Are you sure you want to delete this delivery zone?')) {
      try {
        await onDeleteDeliveryZone(id);
        notify('Delivery zone deleted.');
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  const handleSaveSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaving(true);
    try {
      await onUpdateSettings(settingsForm);
      notify('Platform settings and M-Pesa parameters updated successfully.');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSettingsSaving(false);
    }
  };

  const handleResolveDisputeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDispute) return;
    setDisputeLoading(true);
    try {
      await onResolveDispute(selectedDispute.id, disputeResolutionType, disputeNotes);
      setSelectedDispute(null);
      setDisputeNotes('');
      notify(`Dispute ${selectedDispute.disputeNumber} successfully arbitrated and funds adjusted.`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDisputeLoading(false);
    }
  };

  const handleSaveVendorCommission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commissionModalVendor) return;
    try {
      await onUpdateVendorCommission(commissionModalVendor.id, Number(vendorRateInput), Number(vendorFixedFeeInput));
      setCommissionModalVendor(null);
      notify(`Negotiated commission updated for ${commissionModalVendor.name}.`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleTriggerAutoReleaseCron = async () => {
    setAutoReleaseLoading(true);
    try {
      const res = await onTriggerAutoRelease();
      notify(`Escrow cron complete: Released ${res.releasedCount || 0} sub-orders from pending escrow to vendor wallets!`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setAutoReleaseLoading(false);
    }
  };

  // Dynamically calculate vendor metrics from subOrders and vendors
  const vendorPerformanceData = vendors.map((vendor) => {
    const vendorSubOrders = subOrders.filter((so) => so.vendorId === vendor.id);
    const deliveredOrders = vendorSubOrders.filter((so) => so.fulfillmentStatus === 'delivered');
    const dispatchedOrders = vendorSubOrders.filter((so) => so.fulfillmentStatus === 'dispatched');
    const pendingOrders = vendorSubOrders.filter((so) => so.fulfillmentStatus === 'pending');
    
    const totalSalesKes = vendorSubOrders.reduce((sum, so) => sum + so.subtotalKes, 0);
    const totalEarningsKes = vendorSubOrders.reduce((sum, so) => sum + so.vendorNetEarningsKes, 0);
    const platformCommissionContributedKes = vendorSubOrders.reduce((sum, so) => sum + so.platformCommissionKes, 0);
    
    const totalOrdersCount = vendorSubOrders.length;
    const deliveredCount = deliveredOrders.length;
    const dispatchedCount = dispatchedOrders.length;
    const pendingCount = pendingOrders.length;
    
    const fulfillmentRate = totalOrdersCount > 0 
      ? Math.round((deliveredCount / totalOrdersCount) * 100) 
      : 100;

    // Weighted composite score: (Sales normalized + Deliveries weighted)
    const compositeScore = Math.round((totalSalesKes / 1000) * 0.7 + (deliveredCount * 150));

    return {
      vendor,
      totalSalesKes,
      totalEarningsKes,
      platformCommissionContributedKes,
      totalOrdersCount,
      deliveredCount,
      dispatchedCount,
      pendingCount,
      fulfillmentRate,
      compositeScore,
    };
  });

  // Sort based on selected metric
  const sortedLeaderboard = [...vendorPerformanceData].sort((a, b) => {
    if (leaderboardSortMetric === 'sales') {
      return b.totalSalesKes - a.totalSalesKes;
    }
    if (leaderboardSortMetric === 'deliveries') {
      return b.deliveredCount - a.deliveredCount || b.totalSalesKes - a.totalSalesKes;
    }
    if (leaderboardSortMetric === 'fulfillmentRate') {
      return b.fulfillmentRate - a.fulfillmentRate || b.totalSalesKes - a.totalSalesKes;
    }
    return b.compositeScore - a.compositeScore;
  });

  const top10Vendors = sortedLeaderboard.slice(0, 10);
  const maxSales = Math.max(...top10Vendors.map(v => v.totalSalesKes), 1);
  const totalTop10Sales = top10Vendors.reduce((sum, v) => sum + v.totalSalesKes, 0);
  const totalTop10Deliveries = top10Vendors.reduce((sum, v) => sum + v.deliveredCount, 0);

  // CSV Report Generator
  const downloadReportCsv = (type: 'orders' | 'ledger' | 'tax' | 'vendor_insights') => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    if (type === 'orders') {
      csvContent += 'Order Number,Customer,Phone,County,SubOrders Count,Total KES,Payment Status,M-Pesa Receipt,Date\n';
      parentOrders.forEach(o => {
        csvContent += `"${o.orderNumber}","${o.customerName}","${o.customerPhone}","${o.deliveryAddress.county}",${o.subOrderIds.length},${o.totalAmountKes},"${o.paymentStatus}","${o.mpesaDetails?.mpesaReceiptNumber || 'N/A'}","${o.createdAt}"\n`;
      });
    } else if (type === 'vendor_insights') {
      csvContent += 'Rank,Vendor Name,County,Town,Total Sales KES,Delivered Orders,In-Transit Orders,Pending Orders,Fulfillment Rate %,Platform Commission KES,Rating\n';
      top10Vendors.forEach((item, idx) => {
        csvContent += `${idx + 1},"${item.vendor.name}","${item.vendor.county}","${item.vendor.town}",${item.totalSalesKes},${item.deliveredCount},${item.dispatchedCount},${item.pendingCount},${item.fulfillmentRate}%,${item.platformCommissionContributedKes},${item.vendor.rating}\n`;
      });
    } else if (type === 'tax') {
      csvContent += 'Vendor,Owner Email,M-Pesa Payout Number,Gross Earnings KES,Estimated 5% KRA Withholding Tax KES,Net Disbursed KES\n';
      vendors.forEach(v => {
        const gross = 50000; // Sample aggregated
        const wht = Math.round(gross * 0.05);
        csvContent += `"${v.name}","${v.ownerEmail}","${v.mpesaPayoutNumber}",${gross},${wht},${gross - wht}\n`;
      });
    } else {
      csvContent += 'Timestamp,Action,Actor,Role,Target Entity,Target ID,IP Address\n';
      auditLogs.forEach(l => {
        csvContent += `"${l.timestamp}","${l.action}","${l.actorName}","${l.actorRole}","${l.targetType}","${l.targetId}","${l.ipAddress}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SokoSalama_${type}_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify(`${type.toUpperCase()} CSV report downloaded.`);
  };

  // Filtered audit logs
  const filteredAuditLogs = auditLogs.filter(log => {
    const matchesAction = auditActionFilter === 'ALL' || log.action === auditActionFilter;
    const matchesSearch =
      !globalFilterText ||
      log.actorName.toLowerCase().includes(globalFilterText.toLowerCase()) ||
      log.targetId.toLowerCase().includes(globalFilterText.toLowerCase()) ||
      log.action.toLowerCase().includes(globalFilterText.toLowerCase());
    return matchesAction && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Platform Governance Header */}
      <div className="bg-neutral-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-md">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rose-500/20 border border-rose-500/30 rounded-lg">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              SokoSalama Platform Command Center
            </h1>
          </div>
          <p className="text-xs text-neutral-300 max-w-2xl leading-relaxed">
            Kenyan Escrow Middleman Governance · Multi-Tier Commissions · M-Pesa B2C Automated Disbursement · Immutable Audit
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Quick Auto-Release Cron Button */}
          <button
            onClick={handleTriggerAutoReleaseCron}
            disabled={autoReleaseLoading}
            className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 disabled:bg-neutral-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            title="Simulates running the 72-hour automated escrow release batch job"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${autoReleaseLoading ? 'animate-spin' : ''}`} />
            <span>{autoReleaseLoading ? 'Releasing...' : 'Run Escrow Auto-Release'}</span>
          </button>

          {/* Quick CSV Export */}
          <button
            onClick={() => downloadReportCsv('orders')}
            className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-neutral-400" />
            <span>Export Orders CSV</span>
          </button>

          <span className="text-[11px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2.5 py-1.5 rounded-lg flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Escrow Online</span>
          </span>
        </div>
      </div>

      {notification && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2.5 shadow-2xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span className="font-medium">{notification}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start">
        <aside className="rounded-2xl border border-neutral-200 bg-white/80 p-3 shadow-sm backdrop-blur-xl lg:sticky lg:top-24">
          <div className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400">Platform menu</div>
          <nav aria-label="Admin sections" className="flex gap-1 overflow-x-auto pb-1 text-xs font-semibold lg:flex-col lg:overflow-visible">
            {[
              { id: 'analytics', label: 'Financial Analytics' },
              { id: 'insights', label: 'Vendor Insights', icon: <Trophy className="h-4 w-4 text-amber-500" />, badge: 'Top 10', badgeClass: 'bg-amber-100 text-amber-900' },
              { id: 'disputes', label: 'Escrow Disputes', icon: <Scale className="h-4 w-4" />, badge: openDisputes.length || undefined, badgeClass: 'bg-rose-500 text-white' },
              { id: 'products', label: 'Product Approvals', badge: pendingProducts.length || undefined, badgeClass: 'bg-amber-500 text-neutral-950' },
              { id: 'hotdeals', label: 'Hot Deals & Timers', icon: <Flame className="h-4 w-4 text-amber-500" />, badge: activeHotDealsCount || undefined, badgeClass: 'bg-amber-500 text-neutral-950' },
              { id: 'vendors', label: 'Vendors & KYC', badge: pendingVendors.length || undefined, badgeClass: 'bg-rose-500 text-white' },
              { id: 'commissions', label: 'Multi-Tier Commissions' },
              { id: 'payouts', label: 'M-Pesa Payouts', badge: pendingPayouts.length || undefined, badgeClass: 'bg-emerald-600 text-white' },
              { id: 'zones', label: 'Delivery Zones' },
              { id: 'settings', label: 'Platform Settings', icon: <SettingsIcon className="h-4 w-4" /> },
              { id: 'audit', label: 'Audit Trail', badge: auditLogs.length, badgeClass: 'bg-neutral-200 text-neutral-700' },
            ].map((item) => (
              <button key={item.id} onClick={() => setAdminTab(item.id as typeof adminTab)} aria-current={adminTab === item.id ? 'page' : undefined}
                className={`flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition-colors lg:w-full ${adminTab === item.id ? 'bg-neutral-900 text-white shadow-sm' : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'}`}>
                {item.icon}
                <span className="flex-1 whitespace-nowrap">{item.label}</span>
                {item.badge !== undefined && <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${adminTab === item.id ? 'bg-white/15 text-white' : item.badgeClass}`}>{item.badge}</span>}
              </button>
            ))}
          </nav>
        </aside>

        <section className="min-w-0 space-y-5">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-neutral-400" />
            <input type="text" placeholder="Quick search tables..." value={globalFilterText} onChange={(e) => setGlobalFilterText(e.target.value)} className="w-full rounded-xl border border-neutral-200 bg-white/85 py-2 pl-9 pr-3 text-xs shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10" />
          </div>

      {/* ========================================================================= */}
      {/* TAB 1: FINANCIAL ANALYTICS & ESCROW HEALTH */}
      {/* ========================================================================= */}
      {adminTab === 'analytics' && (
        <div className="space-y-6">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-700">Platform overview</p><h2 className="mt-1 text-xl font-bold tracking-tight text-neutral-900">Financial analytics</h2><p className="mt-1 text-xs text-neutral-500">A live view of marketplace revenue, escrow exposure, and merchant activity.</p></div>
            <span className="mt-2 inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-800 sm:mt-0"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" /> Marketplace operating</span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            
            {/* Active Escrow Pool */}
            <div className="group relative overflow-hidden rounded-2xl border border-amber-200/80 bg-gradient-to-br from-white to-amber-50/70 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="mb-3 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
                <span>Active Escrow Pool</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-800"><Lock className="h-4 w-4" /></span>
              </div>
              <div className="text-2xl font-bold tracking-tight text-amber-950 tabular-nums sm:text-[26px]">
                KES {financialStats.totalEscrowLockedKes?.toLocaleString() || '0'}
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-[11px] text-neutral-500">
                <span className="text-amber-700 font-semibold">{settings.escrowInspectionHours}h</span>
                <span>auto-release window</span>
              </div>
            </div>

            {/* Platform Commissions Realized */}
            <div className="group relative overflow-hidden rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-white to-emerald-50/70 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="mb-3 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
                <span>Net Platform Revenue</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800"><DollarSign className="h-4 w-4" /></span>
              </div>
              <div className="text-2xl font-bold tracking-tight text-emerald-900 tabular-nums sm:text-[26px]">
                KES {financialStats.totalPlatformCommissionsKes?.toLocaleString() || '0'}
              </div>
              <div className="mt-2 text-[11px] text-neutral-500">
                Pending: KES {financialStats.pendingCommissionsInEscrowKes?.toLocaleString() || '0'}
              </div>
            </div>

            {/* Gross Merchandise Value (GMV) */}
            <div className="group relative overflow-hidden rounded-2xl border border-blue-200/80 bg-gradient-to-br from-white to-blue-50/70 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="mb-3 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
                <span>Gross Merchandise Value</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 text-blue-800"><TrendingUp className="h-4 w-4" /></span>
              </div>
              <div className="text-2xl font-bold tracking-tight text-neutral-900 tabular-nums sm:text-[26px]">
                KES {financialStats.grossMerchandiseValueKes?.toLocaleString() || '0'}
              </div>
              <div className="mt-2 text-[11px] text-neutral-500">
                Across {parentOrders.length} customer checkouts
              </div>
            </div>

            {/* Active Stores */}
            <div className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-gradient-to-br from-white to-neutral-50 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="mb-3 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
                <span>Registered Stores</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700"><Store className="h-4 w-4" /></span>
              </div>
              <div className="text-2xl font-bold tracking-tight text-neutral-900 tabular-nums sm:text-[26px]">
                {vendors.length}
              </div>
              <div className="mt-2 text-[11px] text-neutral-500">
                {financialStats.activeVendorsCount || 0} approved & KYC verified
              </div>
            </div>

          </div>

          {/* Escrow Liability Aging Breakdown */}
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-neutral-100 bg-gradient-to-r from-white to-neutral-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <h3 className="text-sm font-bold tracking-tight text-neutral-900">
                  Escrow Liability Aging & Fulfillment Health
                </h3>
                <p className="mt-1 text-xs text-neutral-500">
                  Buyer funds progression from M-Pesa capture to verified courier transit
                </p>
              </div>
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[11px] font-medium text-neutral-700">
                Total Locked: <strong className="text-neutral-900">KES {financialStats.totalEscrowLockedKes?.toLocaleString()}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-3 sm:p-5">
              <div className="relative overflow-hidden rounded-xl border border-amber-200 bg-amber-50/40 p-4">
                <div className="absolute inset-x-0 top-0 h-1 bg-amber-400" />
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-neutral-800">Fresh Capture (&lt; 24h)</span>
                  <span className="text-neutral-500 font-mono">Stage 1</span>
                </div>
                <div className="text-base font-bold text-neutral-900 tabular-nums">
                  KES {Math.round((financialStats.totalEscrowLockedKes || 0) * 0.4).toLocaleString()}
                </div>
                <p className="text-[10px] text-neutral-500 mt-1">Artisan packaging & courier dispatch in progress</p>
              </div>

              <div className="relative overflow-hidden rounded-xl border border-blue-200 bg-blue-50/40 p-4">
                <div className="absolute inset-x-0 top-0 h-1 bg-blue-400" />
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-neutral-800">In Transit (24 - 48h)</span>
                  <span className="text-neutral-500 font-mono">Stage 2</span>
                </div>
                <div className="text-base font-bold text-blue-900 tabular-nums">
                  KES {Math.round((financialStats.totalEscrowLockedKes || 0) * 0.35).toLocaleString()}
                </div>
                <p className="text-[10px] text-neutral-500 mt-1">Waybill active with Fargo / G4S Kenya</p>
              </div>

              <div className="relative overflow-hidden rounded-xl border border-emerald-200 bg-emerald-50/40 p-4">
                <div className="absolute inset-x-0 top-0 h-1 bg-emerald-400" />
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-neutral-800">Inspection Window (&gt; 48h)</span>
                  <span className="text-neutral-500 font-mono">Stage 3</span>
                </div>
                <div className="text-base font-bold text-emerald-900 tabular-nums">
                  KES {Math.round((financialStats.totalEscrowLockedKes || 0) * 0.25).toLocaleString()}
                </div>
                <p className="text-[10px] text-neutral-500 mt-1">Delivered; ready for automated release</p>
              </div>
            </div>
          </div>

          {/* Export Reports Action Bar */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h4 className="text-sm font-bold text-neutral-900">Statutory & Audit Exports</h4>
              <p className="mt-1 text-xs text-neutral-500">Download finance reports for KRA compliance and internal reconciliation.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => downloadReportCsv('orders')}
                className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Orders Master CSV</span>
              </button>
              <button
                onClick={() => downloadReportCsv('tax')}
                className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>KRA 5% WHT Withholding Tax Report</span>
              </button>
              <button
                onClick={() => downloadReportCsv('ledger')}
                className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Full Audit Trail CSV</span>
              </button>
            </div>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: VENDOR INSIGHTS & TOP 10 LEADERBOARD */}
      {/* ========================================================================= */}
      {adminTab === 'insights' && (
        <div className="space-y-6">
          {/* Header & Overview Card */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-2xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-100 rounded-lg text-amber-900">
                    <Trophy className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-neutral-900 tracking-tight">
                      Vendor Performance Leaderboard & Insights
                    </h2>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Live dynamic rankings across {vendors.length} Kenyan artisan stores based on verified sales volume (GMV) and courier fulfillment success.
                    </p>
                  </div>
                </div>
              </div>

              {/* Leaderboard Metric Controls & CSV Export */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="bg-neutral-100 p-1 rounded-lg flex items-center gap-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setLeaderboardSortMetric('overall')}
                    className={`px-3 py-1.5 rounded-md font-semibold cursor-pointer transition-colors ${
                      leaderboardSortMetric === 'overall'
                        ? 'bg-neutral-900 text-white shadow-2xs'
                        : 'text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    Overall Rank
                  </button>
                  <button
                    type="button"
                    onClick={() => setLeaderboardSortMetric('sales')}
                    className={`px-3 py-1.5 rounded-md font-semibold cursor-pointer transition-colors ${
                      leaderboardSortMetric === 'sales'
                        ? 'bg-neutral-900 text-white shadow-2xs'
                        : 'text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    Top Sales (KES)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLeaderboardSortMetric('deliveries')}
                    className={`px-3 py-1.5 rounded-md font-semibold cursor-pointer transition-colors ${
                      leaderboardSortMetric === 'deliveries'
                        ? 'bg-neutral-900 text-white shadow-2xs'
                        : 'text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    Most Deliveries
                  </button>
                  <button
                    type="button"
                    onClick={() => setLeaderboardSortMetric('fulfillmentRate')}
                    className={`px-3 py-1.5 rounded-md font-semibold cursor-pointer transition-colors ${
                      leaderboardSortMetric === 'fulfillmentRate'
                        ? 'bg-neutral-900 text-white shadow-2xs'
                        : 'text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    Fulfillment Rate
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => downloadReportCsv('vendor_insights')}
                  className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Export Leaderboard CSV</span>
                </button>
              </div>
            </div>

            {/* Quick KPI Summary Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-neutral-100 mt-6">
              <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/80">
                <div className="text-xs text-amber-900 font-medium flex items-center justify-between">
                  <span>Top Performing Vendor</span>
                  <Trophy className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-lg font-bold text-neutral-900 mt-1 truncate">
                  {top10Vendors[0]?.vendor.name || 'N/A'}
                </div>
                <div className="text-[11px] text-amber-800 font-semibold mt-1 tabular-nums">
                  KES {top10Vendors[0]?.totalSalesKes.toLocaleString()} · {top10Vendors[0]?.deliveredCount} deliveries
                </div>
              </div>

              <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200/80">
                <div className="text-xs text-emerald-900 font-medium flex items-center justify-between">
                  <span>Top 10 Aggregate GMV</span>
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-lg font-bold text-emerald-950 mt-1 tabular-nums">
                  KES {totalTop10Sales.toLocaleString()}
                </div>
                <div className="text-[11px] text-emerald-800 mt-1">
                  Verified customer checkout volume
                </div>
              </div>

              <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200/80">
                <div className="text-xs text-blue-900 font-medium flex items-center justify-between">
                  <span>Completed Deliveries</span>
                  <Truck className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-lg font-bold text-blue-950 mt-1 tabular-nums">
                  {totalTop10Deliveries} orders
                </div>
                <div className="text-[11px] text-blue-800 mt-1">
                  100% escrow verified releases
                </div>
              </div>

              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                <div className="text-xs text-neutral-600 font-medium flex items-center justify-between">
                  <span>Avg Fulfillment Reliability</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-lg font-bold text-neutral-900 mt-1 tabular-nums">
                  {top10Vendors.length > 0 
                    ? Math.round(top10Vendors.reduce((acc, v) => acc + v.fulfillmentRate, 0) / top10Vendors.length) 
                    : 100}%
                </div>
                <div className="text-[11px] text-neutral-500 mt-1">
                  Across tracked courier waybills
                </div>
              </div>
            </div>
          </div>

          {/* Top 3 Podium Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {top10Vendors.slice(0, 3).map((item, idx) => {
              const isGold = idx === 0;
              const isSilver = idx === 1;
              const isBronze = idx === 2;

              return (
                <div 
                  key={item.vendor.id} 
                  className={`rounded-xl border p-5 relative overflow-hidden shadow-2xs ${
                    isGold 
                      ? 'bg-linear-to-b from-amber-50 to-white border-amber-300 ring-2 ring-amber-400/40' 
                      : isSilver 
                      ? 'bg-linear-to-b from-neutral-50 to-white border-neutral-300' 
                      : 'bg-linear-to-b from-orange-50/50 to-white border-amber-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${
                      isGold 
                        ? 'bg-amber-400 text-neutral-950 shadow-2xs' 
                        : isSilver 
                        ? 'bg-neutral-300 text-neutral-900' 
                        : 'bg-amber-700 text-white'
                    }`}>
                      {isGold && <Trophy className="w-3.5 h-3.5" />}
                      {isSilver && <Award className="w-3.5 h-3.5" />}
                      {isBronze && <Award className="w-3.5 h-3.5" />}
                      <span>Rank #{idx + 1} {isGold ? 'Champion' : isSilver ? 'Runner-Up' : '3rd Place'}</span>
                    </span>

                    <span className="text-xs font-semibold text-neutral-700 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>{item.vendor.rating > 0 ? item.vendor.rating : '5.0'}</span>
                    </span>
                  </div>

                  <h3 className="font-bold text-neutral-900 text-sm">{item.vendor.name}</h3>
                  <div className="text-[11px] text-neutral-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-neutral-400" />
                    <span>{item.vendor.town}, {item.vendor.county} County</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-4 mt-4 border-t border-neutral-200/70 text-xs">
                    <div>
                      <span className="text-[11px] text-neutral-500 block">Total Sales</span>
                      <strong className="text-neutral-900 tabular-nums text-sm">
                        KES {item.totalSalesKes.toLocaleString()}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[11px] text-neutral-500 block">Successful Deliveries</span>
                      <strong className="text-emerald-700 tabular-nums text-sm flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{item.deliveredCount} orders</span>
                      </strong>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-600">
                    <span>Fulfillment Rate: <strong className="text-neutral-900 font-semibold">{item.fulfillmentRate}%</strong></span>
                    <button
                      type="button"
                      onClick={() => {
                        setCommissionModalVendor(item.vendor);
                        setVendorRateInput(item.vendor.commissionRatePercent || 10);
                        setVendorFixedFeeInput(item.vendor.customFixedFeeKes || 0);
                      }}
                      className="text-amber-900 hover:text-amber-800 font-semibold underline cursor-pointer"
                    >
                      Rate: {item.vendor.commissionRatePercent}%
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Full Top 10 Table */}
          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-2xs">
            <div className="p-4 bg-neutral-50 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <h3 className="font-bold text-neutral-900 uppercase tracking-wider">
                  Top 10 Vendor Standings & Operational Analytics
                </h3>
                <p className="text-[11px] text-neutral-500">
                  Sorted by: <strong className="text-neutral-800 capitalize">{leaderboardSortMetric.replace(/([A-Z])/g, ' $1')}</strong>
                </p>
              </div>
              <span className="text-neutral-500 font-mono text-[11px]">
                Active Catalog Stores ({vendors.length})
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-100/70 border-b border-neutral-200 text-[11px] text-neutral-600 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4 w-16 text-center">Rank</th>
                    <th className="py-3 px-4">Vendor / Merchant Store</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4 text-right">Total Sales (KES)</th>
                    <th className="py-3 px-4 text-center">Deliveries</th>
                    <th className="py-3 px-4 text-center">Fulfillment Rate</th>
                    <th className="py-3 px-4 text-right">Commission Earned</th>
                    <th className="py-3 px-4 text-center">KYC & Tier</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {top10Vendors.map((item, idx) => {
                    const rank = idx + 1;
                    const percentOfMax = Math.round((item.totalSalesKes / maxSales) * 100);

                    return (
                      <tr 
                        key={item.vendor.id} 
                        className={`hover:bg-neutral-50/70 transition-colors ${
                          rank === 1 ? 'bg-amber-50/30' : ''
                        }`}
                      >
                        {/* Rank Badge */}
                        <td className="py-3.5 px-4 text-center">
                          {rank === 1 ? (
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-400 text-neutral-950 font-bold shadow-2xs">
                              #1
                            </span>
                          ) : rank === 2 ? (
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-neutral-200 text-neutral-900 font-bold border border-neutral-300">
                              #2
                            </span>
                          ) : rank === 3 ? (
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-700 text-white font-bold">
                              #3
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-neutral-100 text-neutral-600 font-mono font-bold text-xs">
                              #{rank < 10 ? `0${rank}` : rank}
                            </span>
                          )}
                        </td>

                        {/* Store Info */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                            <span>{item.vendor.name}</span>
                            {item.vendor.rating > 0 && (
                              <span className="text-[10px] text-amber-700 bg-amber-50 px-1 rounded flex items-center gap-0.5">
                                ★ {item.vendor.rating}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-neutral-500 font-mono truncate max-w-xs">
                            {item.vendor.businessRegistrationNumber || item.vendor.id} · {item.vendor.phone}
                          </div>
                        </td>

                        {/* Location */}
                        <td className="py-3.5 px-4 text-neutral-600">
                          <div className="font-medium text-neutral-800">{item.vendor.town}</div>
                          <div className="text-[11px] text-neutral-500">{item.vendor.county} County</div>
                        </td>

                        {/* Total Sales (GMV) */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="font-bold text-neutral-900 tabular-nums">
                            KES {item.totalSalesKes.toLocaleString()}
                          </div>
                          <div className="w-24 bg-neutral-100 h-1.5 rounded-full ml-auto mt-1 overflow-hidden">
                            <div 
                              className="bg-amber-600 h-full rounded-full" 
                              style={{ width: `${percentOfMax}%` }} 
                            />
                          </div>
                        </td>

                        {/* Deliveries */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="inline-flex items-center gap-1 text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded text-xs tabular-nums">
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>{item.deliveredCount} delivered</span>
                          </div>
                          {item.dispatchedCount > 0 && (
                            <div className="text-[10px] text-blue-600 mt-0.5">
                              +{item.dispatchedCount} in transit
                            </div>
                          )}
                        </td>

                        {/* Fulfillment Success Rate */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${
                              item.fulfillmentRate >= 95 ? 'bg-emerald-500' : item.fulfillmentRate >= 80 ? 'bg-amber-500' : 'bg-rose-500'
                            }`} />
                            <span className="font-bold tabular-nums text-neutral-800">
                              {item.fulfillmentRate}%
                            </span>
                          </div>
                          <span className="text-[10px] text-neutral-400">
                            {item.totalOrdersCount} total orders
                          </span>
                        </td>

                        {/* Commission Earned */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="font-bold text-emerald-800 tabular-nums">
                            KES {item.platformCommissionContributedKes.toLocaleString()}
                          </div>
                          <div className="text-[10px] text-neutral-500">
                            Net: KES {item.totalEarningsKes.toLocaleString()}
                          </div>
                        </td>

                        {/* KYC & Commission Tier */}
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-block px-2 py-0.5 bg-neutral-100 text-neutral-800 font-medium rounded text-[11px]">
                            {item.vendor.commissionRatePercent || 10}% Commission
                          </span>
                          <div className="text-[10px] text-emerald-700 font-medium mt-0.5">
                            Verified KYC
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setCommissionModalVendor(item.vendor);
                              setVendorRateInput(item.vendor.commissionRatePercent || 10);
                              setVendorFixedFeeInput(item.vendor.customFixedFeeKes || 0);
                            }}
                            className="px-2.5 py-1 text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded font-medium cursor-pointer transition-colors"
                          >
                            Edit Rate
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Regional County Logistics & Escrow Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-2xs space-y-3">
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-700" />
                <span>County Performance Hubs</span>
              </h4>
              <p className="text-[11px] text-neutral-500">
                Top artisan store clusters contributing to marketplace liquidity
              </p>

              <div className="space-y-2 pt-1 text-xs">
                {[
                  { county: 'Nairobi', share: '38%', stores: 'Olkaria Leather, Kiko Attire, Kazuri Beads', gmv: 'KES 662,900' },
                  { county: 'Kajiado', share: '24%', stores: 'Kitengela Studio Glass', gmv: 'KES 285,000' },
                  { county: 'Nyeri & Mt. Kenya', share: '18%', stores: 'Highland Coffee Roasters', gmv: 'KES 168,000' },
                  { county: 'Coastal Belt (Mombasa/Lamu)', share: '12%', stores: 'Swahili Coast Woodcraft, Lamu Silversmiths', gmv: 'KES 225,000' },
                  { county: 'Rift Valley & Western', share: '8%', stores: 'Rift Valley Apiaries, Kericho Teas, Turkana Weavers', gmv: 'KES 236,100' },
                ].map((hub) => (
                  <div key={hub.county} className="p-2.5 bg-neutral-50 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="font-bold text-neutral-900">{hub.county}</span>
                      <p className="text-[10px] text-neutral-500 truncate max-w-xs">{hub.stores}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-neutral-900 tabular-nums">{hub.gmv}</span>
                      <span className="text-[10px] text-amber-800 font-semibold block">{hub.share} share</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-2xs space-y-3">
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-blue-700" />
                <span>Courier Logistics Network Efficiency</span>
              </h4>
              <p className="text-[11px] text-neutral-500">
                Partner courier delivery completion speeds & escrow clearance metrics
              </p>

              <div className="space-y-2 pt-1 text-xs">
                {[
                  { name: 'Fargo Courier Kenya', avgHours: '18 hrs', successRate: '98.5%', status: 'Primary Metro & Coast' },
                  { name: 'G4S Secure Logistics', avgHours: '24 hrs', successRate: '99.1%', status: 'High-Value Fragile / Jewelry' },
                  { name: 'Speedaf Express Kenya', avgHours: '28 hrs', successRate: '96.8%', status: 'Upcountry Highlands & Rift' },
                  { name: 'Postal Corporation of Kenya (EMS)', avgHours: '42 hrs', successRate: '95.2%', status: 'Northern Counties & Remote' },
                ].map((courier) => (
                  <div key={courier.name} className="p-2.5 bg-neutral-50 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="font-bold text-neutral-900">{courier.name}</span>
                      <p className="text-[10px] text-neutral-500">{courier.status}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-emerald-800">{courier.successRate}</span>
                      <span className="text-[10px] text-neutral-500 block">Avg: {courier.avgHours}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ESCROW DISPUTES & ARBITRATION CENTER */}
      {/* ========================================================================= */}
      {adminTab === 'disputes' && (
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-2xs space-y-4">
          <div className="p-4 bg-neutral-50 border-b border-neutral-200 flex justify-between items-center text-xs">
            <div>
              <span className="font-bold text-neutral-800 uppercase tracking-wider block">
                Escrow Dispute Arbitration Center ({disputes.length})
              </span>
              <span className="text-neutral-500">
                Platform arbitrates contested sub-orders before releasing or reversing locked funds
              </span>
            </div>
            <span className="text-xs text-neutral-500">
              Open: <strong className="text-rose-700">{openDisputes.length}</strong>
            </span>
          </div>

          <div className="p-4">
            {disputes.length === 0 ? (
              <div className="text-center py-12 text-neutral-500 text-xs">
                No active escrow disputes on the platform. All sub-orders fulfilled smoothly.
              </div>
            ) : (
              <div className="space-y-4">
                {disputes.map((disp) => (
                  <div key={disp.id} className="p-5 rounded-xl border border-neutral-200 bg-neutral-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-xs text-neutral-900">{disp.disputeNumber}</span>
                        <span className="text-neutral-300">·</span>
                        <span className="text-xs font-semibold text-neutral-700">Sub-Order: {disp.subOrderId}</span>
                        <span className="text-neutral-300">·</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          disp.status === 'opened' ? 'bg-rose-100 text-rose-800' : disp.status.includes('resolved') ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {disp.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>

                      <div className="text-xs text-neutral-800">
                        <strong>Reason:</strong> {disp.reason}
                      </div>

                      <p className="text-xs text-neutral-600 max-w-2xl leading-relaxed">
                        {disp.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-[11px] text-neutral-500 pt-1">
                        <span>Customer: <strong className="text-neutral-800">{disp.customerName}</strong> ({disp.customerPhone})</span>
                        <span>·</span>
                        <span>Vendor: <strong className="text-neutral-800">{disp.vendorName}</strong></span>
                        <span>·</span>
                        <span>Contested Escrow: <strong className="text-rose-700 tabular-nums">KES {disp.amountAtStakeKes.toLocaleString()}</strong></span>
                      </div>

                      {disp.adminResolutionNotes && (
                        <div className="p-2.5 bg-white border border-neutral-200 rounded text-[11px] text-neutral-700">
                          <strong className="text-neutral-900">Admin Resolution:</strong> {disp.adminResolutionNotes}
                        </div>
                      )}
                    </div>

                    <div className="md:w-48 text-right shrink-0">
                      {disp.status === 'opened' ? (
                        <button
                          onClick={() => {
                            setSelectedDispute(disp);
                            setDisputeNotes('');
                          }}
                          className="w-full py-2 px-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Scale className="w-3.5 h-3.5" />
                          <span>Arbitrate Dispute</span>
                        </button>
                      ) : (
                        <div className="text-xs text-emerald-700 font-semibold flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Resolved</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: PRODUCT APPROVALS & BULK MODERATION */}
      {/* ========================================================================= */}
      {adminTab === 'products' && (() => {
        const approvedProductsCount = products.filter(p => p.approvalStatus === 'approved').length;
        const rejectedProductsCount = products.filter(p => p.approvalStatus === 'rejected').length;
        const productCategories = Array.from(new Set(products.map(p => p.category)));

        const currentTabProducts = products.filter((p) => {
          if (productStatusFilter !== 'all' && p.approvalStatus !== productStatusFilter) return false;
          if (productCategoryFilter !== 'all' && p.category !== productCategoryFilter) return false;
          if (globalFilterText) {
            const q = globalFilterText.toLowerCase();
            const matchTitle = p.title.toLowerCase().includes(q);
            const matchSku = p.sku.toLowerCase().includes(q);
            const matchVendor = p.vendorName.toLowerCase().includes(q);
            if (!matchTitle && !matchSku && !matchVendor) return false;
          }
          return true;
        });

        const allFilteredSelected = currentTabProducts.length > 0 && currentTabProducts.every(p => selectedProductIds.includes(p.id));
        const someFilteredSelected = currentTabProducts.some(p => selectedProductIds.includes(p.id)) && !allFilteredSelected;

        return (
          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-2xs">
            {/* Header & Sub-Navigation */}
            <div className="p-4 bg-neutral-50 border-b border-neutral-200 flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs">
              <div>
                <h3 className="font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
                  <span>Product Moderation & Compliance Engine</span>
                  {pendingProducts.length > 0 && (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-900 font-bold rounded-full text-[10px]">
                      {pendingProducts.length} Pending Approval
                    </span>
                  )}
                </h3>
                <p className="text-neutral-500 text-[11px] mt-0.5">
                  Review submitted products across all categories and brands. Only approved listings are published to buyer catalog.
                </p>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1 bg-white p-1 rounded-lg border border-neutral-200">
                <button
                  type="button"
                  onClick={() => setProductStatusFilter('all')}
                  className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                    productStatusFilter === 'all'
                      ? 'bg-neutral-900 text-white shadow-2xs'
                      : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  All ({products.length})
                </button>
                <button
                  type="button"
                  onClick={() => setProductStatusFilter('submitted')}
                  className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition-colors flex items-center gap-1.5 ${
                    productStatusFilter === 'submitted'
                      ? 'bg-amber-700 text-white shadow-2xs'
                      : 'text-amber-800 hover:bg-amber-50'
                  }`}
                >
                  <span>Pending</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    productStatusFilter === 'submitted' ? 'bg-amber-900 text-white' : 'bg-amber-100 text-amber-900'
                  }`}>
                    {pendingProducts.length}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setProductStatusFilter('approved')}
                  className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                    productStatusFilter === 'approved'
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  Approved ({approvedProductsCount})
                </button>
                <button
                  type="button"
                  onClick={() => setProductStatusFilter('rejected')}
                  className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                    productStatusFilter === 'rejected'
                      ? 'bg-rose-700 text-white shadow-2xs'
                      : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  Rejected ({rejectedProductsCount})
                </button>
              </div>
            </div>

            {/* Category Filter & Quick Actions Sub-bar */}
            <div className="px-4 py-2.5 bg-neutral-100/60 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-neutral-500 font-medium text-[11px] flex items-center gap-1">
                  <Filter className="w-3 h-3" />
                  Category:
                </span>
                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="bg-white border border-neutral-200 rounded px-2 py-1 text-xs text-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                >
                  <option value="all">All Categories ({products.length})</option>
                  {productCategories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {pendingProducts.length > 0 && (
                <button
                  type="button"
                  onClick={handleSelectOnlyPending}
                  className="text-[11px] text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1 rounded font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Layers className="w-3 h-3 text-amber-700" />
                  <span>Select all {pendingProducts.length} pending review</span>
                </button>
              )}
            </div>

            {/* BULK ACTION TOOLBAR (Sticky when items selected) */}
            <div className={`transition-all duration-200 border-b ${
              selectedProductIds.length > 0 
                ? 'bg-neutral-900 text-white border-neutral-900 px-4 py-3 shadow-md' 
                : 'bg-white border-neutral-200 px-4 py-2.5'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                
                {/* Select All Checkbox & Count */}
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={allFilteredSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = someFilteredSelected;
                      }}
                      onChange={() => handleSelectAllFiltered(currentTabProducts)}
                      className="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 cursor-pointer"
                    />
                    <span className={selectedProductIds.length > 0 ? 'text-neutral-200 font-medium' : 'text-neutral-700 font-medium'}>
                      {allFilteredSelected ? 'Deselect visible' : `Select visible (${currentTabProducts.length})`}
                    </span>
                  </label>

                  {selectedProductIds.length > 0 && (
                    <div className="flex items-center gap-2 border-l border-neutral-700 pl-3">
                      <span className="bg-amber-400 text-neutral-950 font-bold px-2 py-0.5 rounded text-[11px] tabular-nums">
                        {selectedProductIds.length}
                      </span>
                      <span className="text-neutral-200 text-xs font-semibold">
                        item{selectedProductIds.length > 1 ? 's' : ''} selected
                      </span>
                      <button
                        type="button"
                        onClick={handleClearSelection}
                        className="text-neutral-400 hover:text-white underline text-[11px] ml-1 cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>

                {/* Bulk Action Buttons */}
                {selectedProductIds.length > 0 ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={bulkActionLoading}
                      onClick={handleBulkApprove}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs disabled:opacity-50"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>
                        {bulkActionLoading ? 'Processing...' : `Approve & Publish Selected (${selectedProductIds.length})`}
                      </span>
                    </button>

                    <button
                      type="button"
                      disabled={bulkActionLoading}
                      onClick={() => setShowBulkRejectModal(true)}
                      className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white rounded font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs disabled:opacity-50"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>
                        Reject Selected ({selectedProductIds.length})
                      </span>
                    </button>
                  </div>
                ) : (
                  <div className="text-[11px] text-neutral-500 flex items-center gap-1">
                    <span>Showing {currentTabProducts.length} of {products.length} products</span>
                  </div>
                )}
              </div>
            </div>

            {/* Products List */}
            {currentTabProducts.length === 0 ? (
              <div className="p-12 text-center text-neutral-500 text-xs">
                <Package className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                <p className="font-semibold text-neutral-800">No products match this filter.</p>
                <p className="text-[11px] text-neutral-400 mt-1">Try switching status tabs or clearing your search criteria.</p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-200">
                {currentTabProducts.map((p) => {
                  const isSelected = selectedProductIds.includes(p.id);

                  return (
                    <div 
                      key={p.id} 
                      className={`p-4 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        isSelected ? 'bg-amber-50/70 border-l-4 border-amber-600' : 'hover:bg-neutral-50/60'
                      }`}
                    >
                      <div className="flex items-start gap-3.5 flex-1 min-w-0">
                        {/* Row Selection Checkbox */}
                        <div className="pt-1 shrink-0">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleProduct(p.id)}
                            className="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 cursor-pointer"
                            aria-label={`Select ${p.title}`}
                          />
                        </div>

                        {/* Image */}
                        <img
                          src={p.images[0]}
                          alt={p.title}
                          className="w-16 h-16 object-cover rounded bg-neutral-100 shrink-0 border border-neutral-200"
                        />

                        {/* Content */}
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-xs font-bold text-neutral-900 truncate">{p.title}</h4>
                            <span className="text-neutral-300">·</span>
                            <span className="text-amber-900 font-medium text-xs">{p.vendorName}</span>
                            <span className="text-neutral-300">·</span>
                            <span className="text-neutral-500 text-xs font-mono">{p.sku}</span>
                          </div>

                          <p className="text-xs text-neutral-600 line-clamp-1 max-w-2xl">{p.description}</p>

                          <div className="text-[11px] text-neutral-500 flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span>Category: <strong className="text-neutral-800">{p.category}</strong></span>
                            <span>·</span>
                            <span>Price: <strong className="tabular-nums text-neutral-900 font-semibold">KES {p.priceKes.toLocaleString()}</strong></span>
                            <span>·</span>
                            <span>Inventory: <strong className="tabular-nums text-neutral-900">{p.stockQuantity} units</strong></span>
                            <span>·</span>
                            <span>
                              Status: <strong className={
                                p.approvalStatus === 'approved' 
                                  ? 'text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-bold' 
                                  : p.approvalStatus === 'submitted' 
                                  ? 'text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded font-bold' 
                                  : 'text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded font-bold'
                              }>
                                {p.approvalStatus.toUpperCase()}
                              </strong>
                            </span>
                          </div>

                          {p.rejectionReason && (
                            <div className="mt-1.5 p-2 bg-rose-50 border border-rose-200 rounded text-[11px] text-rose-800 flex items-start gap-1.5">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-600 mt-0.5" />
                              <div>
                                <strong className="font-semibold">Rejection note:</strong> {p.rejectionReason}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Single Action Buttons */}
                      <div className="flex items-center gap-2 shrink-0 self-end md:self-center pl-7 md:pl-0">
                        {p.approvalStatus === 'submitted' ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleProductAction(p.id, true)}
                              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleProductAction(p.id, false, 'Declined single product review')}
                              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          </>
                        ) : p.approvalStatus === 'approved' ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenCreateHotDealModal(p.id)}
                              className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                              title="Promote this product to a live countdown Hot Deal"
                            >
                              <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                              <span>Set Hot Deal</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleProductAction(p.id, false, 'Suspended by admin')}
                              className="px-3 py-1 bg-neutral-100 hover:bg-rose-50 text-neutral-600 hover:text-rose-700 border border-neutral-200 hover:border-rose-200 rounded text-xs font-medium cursor-pointer transition-colors"
                            >
                              Suspend Listing
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleProductAction(p.id, true)}
                            className="px-3 py-1 bg-neutral-100 hover:bg-emerald-50 text-neutral-600 hover:text-emerald-700 border border-neutral-200 hover:border-emerald-200 rounded text-xs font-medium cursor-pointer transition-colors"
                          >
                            Re-Approve
                          </button>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* TAB 4: VENDORS & KYC MANAGEMENT */}
      {/* ========================================================================= */}
      {adminTab === 'vendors' && (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
            <div className="bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-800 px-5 py-5 text-white sm:px-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-300"><ShieldCheck className="h-4 w-4" /> Merchant operations</div>
                  <h2 className="mt-2 text-lg font-bold tracking-tight sm:text-xl">Vendors &amp; KYC</h2>
                  <p className="mt-1 text-xs text-neutral-300">Review merchant verification, payout details, and negotiated commission rates.</p>
                </div>
                <div className="grid grid-cols-3 gap-2 sm:min-w-[330px]">
                  {[
                    { label: 'All stores', value: vendors.length, tint: 'text-white' },
                    { label: 'Approved', value: vendors.filter((vendor) => vendor.status === 'approved').length, tint: 'text-emerald-300' },
                    { label: 'Needs review', value: vendors.filter((vendor) => vendor.status === 'pending').length, tint: 'text-amber-300' },
                  ].map((stat) => <div key={stat.label} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5"><div className={`text-lg font-bold tabular-nums ${stat.tint}`}>{stat.value}</div><div className="mt-0.5 text-[10px] text-neutral-400">{stat.label}</div></div>)}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 bg-neutral-50/80 px-5 py-3 text-[11px] sm:px-6">
              <span className="font-semibold text-neutral-700">Independent Kenyan stores</span>
              <div className="flex flex-wrap items-center gap-2"><span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-medium text-emerald-800"><ShieldCheck className="h-3.5 w-3.5" /> Tenant data isolated</span><button type="button" onClick={() => { setVendorFormError(''); setShowAddVendorModal(true); }} className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3 py-2 text-[11px] font-semibold text-white shadow-sm transition hover:bg-neutral-800"><Plus className="h-3.5 w-3.5" /> Add vendor</button></div>
            </div>
            <div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-3 sm:p-5">
              {vendors.map((v) => <button key={v.id} type="button" onClick={() => setSelectedVendor(v)} className="group rounded-2xl border border-neutral-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500">
                <div className="flex items-start justify-between gap-2"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-800"><Store className="h-5 w-5" /></span><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${v.status === 'approved' ? 'bg-emerald-50 text-emerald-700' : v.status === 'pending' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'}`}><span className={`h-1.5 w-1.5 rounded-full ${v.status === 'approved' ? 'bg-emerald-500' : v.status === 'pending' ? 'bg-amber-500' : 'bg-rose-500'}`} />{v.status}</span></div>
                <div className="mt-4 truncate text-sm font-bold text-neutral-900 group-hover:text-amber-900">{v.name}</div><div className="mt-1 truncate text-[11px] text-neutral-500">{v.ownerEmail}</div>
                <div className="mt-4 grid grid-cols-2 gap-3 border-t border-neutral-100 pt-3 text-[11px]"><div><div className="text-neutral-400">Location</div><div className="mt-0.5 truncate font-medium text-neutral-700">{v.town}, {v.county}</div></div><div><div className="text-neutral-400">Commission</div><div className="mt-0.5 font-semibold text-amber-800">{v.commissionRatePercent || 10}%{v.customFixedFeeKes ? ` + KES ${v.customFixedFeeKes}` : ''}</div></div></div>
                <div className="mt-3 flex items-center justify-between text-[10px] text-neutral-500"><span className="truncate">{v.businessRegistrationNumber || 'Registration pending'}</span><span className="shrink-0 font-semibold text-amber-800">View details →</span></div>
              </button>)}
              {vendors.length === 0 && <div className="col-span-full rounded-2xl border border-dashed border-neutral-300 p-10 text-center text-sm text-neutral-500">No vendors yet. Add a vendor to get started.</div>}
            </div>
          </div>
        </div>
      )}
      {selectedVendor && <div className="fixed inset-0 z-[90] flex items-end justify-center bg-neutral-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-5" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedVendor(null); }}>
        <section role="dialog" aria-modal="true" aria-labelledby="vendor-detail-title" className="w-full max-w-xl overflow-hidden rounded-t-3xl border border-white/70 bg-white shadow-2xl sm:rounded-3xl">
          <div className="flex items-start justify-between bg-neutral-950 px-5 py-5 text-white sm:px-6"><div><div className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-300">Vendor profile</div><h2 id="vendor-detail-title" className="mt-1 text-lg font-bold">{selectedVendor.name}</h2><p className="mt-1 text-xs text-neutral-300">{selectedVendor.ownerEmail}</p></div><button type="button" onClick={() => setSelectedVendor(null)} className="rounded-lg p-2 text-neutral-300 hover:bg-white/10 hover:text-white" aria-label="Close vendor details"><XCircle className="h-5 w-5" /></button></div>
          <div className="grid grid-cols-2 gap-3 p-5 sm:p-6">
            {[['Location', `${selectedVendor.town}, ${selectedVendor.county}`], ['Phone', selectedVendor.phone || 'Not provided'], ['M-Pesa payout', selectedVendor.mpesaPayoutNumber || 'Not provided'], ['Business registration', selectedVendor.businessRegistrationNumber || 'Registration pending'], ['Commission', `${selectedVendor.commissionRatePercent || 10}%${selectedVendor.customFixedFeeKes ? ` + KES ${selectedVendor.customFixedFeeKes}` : ''}`], ['Joined', new Date(selectedVendor.joinedAt).toLocaleDateString()]].map(([label, value]) => <div key={label} className="rounded-xl border border-neutral-100 bg-neutral-50 p-3"><div className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400">{label}</div><div className="mt-1 break-words text-sm font-medium text-neutral-800">{value}</div></div>)}
            <div className="col-span-2 rounded-xl border border-neutral-100 p-3"><div className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400">Store description</div><p className="mt-1 text-sm leading-relaxed text-neutral-700">{selectedVendor.bio || 'No description provided.'}</p></div>
          </div>
          <div className="flex flex-wrap justify-end gap-2 border-t border-neutral-100 bg-neutral-50 p-4">
            <button type="button" onClick={() => { setCommissionModalVendor(selectedVendor); setVendorRateInput(selectedVendor.commissionRatePercent || 10); setVendorFixedFeeInput(selectedVendor.customFixedFeeKes || 0); setSelectedVendor(null); }} className="rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-100">Edit commission</button>
            {selectedVendor.status === 'pending' ? <button type="button" onClick={async () => { await handleVendorAction(selectedVendor.id, 'approved'); setSelectedVendor(null); }} className="rounded-xl bg-emerald-700 px-3.5 py-2.5 text-xs font-semibold text-white hover:bg-emerald-800">Approve KYC</button> : selectedVendor.status === 'approved' ? <button type="button" onClick={async () => { await handleVendorAction(selectedVendor.id, 'suspended'); setSelectedVendor(null); }} className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-semibold text-rose-700 hover:bg-rose-100">Suspend store</button> : <button type="button" onClick={async () => { await handleVendorAction(selectedVendor.id, 'approved'); setSelectedVendor(null); }} className="rounded-xl bg-emerald-700 px-3.5 py-2.5 text-xs font-semibold text-white hover:bg-emerald-800">Reactivate store</button>}
          </div>
        </section>
      </div>}
      {showAddVendorModal && <div className="fixed inset-0 z-[90] flex items-end justify-center bg-neutral-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-5" onMouseDown={(event) => { if (event.target === event.currentTarget && !addingVendor) setShowAddVendorModal(false); }}>
        <form onSubmit={handleCreateVendor} className="max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-white/70 bg-white shadow-2xl sm:rounded-3xl">
          <div className="sticky top-0 z-10 flex items-start justify-between border-b border-neutral-100 bg-white/95 px-5 py-4 backdrop-blur sm:px-6"><div><div className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-700">Merchant onboarding</div><h2 className="mt-1 text-lg font-bold text-neutral-900">Add a vendor</h2><p className="mt-1 text-xs text-neutral-500">Create a store profile and payout record for a new merchant.</p></div><button type="button" onClick={() => setShowAddVendorModal(false)} className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900" aria-label="Close add vendor form"><XCircle className="h-5 w-5" /></button></div>
          <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
            {([
              ['storeName', 'Store name', 'text'], ['ownerName', 'Owner full name', 'text'], ['email', 'Owner email', 'email'], ['phone', 'Phone number', 'tel'], ['county', 'County', 'text'], ['town', 'Town', 'text'], ['mpesaPayoutNumber', 'M-Pesa payout number', 'tel'], ['businessRegistrationNumber', 'Business registration number', 'text'],
            ] as const).map(([key, label, type]) => <label key={key} className="block"><span className="mb-1.5 block text-xs font-semibold text-neutral-700">{label}{key !== 'businessRegistrationNumber' && <span className="text-rose-600"> *</span>}</span><input type={type} required={key !== 'businessRegistrationNumber'} value={newVendor[key]} onChange={(event) => setNewVendor((previous) => ({ ...previous, [key]: event.target.value }))} className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100" /></label>)}
            <label className="block sm:col-span-2"><span className="mb-1.5 block text-xs font-semibold text-neutral-700">Store description</span><textarea rows={3} value={newVendor.bio} onChange={(event) => setNewVendor((previous) => ({ ...previous, bio: event.target.value }))} className="w-full resize-y rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100" placeholder="What does this store sell?" /></label>
            {vendorFormError && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 sm:col-span-2">{vendorFormError}</div>}
          </div>
          <div className="sticky bottom-0 flex justify-end gap-2 border-t border-neutral-100 bg-white/95 p-4 backdrop-blur"><button type="button" disabled={addingVendor} onClick={() => setShowAddVendorModal(false)} className="rounded-xl border border-neutral-200 px-4 py-2.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50">Cancel</button><button type="submit" disabled={addingVendor} className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-neutral-800 disabled:opacity-60"><Plus className="h-4 w-4" />{addingVendor ? 'Adding vendor…' : 'Add vendor'}</button></div>
        </form>
      </div>}
      {/* TAB 5: MULTI-TIER COMMISSIONS */}
      {/* ========================================================================= */}
      {adminTab === 'commissions' && (
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-2xs space-y-4">
          <div className="p-4 bg-neutral-50 border-b border-neutral-200 flex justify-between items-center text-xs">
            <div>
              <span className="font-bold text-neutral-800 uppercase tracking-wider block">
                Multi-Tier Commission Rules Engine
              </span>
              <span className="text-neutral-500">
                Evaluation: 1. Vendor Specific Override &rarr; 2. Category Rule &rarr; 3. Global Baseline
              </span>
            </div>
            <button
              onClick={() => setShowAddRuleModal(true)}
              className="px-3 py-1 bg-neutral-900 hover:bg-neutral-800 text-white rounded text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Tier Rule</span>
            </button>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {commissionRules.map((rule) => (
                <div key={rule.id} className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-neutral-900 text-xs">{rule.name}</span>
                      <span className="text-[10px] font-mono bg-neutral-200 px-1.5 py-0.2 rounded text-neutral-700">
                        {rule.type.toUpperCase()}
                      </span>
                    </div>
                    {rule.targetCategory && (
                      <div className="text-[11px] text-neutral-500">Category: {rule.targetCategory}</div>
                    )}
                    {rule.targetVendorId && (
                      <div className="text-[11px] text-neutral-500">Vendor ID: {rule.targetVendorId}</div>
                    )}
                    <div className="text-[11px] text-neutral-400 mt-1">
                      Updated: {new Date(rule.updatedAt).toLocaleDateString('en-KE')}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-bold text-neutral-900 tabular-nums">
                      {rule.ratePercent}%
                    </div>
                    {rule.fixedFeeKes > 0 && (
                      <div className="text-[11px] text-neutral-500">
                        + KES {rule.fixedFeeKes} fixed
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: M-PESA B2C PAYOUTS */}
      {/* ========================================================================= */}
      {adminTab === 'payouts' && (
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-2xs">
          <div className="p-4 bg-neutral-50 border-b border-neutral-200 flex justify-between items-center text-xs">
            <span className="font-bold text-neutral-800 uppercase tracking-wider">
              Vendor M-Pesa B2C Payout Disbursements Queue ({pendingPayouts.length} pending)
            </span>
            <span className="text-neutral-500">
              Disburses directly from escrow to vendor Safaricom handset
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50/50 text-neutral-500 border-b border-neutral-200">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Payout ID</th>
                  <th className="py-2.5 px-4 font-semibold">Vendor</th>
                  <th className="py-2.5 px-4 font-semibold">Amount (KES)</th>
                  <th className="py-2.5 px-4 font-semibold">Target Phone</th>
                  <th className="py-2.5 px-4 font-semibold">Status</th>
                  <th className="py-2.5 px-4 font-semibold">Requested At</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {payouts.map((pay) => (
                  <tr key={pay.id} className="hover:bg-neutral-50">
                    <td className="py-3 px-4 font-mono font-bold text-neutral-900">{pay.payoutNumber}</td>
                    <td className="py-3 px-4 font-semibold">{pay.vendorName}</td>
                    <td className="py-3 px-4 font-bold tabular-nums text-neutral-900">
                      KES {pay.amountKes.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-mono">{pay.destinationMpesaNumber}</td>
                    <td className="py-3 px-4">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                        pay.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700'
                          : pay.status === 'requested'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}>
                        {pay.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-neutral-500">
                      {new Date(pay.requestedAt).toLocaleString('en-KE')}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {pay.status === 'requested' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handlePayoutAction(pay.id, true)}
                            className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[11px] font-semibold cursor-pointer"
                          >
                            Disburse B2C
                          </button>
                          <button
                            onClick={() => handlePayoutAction(pay.id, false)}
                            className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-[11px] font-semibold cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="font-mono text-[11px] text-neutral-500">
                          {pay.b2cReceiptNumber || 'Resolved'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: DELIVERY ZONES & FEES */}
      {/* ========================================================================= */}
      {adminTab === 'zones' && (
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-2xs space-y-4">
          <div className="p-4 bg-neutral-50 border-b border-neutral-200 flex justify-between items-center text-xs">
            <div>
              <span className="font-bold text-neutral-800 uppercase tracking-wider block">
                Kenya Courier Delivery Zones & Pricing Hierarchy
              </span>
              <span className="text-neutral-500">Counties &rarr; Towns &rarr; Delivery Zones</span>
            </div>
            <button
              onClick={() => {
                setEditingZoneId(null);
                setZoneCounty('Nairobi');
                setZoneName('');
                setZoneTownsText('');
                setZoneFee(350);
                setZoneHours('Within 24 Hours');
                setShowZoneModal(true);
              }}
              className="px-3 py-1 bg-neutral-900 hover:bg-neutral-800 text-white rounded text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Delivery Zone</span>
            </button>
          </div>

          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {deliveryZones.map((z) => (
              <div key={z.id} className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-neutral-900 text-xs">{z.name}</span>
                    <span className="text-[11px] font-semibold bg-white border border-neutral-200 px-2 py-0.5 rounded text-neutral-800 tabular-nums">
                      KES {z.feeKes}
                    </span>
                  </div>
                  <div className="text-[11px] text-amber-800 font-semibold mb-1">
                    County: {z.county}
                  </div>
                  <div className="text-xs text-neutral-600 mb-2">
                    Est. Transit: {z.estimatedDeliveryHours}
                  </div>
                  <div className="text-[11px] text-neutral-500 mb-3">
                    Towns Covered: {z.towns.join(', ')}
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-200 flex items-center justify-end gap-2 text-xs">
                  <button
                    onClick={() => {
                      setEditingZoneId(z.id);
                      setZoneCounty(z.county);
                      setZoneName(z.name);
                      setZoneTownsText(z.towns.join(', '));
                      setZoneFee(z.feeKes);
                      setZoneHours(z.estimatedDeliveryHours);
                      setShowZoneModal(true);
                    }}
                    className="p-1 text-neutral-500 hover:text-neutral-900 cursor-pointer"
                    title="Edit zone"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteZone(z.id)}
                    className="p-1 text-neutral-400 hover:text-rose-600 cursor-pointer"
                    title="Delete zone"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 8: PLATFORM SETTINGS & M-PESA DARAJA CONFIGURATION */}
      {/* ========================================================================= */}
      {adminTab === 'settings' && <AdminSettings settings={settings} deliveryZones={deliveryZones} onSave={onUpdateSettings} onOpenRoute={(route) => setAdminTab(route)} />}

      {false && adminTab === 'settings' && (
        <form onSubmit={handleSaveSettingsSubmit} className="space-y-6">
          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-2xs">
            <div className="p-4 bg-neutral-50 border-b border-neutral-200 flex justify-between items-center text-xs">
              <div>
                <span className="font-bold text-neutral-800 uppercase tracking-wider block">
                  Platform Escrow & Security Parameters
                </span>
                <span className="text-neutral-500">
                  Global escrow thresholds, Safaricom Daraja API credentials, and SMS notifications
                </span>
              </div>
              <button
                type="submit"
                disabled={settingsSaving}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Check className="w-4 h-4" />
                <span>{settingsSaving ? 'Saving...' : 'Save Configuration'}</span>
              </button>
            </div>

            <div className="p-6 space-y-6">
              
              {/* Section 1: Escrow & Payout Rules */}
              <div>
                <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-4 pb-2 border-b border-neutral-100 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-700" />
                  <span>1. Escrow Release & Payout Rules</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                      Inspection Auto-Release Period (Hours)
                    </label>
                    <input
                      type="number"
                      min={12}
                      max={168}
                      value={settingsForm.escrowInspectionHours}
                      onChange={(e) => setSettingsForm({ ...settingsForm, escrowInspectionHours: Number(e.target.value) })}
                      className="w-full text-xs p-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    />
                    <span className="text-[10px] text-neutral-400 mt-1 block">Default: 72 hours after marked delivered</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                      Minimum Vendor Payout Threshold (KES)
                    </label>
                    <input
                      type="number"
                      min={100}
                      value={settingsForm.minimumPayoutThresholdKes}
                      onChange={(e) => setSettingsForm({ ...settingsForm, minimumPayoutThresholdKes: Number(e.target.value) })}
                      className="w-full text-xs p-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    />
                    <span className="text-[10px] text-neutral-400 mt-1 block">Min wallet balance required to withdraw</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                      Instant Auto-Approve B2C Cap (KES)
                    </label>
                    <input
                      type="number"
                      min={1000}
                      value={settingsForm.autoApprovePayoutUnderKes}
                      onChange={(e) => setSettingsForm({ ...settingsForm, autoApprovePayoutUnderKes: Number(e.target.value) })}
                      className="w-full text-xs p-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    />
                    <span className="text-[10px] text-neutral-400 mt-1 block">Disburses immediately without manual admin review</span>
                  </div>
                </div>
              </div>

              {/* Section 2: Safaricom Daraja M-Pesa API */}
              <div>
                <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-4 pb-2 border-b border-neutral-100 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-700" />
                  <span>2. Safaricom Daraja API Gateway</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                      Daraja Environment
                    </label>
                    <select
                      value={settingsForm.darajaEnvironment}
                      onChange={(e: any) => setSettingsForm({ ...settingsForm, darajaEnvironment: e.target.value })}
                      className="w-full text-xs p-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-white"
                    >
                      <option value="sandbox">Sandbox Test Bed</option>
                      <option value="production">Production (api.safaricom.co.ke)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                      Paybill / Escrow Account
                    </label>
                    <input
                      type="text"
                      value={settingsForm.darajaPaybillNumber}
                      onChange={(e) => setSettingsForm({ ...settingsForm, darajaPaybillNumber: e.target.value })}
                      className="w-full text-xs p-2.5 border border-neutral-300 rounded-lg font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                      Business Shortcode
                    </label>
                    <input
                      type="text"
                      value={settingsForm.darajaShortcode}
                      onChange={(e) => setSettingsForm({ ...settingsForm, darajaShortcode: e.target.value })}
                      className="w-full text-xs p-2.5 border border-neutral-300 rounded-lg font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                      Consumer Key (Masked)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.darajaConsumerKeyMasked}
                      onChange={(e) => setSettingsForm({ ...settingsForm, darajaConsumerKeyMasked: e.target.value })}
                      className="w-full text-xs p-2.5 border border-neutral-300 rounded-lg font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: SMS Gateway & Tax Policy */}
              <div>
                <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-4 pb-2 border-b border-neutral-100 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-neutral-700" />
                  <span>3. Kenya Tax Compliance & System Controls</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-start gap-3 p-3.5 bg-neutral-50 rounded-lg border border-neutral-200">
                    <input
                      type="checkbox"
                      id="kraTax"
                      checked={settingsForm.kraWithholdingTaxEnabled}
                      onChange={(e) => setSettingsForm({ ...settingsForm, kraWithholdingTaxEnabled: e.target.checked })}
                      className="mt-0.5 h-4 w-4 rounded text-neutral-900 cursor-pointer"
                    />
                    <label htmlFor="kraTax" className="text-xs text-neutral-800 cursor-pointer">
                      <strong className="block text-neutral-900">Kenya KRA 5% WHT Withholding</strong>
                      <span className="text-[11px] text-neutral-500">Calculate 5% digital withholding tax reports for marketplace disbursements.</span>
                    </label>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 bg-neutral-50 rounded-lg border border-neutral-200">
                    <input
                      type="checkbox"
                      id="maintenance"
                      checked={settingsForm.maintenanceMode}
                      onChange={(e) => setSettingsForm({ ...settingsForm, maintenanceMode: e.target.checked })}
                      className="mt-0.5 h-4 w-4 rounded text-neutral-900 cursor-pointer"
                    />
                    <label htmlFor="maintenance" className="text-xs text-neutral-800 cursor-pointer">
                      <strong className="block text-neutral-900">Platform Maintenance Mode</strong>
                      <span className="text-[11px] text-neutral-500">Prevent new checkouts while preserving ongoing order fulfillment.</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                      SMS Gateway Provider & Sender ID
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={settingsForm.smsGatewayProvider}
                        onChange={(e: any) => setSettingsForm({ ...settingsForm, smsGatewayProvider: e.target.value })}
                        className="text-xs p-2 border border-neutral-300 rounded-lg bg-white"
                      >
                        <option value="AfricasTalking">AfricasTalking</option>
                        <option value="Infobip">Infobip</option>
                        <option value="Twilio">Twilio</option>
                      </select>
                      <input
                        type="text"
                        value={settingsForm.smsSenderId}
                        onChange={(e) => setSettingsForm({ ...settingsForm, smsSenderId: e.target.value })}
                        className="text-xs p-2 border border-neutral-300 rounded-lg font-mono flex-1"
                        placeholder="Sender ID (e.g. SOKOSALAMA)"
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* TAB 9: IMMUTABLE AUDIT TRAIL */}
      {/* ========================================================================= */}
      {adminTab === 'audit' && (
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-2xs space-y-4">
          <div className="p-4 bg-neutral-50 border-b border-neutral-200 flex flex-wrap justify-between items-center gap-4 text-xs">
            <div>
              <span className="font-bold text-neutral-800 uppercase tracking-wider block">
                Immutable System Audit Trail ({filteredAuditLogs.length})
              </span>
              <span className="text-neutral-500 font-mono text-[11px]">
                Cryptographically verifiable event log with actor IP & payload tracking
              </span>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={auditActionFilter}
                onChange={(e) => setAuditActionFilter(e.target.value)}
                className="bg-white border border-neutral-300 rounded px-2.5 py-1 text-xs text-neutral-800"
              >
                <option value="ALL">All Actions</option>
                <option value="ORDER_CREATED">ORDER_CREATED</option>
                <option value="MPESA_PAYMENT_VERIFIED">MPESA_PAYMENT_VERIFIED</option>
                <option value="SUBORDER_DISPATCHED">SUBORDER_DISPATCHED</option>
                <option value="SUBORDER_DELIVERED">SUBORDER_DELIVERED</option>
                <option value="ESCROW_RELEASED">ESCROW_RELEASED</option>
                <option value="PAYOUT_APPROVED">PAYOUT_APPROVED</option>
                <option value="PRODUCT_APPROVED">PRODUCT_APPROVED</option>
                <option value="SETTINGS_UPDATED">SETTINGS_UPDATED</option>
                <option value="DISPUTE_RESOLVED">DISPUTE_RESOLVED</option>
              </select>

              <button
                onClick={() => downloadReportCsv('ledger')}
                className="px-2.5 py-1 bg-white border border-neutral-300 hover:bg-neutral-100 rounded text-xs text-neutral-700 cursor-pointer flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 text-neutral-500 border-b border-neutral-200">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Timestamp</th>
                  <th className="py-2.5 px-4 font-semibold">Action</th>
                  <th className="py-2.5 px-4 font-semibold">Actor</th>
                  <th className="py-2.5 px-4 font-semibold">Target Entity</th>
                  <th className="py-2.5 px-4 font-semibold">Metadata & Payload</th>
                  <th className="py-2.5 px-4 font-semibold">Client IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 font-mono text-[11px]">
                {filteredAuditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-neutral-50">
                    <td className="py-3 px-4 text-neutral-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString('en-KE')}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-800 font-bold text-[10px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-sans text-xs">
                      <span className="font-semibold text-neutral-900">{log.actorName}</span>
                      <span className="text-[10px] text-neutral-400 block">({log.actorRole})</span>
                    </td>
                    <td className="py-3 px-4 text-neutral-700">
                      {log.targetType}: {log.targetId}
                    </td>
                    <td className="py-3 px-4 text-neutral-600 max-w-xs truncate font-mono text-[10px]">
                      {JSON.stringify(log.metadata)}
                    </td>
                    <td className="py-3 px-4 text-neutral-400">{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: HOT DEALS & COUNTDOWN TIMERS */}
      {/* ========================================================================= */}
      {adminTab === 'hotdeals' && (() => {
        const totalQuotaAll = hotDeals.reduce((acc, d) => acc + d.totalQuota, 0);
        const totalClaimedAll = hotDeals.reduce((acc, d) => acc + d.claimedCount, 0);
        const avgDiscount = hotDeals.length > 0 
          ? Math.round(hotDeals.reduce((acc, d) => acc + d.discountPercentage, 0) / hotDeals.length) 
          : 0;
        const urgentDealsCount = hotDeals.filter(d => {
          const diff = new Date(d.endsAt).getTime() - Date.now();
          return d.isActive && diff > 0 && diff < 12 * 3600 * 1000;
        }).length;
        const inactiveDealsCount = hotDeals.filter(d => !d.isActive).length;
        const expiredDealsCount = hotDeals.filter(d => new Date(d.endsAt).getTime() <= Date.now()).length;

        const filteredDeals = hotDeals.filter(deal => {
          const product = products.find(p => p.id === deal.productId);
          const title = deal.title || product?.title || '';
          const vendor = product?.vendorName || '';
          const matchesSearch = !hotDealSearch || 
            title.toLowerCase().includes(hotDealSearch.toLowerCase()) ||
            vendor.toLowerCase().includes(hotDealSearch.toLowerCase()) ||
            deal.badgeText.toLowerCase().includes(hotDealSearch.toLowerCase());
          
          const isExpired = new Date(deal.endsAt).getTime() <= Date.now();
          if (hotDealFilterStatus === 'active') return matchesSearch && deal.isActive && !isExpired;
          if (hotDealFilterStatus === 'inactive') return matchesSearch && !deal.isActive;
          if (hotDealFilterStatus === 'expired') return matchesSearch && isExpired;
          return matchesSearch;
        });

        return (
          <div className="space-y-6">
            
            {/* Header Banner */}
            <div className="p-6 bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 rounded-2xl text-white shadow-lg border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 mb-2">
                  <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>PROMOTIONAL ENGINE & FLASH TIMERS</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  Hot Deals & Flash Sales Manager
                </h2>
                <p className="text-xs text-neutral-300 mt-1 max-w-2xl font-normal leading-relaxed">
                  Pick any catalog product, configure deal discount prices, set live countdown timers, and manage limited flash sales. Changes reflect immediately on the storefront.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleOpenCreateHotDealModal()}
                className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-neutral-950 font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-98 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Pick Product & Launch Hot Deal</span>
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-2xs">
                <div className="flex items-center justify-between text-neutral-500 text-xs mb-1">
                  <span>Live Active Deals</span>
                  <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                </div>
                <div className="text-2xl font-extrabold text-neutral-900 font-mono">
                  {activeHotDealsCount}
                </div>
                <div className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Ticking live on storefront</span>
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-2xs">
                <div className="flex items-center justify-between text-neutral-500 text-xs mb-1">
                  <span>Units Claimed / Quota</span>
                  <Zap className="w-4 h-4 text-blue-500" />
                </div>
                <div className="text-2xl font-extrabold text-neutral-900 font-mono">
                  {totalClaimedAll} <span className="text-sm font-normal text-neutral-400">/ {totalQuotaAll}</span>
                </div>
                <div className="text-[11px] text-neutral-500 mt-1">
                  {totalQuotaAll > 0 ? Math.round((totalClaimedAll / totalQuotaAll) * 100) : 0}% aggregate absorption
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-2xs">
                <div className="flex items-center justify-between text-neutral-500 text-xs mb-1">
                  <span>Average Discount</span>
                  <Percent className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-2xl font-extrabold text-neutral-900 font-mono">
                  {avgDiscount}%
                </div>
                <div className="text-[11px] text-neutral-500 mt-1">
                  Across {hotDeals.length} configured deals
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-2xs">
                <div className="flex items-center justify-between text-neutral-500 text-xs mb-1">
                  <span>Urgent Timers (&lt; 12h)</span>
                  <Clock className="w-4 h-4 text-rose-500" />
                </div>
                <div className="text-2xl font-extrabold text-neutral-900 font-mono">
                  {urgentDealsCount}
                </div>
                <div className="text-[11px] text-neutral-500 mt-1">
                  Expiring in less than 12 hours
                </div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setHotDealFilterStatus('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    hotDealFilterStatus === 'all'
                      ? 'bg-neutral-900 text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  All Deals ({hotDeals.length})
                </button>
                <button
                  type="button"
                  onClick={() => setHotDealFilterStatus('active')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    hotDealFilterStatus === 'active'
                      ? 'bg-emerald-800 text-white'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  }`}
                >
                  Live & Ticking ({activeHotDealsCount})
                </button>
                <button
                  type="button"
                  onClick={() => setHotDealFilterStatus('inactive')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    hotDealFilterStatus === 'inactive'
                      ? 'bg-neutral-900 text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  Paused ({inactiveDealsCount})
                </button>
                <button
                  type="button"
                  onClick={() => setHotDealFilterStatus('expired')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    hotDealFilterStatus === 'expired'
                      ? 'bg-rose-900 text-white'
                      : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
                  }`}
                >
                  Expired ({expiredDealsCount})
                </button>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter deals by product or badge..."
                  value={hotDealSearch}
                  onChange={(e) => setHotDealSearch(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-1.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>
            </div>

            {/* Hot Deals Table / Card View */}
            {filteredDeals.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-xl border border-neutral-200 shadow-2xs">
                <Flame className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-neutral-800">No Hot Deals Found</h4>
                <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                  {hotDeals.length === 0
                    ? 'Launch your first limited-time flash special with countdown timer to drive urgent sales on the storefront.'
                    : 'No deals match your current search or filter criteria.'}
                </p>
                <button
                  type="button"
                  onClick={() => handleOpenCreateHotDealModal()}
                  className="mt-4 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
                >
                  + Create First Hot Deal
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-semibold uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Product / Item</th>
                        <th className="py-3 px-4">Deal Pricing & Discount</th>
                        <th className="py-3 px-4">Live Timer & Expiry</th>
                        <th className="py-3 px-4">Quota Claimed</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Quick Timer & Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {filteredDeals.map((deal) => {
                        const product = products.find((p) => p.id === deal.productId);
                        const isExpired = new Date(deal.endsAt).getTime() <= Date.now();
                        const percentClaimed = Math.min(100, Math.round((deal.claimedCount / deal.totalQuota) * 100));

                        return (
                          <tr key={deal.id} className="hover:bg-neutral-50/80 transition-colors">
                            {/* Product Info */}
                            <td className="py-3 px-4 max-w-xs">
                              <div className="flex items-start gap-3">
                                {product?.images[0] ? (
                                  <img
                                    src={product.images[0]}
                                    alt=""
                                    className="w-12 h-12 object-cover rounded-lg border border-neutral-200 shrink-0 bg-neutral-100"
                                  />
                                ) : (
                                  <div className="w-12 h-12 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center shrink-0">
                                    <Package className="w-5 h-5 text-neutral-400" />
                                  </div>
                                )}
                                <div className="min-w-0">
                                  <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-extrabold text-[9px] uppercase tracking-wider mb-1">
                                    <Flame className="w-2.5 h-2.5 text-amber-700 fill-amber-700" />
                                    <span>{deal.badgeText}</span>
                                  </div>
                                  <div className="font-bold text-neutral-900 truncate">
                                    {deal.title || product?.title}
                                  </div>
                                  <div className="text-[11px] text-neutral-500 flex items-center gap-1.5 mt-0.5">
                                    <span>Store: <strong>{product?.vendorName || 'Unknown'}</strong></span>
                                    <span>·</span>
                                    <span className="font-mono">{product?.sku}</span>
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Pricing */}
                            <td className="py-3 px-4 whitespace-nowrap">
                              <div className="font-mono font-bold text-sm text-neutral-950">
                                KES {deal.dealPriceKes.toLocaleString()}
                              </div>
                              <div className="text-[11px] text-neutral-400 line-through font-mono">
                                KES {deal.originalPriceKes.toLocaleString()}
                              </div>
                              <div className="text-[10px] text-emerald-700 font-bold mt-0.5">
                                Save KES {(deal.originalPriceKes - deal.dealPriceKes).toLocaleString()} ({deal.discountPercentage}% OFF)
                              </div>
                            </td>

                            {/* Live Timer & Countdown */}
                            <td className="py-3 px-4 whitespace-nowrap">
                              <div className="space-y-1">
                                <div className="text-xs">
                                  <span className="font-mono font-bold">
                                    {new Date(deal.endsAt).toLocaleString('en-KE', {
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </span>
                                </div>

                                <div className="flex items-center gap-1.5">
                                  {isExpired ? (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                                      <Clock className="w-3 h-3 text-rose-500" />
                                      <span>Timer Expired</span>
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                      <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
                                      <span>Ticking Live</span>
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Quota Claimed */}
                            <td className="py-3 px-4 min-w-[130px]">
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-[11px] font-medium text-neutral-700">
                                  <span>{deal.claimedCount} / {deal.totalQuota}</span>
                                  <span className="font-bold">{percentClaimed}%</span>
                                </div>
                                <div className="w-full h-1.5 rounded-full bg-neutral-200 overflow-hidden">
                                  <div
                                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-rose-500"
                                    style={{ width: `${percentClaimed}%` }}
                                  />
                                </div>
                                <div className="text-[10px] text-neutral-400">
                                  {Math.max(0, deal.totalQuota - deal.claimedCount)} left in stock
                                </div>
                              </div>
                            </td>

                            {/* Status */}
                            <td className="py-3 px-4 whitespace-nowrap">
                              {deal.isActive && !isExpired ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[10px]">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                                  <span>Active</span>
                                </span>
                              ) : !deal.isActive ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-300 font-semibold text-[10px]">
                                  <span>Paused</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 font-semibold text-[10px]">
                                  <span>Expired</span>
                                </span>
                              )}
                            </td>

                            {/* Actions & Timer Extensions */}
                            <td className="py-3 px-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* Quick Timer Extenders */}
                                {onExtendHotDealTimer && (
                                  <div className="inline-flex items-center rounded-lg border border-neutral-200 bg-neutral-50 p-0.5 text-[10px] font-bold">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (onExtendHotDealTimer) onExtendHotDealTimer(deal.id, 2);
                                        notify(`Added +2 hours to ${deal.title}`);
                                      }}
                                      className="px-1.5 py-0.5 hover:bg-white rounded hover:text-amber-800 cursor-pointer transition-colors"
                                      title="Extend deal timer by +2 hours"
                                    >
                                      +2h
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (onExtendHotDealTimer) onExtendHotDealTimer(deal.id, 6);
                                        notify(`Added +6 hours to ${deal.title}`);
                                      }}
                                      className="px-1.5 py-0.5 hover:bg-white rounded hover:text-amber-800 cursor-pointer transition-colors"
                                      title="Extend deal timer by +6 hours"
                                    >
                                      +6h
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (onExtendHotDealTimer) onExtendHotDealTimer(deal.id, 24);
                                        notify(`Added +24 hours to ${deal.title}`);
                                      }}
                                      className="px-1.5 py-0.5 hover:bg-white rounded hover:text-amber-800 cursor-pointer transition-colors"
                                      title="Extend deal timer by +24 hours"
                                    >
                                      +24h
                                    </button>
                                  </div>
                                )}

                                {/* Toggle Active/Pause */}
                                {onToggleHotDeal && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (onToggleHotDeal) onToggleHotDeal(deal.id, !deal.isActive);
                                      notify(!deal.isActive ? 'Deal activated' : 'Deal paused');
                                    }}
                                    className={`p-1.5 rounded-lg border cursor-pointer transition-colors ${
                                      deal.isActive
                                        ? 'bg-neutral-100 hover:bg-amber-50 text-neutral-700 hover:text-amber-800 border-neutral-200'
                                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
                                    }`}
                                    title={deal.isActive ? 'Pause Deal' : 'Activate Deal'}
                                  >
                                    {deal.isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                                  </button>
                                )}

                                {/* Edit Deal */}
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditHotDealModal(deal)}
                                  className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-neutral-200 cursor-pointer transition-colors"
                                  title="Edit Deal & Timer"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>

                                {/* Delete Deal */}
                                {onDeleteHotDeal && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (window.confirm(`Delete hot deal "${deal.title}"?`)) {
                                        onDeleteHotDeal(deal.id);
                                        notify('Hot deal removed.');
                                      }
                                    }}
                                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 cursor-pointer transition-colors"
                                    title="Delete Deal"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* MODAL: DISPUTE ARBITRATION */}
      {/* ========================================================================= */}
      {selectedDispute && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
              <Scale className="w-5 h-5 text-rose-600" />
              <span>Arbitrate Dispute: {selectedDispute.disputeNumber}</span>
            </h3>
            
            <p className="text-xs text-neutral-600">
              Contested Sub-Order <strong>{selectedDispute.subOrderId}</strong> ({selectedDispute.vendorName}). 
              Amount held in Escrow: <strong className="text-rose-700">KES {selectedDispute.amountAtStakeKes.toLocaleString()}</strong>.
            </p>

            <form onSubmit={handleResolveDisputeSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Arbitration Decision
                </label>
                <div className="space-y-2 text-xs">
                  <label className="flex items-start gap-2 p-2.5 rounded border border-neutral-200 cursor-pointer hover:bg-neutral-50">
                    <input
                      type="radio"
                      name="resType"
                      value="FULL_REFUND"
                      checked={disputeResolutionType === 'FULL_REFUND'}
                      onChange={() => setDisputeResolutionType('FULL_REFUND')}
                      className="mt-0.5"
                    />
                    <div>
                      <strong className="text-neutral-900 block">Full Refund to Customer</strong>
                      <span className="text-[11px] text-neutral-500">Reverses escrow via M-Pesa. Order is cancelled.</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2 p-2.5 rounded border border-neutral-200 cursor-pointer hover:bg-neutral-50">
                    <input
                      type="radio"
                      name="resType"
                      value="RELEASE_TO_VENDOR"
                      checked={disputeResolutionType === 'RELEASE_TO_VENDOR'}
                      onChange={() => setDisputeResolutionType('RELEASE_TO_VENDOR')}
                      className="mt-0.5"
                    />
                    <div>
                      <strong className="text-neutral-900 block">Release Escrow to Vendor</strong>
                      <span className="text-[11px] text-neutral-500">Dismiss claim. Artisan fulfills proof of delivery.</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2 p-2.5 rounded border border-neutral-200 cursor-pointer hover:bg-neutral-50">
                    <input
                      type="radio"
                      name="resType"
                      value="SPLIT_ESCROW"
                      checked={disputeResolutionType === 'SPLIT_ESCROW'}
                      onChange={() => setDisputeResolutionType('SPLIT_ESCROW')}
                      className="mt-0.5"
                    />
                    <div>
                      <strong className="text-neutral-900 block">50/50 Settlement Split</strong>
                      <span className="text-[11px] text-neutral-500">Fair compromise. Both parties receive 50% of contested funds.</span>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Arbitration Findings & Notes
                </label>
                <textarea
                  required
                  rows={3}
                  value={disputeNotes}
                  onChange={(e) => setDisputeNotes(e.target.value)}
                  className="w-full text-xs p-2 border border-neutral-300 rounded focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  placeholder="State the justification, return tracking or agreed resolution..."
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedDispute(null)}
                  className="flex-1 py-2 text-xs font-medium text-neutral-600 bg-neutral-100 rounded hover:bg-neutral-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={disputeLoading}
                  className="flex-1 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded transition-colors"
                >
                  {disputeLoading ? 'Processing...' : 'Apply Ruling'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DELIVERY ZONE CONFIG */}
      {/* ========================================================================= */}
      {showZoneModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-neutral-900">
              {editingZoneId ? 'Edit Delivery Zone' : 'Create New Delivery Zone'}
            </h3>

            <form onSubmit={handleSaveZoneSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 mb-1">County</label>
                <input
                  type="text"
                  required
                  value={zoneCounty}
                  onChange={(e) => setZoneCounty(e.target.value)}
                  className="w-full text-xs p-2 border border-neutral-300 rounded"
                  placeholder="e.g. Nairobi, Kiambu, Mombasa, Nakuru..."
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Zone Name</label>
                <input
                  type="text"
                  required
                  value={zoneName}
                  onChange={(e) => setZoneName(e.target.value)}
                  className="w-full text-xs p-2 border border-neutral-300 rounded"
                  placeholder="e.g. Zone 1: Nairobi Central & Westlands"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Towns / Areas (Comma-separated)</label>
                <input
                  type="text"
                  required
                  value={zoneTownsText}
                  onChange={(e) => setZoneTownsText(e.target.value)}
                  className="w-full text-xs p-2 border border-neutral-300 rounded"
                  placeholder="e.g. Westlands, CBD, Kilimani, Lavington"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Fee (KES)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={zoneFee}
                    onChange={(e) => setZoneFee(Number(e.target.value))}
                    className="w-full text-xs p-2 border border-neutral-300 rounded tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Estimated Delivery Time</label>
                  <input
                    type="text"
                    required
                    value={zoneHours}
                    onChange={(e) => setZoneHours(e.target.value)}
                    className="w-full text-xs p-2 border border-neutral-300 rounded"
                    placeholder="e.g. Same Day (4 hours)"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowZoneModal(false)}
                  className="flex-1 py-2 text-xs font-medium text-neutral-600 bg-neutral-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded"
                >
                  Save Zone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: VENDOR COMMISSION OVERRIDE */}
      {/* ========================================================================= */}
      {commissionModalVendor && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-neutral-900">
              Set Negotiated Rate for {commissionModalVendor.name}
            </h3>
            <p className="text-xs text-neutral-600">
              Custom rates override category defaults and global platform baseline.
            </p>

            <form onSubmit={handleSaveVendorCommission} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Commission Rate (%)</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={50}
                  value={vendorRateInput}
                  onChange={(e) => setVendorRateInput(Number(e.target.value))}
                  className="w-full text-xs p-2 border border-neutral-300 rounded tabular-nums"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Fixed Fee per Sub-Order (KES)</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={vendorFixedFeeInput}
                  onChange={(e) => setVendorFixedFeeInput(Number(e.target.value))}
                  className="w-full text-xs p-2 border border-neutral-300 rounded tabular-nums"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCommissionModalVendor(null)}
                  className="flex-1 py-2 text-xs font-medium text-neutral-600 bg-neutral-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 rounded"
                >
                  Save Rate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE COMMISSION TIER RULE */}
      {/* ========================================================================= */}
      {showAddRuleModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-neutral-900">
              Create Commission Tier Rule
            </h3>
            <p className="text-xs text-neutral-600">
              Configure automated platform deduction per sub-order.
            </p>

            <form onSubmit={handleCreateRule} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Rule Name</label>
                <input
                  type="text"
                  required
                  value={newRuleName}
                  onChange={(e) => setNewRuleName(e.target.value)}
                  className="w-full text-xs p-2 border border-neutral-300 rounded"
                  placeholder="e.g. Handmade Jewellery Low Rate"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Rule Tier Type</label>
                <select
                  value={newRuleType}
                  onChange={(e: any) => setNewRuleType(e.target.value)}
                  className="w-full text-xs p-2 border border-neutral-300 rounded"
                >
                  <option value="category">Category-Based Rule</option>
                  <option value="vendor">Vendor-Specific Override</option>
                  <option value="global">Global Platform Baseline</option>
                </select>
              </div>

              {newRuleType === 'category' && (
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Target Category</label>
                  <select
                    value={newRuleTarget}
                    onChange={(e) => setNewRuleTarget(e.target.value)}
                    className="w-full text-xs p-2 border border-neutral-300 rounded"
                  >
                    <option value="Tech & Electronics">Tech & Electronics</option>
                    <option value="Handcrafted Leather">Handcrafted Leather</option>
                    <option value="Fashion & Kitenge">Fashion & Kitenge</option>
                    <option value="Kenyan Specialty Coffee">Kenyan Specialty Coffee</option>
                    <option value="Home & Living">Home & Living</option>
                  </select>
                </div>
              )}

              {newRuleType === 'vendor' && (
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Target Vendor</label>
                  <select
                    value={newRuleTarget}
                    onChange={(e) => setNewRuleTarget(e.target.value)}
                    className="w-full text-xs p-2 border border-neutral-300 rounded"
                  >
                    {vendors.map((v) => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Commission %</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={50}
                    value={newRulePercent}
                    onChange={(e) => setNewRulePercent(Number(e.target.value))}
                    className="w-full text-xs p-2 border border-neutral-300 rounded tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Fixed Fee (KES)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={newRuleFixedFee}
                    onChange={(e) => setNewRuleFixedFee(Number(e.target.value))}
                    className="w-full text-xs p-2 border border-neutral-300 rounded tabular-nums"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddRuleModal(false)}
                  className="flex-1 py-2 text-xs font-medium text-neutral-600 bg-neutral-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded"
                >
                  Save Tier Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BULK REJECTION MODAL */}
      {showBulkRejectModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-5 space-y-4 shadow-xl border border-neutral-200">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-bold text-rose-900 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-700" />
                  <span>Bulk Reject {selectedProductIds.length} Products</span>
                </h3>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Select a Kenyan marketplace compliance standard reason or provide specific feedback.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowBulkRejectModal(false)}
                className="text-neutral-400 hover:text-neutral-700 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* List preview of items being rejected */}
            <div className="max-h-32 overflow-y-auto p-2.5 bg-neutral-50 rounded-lg border border-neutral-200 space-y-1.5 divide-y divide-neutral-200">
              {products
                .filter((p) => selectedProductIds.includes(p.id))
                .map((p) => (
                  <div key={p.id} className="pt-1.5 first:pt-0 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 truncate pr-2">
                      <img src={p.images[0]} alt="" className="w-6 h-6 object-cover rounded bg-neutral-200 shrink-0" />
                      <span className="font-semibold text-neutral-900 truncate">{p.title}</span>
                      <span className="text-[10px] text-neutral-400">({p.sku})</span>
                    </div>
                    <span className="text-[11px] text-amber-800 font-medium shrink-0">{p.vendorName}</span>
                  </div>
                ))}
            </div>

            {/* Compliance Reason Presets */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider">
                Select Compliance Preset Reason
              </label>
              <div className="space-y-1">
                {[
                  'Missing or expired KEBS / regulatory safety standard certificate',
                  'Pricing discrepancy, deceptive MSRP, or unverifiable SKU details',
                  'Suspected counterfeit, replica, or trademark infringement',
                  'Low quality photography, missing attributes, or misleading specs',
                  'Prohibited or restricted category item under SokoSalama escrow policy',
                ].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setSelectedPresetReason(preset);
                      if (!bulkRejectCustomReason) setBulkRejectCustomReason(preset);
                    }}
                    className={`w-full text-left p-2 rounded text-xs transition-colors border flex items-center justify-between cursor-pointer ${
                      selectedPresetReason === preset
                        ? 'bg-rose-50 border-rose-300 text-rose-900 font-semibold'
                        : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    <span>{preset}</span>
                    {selectedPresetReason === preset && <Check className="w-3.5 h-3.5 text-rose-700 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Notes */}
            <div>
              <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                Custom Inspector Guidance (Optional / Edit)
              </label>
              <textarea
                rows={2}
                value={bulkRejectCustomReason}
                onChange={(e) => setBulkRejectCustomReason(e.target.value)}
                placeholder={selectedPresetReason}
                className="w-full text-xs p-2.5 border border-neutral-300 rounded focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                disabled={bulkActionLoading}
                onClick={() => setShowBulkRejectModal(false)}
                className="flex-1 py-2 text-xs font-medium text-neutral-600 bg-neutral-100 hover:bg-neutral-200 rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={bulkActionLoading}
                onClick={handleConfirmBulkReject}
                className="flex-1 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded cursor-pointer transition-colors shadow-2xs disabled:opacity-50"
              >
                {bulkActionLoading ? 'Processing...' : `Confirm Reject (${selectedProductIds.length})`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE / EDIT HOT DEAL */}
      {/* ========================================================================= */}
      {showHotDealModal && (() => {
        const selectedProd = products.find((p) => p.id === dealProductId) || products[0];
        const origPrice = selectedProd ? selectedProd.priceKes : 0;
        const savingsAmount = Math.max(0, origPrice - Number(dealPriceInput));
        const diffMs = dealEndsAt ? new Date(dealEndsAt).getTime() - Date.now() : 0;
        const diffHours = Math.max(0, Math.floor(diffMs / (1000 * 3600)));
        const diffMins = Math.max(0, Math.floor((diffMs % (1000 * 3600)) / (1000 * 60)));

        const availableProducts = products.filter(
          (p) =>
            !productPickerFilter ||
            p.title.toLowerCase().includes(productPickerFilter.toLowerCase()) ||
            p.vendorName.toLowerCase().includes(productPickerFilter.toLowerCase()) ||
            p.category.toLowerCase().includes(productPickerFilter.toLowerCase())
        );

        return (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 sm:p-7 space-y-5 border border-neutral-200">
              
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-4 pb-3 border-b border-neutral-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-rose-500 text-white flex items-center justify-center shadow-xs shrink-0">
                    <Flame className="w-5 h-5 text-amber-100 fill-amber-100" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 tracking-tight">
                      {editingDealId ? 'Edit Hot Deal & Countdown Timer' : 'Launch New Hot Deal & Countdown Timer'}
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Configure promotional pricing, set countdown duration, and allocate limited claim quotas.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowHotDealModal(false)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 cursor-pointer transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSaveHotDealSubmit} className="space-y-4">
                
                {/* 1. Product Picker */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider">
                      1. Select Catalog Product
                    </label>
                    <span className="text-[11px] text-neutral-400">
                      {products.length} total catalog products
                    </span>
                  </div>

                  {/* Filter & Select Dropdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Quick filter products..."
                      value={productPickerFilter}
                      onChange={(e) => setProductPickerFilter(e.target.value)}
                      className="text-xs p-2.5 border border-neutral-300 rounded-xl focus:ring-1 focus:ring-neutral-900"
                    />

                    <select
                      value={dealProductId}
                      onChange={(e) => handleProductSelectInModal(e.target.value)}
                      className="sm:col-span-2 text-xs p-2.5 border border-neutral-300 rounded-xl focus:ring-1 focus:ring-neutral-900 font-medium"
                    >
                      {availableProducts.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title} — KES {p.priceKes.toLocaleString()} ({p.vendorName})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Selected Product Snapshot Card */}
                  {selectedProd && (
                    <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/80 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3 min-w-0">
                        {selectedProd.images[0] && (
                          <img
                            src={selectedProd.images[0]}
                            alt=""
                            className="w-11 h-11 object-cover rounded-lg border border-neutral-200 shrink-0 bg-white"
                          />
                        )}
                        <div className="min-w-0">
                          <div className="font-bold text-neutral-900 truncate">
                            {selectedProd.title}
                          </div>
                          <div className="text-[11px] text-neutral-500 flex items-center gap-1.5">
                            <span>Store: <strong>{selectedProd.vendorName}</strong></span>
                            <span>·</span>
                            <span>Cat: <strong>{selectedProd.category}</strong></span>
                            <span>·</span>
                            <span>Stock: <strong>{selectedProd.stockQuantity} units</strong></span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-[10px] text-neutral-400 font-medium">Standard Price</div>
                        <div className="font-bold text-neutral-900 font-mono">
                          KES {selectedProd.priceKes.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Badge & Deal Title */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1.5">
                      2. Deal Badge / Sticker
                    </label>
                    <input
                      type="text"
                      required
                      value={dealBadgeText}
                      onChange={(e) => setDealBadgeText(e.target.value)}
                      placeholder="e.g. FLASH 25% OFF"
                      className="w-full text-xs p-2.5 border border-neutral-300 rounded-xl focus:ring-1 focus:ring-neutral-900 font-semibold"
                    />

                    {/* Quick Badge Chips */}
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {[
                        '🔥 FLASH 20% OFF',
                        '⚡ 24H MEGA DEAL',
                        'HOT DEAL 25%',
                        'LIMITED 30% OFF',
                        'CLEARANCE 40%',
                        'WEEKEND SPECIAL',
                      ].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setDealBadgeText(preset)}
                          className="px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-100 hover:bg-amber-100 text-neutral-700 hover:text-amber-900 border border-neutral-200 cursor-pointer transition-colors"
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1.5">
                      Deal Headline / Title
                    </label>
                    <input
                      type="text"
                      required
                      value={dealTitle}
                      onChange={(e) => setDealTitle(e.target.value)}
                      placeholder="Title on storefront"
                      className="w-full text-xs p-2.5 border border-neutral-300 rounded-xl focus:ring-1 focus:ring-neutral-900 font-semibold"
                    />
                    <span className="text-[10px] text-neutral-400 mt-1 block">
                      Defaults to product catalog title if unchanged.
                    </span>
                  </div>
                </div>

                {/* 3. Pricing & Discount Configuration (2-Way Reactive) */}
                <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                  <div className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                    3. Deal Pricing & Discount Rate
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                        Deal Price (KES)
                      </label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={dealPriceInput || ''}
                        onChange={(e) => handlePriceChangeInModal(Number(e.target.value))}
                        className="w-full text-xs font-mono font-bold p-2.5 bg-white border border-neutral-300 rounded-xl focus:ring-1 focus:ring-neutral-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                        Discount Percentage (%)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="95"
                        required
                        value={dealDiscountInput || ''}
                        onChange={(e) => handleDiscountChangeInModal(Number(e.target.value))}
                        className="w-full text-xs font-mono font-bold p-2.5 bg-white border border-neutral-300 rounded-xl focus:ring-1 focus:ring-neutral-900"
                      />
                    </div>
                  </div>

                  {/* Savings Readout */}
                  <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200/80 text-emerald-900 text-xs flex items-center justify-between font-medium">
                    <span>
                      Standard: <strong className="line-through font-mono">KES {origPrice.toLocaleString()}</strong>
                      {' ➔ '}
                      Deal: <strong className="font-mono font-bold">KES {Number(dealPriceInput).toLocaleString()}</strong>
                    </span>
                    <span className="font-bold text-emerald-800">
                      Save KES {savingsAmount.toLocaleString()} ({dealDiscountInput}% OFF)
                    </span>
                  </div>
                </div>

                {/* 4. Countdown Timer & Expiry Duration */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider">
                      4. Countdown Timer & Expiration Date
                    </label>
                    {dealEndsAt && diffMs > 0 && (
                      <span className="text-[11px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        ⏱ Ends in {diffHours}h {diffMins}m
                      </span>
                    )}
                  </div>

                  {/* Duration Presets */}
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[11px] text-neutral-500 self-center mr-1">Quick Duration:</span>
                    {[
                      { label: '+2 Hours', hours: 2 },
                      { label: '+6 Hours', hours: 6 },
                      { label: '+12 Hours', hours: 12 },
                      { label: '+24 Hours (1 Day)', hours: 24 },
                      { label: '+48 Hours (2 Days)', hours: 48 },
                      { label: '+3 Days', hours: 72 },
                      { label: '+7 Days (1 Week)', hours: 168 },
                    ].map((dur) => (
                      <button
                        key={dur.label}
                        type="button"
                        onClick={() => handleApplyDurationShortcut(dur.hours)}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-200 cursor-pointer transition-colors"
                      >
                        {dur.label}
                      </button>
                    ))}
                  </div>

                  {/* Datetime Input */}
                  <input
                    type="datetime-local"
                    required
                    value={dealEndsAt}
                    onChange={(e) => setDealEndsAt(e.target.value)}
                    className="w-full text-xs font-mono p-2.5 border border-neutral-300 rounded-xl focus:ring-1 focus:ring-neutral-900 bg-white"
                  />
                </div>

                {/* 5. Quota & Status */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1">
                      Total Units Quota for Deal
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={dealTotalQuota || ''}
                      onChange={(e) => setDealTotalQuota(Number(e.target.value))}
                      className="w-full text-xs font-mono p-2.5 border border-neutral-300 rounded-xl focus:ring-1 focus:ring-neutral-900"
                    />
                    <span className="text-[10px] text-neutral-400 mt-0.5 block">
                      Maximum units sold at this special price.
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1">
                      Initial Units Claimed
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={dealClaimedCount}
                      onChange={(e) => setDealClaimedCount(Number(e.target.value))}
                      className="w-full text-xs font-mono p-2.5 border border-neutral-300 rounded-xl focus:ring-1 focus:ring-neutral-900"
                    />
                    <span className="text-[10px] text-neutral-400 mt-0.5 block">
                      Sets initial scarcity progress bar.
                    </span>
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex flex-wrap items-center gap-6 pt-1 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-neutral-800">
                    <input
                      type="checkbox"
                      checked={dealIsActive}
                      onChange={(e) => setDealIsActive(e.target.checked)}
                      className="w-4 h-4 rounded text-neutral-900 focus:ring-neutral-900"
                    />
                    <span>Active immediately on buyer storefront</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-medium text-neutral-800">
                    <input
                      type="checkbox"
                      checked={dealFeatured}
                      onChange={(e) => setDealFeatured(e.target.checked)}
                      className="w-4 h-4 rounded text-neutral-900 focus:ring-neutral-900"
                    />
                    <span>Featured in priority banner</span>
                  </label>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-2 pt-4 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => setShowHotDealModal(false)}
                    className="px-4 py-2.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-xl cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={dealSaving}
                    className="px-5 py-2.5 text-xs font-bold text-neutral-950 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 rounded-xl shadow-md cursor-pointer transition-all active:scale-98 disabled:opacity-50 flex items-center gap-2"
                  >
                    <Flame className="w-4 h-4 text-neutral-900 fill-neutral-900" />
                    <span>{dealSaving ? 'Saving Deal...' : editingDealId ? 'Update Hot Deal' : 'Launch Hot Deal Live'}</span>
                  </button>
                </div>

              </form>

            </div>
          </div>
        );
      })()}

        </section>
      </div>
    </div>
  );
};
