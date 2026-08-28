import mlPricesData from "@/data/ml_prices.json";
import fs from "fs";
import path from "path";

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

const ML_LINKS = {
  miniBike: "https://www.mercadolivre.com.br/ultimate-fitness-mini-bike-bicicleta-ergometrica/up/MLBU2934790909",
  spinning: "https://www.mercadolivre.com.br/ultimate-fitness-bicicleta-ergometrica-spinning/up/MLBU3325822548",
  miniBike2: "https://www.mercadolivre.com.br/ultimate-fitness-mini-bike-bicicleta-ergometrica/up/MLBU2954483127",
};

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

interface ScrapedProductData {
  price: number;
  originalPrice?: number;
  ratingAverage?: number;
  reviewsTotal?: number;
}

async function scrapeMLProduct(url: string): Promise<ScrapedProductData | null> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(`[ML SCRAPER] Failed to fetch ${url}: ${response.status}`);
      return null;
    }

    const html = await response.text();

    // Extract price using regex (more reliable than DOM parsing in serverless)
    const priceMatch = html.match(/<span class="andes-money-amount__fraction[^"]*">([^<]+)<\/span>/);
    const centsMatch = html.match(/<span class="andes-money-amount__cents[^"]*">([^<]+)<\/span>/);
    
    let price: number | null = null;
    if (priceMatch && priceMatch[1]) {
      const cleanFraction = priceMatch[1].replace(/\./g, '').trim();
      const cleanCents = centsMatch && centsMatch[1] ? centsMatch[1].trim() : '00';
      price = parseFloat(`${cleanFraction}.${cleanCents}`);
    }

    // Extract original price
    const originalPriceMatch = html.match(/<s[^>]*class="[^"]*andes-money-amount--previous[^"]*"[^>]*>.*?<span class="andes-money-amount__fraction[^"]*">([^<]+)<\/span>/s);
    let originalPrice: number | null = null;
    if (originalPriceMatch && originalPriceMatch[1]) {
      originalPrice = parseFloat(originalPriceMatch[1].replace(/\./g, '').trim());
    }

    // Extract rating
    const ratingMatch = html.match(/<span class="ui-pdp-review__rating[^"]*">([^<]+)<\/span>/);
    const ratingAverage = ratingMatch && ratingMatch[1] ? parseFloat(ratingMatch[1].trim()) : undefined;

    // Extract review count
    const reviewsMatch = html.match(/<span class="ui-pdp-review__amount[^"]*">.*?(\d+).*?<\/span>/);
    const reviewsTotal = reviewsMatch && reviewsMatch[1] ? parseInt(reviewsMatch[1]) : undefined;

    if (!price || isNaN(price)) {
      console.error(`[ML SCRAPER] Could not extract price from ${url}`);
      return null;
    }

    return {
      price,
      originalPrice: originalPrice && originalPrice > price ? originalPrice : undefined,
      ratingAverage,
      reviewsTotal,
    };
  } catch (error) {
    console.error(`[ML SCRAPER] Error scraping ${url}:`, error);
    return null;
  }
}

export async function updateMLPrices(): Promise<{
  success: boolean;
  error?: string;
  updatedCount?: number;
  lastUpdated?: string;
}> {
  try {
    console.log('[ML UPDATE] Starting price update process...');
    
    // Load current data
    const currentProducts = getStoredMLProducts();
    let updatedCount = 0;
    const updatedProducts: Record<string, MLProductData> = { ...currentProducts };

    // Scrape each product
    for (const [key, url] of Object.entries(ML_LINKS)) {
      console.log(`[ML UPDATE] Scraping ${key}...`);
      const scrapedData = await scrapeMLProduct(url);
      
      if (scrapedData) {
        // Update existing product or create new one
        const existingProduct = updatedProducts[key];
        updatedProducts[key] = {
          ...existingProduct,
          id: key,
          price: scrapedData.price,
          originalPrice: scrapedData.originalPrice,
          ratingAverage: scrapedData.ratingAverage || existingProduct?.ratingAverage,
          reviewsTotal: scrapedData.reviewsTotal || existingProduct?.reviewsTotal,
          permalink: url,
          currencyId: 'BRL',
          // Keep other fields from existing data
          title: existingProduct?.title || `Produto ${key}`,
          soldQuantity: existingProduct?.soldQuantity || 0,
          freeShipping: existingProduct?.freeShipping || true,
        };
        updatedCount++;
        console.log(`[ML UPDATE] ${key} updated: R$ ${scrapedData.price}`);
      } else {
        console.warn(`[ML UPDATE] Failed to scrape ${key}, keeping old data`);
      }
    }

    const lastUpdated = new Date().toISOString();
    
    // Write updated data to JSON file
    const jsonPath = path.join(process.cwd(), 'src', 'data', 'ml_prices.json');
    const dataToWrite = {
      lastUpdated,
      products: updatedProducts,
    };
    
    fs.writeFileSync(jsonPath, JSON.stringify(dataToWrite, null, 2), 'utf-8');
    console.log(`[ML UPDATE] Successfully updated ${updatedCount} products`);

    return {
      success: true,
      updatedCount,
      lastUpdated,
    };
  } catch (error) {
    console.error('[ML UPDATE] Fatal error during price update:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

