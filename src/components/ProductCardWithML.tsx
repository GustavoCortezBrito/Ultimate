"use client";

import { useState, useEffect } from "react";
import { ProductCard, type ProductCardProps } from "./ProductCard";

interface MLData {
  price: number;
  originalPrice?: number;
  soldQuantity: number;
  availableQuantity: number;
  freeShipping?: boolean;
  ratingAverage?: number;
  reviewsTotal?: number;
}

interface ProductCardWithMLProps extends ProductCardProps {
  mlProductKey: "miniBike" | "spinning" | "miniBike2";
}

export function ProductCardWithML({ mlProductKey, ...productProps }: ProductCardWithMLProps) {
  const [mlData, setMlData] = useState<MLData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMLData() {
      try {
        const response = await fetch("/api/ml-products");
        
        if (!response.ok) {
          console.error("Erro na API:", response.status);
          setLoading(false);
          return;
        }

        const result = await response.json();

        if (result.success && result.data && result.data[mlProductKey]) {
          setMlData(result.data[mlProductKey]);
        } else {
          console.warn("Produto não encontrado na resposta:", mlProductKey);
        }
      } catch (error) {
        console.error("Erro ao buscar dados do ML:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMLData();
  }, [mlProductKey]);

  // Se estiver carregando, usa os dados padrão
  if (loading || !mlData) {
    return <ProductCard {...productProps} />;
  }

  // Calcula desconto
  const discountPercent = mlData.originalPrice && mlData.originalPrice > mlData.price
    ? Math.round(((mlData.originalPrice - mlData.price) / mlData.originalPrice) * 100)
    : 0;

  // Formata preços
  const formattedPrice = `R$ ${mlData.price.toFixed(2).replace(".", ",")}`;
  const formattedOriginalPrice = mlData.originalPrice && mlData.originalPrice > mlData.price
    ? `R$ ${mlData.originalPrice.toFixed(2).replace(".", ",")}` 
    : undefined;

  // Calcula parcelas (simulação simples: 12x sem juros)
  const installmentValue = (mlData.price / 12).toFixed(2).replace(".", ",");
  const installments = `12x de R$ ${installmentValue}`;

  // Atualiza rating com dados reais
  const updatedRating = {
    stars: mlData.ratingAverage ? `${mlData.ratingAverage.toFixed(1)}/5` : productProps.rating?.stars || "4.8/5",
    sales: mlData.soldQuantity > 1000 
      ? `+${Math.floor(mlData.soldQuantity / 1000)} mil` 
      : mlData.soldQuantity > 0 ? `+${mlData.soldQuantity}` : productProps.rating?.sales || "+100",
    reviews: mlData.reviewsTotal?.toString() || productProps.rating?.reviews || "0",
  };

  // Atualiza badges com dados reais
  const updatedBadges = [...productProps.badges];
  const salesIndex = updatedBadges.findIndex(b => b.includes("vendidos"));
  if (salesIndex !== -1) {
    updatedBadges[salesIndex] = updatedRating.sales + " vendidos";
  }
  const ratingIndex = updatedBadges.findIndex(b => b.includes("★"));
  if (ratingIndex !== -1 && mlData.ratingAverage) {
    updatedBadges[ratingIndex] = `${mlData.ratingAverage.toFixed(1)}★`;
  }

  return (
    <ProductCard
      {...productProps}
      price={formattedPrice}
      originalPrice={formattedOriginalPrice}
      installments={installments}
      discountBadge={discountPercent > 0 ? `${discountPercent}% OFF` : undefined}
      rating={updatedRating}
      badges={updatedBadges}
    />
  );
}
