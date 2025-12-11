# ⚡ Quick Start - Início Rápido

## 🚀 Setup em 5 minutos

### 1. Instalar dependências
```bash
cd backend
npm install
```

### 2. Configurar variáveis de ambiente
Copie `.env.example` para `.env` e ajuste se necessário:
```bash
# Windows
copy .env.example .env

# Linux/Mac
cp .env.example .env
```

### 3. Iniciar PostgreSQL
```bash
docker-compose up -d
```

### 4. Configurar banco de dados
```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

### 5. Iniciar servidor
```bash
npm run start:dev
```

### 6. Acessar documentação
Abra no navegador:
```
http://localhost:3000/api/docs
```

## 🧪 Testar Login

### Dados de teste (criados pelo seed):
- **Email:** `barbearia@example.com`
- **Senha:** `123456`

### Requisição de teste:
```bash
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "barbearia@example.com",
  "senha": "123456"
}
```

## 📱 Links Úteis

- **Swagger:** http://localhost:3000/api/docs
- **Prisma Studio:** Execute `npm run prisma:studio` e acesse http://localhost:5555

## 🆘 Problemas Comuns

### Erro: "Cannot connect to database"
```bash
# Verificar se PostgreSQL está rodando
docker ps

# Se não estiver, iniciar
docker-compose up -d
```

### Erro: "Prisma Client not generated"
```bash
npm run prisma:generate
```

### Porta 3000 já em uso
Altere `PORT` no arquivo `.env` para outra porta (ex: 3001)

## 📚 Próximos Passos

1. Explore a documentação Swagger: http://localhost:3000/api/docs
2. Veja exemplos em: `EXEMPLOS_REQUISICOES.md`
3. Leia documentação completa: `README.md`
4. Integre com Android: `INTEGRACAO_ANDROID.md`

---

**Pronto! Seu backend está rodando! 🎉**

