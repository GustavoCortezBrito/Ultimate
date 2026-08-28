/**
 * Script de teste para verificar a API do Mercado Livre
 * 
 * Uso:
 *   node scripts/test-ml-scraping.js
 */

const ML_PRODUCT_IDS = {
  miniBike: "MLBU2934790909",
  spinning: "MLBU3325822548",
  miniBike2: "MLBU2954483127",
};

async function fetchMLProduct(productId) {
  try {
    console.log(`\n🔍 Testando: ${productId}`);
    
    // Usar API pública do Mercado Livre
    const apiUrl = `https://api.mercadolibre.com/items/${productId}`;
    console.log(`📡 API URL: ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`❌ Erro HTTP: ${response.status}`);
      return null;
    }

    console.log(`✅ Resposta recebida: ${response.status}`);

    const data = await response.json();
    console.log(`📄 Dados recebidos da API`);

    // Extract price
    const price = data.price || null;
    if (price) {
      console.log(`💰 Preço atual: R$ ${price.toFixed(2)}`);
    } else {
      console.log(`⚠️  Não foi possível extrair o preço`);
    }

    // Extract original price
    let originalPrice = null;
    if (data.original_price && data.original_price > price) {
      originalPrice = data.original_price;
      console.log(`🏷️  Preço original: R$ ${originalPrice.toFixed(2)}`);
      const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
      console.log(`🎯 Desconto: ${discount}%`);
    }

    // Try to get reviews
    let ratingAverage, reviewsTotal;
    try {
      const reviewsUrl = `https://api.mercadolibre.com/reviews/item/${productId}`;
      const reviewsResponse = await fetch(reviewsUrl, {
        headers: { 'Accept': 'application/json' },
      });
      
      if (reviewsResponse.ok) {
        const reviewsData = await reviewsResponse.json();
        ratingAverage = reviewsData.rating_average;
        reviewsTotal = reviewsData.paging?.total;
        
        if (ratingAverage) {
          console.log(`⭐ Avaliação: ${ratingAverage}`);
        }
        if (reviewsTotal) {
          console.log(`💬 Reviews: ${reviewsTotal}`);
        }
      }
    } catch (e) {
      console.log(`ℹ️  Reviews não disponíveis`);
    }

    // Additional info
    if (data.title) {
      console.log(`📦 Título: ${data.title.substring(0, 60)}...`);
    }
    if (data.available_quantity !== undefined) {
      console.log(`📊 Disponível: ${data.available_quantity} unidades`);
    }
    if (data.sold_quantity) {
      console.log(`✅ Vendidos: ${data.sold_quantity}`);
    }
    if (data.condition) {
      console.log(`🔖 Condição: ${data.condition}`);
    }
    if (data.status) {
      console.log(`📌 Status: ${data.status}`);
    }

    if (!price || isNaN(price) || price <= 0) {
      console.error(`❌ FALHA: Preço inválido`);
      return null;
    }

    console.log(`✅ Sucesso!`);
    return {
      price,
      originalPrice,
      ratingAverage,
      reviewsTotal,
    };
  } catch (error) {
    console.error(`❌ Erro:`, error.message);
    return null;
  }
}

async function testAllProducts() {
  console.log('🚀 TESTE DA API DO MERCADO LIVRE');
  console.log('=====================================\n');
  console.log(`Total de produtos: ${Object.keys(ML_PRODUCT_IDS).length}`);
  console.log(`Método: API Pública do Mercado Livre\n`);
  
  const results = {};
  let successCount = 0;
  let failCount = 0;

  for (const [key, productId] of Object.entries(ML_PRODUCT_IDS)) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📦 Produto: ${key.toUpperCase()}`);
    console.log('='.repeat(60));
    
    const result = await fetchMLProduct(productId);
    
    if (result) {
      results[key] = result;
      successCount++;
    } else {
      failCount++;
    }
    
    // Pausa entre requisições para ser gentil com a API
    if (Object.keys(ML_PRODUCT_IDS).indexOf(key) < Object.keys(ML_PRODUCT_IDS).length - 1) {
      console.log('\n⏳ Aguardando 1 segundo...');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.log('\n\n' + '='.repeat(60));
  console.log('📊 RESUMO DOS RESULTADOS');
  console.log('='.repeat(60));
  console.log(`✅ Sucessos: ${successCount}`);
  console.log(`❌ Falhas: ${failCount}`);
  console.log(`📈 Taxa de sucesso: ${((successCount / Object.keys(ML_PRODUCT_IDS).length) * 100).toFixed(1)}%`);

  if (successCount > 0) {
    console.log('\n💰 PREÇOS EXTRAÍDOS:');
    console.log('-'.repeat(60));
    for (const [key, data] of Object.entries(results)) {
      console.log(`${key.padEnd(15)} R$ ${data.price.toFixed(2).padStart(10)}`);
      if (data.originalPrice) {
        const discount = Math.round(((data.originalPrice - data.price) / data.originalPrice) * 100);
        console.log(`${' '.repeat(15)} De: R$ ${data.originalPrice.toFixed(2)} (-${discount}%)`);
      }
      if (data.ratingAverage) {
        console.log(`${' '.repeat(15)} ⭐ ${data.ratingAverage} (${data.reviewsTotal || 0} reviews)`);
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  
  if (failCount > 0) {
    console.log('\n⚠️  ATENÇÃO: Algumas extrações falharam!');
    console.log('Possíveis causas:');
    console.log('  - Produto removido ou pausado');
    console.log('  - ID do produto incorreto');
    console.log('  - Problema de conexão');
    console.log('  - API do Mercado Livre temporariamente indisponível');
  } else {
    console.log('\n✅ Todos os produtos foram extraídos com sucesso!');
    console.log('A integração com a API do Mercado Livre está funcionando!');
  }

  console.log('\n🎯 Próximos passos:');
  console.log('  1. ✅ API funcionando: faça deploy na Vercel');
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

module.exports = { fetchMLProduct, testAllProducts };
