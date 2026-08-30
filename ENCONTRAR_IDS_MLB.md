# 🔍 Como Encontrar os IDs MLB dos Seus Produtos

## ⚠️ Situação Atual

O Mercado Livre bloqueou o script automatizado com captcha. Você precisa encontrar os IDs **manualmente** (leva 5 minutos).

---

## 📋 Método Manual (GARANTIDO)

### Passo a Passo para CADA produto:

#### 1. Acesse o Painel do Vendedor

👉 https://www.mercadolivre.com.br/vendas/lista

**Login:** Sua conta de vendedor do ML

---

#### 2. Encontre cada produto

Procure pelos seus produtos:
- Ultimate Fitness Mini Bike Bicicleta Ergométrica
- Ultimate Fitness Bicicleta Ergométrica Spinning

---

#### 3. Clique no produto

Você vai ver a página de detalhes do anúncio.

---

#### 4. Copie o ID MLB

Na URL da página, você vai ver algo assim:

```
https://www.mercadolivre.com.br/anuncios/MLB1234567890/editar
                                      ^^^^^^^^^^^^^^^^
                                      ESTE É O ID!
```

**OU** procure por "Código do anúncio" na página (geralmente aparece no topo).

---

#### 5. Teste o ID na API

Abra o PowerShell e teste:

```powershell
curl.exe https://api.mercadolibre.com/items/MLB1234567890
```

**Se retornar JSON com `"price":`** → ID está correto! ✅

**Se retornar erro 404** → ID incorreto, tente outro ❌

---

## 🎯 Alternativa: Usar Links Públicos dos Produtos

Se você não consegue acessar o painel de vendedor:

### 1. Acesse o link público do produto

Exemplo: https://www.mercadolivre.com.br/ultimate-fitness-mini-bike-bicicleta-ergometrica/up/MLBU2934790909

### 2. Inspecione a página

- Clique com botão direito → **"Inspecionar"** (F12)
- Procure por: `"id":"MLB`

Exemplo do que você vai encontrar:

```html
<script>
  window.__PRELOADED_STATE__ = {
    "id": "MLB1234567890",
    "title": "Ultimate Fitness Mini Bike...",
    "price": 599.90
  }
</script>
```

### 3. Copie o ID MLB

Copie **apenas** os números após `MLB` (exemplo: `MLB1234567890`)

### 4. Teste na API

```powershell
curl.exe https://api.mercadolibre.com/items/MLB1234567890
```

---

## ✅ Depois de Encontrar os IDs

### Atualize o código:

**Arquivo:** `src/lib/mercadolivre-api.ts`

**Linha 25-30:**

```typescript
const ML_PRODUCT_IDS: Record<string, string> = {
  miniBike: "MLB1234567890",   // ← Cole o ID aqui
  spinning: "MLB0987654321",   // ← Cole o ID aqui
  miniBike2: "MLB5555555555",  // ← Cole o ID aqui
};
```

---

## 🧪 Teste Final

```powershell
# 1. Reiniciar servidor
npm run dev

# 2. Testar busca
curl.exe -X POST http://localhost:3000/api/ml-products
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
      "price": 599.90
    }
  ]
}
```

---

## 💡 Dica Pro

Se você vender no Mercado Livre, provavelmente recebe **e-mails** quando alguém pergunta algo ou compra.

**Nesses e-mails tem o ID MLB do produto!**

Procure na sua caixa de entrada por "Mercado Livre" + "Mini Bike" e você vai encontrar o ID.

---

## 📞 Me Envie os IDs

Quando encontrar os IDs, me manda assim:

```
Mini Bike 1: MLB1234567890
Spinning: MLB0987654321
Mini Bike 2: MLB5555555555
```

Eu atualizo o código pra você! 👍
