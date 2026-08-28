# 🔄 Fluxo de Atualização de Preços - Mercado Livre

## 📊 Visão Geral do Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    SISTEMA DE ATUALIZAÇÃO                    │
│                 Atualização Automática 24h                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────┐
        │    VERCEL CRON JOB (Principal)      │
        │    Schedule: 0 3 * * *              │
        │    (Diariamente às 3h UTC)          │
        └─────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────┐
        │   GitHub Actions (Backup)           │
        │   Caso Vercel falhe                 │
        └─────────────────────────────────────┘
```

## 🔄 Fluxo Detalhado - Vercel Cron

```
┌──────────────────────────────────────────────────────────────┐
│ 1. TRIGGER DO CRON                                           │
│    Horário: 03:00 UTC (00:00 BRT)                           │
│    Ação: Vercel executa automaticamente                      │
└──────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────┐
│ 2. CHAMADA DO ENDPOINT                                       │
│    GET /api/cron/update-ml                                   │
│    Header: Authorization: Bearer {CRON_SECRET}               │
└──────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────┐
│ 3. AUTENTICAÇÃO                                              │
│    ✓ Verifica CRON_SECRET                                    │
│    ✗ Se inválido → 401 Unauthorized                          │
│    ✓ Se válido → Continua                                    │
└──────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────┐
│ 4. EXECUTA updateMLPrices()                                  │
│    Inicia processo de scraping                               │
└──────────────────────────────────────────────────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────┐
        │  PARA CADA PRODUTO (3 total)    │
        └─────────────────────────────────┘
                          │
        ┌─────────────────┴─────────────────┐
        │                                   │
        ▼                                   ▼
┌───────────────┐               ┌────────────────┐
│  miniBike     │               │   spinning     │
└───────────────┘               └────────────────┘
        │                                   │
        └─────────────────┬─────────────────┘
                          │
                          ▼
              ┌───────────────────┐
              │    miniBike2      │
              └───────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────┐
│ 5. SCRAPING DE CADA PRODUTO                                  │
│                                                              │
│    a) Requisição HTTP ao Mercado Livre                       │
│       - URL do produto                                       │
│       - User-Agent: Mozilla/5.0...                           │
│       - Headers adequados                                    │
│                                                              │
│    b) Resposta HTML                                          │
│       - Página completa do produto                           │
│       - ~50-100 KB de dados                                  │
│                                                              │
│    c) Extração com Regex                                     │
│       ✓ Preço atual (fraction + cents)                       │
│       ✓ Preço original (se houver desconto)                  │
│       ✓ Avaliação média (rating)                             │
│       ✓ Total de reviews                                     │
│                                                              │
│    d) Validação                                              │
│       ✓ Preço é número válido?                               │
│       ✓ Preço > 0?                                           │
│       ✗ Se inválido → Mantém preço antigo                    │
│                                                              │
│    e) Pausa (2s entre produtos)                              │
│       - Evitar bloqueio por rate limiting                    │
└──────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────┐
│ 6. CONSOLIDAÇÃO DOS DADOS                                    │
│                                                              │
│    Cria objeto atualizado:                                   │
│    {                                                         │
│      "lastUpdated": "2026-08-28T03:00:15.234Z",             │
│      "products": {                                           │
│        "miniBike": {                                         │
│          "id": "miniBike",                                   │
│          "price": 139.90,                                    │
│          "originalPrice": 154.90,                            │
│          "ratingAverage": 4.8,                               │
│          "reviewsTotal": 2061,                               │
│          ...                                                 │
│        },                                                    │
│        ...                                                   │
│      }                                                       │
│    }                                                         │
└──────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────┐
│ 7. SALVAR NO ARQUIVO JSON                                    │
│                                                              │
│    Arquivo: src/data/ml_prices.json                         │
│    Formato: JSON com indentação (pretty print)              │
│    Encoding: UTF-8                                           │
└──────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────┐
│ 8. RETORNAR RESPOSTA                                         │
│                                                              │
│    Status: 200 OK                                            │
│    Body: {                                                   │
│      "success": true,                                        │
│      "message": "Preços atualizados com sucesso",            │
│      "updatedCount": 3,                                      │
│      "lastUpdated": "2026-08-28T03:00:15.234Z",             │
│      "data": { ... }                                         │
│    }                                                         │
└──────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────┐
│ 9. LOG NO VERCEL                                             │
│                                                              │
│    Vercel registra:                                          │
│    - Tempo de execução                                       │
│    - Status code                                             │
│    - Logs do console                                         │
│    - Possíveis erros                                         │
└──────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────┐
│ 10. PRÓXIMA EXECUÇÃO AGENDADA                                │
│                                                              │
│     Próximo trigger: Amanhã às 03:00 UTC                     │
└──────────────────────────────────────────────────────────────┘
```

## 🌐 Fluxo de Acesso dos Usuários

```
┌──────────────────────────────────────────────────────────────┐
│ USUÁRIO ACESSA O SITE                                        │
│ https://ultimatefitness.com.br                              │
└──────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────┐
│ PÁGINA CARREGA                                               │
│ Componente: ProductCard ou MLProductInfo                     │
└──────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────┐
│ BUSCA PREÇOS ATUALIZADOS                                     │
│                                                              │
│ Opção A: Server Component (SSR)                              │
│   import mlPrices from '@/data/ml_prices.json'               │
│   → Lê arquivo diretamente no servidor                       │
│                                                              │
│ Opção B: Client Component (CSR)                              │
│   fetch('/api/ml-products')                                  │
│   → Chama API que lê o arquivo                               │
└──────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────┐
│ EXIBE DADOS ATUALIZADOS                                      │
│                                                              │
│   Preço: R$ 139,90                                           │
│   De: R$ 154,90                                              │
│   ⭐ 4.8 (2061 avaliações)                                   │
│                                                              │
│   Última atualização: Hoje às 00:00                          │
└──────────────────────────────────────────────────────────────┘
```

## ⚡ Fluxo de Atualização Manual

```
┌──────────────────────────────────────────────────────────────┐
│ DESENVOLVEDOR FORÇA ATUALIZAÇÃO                              │
│                                                              │
│ curl -H "Authorization: Bearer TOKEN" \                      │
│   https://ultimatefitness.com.br/api/cron/update-ml         │
└──────────────────────────────────────────────────────────────┘
                          │
                          ▼
        [ Mesmo fluxo do Vercel Cron ]
                          │
                          ▼
┌──────────────────────────────────────────────────────────────┐
│ RESPOSTA IMEDIATA                                            │
│                                                              │
│ {                                                            │
│   "success": true,                                           │
│   "updatedCount": 3,                                         │
│   "lastUpdated": "2026-08-28T14:30:00.000Z"                 │
│ }                                                            │
└──────────────────────────────────────────────────────────────┘
```

## 🔧 Fluxo de Erro e Recuperação

```
┌──────────────────────────────────────────────────────────────┐
│ ERRO NO SCRAPING                                             │
│ (Timeout, bloqueio, HTML mudou, etc)                         │
└──────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────┐
│ PRODUTO INDIVIDUAL FALHA                                     │
│                                                              │
│   ⚠️  Log: "Failed to scrape miniBike"                       │
│   ✓  Mantém preço antigo do arquivo                          │
│   ✓  Continua para próximo produto                           │
└──────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────┐
│ TODOS OS PRODUTOS FALHARAM?                                  │
└──────────────────────────────────────────────────────────────┘
            │                             │
            ▼ SIM                         ▼ NÃO
┌───────────────────────┐   ┌─────────────────────────────────┐
│ RETORNA ERRO          │   │ ATUALIZAÇÃO PARCIAL             │
│                       │   │                                 │
│ {                     │   │ - Salva produtos que funcionaram│
│   "success": false,   │   │ - updatedCount = X (< 3)        │
│   "error": "...",     │   │ - Log dos que falharam          │
│   "updatedCount": 0   │   │ - Mantém dados antigos dos que  │
│ }                     │   │   falharam                      │
│                       │   │                                 │
│ Arquivo JSON não      │   │ {                               │
│ é modificado          │   │   "success": true,              │
│                       │   │   "updatedCount": 2,            │
│                       │   │   "partial": true               │
│                       │   │ }                               │
└───────────────────────┘   └─────────────────────────────────┘
```

## 📊 Cronograma Típico de Um Dia

```
00:00 BRT (03:00 UTC) ┌────────────────────────────────┐
                      │  Cron Trigger                  │
                      │  Início da atualização         │
                      └────────────────────────────────┘
                                  │
00:00:05 BRT          ┌────────────────────────────────┐
                      │  Scraping produto 1            │
                      └────────────────────────────────┘
                                  │
00:00:07 BRT          ┌────────────────────────────────┐
                      │  Pausa (2s)                    │
                      └────────────────────────────────┘
                                  │
00:00:09 BRT          ┌────────────────────────────────┐
                      │  Scraping produto 2            │
                      └────────────────────────────────┘
                                  │
00:00:11 BRT          ┌────────────────────────────────┐
                      │  Pausa (2s)                    │
                      └────────────────────────────────┘
                                  │
00:00:13 BRT          ┌────────────────────────────────┐
                      │  Scraping produto 3            │
                      └────────────────────────────────┘
                                  │
00:00:15 BRT          ┌────────────────────────────────┐
                      │  Salva ml_prices.json          │
                      │  Atualização concluída ✅       │
                      └────────────────────────────────┘
                                  │
00:00:16 BRT          ┌────────────────────────────────┐
                      │  Novos preços disponíveis      │
                      │  Site exibe dados atualizados  │
                      └────────────────────────────────┘
                                  │
                                  ▼
                      [ Aguarda próximas 24h ]
                                  │
                                  ▼
AMANHÃ 00:00 BRT      ┌────────────────────────────────┐
                      │  Próxima atualização           │
                      └────────────────────────────────┘
```

## 🎯 Pontos de Monitoramento

```
┌──────────────────────────────────────────────────────────────┐
│ 1. VERCEL DASHBOARD                                          │
│    → Settings → Crons                                        │
│    ✓ Status: Active                                          │
│    ✓ Última execução                                         │
│    ✓ Próxima execução                                        │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ 2. VERCEL LOGS                                               │
│    → Logs → Filter: /api/cron/update-ml                      │
│    ✓ Ver execuções                                           │
│    ✓ Ver erros                                               │
│    ✓ Ver tempo de resposta                                   │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ 3. API DE PRODUTOS                                           │
│    GET /api/ml-products                                      │
│    ✓ Ver campo lastUpdated                                   │
│    ✓ Verificar preços atualizados                            │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ 4. ARQUIVO LOCAL (após deploy)                               │
│    src/data/ml_prices.json                                   │
│    ✓ Ver no GitHub                                           │
│    ✓ Verificar lastUpdated                                   │
└──────────────────────────────────────────────────────────────┘
```

## 🔄 Backup: GitHub Actions

```
┌──────────────────────────────────────────────────────────────┐
│ APENAS SE VERCEL CRON FALHAR                                 │
│                                                              │
│ .github/workflows/update-ml-prices.yml                       │
│                                                              │
│ 1. Trigger: Diariamente às 03:00 UTC                         │
│ 2. Instala Playwright                                        │
│ 3. Executa scripts/update-prices.js                          │
│ 4. Atualiza ml_prices.json                                   │
│ 5. Commita mudanças no repositório                           │
│ 6. Push para main                                            │
│ 7. Vercel detecta push → Redeploy automático                 │
└──────────────────────────────────────────────────────────────┘
```

---

## 📈 Métricas de Sucesso

| Métrica | Meta | Como Verificar |
|---------|------|----------------|
| **Taxa de sucesso** | > 95% | Logs da Vercel |
| **Tempo de execução** | < 30s | Logs da Vercel |
| **Atualização diária** | 1x/dia | Campo `lastUpdated` |
| **Preços corretos** | 100% | Comparar com ML |
| **Uptime do cron** | > 99% | Dashboard Vercel |

---

**Este fluxo garante que os preços sejam atualizados automaticamente todos os dias! 🚀**
