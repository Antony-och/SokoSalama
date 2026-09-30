import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShieldCheck, MapPin, Phone, User, Store, AlertCircle } from 'lucide-react';
import { CartItem, DeliveryZone, ParentOrder } from '../types';

interface CartCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  deliveryZones: DeliveryZone[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToMpesa: (orderPayload: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    deliveryAddress: ParentOrder['deliveryAddress'];
    cartItems: { productId: string; quantity: number; selectedAttributes: Record<string, string> }[];
  }) => Promise<void>;
  isLoading: boolean;
}

export const CartCheckoutModal: React.FC<CartCheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  deliveryZones,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToMpesa,
  isLoading,
}) => {
  if (!isOpen) return null;

  // Checkout address & contact fields (prefilled with typical Kenyan info)
  const [customerName, setCustomerName] = useState('Wambui Kariuki');
  const [customerPhone, setCustomerPhone] = useState('0720987654');
  const [customerEmail, setCustomerEmail] = useState('wambui.k@gmail.com');
  const [selectedZoneId, setSelectedZoneId] = useState<string>(
    deliveryZones[0]?.id || 'zone_nairobi_cbd_west'
  );
  const [streetDetails, setStreetDetails] = useState('Rose Avenue, Green Oaks Court Apt 4B');
  const [buildingNotes, setBuildingNotes] = useState('Gate 3, call security on arrival');
  const [formError, setFormError] = useState<string | null>(null);

  // Group cart items by Vendor to show Multi-Vendor Sub-Order architecture
  const itemsByVendor: Record<string, { vendorName: string; items: CartItem[] }> = {};
  cartItems.forEach((item) => {
    if (!itemsByVendor[item.vendorId]) {
      itemsByVendor[item.vendorId] = {
        vendorName: item.vendorName,
        items: [],
      };
    }
    itemsByVendor[item.vendorId].items.push(item);
  });

  const selectedZone = deliveryZones.find((z) => z.id === selectedZoneId) || deliveryZones[0];
  const itemsSubtotalKes = cartItems.reduce((acc, it) => acc + it.priceKes * it.quantity, 0);
  const deliveryFeeKes = cartItems.length > 0 ? (selectedZone ? selectedZone.feeKes : 0) : 0;
  const totalAmountKes = itemsSubtotalKes + deliveryFeeKes;

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (cartItems.length === 0) {
      setFormError('Your cart is empty.');
      return;
    }

    // Kenyan phone validation: 07XX, 01XX, or +254
    const cleanPhone = customerPhone.trim().replace(/\s+/g, '');
    const kenyanPhoneRegex = /^(?:\+254|254|0)(7\d{8}|1\d{8})$/;
    if (!kenyanPhoneRegex.test(cleanPhone)) {
      setFormError('Please enter a valid Kenyan Safaricom phone number (e.g. 0722123456 or +254722123456).');
      return;
    }

    let formattedPhone = cleanPhone;
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '+254' + formattedPhone.substring(1);
    } else if (!formattedPhone.startsWith('+')) {
      formattedPhone = '+' + formattedPhone;
    }

    if (!selectedZone) {
      setFormError('Please choose a delivery zone.');
      return;
    }

    try {
      await onProceedToMpesa({
        customerName: customerName.trim(),
        customerPhone: formattedPhone,
        customerEmail: customerEmail.trim(),
        deliveryAddress: {
          county: selectedZone.county,
          town: selectedZone.towns[0] || 'Nairobi Area',
          zoneId: selectedZone.id,
          zoneName: selectedZone.name,
          streetDetails: streetDetails.trim(),
          buildingNotes: buildingNotes.trim(),
        },
        cartItems: cartItems.map((ci) => ({
          productId: ci.productId,
          quantity: ci.quantity,
          selectedAttributes: ci.selectedAttributes,
        })),
      });
    } catch (err: any) {
      setFormError(err.message || 'Server price or stock validation failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div 
        className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden border border-neutral-200 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50">
          <div>
            <h2 className="text-lg font-bold text-neutral-900 tracking-tight">
              Multi-Vendor Escrow Checkout
            </h2>
            <p className="text-xs text-neutral-500">
              {cartItems.length} items from {Object.keys(itemsByVendor).length} independent Kenyan artisans
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-full transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 overflow-y-auto flex-1">
          
          {/* Left: Cart Items & Vendor Sub-Orders Breakdown (7 cols) */}
          <div className="lg:col-span-7 p-6 border-b lg:border-b-0 lg:border-r border-neutral-200 space-y-6">
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sm text-neutral-500 mb-4">Your multi-vendor bag is currently empty.</p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-neutral-900 text-white text-xs font-semibold rounded-lg hover:bg-neutral-800 transition-colors"
                >
                  Return to Marketplace
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                    Vendor Sub-Orders Breakdown
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    Split per vendor upon single checkout
                  </span>
                </div>

                <div className="space-y-6">
                  {Object.entries(itemsByVendor).map(([vendorId, group]) => (
                    <div key={vendorId} className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
                      {/* Vendor Header */}
                      <div className="flex items-center justify-between pb-2 mb-3 border-b border-neutral-200/80">
                        <div className="flex items-center gap-2">
                          <Store className="w-4 h-4 text-amber-800" />
                          <span className="text-xs font-bold text-neutral-900">{group.vendorName}</span>
                        </div>
                        <span className="text-[11px] text-neutral-500">
                          Sub-Order
                        </span>
                      </div>

                      {/* Items in this sub-order */}
                      <div className="space-y-3">
                        {group.items.map((item) => (
                          <div key={item.productId} className="flex items-start gap-3 bg-white p-2.5 rounded-lg border border-neutral-100">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-14 h-14 object-cover rounded bg-neutral-100 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-semibold text-neutral-900 truncate">
                                {item.title}
                              </h4>
                              <div className="text-[11px] text-neutral-500">
                                SKU: {item.sku}
                              </div>
                              {Object.keys(item.selectedAttributes).length > 0 && (
                                <div className="text-[10px] text-neutral-500 mt-0.5">
                                  {Object.entries(item.selectedAttributes)
                                    .map(([k, v]) => `${k}: ${v}`)
                                    .join(' · ')}
                                </div>
                              )}
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center border border-neutral-200 rounded">
                                  <button
                                    type="button"
                                    onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                                    className="px-2 py-0.5 text-xs text-neutral-600 hover:text-neutral-900"
                                  >
                                    -
                                  </button>
                                  <span className="px-2 text-xs font-medium tabular-nums">{item.quantity}</span>
                                  <button
                                    type="button"
                                    onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                                    className="px-2 py-0.5 text-xs text-neutral-600 hover:text-neutral-900"
                                  >
                                    +
                                  </button>
                                </div>

                                <div className="flex items-center gap-3">
                                  <span className="text-xs font-bold text-neutral-900 tabular-nums">
                                    KES {(item.priceKes * item.quantity).toLocaleString()}
                                  </span>
                                  <button
                                    onClick={() => onRemoveItem(item.productId)}
                                    className="text-neutral-400 hover:text-rose-600 transition-colors"
                                    aria-label="Remove item"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Kenyan Delivery & M-Pesa Checkout Details (5 cols) */}
          <div className="lg:col-span-5 p-6 bg-white flex flex-col justify-between">
            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                  Delivery & Contact Information
                </span>
                <span className="text-[11px] text-amber-800 font-medium">Kenya</span>
              </div>

              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2 text-xs text-rose-700">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                  Recipient Full Name
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    placeholder="e.g. Wambui Kariuki"
                  />
                </div>
              </div>

              {/* M-Pesa Phone */}
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                  M-Pesa Registered Number (STK Push target)
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    placeholder="e.g. 0720987654 or +254720987654"
                  />
                </div>
                <span className="text-[10px] text-neutral-500 mt-1 block">
                  You will receive a PIN prompt on this phone.
                </span>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                  Email Address (Receipt & Tracking)
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  placeholder="e.g. wambui@gmail.com"
                />
              </div>

              {/* County & Delivery Zone */}
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                  Kenya Delivery Zone (Courier Pricing)
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-3" />
                  <select
                    value={selectedZoneId}
                    onChange={(e) => setSelectedZoneId(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  >
                    {deliveryZones.map((z) => (
                      <option key={z.id} value={z.id}>
                        {z.name} (KES {z.feeKes}) · {z.estimatedDeliveryHours}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Street & Estate */}
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                  Street, Estate, Apartment / House No.
                </label>
                <input
                  type="text"
                  required
                  value={streetDetails}
                  onChange={(e) => setStreetDetails(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  placeholder="e.g. Rose Avenue, Green Oaks Court Apt 4B"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                  Special Delivery Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={buildingNotes}
                  onChange={(e) => setBuildingNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  placeholder="e.g. Call at the gate, guard has key"
                />
              </div>

              {/* Transparent Price Summary */}
              <div className="pt-4 border-t border-neutral-200 space-y-2 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>Items Subtotal</span>
                  <span className="tabular-nums font-medium">KES {itemsSubtotalKes.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Courier Delivery ({selectedZone?.county})</span>
                  <span className="tabular-nums font-medium">KES {deliveryFeeKes.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-neutral-900 pt-2 border-t border-neutral-200">
                  <span>Total Due (KES)</span>
                  <span className="tabular-nums text-amber-900">KES {totalAmountKes.toLocaleString()}</span>
                </div>
              </div>

              {/* Escrow Badge Notice */}
              <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-950 leading-relaxed">
                  <strong>Escrow Security:</strong> Your money remains locked on SokoSalama until each vendor fulfills their sub-order and you inspect your delivery.
                </p>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isLoading || cartItems.length === 0}
                className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 disabled:bg-neutral-300 text-white text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                {isLoading ? (
                  <span>Initiating Daraja STK Push...</span>
                ) : (
                  <>
                    <span>Pay KES {totalAmountKes.toLocaleString()} via M-Pesa</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>
          </div>

        </div>

      </div>
    </div>
  );
};
