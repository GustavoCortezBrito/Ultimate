# 🛒 Integração com API do Mercado Livre

## 📦 O que foi implementado

### ✅ Arquivos criados/atualizados:

1. **`src/lib/mercadolivre.ts`** - Biblioteca com funções de scraping e atualização
2. **`src/app/api/ml-products/route.ts`** - API pública para buscar dados dos produtos
3. **`src/app/api/cron/update-ml/route.ts`** - Cron job automático que **atualiza os preços a cada 24h**
4. **`src/data/ml_prices.json`** - Arquivo JSON com preços atualizados automaticamente
5. **`src/components/MLProductInfo.tsx`** - Componente React para exibir dados
6. **`vercel.json`** - Configuração do Vercel Cron
7. **`.github/workflows/update-ml-prices.yml`** - GitHub Actions (backup alternativo)

## 🚀 Como funciona

### 1. Atualização automática (1x ao dia) - ATUALIZADO ✨

O Vercel Cron executa `/api/cron/update-ml` automaticamente às **3h da manhã** todos os dias.

**IMPORTANTE:** Agora a rota `/api/cron/update-ml` **executa o scraping e atualiza** o arquivo `ml_prices.json` automaticamente!

```json
{
  "crons": [{
    "path": "/api/cron/update-ml",
    "schedule": "0 3 * * *"  // Todos os dias às 3h UTC (00h BRT)
  }]
}
```

**O que acontece quando o cron executa:**
1. ✅ Faz scraping dos 3 produtos no Mercado Livre
2. ✅ Extrai: preço atual, preço original, avaliações, reviews
3. ✅ Atualiza o arquivo `src/data/ml_prices.json`
4. ✅ Retorna resposta com dados atualizados

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

### 1. Adicionar variável de ambiente (OBRIGATÓRIO para produção)
No painel da Vercel → Settings → Environment Variables:

```
CRON_SECRET=seu-token-secreto-aqui
```

**Como gerar um token seguro:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Exemplo de token:**
```
a3f8b2c1d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2
```

### 2. Configurar o Cron Secret no Vercel

1. Acesse: https://vercel.com/seu-projeto/settings/environment-variables
2. Adicione a variável `CRON_SECRET` com o token gerado
3. **IMPORTANTE:** Aplique para "Production" e "Preview"
4. Faça redeploy do projeto

### 3. Habilitar o Cron Job

Após o deploy, o Vercel automaticamente:
- ✅ Detecta o `vercel.json`
- ✅ Configura o cron job
- ✅ Executa 1x ao dia automaticamente às 3h UTC

**Verificar se está ativo:**
1. Acesse: https://vercel.com/seu-projeto/settings/crons
2. Você verá: `update-ml` com status "Active"
3. Clique em "Logs" para ver as execuções

### 4. Verificar execuções do Cron

No painel da Vercel → Deployments → Crons:
- Veja o histórico de execuções
- Status de sucesso/erro
- Logs de cada execução

## 🧪 Como testar

### Teste 1: Verificar dados atuais
```bash
# Local
curl http://localhost:3000/api/ml-products

# Produção
curl https://ultimatefitness.com.br/api/ml-products
```

**Resposta esperada:**
```json
{
  "success": true,
  "data": {
    "miniBike": {
      "id": "miniBike",
      "price": 139.90,
      "originalPrice": 154.90,
      "ratingAverage": 4.8,
      "reviewsTotal": 2061,
      ...
    },
    ...
  },
  "lastUpdated": "2026-08-28T03:00:00.000Z"
}
```

### Teste 2: Forçar atualização manual (COM autenticação)

**⚠️ IMPORTANTE:** Você precisa do `CRON_SECRET` configurado na Vercel!

```bash
# Substitua SEU-TOKEN-AQUI pelo valor da variável CRON_SECRET
curl -H "Authorization: Bearer SEU-TOKEN-AQUI" \
  https://ultimatefitness.com.br/api/cron/update-ml
```

**Resposta esperada em caso de sucesso:**
```json
{
  "success": true,
  "message": "Preços atualizados com sucesso",
  "updatedCount": 3,
  "lastUpdated": "2026-08-28T14:30:00.000Z",
  "data": { ... }
}
```

**Resposta esperada em caso de erro de autenticação:**
```json
{
  "error": "Unauthorized"
}
```

### Teste 3: Verificar se o arquivo foi atualizado

Após executar o cron, verifique:
```bash
# Verificar a data de lastUpdated
cat src/data/ml_prices.json | grep lastUpdated

# Ou veja o arquivo completo
cat src/data/ml_prices.json
```

### Teste 4: Simular o cron localmente

```bash
# Terminal 1: Iniciar o servidor
npm run dev

# Terminal 2: Chamar o endpoint (sem autenticação em dev)
curl http://localhost:3000/api/cron/update-ml
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

Para adicionar mais produtos, edite `src/lib/mercadolivre.ts` na constante `ML_LINKS`:

```typescript
const ML_LINKS = {
  miniBike: "https://www.mercadolivre.com.br/ultimate-fitness-mini-bike-bicicleta-ergometrica/up/MLBU2934790909",
  spinning: "https://www.mercadolivre.com.br/ultimate-fitness-bicicleta-ergometrica-spinning/up/MLBU3325822548",
  miniBike2: "https://www.mercadolivre.com.br/ultimate-fitness-mini-bike-bicicleta-ergometrica/up/MLBU2954483127",
  novoModelo: "https://www.mercadolivre.com.br/seu-produto/up/MLBU123456789", // Adicione aqui
};
```

Após adicionar:
1. ✅ Faça deploy na Vercel
2. ✅ O cron automaticamente vai buscar o novo produto na próxima execução (3h UTC)
3. ✅ Ou force manualmente: `curl -H "Authorization: Bearer TOKEN" .../api/cron/update-ml`

## 🐛 Troubleshooting (Resolução de Problemas)

### ❌ Problema: Preços não estão atualizando

**Possíveis causas:**

1. **CRON_SECRET não configurado**
   - Solução: Configure no painel da Vercel → Environment Variables
   - Verifique se está aplicado em "Production"

2. **Cron Job não está ativo**
   - Verificar: https://vercel.com/seu-projeto/settings/crons
   - Se não aparecer, faça redeploy do projeto

3. **Erro no scraping**
   - Verifique os logs: Vercel → Deployments → Function Logs
   - O Mercado Livre pode bloquear muitas requisições

4. **Timeout da função**
   - A rota tem `maxDuration = 60` segundos
   - Se o scraping demorar mais, aumentar para 300 (plano Pro da Vercel)

### ✅ Como verificar se está funcionando:

```bash
# 1. Ver a data da última atualização
curl https://ultimatefitness.com.br/api/ml-products | grep lastUpdated

# 2. Ver logs do cron na Vercel
# Acesse: https://vercel.com/seu-projeto/logs
# Filtre por: /api/cron/update-ml

# 3. Forçar atualização manual
curl -H "Authorization: Bearer SEU-TOKEN" \
  https://ultimatefitness.com.br/api/cron/update-ml
```

### 💡 Dica: Monitorar atualizações

Adicione este script ao seu `package.json`:

```json
{
  "scripts": {
    "check-prices": "curl https://ultimatefitness.com.br/api/ml-products | jq '.lastUpdated'",
    "force-update": "curl -H \"Authorization: Bearer $CRON_SECRET\" https://ultimatefitness.com.br/api/cron/update-ml"
  }
}
```

Uso:
```bash
npm run check-prices
npm run force-update
```

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
