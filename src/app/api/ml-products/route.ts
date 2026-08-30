import { NextResponse } from "next/server";
import { getStoredMLProducts } from "@/lib/mercadolivre";
import { fetchAllMLPrices } from "@/lib/mercadolivre-api";
import mlPricesData from "@/data/ml_prices.json";
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';
export const revalidate = 86400; // 24 horas

/**
 * GET /api/ml-products
 * Retorna os preços atuais salvos
 */
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

/**
 * POST /api/ml-products
 * Busca preços via API Oficial do Mercado Livre
 * Solução recomendada pela IA do Google
 */
export async function POST() {
  try {
    console.log('[ML API] Iniciando busca de preços via API oficial...');
    
    const prices = await fetchAllMLPrices();
    const successCount = prices.filter(p => p.success).length;
    
    if (successCount === 0) {
      return NextResponse.json({
        success: false,
        message: 'Não foi possível buscar nenhum preço. IDs MLB configurados?',
        results: prices,
      }, { status: 500 });
    }

    // Salvar resultados no arquivo JSON
    const filePath = path.join(process.cwd(), 'src', 'data', 'ml_prices.json');
    const currentData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    // Atualizar apenas os preços que foram buscados com sucesso
    const updatedData = {
      ...currentData,
      lastUpdated: new Date().toISOString(),
      method: 'official-api', // Marca que usou API oficial
    };

    // Atualizar cada produto
    prices.forEach(result => {
      if (result.success && result.price) {
        // Encontrar e atualizar o produto correspondente
        const product = updatedData.products.find((p: any) => 
          p.id === result.productKey || p.name === result.productKey
        );
        
        if (product) {
          product.price = result.price;
          if (result.title) {
            product.mlTitle = result.title;
          }
        }
      }
    });

    fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2));

    return NextResponse.json({
      success: true,
      message: `${successCount} de ${prices.length} preços atualizados via API oficial`,
      lastUpdate: updatedData.lastUpdated,
      results: prices,
    });

  } catch (error) {
    console.error('[ML API] Erro:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    }, { status: 500 });
  }
}


