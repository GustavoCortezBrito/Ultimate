/**
 * Script interativo para atualização manual de preços do Mercado Livre
 * 
 * Uso:
 *   node scripts/update-prices-manual.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const JSON_PATH = path.join(__dirname, '../src/data/ml_prices.json');

const ML_LINKS = {
  miniBike: "https://www.mercadolivre.com.br/ultimate-fitness-mini-bike-bicicleta-ergometrica/up/MLBU2934790909",
  spinning: "https://www.mercadolivre.com.br/ultimate-fitness-bicicleta-ergometrica-spinning/up/MLBU3325822548",
  miniBike2: "https://www.mercadolivre.com.br/ultimate-fitness-mini-bike-bicicleta-ergometrica/up/MLBU2954483127",
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function formatPrice(price) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price);
}

function parsePrice(input) {
  if (!input || input.trim() === '') return null;
  // Remove R$, espaços, e substitui vírgula por ponto
  const cleaned = input.replace(/[R$\s]/g, '').replace(',', '.');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? null : parsed;
}

function daysSince(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

async function updatePrices() {
  console.log('\n🔄 ATUALIZAÇÃO MANUAL DE PREÇOS - MERCADO LIVRE');
  console.log('='.repeat(60));
  
  // Ler arquivo atual
  let currentData;
  try {
    currentData = JSON.parse(fs.readFileSync(JSON_PATH, 'utf-8'));
  } catch (e) {
    console.error('❌ Erro ao ler arquivo:', e.message);
    process.exit(1);
  }

  // Mostrar preços atuais
  console.log('\n📊 Preços atuais no arquivo:\n');
  for (const [key, data] of Object.entries(currentData.products)) {
    console.log(`  ${key.padEnd(15)} ${formatPrice(data.price)}`);
    if (data.originalPrice) {
      console.log(`  ${' '.repeat(15)} De: ${formatPrice(data.originalPrice)}`);
    }
  }

  const daysSinceUpdate = daysSince(currentData.lastUpdated);
  console.log(`\n⏰ Última atualização: ${new Date(currentData.lastUpdated).toLocaleDateString('pt-BR')} (${daysSinceUpdate} dia${daysSinceUpdate !== 1 ? 's' : ''} atrás)`);
  
  if (daysSinceUpdate > 7) {
    console.log('⚠️  ATENÇÃO: Preços desatualizados há mais de 7 dias!');
  }

  console.log('\n📋 Links dos produtos no Mercado Livre:');
  for (const [key, url] of Object.entries(ML_LINKS)) {
    console.log(`  ${key.padEnd(15)} ${url}`);
  }

  console.log('\n💡 Dica: Abra os links acima em abas do navegador para ver os preços atuais\n');

  const shouldUpdate = await question('Deseja atualizar os preços? (s/n): ');
  if (shouldUpdate.toLowerCase() !== 's' && shouldUpdate.toLowerCase() !== 'sim') {
    console.log('\n❌ Atualização cancelada.');
    rl.close();
    return;
  }

  const newData = JSON.parse(JSON.stringify(currentData)); // Deep clone
  let changed = false;

  // Atualizar cada produto
  for (const [key, productData] of Object.entries(currentData.products)) {
    console.log(`\n${'─'.repeat(60)}`);
    console.log(`📦 ${key.toUpperCase()}`);
    console.log(`🔗 ${ML_LINKS[key]}`);
    console.log(`─'.repeat(60)}`);
    console.log(`Preço atual no arquivo: ${formatPrice(productData.price)}`);
    if (productData.originalPrice) {
      console.log(`Preço original no arquivo: ${formatPrice(productData.originalPrice)}`);
    }

    const newPriceInput = await question(`\nNovo preço (ou Enter para manter): `);
    const newPrice = parsePrice(newPriceInput);
    
    if (newPrice && newPrice !== productData.price) {
      newData.products[key].price = newPrice;
      changed = true;
      console.log(`✅ Preço atualizado: ${formatPrice(newPrice)}`);
    } else {
      console.log(`➡️  Preço mantido: ${formatPrice(productData.price)}`);
    }

    const newOriginalPriceInput = await question(`Preço original/De (ou Enter para pular): `);
    const newOriginalPrice = parsePrice(newOriginalPriceInput);
    
    if (newOriginalPrice) {
      newData.products[key].originalPrice = newOriginalPrice;
      changed = true;
      console.log(`✅ Preço original atualizado: ${formatPrice(newOriginalPrice)}`);
      
      if (newData.products[key].price < newOriginalPrice) {
        const discount = Math.round(((newOriginalPrice - newData.products[key].price) / newOriginalPrice) * 100);
        console.log(`🎯 Desconto: ${discount}%`);
      }
    }

    const newRatingInput = await question(`Avaliação (1-5) (ou Enter para pular): `);
    const newRating = parseFloat(newRatingInput);
    if (!isNaN(newRating) && newRating >= 1 && newRating <= 5) {
      newData.products[key].ratingAverage = newRating;
      changed = true;
      console.log(`✅ Avaliação atualizada: ${newRating} ⭐`);
    }

    const newReviewsInput = await question(`Total de reviews (ou Enter para pular): `);
    const newReviews = parseInt(newReviewsInput);
    if (!isNaN(newReviews) && newReviews >= 0) {
      newData.products[key].reviewsTotal = newReviews;
      changed = true;
      console.log(`✅ Reviews atualizados: ${newReviews}`);
    }
  }

  if (!changed) {
    console.log('\n❌ Nenhuma alteração foi feita.');
    rl.close();
    return;
  }

  // Atualizar timestamp
  newData.lastUpdated = new Date().toISOString();

  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMO DAS ALTERAÇÕES');
  console.log('='.repeat(60));
  
  for (const [key, oldData] of Object.entries(currentData.products)) {
    const newProductData = newData.products[key];
    
    if (oldData.price !== newProductData.price) {
      console.log(`\n${key}:`);
      console.log(`  Preço: ${formatPrice(oldData.price)} → ${formatPrice(newProductData.price)}`);
    }
    
    if (oldData.originalPrice !== newProductData.originalPrice) {
      console.log(`  Original: ${oldData.originalPrice ? formatPrice(oldData.originalPrice) : 'N/A'} → ${newProductData.originalPrice ? formatPrice(newProductData.originalPrice) : 'N/A'}`);
    }
  }

  console.log(`\n⏰ lastUpdated: ${new Date(currentData.lastUpdated).toLocaleString('pt-BR')} → ${new Date(newData.lastUpdated).toLocaleString('pt-BR')}`);

  const confirm = await question('\n💾 Salvar alterações? (s/n): ');
  if (confirm.toLowerCase() !== 's' && confirm.toLowerCase() !== 'sim') {
    console.log('\n❌ Alterações descartadas.');
    rl.close();
    return;
  }

  // Salvar arquivo
  try {
    fs.writeFileSync(JSON_PATH, JSON.stringify(newData, null, 2), 'utf-8');
    console.log('\n✅ Arquivo atualizado com sucesso!');
    console.log(`📁 Local: ${JSON_PATH}`);
  } catch (e) {
    console.error('\n❌ Erro ao salvar arquivo:', e.message);
    rl.close();
    process.exit(1);
  }

  console.log('\n📝 Próximos passos:');
  console.log('  1. git add src/data/ml_prices.json');
  console.log('  2. git commit -m "chore: atualizar preços do Mercado Livre"');
  console.log('  3. git push');
  console.log('  4. Aguardar deploy automático na Vercel (~2 min)');
  console.log('  5. Verificar preços no site: https://ultimatefitness.com.br');
  
  console.log('\n🎉 Pronto!\n');
  rl.close();
}

// Executar
updatePrices().catch(err => {
  console.error('\n💥 ERRO FATAL:', err);
  rl.close();
  process.exit(1);
});
