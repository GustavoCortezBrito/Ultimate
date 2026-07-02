import miniBike1 from "@/assets/mini-bike-1.png";
import miniBike2 from "@/assets/mini-bike-2.png";
import miniBike3 from "@/assets/mini-bike-3.png";
import miniBike4 from "@/assets/mini-bike-4.jpg";
import miniBike5 from "@/assets/mini-bike-5.jpg";

import spinning1 from "@/assets/spinning-1.png";
import spinning2 from "@/assets/spinning-6.jpg";
import spinning3 from "@/assets/spinning-2.png";
import spinning4 from "@/assets/spinning-3.png";
import spinning5 from "@/assets/spinning-4.png";
import spinning6 from "@/assets/spinning-5.jpg";

import type { CarouselSlide } from "@/components/ProductCarousel";

export const ML_LINKS = {
  miniBike:
    "https://www.mercadolivre.com.br/ultimate-fitness-mini-bike-bicicleta-ergometrica/up/MLBU2934790909",
  spinning:
    "https://www.mercadolivre.com.br/ultimate-fitness-bicicleta-ergometrica-spinning/up/MLBU3325822548",
};

export const miniBikeSlides: CarouselSlide[] = [
  { src: miniBike1, alt: "Mini bike ergométrica Ultimate Fitness com caixa", label: "Imagem principal do produto com caixa" },
  { src: miniBike2, alt: "Mini bike ergométrica Ultimate Fitness portátil para exercícios em casa", label: "Imagem do produto" },
  { src: miniBike3, alt: "Ficha técnica e dimensões da mini bike Ultimate Fitness", label: "Dimensões e especificações" },
  { src: miniBike4, alt: "Detalhes do painel digital LCD de controle", label: "Painel LCD digital" },
  { src: miniBike5, alt: "Pessoas exercitando pernas e braços com a mini bike", label: "Produto em uso" },
];

export const spinningSlides: CarouselSlide[] = [
  { src: spinning1, alt: "Bicicleta ergométrica spinning Ultimate Fitness com caixa", label: "Imagem principal do produto com caixa" },
  { src: spinning2, alt: "Bicicleta ergométrica spinning Ultimate Fitness treine sem sair de casa", label: "Imagem do produto" },
  { src: spinning3, alt: "Diferenciais e especificações de qualidade da bicicleta spinning", label: "Diferenciais do equipamento" },
  { src: spinning4, alt: "Dimensões e regulagens de guidão e banco da bicicleta spinning", label: "Dimensões e regulagens" },
  { src: spinning5, alt: "Especificações e performance da bicicleta de spinning", label: "Ficha técnica de performance" },
  { src: spinning6, alt: "Diferentes ambientes de uso residencial e home office", label: "Uso em casa e escritório" },
];
