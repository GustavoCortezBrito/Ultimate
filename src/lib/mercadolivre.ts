/**
 * Biblioteca para interagir com a API do Mercado Livre
 * Documentação: https://developers.mercadolivre.com.br/pt_br/itens-e-buscas
 */

export interface MLProduct {
  id: string;
  title: string;
  price: number;
  original_price?: number;
  currency_id: string;
  available_quantity: number;
  sold_quantity: number;
  condition: string;
  permalink: string;
  thumbnail: string;
  pictures?: Array<{
    id: string;
    url: string;
  }>;
  shipping?: {
    free_shipping: boolean;
    mode: string;
  };
  status: string;
  rating_average?: number;
  reviews_total?: number;
}

/**
 * Extrai o ID do produto de uma URL do Mercado Livre
 * Exemplo: https://www.mercadolivre.com.br/.../MLB123456789 -> MLB123456789
 * Exemplo: https://www.mercadolivre.com.br/.../up/MLBU123456789 -> MLBU123456789
 */
export function extractMLBId(url: string): string | null {
  // Regex para capturar IDs do Mercado Livre (MLB ou MLBU seguido de números)
  const match = url.match(/MLB[UB]?\d+/);
  return match ? match[0] : null;
}

/**
 * Busca informações de um produto pelo ID
 */
export async function getMLProduct(productId: string): Promise<MLProduct> {
  try {
    const response = await fetch(
      `https://api.mercadolibre.com/items/${productId}`,
      {
        next: { revalidate: 86400 }, // Cache por 24 horas (1x ao dia)
      }
    );

    if (!response.ok) {
      throw new Error(`Erro ao buscar produto ${productId}: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Erro ao buscar produto ${productId}:`, error);
    throw error;
  }
}

/**
 * Busca múltiplos produtos de uma vez
 */
export async function getMLProducts(
  productIds: string[]
): Promise<Record<string, MLProduct>> {
  try {
    // A API do ML permite buscar até 20 produtos por vez
    const chunks = chunkArray(productIds, 20);
    const results: Record<string, MLProduct> = {};

    for (const chunk of chunks) {
      const ids = chunk.join(",");
      const response = await fetch(
        `https://api.mercadolibre.com/items?ids=${ids}`,
        {
          next: { revalidate: 86400 }, // Cache por 24 horas (1x ao dia)
        }
      );

      if (!response.ok) {
        throw new Error(`Erro ao buscar produtos: ${response.status}`);
      }

      const data = await response.json();
      
      // Processa cada resposta
      for (const item of data) {
        if (item.code === 200 && item.body) {
          results[item.body.id] = item.body;
        }
      }
    }

    return results;
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    throw error;
  }
}

/**
 * Formata o preço do Mercado Livre para exibição
 */
export function formatMLPrice(price: number, currencyId: string = "BRL"): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: currencyId,
  }).format(price);
}

/**
 * Calcula o desconto percentual
 */
export function calculateDiscount(originalPrice?: number, currentPrice?: number): number {
  if (!originalPrice || !currentPrice || originalPrice <= currentPrice) {
    return 0;
  }
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}

/**
 * Divide um array em chunks menores
 */
function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}
