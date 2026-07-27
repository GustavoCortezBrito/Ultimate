const fs = require('fs');
const path = require('path');

const ML_LINKS = {
  miniBike: "https://www.mercadolivre.com.br/ultimate-fitness-mini-bike-bicicleta-ergometrica/up/MLBU2934790909",
  spinning: "https://www.mercadolivre.com.br/ultimate-fitness-bicicleta-ergometrica-spinning/up/MLBU3325822548",
  miniBike2: "https://www.mercadolivre.com.br/ultimate-fitness-mini-bike-bicicleta-ergometrica/up/MLBU2954483127",
};

const JSON_PATH = path.join(__dirname, '../src/data/ml_prices.json');

async function scrapeWithPlaywright() {
  let playwright;
  try {
    playwright = require('playwright');
  } catch (e) {
    console.log('[UPDATE] Playwright not installed. Falling back to HTTP cheerio scraper...');
    return null;
  }

  console.log('[UPDATE] Launching Playwright browser...');
  const browser = await playwright.chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 },
    locale: 'pt-BR',
  });

  const scrapedProducts = {};

  for (const [key, url] of Object.entries(ML_LINKS)) {
    console.log(`[UPDATE] Processing ${key}: ${url}`);
    const page = await context.newPage();
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(2000);

      // Extract current price (fraction and cents)
      const fractionText = await page.locator('.andes-money-amount__fraction').first().textContent().catch(() => null);
      const centsText = await page.locator('.andes-money-amount__cents').first().textContent().catch(() => '00');
      
      let price = null;
      if (fractionText) {
        const cleanFraction = fractionText.replace(/\./g, '').trim();
        const cleanCents = centsText ? centsText.trim() : '00';
        price = parseFloat(`${cleanFraction}.${cleanCents}`);
      }

      // Extract previous/original price
      const prevFractionText = await page.locator('.andes-money-amount--previous .andes-money-amount__fraction').first().textContent().catch(() => null);
      let originalPrice = null;
      if (prevFractionText) {
        originalPrice = parseFloat(prevFractionText.replace(/\./g, '').trim());
      }

      // Extract rating and review count
      const ratingText = await page.locator('.ui-pdp-review__rating').first().textContent().catch(() => null);
      const ratingAverage = ratingText ? parseFloat(ratingText.trim()) : undefined;

      const reviewsText = await page.locator('.ui-pdp-review__amount').first().textContent().catch(() => null);
      const reviewsTotal = reviewsText ? parseInt(reviewsText.replace(/\D/g, '')) : undefined;

      if (price && !isNaN(price)) {
        scrapedProducts[key] = {
          price,
          originalPrice: originalPrice && originalPrice > price ? originalPrice : undefined,
          ratingAverage,
          reviewsTotal,
        };
        console.log(`[UPDATE] ${key} -> Price: R$ ${price} | Original: ${originalPrice ? 'R$ ' + originalPrice : 'N/A'}`);
      } else {
        console.warn(`[UPDATE] Could not extract price for ${key}`);
      }
    } catch (err) {
      console.error(`[UPDATE] Error scraping ${key}:`, err.message);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  return Object.keys(scrapedProducts).length > 0 ? scrapedProducts : null;
}

async function updatePrices() {
  console.log('[UPDATE] Starting 24h Mercado Livre price update process...');
  
  // Read existing json data
  let currentData = { products: {} };
  if (fs.existsSync(JSON_PATH)) {
    try {
      currentData = JSON.parse(fs.readFileSync(JSON_PATH, 'utf-8'));
    } catch (e) {
      console.error('[UPDATE] Error reading existing JSON:', e);
    }
  }

  // Attempt scraping via Playwright
  const scraped = await scrapeWithPlaywright();

  if (scraped) {
    for (const [key, data] of Object.entries(scraped)) {
      if (!currentData.products[key]) {
        currentData.products[key] = { id: key, permalink: ML_LINKS[key], currencyId: 'BRL' };
      }
      currentData.products[key].price = data.price;
      if (data.originalPrice) currentData.products[key].originalPrice = data.originalPrice;
      if (data.ratingAverage) currentData.products[key].ratingAverage = data.ratingAverage;
      if (data.reviewsTotal) currentData.products[key].reviewsTotal = data.reviewsTotal;
    }
  }

  currentData.lastUpdated = new Date().toISOString();

  // Save updated JSON
  fs.writeFileSync(JSON_PATH, JSON.stringify(currentData, null, 2), 'utf-8');
  console.log('[UPDATE] Prices file successfully updated at:', JSON_PATH);
}

if (require.main === module) {
  updatePrices().catch(err => {
    console.error('[UPDATE] Fatal error during price update:', err);
    process.exit(1);
  });
}

module.exports = { updatePrices };
