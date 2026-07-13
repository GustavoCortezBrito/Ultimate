import { NextResponse } from "next/server";
import { extractMLBId, getMLProducts } from "@/lib/mercadolivre";
import { ML_LINKS } from "@/data/products";

/**
 * Cron Job para atualizar dados do Mercado Livre automaticamente
 * Será executado 1x por dia pela Vercel Cron
 * 
 * Para configurar no vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/update-ml",
 *     "schedule": "0 3 * * *"
 *   }]
 * }
 */
export async function GET(request: Request) {
  try {
    // Segurança: Verifica se a requisição vem da Vercel Cron
    const authHeader = request.headers.get("authorization");
    if (
      process.env.NODE_ENV === "production" &&
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("[CRON] Iniciando atualização dos produtos do ML...");

    // Extrai os IDs dos produtos
    const productIds: string[] = [];
    const productMapping: Record<string, string> = {};

    for (const [key, url] of Object.entries(ML_LINKS)) {
      const id = extractMLBId(url);
      if (id) {
        productIds.push(id);
        productMapping[id] = key;
      }
    }

    // Busca os dados atualizados
    const products = await getMLProducts(productIds);

    // Aqui você pode salvar em um banco de dados, arquivo JSON, etc.
    // Por enquanto, apenas retorna os dados
    const formattedProducts: Record<string, any> = {};
    for (const [id, product] of Object.entries(products)) {
      const key = productMapping[id];
      formattedProducts[key] = {
        id: product.id,
        title: product.title,
        price: product.price,
        originalPrice: product.original_price,
        availableQuantity: product.available_quantity,
        soldQuantity: product.sold_quantity,
        freeShipping: product.shipping?.free_shipping,
        status: product.status,
        lastUpdated: new Date().toISOString(),
      };
      
      console.log(`[CRON] ${key}: R$ ${product.price} (${product.available_quantity} disponíveis)`);
    }

    console.log("[CRON] Atualização concluída com sucesso!");

    return NextResponse.json({
      success: true,
      message: "Produtos atualizados com sucesso",
      data: formattedProducts,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[CRON] Erro ao atualizar produtos:", error);
    return NextResponse.json(
      {
        error: "Erro ao atualizar produtos",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}
