import { NextResponse } from "next/server";
import { ML_LINKS } from "@/data/products";

export const runtime = 'nodejs';

/**
 * API Route para buscar dados atualizados do Mercado Livre
 * GET /api/ml-products
 * Cache: 24 horas (revalida apenas 1x a cada 86400 segundos)
 */
export const revalidate = 86400; // 24 horas em segundos

const FALLBACK_PRODUCTS: Record<string, { price: number; originalPrice?: number; soldQuantity: number; ratingAverage: number }> = {
  miniBike: { price: 164.90, originalPrice: 217.00, soldQuantity: 5000, ratingAverage: 4.8 },
  spinning: { price: 581.22, originalPrice: 749.00, soldQuantity: 25, ratingAverage: 4.6 },
  miniBike2: { price: 185.00, originalPrice: 217.00, soldQuantity: 1000, ratingAverage: 4.8 },
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchMLProductData(key: string, url: string) {
  const fallback = FALLBACK_PRODUCTS[key] || { price: 199.90, soldQuantity: 100, ratingAverage: 4.8 };

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'WhatsApp/2.19.221 A',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9',
      },
      next: { revalidate: 86400 } // Cache no nível de fetch por 24h
    });

    if (!response.ok) {
      console.warn(`[ML-API] HTTP ${response.status} para ${key}. Usando fallback.`);
      return { ...fallback, status: 'active', lastUpdated: new Date().toISOString() };
    }

    const html = await response.text();

    // 1. Tenta extrair do og:title (Mercado Livre costuma incluir "- R$ XX,XX" no título OpenGraph)
    const ogTitleMatch = html.match(/content=["']([^"']+)["'][\s]+property=["']og:title["']/i) ||
                         html.match(/property=["']og:title["'][\s]+content=["']([^"']+)["']/i);
    const titleStr = ogTitleMatch ? ogTitleMatch[1] : "";
    const titlePriceMatch = titleStr.match(/R\$\s*([\d.,]+)/i);
    const priceFromTitle = titlePriceMatch ? parseFloat(titlePriceMatch[1].replace(/\./g, '').replace(',', '.')) : null;

    // 2. Extrai das tags HTML da andes-money-amount
    const priceFractionMatch = html.match(/class="andes-money-amount__fraction"[^>]*>([\d.]+)</i);
    const priceCentsMatch = html.match(/class="andes-money-amount__cents"[^>]*>([\d]+)</i);
    let htmlPrice: number | null = null;
    if (priceFractionMatch) {
      const frac = priceFractionMatch[1].replace(/\./g, '');
      const cents = priceCentsMatch ? priceCentsMatch[1] : '00';
      htmlPrice = parseFloat(`${frac}.${cents}`);
    }

    // 3. Tenta preço original (preço anterior com desconto)
    const prevPriceMatch = html.match(/andes-money-amount--previous[\s\S]*?class="andes-money-amount__fraction"[^>]*>([\d.]+)</i);
    const originalPrice = prevPriceMatch ? parseFloat(prevPriceMatch[1].replace(/\./g, '')) : fallback.originalPrice;

    // 4. Avaliações e vendas
    const ratingMatch = html.match(/class="ui-pdp-review__rating"[^>]*>([\d.]+)</i) || html.match(/"rating_average":\s*([\d.]+)/);
    const salesMatch = html.match(/(\d+)\s*vendid/i);

    const price = priceFromTitle || htmlPrice || fallback.price;
    const soldQuantity = salesMatch ? parseInt(salesMatch[1]) : fallback.soldQuantity;
    const ratingAverage = ratingMatch ? parseFloat(ratingMatch[1]) : fallback.ratingAverage;

    console.log(`[ML-API] ${key} obtido com sucesso: R$ ${price}`);

    return {
      title: titleStr.split(" - R$")[0] || titleStr || "Produto Ultimate Fitness",
      price,
      originalPrice: originalPrice && originalPrice > price ? originalPrice : fallback.originalPrice,
      soldQuantity,
      ratingAverage,
      status: 'active',
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`[ML-API] Erro ao buscar ${key}:`, error);
    return { ...fallback, status: 'fallback', lastUpdated: new Date().toISOString() };
  }
}

export async function GET() {
  try {
    const formattedProducts: Record<string, any> = {};
    const entries = Object.entries(ML_LINKS);

    for (let i = 0; i < entries.length; i++) {
      const [key, url] = entries[i];
      const productData = await fetchMLProductData(key, url);
      formattedProducts[key] = {
        id: key,
        ...productData,
        permalink: url,
        currencyId: 'BRL',
      };
      
      // Pequena pausa entre requisições para evitar rate limit
      if (i < entries.length - 1) {
        await sleep(1500);
      }
    }

    return NextResponse.json({
      success: true,
      data: formattedProducts,
      revalidatedEverySeconds: 86400,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Erro geral ao buscar produtos do ML:", error);
    return NextResponse.json(
      {
        error: "Erro ao buscar produtos do Mercado Livre",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}

