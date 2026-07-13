# 🚀 Setup Completo - Integração Mercado Livre

## ✅ O que foi instalado

### 1. **API do Mercado Livre** (atualização automática 1x ao dia)
- Busca preços, estoque, avaliações automaticamente
- Cron job configurado para executar às 3h da manhã
- Cache de 24 horas para performance

### 2. **Google Analytics & Google Ads** (já funcionando)
- Google Ads: `AW-16808494138` ✅
- Google Analytics: `G-31X50BQS14` ✅

---

## 📦 Arquivos criados

```
├── src/
│   ├── lib/
│   │   └── mercadolivre.ts              # Biblioteca da API do ML
│   ├── app/
│   │   └── api/
│   │       ├── ml-products/
│   │       │   └── route.ts             # API pública dos produtos
│   │       └── cron/
│   │           └── update-ml/
│   │               └── route.ts         # Cron job (1x ao dia)
│   └── components/
│       ├── GoogleTags.tsx               # Tags do Google (já instalado)
│       └── MLProductInfo.tsx            # Componente React para ML
├── vercel.json                          # Config do Vercel Cron
├── .env.example                         # Variáveis de ambiente
├── MERCADO_LIVRE_API.md                 # Documentação completa
├── EXEMPLO_USO_ML_API.tsx               # Exemplos de uso
└── GOOGLE_ANALYTICS_SETUP.md            # Docs do Google Analytics
```

---

## 🔧 Passos para ativar (Vercel)

### 1. **Gerar token secreto para o Cron**

No terminal (local ou Vercel):
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copie o token gerado.

### 2. **Adicionar variável de ambiente na Vercel**

1. Acesse: **Vercel Dashboard** → Seu Projeto → **Settings** → **Environment Variables**
2. Adicione:
   - **Name**: `CRON_SECRET`
   - **Value**: (cole o token gerado)
   - **Environments**: Production, Preview, Development

### 3. **Deploy na Vercel**

```bash
git add .
git commit -m "feat: integração com API do Mercado Livre"
git push
```

A Vercel vai detectar automaticamente o `vercel.json` e configurar o cron job! 🎉

### 4. **Verificar se está funcionando**

Após o deploy:

1. **Testar a API manualmente:**
   ```bash
   curl https://seu-site.com.br/api/ml-products
   ```

2. **Forçar execução do cron (teste):**
   ```bash
   curl -H "Authorization: Bearer SEU_TOKEN_SECRETO" \
     https://seu-site.com.br/api/cron/update-ml
   ```

3. **Ver logs do cron na Vercel:**
   - Dashboard → Seu Projeto → **Logs**
   - Procure por `[CRON]` nos logs

---

## 💻 Como usar no seu código

### Opção 1: Componente pronto (mais fácil)

```tsx
import MLProductInfo from "@/components/MLProductInfo";

export default function ProductPage() {
  return (
    <div>
      <h1>Mini Bike Ultimate Fitness</h1>
      <MLProductInfo productKey="miniBike" fallbackPrice={299.90} />
      <button>Comprar</button>
    </div>
  );
}
```

### Opção 2: Buscar dados manualmente

```tsx
"use client";
import { useEffect, useState } from "react";

export default function Products() {
  const [products, setProducts] = useState(null);

  useEffect(() => {
    fetch("/api/ml-products")
      .then(res => res.json())
      .then(data => setProducts(data.data));
  }, []);

  return (
    <div>
      <h2>R$ {products?.miniBike?.price}</h2>
    </div>
  );
}
```

Veja mais exemplos em: **`EXEMPLO_USO_ML_API.tsx`**

---

## ⏰ Horários do Cron

Configurado em `vercel.json`:

```json
{
  "crons": [{
    "path": "/api/cron/update-ml",
    "schedule": "0 3 * * *"  // 3h da manhã, todo dia
  }]
}
```

### Alterar horário:

- **Meia-noite**: `"0 0 * * *"`
- **A cada 6 horas**: `"0 */6 * * *"`
- **A cada 12 horas**: `"0 */12 * * *"`
- **Às 9h**: `"0 9 * * *"`

Formato: `minuto hora dia mês dia-da-semana`

---

## 🧪 Testar localmente

### 1. Instalar dependências (se necessário)
```bash
npm install
```

### 2. Rodar o servidor Next.js
```bash
npm run dev
```

### 3. Testar as APIs

**API de produtos:**
```bash
curl http://localhost:3000/api/ml-products
```

**Cron (sem autenticação em desenvolvimento):**
```bash
curl http://localhost:3000/api/cron/update-ml
```

---

## 📊 Dados disponíveis da API

Cada produto retorna:

```json
{
  "miniBike": {
    "id": "MLB123456789",
    "title": "Mini Bike Ultimate Fitness",
    "price": 299.90,
    "originalPrice": 399.90,
    "currencyId": "BRL",
    "availableQuantity": 50,
    "soldQuantity": 150,
    "freeShipping": true,
    "status": "active",
    "ratingAverage": 4.5,
    "reviewsTotal": 32,
    "lastUpdated": "2024-01-15T03:00:00.000Z"
  }
}
```

---

## 🎯 Próximas melhorias (opcional)

1. **Salvar histórico de preços** (gráfico de evolução)
2. **Notificações de mudança de preço** (Email/Telegram)
3. **Alertas de estoque baixo**
4. **Dashboard administrativo**
5. **Integração com banco de dados** (Supabase, MongoDB)

---

## 📚 Links úteis

- [API Mercado Livre](https://developers.mercadolivre.com.br/pt_br/itens-e-buscas)
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)
- [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

---

## ❓ FAQ

### Como sei se o cron está rodando?
Veja os logs na Vercel Dashboard → Logs. Procure por `[CRON]`.

### Posso executar o cron mais de 1x ao dia?
Sim! Edite o `schedule` no `vercel.json`.

### E se a API do ML ficar fora do ar?
O componente usa um `fallbackPrice` como backup.

### Preciso pagar algo?
Não! A API pública do ML é gratuita (sem autenticação).

### Funciona com outros marketplaces?
Sim, mas precisa adaptar o código para cada API.

---

**🎉 Tudo pronto!** Seus produtos agora atualizam automaticamente do Mercado Livre!
