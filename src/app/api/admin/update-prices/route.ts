import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { prices } = await request.json();

    if (!prices) {
      return NextResponse.json({
        success: false,
        error: 'Prices data is required',
      }, { status: 400 });
    }

    // Ler dados atuais
    const jsonPath = path.join(process.cwd(), 'src', 'data', 'ml_prices.json');
    const currentData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

    // Atualizar preços
    for (const [key, data] of Object.entries(prices) as [string, any][]) {
      if (currentData.products[key]) {
        currentData.products[key].price = data.price;
        if (data.originalPrice && data.originalPrice > 0) {
          currentData.products[key].originalPrice = data.originalPrice;
        } else {
          delete currentData.products[key].originalPrice;
        }
      }
    }

    // Atualizar timestamp
    currentData.lastUpdated = new Date().toISOString();

    // Salvar arquivo
    fs.writeFileSync(jsonPath, JSON.stringify(currentData, null, 2), 'utf-8');

    console.log('[ADMIN] Prices updated successfully');

    return NextResponse.json({
      success: true,
      message: 'Preços atualizados com sucesso',
      lastUpdated: currentData.lastUpdated,
    });

  } catch (error) {
    console.error('[ADMIN] Error updating prices:', error);
    return NextResponse.json({
      success: false,
      error: 'Erro ao atualizar preços',
    }, { status: 500 });
  }
}
