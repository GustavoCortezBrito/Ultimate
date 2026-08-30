const fs = require('fs');
const path = require('path');
const https = require('https');

const ML_PRODUCTS = {
  miniBike: {
    id: "5247689130",
    sku: "UFMBC",
    name: "Mini Bike Cinza",
    defaultPrice: 124.59,
    urls: [
      "https://produto.mercadolivre.com.br/MLB-5247689130",
      "https://www.mercadolivre.com.br/ultimate-fitness-mini-bike-bicicleta-ergometrica/up/MLBU2934790909"
    ]
  },
  miniBike2: {
    id: "3951117617",
    sku: "UFMBP",
    name: "Mini Bike Preta",
    defaultPrice: 185.00,
    urls: [
      "https://produto.mercadolivre.com.br/MLB-3951117617",
      "https://www.mercadolivre.com.br/ultimate-fitness-mini-bike-bicicleta-ergometrica/up/MLBU2954483127"
    ]
  },
  spinning: {
    id: "4136320965",
    sku: "UFSB3V",
    name: "Bike Spinning",
    defaultPrice: 479.51,
    urls: [
      "https://produto.mercadolivre.com.br/MLB-4136320965",
      "https://www.mercadolivre.com.br/ultimate-fitness-bicicleta-ergometrica-spinning/up/MLBU3325822548"
    ]
  }
};

const JSON_PATH = path.join(__dirname, '../src/data/ml_prices.json');

function fetchSearchSnippet(query) {
  return new Promise((resolve) => {
    const url = 'https://html.duckduckgo.com/html/?q=' + encodeURIComponent(query);
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept-Language': 'pt-BR,pt;q=0.9',
      },
      timeout: 10000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', () => resolve(''));
    req.on('timeout', () => {
      req.destroy();
      resolve('');
    });
  });
}

function parsePriceFromText(text) {
  if (!text) return null;
  // Match patterns like R$ 124,59 or R$ 1.479,00 or 124.59
  const match = text.match(/R\$\s*([\d\.]+,\d{2})/i) || text.match(/R\$\s*(\d+)/i);
  if (match && match[1]) {
    const clean = match[1].replace(/\./g, '').replace(',', '.').trim();
    const val = parseFloat(clean);
    if (!isNaN(val) && val > 0) return val;
  }
  return null;
}

async function scrapeWithBrowser() {
  let puppeteer;
  try {
    puppeteer = require('puppeteer-core');
  } catch (e) {
    try {
      puppeteer = require('puppeteer');
    } catch (err) {
      console.log('[UPDATE] Puppeteer/Playwright não encontrado no ambiente, usando extrator HTTP.');
      return null;
    }
  }

  try {
    let browser;
    // Tenta caminhos comuns de Chromium
    const chromePaths = [
      process.env.PUPPETEER_EXECUTABLE_PATH,
      '/usr/bin/google-chrome',
      '/usr/bin/chromium-browser',
      '/usr/bin/chromium',
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    ].filter(Boolean);

    for (const exePath of chromePaths) {
      if (fs.existsSync(exePath)) {
        try {
          browser = await puppeteer.launch({
            executablePath: exePath,
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
          });
          break;
        } catch (e) {
          // continue
        }
      }
    }

    if (!browser) {
      try {
        browser = await puppeteer.launch({
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        });
      } catch (e) {
        console.log('[UPDATE] Não foi possível iniciar navegador headless:', e.message);
        return null;
      }
    }

    const scraped = {};

    for (const [key, product] of Object.entries(ML_PRODUCTS)) {
      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');
      try {
        await page.goto(product.urls[0], { waitUntil: 'domcontentloaded', timeout: 25000 });
        await new Promise(r => setTimeout(r, 2000));

        const data = await page.evaluate(() => {
          const fraction = document.querySelector('.andes-money-amount__fraction')?.textContent?.replace(/\./g, '') || '';
          const cents = document.querySelector('.andes-money-amount__cents')?.textContent || '00';
          const prevFraction = document.querySelector('.andes-money-amount--previous .andes-money-amount__fraction')?.textContent?.replace(/\./g, '') || '';
          const rating = document.querySelector('.ui-pdp-review__rating')?.textContent?.trim();
          const reviews = document.querySelector('.ui-pdp-review__amount')?.textContent?.replace(/\D/g, '');
          return { fraction, cents, prevFraction, rating, reviews };
        });

        if (data.fraction) {
          const price = parseFloat(`${data.fraction}.${data.cents}`);
          const originalPrice = data.prevFraction ? parseFloat(data.prevFraction) : undefined;
          if (price && !isNaN(price)) {
            scraped[key] = {
              price,
              originalPrice: originalPrice && originalPrice > price ? originalPrice : undefined,
              ratingAverage: data.rating ? parseFloat(data.rating) : undefined,
              reviewsTotal: data.reviews ? parseInt(data.reviews) : undefined,
            };
            console.log(`[BROWSER] ✅ ${product.name} -> R$ ${price}`);
          }
        }
      } catch (err) {
        console.warn(`[BROWSER] Aviso para ${product.name}:`, err.message);
      } finally {
        await page.close();
      }
    }

    await browser.close();
    return Object.keys(scraped).length > 0 ? scraped : null;
  } catch (err) {
    console.error('[BROWSER] Erro:', err.message);
    return null;
  }
}

async function scrapeWithSearchSnippets() {
  console.log('[SEARCH] Tentando extrair preços via busca estruturada dos IDs...');
  const scraped = {};

  for (const [key, product] of Object.entries(ML_PRODUCTS)) {
    try {
      const html = await fetchSearchSnippet(`mercadolivre ${product.id} ${product.sku}`);
      if (html) {
        const price = parsePriceFromText(html);
        if (price) {
          scraped[key] = { price };
          console.log(`[SEARCH] ✅ ${product.name} (${product.id}) -> R$ ${price}`);
        }
      }
      await new Promise(r => setTimeout(r, 1000));
    } catch (e) {
      console.warn(`[SEARCH] Não foi possível consultar ${product.name}`);
    }
  }

  return Object.keys(scraped).length > 0 ? scraped : null;
}

async function updatePrices() {
  console.log('====================================================');
  console.log('🚀 ATUALIZAÇÃO DE PREÇOS - MERCADO LIVRE');
  console.log('====================================================');

  let currentData = { products: {} };
  if (fs.existsSync(JSON_PATH)) {
    try {
      currentData = JSON.parse(fs.readFileSync(JSON_PATH, 'utf-8'));
    } catch (e) {
      console.error('[UPDATE] Erro ao ler JSON existente:', e);
    }
  }

  // 1. Tenta extrair via Navegador
  let scraped = await scrapeWithBrowser();

  // 2. Se falhar, tenta via busca dos IDs
  if (!scraped) {
    scraped = await scrapeWithSearchSnippets();
  }

  let updatedCount = 0;

  for (const [key, product] of Object.entries(ML_PRODUCTS)) {
    if (!currentData.products[key]) {
      currentData.products[key] = {
        id: key,
        title: product.name,
        price: product.defaultPrice,
        permalink: product.urls[0],
        currencyId: 'BRL',
      };
    }

    if (scraped && scraped[key]?.price) {
      currentData.products[key].price = scraped[key].price;
      if (scraped[key].originalPrice) currentData.products[key].originalPrice = scraped[key].originalPrice;
      if (scraped[key].ratingAverage) currentData.products[key].ratingAverage = scraped[key].ratingAverage;
      if (scraped[key].reviewsTotal) currentData.products[key].reviewsTotal = scraped[key].reviewsTotal;
      updatedCount++;
    }
  }

  currentData.lastUpdated = new Date().toISOString();

  fs.writeFileSync(JSON_PATH, JSON.stringify(currentData, null, 2), 'utf-8');
  console.log(`\n✅ Processo concluído com sucesso! (${updatedCount} produtos atualizados).`);
  console.log(`📁 Arquivo salvo em: ${JSON_PATH}`);
}

updatePrices().catch(err => {
  console.error('[UPDATE] Aviso na execução:', err.message);
  // Não quebra a GitHub Action
  process.exit(0);
});

module.exports = { updatePrices };


