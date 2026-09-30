import React, { useState } from 'react';
import { Package, Truck, ShieldCheck, CheckCircle2, Clock, AlertTriangle, ExternalLink } from 'lucide-react';
import { ParentOrder, SubOrder, UserSession } from '../types';

interface CustomerOrdersProps {
  parentOrders: ParentOrder[];
  subOrders: SubOrder[];
  onConfirmDelivery: (subOrderId: string) => Promise<void>;
  currentSession: UserSession;
}

export const CustomerOrders: React.FC<CustomerOrdersProps> = ({
  parentOrders,
  subOrders,
  onConfirmDelivery,
}) => {
  const [processingSubOrderId, setProcessingSubOrderId] = useState<string | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const handleConfirm = async (subOrderId: string) => {
    setProcessingSubOrderId(subOrderId);
    setActionSuccessMsg(null);
    try {
      await onConfirmDelivery(subOrderId);
      setActionSuccessMsg('Delivery confirmed! Vendor escrow earnings have been safely released to their wallet.');
      setTimeout(() => setActionSuccessMsg(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to confirm delivery');
    } finally {
      setProcessingSubOrderId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
            Order Tracking & Escrow Confirmations
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Track multi-vendor fulfillment and release funds to artisans once delivered
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-neutral-600 bg-neutral-100 px-3 py-1.5 rounded-lg border border-neutral-200">
          <ShieldCheck className="w-4 h-4 text-amber-800" />
          <span>Active Escrow Middleman Active</span>
        </div>
      </div>

      {actionSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-xs text-emerald-800 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {parentOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-neutral-200">
          <Package className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-neutral-900">No Orders Yet</h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            When you purchase items through SokoSalama, your parent order and individual vendor sub-orders will be tracked here.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {parentOrders.map((parent) => {
            const relatedSubOrders = subOrders.filter((so) => so.parentOrderId === parent.id);

            return (
              <div
                key={parent.id}
                className="bg-white rounded-xl border border-neutral-200 shadow-2xs overflow-hidden"
              >
                {/* Parent Order Header */}
                <div className="bg-neutral-50 p-4 sm:p-5 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-neutral-900 text-sm">{parent.orderNumber}</span>
                      <span className="text-neutral-400">·</span>
                      <span className="text-xs text-neutral-500">
                        {new Date(parent.createdAt).toLocaleDateString('en-KE', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="text-neutral-400">·</span>
                      <span className="text-xs font-semibold text-emerald-700 uppercase">
                        {parent.paymentStatus === 'paid' ? 'M-Pesa Verified (Paid)' : parent.paymentStatus}
                      </span>
                    </div>

                    <div className="text-[11px] text-neutral-500">
                      Receipt: <span className="font-mono text-neutral-800">{parent.mpesaDetails?.mpesaReceiptNumber || 'Pending'}</span> · Deliver to: {parent.deliveryAddress.town}, {parent.deliveryAddress.county}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-neutral-500">Total Paid</div>
                    <div className="text-base font-bold text-neutral-900 tabular-nums">
                      KES {parent.totalAmountKes.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Vendor Sub-Orders List */}
                <div className="p-4 sm:p-6 space-y-6">
                  <div className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                    Vendor Sub-Orders ({relatedSubOrders.length})
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {relatedSubOrders.map((sub) => (
                      <div
                        key={sub.id}
                        className="bg-neutral-50/60 rounded-xl p-4 sm:p-5 border border-neutral-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        {/* Items & Vendor Info */}
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center justify-between md:justify-start gap-4">
                            <span className="font-bold text-neutral-900 text-xs">{sub.vendorName}</span>
                            <span className="text-neutral-300">|</span>
                            <span className="text-xs text-neutral-500">Sub-Order #{sub.id}</span>
                          </div>

                          <div className="space-y-2">
                            {sub.items.map((item) => (
                              <div key={item.productId} className="flex items-center gap-3">
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-10 h-10 object-cover rounded bg-neutral-100 shrink-0"
                                />
                                <div>
                                  <div className="text-xs font-semibold text-neutral-900">{item.title}</div>
                                  <div className="text-[11px] text-neutral-500">
                                    Qty: {item.quantity} · KES {item.unitPriceKes.toLocaleString()} each
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Fulfillment Status & Tracking */}
                          <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
                            <span className="flex items-center gap-1 font-medium">
                              {sub.fulfillmentStatus === 'pending' && (
                                <span className="text-amber-800 flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>Pending Dispatch</span>
                                </span>
                              )}
                              {sub.fulfillmentStatus === 'dispatched' && (
                                <span className="text-blue-800 flex items-center gap-1 font-semibold">
                                  <Truck className="w-3.5 h-3.5" />
                                  <span>In Transit ({sub.courierPartner || 'Courier'})</span>
                                </span>
                              )}
                              {sub.fulfillmentStatus === 'delivered' && (
                                <span className="text-emerald-700 flex items-center gap-1 font-semibold">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Delivered & Escrow Released</span>
                                </span>
                              )}
                            </span>

                            {sub.trackingReference && (
                              <span className="text-neutral-500 flex items-center gap-1">
                                <span>Tracking Ref:</span>
                                <span className="font-mono text-neutral-800 font-semibold">{sub.trackingReference}</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Customer Action (Confirm Delivery to Release Escrow) */}
                        <div className="md:w-64 flex flex-col justify-center items-start md:items-end gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-neutral-200">
                          <div className="text-xs text-neutral-500">
                            Subtotal: <span className="font-semibold text-neutral-900 tabular-nums">KES {sub.subtotalKes.toLocaleString()}</span>
                          </div>

                          {sub.fulfillmentStatus === 'dispatched' && (
                            <button
                              type="button"
                              disabled={processingSubOrderId === sub.id}
                              onClick={() => handleConfirm(sub.id)}
                              className="w-full py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs text-center"
                            >
                              {processingSubOrderId === sub.id
                                ? 'Releasing Escrow...'
                                : 'Confirm Delivery & Release Funds'}
                            </button>
                          )}

                          {sub.fulfillmentStatus === 'pending' && (
                            <span className="text-[11px] text-neutral-500 italic">
                              Awaiting artisan packaging & dispatch
                            </span>
                          )}

                          {sub.fulfillmentStatus === 'delivered' && (
                            <div className="flex items-center gap-1 text-[11px] text-emerald-800 font-medium">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>Escrow Completed</span>
                            </div>
                          )}
                        </div>

                      </div>
                    ))}
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
