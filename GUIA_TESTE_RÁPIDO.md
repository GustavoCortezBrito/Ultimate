# 🧪 Guia de Teste Rápido - Atualização de Preços ML

## ⚡ Testes Locais (Antes do Deploy)

### 1️⃣ Testar scraping standalone
```bash
node scripts/test-ml-scraping.js
```

**O que vai acontecer:**
- ✅ Testa scraping de cada produto
- ✅ Mostra preços extraídos
- ✅ Indica taxa de sucesso
- ✅ Exibe erros se houver

**Resultado esperado:**
```
✅ Sucessos: 3
❌ Falhas: 0
📈 Taxa de sucesso: 100.0%

💰 PREÇOS EXTRAÍDOS:
miniBike        R$     139.90
spinning        R$     749.00
miniBike2       R$     198.90
```

### 2️⃣ Verificar preços atuais no JSON
```bash
npm run ml:prices
```

**Mostra:**
- Data da última atualização
- Preço de cada produto

### 3️⃣ Testar endpoint local (requer servidor rodando)

**Terminal 1:**
```bash
npm run dev
```

**Terminal 2:**
```bash
# Verificar produtos
npm run ml:check

# Forçar atualização (funciona sem CRON_SECRET em dev)
npm run ml:update
```

## 🚀 Testes em Produção (Após Deploy)

### 1️⃣ Verificar status da API
```bash
curl https://ultimatefitness.com.br/api/ml-products
```

**Verifique:**
- Campo `lastUpdated` - deve estar recente
- Preços dos produtos atualizados

### 2️⃣ Verificar Cron Job na Vercel

1. Acesse: https://vercel.com/seu-projeto/settings/crons
2. Verifique se `update-ml` está **Active**
3. Veja próxima execução programada

### 3️⃣ Forçar atualização manual

```bash
# Substitua SEU-TOKEN pelo valor do CRON_SECRET
curl -X GET \
  -H "Authorization: Bearer SEU-TOKEN" \
  https://ultimatefitness.com.br/api/cron/update-ml
```

**Resposta esperada (sucesso):**
```json
{
  "success": true,
  "message": "Preços atualizados com sucesso",
  "updatedCount": 3,
  "lastUpdated": "2026-08-28T17:30:00.000Z",
  "data": {
    "miniBike": { "price": 139.90, ... },
    "spinning": { "price": 749.00, ... },
    "miniBike2": { "price": 198.90, ... }
  }
}
```

**Resposta esperada (sem autenticação):**
```json
{
  "error": "Unauthorized"
}
```

### 4️⃣ Monitorar logs em tempo real

```bash
# Instalar Vercel CLI (se ainda não tem)
npm i -g vercel

# Ver logs em tempo real
vercel logs --follow
```

Ou acesse: https://vercel.com/seu-projeto/logs

## 🔍 Checklist de Verificação

### Antes do Deploy:
- [ ] Código atualizado em todos os arquivos
- [ ] Teste local de scraping executado com sucesso
- [ ] Servidor local funcionando (`npm run dev`)
- [ ] Endpoint `/api/cron/update-ml` funcionando localmente

### Configuração na Vercel:
- [ ] `CRON_SECRET` configurado nas Environment Variables
- [ ] Aplicado para "Production" e "Preview"
- [ ] Deploy realizado

### Após Deploy:
- [ ] Cron job aparece como "Active" no painel
- [ ] Teste manual com autenticação funcionou
- [ ] Campo `lastUpdated` foi atualizado
- [ ] Preços no JSON foram atualizados
- [ ] Logs não mostram erros

## 🐛 Problemas Comuns e Soluções

### ❌ "Unauthorized" ao chamar o cron

**Causa:** CRON_SECRET não configurado ou incorreto

**Solução:**
```bash
# Gerar novo token
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Adicionar na Vercel:
# Settings → Environment Variables → CRON_SECRET
```

### ❌ Preços não atualizando

**Causa:** Cron não está executando

**Verificar:**
1. Vercel → Settings → Crons → Status deve ser "Active"
2. Vercel → Logs → Filtrar por `/api/cron/update-ml`
3. Ver última execução e erros

**Solução:**
```bash
# Forçar manualmente
curl -H "Authorization: Bearer TOKEN" \
  https://ultimatefitness.com.br/api/cron/update-ml
```

### ❌ Scraping retorna null

**Causa:** Mercado Livre mudou estrutura HTML ou bloqueou

**Verificar:**
```bash
# Testar localmente
node scripts/test-ml-scraping.js

# Ver o HTML retornado
curl -A "Mozilla/5.0" https://www.mercadolivre.com.br/...
```

**Solução:**
- Ajustar regex de extração
- Adicionar delay entre requisições
- Usar User-Agent diferente

### ❌ Timeout na função

**Causa:** Scraping demora mais que 60s

**Solução:** Aumentar `maxDuration` em `route.ts`:
```typescript
export const maxDuration = 300; // 5 minutos (requer plano Pro)
```

### ❌ Cron não aparece no painel

**Causa:** `vercel.json` não foi reconhecido

**Solução:**
```bash
# Verificar se existe
cat vercel.json

# Fazer redeploy
git add vercel.json
git commit -m "chore: adicionar configuração de cron"
git push
```

## 📅 Horários de Execução

**Configuração atual:** Diariamente às **03:00 UTC** (00:00 BRT)

**Para alterar:** Edite `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron/update-ml",
    "schedule": "0 */6 * * *"  // A cada 6 horas
  }]
}
```

**Formatos comuns:**
- `0 3 * * *` - Diariamente às 3h UTC
- `0 */6 * * *` - A cada 6 horas
- `*/30 * * * *` - A cada 30 minutos
- `0 0 * * 1` - Toda segunda-feira à meia-noite

## 🎯 Comandos Úteis

```bash
# Ver última atualização (produção)
curl https://ultimatefitness.com.br/api/ml-products | grep lastUpdated

# Forçar atualização (produção)
curl -H "Authorization: Bearer $CRON_SECRET" \
  https://ultimatefitness.com.br/api/cron/update-ml | jq

# Ver preços locais
npm run ml:prices

# Testar scraping
node scripts/test-ml-scraping.js

# Deploy
git push && vercel --prod
```

## 📊 Validação Final

Execute esta sequência para validar tudo:

```bash
# 1. Testar scraping
node scripts/test-ml-scraping.js

# 2. Commitar mudanças
git add .
git commit -m "fix: implementar atualização automática de preços ML"
git push

# 3. Aguardar deploy (ou forçar)
vercel --prod

# 4. Verificar cron ativo
# → Vercel Dashboard → Settings → Crons

# 5. Testar manualmente
curl -H "Authorization: Bearer TOKEN" \
  https://ultimatefitness.com.br/api/cron/update-ml

# 6. Verificar resultado
curl https://ultimatefitness.com.br/api/ml-products | jq '.lastUpdated'
```

✅ Se todos os passos funcionaram, está tudo certo!

## 🆘 Precisa de Ajuda?

1. **Ver logs detalhados:** https://vercel.com/seu-projeto/logs
2. **Testar localmente:** `npm run dev` + `npm run ml:update`
3. **Verificar status:** https://vercel.com/seu-projeto/settings/crons
4. **Documentação completa:** Ver `MERCADO_LIVRE_API.md`

---

**Próxima execução automática:** Amanhã às 03:00 UTC (00:00 BRT) 🚀
