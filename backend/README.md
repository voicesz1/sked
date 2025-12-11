# 🚀 Backend API - Sistema de Agendamento

Backend completo desenvolvido com **NestJS**, **TypeScript**, **Prisma** e **PostgreSQL** para sistema de agendamento de barbearias e salões.

## 📋 Índice

- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Executando o Projeto](#executando-o-projeto)
- [Documentação da API](#documentação-da-api)
- [Endpoints](#endpoints)
- [Exemplos de Requisições](#exemplos-de-requisições)
- [Banco de Dados](#banco-de-dados)

## 🛠 Tecnologias

- **NestJS** - Framework Node.js progressivo
- **TypeScript** - Superset JavaScript com tipagem estática
- **Prisma** - ORM moderno e type-safe
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação baseada em tokens
- **Swagger** - Documentação interativa da API
- **class-validator** - Validação de dados
- **Helmet** - Segurança HTTP
- **express-rate-limit** - Proteção contra rate limiting

## 📁 Estrutura do Projeto

```
backend/
├── src/
│   ├── auth/              # Módulo de autenticação
│   ├── empresas/          # CRUD de empresas
│   ├── servicos/          # CRUD de serviços
│   ├── funcionarios/      # CRUD de funcionários
│   ├── agendamentos/     # CRUD de agendamentos
│   ├── horarios/          # Horários de funcionamento
│   ├── public/            # Rotas públicas (sem autenticação)
│   ├── prisma/            # Serviço Prisma
│   ├── common/            # Guards, decorators, filters
│   ├── app.module.ts      # Módulo principal
│   └── main.ts            # Arquivo de entrada
├── prisma/
│   ├── schema.prisma      # Schema do banco de dados
│   └── seed.ts            # Seed do banco de dados
├── docker-compose.yml     # Configuração Docker
├── package.json
└── README.md
```

## 🔧 Instalação

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- PostgreSQL 15+ (ou Docker)

### Passo a passo

1. **Clone o repositório e entre na pasta backend:**

```bash
cd backend
```

2. **Instale as dependências:**

```bash
npm install
```

3. **Configure as variáveis de ambiente:**

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/agendamento_db?schema=public"
JWT_SECRET="seu-secret-super-seguro-aqui"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV=development
CORS_ORIGIN="http://localhost:5173,http://localhost:3000"
```

## 🐳 Configuração com Docker

### Opção 1: Apenas PostgreSQL (Recomendado)

```bash
# Iniciar PostgreSQL
docker-compose up -d

# Verificar se está rodando
docker ps
```

### Opção 2: PostgreSQL + Backend (Futuro)

O docker-compose atual inclui apenas PostgreSQL. Você pode adicionar o backend depois.

## 🚀 Executando o Projeto

### 1. Iniciar PostgreSQL

Se estiver usando Docker:

```bash
docker-compose up -d
```

Ou configure um PostgreSQL local.

### 2. Configurar o Banco de Dados

```bash
# Gerar cliente Prisma
npm run prisma:generate

# Executar migrações
npm run prisma:migrate

# Popular banco com dados de exemplo (opcional)
npm run prisma:seed
```

### 3. Iniciar o Servidor

**Desenvolvimento:**
```bash
npm run start:dev
```

**Produção:**
```bash
npm run build
npm run start:prod
```

O servidor estará rodando em `http://localhost:3000`

## 📚 Documentação da API

Acesse a documentação Swagger interativa em:

```
http://localhost:3000/api/docs
```

## 🔌 Endpoints

### Autenticação

- `POST /auth/register` - Cadastrar nova empresa
- `POST /auth/login` - Login e obter token JWT

### Empresas (Autenticado)

- `GET /empresas` - Listar todas as empresas
- `GET /empresas/:id` - Buscar empresa por ID
- `PATCH /empresas/:id` - Atualizar empresa
- `DELETE /empresas/:id` - Excluir empresa

### Serviços (Autenticado)

- `POST /servicos` - Criar serviço
- `GET /servicos` - Listar serviços da empresa
- `GET /servicos/:id` - Buscar serviço por ID
- `PATCH /servicos/:id` - Atualizar serviço
- `DELETE /servicos/:id` - Excluir serviço

### Funcionários (Autenticado)

- `POST /funcionarios` - Criar funcionário
- `GET /funcionarios` - Listar funcionários da empresa
- `GET /funcionarios/:id` - Buscar funcionário por ID
- `PATCH /funcionarios/:id` - Atualizar funcionário
- `DELETE /funcionarios/:id` - Excluir funcionário

### Agendamentos (Autenticado)

- `POST /agendamentos` - Criar agendamento
- `GET /agendamentos` - Listar agendamentos (opcional: ?data=YYYY-MM-DD)
- `GET /agendamentos/:id` - Buscar agendamento por ID
- `PATCH /agendamentos/:id` - Atualizar status do agendamento
- `DELETE /agendamentos/:id` - Excluir agendamento
- `GET /agendamentos/disponibilidade/:funcionarioId?data=YYYY-MM-DD` - Verificar disponibilidade

### Horários de Funcionamento (Autenticado)

- `GET /horarios` - Buscar horários da empresa
- `PATCH /horarios` - Atualizar horários

### Rotas Públicas (Sem Autenticação)

- `GET /public/empresa/:linkUnico` - Buscar empresa por link único
- `GET /public/empresa/:linkUnico/servicos` - Listar serviços da empresa
- `GET /public/empresa/:linkUnico/funcionarios` - Listar funcionários da empresa
- `GET /public/empresa/:linkUnico/disponibilidade?funcionarioId=xxx&data=YYYY-MM-DD` - Verificar disponibilidade
- `POST /public/empresa/:linkUnico/agendamento` - Criar agendamento (cliente)

## 📝 Exemplos de Requisições

### 1. Cadastrar Empresa

```bash
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "nome": "Barbearia do João",
  "email": "barbearia@example.com",
  "senha": "123456",
  "endereco": "Rua Augusta, 123",
  "telefone": "(11) 99999-9999"
}
```

### 2. Login

```bash
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "barbearia@example.com",
  "senha": "123456"
}
```

**Resposta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "empresa": {
    "id": "uuid",
    "nome": "Barbearia do João",
    "email": "barbearia@example.com",
    "linkUnico": "uuid"
  }
}
```

### 3. Criar Serviço (Autenticado)

```bash
POST http://localhost:3000/servicos
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "Corte Degradê",
  "descricao": "Corte moderno com degradê",
  "preco": 45.0,
  "duracao": 30,
  "categoria": "Cabelo"
}
```

### 4. Criar Funcionário (Autenticado)

```bash
POST http://localhost:3000/funcionarios
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "João Silva",
  "especialidade": "Barbeiro Master",
  "telefone": "(11) 99999-9999",
  "email": "joao@example.com"
}
```

### 5. Criar Agendamento (Público)

```bash
POST http://localhost:3000/public/empresa/{linkUnico}/agendamento
Content-Type: application/json

{
  "servicoId": "uuid-do-servico",
  "funcionarioId": "uuid-do-funcionario",
  "clienteNome": "Roberto Silva",
  "clienteEmail": "roberto@example.com",
  "clienteTelefone": "(11) 98888-8888",
  "dataHora": "2024-01-20T14:00:00Z"
}
```

### 6. Listar Agendamentos do Dia (Autenticado)

```bash
GET http://localhost:3000/agendamentos?data=2024-01-20
Authorization: Bearer {token}
```

### 7. Atualizar Status do Agendamento

```bash
PATCH http://localhost:3000/agendamentos/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "confirmado"
}
```

### 8. Configurar Horários de Funcionamento

```bash
PATCH http://localhost:3000/horarios
Authorization: Bearer {token}
Content-Type: application/json

{
  "segunda": "09:00-18:00",
  "terca": "09:00-18:00",
  "quarta": "09:00-18:00",
  "quinta": "09:00-18:00",
  "sexta": "09:00-18:00",
  "sabado": "09:00-17:00",
  "domingo": null
}
```

### 9. Verificar Disponibilidade (Público)

```bash
GET http://localhost:3000/public/empresa/{linkUnico}/disponibilidade?funcionarioId={uuid}&data=2024-01-20
```

## 🗄 Banco de Dados

### Schema Principal

- **empresas** - Dados das empresas
- **servicos** - Serviços oferecidos
- **funcionarios** - Funcionários da empresa
- **agendamentos** - Agendamentos realizados
- **horarios_funcionamento** - Horários de funcionamento

### Seed do Banco

O seed cria empresas de exemplo:

- **Email:** `barbearia@example.com` | **Senha:** `123456`
- **Email:** `salao@example.com` | **Senha:** `123456`

Execute: `npm run prisma:seed`

### Prisma Studio

Visualize e edite dados diretamente:

```bash
npm run prisma:studio
```

Acesse: `http://localhost:5555`

## 🔒 Segurança

- ✅ Autenticação JWT
- ✅ Hash de senhas com bcrypt
- ✅ Rate limiting
- ✅ Helmet para headers de segurança
- ✅ CORS configurável
- ✅ Validação de dados com class-validator
- ✅ Guards para proteção de rotas
- ✅ Tratamento centralizado de erros

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Cobertura
npm run test:cov
```

## 📦 Deploy

### Variáveis de Ambiente para Produção

```env
NODE_ENV=production
DATABASE_URL="postgresql://user:password@host:5432/db"
JWT_SECRET="secret-super-seguro-producao"
CORS_ORIGIN="https://seu-dominio.com"
```

### Build para Produção

```bash
npm run build
npm run start:prod
```

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 🆘 Suporte

Para dúvidas ou problemas, abra uma issue no repositório.

---

Desenvolvido com ❤️ usando NestJS

