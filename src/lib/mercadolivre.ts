import mlPricesData from "@/data/ml_prices.json";

export interface MLProductData {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  soldQuantity: number;
  ratingAverage?: number;
  reviewsTotal?: number;
  freeShipping?: boolean;
  permalink: string;
  currencyId: string;
}

export function getStoredMLProducts(): Record<string, MLProductData> {
  const products = mlPricesData?.products || {};
  return products as Record<string, MLProductData>;
}

export function extractMLBId(url: string): string | null {
  const match = url.match(/MLB[UB]?\d+/);
  return match ? match[0] : null;
}

export function formatMLPrice(price: number, currencyId: string = "BRL"): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: currencyId,
  }).format(price);
}

export function calculateDiscount(originalPrice?: number, currentPrice?: number): number {
  if (!originalPrice || !currentPrice || originalPrice <= currentPrice) {
    return 0;
  }
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}

