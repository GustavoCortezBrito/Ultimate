import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { ML_LINKS } from "@/data/products";

/**
 * API Route para buscar dados atualizados do Mercado Livre via web scraping
 * GET /api/ml-products - Retorna dados atualizados de todos os produtos
 * Cache: 24 horas (atualiza apenas 1x ao dia)
 */
export const revalidate = 86400; // 24 horas em segundos

async function scrapeMLProduct(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extrai dados da página
    const price = $('meta[property="product:price:amount"]').attr('content') ||
                  $('.price-tag-fraction').first().text().trim();
    
    const title = $('meta[property="og:title"]').attr('content') ||
                  $('h1').first().text().trim();

    // Tenta extrair preço original (se houver desconto)
    const originalPrice = $('.andes-money-amount--previous').first().text().trim();
    
    // Extrai quantidade vendida
    const soldText = $('.ui-pdp-subtitle').text();
    const soldMatch = soldText.match(/(\d+)\s*vendid/i);
    const soldQuantity = soldMatch ? parseInt(soldMatch[1]) : 0;

    // Extrai rating
    const ratingText = $('[class*="rating"]').first().text();
    const ratingMatch = ratingText.match(/(\d+\.?\d*)/);
    const ratingAverage = ratingMatch ? parseFloat(ratingMatch[1]) : undefined;

    // Extrai total de reviews
    const reviewsText = $('[class*="review"]').text();
    const reviewsMatch = reviewsText.match(/(\d+)/);
    const reviewsTotal = reviewsMatch ? parseInt(reviewsMatch[1]) : undefined;

    // Verifica se tem frete grátis
    const freeShipping = html.includes('Frete grátis') || html.includes('FREE_SHIPPING');

    return {
      title,
      price: parseFloat(price.replace(/[^\d,]/g, '').replace(',', '.')),
      originalPrice: originalPrice ? parseFloat(originalPrice.replace(/[^\d,]/g, '').replace(',', '.')) : undefined,
      soldQuantity,
      ratingAverage,
      reviewsTotal,
      freeShipping,
      availableQuantity: 999, // Não tem como saber via scraping
      status: 'active',
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Erro ao fazer scraping:', error);
    throw error;
  }
}

export async function GET() {
  try {
    const formattedProducts: Record<string, any> = {};

    // Scrape cada produto
    for (const [key, url] of Object.entries(ML_LINKS)) {
      try {
        const productData = await scrapeMLProduct(url);
        formattedProducts[key] = {
          id: key,
          ...productData,
          permalink: url,
          currencyId: 'BRL',
        };
        console.log(`[SCRAPER] ${key}: R$ ${productData.price}`);
      } catch (error) {
        console.error(`[SCRAPER] Erro ao buscar ${key}:`, error);
      }
    }

    if (Object.keys(formattedProducts).length === 0) {
      return NextResponse.json(
        { error: "Nenhum produto pôde ser carregado" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: formattedProducts,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Erro ao buscar produtos do ML:", error);
    return NextResponse.json(
      {
        error: "Erro ao buscar produtos do Mercado Livre",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}
