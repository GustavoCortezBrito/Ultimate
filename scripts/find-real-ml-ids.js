/**
 * Script para encontrar os IDs reais (MLB) dos produtos
 * a partir das URLs de promotion (MLBU)
 */

const puppeteer = require('puppeteer-core');

const ML_PROMOTION_URLS = {
  miniBike: "https://www.mercadolivre.com.br/ultimate-fitness-mini-bike-bicicleta-ergometrica/up/MLBU2934790909",
  spinning: "https://www.mercadolivre.com.br/ultimate-fitness-bicicleta-ergometrica-spinning/up/MLBU3325822548",
  miniBike2: "https://www.mercadolivre.com.br/ultimate-fitness-mini-bike-bicicleta-ergometrica/up/MLBU2954483127",
};

async function findRealMLBId(promotionUrl, productName) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🔍 Buscando ID real para: ${productName}`);
  console.log(`📎 URL Promotion: ${promotionUrl}`);
  console.log('='.repeat(60));

  let browser;
  
  try {
    browser = await puppeteer.launch({
      headless: false, // Deixar visível para debug
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

    console.log('🌐 Navegando...');
    await page.goto(promotionUrl, { waitUntil: 'networkidle2', timeout: 30000 });

    // Aguardar um pouco
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Tentar extrair ID real da URL final (após redirect)
    const finalUrl = page.url();
    console.log(`📍 URL Final: ${finalUrl}`);

    // Procurar por MLB seguido de números
    const mlbMatch = finalUrl.match(/MLB\d+/);
    if (mlbMatch) {
      const realId = mlbMatch[0];
      console.log(`✅ ID Real Encontrado: ${realId}`);
      
      // Testar se funciona na API
      console.log(`\n🧪 Testando na API do Mercado Livre...`);
      const testUrl = `https://api.mercadolibre.com/items/${realId}`;
      
      const response = await fetch(testUrl);
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ API FUNCIONA!`);
        console.log(`   Título: ${data.title}`);
        console.log(`   Preço: R$ ${data.price}`);
        
        await browser.close();
        return realId;
      } else {
        console.log(`❌ API retornou erro: ${response.status}`);
      }
    }

    // Método alternativo: procurar no HTML
    console.log(`\n🔎 Procurando no código da página...`);
    const htmlContent = await page.content();
    
    const patterns = [
      /MLB\d{10,12}/g,
      /"id":"(MLB\d+)"/g,
      /"itemId":"(MLB\d+)"/g,
      /item_id["\s:]+["']?(MLB\d+)/g,
    ];

    for (const pattern of patterns) {
      const matches = htmlContent.match(pattern);
      if (matches && matches.length > 0) {
        console.log(`📋 IDs encontrados: ${matches.slice(0, 5).join(', ')}`);
        
        // Testar o primeiro
        const possibleId = matches[0].replace(/["':]/g, '').match(/MLB\d+/)?.[0];
        if (possibleId) {
          console.log(`\n🧪 Testando ${possibleId} na API...`);
          const testUrl = `https://api.mercadolibre.com/items/${possibleId}`;
          const response = await fetch(testUrl);
          
          if (response.ok) {
            const data = await response.json();
            console.log(`✅ FUNCIONOU!`);
            console.log(`   Título: ${data.title}`);
            console.log(`   Preço: R$ ${data.price}`);
            
            await browser.close();
            return possibleId;
          }
        }
      }
    }

    console.log(`❌ Não consegui encontrar o ID real`);
    await browser.close();
    return null;

  } catch (error) {
    console.error(`❌ Erro: ${error.message}`);
    if (browser) await browser.close();
    return null;
  }
}

async function findAllIds() {
  console.log('🚀 BUSCA DE IDs REAIS (MLB) DO MERCADO LIVRE');
  console.log('='.repeat(60));
  console.log('\nEste script vai:');
  console.log('1. Abrir cada URL de promotion (MLBU)');
  console.log('2. Encontrar o ID real do produto (MLB)');
  console.log('3. Testar na API do Mercado Livre');
  console.log('4. Mostrar os IDs que funcionam\n');

  const results = {};

  for (const [key, url] of Object.entries(ML_PROMOTION_URLS)) {
    const realId = await findRealMLBId(url, key);
    if (realId) {
      results[key] = realId;
    }
    
    // Pausa entre buscas
    if (Object.keys(ML_PROMOTION_URLS).indexOf(key) < Object.keys(ML_PROMOTION_URLS).length - 1) {
      console.log('\n⏳ Aguardando 5 segundos...\n');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  console.log('\n\n' + '='.repeat(60));
  console.log('📊 RESUMO FINAL - IDs ENCONTRADOS');
  console.log('='.repeat(60));

  if (Object.keys(results).length > 0) {
    console.log('\n✅ IDs que funcionam na API:\n');
    for (const [key, id] of Object.entries(results)) {
      console.log(`${key.padEnd(15)} → ${id}`);
    }

    console.log('\n📝 ATUALIZE O CÓDIGO COM ESTES IDs:');
    console.log('\nconst ML_PRODUCT_IDS = {');
    for (const [key, id] of Object.entries(results)) {
      console.log(`  ${key}: "${id}",`);
    }
    console.log('};\n');

    console.log('🎉 Agora você pode usar a API oficial do ML!');
    console.log('📖 A busca automática vai funcionar perfeitamente!\n');
  } else {
    console.log('\n❌ Nenhum ID foi encontrado.');
    console.log('\n💡 Solução alternativa:');
    console.log('1. Acesse cada produto no ML manualmente');
    console.log('2. Copie a URL completa');
    console.log('3. Procure por MLB seguido de números');
    console.log('4. Use esse ID na API\n');
  }
}

// Executar
findAllIds().catch(err => {
  console.error('\n💥 ERRO FATAL:', err);
  process.exit(1);
});
