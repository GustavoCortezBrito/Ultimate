import { NextResponse } from "next/server";
import { updateMLPrices, getStoredMLProducts } from "@/lib/mercadolivre";

export const maxDuration = 300; // 5 minutes para permitir Puppeteer
export const dynamic = 'force-dynamic';

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

    console.log("[CRON] Iniciando atualização automática de preços do Mercado Livre...");
    
    // Executa a atualização de preços
    const updateResult = await updateMLPrices();
    
    if (!updateResult.success) {
      console.error("[CRON] Falha ao atualizar preços:", updateResult.error);
      return NextResponse.json({
        success: false,
        message: "Falha ao atualizar preços",
        error: updateResult.error,
        timestamp: new Date().toISOString(),
      }, { status: 500 });
    }

    // Retorna os produtos atualizados
    const products = getStoredMLProducts();

    console.log("[CRON] Preços atualizados com sucesso!");

    return NextResponse.json({
      success: true,
      message: "Preços atualizados com sucesso",
      data: products,
      updatedCount: updateResult.updatedCount || 0,
      lastUpdated: updateResult.lastUpdated,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[CRON] Erro ao atualizar produtos:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao atualizar produtos",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}

