import miniBikeImg from "@/assets/mini-bike.png";
import spinningImg from "@/assets/spinning-bike.jpg";
import type { CarouselSlide } from "@/components/ProductCarousel";

export const ML_LINKS = {
  miniBike:
    "https://www.mercadolivre.com.br/ultimate-fitness-mini-bike-bicicleta-ergometrica/up/MLBU2934790909",
  spinning:
    "https://www.mercadolivre.com.br/ultimate-fitness-bicicleta-ergometrica-spinning/up/MLBU3325822548",
};

export const miniBikeSlides: CarouselSlide[] = [
  { src: miniBikeImg, alt: "Mini bike ergométrica Ultimate Fitness portátil para exercícios em casa", label: "Imagem principal do produto" },
  { alt: "Mini bike Ultimate Fitness utilizada em exercício sentado", label: "Produto em uso em casa" },
  { alt: "Detalhes da mini bike ergométrica Ultimate Fitness", label: "Detalhes do equipamento" },
  { alt: "Benefícios e características da mini bike Ultimate Fitness", label: "Benefícios e características" },
  { alt: "Produto Ultimate Fitness com envio Full pelo Mercado Livre", label: "Compra com envio Full" },
];

export const spinningSlides: CarouselSlide[] = [
  { src: spinningImg, alt: "Bicicleta ergométrica spinning Ultimate Fitness para cardio em casa", label: "Imagem principal do produto" },
  { alt: "Bicicleta spinning Ultimate Fitness em uso em casa", label: "Produto em uso em casa" },
  { alt: "Detalhes da bicicleta ergométrica spinning Ultimate Fitness", label: "Detalhes do equipamento" },
  { alt: "Benefícios e características da bicicleta spinning Ultimate Fitness", label: "Benefícios e características" },
  { alt: "Produto Ultimate Fitness com envio Full pelo Mercado Livre", label: "Compra com envio Full" },
];
