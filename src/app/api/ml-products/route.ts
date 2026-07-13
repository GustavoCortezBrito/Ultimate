import { NextResponse } from "next/server";
import { extractMLBId, getMLProducts } from "@/lib/mercadolivre";
import { ML_LINKS } from "@/data/products";

/**
 * API Route para buscar dados atualizados do Mercado Livre
 * GET /api/ml-products - Retorna dados atualizados de todos os produtos
 * Cache: 24 horas (atualiza apenas 1x ao dia)
 */
export const revalidate = 86400; // 24 horas em segundos

export async function GET() {
  try {
    // Extrai os IDs dos produtos das URLs
    const productIds: string[] = [];
    const productMapping: Record<string, string> = {};

    for (const [key, url] of Object.entries(ML_LINKS)) {
      const id = extractMLBId(url);
      if (id) {
        productIds.push(id);
        productMapping[id] = key;
      }
    }

    if (productIds.length === 0) {
      return NextResponse.json(
        { error: "Nenhum ID de produto válido encontrado" },
        { status: 400 }
      );
    }

    // Busca os dados dos produtos
    const products = await getMLProducts(productIds);

    // Formata a resposta
    const formattedProducts: Record<string, any> = {};
    for (const [id, product] of Object.entries(products)) {
      const key = productMapping[id];
      formattedProducts[key] = {
        id: product.id,
        title: product.title,
        price: product.price,
        originalPrice: product.original_price,
        currencyId: product.currency_id,
        availableQuantity: product.available_quantity,
        soldQuantity: product.sold_quantity,
        condition: product.condition,
        permalink: product.permalink,
        thumbnail: product.thumbnail,
        freeShipping: product.shipping?.free_shipping,
        shippingMode: product.shipping?.mode,
        status: product.status,
        ratingAverage: product.rating_average,
        reviewsTotal: product.reviews_total,
        lastUpdated: new Date().toISOString(),
      };
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
