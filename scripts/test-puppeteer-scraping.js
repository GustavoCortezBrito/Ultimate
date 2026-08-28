/**
 * Script de teste para verificar scraping com Puppeteer
 * 
 * Uso:
 *   node scripts/test-puppeteer-scraping.js
 */

const puppeteer = require('puppeteer-core');

const ML_LINKS = {
  miniBike: "https://www.mercadolivre.com.br/ultimate-fitness-mini-bike-bicicleta-ergometrica/up/MLBU2934790909",
  spinning: "https://www.mercadolivre.com.br/ultimate-fitness-bicicleta-ergometrica-spinning/up/MLBU3325822548",
  miniBike2: "https://www.mercadolivre.com.br/ultimate-fitness-mini-bike-bicicleta-ergometrica/up/MLBU2954483127",
};

async function scrapeProduct(url) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🔍 Testando: ${url}`);
  console.log('='.repeat(60));

  let browser;
  
  try {
    console.log('🚀 Iniciando Chrome...');
    
    browser = await puppeteer.launch({
      headless: true,
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
      ],
    });

    const page = await browser.newPage();

    // Configurar user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1920, height: 1080 });

    console.log('📡 Navegando para a página...');
    
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });

    console.log('⏳ Aguardando carregamento completo...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Salvar screenshot para debug
    await page.screenshot({ path: 'debug-ml-page.png', fullPage: false });
    console.log('📸 Screenshot salvo em: debug-ml-page.png');

    // Salvar HTML para debug
    const html = await page.content();
    require('fs').writeFileSync('debug-ml-page.html', html, 'utf-8');
    console.log('📄 HTML salvo em: debug-ml-page.html');

    console.log('📄 Extraindo dados...');
    
    const data = await page.evaluate(() => {
      let price = null;
      let originalPrice = null;
      let ratingAverage = null;
      let reviewsTotal = null;

      // Extrair preço atual
      const priceElements = document.querySelectorAll('.andes-money-amount__fraction');
      if (priceElements.length > 0) {
        const priceText = priceElements[0].textContent?.replace(/\./g, '') || '';
        const centsElement = document.querySelector('.andes-money-amount__cents');
        const centsText = centsElement?.textContent || '00';
        price = parseFloat(`${priceText}.${centsText}`);
      }

      // Extrair preço original
      const originalPriceElement = document.querySelector('.andes-money-amount--previous .andes-money-amount__fraction');
      if (originalPriceElement) {
        const originalText = originalPriceElement.textContent?.replace(/\./g, '') || '';
        originalPrice = parseFloat(originalText);
      }

      // Extrair rating
      const ratingElement = document.querySelector('.ui-pdp-review__rating');
      if (ratingElement) {
        ratingAverage = parseFloat(ratingElement.textContent?.trim() || '0');
      }

      // Extrair total de reviews
      const reviewsElement = document.querySelector('.ui-pdp-review__amount');
      if (reviewsElement) {
        const reviewsText = reviewsElement.textContent?.replace(/\D/g, '') || '0';
        reviewsTotal = parseInt(reviewsText);
      }

      return { price, originalPrice, ratingAverage, reviewsTotal };
    });

    console.log('\n📊 RESULTADOS:');
    console.log('─'.repeat(60));
    
    if (data.price) {
      console.log(`💰 Preço atual: R$ ${data.price.toFixed(2)}`);
    } else {
      console.log(`❌ Preço não encontrado`);
    }

    if (data.originalPrice) {
      console.log(`🏷️  Preço original: R$ ${data.originalPrice.toFixed(2)}`);
      const discount = Math.round(((data.originalPrice - data.price) / data.originalPrice) * 100);
      console.log(`🎯 Desconto: ${discount}%`);
    }

    if (data.ratingAverage) {
      console.log(`⭐ Avaliação: ${data.ratingAverage}`);
    }

    if (data.reviewsTotal) {
      console.log(`💬 Reviews: ${data.reviewsTotal}`);
    }

    if (data.price && !isNaN(data.price) && data.price > 0) {
      console.log('\n✅ SUCESSO!');
      return {
        success: true,
        data,
      };
    } else {
      console.log('\n❌ FALHA: Preço inválido');
      return {
        success: false,
        data,
      };
    }

  } catch (error) {
    console.error('\n❌ ERRO:', error.message);
    return {
      success: false,
      error: error.message,
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

async function testAll() {
  console.log('\n🚀 TESTE DE SCRAPING COM PUPPETEER');
  console.log('='.repeat(60));
  console.log('Método: Puppeteer (Browser Automation)');
  console.log('='.repeat(60));

  const results = {};
  let successCount = 0;
  let failCount = 0;

  for (const [key, url] of Object.entries(ML_LINKS)) {
    console.log(`\n\n📦 Produto: ${key.toUpperCase()}`);
    
    const result = await scrapeProduct(url);
    results[key] = result;
    
    if (result.success) {
      successCount++;
    } else {
      failCount++;
    }

    // Pausa entre requisições
    if (Object.keys(ML_LINKS).indexOf(key) < Object.keys(ML_LINKS).length - 1) {
      console.log('\n⏳ Aguardando 5 segundos antes do próximo...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  console.log('\n\n' + '='.repeat(60));
  console.log('📊 RESUMO FINAL');
  console.log('='.repeat(60));
  console.log(`✅ Sucessos: ${successCount}`);
  console.log(`❌ Falhas: ${failCount}`);
  console.log(`📈 Taxa de sucesso: ${((successCount / Object.keys(ML_LINKS).length) * 100).toFixed(1)}%`);

  if (successCount > 0) {
    console.log('\n💰 PREÇOS EXTRAÍDOS:');
    console.log('-'.repeat(60));
    for (const [key, result] of Object.entries(results)) {
      if (result.success && result.data?.price) {
        console.log(`${key.padEnd(15)} R$ ${result.data.price.toFixed(2).padStart(10)}`);
        if (result.data.originalPrice) {
          const discount = Math.round(((result.data.originalPrice - result.data.price) / result.data.originalPrice) * 100);
          console.log(`${' '.repeat(15)} De: R$ ${result.data.originalPrice.toFixed(2)} (-${discount}%)`);
        }
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  
  if (successCount === Object.keys(ML_LINKS).length) {
    console.log('\n✅ TUDO FUNCIONOU PERFEITAMENTE!');
    console.log('🎉 O scraping automático está pronto!');
    console.log('\n🚀 Próximos passos:');
    console.log('  1. Fazer deploy na Vercel');
    console.log('  2. Configurar CRON_SECRET nas env vars');
    console.log('  3. O cron vai executar automaticamente a cada 24h');
    console.log('  4. PREÇOS ATUALIZARÃO SOZINHOS! 🎊');
  } else if (successCount > 0) {
    console.log('\n⚠️  ATUALIZAÇÃO PARCIAL');
    console.log('Alguns produtos funcionaram, outros não.');
    console.log('Verifique os erros acima.');
  } else {
    console.log('\n❌ NENHUM PRODUTO FOI EXTRAÍDO');
    console.log('Possíveis problemas:');
    console.log('  - Chrome não instalado ou caminho incorreto');
    console.log('  - Mercado Livre mudou estrutura da página');
    console.log('  - Problemas de conexão');
  }

  console.log('\n');
}

// Executar
testAll().catch(err => {
  console.error('\n💥 ERRO FATAL:', err);
  process.exit(1);
});
