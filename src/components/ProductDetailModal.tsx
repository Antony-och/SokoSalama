import React, { useState } from 'react';
import { X, Check, ShieldCheck, Truck, Star, ArrowRight } from 'lucide-react';
import { Product, ProductReview } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, selectedAttributes: Record<string, string>) => void;
  reviews: ProductReview[];
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  reviews,
}) => {
  if (!product) return null;

  // Selected attributes state
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    product.attributes.forEach((attr) => {
      if (attr.options.length > 0) {
        initial[attr.name] = attr.options[0];
      }
    });
    return initial;
  });

  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  const productReviews = reviews.filter((r) => r.productId === product.id);

  const handleAddToCart = () => {
    onAddToCart(product, quantity, selectedAttributes);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-md flex items-center justify-center p-4">
      <div 
        className="relative bg-white/90 backdrop-blur-3xl rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.25)] max-w-3xl w-full overflow-hidden border border-white/90 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Specular Hairline Top Edge */}
        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent opacity-90 z-20 pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-neutral-500 hover:text-neutral-900 bg-white/80 hover:bg-white backdrop-blur-md rounded-full border border-white/80 shadow-xs transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Column */}
          <div className="bg-neutral-100/60 backdrop-blur-md flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-neutral-200/70">
            <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-neutral-200 shadow-xs">
              <img
                src={product.images[0]}
                alt={product.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect fill="%23f1f1ef" width="400" height="300"/><text fill="%23888888" font-family="sans-serif" font-size="16" dy="10.5" font-weight="bold" x="50%" y="50%" text-anchor="middle">SokoSalama Product</text></svg>';
                }}
              />
            </div>
          </div>

          {/* Product Details Column */}
          <div className="p-6 md:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            <div>
              {/* Category & Vendor metadata with typographic separators (Zero-Pill) */}
              <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2 flex-wrap">
                {product.brand && (
                  <>
                    <span className="font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded text-[11px] tracking-wide">
                      {product.brand}
                    </span>
                    <span aria-hidden="true">·</span>
                  </>
                )}
                <span>{product.category}</span>
                {product.condition && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="capitalize font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                      {product.condition}
                    </span>
                  </>
                )}
                <span aria-hidden="true">·</span>
                <span className="text-amber-800 font-medium">{product.vendorName}</span>
                <span aria-hidden="true">·</span>
                <span>SKU: {product.sku}</span>
              </div>

              <h2 className="text-xl font-bold text-neutral-900 tracking-tight mb-2 leading-snug">
                {product.title}
              </h2>

              {/* Price & Rating */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-100">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-neutral-900 tabular-nums">
                    KES {product.priceKes.toLocaleString()}
                  </span>
                  {product.compareAtPriceKes && (
                    <span className="text-sm text-neutral-400 line-through tabular-nums">
                      KES {product.compareAtPriceKes.toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-xs text-neutral-700">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span className="font-semibold tabular-nums">{product.rating.toFixed(1)}</span>
                  <span className="text-neutral-400">({product.reviewsCount} reviews)</span>
                </div>
              </div>

              <p className="text-sm text-neutral-600 leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Variant Selectors */}
              {product.attributes.map((attr) => (
                <div key={attr.name} className="mb-4">
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
                    {attr.name}: <span className="font-normal text-neutral-900">{selectedAttributes[attr.name]}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {attr.options.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setSelectedAttributes({ ...selectedAttributes, [attr.name]: opt })}
                        className={`px-3 py-1.5 text-xs font-medium rounded border transition-colors cursor-pointer ${
                          selectedAttributes[attr.name] === opt
                            ? 'bg-neutral-900 text-white border-neutral-900'
                            : 'bg-white text-neutral-700 border-neutral-300 hover:border-neutral-400'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Stock and Quantity */}
              <div className="flex items-center gap-4 mb-6 pt-2">
                <div className="flex items-center border border-neutral-300 rounded-md bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-sm font-semibold text-neutral-600 hover:text-neutral-900 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-sm font-semibold text-neutral-900 tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                    className="px-3 py-1 text-sm font-semibold text-neutral-600 hover:text-neutral-900 cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <div className="text-xs text-neutral-500">
                  {product.stockQuantity > 0 ? (
                    <span className="text-emerald-700 font-medium">In Stock ({product.stockQuantity} units available)</span>
                  ) : (
                    <span className="text-rose-600 font-medium">Sold Out</span>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions & Trust Guarantees */}
            <div className="space-y-3 pt-4 border-t border-neutral-200">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stockQuantity <= 0}
                className={`w-full py-3 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  addedNotice
                    ? 'bg-emerald-700 text-white'
                    : 'bg-amber-700 hover:bg-amber-800 text-white shadow-xs'
                }`}
              >
                {addedNotice ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <span>Add to Cart</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-500 pt-1">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>Escrow: Payment released on delivery</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
                  <span>Doorstep Nairobi / Countrywide G4S</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Customer Reviews Section */}
        {productReviews.length > 0 && (
          <div className="bg-neutral-50/70 backdrop-blur-md p-6 border-t border-white/80">
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-3">
              Verified Buyer Reviews
            </h3>
            <div className="space-y-3">
              {productReviews.map((rev) => (
                <div key={rev.id} className="text-xs bg-white/85 backdrop-blur-md p-3.5 rounded-xl border border-white/90 shadow-2xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-neutral-900">{rev.customerName}</span>
                    <span className="text-neutral-400 font-mono text-[11px]">{rev.customerPhoneMasked}</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-600 mb-1">
                    {'★'.repeat(rev.rating)}
                    <span className="text-neutral-500 text-[10px] ml-1 font-medium">· Verified Escrow Purchase</span>
                  </div>
                  <p className="text-neutral-600 leading-normal">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
