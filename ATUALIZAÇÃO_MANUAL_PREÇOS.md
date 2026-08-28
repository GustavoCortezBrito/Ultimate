# 📝 Guia de Atualização Manual de Preços

## ⚠️ Situação Atual

O Mercado Livre possui **proteção anti-bot muito forte** que impede scraping automático:
- ❌ Scraping HTML: Página de verificação de tráfego suspeito
- ❌ API Pública: IDs "MLBU..." não são reconhecidos (são Product Promotions, não produtos)
- ❌ Workarounds: Requerem serviços pagos (proxies, CAPTCHA solvers, etc.)

## ✅ Solução Implementada: Atualização Manual Simples

Os preços são armazenados em `src/data/ml_prices.json` e podem ser atualizados facilmente.

---

## 🚀 Como Atualizar os Preços (3 Opções)

### Opção 1: Edição Direta do Arquivo JSON (Mais Rápida)

1. Abra o arquivo: `src/data/ml_prices.json`

2. Acesse cada produto no Mercado Livre:
   - [Mini Bike](https://www.mercadolivre.com.br/ultimate-fitness-mini-bike-bicicleta-ergometrica/up/MLBU2934790909)
   - [Spinning](https://www.mercadolivre.com.br/ultimate-fitness-bicicleta-ergometrica-spinning/up/MLBU3325822548)
   - [Mini Bike Pro](https://www.mercadolivre.com.br/ultimate-fitness-mini-bike-bicicleta-ergometrica/up/MLBU2954483127)

3. Anote os preços atuais de cada um

4. Edite o JSON:
   ```json
   {
     "lastUpdated": "2026-08-28T17:00:00.000Z",  ← Atualizar para data/hora atual
     "products": {
       "miniBike": {
         "price": 139.90,  ← Atualizar
         "originalPrice": 154.90,  ← Atualizar se houver
         "ratingAverage": 4.8,  ← Atualizar se mudou
         "reviewsTotal": 2061,  ← Atualizar se mudou
         ...
       }
     }
   }
   ```

5. Salvar e fazer commit:
   ```bash
   git add src/data/ml_prices.json
   git commit -m "chore: atualizar preços do Mercado Livre manualmente"
   git push
   ```

6. Aguardar deploy automático (Vercel) ou forçar:
   ```bash
   vercel --prod
   ```

---

### Opção 2: Script Auxiliar (Interativo)

Criei um script que facilita a atualização:

```bash
node scripts/update-prices-manual.js
```

**O script vai:**
1. Mostrar preços atuais
2. Pedir novos preços para cada produto
3. Atualizar o arquivo JSON automaticamente
4. Atualizar `lastUpdated`

---

### Opção 3: Via Interface Web (Futuro)

Podemos criar uma página admin protegida por senha onde você:
- Vê preços atuais
- Atualiza com formulário
- Salva direto no arquivo

---

## ⏰ Frequência Recomendada

**Atualizar preços:**
- **Semanalmente**: Se preços mudam pouco
- **2x por semana**: Se há promoções frequentes
- **Diariamente**: Durante campanhas especiais

**Como lembrar:**
- ⏰ Alarme no celular
- 📅 Evento recorrente no calendário
- 📧 Lembrete por email (via Google Calendar, etc.)

---

## 🤖 Automação Futura (Opções)

Se quiser automatizar no futuro, opções:

### 1. Scraping Service Pago

**Serviços que funcionam:**
- [ScraperAPI](https://www.scraperapi.com/) - $49/mês
- [Bright Data](https://brightdata.com/) - $500+/mês
- [Oxylabs](https://oxylabs.io/) - Preço sob consulta

**Prós:** Funcionam com ML, lidam com anti-bot  
**Contras:** Custo mensal, complexidade

### 2. Browser Automation (Playwright/Puppeteer)

**Como funcionar:**
- Rodar em servidor próprio (não Vercel)
- Usar proxies residenciais
- Resolver CAPTCHAs automaticamente
- Rotacionar User-Agents

**Prós:** Mais controle  
**Contras:** Complexo, caro (servidor + proxies)

### 3. Parceria com Mercado Livre

**Solicitar acesso à API oficial:**
- Cadastro como desenvolvedor
- Solicitar permissões de leitura de produtos
- Usar OAuth para autenticação

**Prós:** Oficial, confiável  
**Contras:** Processo burocrático, pode ser negado

### 4. Webhook do Mercado Livre

Se você é o vendedor desses produtos:
- Configurar webhook para receber notificações de mudança de preço
- Atualizar automaticamente quando ML notificar

**Prós:** Tempo real, oficial  
**Contras:** Só funciona se você é o vendedor

---

## 📊 Monitoramento

### Ver quando foi última atualização:

```bash
# Via API
curl https://ultimatefitness.com.br/api/ml-products | jq '.lastUpdated'

# Via arquivo local
cat src/data/ml_prices.json | grep lastUpdated

# Via npm script
npm run ml:prices
```

### Comparar preços:

Visite manualmente:
1. [Seu site](https://ultimatefitness.com.br)
2. [Mercado Livre - Mini Bike](https://www.mercadolivre.com.br/ultimate-fitness-mini-bike-bicicleta-ergometrica/up/MLBU2934790909)
3. Compare os valores

---

## 🛠️ Script Helper de Atualização

Vou criar um script interativo para facilitar:

```bash
node scripts/update-prices-manual.js
```

**Fluxo:**
```
🔄 ATUALIZAÇÃO MANUAL DE PREÇOS - MERCADO LIVRE
================================================

Preços atuais:
  miniBike:   R$ 139.90
  spinning:   R$ 749.00
  miniBike2:  R$ 198.90

Última atualização: 27/07/2026 (32 dias atrás) ⚠️

Deseja atualizar? (s/n): s

--- Mini Bike ---
Preço atual no arquivo: R$ 139.90
Novo preço (ou Enter para manter): 145.90
Preço original (ou Enter para pular): 160.00

--- Spinning ---
Preço atual no arquivo: R$ 749.00
Novo preço (ou Enter para manter): 
(mantido)

--- Mini Bike Pro ---
Preço atual no arquivo: R$ 198.90
Novo preço (ou Enter para manter): 189.90
Preço original (ou Enter para pular): 

✅ Arquivo atualizado!
📝 Próximos passos:
  1. git add src/data/ml_prices.json
  2. git commit -m "chore: atualizar preços ML"
  3. git push
```

---

## 📋 Checklist de Atualização

- [ ] Acessar produto 1 no Mercado Livre
- [ ] Anotar preço atual e original
- [ ] Acessar produto 2 no Mercado Livre
- [ ] Anotar preço atual e original
- [ ] Acessar produto 3 no Mercado Livre
- [ ] Anotar preço atual e original
- [ ] Abrir `src/data/ml_prices.json`
- [ ] Atualizar preços de todos os produtos
- [ ] Atualizar campo `lastUpdated` para data/hora atual
- [ ] Salvar arquivo
- [ ] Commit e push
- [ ] Verificar deploy na Vercel
- [ ] Conferir preços no site

---

## 🎯 Workflow Recomendado

**Toda Segunda e Quinta (15 minutos):**

1. **Verificar preços no ML** (5 min)
   - Abrir 3 abas com os produtos
   - Anotar preços em papel ou bloco de notas

2. **Atualizar arquivo** (3 min)
   - Abrir `ml_prices.json`
   - Atualizar valores
   - Atualizar `lastUpdated`

3. **Deploy** (2 min)
   ```bash
   git add src/data/ml_prices.json
   git commit -m "chore: atualizar preços ML $(date +%d/%m/%Y)"
   git push
   ```

4. **Conferir** (5 min)
   - Aguardar deploy (~2 min)
   - Abrir site
   - Verificar se preços estão corretos

**Total: 15 minutos, 2x por semana**

---

## 💡 Dica: Configurar Lembrete

### Google Calendar:
1. Criar evento recorrente: "Atualizar preços ML"
2. Segunda e Quinta, 10h
3. Adicionar link deste guia nas notas

### Todoist/Any.do:
```
Tarefa: Atualizar preços Mercado Livre
Recorrência: Toda segunda e quinta
Link: [Guia de Atualização](./ATUALIZAÇÃO_MANUAL_PREÇOS.md)
```

---

## 🆘 Problemas?

### Preço não aparece atualizado no site

1. **Limpar cache do navegador** (Ctrl+Shift+R)
2. **Verificar se deploy terminou** (Vercel dashboard)
3. **Conferir arquivo no GitHub** (se commit foi enviado)

### Formato JSON inválido

Use um validador:
- https://jsonlint.com/
- VS Code (mostra erros automaticamente)

### Esqueci de atualizar `lastUpdated`

Não é crítico, mas:
- Usuários veem data antiga
- Dificulta saber quando foi última atualização

---

**Próxima atualização recomendada:** Segunda, 10h 🗓️

**Tempo estimado:** 15 minutos ⏱️
