export type UserRole = 'ADMIN' | 'VENDOR' | 'CUSTOMER';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  vendorId?: string; // If role === 'VENDOR'
  county?: string;
  town?: string;
  password?: string;
  createdAt: string;
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  vendorId?: string; // If role === 'VENDOR'
  county?: string;
  town?: string;
  isGuest?: boolean;
}

export type ProductApprovalStatus = 'draft' | 'submitted' | 'approved' | 'rejected';

export interface ProductAttribute {
  name: string; // e.g. "Size", "Color", "Weight"
  options: string[]; // e.g. ["Small", "Medium", "Large"] or ["Cognac Brown", "Midnight Black"]
}

export interface Product {
  id: string;
  vendorId: string;
  vendorName: string;
  title: string;
  brand?: string;
  slug: string;
  description: string;
  priceKes: number;
  compareAtPriceKes?: number;
  stockQuantity: number;
  sku: string;
  category: string;
  condition?: 'new' | 'refurbished' | 'handmade' | 'used';
  images: string[];
  attributes: ProductAttribute[];
  approvalStatus: ProductApprovalStatus;
  rejectionReason?: string;
  rating: number;
  reviewsCount: number;
  isActive: boolean;
  createdAt: string;
}

export interface Vendor {
  id: string;
  name: string;
  slug: string;
  ownerEmail: string;
  phone: string; // E.164 +254...
  county: string;
  town: string;
  status: 'pending' | 'approved' | 'suspended';
  commissionRatePercent?: number; // Custom vendor rate override (e.g. 8%)
  customFixedFeeKes?: number; // Optional fixed transaction fee
  mpesaPayoutNumber: string;
  bio: string;
  rating: number;
  joinedAt: string;
  businessRegistrationNumber?: string;
}

export interface DeliveryZone {
  id: string;
  county: string;
  name: string;
  towns: string[];
  feeKes: number;
  estimatedDeliveryHours: string;
  isActive: boolean;
}

export interface CartItem {
  productId: string;
  vendorId: string;
  vendorName: string;
  title: string;
  sku: string;
  priceKes: number;
  quantity: number;
  selectedAttributes: Record<string, string>;
  image: string;
}

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type SubOrderFulfillmentStatus = 'pending' | 'dispatched' | 'delivered' | 'cancelled' | 'disputed';

export interface SubOrderItem {
  productId: string;
  title: string;
  sku: string;
  unitPriceKes: number;
  quantity: number;
  lineTotalKes: number;
  selectedAttributes: Record<string, string>;
  image: string;
}

export interface CommissionBreakdown {
  ruleApplied: 'Vendor Override' | 'Category Default' | 'Global Platform';
  percentageRate: number;
  fixedFeeKes: number;
  subtotalKes: number;
  commissionAmountKes: number;
  vendorNetEarningsKes: number;
}

export interface SubOrder {
  id: string;
  parentOrderId: string;
  vendorId: string;
  vendorName: string;
  items: SubOrderItem[];
  subtotalKes: number;
  vendorDeliveryFeeShareKes: number;
  platformCommissionKes: number;
  vendorNetEarningsKes: number;
  commissionBreakdown: CommissionBreakdown;
  fulfillmentStatus: SubOrderFulfillmentStatus;
  trackingReference?: string;
  courierPartner?: string;
  dispatchedAt?: string;
  deliveredAt?: string;
  notes?: string;
  customerDelivery?: {
    name: string;
    phone: string;
    county: string;
    town: string;
    streetDetails?: string;
    buildingNotes?: string;
  };
}

export interface ParentOrder {
  id: string;
  orderNumber: string; // e.g. SOKO-8492
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryAddress: {
    county: string;
    town: string;
    zoneId: string;
    zoneName: string;
    streetDetails: string;
    buildingNotes?: string;
  };
  deliveryFeeKes: number;
  subtotalKes: number;
  totalAmountKes: number;
  paymentStatus: PaymentStatus;
  mpesaDetails?: {
    checkoutRequestId: string;
    merchantRequestId: string;
    mpesaReceiptNumber?: string;
    phoneNumber: string;
    paidAt?: string;
  };
  subOrderIds: string[];
  createdAt: string;
}

export type WalletTransactionType = 
  | 'CREDIT_PENDING_ESCROW'
  | 'RELEASE_ESCROW_TO_AVAILABLE'
  | 'COMMISSION_DEDUCTION'
  | 'PAYOUT_REQUEST_DEBIT'
  | 'PAYOUT_COMPLETED'
  | 'PAYOUT_REFUND_REVERSAL'
  | 'REFUND_CUSTOMER_DEBIT';

export interface WalletTransaction {
  id: string;
  walletId: string;
  vendorId: string;
  type: WalletTransactionType;
  amountKes: number;
  availableBalanceAfterKes: number;
  pendingBalanceAfterKes: number;
  subOrderId?: string;
  payoutId?: string;
  description: string;
  referenceId: string;
  createdAt: string;
}

export interface VendorWallet {
  id: string;
  vendorId: string;
  availableBalanceKes: number;
  pendingEscrowBalanceKes: number;
  totalLifetimeEarnedKes: number;
  totalLifetimeWithdrawnKes: number;
  updatedAt: string;
}

export type PayoutStatus = 'requested' | 'processing' | 'completed' | 'rejected';

export interface PayoutRequest {
  id: string;
  payoutNumber: string;
  vendorId: string;
  vendorName: string;
  amountKes: number;
  status: PayoutStatus;
  destinationMpesaNumber: string;
  b2cReceiptNumber?: string;
  requestedAt: string;
  processedAt?: string;
  processedByAdminId?: string;
  notes?: string;
}

export interface CommissionRule {
  id: string;
  name: string;
  type: 'global' | 'category' | 'vendor';
  targetCategory?: string;
  targetVendorId?: string;
  ratePercent: number;
  fixedFeeKes: number;
  isActive: boolean;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  actorRole: UserRole | 'SYSTEM';
  actorId: string;
  actorName: string;
  action: 
    | 'ORDER_CREATED'
    | 'MPESA_STK_PUSH_INITIATED'
    | 'MPESA_PAYMENT_VERIFIED'
    | 'ESCROW_FUNDS_LOCKED'
    | 'SUBORDER_DISPATCHED'
    | 'SUBORDER_DELIVERED'
    | 'ESCROW_RELEASED'
    | 'PAYOUT_REQUESTED'
    | 'PAYOUT_APPROVED'
    | 'PAYOUT_REJECTED'
    | 'PRODUCT_SUBMITTED'
    | 'PRODUCT_APPROVED'
    | 'PRODUCT_REJECTED'
    | 'COMMISSION_RULE_UPDATED'
    | 'VENDOR_KYC_APPROVED'
    | 'VENDOR_SUSPENDED'
    | 'SETTINGS_UPDATED'
    | 'DISPUTE_RAISED'
    | 'DISPUTE_RESOLVED'
    | 'ZONE_CONFIGURED'
    | 'USER_LOGIN'
    | 'USER_REGISTERED'
    | 'PROFILE_UPDATED'
    | 'VENDOR_ONBOARDED'
    | 'PASSWORD_RESET';
  targetType: 'ORDER' | 'SUBORDER' | 'PRODUCT' | 'WALLET' | 'PAYOUT' | 'COMMISSION_RULE' | 'VENDOR' | 'SETTINGS' | 'DISPUTE' | 'ZONE' | 'USER';
  targetId: string;
  metadata: Record<string, any>;
  ipAddress: string;
  timestamp: string;
}

export interface PlatformSettings {
  /** Additional categorized marketplace configuration stored with the platform settings. */
  adminConfig?: Record<string, unknown>;
  /** One-time secret drafts; the API encrypts these and never returns them. */
  secretDrafts?: Record<string, string>;
  escrowInspectionHours: number; // e.g., 72 hours auto-release window after delivery
  minimumPayoutThresholdKes: number; // e.g., 500 KES
  autoApprovePayoutUnderKes: number; // e.g., 10,000 KES for verified vendors
  defaultCommissionRatePercent: number; // e.g., 10%
  darajaEnvironment: 'sandbox' | 'production';
  darajaPaybillNumber: string; // e.g., 408221
  darajaShortcode: string;
  darajaConsumerKeyMasked: string;
  darajaPasskeyMasked: string;
  smsGatewayProvider: 'AfricasTalking' | 'Infobip' | 'Twilio';
  smsSenderId: string; // e.g., 'SOKOSALAMA'
  supportEmail: string;
  supportPhone: string;
  maintenanceMode: boolean;
  kraWithholdingTaxEnabled: boolean; // 5% WHT for digital marketplaces
}

export type DisputeStatus = 'opened' | 'under_review' | 'resolved_refunded' | 'resolved_vendor_paid' | 'resolved_split';

export interface Dispute {
  id: string;
  disputeNumber: string;
  subOrderId: string;
  parentOrderId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  vendorId: string;
  vendorName: string;
  amountAtStakeKes: number;
  reason: 'Damaged Item' | 'Wrong Product / Variant' | 'Counterfeit / Not Authentic' | 'Not Delivered' | 'Other Quality Issue';
  description: string;
  evidenceImages?: string[];
  status: DisputeStatus;
  adminResolutionNotes?: string;
  resolutionType?: 'FULL_REFUND' | 'RELEASE_TO_VENDOR' | 'SPLIT_ESCROW';
  resolvedAt?: string;
  resolvedByAdminId?: string;
  createdAt: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  customerName: string;
  customerPhoneMasked: string;
  rating: number; // 1-5
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
}

export interface HotDeal {
  id: string;
  productId: string;
  title: string;
  badgeText: string; // e.g. "HOT DEAL", "FLASH 40%", "LIMITED OFFER"
  dealPriceKes: number;
  originalPriceKes: number;
  discountPercentage: number;
  endsAt: string; // ISO datetime string for countdown timer
  totalQuota: number;
  claimedCount: number;
  isActive: boolean;
  featured?: boolean;
}

