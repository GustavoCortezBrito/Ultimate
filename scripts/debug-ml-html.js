/**
 * Script para debugar o HTML do Mercado Livre
 */

const fs = require('fs');

const url = "https://www.mercadolivre.com.br/ultimate-fitness-mini-bike-bicicleta-ergometrica/up/MLBU2934790909";

async function debugHTML() {
  try {
    console.log('Baixando HTML...');
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9',
      },
    });

    const html = await response.text();
    console.log(`HTML baixado: ${(html.length / 1024).toFixed(2)} KB`);

    // Salvar HTML completo
    fs.writeFileSync('temp_ml_full.html', html, 'utf-8');
    console.log('✅ Salvo em: temp_ml_full.html');

    // Procurar por padrões de preço
    console.log('\n🔍 Procurando padrões de preço...\n');

    const patterns = [
      /andes-money-amount/g,
      /price[^>]*>.*?(\d+)/gi,
      /"price"[:\s]+(\d+)/gi,
      /R\$[^\d]*(\d+[.,]\d+)/gi,
      /\bprice\b.*?(\d+)/gi,
      /"amount"[:\s]+(\d+)/gi,
    ];

    patterns.forEach((pattern, idx) => {
      const matches = html.match(pattern);
      if (matches) {
        console.log(`Padrão ${idx + 1}: ${pattern}`);
        console.log(`Encontrados: ${matches.length} matches`);
        console.log(`Primeiros 3: ${matches.slice(0, 3).join(' | ')}`);
        console.log('---');
      }
    });

    // Extrair possíveis estruturas JSON
    console.log('\n🔍 Procurando dados JSON estruturados...\n');

    const jsonMatches = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>(.*?)<\/script>/gis);
    if (jsonMatches) {
      console.log(`Encontrados ${jsonMatches.length} blocos JSON+LD`);
      jsonMatches.forEach((match, idx) => {
        try {
          const jsonContent = match.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '');
          const data = JSON.parse(jsonContent);
          
          if (data.offers || data.price || data['@type'] === 'Product') {
            console.log(`\n📦 JSON+LD ${idx + 1}:`);
            console.log(JSON.stringify(data, null, 2).substring(0, 500));
            fs.writeFileSync(`temp_ml_json_${idx}.json`, JSON.stringify(data, null, 2), 'utf-8');
          }
        } catch (e) {
          // Ignorar JSON inválido
        }
      });
    }

    // Procurar por window.__PRELOADED_STATE__ ou similar
    const stateMatch = html.match(/window\.__[A-Z_]+__\s*=\s*({.*?});/s);
    if (stateMatch) {
      console.log('\n✅ Encontrado state preloaded do JS!');
      try {
        fs.writeFileSync('temp_ml_state.json', stateMatch[1], 'utf-8');
        console.log('Salvo em: temp_ml_state.json');
      } catch (e) {
        console.log('Erro ao salvar state:', e.message);
      }
    }

    // Extrair trecho relevante ao redor de "price"
    const priceSection = html.match(/.{200}price.{200}/gi);
    if (priceSection) {
      console.log('\n📄 Trechos com "price":');
      priceSection.slice(0, 3).forEach((section, idx) => {
        console.log(`\n--- Trecho ${idx + 1} ---`);
        console.log(section);
      });
    }

    console.log('\n✅ Análise concluída!');
    console.log('Arquivos gerados:');
    console.log('  - temp_ml_full.html (HTML completo)');
    console.log('  - temp_ml_json_*.json (dados estruturados, se encontrados)');
    console.log('  - temp_ml_state.json (state do JS, se encontrado)');

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

debugHTML();
