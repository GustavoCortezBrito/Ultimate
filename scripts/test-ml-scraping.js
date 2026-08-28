/**
 * Script de teste para verificar o scraping do Mercado Livre
 * 
 * Uso:
 *   node scripts/test-ml-scraping.js
 */

const ML_LINKS = {
  miniBike: "https://www.mercadolivre.com.br/ultimate-fitness-mini-bike-bicicleta-ergometrica/up/MLBU2934790909",
  spinning: "https://www.mercadolivre.com.br/ultimate-fitness-bicicleta-ergometrica-spinning/up/MLBU3325822548",
  miniBike2: "https://www.mercadolivre.com.br/ultimate-fitness-mini-bike-bicicleta-ergometrica/up/MLBU2954483127",
};

async function scrapeMLProduct(url) {
  try {
    console.log(`\n🔍 Testando: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
      },
    });

    if (!response.ok) {
      console.error(`❌ Erro HTTP: ${response.status}`);
      return null;
    }

    console.log(`✅ Resposta recebida: ${response.status}`);

    const html = await response.text();
    console.log(`📄 HTML baixado: ${(html.length / 1024).toFixed(2)} KB`);

    // Extract price
    const priceMatch = html.match(/<span class="andes-money-amount__fraction[^"]*">([^<]+)<\/span>/);
    const centsMatch = html.match(/<span class="andes-money-amount__cents[^"]*">([^<]+)<\/span>/);
    
    let price = null;
    if (priceMatch && priceMatch[1]) {
      const cleanFraction = priceMatch[1].replace(/\./g, '').trim();
      const cleanCents = centsMatch && centsMatch[1] ? centsMatch[1].trim() : '00';
      price = parseFloat(`${cleanFraction}.${cleanCents}`);
      console.log(`💰 Preço atual: R$ ${price}`);
    } else {
      console.log(`⚠️  Não foi possível extrair o preço`);
      console.log(`   Verificando padrões no HTML...`);
      
      // Debug: show some patterns
      const pricePatterns = html.match(/andes-money-amount__fraction/g);
      if (pricePatterns) {
        console.log(`   Encontrados ${pricePatterns.length} padrões de preço`);
      }
    }

    // Extract original price
    const originalPriceMatch = html.match(/<s[^>]*class="[^"]*andes-money-amount--previous[^"]*"[^>]*>.*?<span class="andes-money-amount__fraction[^"]*">([^<]+)<\/span>/s);
    let originalPrice = null;
    if (originalPriceMatch && originalPriceMatch[1]) {
      originalPrice = parseFloat(originalPriceMatch[1].replace(/\./g, '').trim());
      console.log(`🏷️  Preço original: R$ ${originalPrice}`);
      
      if (originalPrice && price) {
        const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
        console.log(`🎯 Desconto: ${discount}%`);
      }
    }

    // Extract rating
    const ratingMatch = html.match(/<span class="ui-pdp-review__rating[^"]*">([^<]+)<\/span>/);
    const ratingAverage = ratingMatch && ratingMatch[1] ? parseFloat(ratingMatch[1].trim()) : undefined;
    if (ratingAverage) {
      console.log(`⭐ Avaliação: ${ratingAverage}`);
    }

    // Extract review count
    const reviewsMatch = html.match(/<span class="ui-pdp-review__amount[^"]*">.*?(\d+).*?<\/span>/);
    const reviewsTotal = reviewsMatch && reviewsMatch[1] ? parseInt(reviewsMatch[1]) : undefined;
    if (reviewsTotal) {
      console.log(`💬 Reviews: ${reviewsTotal}`);
    }

    if (!price || isNaN(price)) {
      console.error(`❌ FALHA: Não foi possível extrair preço válido`);
      return null;
    }

    console.log(`✅ Sucesso!`);
    return {
      price,
      originalPrice: originalPrice && originalPrice > price ? originalPrice : undefined,
      ratingAverage,
      reviewsTotal,
    };
  } catch (error) {
    console.error(`❌ Erro:`, error.message);
    return null;
  }
}

async function testAllProducts() {
  console.log('🚀 TESTE DE SCRAPING - MERCADO LIVRE');
  console.log('=====================================\n');
  console.log(`Total de produtos: ${Object.keys(ML_LINKS).length}`);
  
  const results = {};
  let successCount = 0;
  let failCount = 0;

  for (const [key, url] of Object.entries(ML_LINKS)) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📦 Produto: ${key.toUpperCase()}`);
    console.log('='.repeat(60));
    
    const result = await scrapeMLProduct(url);
    
    if (result) {
      results[key] = result;
      successCount++;
    } else {
      failCount++;
    }
    
    // Pausa entre requisições para evitar bloqueio
    if (Object.keys(ML_LINKS).indexOf(key) < Object.keys(ML_LINKS).length - 1) {
      console.log('\n⏳ Aguardando 2 segundos...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.log('\n\n' + '='.repeat(60));
  console.log('📊 RESUMO DOS RESULTADOS');
  console.log('='.repeat(60));
  console.log(`✅ Sucessos: ${successCount}`);
  console.log(`❌ Falhas: ${failCount}`);
  console.log(`📈 Taxa de sucesso: ${((successCount / Object.keys(ML_LINKS).length) * 100).toFixed(1)}%`);

  if (successCount > 0) {
    console.log('\n💰 PREÇOS EXTRAÍDOS:');
    console.log('-'.repeat(60));
    for (const [key, data] of Object.entries(results)) {
      console.log(`${key.padEnd(15)} R$ ${data.price.toFixed(2).padStart(10)}`);
      if (data.originalPrice) {
        console.log(`${' '.repeat(15)} De: R$ ${data.originalPrice.toFixed(2)}`);
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  
  if (failCount > 0) {
    console.log('\n⚠️  ATENÇÃO: Algumas extrações falharam!');
    console.log('Possíveis causas:');
    console.log('  - Mudança no HTML do Mercado Livre');
    console.log('  - Bloqueio por rate limiting');
    console.log('  - Problema de conexão');
    console.log('  - URL do produto inválida ou removida');
  } else {
    console.log('\n✅ Todos os produtos foram extraídos com sucesso!');
    console.log('O scraping está funcionando corretamente.');
  }

  console.log('\n🎯 Próximos passos:');
  console.log('  1. Se funcionou: faça deploy na Vercel');
  console.log('  2. Configure o CRON_SECRET nas env vars');
  console.log('  3. Aguarde execução automática ou force manualmente');
  console.log('\n');

  return results;
}

// Executar testes
if (require.main === module) {
  testAllProducts().catch(err => {
    console.error('\n💥 ERRO FATAL:', err);
    process.exit(1);
  });
}

module.exports = { scrapeMLProduct, testAllProducts };
