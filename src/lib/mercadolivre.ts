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

// URLs dos produtos no Mercado Livre
const ML_LINKS: Record<string, string> = {
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

async function scrapeMLProductWithPuppeteer(url: string): Promise<ScrapedProductData | null> {
  try {
    console.log(`[ML SCRAPER] Starting Puppeteer for ${url}...`);

    // Verificar se estamos em ambiente Vercel
    const isVercel = process.env.VERCEL === '1';
    
    let browser;
    
    if (isVercel) {
      // Usar Chromium otimizado para Vercel
      const chromium = require('@sparticuz/chromium');
      const puppeteer = require('puppeteer-core');
      
      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      });
    } else {
      // Desenvolvimento local
      const puppeteer = require('puppeteer-core');
      browser = await puppeteer.launch({
        headless: true,
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu',
        ],
      });
    }

    const page = await browser.newPage();

    // Configurar user agent e viewport
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1920, height: 1080 });

    // Configurar extra headers
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    });

    console.log(`[ML SCRAPER] Navigating to ${url}...`);
    
    // Navegar para a página
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });

    // Esperar um pouco para garantir que o conteúdo carregou
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Extrair dados da página
    const data = await page.evaluate(() => {
      let price: number | null = null;
      let originalPrice: number | null = null;
      let ratingAverage: number | null = null;
      let reviewsTotal: number | null = null;

      // Tentar extrair preço atual
      const priceElements = document.querySelectorAll('.andes-money-amount__fraction');
      if (priceElements.length > 0) {
        const priceText = priceElements[0].textContent?.replace(/\./g, '') || '';
        const centsElement = document.querySelector('.andes-money-amount__cents');
        const centsText = centsElement?.textContent || '00';
        price = parseFloat(`${priceText}.${centsText}`);
      }

      // Tentar extrair preço original
      const originalPriceElement = document.querySelector('.andes-money-amount--previous .andes-money-amount__fraction');
      if (originalPriceElement) {
        const originalText = originalPriceElement.textContent?.replace(/\./g, '') || '';
        originalPrice = parseFloat(originalText);
      }

      // Tentar extrair rating
      const ratingElement = document.querySelector('.ui-pdp-review__rating');
      if (ratingElement) {
        ratingAverage = parseFloat(ratingElement.textContent?.trim() || '0');
      }

      // Tentar extrair total de reviews
      const reviewsElement = document.querySelector('.ui-pdp-review__amount');
      if (reviewsElement) {
        const reviewsText = reviewsElement.textContent?.replace(/\D/g, '') || '0';
        reviewsTotal = parseInt(reviewsText);
      }

      return { price, originalPrice, ratingAverage, reviewsTotal };
    });

    await browser.close();

    if (!data.price || isNaN(data.price) || data.price <= 0) {
      console.error(`[ML SCRAPER] Invalid price extracted: ${data.price}`);
      return null;
    }

    console.log(`[ML SCRAPER] Successfully scraped: R$ ${data.price}`);

    return {
      price: data.price,
      originalPrice: data.originalPrice && data.originalPrice > data.price ? data.originalPrice : undefined,
      ratingAverage: data.ratingAverage || undefined,
      reviewsTotal: data.reviewsTotal || undefined,
    };

  } catch (error) {
    console.error(`[ML SCRAPER] Error with Puppeteer:`, error);
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
    console.log('[ML UPDATE] Starting automatic price update with Puppeteer...');
    
    // Load current data
    const currentProducts = getStoredMLProducts();
    let updatedCount = 0;
    const updatedProducts: Record<string, MLProductData> = { ...currentProducts };

    // Scrape each product
    for (const [key, url] of Object.entries(ML_LINKS)) {
      console.log(`[ML UPDATE] Scraping ${key}...`);
      const scrapedData = await scrapeMLProductWithPuppeteer(url);
      
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

      // Wait between requests to avoid being blocked
      if (Object.keys(ML_LINKS).indexOf(key) < Object.keys(ML_LINKS).length - 1) {
        console.log('[ML UPDATE] Waiting 5 seconds before next request...');
        await new Promise(resolve => setTimeout(resolve, 5000));
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

