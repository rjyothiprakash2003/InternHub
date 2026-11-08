import { calculatePrice } from "../lib/pricing";
import { calculateEndDate } from "../lib/duration";

function assert(condition: unknown, message: string) {
  if (!condition) throw new Error(message);
}

const threeMonth = calculatePrice({ originalPrice: 300, discountPercent: 50 });
assert(threeMonth.discountAmount === 150, "50% of 300 should be 150");
assert(threeMonth.finalPrice === 150, "Final price should be 150");
assert(threeMonth.totalAmount === 150, "Total should be 150 without tax");

const promo = calculatePrice({ originalPrice: 300, promotionalPrice: 150 });
assert(promo.discountPercent === 50, "Promotional price should imply 50% off");

const end = calculateEndDate(new Date("2026-09-01T00:00:00.000Z"), {
  key: "6-weeks",
  label: "6 Weeks",
  unit: "WEEKS",
  amount: 6,
});
assert(end.toISOString().slice(0, 10) === "2026-10-13", `Expected 2026-10-13, got ${end.toISOString().slice(0, 10)}`);

console.log("InternHub pricing and duration checks passed.");
