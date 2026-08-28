# ⚡ Ultimate Fitness - Site Oficial

Site oficial da Ultimate Fitness com atualização automática de preços do Mercado Livre.

## 🚀 Características

- ⚡ **Next.js 16** com App Router
- 🎨 **Tailwind CSS 4** para estilização
- 🔄 **Atualização automática de preços** do Mercado Livre (24h)
- 📱 **Totalmente responsivo**
- 🎭 **Animações** com Framer Motion
- 📊 **Google Analytics & Google Ads** integrados
- 🔒 **SEO otimizado** com metadata dinâmica

## 📦 Produtos

O site exibe 3 produtos principais:
- **Mini Bike Bicicleta Ergométrica**
- **Bicicleta Ergométrica Spinning**
- **Mini Bike Bicicleta Ergométrica Pro**

### 🔄 Atualização Automática de Preços

Os preços são atualizados automaticamente **1x ao dia** (às 3h UTC) através de:
- ✅ **Vercel Cron Jobs** - Scraping automático diário
- ✅ **GitHub Actions** - Backup alternativo

Ver documentação completa: [`MERCADO_LIVRE_API.md`](./MERCADO_LIVRE_API.md)

## 🛠️ Instalação

```bash
# Clonar repositório
git clone https://github.com/seu-usuario/ultimate-fitness.git
cd ultimate-fitness

# Instalar dependências
npm install

# Copiar variáveis de ambiente
cp .env.example .env.local

# Editar .env.local e adicionar:
# CRON_SECRET=seu-token-secreto-aqui

# Iniciar servidor de desenvolvimento
npm run dev
```

Acesse: http://localhost:3000

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento

# Build & Produção
npm run build           # Cria build de produção
npm run start           # Inicia servidor de produção

# Qualidade de Código
npm run lint            # Executa ESLint
npm run format          # Formata código com Prettier

# Mercado Livre (Testes)
npm run ml:prices       # Ver preços atuais do JSON
npm run ml:check        # Verificar API local (requer dev rodando)
npm run ml:update       # Forçar atualização local (requer dev rodando)

# Teste de Scraping
node scripts/test-ml-scraping.js    # Testar scraping standalone
```

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env.local` baseado no `.env.example`:

```env
# Token para autenticar cron jobs (obrigatório em produção)
CRON_SECRET=seu-token-secreto-aqui
```

**Gerar token seguro:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Configurar na Vercel

1. **Fazer deploy:**
   ```bash
   vercel --prod
   ```

2. **Adicionar variável de ambiente:**
   - Acesse: https://vercel.com/seu-projeto/settings/environment-variables
   - Adicione: `CRON_SECRET` com o token gerado
   - Aplique para: Production e Preview

3. **Verificar cron ativo:**
   - Acesse: https://vercel.com/seu-projeto/settings/crons
   - Status: **Active**
   - Schedule: `0 3 * * *` (diariamente às 3h UTC)

## 🧪 Testes

### Testar scraping localmente:
```bash
node scripts/test-ml-scraping.js
```

### Testar API em produção:
```bash
# Ver preços atuais
curl https://ultimatefitness.com.br/api/ml-products

# Forçar atualização (requer CRON_SECRET)
curl -H "Authorization: Bearer SEU-TOKEN" \
  https://ultimatefitness.com.br/api/cron/update-ml
```

Ver guia completo: [`GUIA_TESTE_RÁPIDO.md`](./GUIA_TESTE_RÁPIDO.md)

## 📁 Estrutura do Projeto

```
ultimate-fitness/
├── src/
│   ├── app/                    # App Router do Next.js
│   │   ├── api/
│   │   │   ├── ml-products/   # API pública de produtos
│   │   │   └── cron/
│   │   │       └── update-ml/ # Cron de atualização
│   │   ├── page.tsx           # Homepage
│   │   └── layout.tsx         # Layout principal
│   ├── components/            # Componentes React
│   ├── lib/
│   │   └── mercadolivre.ts   # Funções de scraping
│   ├── data/
│   │   └── ml_prices.json    # Preços atualizados
│   └── assets/               # Imagens e recursos
├── scripts/
│   ├── update-prices.js      # Script de atualização (backup)
│   └── test-ml-scraping.js   # Script de teste
├── .github/
│   └── workflows/
│       └── update-ml-prices.yml  # GitHub Actions
├── vercel.json               # Configuração do Vercel Cron
└── package.json
```

## 🔧 API Endpoints

### `GET /api/ml-products`

Retorna dados atualizados de todos os produtos.

**Resposta:**
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
    }
  },
  "lastUpdated": "2026-08-28T03:00:00.000Z"
}
```

### `GET /api/cron/update-ml`

Executa atualização manual de preços (requer autenticação).

**Headers:**
```
Authorization: Bearer SEU-CRON-SECRET
```

**Resposta:**
```json
{
  "success": true,
  "message": "Preços atualizados com sucesso",
  "updatedCount": 3,
  "lastUpdated": "2026-08-28T14:30:00.000Z"
}
```

## 📚 Documentação

- 📖 **[MERCADO_LIVRE_API.md](./MERCADO_LIVRE_API.md)** - Documentação completa da API
- 🧪 **[GUIA_TESTE_RÁPIDO.md](./GUIA_TESTE_RÁPIDO.md)** - Guia de testes
- 🔧 **[CORREÇÃO_PREÇOS_AUTOMÁTICOS.md](./CORREÇÃO_PREÇOS_AUTOMÁTICOS.md)** - Histórico de correções
- 📝 **[SETUP_COMPLETO.md](./SETUP_COMPLETO.md)** - Setup inicial

## 🐛 Troubleshooting

### Preços não estão atualizando?

1. **Verificar última atualização:**
   ```bash
   curl https://ultimatefitness.com.br/api/ml-products | grep lastUpdated
   ```

2. **Verificar logs na Vercel:**
   - Acesse: https://vercel.com/seu-projeto/logs
   - Filtre por: `/api/cron/update-ml`

3. **Forçar atualização manual:**
   ```bash
   curl -H "Authorization: Bearer $CRON_SECRET" \
     https://ultimatefitness.com.br/api/cron/update-ml
   ```

4. **Verificar cron ativo:**
   - Acesse: https://vercel.com/seu-projeto/settings/crons
   - Status deve ser: **Active**

### Outros problemas?

Consulte: [`GUIA_TESTE_RÁPIDO.md`](./GUIA_TESTE_RÁPIDO.md) - Seção "Problemas Comuns"

## 🚀 Deploy

### Deploy automático (GitHub):

```bash
git add .
git commit -m "feat: adicionar nova funcionalidade"
git push
```

O Vercel faz deploy automaticamente.

### Deploy manual:

```bash
vercel --prod
```

## 📊 Monitoramento

### Verificar status dos crons:
- Dashboard: https://vercel.com/seu-projeto/settings/crons
- Logs: https://vercel.com/seu-projeto/logs

### Alertas (opcional):
- Configurar Sentry para alertas de erros
- Webhook para notificações de falhas

## 🔒 Segurança

- ✅ Autenticação de cron jobs com `CRON_SECRET`
- ✅ Rate limiting implícito (1x ao dia)
- ✅ User-Agent adequado para scraping
- ✅ Validação de dados extraídos
- ✅ Fallback para dados antigos em caso de erro

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: adicionar MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é privado e de propriedade da Ultimate Fitness.

## 🆘 Suporte

Para dúvidas ou problemas:
- 📧 Email: contato@ultimatefitness.com.br
- 🌐 Site: https://ultimatefitness.com.br

---

**Desenvolvido com ⚡ por Ultimate Fitness**

**Última atualização:** 28 de agosto de 2026
