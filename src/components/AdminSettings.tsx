import React, { useMemo, useState } from 'react';
import { Check, Search, Settings2, ShieldCheck, RotateCcw, Save, ExternalLink, Image as ImageIcon, Upload, X } from 'lucide-react';
import { DeliveryZone, PlatformSettings } from '../types';

type Field = { key: string; label: string; group?: string; type?: 'text' | 'number' | 'email' | 'url' | 'image' | 'toggle' | 'select' | 'textarea' | 'secret'; options?: string[]; hint?: string; placeholder?: string };
type Section = { name: string; description: string; fields: Field[]; route?: 'zones' | 'vendors' | 'audit' | 'commissions' | 'payouts' };

const sections: Section[] = [
  { name: 'General', description: 'Brand identity, locale, contact details, and storefront availability.', fields: [
    { key: 'marketplaceName', label: 'Marketplace name', type: 'text' }, { key: 'logoUrl', label: 'Logo', type: 'image' }, { key: 'faviconUrl', label: 'Favicon', type: 'image' }, { key: 'businessEmail', label: 'Business email', type: 'email' }, { key: 'supportEmail', label: 'Support email', type: 'email' }, { key: 'supportPhone', label: 'Phone number', type: 'text' }, { key: 'businessAddress', label: 'Business address', type: 'textarea' }, { key: 'country', label: 'Country', type: 'select', options: ['Kenya', 'Uganda', 'Tanzania', 'Rwanda'] }, { key: 'currency', label: 'Currency', type: 'select', options: ['KES', 'UGX', 'TZS', 'RWF'] }, { key: 'timezone', label: 'Time zone', type: 'select', options: ['Africa/Nairobi', 'Africa/Kampala', 'Africa/Dar_es_Salaam', 'UTC'] }, { key: 'dateFormat', label: 'Date format', type: 'select', options: ['DD/MM/YYYY', 'YYYY-MM-DD', 'MM/DD/YYYY'] }, { key: 'timeFormat', label: 'Time format', type: 'select', options: ['24 hour', '12 hour'] }, { key: 'language', label: 'Default language', type: 'select', options: ['English', 'Kiswahili'] }, { key: 'websiteStatus', label: 'Website status', type: 'select', options: ['Live', 'Coming soon', 'Private'] }, { key: 'maintenanceMode', label: 'Maintenance mode', type: 'toggle', hint: 'Blocks new shopping actions. Confirm before enabling.' },
  ] },
  { name: 'Marketplace', description: 'Registration, catalog rules, checkout eligibility, and commission defaults.', fields: [
    { key: 'vendorRegistrationEnabled', label: 'Vendor registration', type: 'toggle' }, { key: 'vendorApprovalRequired', label: 'Require admin approval for vendors', type: 'toggle' }, { key: 'productApprovalRequired', label: 'Require admin approval for products', type: 'toggle' }, { key: 'vendorsCanEditApprovedProducts', label: 'Allow edits after product approval', type: 'toggle' }, { key: 'maxProductsPerVendor', label: 'Maximum products per vendor', type: 'number' }, { key: 'vendorStoreVisibility', label: 'Store visibility', type: 'select', options: ['Approved stores only', 'All active stores', 'Hidden'] }, { key: 'customerReviewsEnabled', label: 'Customer reviews', type: 'toggle' }, { key: 'guestCheckoutEnabled', label: 'Guest checkout', type: 'toggle' }, { key: 'minimumOrderKes', label: 'Minimum order (KES)', type: 'number' }, { key: 'maximumOrderKes', label: 'Maximum order (KES)', type: 'number' }, { key: 'platformCommissionPercent', label: 'Platform commission (%)', type: 'number' }, { key: 'defaultVendorCommissionPercent', label: 'Default vendor commission (%)', type: 'number' }, { key: 'minimumVendorPayoutKes', label: 'Minimum vendor payout (KES)', type: 'number' }, { key: 'payoutSchedule', label: 'Payout schedule', type: 'select', options: ['Weekly', 'Twice monthly', 'Monthly', 'Manual'] }, { key: 'vendorWithdrawalRules', label: 'Withdrawal rules', type: 'textarea' },
  ] },
  { name: 'Payments', description: 'Gateway availability, transaction behavior, and provider credentials.', fields: [
    { key: 'mpesaEnabled', label: 'M-Pesa', type: 'toggle' }, { key: 'cardPaymentsEnabled', label: 'Card payments', type: 'toggle' }, { key: 'bankTransferEnabled', label: 'Bank transfer', type: 'toggle' }, { key: 'otherPaymentsEnabled', label: 'Other gateways', type: 'toggle' }, { key: 'darajaEnvironment', label: 'M-Pesa environment', type: 'select', options: ['sandbox', 'production'] }, { key: 'darajaConsumerKeyMasked', label: 'Consumer key', type: 'secret', hint: 'Credentials are encrypted with the server key, masked in responses, and never sent back to this form. Configure MARKETPLACE_SETTINGS_ENCRYPTION_KEY on the server.' }, { key: 'darajaConsumerSecretMasked', label: 'Consumer secret', type: 'secret' }, { key: 'darajaPaybillNumber', label: 'Paybill number', type: 'text' }, { key: 'darajaShortcode', label: 'Shortcode', type: 'text' }, { key: 'darajaPasskeyMasked', label: 'Passkey', type: 'secret' }, { key: 'paymentCallbackUrl', label: 'Callback URL', type: 'url' }, { key: 'transactionFeeKes', label: 'Transaction fee (KES)', type: 'number' }, { key: 'paymentTimeoutMinutes', label: 'Payment timeout (minutes)', type: 'number' }, { key: 'automaticPaymentConfirmation', label: 'Automatic payment confirmation', type: 'toggle' }, { key: 'failedPaymentHandling', label: 'Failed payment handling', type: 'select', options: ['Keep order pending', 'Cancel after timeout', 'Manual review'] }, { key: 'refundPaymentMethod', label: 'Refund method', type: 'select', options: ['Original payment method', 'Manual review'] }, { key: 'paymentReconciliationEnabled', label: 'Payment reconciliation', type: 'toggle' },
  ] },
  { name: 'Orders', description: 'Order state transitions, cancellation rules, numbering, and notifications.', fields: [
    { key: 'orderWorkflow', label: 'Default workflow', type: 'textarea', hint: 'Pending â†’ Paid â†’ Processing â†’ Ready for Delivery â†’ Out for Delivery â†’ Delivered â†’ Completed. Cancelled, Refunded, Partially Refunded, and Failed are exception states.' }, { key: 'automaticOrderConfirmation', label: 'Automatic order confirmation', type: 'toggle' }, { key: 'orderNumberFormat', label: 'Order numbering format', type: 'text', placeholder: 'SOKO-{YYYY}-{######}' }, { key: 'customerCancellationEnabled', label: 'Allow customer cancellation', type: 'toggle' }, { key: 'cancellationTimeLimitMinutes', label: 'Cancellation time limit (minutes)', type: 'number' }, { key: 'returnWindowDays', label: 'Return window (days)', type: 'number' }, { key: 'autoCompleteOrders', label: 'Automatically mark delivered orders complete', type: 'toggle' }, { key: 'customerOrderNotifications', label: 'Customer order notifications', type: 'toggle' }, { key: 'vendorOrderNotifications', label: 'Vendor order notifications', type: 'toggle' }, { key: 'adminOrderNotifications', label: 'Admin order notifications', type: 'toggle' },
  ] },
  { name: 'Delivery', description: 'Delivery options, location-based fees, pickup, and tracking.', route: 'zones', fields: [
    { key: 'deliveryMethods', label: 'Delivery methods', type: 'text', hint: 'Comma-separated, e.g. Standard, Express, Vendor courier' }, { key: 'deliveryCounties', label: 'Enabled counties', type: 'textarea' }, { key: 'freeDeliveryThresholdKes', label: 'Free delivery threshold (KES)', type: 'number' }, { key: 'estimatedDeliveryTime', label: 'Estimated delivery time', type: 'text' }, { key: 'vendorPickupEnabled', label: 'Vendor pickup', type: 'toggle' }, { key: 'customerPickupEnabled', label: 'Customer pickup', type: 'toggle' }, { key: 'deliveryPartners', label: 'Delivery partners', type: 'text' }, { key: 'deliveryAssignment', label: 'Delivery assignment', type: 'select', options: ['Manual', 'Automatic by zone', 'Vendor managed'] }, { key: 'deliveryTrackingEnabled', label: 'Delivery tracking', type: 'toggle' }, { key: 'failedDeliveryHandling', label: 'Failed delivery handling', type: 'select', options: ['Retry delivery', 'Return to vendor', 'Admin review'] },
  ] },
  { name: 'Vendors', description: 'Vendor lifecycle defaults. Individual vendor status and commission overrides remain in Vendor Management.', route: 'vendors', fields: [
    { key: 'vendorVerificationRequired', label: 'Vendor verification required', type: 'toggle' }, { key: 'requiredVendorInformation', label: 'Required vendor information', type: 'textarea' }, { key: 'requiredVendorDocuments', label: 'Required vendor documents', type: 'textarea' }, { key: 'vendorRatingEnabled', label: 'Vendor ratings', type: 'toggle' }, { key: 'vendorReviewsEnabled', label: 'Vendor reviews', type: 'toggle' }, { key: 'vendorSuspensionEnabled', label: 'Allow vendor suspension', type: 'toggle' }, { key: 'vendorWarningsEnabled', label: 'Vendor warnings', type: 'toggle' }, { key: 'vendorWalletEnabled', label: 'Vendor wallet', type: 'toggle' }, { key: 'vendorPayoutSchedule', label: 'Vendor payout schedule', type: 'select', options: ['Weekly', 'Twice monthly', 'Monthly', 'Manual'] }, { key: 'vendorMinimumWithdrawalKes', label: 'Minimum withdrawal (KES)', type: 'number' },
  ] },
  { name: 'Customers', description: 'Customer account rules and self-service features.', fields: [
    { key: 'customerRegistrationEnabled', label: 'Customer registration', type: 'toggle' }, { key: 'customerEmailVerification', label: 'Email verification', type: 'toggle' }, { key: 'customerPhoneVerification', label: 'Phone verification', type: 'toggle' }, { key: 'customerGuestCheckout', label: 'Guest checkout', type: 'toggle' }, { key: 'passwordRequirements', label: 'Password requirements', type: 'text' }, { key: 'customerAccountDeletion', label: 'Allow account deletion requests', type: 'toggle' }, { key: 'customerReviews', label: 'Customer reviews', type: 'toggle' }, { key: 'wishlistEnabled', label: 'Wishlist', type: 'toggle' }, { key: 'customerNotifications', label: 'Customer notifications', type: 'toggle' }, { key: 'loyaltyPointsEnabled', label: 'Loyalty points', type: 'toggle' }, { key: 'referralSystemEnabled', label: 'Referral system', type: 'toggle' },
  ] },
  { name: 'Taxes & Finance', description: 'Tax display and financial rules. Financial records are written through auditable payment and payout workflows.', route: 'commissions', fields: [
    { key: 'kraWithholdingTaxEnabled', label: 'KRA withholding tax', type: 'toggle' }, { key: 'vatRatePercent', label: 'VAT rate (%)', type: 'number' }, { key: 'taxPricingMode', label: 'Tax pricing mode', type: 'select', options: ['Tax inclusive', 'Tax exclusive'] }, { key: 'platformCommissionPercent', label: 'Platform commission (%)', type: 'number' }, { key: 'financeTransactionFeeKes', label: 'Transaction fees (KES)', type: 'number' }, { key: 'invoiceNumberFormat', label: 'Invoice numbering', type: 'text' }, { key: 'receiptNumberFormat', label: 'Receipt numbering', type: 'text' }, { key: 'financialReportsEnabled', label: 'Financial reports', type: 'toggle' }, { key: 'taxReportsEnabled', label: 'Tax reports', type: 'toggle' },
  ] },
  { name: 'Returns & Refunds', description: 'Customer return eligibility and controlled refund workflows.', fields: [
    { key: 'returnsEnabled', label: 'Enable returns', type: 'toggle' }, { key: 'returnWindowDays', label: 'Return window (days)', type: 'number' }, { key: 'returnEligibleCategories', label: 'Eligible categories', type: 'textarea' }, { key: 'returnReasons', label: 'Return reasons', type: 'textarea' }, { key: 'returnApproval', label: 'Return approval', type: 'select', options: ['Admin approval', 'Vendor approval', 'Automatic by policy'] }, { key: 'refundMethods', label: 'Refund methods', type: 'text' }, { key: 'automaticRefunds', label: 'Automatic refunds', type: 'toggle' }, { key: 'partialRefunds', label: 'Partial refunds', type: 'toggle' }, { key: 'restockingFeePercent', label: 'Restocking fee (%)', type: 'number' }, { key: 'refundResponsibility', label: 'Responsibility rules', type: 'textarea', hint: 'Define when the vendor or platform is responsible. Actual refunds must be approved and recorded through the audited refund workflow.' },
  ] },
  { name: 'Notifications', description: 'Channel availability and event template defaults.', fields: [
    { key: 'emailNotificationsEnabled', label: 'Email', type: 'toggle' }, { key: 'smsNotificationsEnabled', label: 'SMS', type: 'toggle' }, { key: 'pushNotificationsEnabled', label: 'Push notifications', type: 'toggle' }, { key: 'inAppNotificationsEnabled', label: 'In-app notifications', type: 'toggle' }, { key: 'notificationEvents', label: 'Enabled events', type: 'textarea', hint: 'New customer/vendor, vendor approval, new order, payment success/failure, shipment, delivery, cancellation, refund, payout, and new review.' }, { key: 'notificationTemplateOrder', label: 'Order notification template', type: 'textarea' }, { key: 'notificationTemplatePayment', label: 'Payment notification template', type: 'textarea' }, { key: 'notificationTemplateVendor', label: 'Vendor notification template', type: 'textarea' },
  ] },
  { name: 'Promotions', description: 'Promotion defaults. Create and schedule specific campaigns in Promotions.', fields: [
    { key: 'couponsEnabled', label: 'Coupons and discount codes', type: 'toggle' }, { key: 'productDiscountsEnabled', label: 'Product discounts', type: 'toggle' }, { key: 'vendorPromotionsEnabled', label: 'Vendor promotions', type: 'toggle' }, { key: 'flashSalesEnabled', label: 'Flash sales', type: 'toggle' }, { key: 'freeShippingPromotionsEnabled', label: 'Free shipping offers', type: 'toggle' }, { key: 'minimumOrderDiscountsEnabled', label: 'Minimum-order discounts', type: 'toggle' }, { key: 'promotionDiscountType', label: 'Default discount type', type: 'select', options: ['Percentage', 'Fixed KES'] }, { key: 'promotionUsageLimit', label: 'Default usage limit', type: 'number' }, { key: 'promotionMinimumPurchaseKes', label: 'Minimum purchase (KES)', type: 'number' }, { key: 'promotionMaximumDiscountKes', label: 'Maximum discount (KES)', type: 'number' },
  ] },
  { name: 'Reviews & Ratings', description: 'Review eligibility, moderation, and reporting rules.', fields: [
    { key: 'reviewsEnabled', label: 'Reviews enabled', type: 'toggle' }, { key: 'verifiedPurchaseRequired', label: 'Require verified purchase', type: 'toggle' }, { key: 'reviewModeration', label: 'Review moderation', type: 'select', options: ['Pre-moderate', 'Post-moderate', 'Reported reviews only'] }, { key: 'photoReviewsEnabled', label: 'Photo reviews', type: 'toggle' }, { key: 'productRatingsEnabled', label: 'Product ratings', type: 'toggle' }, { key: 'vendorRatingsEnabled', label: 'Vendor ratings', type: 'toggle' }, { key: 'reviewReportingEnabled', label: 'Review reporting', type: 'toggle' }, { key: 'automaticReviewRequests', label: 'Automatic review requests', type: 'toggle' },
  ] },
  { name: 'Admin & Security', description: 'Admin roles, authentication controls, and accountability.', route: 'audit', fields: [
    { key: 'adminTwoFactorRequired', label: 'Require administrator two-factor authentication', type: 'toggle' }, { key: 'adminPasswordRequirements', label: 'Admin password requirements', type: 'text' }, { key: 'adminSessionTimeoutMinutes', label: 'Session timeout (minutes)', type: 'number' }, { key: 'adminLoginAttemptLimit', label: 'Login attempt limit', type: 'number' }, { key: 'adminActivityLogsEnabled', label: 'Admin activity logs', type: 'toggle' }, { key: 'adminLoginHistoryEnabled', label: 'Login history', type: 'toggle' }, { key: 'adminIpSecurityLogsEnabled', label: 'IP and security logs', type: 'toggle' }, { key: 'adminRoleNames', label: 'Admin roles', type: 'textarea', hint: 'Super Admin, Finance Admin, Operations Admin, Support Admin, Content Admin.' }, { key: 'adminPermissions', label: 'Permission areas', type: 'textarea', hint: 'Dashboard, users, vendors, products, orders, payments, refunds, delivery, promotions, reports, settings.' },
  ] },
  { name: 'Integrations', description: 'Connection status and configuration links for external services.', fields: [
    { key: 'mpesaIntegrationStatus', label: 'M-Pesa status', type: 'select', options: ['Not connected', 'Connected', 'Error'] }, { key: 'cardGatewayStatus', label: 'Card gateway status', type: 'select', options: ['Not connected', 'Connected', 'Error'] }, { key: 'smsProviderStatus', label: 'SMS provider status', type: 'select', options: ['Not connected', 'Connected', 'Error'] }, { key: 'emailProviderStatus', label: 'Email provider status', type: 'select', options: ['Not connected', 'Connected', 'Error'] }, { key: 'deliveryProviderStatus', label: 'Delivery provider status', type: 'select', options: ['Not connected', 'Connected', 'Error'] }, { key: 'googleMapsStatus', label: 'Google Maps status', type: 'select', options: ['Not connected', 'Connected', 'Error'] }, { key: 'analyticsStatus', label: 'Analytics status', type: 'select', options: ['Not connected', 'Connected', 'Error'] }, { key: 'webhookEndpoint', label: 'Webhook endpoint', type: 'url' },
  ] },
  { name: 'System', description: 'Operational controls and service health indicators.', fields: [
    { key: 'cacheStatus', label: 'Cache', type: 'select', options: ['Healthy', 'Degraded', 'Unavailable'] }, { key: 'databaseStatus', label: 'Database', type: 'select', options: ['Healthy', 'Degraded', 'Unavailable'] }, { key: 'storageStatus', label: 'Storage', type: 'select', options: ['Healthy', 'Degraded', 'Unavailable'] }, { key: 'queueStatus', label: 'Queue', type: 'select', options: ['Healthy', 'Degraded', 'Unavailable'] }, { key: 'emailHealthStatus', label: 'Email', type: 'select', options: ['Healthy', 'Degraded', 'Unavailable'] }, { key: 'paymentHealthStatus', label: 'Payments', type: 'select', options: ['Healthy', 'Degraded', 'Unavailable'] }, { key: 'apiHealthStatus', label: 'API', type: 'select', options: ['Healthy', 'Degraded', 'Unavailable'] }, { key: 'fileUploadLimitMb', label: 'File upload limit (MB)', type: 'number' }, { key: 'imageOptimizationEnabled', label: 'Image optimization', type: 'toggle' }, { key: 'scheduledTasksStatus', label: 'Scheduled tasks', type: 'select', options: ['Healthy', 'Paused', 'Error'] },
  ] },
];

const fieldsFor = (name: string) => sections.find((section) => section.name === name)?.fields || [];
const without = (fields: Field[], keys: string[]) => fields.filter((field) => !keys.includes(field.key));
const only = (fields: Field[], keys: string[]) => fields.filter((field) => keys.includes(field.key));
const grouped = (fields: Field[], groups: Array<[string, string[]]>) => {
  const annotated = fields.map((field) => ({ ...field, group: groups.find(([, keys]) => keys.includes(field.key))?.[0] || field.group }));
  return [...groups.flatMap(([group]) => annotated.filter((field) => field.group === group)), ...annotated.filter((field) => !field.group)];
};
const curatedSections: Section[] = [
  {
    name: 'General',
    description: 'Your site identity, contact details, storefront availability, and announcement bar.',
    fields: grouped([
      ...without(fieldsFor('General'), ['country', 'currency', 'timezone', 'dateFormat', 'timeFormat', 'language']),
      { key: 'announcementBarEnabled', label: 'Show announcement bar', type: 'toggle' },
      { key: 'announcementBarText', label: 'Announcement message', type: 'textarea', hint: 'Separate messages with | to rotate them across the top of the navbar.' },
    ], [
      ['Site identity', ['marketplaceName', 'logoUrl', 'faviconUrl']],
      ['Contact details', ['businessEmail', 'supportEmail', 'supportPhone', 'businessAddress']],
      ['Storefront availability', ['websiteStatus', 'maintenanceMode']],
      ['Announcement bar', ['announcementBarEnabled', 'announcementBarText']],
    ]),
  },
  {
    name: 'Marketplace',
    description: 'Store onboarding, product rules, customer accounts, and checkout.',
    route: 'vendors',
    fields: [
      ...only(fieldsFor('Marketplace'), ['vendorRegistrationEnabled', 'vendorApprovalRequired', 'productApprovalRequired', 'vendorsCanEditApprovedProducts', 'maxProductsPerVendor', 'vendorStoreVisibility', 'guestCheckoutEnabled']),
      ...only(fieldsFor('Vendors'), ['vendorVerificationRequired']),
      ...only(fieldsFor('Customers'), ['customerRegistrationEnabled', 'customerEmailVerification', 'customerPhoneVerification', 'customerAccountDeletion', 'wishlistEnabled', 'passwordRequirements']),
    ],
  },
  {
    name: 'Orders & Delivery',
    description: 'Order lifecycle, delivery options, service areas, and tracking.',
    route: 'zones',
    fields: [
      ...only(fieldsFor('Orders'), ['customerCancellationEnabled', 'cancellationTimeLimitMinutes']),
      ...only(fieldsFor('Delivery'), ['vendorPickupEnabled', 'customerPickupEnabled', 'deliveryTrackingEnabled']),
    ],
  },
  {
    name: 'Payments & Finance',
    description: 'Payment methods, tax rules, marketplace commission, and payouts.',
    route: 'commissions',
    fields: [
      ...only(fieldsFor('Payments'), ['darajaEnvironment', 'darajaConsumerKeyMasked', 'darajaConsumerSecretMasked', 'darajaPaybillNumber', 'darajaShortcode', 'darajaPasskeyMasked', 'paymentCallbackUrl', 'paymentTimeoutMinutes', 'automaticPaymentConfirmation', 'paymentReconciliationEnabled']),
      ...only(fieldsFor('Taxes & Finance'), ['kraWithholdingTaxEnabled', 'vatRatePercent', 'taxPricingMode']),
      { key: 'escrowInspectionHours', label: 'Escrow inspection window (hours)', type: 'number' },
      ...only(fieldsFor('Taxes & Finance'), ['platformCommissionPercent']),
      { key: 'minimumVendorPayoutKes', label: 'Minimum vendor payout (KES)', type: 'number' },
      { key: 'autoApprovePayoutUnderKes', label: 'Auto-approve payout below (KES)', type: 'number' },
    ],
  },
  {
    name: 'Customer Care',
    description: 'Returns, refunds, customer messages, notifications, and reviews.',
    fields: [
      ...only(fieldsFor('Returns & Refunds'), ['returnsEnabled', 'returnWindowDays', 'returnReasons', 'returnApproval', 'refundMethods', 'partialRefunds']),
      ...only(fieldsFor('Notifications'), ['emailNotificationsEnabled', 'smsNotificationsEnabled', 'pushNotificationsEnabled']),
      ...only(fieldsFor('Reviews & Ratings'), ['reviewsEnabled', 'verifiedPurchaseRequired', 'reviewModeration', 'photoReviewsEnabled']),
    ],
  },
  { ...sections.find((section) => section.name === 'Promotions')!, name: 'Promotions', fields: only(fieldsFor('Promotions'), ['couponsEnabled', 'productDiscountsEnabled', 'vendorPromotionsEnabled', 'flashSalesEnabled', 'freeShippingPromotionsEnabled', 'promotionDiscountType', 'promotionUsageLimit', 'promotionMinimumPurchaseKes', 'promotionMaximumDiscountKes']) },
  {
    name: 'Security & Integrations',
    description: 'Administrator sign-in controls and audit history.',
    route: 'audit',
    fields: [
      ...only(fieldsFor('Admin & Security'), ['adminTwoFactorRequired', 'adminSessionTimeoutMinutes', 'adminLoginAttemptLimit']),
      ...fieldsFor('Integrations').filter((field) => field.key === 'webhookEndpoint'),
    ],
  },
];

const defaults: Record<string, unknown> = {
  marketplaceName: 'SokoSalama', announcementBarEnabled: true, announcementBarText: 'Shop trusted Kenyan businesses | Convenient delivery across Kenya | Discover something you will love', country: 'Kenya', currency: 'KES', timezone: 'Africa/Nairobi', language: 'English', websiteStatus: 'Live',
  supportEmail: 'support@sokosalama.co.ke', supportPhone: '+254 700 000 001', businessEmail: 'support@sokosalama.co.ke',
  vendorRegistrationEnabled: true, vendorApprovalRequired: true, productApprovalRequired: true, vendorsCanEditApprovedProducts: false, maxProductsPerVendor: 500, vendorStoreVisibility: 'Approved stores only', customerReviewsEnabled: true, guestCheckoutEnabled: false, minimumOrderKes: 0, maximumOrderKes: 500000, platformCommissionPercent: 10, defaultVendorCommissionPercent: 10, minimumVendorPayoutKes: 500, payoutSchedule: 'Weekly',
  mpesaEnabled: true, cardPaymentsEnabled: false, bankTransferEnabled: false, otherPaymentsEnabled: false, darajaEnvironment: 'sandbox', paymentTimeoutMinutes: 10, automaticPaymentConfirmation: true, paymentReconciliationEnabled: true,
  automaticOrderConfirmation: true, orderNumberFormat: 'SOKO-{YYYY}-{######}', customerCancellationEnabled: true, cancellationTimeLimitMinutes: 30, returnWindowDays: 7, autoCompleteOrders: false,
  vendorPickupEnabled: true, customerPickupEnabled: false, deliveryTrackingEnabled: true, deliveryAssignment: 'Manual', freeDeliveryThresholdKes: 5000,
  vendorVerificationRequired: true, vendorWalletEnabled: true, vendorSuspensionEnabled: true, vendorWarningsEnabled: true, customerRegistrationEnabled: true, customerEmailVerification: true, customerPhoneVerification: true, customerGuestCheckout: false, passwordRequirements: 'At least 8 characters, including a number', customerAccountDeletion: true, wishlistEnabled: true, taxesEnabled: false, taxPricingMode: 'Tax exclusive',
  returnsEnabled: true, automaticRefunds: false, partialRefunds: true, emailNotificationsEnabled: true, smsNotificationsEnabled: true, pushNotificationsEnabled: true, inAppNotificationsEnabled: true,
  reviewsEnabled: true, verifiedPurchaseRequired: true, reviewModeration: 'Reported reviews only', photoReviewsEnabled: true, productRatingsEnabled: true, vendorRatingsEnabled: true,
  adminTwoFactorRequired: true, adminSessionTimeoutMinutes: 30, adminLoginAttemptLimit: 5, adminActivityLogsEnabled: true, adminLoginHistoryEnabled: true, adminIpSecurityLogsEnabled: true,
  fileUploadLimitMb: 20, imageOptimizationEnabled: true,
};

const compressImage = async (file: File): Promise<string> => {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1400 / bitmap.width, 1000 / bitmap.height);
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext('2d');
  if (!context) throw new Error('This image could not be processed. Try another file.');
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((result) => result ? resolve(result) : reject(new Error('This image could not be processed. Try another file.')), 'image/webp', 0.82));
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('This image could not be read.'));
    reader.onerror = () => reject(new Error('This image could not be read.'));
    reader.readAsDataURL(blob);
  });
};

interface AdminSettingsProps {
  settings: PlatformSettings;
  deliveryZones: DeliveryZone[];
  onSave: (settings: Partial<PlatformSettings>) => Promise<void>;
  onOpenRoute: (route: NonNullable<Section['route']>) => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ settings, deliveryZones, onSave, onOpenRoute }) => {
  const persisted = (settings.adminConfig || {}) as Record<string, unknown>;
  const initial = useMemo(() => ({ ...defaults, ...persisted, ...Object.fromEntries(Object.entries(settings).filter(([key]) => key !== 'adminConfig')) }), [settings, persisted]);
  const [values, setValues] = useState<Record<string, unknown>>(initial);
  const [secretDrafts, setSecretDrafts] = useState<Record<string, string>>({});
  const [active, setActive] = useState('General');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [imageErrors, setImageErrors] = useState<Record<string, string>>({});
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);
  const current = curatedSections.find((section) => section.name === active) || curatedSections[0];
  const shownSections = curatedSections.filter((section) => section.name.toLowerCase().includes(search.toLowerCase()) || section.fields.some((field) => field.label.toLowerCase().includes(search.toLowerCase())));

  const updateValue = (key: string, next: unknown) => { setValues((previous) => ({ ...previous, [key]: next })); setSaved(false); setError(''); };
  const handleImageFile = async (key: string, file?: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) { setImageErrors((previous) => ({ ...previous, [key]: 'Choose an image file such as JPG, PNG, or WebP.' })); return; }
    if (file.size > 12 * 1024 * 1024) { setImageErrors((previous) => ({ ...previous, [key]: 'Choose an image smaller than 12 MB.' })); return; }
    setUploadingImage(key);
    setImageErrors((previous) => ({ ...previous, [key]: '' }));
    try { updateValue(key, await compressImage(file)); }
    catch (cause) { setImageErrors((previous) => ({ ...previous, [key]: cause instanceof Error ? cause.message : 'Could not process this image.' })); }
    finally { setUploadingImage(null); }
  };
  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    const min = Number(values.minimumOrderKes || 0);
    const max = Number(values.maximumOrderKes || 0);
    const commission = Number(values.platformCommissionPercent || 0);
    if (max > 0 && min > max) { setError('Minimum order amount cannot exceed the maximum order amount.'); return; }
    if (commission < 0 || commission > 100) { setError('Commission must be between 0 and 100%.'); return; }
    if (values.maintenanceMode === true && initial.maintenanceMode !== true && !window.confirm('Enable maintenance mode? This will block new shopping actions.')) return;
    setSaving(true);
    try {
      const core = Object.fromEntries(Object.keys(settings).filter((key) => key !== 'adminConfig').map((key) => [key, values[key]]));
      core.defaultCommissionRatePercent = Number(values.platformCommissionPercent ?? settings.defaultCommissionRatePercent);
      core.minimumPayoutThresholdKes = Number(values.minimumVendorPayoutKes ?? values.vendorMinimumWithdrawalKes ?? settings.minimumPayoutThresholdKes);
      core.kraWithholdingTaxEnabled = Boolean(values.kraWithholdingTaxEnabled ?? values.taxesEnabled ?? settings.kraWithholdingTaxEnabled);
      await onSave({ ...core, adminConfig: Object.fromEntries(Object.entries(values).filter(([key]) => !(key in settings))), secretDrafts });
      setSecretDrafts({});
      setSaved(true);
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not save settings. Try again.'); }
    finally { setSaving(false); }
  };

  const renderField = (field: Field) => {
    const value = values[field.key];
    const common = 'w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100';
    if (field.type === 'image') return <div className="space-y-2.5">
      <label htmlFor={`upload-${field.key}`} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); void handleImageFile(field.key, event.dataTransfer.files[0]); }} className="group flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-neutral-300 bg-neutral-50/70 p-3 transition hover:border-amber-400 hover:bg-amber-50/50">
        {typeof value === 'string' && value ? <img src={value} alt={`${field.label} preview`} className="h-14 w-20 shrink-0 rounded-lg border border-neutral-200 bg-white object-contain p-1" /> : <span className="flex h-14 w-20 shrink-0 items-center justify-center rounded-lg bg-white text-neutral-400"><ImageIcon className="h-5 w-5" /></span>}
        <span className="min-w-0 flex-1"><span className="flex items-center gap-1.5 text-sm font-semibold text-neutral-800"><Upload className="h-4 w-4 text-amber-700" />{uploadingImage === field.key ? 'Preparing imageâ€¦' : 'Drop an image here or browse'}</span><span className="mt-1 block text-xs text-neutral-500">JPG, PNG, or WebP Â· up to 12 MB</span></span>
        <input id={`upload-${field.key}`} type="file" accept="image/*" className="sr-only" onChange={(event) => { void handleImageFile(field.key, event.target.files?.[0]); event.currentTarget.value = ''; }} />
      </label>
      <div className="flex gap-2"> <input type="text" aria-label={`${field.label} image URL`} className={common} value={String(value ?? '')} placeholder="Or paste an image URL (https://â€¦)" onChange={(event) => updateValue(field.key, event.target.value)} />{typeof value === 'string' && value.length > 0 && <button type="button" aria-label={`Remove ${field.label}`} onClick={() => updateValue(field.key, '')} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-neutral-200 text-neutral-500 hover:bg-rose-50 hover:text-rose-700"><X className="h-4 w-4" /></button>}</div>
      {imageErrors[field.key] && <p role="alert" className="text-xs text-rose-700">{imageErrors[field.key]}</p>}
    </div>;
    if (field.type === 'toggle') return <button type="button" role="switch" aria-label={field.label} aria-checked={Boolean(value)} onClick={() => {
      if (value && ['mpesaEnabled', 'cardPaymentsEnabled', 'bankTransferEnabled', 'otherPaymentsEnabled'].includes(field.key) && !window.confirm(`Disable ${field.label}? Customers may be unable to pay with this method.`)) return;
      updateValue(field.key, !value);
    }} className={`relative h-6 w-11 shrink-0 rounded-full transition ${value ? 'bg-emerald-600' : 'bg-neutral-300'}`}><span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${value ? 'left-[22px]' : 'left-0.5'}`} /></button>;
    if (field.type === 'select') return <select id={field.key} className={common} value={String(value ?? field.options?.[0] ?? '')} onChange={(event) => updateValue(field.key, event.target.value)}>{field.options?.map((option) => <option key={option} value={option}>{option === 'sandbox' ? 'Sandbox' : option === 'production' ? 'Production' : option}</option>)}</select>;
    if (field.type === 'textarea') return <textarea id={field.key} rows={3} className={`${common} resize-y`} value={String(value ?? '')} placeholder={field.placeholder} onChange={(event) => updateValue(field.key, event.target.value)} />;
    if (field.type === 'secret') return <input id={field.key} type="password" autoComplete="new-password" className={common} value={secretDrafts[field.key] || ''} placeholder="Leave blank to keep current credential" onChange={(event) => setSecretDrafts((previous) => ({ ...previous, [field.key]: event.target.value }))} />;
    const inputType = field.type === 'number' ? 'number' : field.type === 'email' ? 'email' : field.type === 'url' ? 'url' : 'text';
    return <input id={field.key} type={inputType} className={common} value={String(value ?? '')} placeholder={field.placeholder} onChange={(event) => updateValue(field.key, field.type === 'number' ? Number(event.target.value) : event.target.value)} />;
  };

  return <div className="space-y-5">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">Administration</p><h2 className="mt-1 text-2xl font-bold tracking-tight text-neutral-900">Settings</h2><p className="mt-1 text-sm text-neutral-500">Manage marketplace behavior, finance, and system defaults.</p></div>
      <div className="flex items-center gap-2 text-xs text-neutral-500"><ShieldCheck className="h-4 w-4 text-emerald-600" /> Changes are saved to the platform settings store</div>
    </div>
    <div className="space-y-4">
      <label className="relative block max-w-md"><Search className="absolute left-3 top-3 h-4 w-4 text-neutral-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find a settings category" className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-amber-500" /></label>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {shownSections.map((section) => <button key={section.name} type="button" onClick={() => { setActive(section.name); setSettingsOpen(true); }} className="group rounded-2xl border border-neutral-200 bg-white p-4 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500">
          <span className="flex items-start justify-between gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-800 transition group-hover:bg-amber-100"><Settings2 className="h-5 w-5" /></span><span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[10px] font-semibold text-neutral-500">{section.fields.length} settings</span></span>
          <span className="mt-4 block text-sm font-bold text-neutral-900">{section.name}</span>
          <span className="mt-1.5 block min-h-10 text-xs leading-relaxed text-neutral-500">{section.description}</span>
          <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-amber-800">Open settings <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" /></span>
        </button>)}
        {shownSections.length === 0 && <p className="col-span-full rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-center text-sm text-neutral-500">No settings categories match “{search}”.</p>}
      </div>
      {settingsOpen && <div className="fixed inset-0 z-[80] flex items-end justify-center bg-neutral-950/45 p-0 backdrop-blur-sm sm:items-center sm:p-5" onMouseDown={(event) => { if (event.target === event.currentTarget) setSettingsOpen(false); }}>
      <div role="dialog" aria-modal="true" aria-labelledby="settings-dialog-title" className="flex max-h-[94vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl border border-white/70 bg-[#F7F7F4] shadow-2xl sm:rounded-3xl">
      <div className="flex items-center justify-between border-b border-neutral-200 bg-white/90 px-5 py-3.5 sm:px-6"><div><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-700">Settings category</p><h3 id="settings-dialog-title" className="mt-0.5 text-base font-bold text-neutral-900">{current.name}</h3></div><button type="button" onClick={() => setSettingsOpen(false)} aria-label="Close settings" className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"><X className="h-4 w-4" /></button></div>
      <form onSubmit={save} className="min-h-0 space-y-4 overflow-y-auto p-4 sm:p-5">
        <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <div className="border-b border-neutral-100 bg-neutral-50/70 px-5 py-4 sm:px-6"><div className="flex items-start justify-between gap-3"><div><h3 className="text-lg font-bold text-neutral-900">{current.name}</h3><p className="mt-1 text-sm text-neutral-500">{current.description}</p></div><Settings2 className="mt-1 h-5 w-5 shrink-0 text-neutral-400" /></div></div>
          {current.route && <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 bg-amber-50/60 px-5 py-3 text-sm sm:px-6"><span className="text-neutral-700">Manage the detailed records and approvals in the related workspace.</span><button type="button" onClick={() => onOpenRoute(current.route!)} className="inline-flex items-center gap-1.5 font-semibold text-amber-800 hover:text-amber-950">Open {current.route === 'zones' ? 'delivery zones' : current.route === 'audit' ? 'audit log' : current.route}<ExternalLink className="h-3.5 w-3.5" /></button></div>}
          {current.name === 'Orders & Delivery' && deliveryZones.length > 0 && <div className="overflow-x-auto border-b border-neutral-100 px-5 py-4 sm:px-6"><h4 className="mb-3 text-sm font-semibold text-neutral-800">Active delivery zones</h4><table className="w-full min-w-[460px] text-left text-xs"><thead className="text-neutral-500"><tr><th className="pb-2 font-medium">Zone</th><th className="pb-2 font-medium">County</th><th className="pb-2 font-medium">Fee</th><th className="pb-2 font-medium">ETA</th></tr></thead><tbody>{deliveryZones.map((zone) => <tr key={zone.id} className="border-t border-neutral-100"><td className="py-2.5 font-medium text-neutral-800">{zone.name}</td><td className="py-2.5 text-neutral-600">{zone.county}</td><td className="py-2.5 text-neutral-600">KES {zone.feeKes.toLocaleString()}</td><td className="py-2.5 text-neutral-600">{zone.estimatedDeliveryHours}</td></tr>)}</tbody></table></div>}
          <div className="grid gap-x-5 gap-y-4 p-5 sm:grid-cols-2 sm:p-6">
            {current.fields.map((field, index) => <React.Fragment key={field.key}>
              {field.group && (index === 0 || current.fields[index - 1].group !== field.group) && <h4 className={`border-b border-neutral-100 pb-2 text-xs font-bold uppercase tracking-[0.12em] text-neutral-500 ${index > 0 ? 'pt-3' : ''} sm:col-span-2`}>{field.group}</h4>}
              <div className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>{field.type === 'toggle' ? <div className="flex min-h-[46px] items-center justify-between gap-4 rounded-xl border border-neutral-100 bg-neutral-50/70 px-3.5 py-2.5"><div><label className="block text-sm font-medium text-neutral-800">{field.label}</label>{field.hint && <p className="mt-0.5 text-xs text-neutral-500">{field.hint}</p>}</div>{renderField(field)}</div> : <><label htmlFor={field.key} className="mb-1.5 block text-sm font-medium text-neutral-700">{field.label}</label>{renderField(field)}{field.hint && <p className="mt-1.5 text-xs leading-relaxed text-neutral-500">{field.hint}</p>}</>}</div>
            </React.Fragment>)}
          </div>
        </section>
        {current.name === 'Payments & Finance' && <section className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4"><h4 className="text-sm font-semibold text-emerald-950">Financial calculation path</h4><p className="mt-1 text-sm text-emerald-900">Customer payment â†’ platform revenue â†’ payment fees and delivery fees â†’ platform commission â†’ vendor earnings.</p><p className="mt-2 text-xs text-emerald-800">Refunds and payouts must use their approved workflows and create an audit record; these settings do not directly alter ledger entries.</p></section>}
        {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</div>}
        {saved && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">Settings saved successfully.</div>}
        <div className="sticky bottom-2 z-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-neutral-200 bg-white/95 p-3 shadow-lg backdrop-blur"><span className="hidden text-xs text-neutral-500 sm:inline">Changes apply after saving.</span><div className="ml-auto flex gap-2"><button type="button" onClick={() => { if (window.confirm(`Reset ${current.name} settings to their defaults?`)) { setValues((previous) => ({ ...previous, ...Object.fromEntries(current.fields.map((field) => [field.key, defaults[field.key] ?? (field.type === 'toggle' ? false : field.type === 'number' ? 0 : '')])) })); setSaved(false); } }} className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 px-3.5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"><RotateCcw className="h-4 w-4" />Reset</button><button type="submit" disabled={saving} className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-60"><Save className="h-4 w-4" />{saving ? 'Savingâ€¦' : 'Save changes'}</button></div></div>
      </form>
      </div>
      </div>}
    </div>
  </div>;
};




