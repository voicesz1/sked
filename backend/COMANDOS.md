# 🚀 Comandos Úteis - Backend

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Gerar cliente Prisma
npm run prisma:generate
```

## 🗄 Banco de Dados

```bash
# Criar migração
npm run prisma:migrate

# Aplicar migrações pendentes
npx prisma migrate deploy

# Popular banco com dados de exemplo
npm run prisma:seed

# Abrir Prisma Studio (interface visual)
npm run prisma:studio

# Resetar banco de dados (CUIDADO: apaga todos os dados)
npx prisma migrate reset
```

## 🏃 Executar

```bash
# Desenvolvimento (watch mode)
npm run start:dev

# Produção
npm run build
npm run start:prod

# Debug
npm run start:debug
```

## 🐳 Docker

```bash
# Iniciar PostgreSQL
docker-compose up -d

# Parar PostgreSQL
docker-compose down

# Ver logs
docker-compose logs -f

# Reiniciar PostgreSQL
docker-compose restart
```

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes em watch mode
npm run test:watch

# Cobertura de testes
npm run test:cov

# Testes e2e
npm run test:e2e
```

## 🔍 Linting e Formatação

```bash
# Verificar código
npm run lint

# Formatar código
npm run format
```

## 📚 Documentação

Acesse após iniciar o servidor:
```
http://localhost:3000/api/docs
```

## 🔧 Troubleshooting

### Erro: "Prisma Client not generated"
```bash
npm run prisma:generate
```

### Erro: "Cannot connect to database"
1. Verifique se PostgreSQL está rodando
2. Verifique a `DATABASE_URL` no `.env`
3. Teste conexão: `docker ps` (se usar Docker)

### Erro: "Port already in use"
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Resetar tudo do zero
```bash
# Parar containers
docker-compose down -v

# Resetar banco
npx prisma migrate reset

# Recriar banco
npm run prisma:migrate
npm run prisma:seed
```

## 📝 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do backend com:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/agendamento_db?schema=public"
JWT_SECRET="seu-secret-super-seguro-aqui"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV=development
CORS_ORIGIN="http://localhost:5173"
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
```

## 🎯 Fluxo Completo de Setup

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar PostgreSQL
docker-compose up -d

# 3. Configurar banco
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed

# 4. Iniciar servidor
npm run start:dev

# 5. Acessar documentação
# http://localhost:3000/api/docs
```

## 🔐 Dados de Teste (Seed)

Após executar `npm run prisma:seed`:

- **Empresa 1:**
  - Email: `barbearia@example.com`
  - Senha: `123456`
  - Link: `/public/empresa/smart-agenda-barbearia`

- **Empresa 2:**
  - Email: `salao@example.com`
  - Senha: `123456`
  - Link: `/public/empresa/belle-epoque-salao`

