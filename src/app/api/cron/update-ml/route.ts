import { NextResponse } from "next/server";
import { getStoredMLProducts } from "@/lib/mercadolivre";
import mlPricesData from "@/data/ml_prices.json";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    
    if (process.env.NODE_ENV === "production" && cronSecret) {
      if (!authHeader || authHeader !== `Bearer ${cronSecret}`) {
        console.log("[CRON] Tentativa de acesso não autorizado");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const products = getStoredMLProducts();

    return NextResponse.json({
      success: true,
      message: "Produtos retornados com sucesso",
      data: products,
      lastUpdated: mlPricesData.lastUpdated,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[CRON] Erro ao buscar produtos:", error);
    return NextResponse.json(
      {
        error: "Erro ao buscar produtos",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}

