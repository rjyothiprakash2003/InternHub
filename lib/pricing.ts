export type PriceBreakdown = {
  originalPrice: number;
  discountPercent: number;
  discountAmount: number;
  taxPercent: number;
  taxAmount: number;
  finalPrice: number;
  totalAmount: number;
};

export type PricingInput = {
  originalPrice: number;
  promotionalPrice?: number | null;
  discountPercent?: number | null;
  couponPercent?: number | null;
  couponFixed?: number | null;
  taxPercent?: number | null;
};

function roundINR(value: number) {
  return Math.max(0, Math.round(value));
}

/**
 * Canonical InternHub pricing calculation.
 * Original price is the list price. Discount can come from a plan or coupon.
 * If a promotionalPrice is provided and no extra coupon is applied, the
 * promotional price is treated as the payable amount (already-discounted).
 */
export function calculatePrice(input: PricingInput): PriceBreakdown {
  const originalPrice = roundINR(input.originalPrice);
  if (originalPrice < 0) {
    throw new Error("Original price cannot be negative.");
  }

  let discountPercent = 0;
  let discountAmount = 0;
  let finalPrice = originalPrice;

  const couponPercent = input.couponPercent ?? null;
  const couponFixed = input.couponFixed ?? null;
  const hasCoupon = (couponPercent != null && couponPercent > 0) || (couponFixed != null && couponFixed > 0);

  if (hasCoupon) {
    if (couponPercent != null && couponPercent > 0) {
      discountPercent = Math.min(100, Math.max(0, couponPercent));
      discountAmount = roundINR((originalPrice * discountPercent) / 100);
    } else if (couponFixed != null && couponFixed > 0) {
      discountAmount = Math.min(originalPrice, roundINR(couponFixed));
      discountPercent = originalPrice === 0 ? 0 : roundINR((discountAmount / originalPrice) * 100);
    }
    finalPrice = originalPrice - discountAmount;
  } else if (input.promotionalPrice != null) {
    finalPrice = roundINR(input.promotionalPrice);
    discountAmount = Math.max(0, originalPrice - finalPrice);
    discountPercent =
      originalPrice === 0 ? 0 : roundINR((discountAmount / originalPrice) * 100);
  } else if (input.discountPercent != null && input.discountPercent > 0) {
    discountPercent = Math.min(100, Math.max(0, input.discountPercent));
    discountAmount = roundINR((originalPrice * discountPercent) / 100);
    finalPrice = originalPrice - discountAmount;
  }

  const taxPercent = Math.max(0, input.taxPercent ?? 0);
  const taxAmount = roundINR((finalPrice * taxPercent) / 100);
  const totalAmount = finalPrice + taxAmount;

  return {
    originalPrice,
    discountPercent,
    discountAmount,
    taxPercent,
    taxAmount,
    finalPrice,
    totalAmount,
  };
}

export function formatPriceBreakdown(breakdown: PriceBreakdown) {
  return {
    originalPriceLabel: `Original Price: ₹${breakdown.originalPrice}`,
    discountLabel: `${breakdown.discountPercent}% OFF: -₹${breakdown.discountAmount}`,
    youPayLabel: `You Pay: ₹${breakdown.totalAmount}`,
  };
}
