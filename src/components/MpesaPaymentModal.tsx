import React, { useState, useEffect } from 'react';
import { Smartphone, CheckCircle, XCircle, Loader2, ShieldCheck, ArrowRight, Receipt, Copy, Check } from 'lucide-react';
import { ParentOrder, SubOrder } from '../types';

interface MpesaPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: ParentOrder | null;
  subOrders: SubOrder[];
  onConfirmCallback: (checkoutRequestId: string, mpesaReceiptNumber: string, resultCode: number) => Promise<any>;
  onPaymentSuccessRedirect: () => void;
}

export const MpesaPaymentModal: React.FC<MpesaPaymentModalProps> = ({
  isOpen,
  onClose,
  order,
  subOrders,
  onConfirmCallback,
  onPaymentSuccessRedirect,
}) => {
  if (!isOpen || !order) return null;

  const [simulatingStatus, setSimulatingStatus] = useState<'prompting' | 'processing' | 'success' | 'failed'>('prompting');
  const [receiptNumber, setReceiptNumber] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedReceipt, setCopiedReceipt] = useState(false);

  // Generate simulated Safaricom receipt
  useEffect(() => {
    if (!receiptNumber) {
      setReceiptNumber('QKM' + Math.floor(1000000 + Math.random() * 9000000));
    }
  }, [receiptNumber]);

  const handleSimulatePinSuccess = async () => {
    setSimulatingStatus('processing');
    setErrorMessage(null);
    try {
      const checkoutReqId = order.mpesaDetails?.checkoutRequestId || 'ws_CO_' + order.id;
      const res = await onConfirmCallback(checkoutReqId, receiptNumber, 0);
      if (res && res.success) {
        setSimulatingStatus('success');
      } else {
        setSimulatingStatus('failed');
        setErrorMessage(res?.message || 'Payment rejected by network');
      }
    } catch (err: any) {
      setSimulatingStatus('failed');
      setErrorMessage(err.message || 'Payment verification failed');
    }
  };

  const handleSimulateCancel = async () => {
    setSimulatingStatus('processing');
    try {
      const checkoutReqId = order.mpesaDetails?.checkoutRequestId || 'ws_CO_' + order.id;
      await onConfirmCallback(checkoutReqId, '', 1032);
      setSimulatingStatus('failed');
      setErrorMessage('User cancelled the M-Pesa PIN prompt on their handset.');
    } catch (err: any) {
      setSimulatingStatus('failed');
      setErrorMessage(err.message);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedReceipt(true);
    setTimeout(() => setCopiedReceipt(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-neutral-200 animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Safaricom Brand Header */}
        <div className="bg-[#008751] text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">Safaricom M-Pesa Express</h3>
              <p className="text-xs text-emerald-100">STK Push Verification Service</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-white/20 rounded text-white tabular-nums">
            KES {order.totalAmountKes.toLocaleString()}
          </span>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          
          {/* Prompting State */}
          {simulatingStatus === 'prompting' && (
            <div className="space-y-5 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center animate-pulse">
                <Smartphone className="w-8 h-8 text-emerald-700" />
              </div>

              <div>
                <h4 className="text-base font-bold text-neutral-900 mb-1">
                  Check Your Phone Now
                </h4>
                <p className="text-xs text-neutral-600 max-w-sm mx-auto leading-relaxed">
                  An M-Pesa prompt has been dispatched to{' '}
                  <span className="font-semibold text-neutral-900">{order.customerPhone}</span>.
                  Enter your secret M-Pesa PIN on your phone to authorize this payment.
                </p>
              </div>

              {/* Technical Daraja Payload Details */}
              <div className="bg-neutral-50 rounded-lg p-3 text-left border border-neutral-200 text-xs space-y-1">
                <div className="flex justify-between text-neutral-500">
                  <span>Merchant Request ID:</span>
                  <span className="font-mono text-neutral-800">{order.mpesaDetails?.merchantRequestId}</span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>Checkout Request ID:</span>
                  <span className="font-mono text-neutral-800 truncate max-w-[200px]">
                    {order.mpesaDetails?.checkoutRequestId}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>Paybill / Escrow Account:</span>
                  <span className="font-mono text-neutral-800">SokoSalama 408221</span>
                </div>
              </div>

              {/* Simulator Action Controls */}
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={handleSimulatePinSuccess}
                  className="w-full py-2.5 px-4 bg-[#008751] hover:bg-[#007043] text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Simulate: Customer Enters PIN (Success Callback)</span>
                </button>

                <button
                  type="button"
                  onClick={handleSimulateCancel}
                  className="w-full py-2 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                >
                  Simulate: User Cancels PIN Prompt
                </button>
              </div>
            </div>
          )}

          {/* Processing State */}
          {simulatingStatus === 'processing' && (
            <div className="py-8 text-center space-y-4">
              <Loader2 className="w-10 h-10 text-emerald-700 animate-spin mx-auto" />
              <div>
                <h4 className="text-sm font-bold text-neutral-900">Verifying Daraja Callback...</h4>
                <p className="text-xs text-neutral-500 mt-1">
                  Checking server-side idempotency, verifying transaction receipt, and locking funds in escrow.
                </p>
              </div>
            </div>
          )}

          {/* Success State */}
          {simulatingStatus === 'success' && (
            <div className="space-y-5 text-center">
              <div className="mx-auto w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-lg font-bold text-neutral-900">
                  M-Pesa Payment Confirmed!
                </h4>
                <p className="text-xs text-neutral-600 mt-1">
                  Order <span className="font-bold text-neutral-900">{order.orderNumber}</span> has been created.
                  Funds are secured in platform escrow.
                </p>
              </div>

              {/* Kenyan M-Pesa SMS simulation receipt */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 text-left text-xs space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-emerald-200/80">
                  <div className="flex items-center gap-1.5 text-emerald-950 font-bold">
                    <Receipt className="w-4 h-4 text-emerald-800" />
                    <span>M-PESA Confirmation SMS</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(receiptNumber)}
                    className="text-emerald-800 hover:text-emerald-950 text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    {copiedReceipt ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedReceipt ? 'Copied' : receiptNumber}</span>
                  </button>
                </div>

                <p className="font-mono text-[11px] text-neutral-800 leading-relaxed">
                  {receiptNumber} Confirmed. Ksh {order.totalAmountKes.toLocaleString()} sent to SOKOSALAMA ESCROW for Order {order.orderNumber} on {new Date().toLocaleDateString('en-GB')} at {new Date().toLocaleTimeString('en-KE')}. Balance is private.
                </p>
              </div>

              {/* Sub-Orders split summary */}
              <div className="bg-neutral-50 rounded-lg p-3 text-left border border-neutral-200 text-xs space-y-1.5">
                <div className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Sub-Orders Dispatched to Vendors ({subOrders.length}):
                </div>
                {subOrders.map((so) => (
                  <div key={so.id} className="flex justify-between items-center text-neutral-600 py-0.5">
                    <span className="font-medium text-neutral-900">{so.vendorName}</span>
                    <span className="tabular-nums">KES {so.subtotalKes.toLocaleString()} (Escrow Locked)</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onPaymentSuccessRedirect}
                  className="w-full py-3 px-4 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Go to My Orders & Tracking</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Failed State */}
          {simulatingStatus === 'failed' && (
            <div className="space-y-4 text-center">
              <div className="mx-auto w-14 h-14 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center">
                <XCircle className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-base font-bold text-neutral-900">Payment Not Completed</h4>
                <p className="text-xs text-rose-600 mt-1">
                  {errorMessage || 'The payment could not be confirmed.'}
                </p>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setSimulatingStatus('prompting')}
                  className="flex-1 py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Retry STK Push
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="py-2.5 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer info */}
        <div className="bg-neutral-50 px-6 py-3 border-t border-neutral-200 flex items-center justify-between text-[11px] text-neutral-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Encrypted Kenyan Escrow Protocol</span>
          </div>
          <span>Safaricom Daraja B2C/C2B</span>
        </div>

      </div>
    </div>
  );
};
