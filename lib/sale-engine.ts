import { Product } from "./types";

type SaleSeason = {
  name: string;
  categories: string[];
  rooms: string[];
  lift: number;
};

const seasons: SaleSeason[] = [
  { name: "New Year refresh", categories: ["Storage", "Desks"], rooms: ["Office", "Living room"], lift: 16 },
  { name: "Spring reset", categories: ["Chairs", "Storage"], rooms: ["Bedroom / Living", "Living room"], lift: 13 },
  { name: "Summer hosting", categories: ["Tables", "Sofas"], rooms: ["Dining room", "Living room"], lift: 15 },
  { name: "Back-to-work", categories: ["Desks", "Chairs"], rooms: ["Office", "Bedroom / Living"], lift: 18 },
  { name: "Holiday hosting", categories: ["Tables", "Sofas", "Storage"], rooms: ["Dining room", "Living room"], lift: 20 }
];

function seasonForDate(date: Date) {
  const month = date.getUTCMonth() + 1;
  if (month <= 2) return seasons[0];
  if (month <= 5) return seasons[1];
  if (month <= 8) return seasons[2];
  if (month <= 10) return seasons[3];
  return seasons[4];
}

function dayDemand(date: Date) {
  const dayOfYear = Math.floor((Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) - Date.UTC(date.getUTCFullYear(), 0, 0)) / 86400000);
  return Math.sin((dayOfYear / 365) * Math.PI * 2) * 7;
}

export function getSaleRecommendations(products: Product[], date = new Date()) {
  const season = seasonForDate(date);
  const demandWave = dayDemand(date);

  return products
    .map((product) => {
      const margin = product.price - product.supplierCost;
      const safeDiscountCap = Math.max(0, product.price - product.supplierCost - 100);
      const seasonalFit = season.categories.includes(product.category) || season.rooms.includes(product.room) ? season.lift : 0;
      const engagement = product.visits * 0.08 + product.likes * 0.9 + product.bought * 1.2;
      const stockPressure = Math.max(0, product.stock - 10) * 0.9;
      const conversionGap = product.visits > 0 ? Math.max(0, 1 - product.bought / product.visits) * 14 : 5;
      const score = product.trendScore + seasonalFit + demandWave + engagement + stockPressure + conversionGap + margin * 0.04;
      const suggestedDiscount = Math.min(safeDiscountCap, Math.max(10, Math.round((seasonalFit + stockPressure + conversionGap) / 5) * 5));
      const salePrice = product.price - suggestedDiscount;
      return {
        product,
        season: season.name,
        score: Math.round(score),
        suggestedDiscount,
        salePrice,
        projectedProfit: salePrice - product.supplierCost,
        reason: [
          seasonalFit ? `${season.name} demand` : "steady baseline demand",
          product.stock > 10 ? "healthy stock to promote" : "limited stock",
          product.likes > 20 ? "strong wishlist signal" : "needs more attention",
          conversionGap > 10 ? "sale can improve conversion" : "already converting"
        ].join(" · ")
      };
    })
    .sort((a, b) => b.score - a.score);
}
