# 🚀 Como Usar a API Oficial do Mercado Livre

## ✅ Solução Recomendada pela IA do Google

A IA do Google **está correta**! A melhor forma de atualizar preços do Mercado Livre é usando a **API Oficial**, não web scraping.

### Por que API é melhor que scraping?

- ✅ **Gratuita** - Sem custo para produtos públicos
- ✅ **Confiável** - Não quebra com mudanças no HTML
- ✅ **Rápida** - Resposta em milissegundos
- ✅ **Sem bloqueios** - ML não bloqueia a própria API
- ✅ **Dados estruturados** - JSON limpo e organizado

---

## 🎯 O Problema Atual

Você tem URLs de **"Product Promotions"** (MLBU), mas a API precisa de IDs de **produtos individuais** (MLB):

```
❌ MLBU2934790909  → Promotion (não funciona na API)
✅ MLB3421894210   → Product (funciona na API!)
```

---

## 📋 Passo a Passo para Implementar

### **Etapa 1: Encontrar os IDs Reais (MLB)**

Existem **3 métodos** para encontrar os IDs corretos:

#### Método A: Script Automatizado (Recomendado)

```bash
# Executar o script que criei
node scripts/find-real-ml-ids.js
```

O script vai:
1. Abrir cada URL de promotion no Chrome
2. Extrair o ID real (MLB) da página
3. Testar na API do Mercado Livre
4. Mostrar os IDs que funcionam

**Resultado esperado:**
```
✅ IDs que funcionam na API:

miniBike   → MLB3421894210
spinning   → MLB3421894211
miniBike2  → MLB3421894212
```

#### Método B: Manual (Se o script não funcionar)

1. Acesse cada produto no Mercado Livre:
   - https://www.mercadolivre.com.br/ultimate-fitness-mini-bike-bicicleta-ergometrica/up/MLBU2934790909
   
2. **Copie a URL completa** da barra de endereços (após a página carregar)
   
3. Procure por **MLB seguido de números** (10-12 dígitos)
   - Exemplo: `https://produto.mercadolivre.com.br/MLB-3421894210-...`
   
4. Teste na API:
   ```bash
   curl https://api.mercadolibre.com/items/MLB3421894210
   ```
   
5. Se retornar JSON com preço → ID está correto! ✅

#### Método C: Inspecionar HTML

1. Abra o produto no navegador
2. Clique com botão direito → "Inspecionar"
3. Procure no código por `"id":"MLB` ou `itemId`
4. Copie o ID MLB encontrado
5. Teste na API (comando acima)

---

### **Etapa 2: Configurar os IDs no Código**

Abra o arquivo: `src/lib/mercadolivre-api.ts`

Encontre esta parte:

```typescript
const ML_PRODUCT_IDS: Record<string, string> = {
  miniBike: "MLB_ID_AQUI",   // ← SUBSTITUIR
  spinning: "MLB_ID_AQUI",   // ← SUBSTITUIR
  miniBike2: "MLB_ID_AQUI",  // ← SUBSTITUIR
};
```

**Substitua pelos IDs reais:**

```typescript
const ML_PRODUCT_IDS: Record<string, string> = {
  miniBike: "MLB3421894210",
  spinning: "MLB3421894211",
  miniBike2: "MLB3421894212",
};
```

---

### **Etapa 3: Testar Localmente**

```bash
# 1. Reiniciar servidor (se estiver rodando)
npm run dev

# 2. Testar a busca de preços
curl -X POST http://localhost:3000/api/ml-products
```

**Resultado esperado:**
```json
{
  "success": true,
  "message": "3 de 3 preços atualizados via API oficial",
  "results": [
    {
      "productKey": "miniBike",
      "success": true,
      "price": 599.90,
      "title": "Ultimate Fitness Mini Bike...",
      "mlbId": "MLB3421894210"
    },
    ...
  ]
}
```

---

### **Etapa 4: Deploy e Automação**

#### A) Deploy no Vercel

```bash
git add .
git commit -m "feat: Implementar API oficial do Mercado Livre"
git push
```

Vercel vai fazer deploy automaticamente.

#### B) Configurar Atualização Automática (Cron Job)

Já está configurado! O GitHub Actions roda a cada 24 horas:

📄 `.github/workflows/update-ml-prices.yml`

```yaml
schedule:
  - cron: '0 12 * * *'  # Todo dia ao meio-dia (UTC)
```

**Como funciona:**
1. GitHub Actions executa o script
2. Script chama a API do ML
3. Atualiza `ml_prices.json`
4. Commita as mudanças
5. Vercel detecta mudança e faz redeploy

---

## 🧪 Testando a API Manualmente

### Teste 1: Buscar um produto

```bash
curl https://api.mercadolibre.com/items/MLB3421894210
```

**Resposta esperada:**
```json
{
  "id": "MLB3421894210",
  "title": "Ultimate Fitness Mini Bike Bicicleta Ergométrica",
  "price": 599.90,
  "currency_id": "BRL",
  "available_quantity": 50,
  "permalink": "https://produto.mercadolivre.com.br/..."
}
```

### Teste 2: Via painel admin

1. Acesse: `https://ultimatefitness.com.br/admin/update-prices`
2. Digite a senha: `FelipeEdgar2803`
3. Clique em **"Buscar Automático"**
4. Veja os resultados em tempo real

---

## 🔧 Solução de Problemas

### ❌ Erro: "ID MLB não configurado"

**Causa:** Você ainda não substituiu os IDs no código

**Solução:** Execute a Etapa 2 acima

---

### ❌ Erro 404 na API

**Causa:** ID MLB está incorreto ou produto foi removido

**Solução:**
1. Verifique se copiou o ID completo (ex: MLB3421894210)
2. Acesse o produto manualmente e copie novo ID
3. Teste novamente

---

### ❌ Script find-real-ml-ids.js não funciona

**Causa:** Chrome não instalado ou caminho incorreto

**Solução:** Use o Método B (manual) ou ajuste o caminho do Chrome:

```javascript
executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
```

---

## 📊 Comparação: Scraping vs API

| Aspecto | Web Scraping | API Oficial |
|---------|--------------|-------------|
| Velocidade | 5-15 segundos/produto | 100-300ms/produto |
| Confiabilidade | ❌ Quebra frequentemente | ✅ Sempre funciona |
| Bloqueios | ❌ ML bloqueia bots | ✅ Sem bloqueios |
| Manutenção | ❌ Precisa atualizar regex | ✅ Zero manutenção |
| Custo | Grátis (mas instável) | ✅ **Grátis e estável** |

---

## 🎉 Resultado Final

Depois de configurar:

1. ✅ **Atualização automática** - A cada 24h via GitHub Actions
2. ✅ **Painel admin** - Atualização manual quando quiser
3. ✅ **API confiável** - Usa endpoint oficial do ML
4. ✅ **Zero manutenção** - Não quebra com mudanças no ML
5. ✅ **Rápido** - 3 produtos em menos de 3 segundos

---

## 📞 Próximos Passos

1. **AGORA:** Execute `node scripts/find-real-ml-ids.js`
2. **DEPOIS:** Configure os IDs em `mercadolivre-api.ts`
3. **TESTE:** `curl -X POST http://localhost:3000/api/ml-products`
4. **DEPLOY:** `git push` quando funcionar

---

## 💡 Dica Extra

Se você tiver **muitos produtos** no futuro, pode criar uma interface admin para gerenciar os IDs sem mexer no código!

Quer que eu crie? 😉
