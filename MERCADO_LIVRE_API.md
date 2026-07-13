# 🛒 Integração com API do Mercado Livre

## 📦 O que foi implementado

### ✅ Arquivos criados:

1. **`src/lib/mercadolivre.ts`** - Biblioteca para interagir com a API do ML
2. **`src/app/api/ml-products/route.ts`** - API pública para buscar dados dos produtos
3. **`src/app/api/cron/update-ml/route.ts`** - Cron job automático (1x ao dia)
4. **`src/components/MLProductInfo.tsx`** - Componente React para exibir dados
5. **`vercel.json`** - Configuração do Vercel Cron

## 🚀 Como funciona

### 1. Busca automática (1x ao dia)
O Vercel Cron executa `/api/cron/update-ml` automaticamente às **3h da manhã** todos os dias:

```json
{
  "crons": [{
    "path": "/api/cron/update-ml",
    "schedule": "0 3 * * *"  // Todos os dias às 3h
  }]
}
```

### 2. API pública
Qualquer página pode buscar dados atualizados:

```typescript
const response = await fetch('/api/ml-products');
const data = await response.json();

// Retorna:
{
  "success": true,
  "data": {
    "miniBike": {
      "price": 299.90,
      "originalPrice": 399.90,
      "soldQuantity": 150,
      "freeShipping": true,
      ...
    },
    "spinning": { ... }
  }
}
```

### 3. Componente React
Use o componente para exibir preços atualizados:

```tsx
import MLProductInfo from "@/components/MLProductInfo";

<MLProductInfo 
  productKey="miniBike" 
  fallbackPrice={299.90}  // Preço padrão se a API falhar
/>
```

## 📊 Dados disponíveis

Cada produto retorna:

- ✅ **Preço atual** (`price`)
- ✅ **Preço original** (`originalPrice`)
- ✅ **Quantidade disponível** (`availableQuantity`)
- ✅ **Quantidade vendida** (`soldQuantity`)
- ✅ **Frete grátis?** (`freeShipping`)
- ✅ **Status** (`active`, `paused`, etc.)
- ✅ **Avaliações** (`ratingAverage`, `reviewsTotal`)
- ✅ **Última atualização** (`lastUpdated`)

## 🔧 Configuração na Vercel

### 1. Adicionar variável de ambiente (segurança)
No painel da Vercel → Settings → Environment Variables:

```
CRON_SECRET=seu-token-secreto-aqui
```

Gere um token aleatório:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Deploy
Quando você fizer deploy, o Vercel automaticamente:
- ✅ Detecta o `vercel.json`
- ✅ Configura o cron job
- ✅ Executa 1x ao dia automaticamente

## 🧪 Como testar

### Testar a API manualmente:
```bash
# Local
curl http://localhost:3000/api/ml-products

# Produção
curl https://seu-site.com.br/api/ml-products
```

### Testar o cron manualmente:
```bash
# Com autenticação
curl -H "Authorization: Bearer seu-token-secreto" \
  https://seu-site.com.br/api/cron/update-ml
```

## 💡 Como usar no seu site

### Opção 1: Usar o componente React

```tsx
import MLProductInfo from "@/components/MLProductInfo";

export default function ProductPage() {
  return (
    <div>
      <h1>Mini Bike</h1>
      <MLProductInfo productKey="miniBike" fallbackPrice={299.90} />
      <button>Comprar no Mercado Livre</button>
    </div>
  );
}
```

### Opção 2: Buscar dados manualmente

```tsx
"use client";
import { useEffect, useState } from "react";

export default function ProductPage() {
  const [price, setPrice] = useState(null);

  useEffect(() => {
    fetch('/api/ml-products')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPrice(data.data.miniBike.price);
        }
      });
  }, []);

  return <div>Preço: R$ {price}</div>;
}
```

## 📝 Adicionar novos produtos

Para adicionar mais produtos, edite `src/data/products.ts`:

```typescript
export const ML_LINKS = {
  miniBike: "https://...",
  spinning: "https://...",
  novoModelo: "https://www.mercadolivre.com.br/.../MLB123456789", // Adicione aqui
};
```

A API automaticamente vai buscar o novo produto! 🎉

## ⚙️ Alterar horário do cron

Edite `vercel.json`:

```json
{
  "crons": [{
    "path": "/api/cron/update-ml",
    "schedule": "0 */6 * * *"  // A cada 6 horas
    // ou
    "schedule": "0 0 * * *"     // Meia-noite
    // ou
    "schedule": "*/30 * * * *"  // A cada 30 minutos
  }]
}
```

Formato: `minuto hora dia mês dia-da-semana`

## 🎯 Próximos passos (opcional)

Se quiser melhorar ainda mais:

1. **Salvar em banco de dados** (Supabase, MongoDB, etc.)
2. **Notificar mudanças de preço** (Telegram, Email)
3. **Histórico de preços** (gráficos de evolução)
4. **Alertas de estoque baixo**
5. **Comparação de preços** (várias lojas)

## 📚 Documentação da API do ML

- [Items API](https://developers.mercadolivre.com.br/pt_br/itens-e-buscas)
- [Crons Vercel](https://vercel.com/docs/cron-jobs)

---

**Pronto!** Seus produtos agora atualizam automaticamente 1x ao dia! 🚀
