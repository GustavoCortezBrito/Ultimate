/**
 * Script de atualização de preços para GitHub Actions CI
 * ✅ Usa APENAS módulos nativos do Node.js (sem npm install)
 * ✅ Estratégia: busca os preços via DuckDuckGo usando os IDs dos anúncios
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const ML_PRODUCTS = {
  miniBike: {
    id: '5247689130',
    sku: 'UFMBC',
    name: 'Mini Bike Cinza',
    defaultPrice: 129.90,
    permalink: 'https://www.mercadolivre.com.br/ultimate-fitness-mini-bike-bicicleta-ergometrica/up/MLBU2934790909',
  },
  miniBike2: {
    id: '3951117617',
    sku: 'UFMBP',
    name: 'Mini Bike Preta',
    defaultPrice: 189.90,
    permalink: 'https://www.mercadolivre.com.br/ultimate-fitness-mini-bike-bicicleta-ergometrica/up/MLBU2954483127',
  },
  spinning: {
    id: '4136320965',
    sku: 'UFSB3V',
    name: 'Bike Spinning',
    defaultPrice: 749.00,
    permalink: 'https://www.mercadolivre.com.br/ultimate-fitness-bicicleta-ergometrica-spinning/up/MLBU3325822548',
  },
};

const JSON_PATH = path.join(__dirname, '../src/data/ml_prices.json');

function httpsGet(url, headers = {}) {
  return new Promise((resolve) => {
    const options = {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept-Language': 'pt-BR,pt;q=0.9',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        ...headers,
      },
      timeout: 12000,
    };

    const req = https.get(url, options, (res) => {
      // Segue até 2 redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(httpsGet(res.headers.location, headers));
      }
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });

    req.on('error', () => resolve({ status: 0, body: '' }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ status: 0, body: '' });
    });
  });
}

function extractPrice(html) {
  if (!html || html.includes('account-verification') || html.includes('suspicious-traffic')) {
    return null;
  }

  // Tenta extrair preço de JSON estruturado na página
  const jsonPriceMatch = html.match(/"price"\s*:\s*(\d+\.?\d*)/);
  if (jsonPriceMatch) {
    const val = parseFloat(jsonPriceMatch[1]);
    if (val > 0) return val;
  }

  // Tenta extrair de meta tags de produto
  const metaMatch = html.match(/content="R\$\s*([\d\.]+,\d{2})"/);
  if (metaMatch) {
    const val = parseFloat(metaMatch[1].replace(/\./g, '').replace(',', '.'));
    if (val > 0) return val;
  }

  return null;
}

function extractOriginalPrice(html) {
  const match = html.match(/"original_price"\s*:\s*(\d+\.?\d*)/);
  if (match) {
    const val = parseFloat(match[1]);
    return val > 0 ? val : null;
  }
  return null;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function parsePriceFromText(text) {
  if (!text) return null;
  const match = text.match(/R\$\s*([\d\.]+,\d{2})/i) || text.match(/R\$\s*(\d+)/i);
  if (match && match[1]) {
    const clean = match[1].replace(/\./g, '').replace(',', '.').trim();
    const val = parseFloat(clean);
    if (!isNaN(val) && val > 0) return val;
  }
  return null;
}

async function fetchSearchPrice(product) {
  try {
    const query = `mercadolivre ${product.id} ${product.sku}`;
    const url = 'https://html.duckduckgo.com/html/?q=' + encodeURIComponent(query);
    console.log(`  → Tentando busca: ${query}`);
    const res = await httpsGet(url);
    if (res.body) {
      const price = parsePriceFromText(res.body);
      if (price) return { price };
    }
  } catch (e) {
    // ignore
  }
  return null;
}

async function fetchProductPage(product) {
  // 1. Tenta a URL de promoção (MLBU)
  const promoUrl = product.permalink;
  console.log(`  → Tentando: ${promoUrl}`);

  const res = await httpsGet(promoUrl);
  let price = extractPrice(res.body);

  if (price) {
    const originalPrice = extractOriginalPrice(res.body);
    return { price, originalPrice };
  }

  // 2. Tenta URL direta do produto
  const directUrl = `https://produto.mercadolivre.com.br/MLB-${product.id}`;
  console.log(`  → Tentando direto: ${directUrl}`);
  const res2 = await httpsGet(directUrl);
  price = extractPrice(res2.body);

  if (price) {
    const originalPrice = extractOriginalPrice(res2.body);
    return { price, originalPrice };
  }

  // 3. Fallback via busca
  const searchResult = await fetchSearchPrice(product);
  if (searchResult) {
    return searchResult;
  }

  return null;
}

async function updatePrices() {
  console.log('====================================================');
  console.log('🚀 ATUALIZAÇÃO DE PREÇOS — GITHUB ACTIONS (Zero-dep)');
  console.log('====================================================\n');

  let currentData = { products: {} };
  if (fs.existsSync(JSON_PATH)) {
    try {
      currentData = JSON.parse(fs.readFileSync(JSON_PATH, 'utf-8'));
    } catch (e) {
      console.error('[ERROR] Erro ao ler ml_prices.json:', e.message);
    }
  }

  let updatedCount = 0;

  for (const [key, product] of Object.entries(ML_PRODUCTS)) {
    console.log(`\n📦 Produto: ${product.name} (${product.id})`);

    try {
      const result = await fetchProductPage(product);

      if (!currentData.products[key]) {
        currentData.products[key] = {
          id: key,
          title: product.name,
          price: 0,
          permalink: product.permalink,
          currencyId: 'BRL',
          freeShipping: true,
        };
      }

      if (result && result.price) {
        console.log(`  ✅ Preço: R$ ${result.price.toFixed(2)}${result.originalPrice ? ` (de R$ ${result.originalPrice.toFixed(2)})` : ''}`);
        currentData.products[key].price = result.price;
        if (result.originalPrice && result.originalPrice > result.price) {
          currentData.products[key].originalPrice = result.originalPrice;
        }
        updatedCount++;
      } else {
        console.log(`  ⚠️  Preço não encontrado. Mantendo valor atual: R$ ${currentData.products[key]?.price || 0}`);
      }
    } catch (err) {
      console.error(`  ❌ Erro:`, err.message);
    }

    // Pausa entre requisições
    await sleep(2000);
  }

  currentData.lastUpdated = new Date().toISOString();

  fs.writeFileSync(JSON_PATH, JSON.stringify(currentData, null, 2), 'utf-8');

  console.log(`\n====================================================`);
  console.log(`✅ Concluído! ${updatedCount} de ${Object.keys(ML_PRODUCTS).length} produtos atualizados.`);
  console.log(`📁 Arquivo salvo: ${JSON_PATH}`);
  console.log(`🕐 Última atualização: ${currentData.lastUpdated}`);
  console.log('====================================================');
}

updatePrices().catch((err) => {
  console.error('[FATAL]', err.message);
  process.exit(0); // Nunca quebra a Action
});
