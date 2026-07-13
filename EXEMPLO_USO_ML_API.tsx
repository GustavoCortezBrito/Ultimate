/**
 * EXEMPLO DE USO DA API DO MERCADO LIVRE
 * 
 * Este arquivo mostra diferentes formas de usar os dados do ML no seu site
 */

import MLProductInfo from "@/components/MLProductInfo";

// ============================================
// EXEMPLO 1: Usar o componente pronto
// ============================================
export function ExemploComponentePronto() {
  return (
    <div className="product-card">
      <h2>Mini Bike Ultimate Fitness</h2>
      
      {/* O componente busca e exibe os dados automaticamente */}
      <MLProductInfo 
        productKey="miniBike" 
        fallbackPrice={299.90}  // Preço de fallback se a API falhar
      />
      
      <button>Comprar no Mercado Livre</button>
    </div>
  );
}

// ============================================
// EXEMPLO 2: Buscar dados manualmente
// ============================================
"use client";
import { useEffect, useState } from "react";

export function ExemploManual() {
  const [produtos, setProdutos] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function buscarProdutos() {
      try {
        const response = await fetch("/api/ml-products");
        const data = await response.json();
        
        if (data.success) {
          setProdutos(data.data);
        }
      } catch (error) {
        console.error("Erro:", error);
      } finally {
        setLoading(false);
      }
    }

    buscarProdutos();
  }, []);

  if (loading) return <div>Carregando preços...</div>;
  if (!produtos) return <div>Erro ao carregar</div>;

  return (
    <div>
      <h2>Nossos Produtos</h2>
      
      {/* Mini Bike */}
      <div className="product">
        <h3>{produtos.miniBike.title}</h3>
        <p className="price">R$ {produtos.miniBike.price.toFixed(2)}</p>
        <p>{produtos.miniBike.soldQuantity} vendidos</p>
        {produtos.miniBike.freeShipping && <span>✓ Frete grátis</span>}
      </div>

      {/* Spinning */}
      <div className="product">
        <h3>{produtos.spinning.title}</h3>
        <p className="price">R$ {produtos.spinning.price.toFixed(2)}</p>
        <p>{produtos.spinning.soldQuantity} vendidos</p>
        {produtos.spinning.freeShipping && <span>✓ Frete grátis</span>}
      </div>
    </div>
  );
}

// ============================================
// EXEMPLO 3: Server Component (Next.js 14+)
// ============================================
async function getProdutosML() {
  const response = await fetch("https://seu-site.com.br/api/ml-products", {
    next: { revalidate: 3600 }, // Cache por 1 hora
  });
  const data = await response.json();
  return data;
}

export async function ExemploServerComponent() {
  const { data: produtos } = await getProdutosML();

  return (
    <div>
      <h1>Preços atualizados do Mercado Livre</h1>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="card">
          <h3>Mini Bike</h3>
          <p className="text-2xl font-bold">
            R$ {produtos.miniBike.price.toFixed(2)}
          </p>
          {produtos.miniBike.originalPrice > produtos.miniBike.price && (
            <p className="line-through text-gray-500">
              R$ {produtos.miniBike.originalPrice.toFixed(2)}
            </p>
          )}
        </div>

        <div className="card">
          <h3>Spinning</h3>
          <p className="text-2xl font-bold">
            R$ {produtos.spinning.price.toFixed(2)}
          </p>
          {produtos.spinning.originalPrice > produtos.spinning.price && (
            <p className="line-through text-gray-500">
              R$ {produtos.spinning.originalPrice.toFixed(2)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// EXEMPLO 4: Mostrar desconto e urgência
// ============================================
"use client";
import { formatMLPrice, calculateDiscount } from "@/lib/mercadolivre";
import { useEffect, useState } from "react";

export function ExemploComDesconto() {
  const [miniBike, setMiniBike] = useState<any>(null);

  useEffect(() => {
    fetch("/api/ml-products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMiniBike(data.data.miniBike);
        }
      });
  }, []);

  if (!miniBike) return null;

  const desconto = calculateDiscount(miniBike.originalPrice, miniBike.price);

  return (
    <div className="product-highlight">
      <h2>Mini Bike Ultimate Fitness</h2>
      
      {/* Preço com desconto */}
      <div className="flex items-baseline gap-3">
        <span className="text-4xl font-bold text-green-600">
          {formatMLPrice(miniBike.price, miniBike.currencyId)}
        </span>
        {desconto > 0 && (
          <span className="text-xl bg-red-500 text-white px-3 py-1 rounded">
            -{desconto}% OFF
          </span>
        )}
      </div>

      {/* Preço original */}
      {miniBike.originalPrice > miniBike.price && (
        <p className="text-lg text-gray-500 line-through">
          De: {formatMLPrice(miniBike.originalPrice, miniBike.currencyId)}
        </p>
      )}

      {/* Urgência - estoque baixo */}
      {miniBike.availableQuantity > 0 && miniBike.availableQuantity < 10 && (
        <div className="bg-orange-100 border border-orange-400 text-orange-700 px-4 py-2 rounded">
          ⚠️ Apenas {miniBike.availableQuantity} unidades disponíveis!
        </div>
      )}

      {/* Social proof */}
      {miniBike.soldQuantity > 0 && (
        <p className="text-gray-600">
          🔥 {miniBike.soldQuantity} pessoas já compraram
        </p>
      )}

      {/* Frete grátis */}
      {miniBike.freeShipping && (
        <p className="text-green-600 font-semibold">
          ✓ Frete GRÁTIS
        </p>
      )}

      {/* Avaliações */}
      {miniBike.ratingAverage && (
        <div className="flex items-center gap-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={i < Math.round(miniBike.ratingAverage) ? "text-yellow-400" : "text-gray-300"}
              >
                ★
              </span>
            ))}
          </div>
          <span className="font-semibold">{miniBike.ratingAverage.toFixed(1)}</span>
          <span className="text-gray-500">
            ({miniBike.reviewsTotal} avaliações)
          </span>
        </div>
      )}

      <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg">
        Comprar no Mercado Livre
      </button>

      {/* Última atualização */}
      <p className="text-xs text-gray-400">
        Preço atualizado em: {new Date(miniBike.lastUpdated).toLocaleString("pt-BR")}
      </p>
    </div>
  );
}

// ============================================
// EXEMPLO 5: Card comparativo de produtos
// ============================================
"use client";
import { useEffect, useState } from "react";

export function ExemploComparacao() {
  const [produtos, setProdutos] = useState<any>(null);

  useEffect(() => {
    fetch("/api/ml-products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProdutos(data.data);
      });
  }, []);

  if (!produtos) return <div>Carregando...</div>;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {Object.entries(produtos).map(([key, produto]: [string, any]) => (
        <div key={key} className="border rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-2">{produto.title}</h3>
          
          <div className="mb-4">
            <p className="text-3xl font-bold text-blue-600">
              R$ {produto.price.toFixed(2)}
            </p>
            {produto.originalPrice > produto.price && (
              <p className="text-sm text-gray-500 line-through">
                R$ {produto.originalPrice.toFixed(2)}
              </p>
            )}
          </div>

          <div className="space-y-2 text-sm">
            <p>✓ {produto.soldQuantity} vendidos</p>
            {produto.freeShipping && <p className="text-green-600">✓ Frete grátis</p>}
            {produto.ratingAverage && (
              <p>⭐ {produto.ratingAverage.toFixed(1)}/5.0</p>
            )}
          </div>

          <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            Ver no Mercado Livre
          </button>
        </div>
      ))}
    </div>
  );
}
