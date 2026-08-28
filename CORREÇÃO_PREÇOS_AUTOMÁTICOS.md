# 🔧 Correção: Atualização Automática de Preços do Mercado Livre

## 🚨 Problema Identificado

Os preços do Mercado Livre **NÃO** estavam atualizando a cada 24 horas.

**Última atualização detectada:** 27 de julho de 2026  
**Data atual:** 28 de agosto de 2026  
**Período sem atualização:** +30 dias ❌

## 🔍 Causa Raiz

A rota `/api/cron/update-ml/route.ts` estava **apenas lendo** o arquivo JSON, mas **não executava o scraping** para atualizar os preços.

### Código Anterior (INCORRETO):
```typescript
// ❌ Apenas retornava os dados antigos
export async function GET() {
  const products = getStoredMLProducts(); // Lê arquivo estático
  return NextResponse.json({ data: products });
}
```

### Código Corrigido (CORRETO):
```typescript
// ✅ Executa scraping e atualiza o arquivo JSON
export async function GET() {
  const updateResult = await updateMLPrices(); // Scraping + atualização
  const products = getStoredMLProducts();
  return NextResponse.json({ data: products, ...updateResult });
}
```

## ✅ Correções Aplicadas

### 1. Arquivo: `src/lib/mercadolivre.ts`

**Adicionado:**
- ✅ Função `scrapeMLProduct()` - Faz scraping de um produto do ML usando fetch + regex
- ✅ Função `updateMLPrices()` - Orquestra scraping de todos os produtos e salva no JSON
- ✅ Extração de: preço atual, preço original, avaliações, número de reviews

**Como funciona:**
1. Faz requisição HTTP para cada URL do Mercado Livre
2. Extrai dados usando regex do HTML retornado
3. Atualiza o arquivo `src/data/ml_prices.json`
4. Retorna resultado com `updatedCount` e `lastUpdated`

### 2. Arquivo: `src/app/api/cron/update-ml/route.ts`

**Alterado:**
- ✅ Agora **executa** `updateMLPrices()` ao invés de apenas ler dados
- ✅ Adicionado `maxDuration = 60` para permitir tempo suficiente para scraping
- ✅ Adicionado `dynamic = 'force-dynamic'` para evitar cache
- ✅ Retorna informações detalhadas: `updatedCount`, `lastUpdated`, `success`

### 3. Arquivo: `MERCADO_LIVRE_API.md`

**Atualizado:**
- ✅ Documentação completa sobre como funciona o cron
- ✅ Instruções de configuração do `CRON_SECRET`
- ✅ Seção de troubleshooting
- ✅ Comandos para testar manualmente
- ✅ Como verificar se está funcionando

## 🚀 Como Testar Agora

### 1. Verificar última atualização:
```bash
curl https://ultimatefitness.com.br/api/ml-products | grep lastUpdated
```

### 2. Forçar atualização manual (requer CRON_SECRET):
```bash
curl -H "Authorization: Bearer SEU-TOKEN-AQUI" \
  https://ultimatefitness.com.br/api/cron/update-ml
```

**Resposta esperada (sucesso):**
```json
{
  "success": true,
  "message": "Preços atualizados com sucesso",
  "updatedCount": 3,
  "lastUpdated": "2026-08-28T14:30:00.000Z",
  "data": { ... }
}
```

### 3. Verificar no arquivo local:
```bash
cat src/data/ml_prices.json | grep lastUpdated
```

## ⚙️ Configuração Necessária na Vercel

### Passo 1: Gerar CRON_SECRET

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Exemplo de token gerado:**
```
a3f8b2c1d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2
```

### Passo 2: Adicionar na Vercel

1. Acesse: https://vercel.com/seu-projeto/settings/environment-variables
2. Clique em "Add New"
3. Nome: `CRON_SECRET`
4. Valor: Cole o token gerado
5. Aplique para: **Production** e **Preview**
6. Salve

### Passo 3: Fazer Redeploy

```bash
git add .
git commit -m "fix: corrigir atualização automática de preços ML"
git push
```

Ou na Vercel: Deployments → ⋯ → Redeploy

### Passo 4: Verificar Cron Ativo

1. Acesse: https://vercel.com/seu-projeto/settings/crons
2. Você deve ver: `update-ml` com status **Active**
3. Schedule: `0 3 * * *` (diariamente às 3h UTC / 00h BRT)

## 📊 Monitoramento

### Ver logs de execução do Cron:

1. **Via Vercel Dashboard:**
   - Acesse: https://vercel.com/seu-projeto/logs
   - Filtre por: `/api/cron/update-ml`
   - Veja execuções, erros, tempo de resposta

2. **Via linha de comando:**
   ```bash
   # Instalar Vercel CLI
   npm i -g vercel
   
   # Ver logs
   vercel logs --follow
   ```

### Script de monitoramento:

Adicione ao `package.json`:

```json
{
  "scripts": {
    "check-ml-prices": "curl https://ultimatefitness.com.br/api/ml-products | jq '.lastUpdated'",
    "force-ml-update": "curl -H \"Authorization: Bearer $CRON_SECRET\" https://ultimatefitness.com.br/api/cron/update-ml"
  }
}
```

Uso:
```bash
# Ver última atualização
npm run check-ml-prices

# Forçar atualização agora (requer CRON_SECRET como variável de ambiente)
export CRON_SECRET="seu-token-aqui"
npm run force-ml-update
```

## 🔄 Fluxo de Atualização

```
Vercel Cron (diariamente às 3h UTC)
    ↓
Chama: /api/cron/update-ml
    ↓
Verifica autenticação (CRON_SECRET)
    ↓
Executa: updateMLPrices()
    ↓
Para cada produto em ML_LINKS:
    ├─ Faz requisição HTTP ao Mercado Livre
    ├─ Extrai dados com regex
    ├─ Atualiza objeto de produtos
    ↓
Salva: src/data/ml_prices.json
    ↓
Retorna: { success, updatedCount, lastUpdated, data }
```

## 📈 Próximos Passos (Opcional)

1. **Adicionar alertas:**
   - Notificar via Telegram/Email se preço mudar > X%
   - Alertar se scraping falhar 3x seguidas

2. **Histórico de preços:**
   - Salvar em banco de dados (Supabase, PostgreSQL)
   - Criar gráficos de evolução de preços

3. **Monitoramento proativo:**
   - Integrar com Sentry para alertas de erros
   - Criar dashboard com status de cada produto

4. **Backup alternativo:**
   - GitHub Actions já configurado como fallback
   - Pode ser usado caso Vercel Cron falhe

## ✅ Checklist de Verificação

Marque ao concluir cada item:

- [ ] Código atualizado e commitado
- [ ] Deploy realizado na Vercel
- [ ] CRON_SECRET configurado nas env vars
- [ ] Cron job aparece como "Active" no painel
- [ ] Teste manual executado com sucesso
- [ ] `lastUpdated` no JSON atualizado
- [ ] Verificado logs de execução do cron
- [ ] Documentação revisada

## 📞 Suporte

Se continuar com problemas:

1. Verificar logs na Vercel: https://vercel.com/seu-projeto/logs
2. Testar localmente: `npm run dev` → `curl localhost:3000/api/cron/update-ml`
3. Validar CRON_SECRET: verificar se está correto no `.env.local` e na Vercel

---

**Status:** ✅ Correção aplicada - aguardando deploy e teste em produção

**Data da correção:** 28 de agosto de 2026

**Próxima atualização automática:** 29 de agosto de 2026 às 03:00 UTC (00:00 BRT)
