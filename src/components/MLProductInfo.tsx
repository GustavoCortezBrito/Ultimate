"use client";

import { useEffect, useState } from "react";
import { formatMLPrice, calculateDiscount } from "@/lib/mercadolivre";

interface MLProductData {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  currencyId: string;
  availableQuantity: number;
  soldQuantity: number;
  freeShipping?: boolean;
  status: string;
  ratingAverage?: number;
  reviewsTotal?: number;
  lastUpdated: string;
}

interface MLProductInfoProps {
  productKey: "miniBike" | "spinning";
  fallbackPrice?: number;
}

export default function MLProductInfo({ productKey, fallbackPrice }: MLProductInfoProps) {
  const [productData, setProductData] = useState<MLProductData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProductData() {
      try {
        const response = await fetch("/api/ml-products");
        const result = await response.json();

        if (result.success && result.data[productKey]) {
          setProductData(result.data[productKey]);
        }
      } catch (error) {
        console.error("Erro ao buscar dados do produto:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProductData();
  }, [productKey]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-2">
        <div className="h-8 bg-gray-200 rounded w-32"></div>
        <div className="h-4 bg-gray-200 rounded w-48"></div>
      </div>
    );
  }

  if (!productData) {
    // Fallback caso a API falhe
    return fallbackPrice ? (
      <div className="text-3xl font-bold text-primary">
        {formatMLPrice(fallbackPrice, "BRL")}
      </div>
    ) : null;
  }

  const discount = calculateDiscount(productData.originalPrice, productData.price);

  return (
    <div className="space-y-2">
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-primary">
          {formatMLPrice(productData.price, productData.currencyId)}
        </span>
        {discount > 0 && (
          <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded">
            -{discount}%
          </span>
        )}
      </div>

      {productData.originalPrice && productData.originalPrice > productData.price && (
        <div className="text-sm text-gray-500 line-through">
          De: {formatMLPrice(productData.originalPrice, productData.currencyId)}
        </div>
      )}

      {productData.freeShipping && (
        <div className="text-sm text-green-600 font-medium">
          ✓ Frete grátis
        </div>
      )}

      {productData.soldQuantity > 0 && (
        <div className="text-sm text-gray-600">
          {productData.soldQuantity} vendidos
        </div>
      )}

      {productData.ratingAverage && (
        <div className="flex items-center gap-1 text-sm">
          <span className="text-yellow-500">★</span>
          <span className="font-medium">{productData.ratingAverage.toFixed(1)}</span>
          {productData.reviewsTotal && (
            <span className="text-gray-500">({productData.reviewsTotal} avaliações)</span>
          )}
        </div>
      )}

      {productData.availableQuantity > 0 && productData.availableQuantity < 10 && (
        <div className="text-sm text-orange-600 font-medium">
          ⚠️ Apenas {productData.availableQuantity} disponíveis
        </div>
      )}

      {productData.status !== "active" && (
        <div className="text-sm text-red-600 font-medium">
          Produto indisponível no momento
        </div>
      )}
    </div>
  );
}
