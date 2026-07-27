import { NextResponse } from "next/server";
import { getStoredMLProducts } from "@/lib/mercadolivre";
import mlPricesData from "@/data/ml_prices.json";

export const runtime = 'nodejs';
export const revalidate = 86400; // 24 horas

export async function GET() {
  try {
    const products = getStoredMLProducts();

    return NextResponse.json({
      success: true,
      data: products,
      lastUpdated: mlPricesData.lastUpdated,
      revalidatedEverySeconds: 86400,
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


