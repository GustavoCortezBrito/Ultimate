import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const ML_LINKS = {
  miniBike: "https://www.mercadolivre.com.br/ultimate-fitness-mini-bike-bicicleta-ergometrica/up/MLBU2934790909",
  spinning: "https://www.mercadolivre.com.br/ultimate-fitness-bicicleta-ergometrica-spinning/up/MLBU3325822548",
  miniBike2: "https://www.mercadolivre.com.br/ultimate-fitness-mini-bike-bicicleta-ergometrica/up/MLBU2954483127",
};

async function tryFetchPrice(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const html = await response.text();

    // Verificar se é página de verificação
    if (html.includes('suspicious-traffic') || html.includes('account-verification')) {
      return null;
    }

    // Tentar extrair preço com regex
    const priceMatch = html.match(/"price":\s*(\d+\.?\d*)/);
    const originalPriceMatch = html.match(/"original_price":\s*(\d+\.?\d*)/);

    if (priceMatch && priceMatch[1]) {
      return {
        price: parseFloat(priceMatch[1]),
        originalPrice: originalPriceMatch ? parseFloat(originalPriceMatch[1]) : undefined,
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching:', error);
    return null;
  }
}

export async function POST() {
  try {
    console.log('[ML FETCH] Attempting to fetch prices...');

    const results: Record<string, any> = {};
    let successCount = 0;

    for (const [key, url] of Object.entries(ML_LINKS)) {
      const data = await tryFetchPrice(url);
      if (data) {
        results[key] = data;
        successCount++;
      }
      // Pausa entre requisições
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    if (successCount > 0) {
      return NextResponse.json({
        success: true,
        prices: results,
        message: `${successCount} preços obtidos com sucesso`,
      });
    }

    return NextResponse.json({
      success: false,
      message: 'Não foi possível buscar preços automaticamente',
    });

  } catch (error) {
    console.error('[ML FETCH] Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Erro ao buscar preços',
    }, { status: 500 });
  }
}
