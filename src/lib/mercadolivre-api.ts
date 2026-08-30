/**
 * API Oficial do Mercado Livre
 * Solução recomendada pela IA do Google
 * 
 * Uso: Buscar preços usando IDs MLB (não MLBU)
 * Endpoint público: https://api.mercadolibre.com/items/{MLB_ID}
 * Sem autenticação necessária para produtos públicos
 */

export interface MLProduct {
  id: string;
  title: string;
  price: number;
  currency_id: string;
  available_quantity: number;
  permalink: string;
  thumbnail: string;
}

export interface MLPriceResult {
  productKey: string;
  success: boolean;
  price?: number;
  title?: string;
  error?: string;
  mlbId?: string;
}

/**
 * IDs reais dos produtos (MLB - não MLBU)
 * ✅ ID Mini Bike encontrado: MLB5247689130
 * TODO: Encontrar IDs para Spinning e MiniBike2
 */
const ML_PRODUCT_IDS: Record<string, string> = {
  miniBike: "MLB5247689130",   // ✅ Encontrado!
  spinning: "MLB_ID_AQUI",     // TODO: Acessar a página e extrair
  miniBike2: "MLB_ID_AQUI",    // TODO: Acessar a página e extrair
};

/**
 * Buscar dados de um produto via API oficial do Mercado Livre
 */
export async function fetchMLProductByAPI(mlbId: string): Promise<MLProduct | null> {
  try {
    const url = `https://api.mercadolibre.com/items/${mlbId}`;
    
    console.log(`[ML API] Buscando produto ${mlbId}...`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'UltimateFitness-PriceUpdater/1.0',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(`[ML API] Erro ${response.status}: ${response.statusText}`);
      return null;
    }

    const data = await response.json();

    return {
      id: data.id,
      title: data.title,
      price: data.price,
      currency_id: data.currency_id,
      available_quantity: data.available_quantity,
      permalink: data.permalink,
      thumbnail: data.thumbnail,
    };

  } catch (error) {
    console.error('[ML API] Erro ao buscar produto:', error);
    return null;
  }
}

/**
 * Buscar preços de todos os produtos configurados
 */
export async function fetchAllMLPrices(): Promise<MLPriceResult[]> {
  const results: MLPriceResult[] = [];

  for (const [productKey, mlbId] of Object.entries(ML_PRODUCT_IDS)) {
    console.log(`\n[ML API] Processando ${productKey}...`);

    // Validar se o ID foi configurado
    if (mlbId === 'MLB_ID_AQUI' || !mlbId.startsWith('MLB')) {
      results.push({
        productKey,
        success: false,
        error: 'ID MLB não configurado. Execute: node scripts/find-real-ml-ids.js',
        mlbId,
      });
      continue;
    }

    const product = await fetchMLProductByAPI(mlbId);

    if (product) {
      results.push({
        productKey,
        success: true,
        price: product.price,
        title: product.title,
        mlbId: product.id,
      });

      console.log(`✅ ${productKey}: R$ ${product.price}`);
    } else {
      results.push({
        productKey,
        success: false,
        error: 'Falha ao buscar produto na API',
        mlbId,
      });

      console.log(`❌ ${productKey}: Erro ao buscar`);
    }

    // Pausa de 1 segundo entre requisições (boa prática)
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return results;
}

/**
 * Tentar extrair MLB ID de uma URL de promotion (MLBU)
 * Método alternativo se o script não funcionar
 */
export async function extractMLBFromPromotion(promotionUrl: string): Promise<string | null> {
  try {
    console.log(`[ML API] Tentando extrair MLB de: ${promotionUrl}`);
    
    const response = await fetch(promotionUrl, {
      redirect: 'manual', // Não seguir redirects automaticamente
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    // Verificar Location header (redirect)
    const location = response.headers.get('location');
    if (location) {
      const mlbMatch = location.match(/MLB\d+/);
      if (mlbMatch) {
        console.log(`✅ ID encontrado: ${mlbMatch[0]}`);
        return mlbMatch[0];
      }
    }

    // Se não encontrou no redirect, tentar no corpo
    const html = await response.text();
    const mlbMatch = html.match(/MLB\d{10,12}/);
    
    if (mlbMatch) {
      console.log(`✅ ID encontrado no HTML: ${mlbMatch[0]}`);
      return mlbMatch[0];
    }

    console.log(`❌ Não encontrou MLB ID`);
    return null;

  } catch (error) {
    console.error('[ML API] Erro ao extrair MLB:', error);
    return null;
  }
}

/**
 * Verificar se um MLB ID é válido testando na API
 */
export async function validateMLBId(mlbId: string): Promise<boolean> {
  try {
    const response = await fetch(`https://api.mercadolibre.com/items/${mlbId}`, {
      method: 'HEAD', // Apenas verificar se existe
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Obter status de todos os IDs configurados
 */
export function getConfiguredIds() {
  return ML_PRODUCT_IDS;
}

/**
 * Atualizar IDs (para uso em configuração futura)
 */
export function setMLBId(productKey: string, mlbId: string) {
  ML_PRODUCT_IDS[productKey] = mlbId;
}
