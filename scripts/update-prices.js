const fs = require('fs');
const path = require('path');

// Mapeamento dos produtos com IDs reais e URLs do Mercado Livre
const ML_PRODUCTS = {
  miniBike: {
    id: "5247689130",
    sku: "UFMBC",
    name: "Mini Bike Cinza",
    urls: [
      "https://www.mercadolivre.com.br/ultimate-fitness-mini-bike-bicicleta-ergometrica/up/MLBU2934790909",
      "https://produto.mercadolivre.com.br/MLB-5247689130"
    ]
  },
  miniBike2: {
    id: "3951117617",
    sku: "UFMBP",
    name: "Mini Bike Preta",
    urls: [
      "https://www.mercadolivre.com.br/ultimate-fitness-mini-bike-bicicleta-ergometrica/up/MLBU2954483127",
      "https://produto.mercadolivre.com.br/MLB-3951117617"
    ]
  },
  spinning: {
    id: "4136320965",
    sku: "UFSB3V",
    name: "Bike Spinning",
    urls: [
      "https://www.mercadolivre.com.br/ultimate-fitness-bicicleta-ergometrica-spinning/up/MLBU3325822548",
      "https://produto.mercadolivre.com.br/MLB-4136320965"
    ]
  }
};

const JSON_PATH = path.join(__dirname, '../src/data/ml_prices.json');

async function scrapeWithPlaywright() {
  let playwright;
  try {
    playwright = require('playwright');
  } catch (e) {
    console.log('[UPDATE] Playwright not found. Please ensure playwright is installed.');
    return null;
  }

  console.log('[UPDATE] Iniciando navegador Chromium...');
  const browser = await playwright.chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    viewport: { width: 1366, height: 768 },
    locale: 'pt-BR',
  });

  const scrapedProducts = {};

  for (const [key, productInfo] of Object.entries(ML_PRODUCTS)) {
    console.log(`\n[UPDATE] Processando ${productInfo.name} (${key} - SKU: ${productInfo.sku})...`);
    let productExtracted = false;

    for (const url of productInfo.urls) {
      if (productExtracted) break;

      console.log(`[UPDATE] Tentando URL: ${url}`);
      const page = await context.newPage();

      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 35000 });
        await page.waitForTimeout(3000);

        // Extrai preço atual
        const fractionText = await page
          .locator('.andes-money-amount__fraction')
          .first()
          .textContent({ timeout: 5000 })
          .catch(() => null);

        const centsText = await page
          .locator('.andes-money-amount__cents')
          .first()
          .textContent({ timeout: 2000 })
          .catch(() => '00');

        let price = null;
        if (fractionText) {
          const cleanFraction = fractionText.replace(/\./g, '').trim();
          const cleanCents = centsText ? centsText.trim() : '00';
          price = parseFloat(`${cleanFraction}.${cleanCents}`);
        }

        // Extrai preço original / anterior
        const prevFractionText = await page
          .locator('.andes-money-amount--previous .andes-money-amount__fraction')
          .first()
          .textContent({ timeout: 2000 })
          .catch(() => null);

        let originalPrice = null;
        if (prevFractionText) {
          originalPrice = parseFloat(prevFractionText.replace(/\./g, '').trim());
        }

        // Extrai avaliações
        const ratingText = await page
          .locator('.ui-pdp-review__rating')
          .first()
          .textContent({ timeout: 2000 })
          .catch(() => null);
        const ratingAverage = ratingText ? parseFloat(ratingText.trim()) : undefined;

        const reviewsText = await page
          .locator('.ui-pdp-review__amount')
          .first()
          .textContent({ timeout: 2000 })
          .catch(() => null);
        const reviewsTotal = reviewsText ? parseInt(reviewsText.replace(/\D/g, '')) : undefined;

        if (price && !isNaN(price) && price > 0) {
          scrapedProducts[key] = {
            price,
            originalPrice: originalPrice && originalPrice > price ? originalPrice : undefined,
            ratingAverage,
            reviewsTotal,
          };
          console.log(
            `[UPDATE] ✅ Sucesso para ${productInfo.name} -> Preço: R$ ${price.toFixed(2)} | Original: ${
              originalPrice ? 'R$ ' + originalPrice.toFixed(2) : 'N/A'
            }`
          );
          productExtracted = true;
        } else {
          console.warn(`[UPDATE] Não foi possível extrair preço desta URL para ${productInfo.name}`);
        }
      } catch (err) {
        console.error(`[UPDATE] Erro ao raspar ${url}:`, err.message);
      } finally {
        await page.close();
      }
    }
  }

  await browser.close();
  return Object.keys(scrapedProducts).length > 0 ? scrapedProducts : null;
}

async function updatePrices() {
  console.log('====================================================');
  console.log('[UPDATE] Iniciando atualização semanal dos preços...');
  console.log('====================================================');

  let currentData = { products: {} };
  if (fs.existsSync(JSON_PATH)) {
    try {
      currentData = JSON.parse(fs.readFileSync(JSON_PATH, 'utf-8'));
    } catch (e) {
      console.error('[UPDATE] Erro ao ler JSON existente:', e);
    }
  }

  const scraped = await scrapeWithPlaywright();

  if (scraped) {
    for (const [key, data] of Object.entries(scraped)) {
      if (!currentData.products[key]) {
        currentData.products[key] = {
          id: key,
          permalink: ML_PRODUCTS[key]?.urls[0],
          currencyId: 'BRL',
        };
      }
      currentData.products[key].price = data.price;
      if (data.originalPrice) currentData.products[key].originalPrice = data.originalPrice;
      if (data.ratingAverage) currentData.products[key].ratingAverage = data.ratingAverage;
      if (data.reviewsTotal) currentData.products[key].reviewsTotal = data.reviewsTotal;
    }
    console.log(`[UPDATE] ${Object.keys(scraped).length} produto(s) atualizado(s) com sucesso.`);
  } else {
    console.warn('[UPDATE] Nenhum novo preço foi raspado. Mantendo preços atuais.');
  }

  currentData.lastUpdated = new Date().toISOString();

  fs.writeFileSync(JSON_PATH, JSON.stringify(currentData, null, 2), 'utf-8');
  console.log('[UPDATE] Arquivo atualizado em:', JSON_PATH);
}

if (require.main === module) {
  updatePrices().catch(err => {
    console.error('[UPDATE] Erro fatal:', err);
    process.exit(1);
  });
}

module.exports = { updatePrices };

