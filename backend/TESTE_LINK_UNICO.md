# 🔗 Guia de Teste - Link Único

## ✅ Status: **FUNCIONANDO!**

O link único já está implementado e funcionando. Cada empresa recebe automaticamente um UUID único que pode ser usado para acessar as informações públicas.

## 🧪 Como Testar

### Passo 1: Obter o Link Único de uma Empresa

#### Opção A: Via Login (Recomendado)

1. **Faça login com uma empresa:**
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
  "access_token": "eyJhbGci...",
  "empresa": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "nome": "Smart Agenda Barbearia",
    "email": "barbearia@example.com",
    "linkUnico": "smart-agenda-barbearia"  ← ESTE É O LINK ÚNICO!
  }
}
```

#### Opção B: Via Seed (Dados de Exemplo)

Se você executou o seed, os links únicos já estão definidos:

- **Empresa 1:** `smart-agenda-barbearia`
- **Empresa 2:** `belle-epoque-salao`

#### Opção C: Via Prisma Studio

```bash
npm run prisma:studio
```

Acesse: http://localhost:5555 e veja a tabela `empresas`. A coluna `linkUnico` contém o link único.

---

### Passo 2: Testar as Rotas Públicas

Agora você pode testar todas as rotas públicas usando o link único:

#### 1. Buscar Informações da Empresa

```bash
GET http://localhost:3000/public/empresa/smart-agenda-barbearia
```

**Resposta esperada:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "nome": "Smart Agenda Barbearia",
  "endereco": "Rua Augusta, 123 - São Paulo, SP",
  "telefone": "(11) 99999-9999",
  "logo": "🪓",
  "linkUnico": "smart-agenda-barbearia"
}
```

#### 2. Listar Serviços da Empresa

```bash
GET http://localhost:3000/public/empresa/smart-agenda-barbearia/servicos
```

**Resposta esperada:**
```json
[
  {
    "id": "uuid-do-servico-1",
    "nome": "Corte Degradê",
    "descricao": "Corte moderno com degradê",
    "preco": 45.0,
    "duracao": 30,
    "categoria": "Cabelo",
    "ativo": true
  },
  {
    "id": "uuid-do-servico-2",
    "nome": "Barba Terapia",
    "descricao": "Tratamento completo para barba",
    "preco": 35.0,
    "duracao": 30,
    "categoria": "Barba",
    "ativo": true
  }
]
```

#### 3. Listar Funcionários da Empresa

```bash
GET http://localhost:3000/public/empresa/smart-agenda-barbearia/funcionarios
```

**Resposta esperada:**
```json
[
  {
    "id": "uuid-do-funcionario-1",
    "nome": "João \"Navalha\"",
    "especialidade": "Barbeiro Master",
    "foto": "🧔🏻‍♂️",
    "ativo": true
  },
  {
    "id": "uuid-do-funcionario-2",
    "nome": "Carlos Silva",
    "especialidade": "Especialista em Cortes",
    "foto": "👨🏼",
    "ativo": true
  }
]
```

#### 4. Verificar Disponibilidade de Horários

**Primeiro, obtenha o ID de um funcionário** (da resposta anterior), depois:

```bash
GET http://localhost:3000/public/empresa/smart-agenda-barbearia/disponibilidade?funcionarioId={UUID_DO_FUNCIONARIO}&data=2024-01-20
```

**Exemplo completo:**
```bash
GET http://localhost:3000/public/empresa/smart-agenda-barbearia/disponibilidade?funcionarioId=550e8400-e29b-41d4-a716-446655440011&data=2024-01-20
```

#### 5. Criar Agendamento (Cliente)

```bash
POST http://localhost:3000/public/empresa/smart-agenda-barbearia/agendamento
Content-Type: application/json

{
  "servicoId": "550e8400-e29b-41d4-a716-446655440010",
  "funcionarioId": "550e8400-e29b-41d4-a716-446655440011",
  "clienteNome": "Roberto Silva",
  "clienteEmail": "roberto@example.com",
  "clienteTelefone": "(11) 98888-8888",
  "dataHora": "2024-01-20T14:00:00Z",
  "observacoes": "Primeira vez na barbearia"
}
```

---

## 🌐 Testando no Navegador

Você pode testar diretamente no navegador (apenas GET):

1. **Informações da Empresa:**
   ```
   http://localhost:3000/public/empresa/smart-agenda-barbearia
   ```

2. **Serviços:**
   ```
   http://localhost:3000/public/empresa/smart-agenda-barbearia/servicos
   ```

3. **Funcionários:**
   ```
   http://localhost:3000/public/empresa/smart-agenda-barbearia/funcionarios
   ```

---

## 📱 Como Usar no Aplicativo

### Exemplo de URL Completa:

```
http://seu-dominio.com/empresa/smart-agenda-barbearia
```

Ou no desenvolvimento local:
```
http://localhost:3000/public/empresa/smart-agenda-barbearia
```

### Fluxo Completo no App:

1. **Cliente acessa:** `/empresa/{linkUnico}`
2. **App busca informações:**
   - `GET /public/empresa/{linkUnico}` → Dados da empresa
   - `GET /public/empresa/{linkUnico}/servicos` → Lista de serviços
   - `GET /public/empresa/{linkUnico}/funcionarios` → Lista de funcionários
3. **Cliente escolhe serviço e funcionário**
4. **Cliente verifica disponibilidade:**
   - `GET /public/empresa/{linkUnico}/disponibilidade?funcionarioId=xxx&data=2024-01-20`
5. **Cliente cria agendamento:**
   - `POST /public/empresa/{linkUnico}/agendamento`

---

## 🧪 Teste Completo - Passo a Passo

### 1. Iniciar o servidor (se ainda não iniciou)
```bash
cd backend
npm run start:dev
```

### 2. Verificar se o seed foi executado
```bash
npm run prisma:seed
```

### 3. Fazer login para obter o link único
```bash
POST http://localhost:3000/auth/login
{
  "email": "barbearia@example.com",
  "senha": "123456"
}
```

### 4. Copiar o `linkUnico` da resposta

### 5. Testar todas as rotas públicas com o link único

**No Thunder Client ou Postman:**

1. ✅ `GET /public/empresa/{linkUnico}`
2. ✅ `GET /public/empresa/{linkUnico}/servicos`
3. ✅ `GET /public/empresa/{linkUnico}/funcionarios`
4. ✅ `GET /public/empresa/{linkUnico}/disponibilidade?funcionarioId=xxx&data=2024-01-20`
5. ✅ `POST /public/empresa/{linkUnico}/agendamento`

---

## 🔍 Verificar Link Único no Banco

### Via Prisma Studio:
```bash
npm run prisma:studio
```

### Via SQL (se preferir):
```sql
SELECT id, nome, "linkUnico" FROM empresas;
```

---

## ⚠️ Observações Importantes

1. **Link Único é Gerado Automaticamente:**
   - Quando uma empresa é criada, o Prisma gera automaticamente um UUID
   - No seed, usamos links amigáveis como `smart-agenda-barbearia`
   - Em produção, você pode personalizar o link único

2. **Links Únicos são Únicos:**
   - Cada empresa tem um link único diferente
   - Não pode haver duplicatas (constraint no banco)

3. **Rotas Públicas Não Precisam de Autenticação:**
   - Qualquer pessoa pode acessar usando o link único
   - Perfeito para clientes acessarem sem login

4. **Segurança:**
   - Apenas dados públicos são expostos
   - Informações sensíveis (senha, etc.) não são retornadas

---

## ✅ Checklist de Teste

- [ ] Fazer login e obter link único
- [ ] Testar `GET /public/empresa/{linkUnico}`
- [ ] Testar `GET /public/empresa/{linkUnico}/servicos`
- [ ] Testar `GET /public/empresa/{linkUnico}/funcionarios`
- [ ] Testar `GET /public/empresa/{linkUnico}/disponibilidade`
- [ ] Testar `POST /public/empresa/{linkUnico}/agendamento`
- [ ] Verificar no navegador (rotas GET)
- [ ] Testar com link único inválido (deve retornar 404)

---

## 🎯 Exemplo Prático Completo

```bash
# 1. Login
POST http://localhost:3000/auth/login
{
  "email": "barbearia@example.com",
  "senha": "123456"
}

# Resposta contém: "linkUnico": "smart-agenda-barbearia"

# 2. Buscar empresa (SEM AUTENTICAÇÃO)
GET http://localhost:3000/public/empresa/smart-agenda-barbearia

# 3. Listar serviços (SEM AUTENTICAÇÃO)
GET http://localhost:3000/public/empresa/smart-agenda-barbearia/servicos

# 4. Listar funcionários (SEM AUTENTICAÇÃO)
GET http://localhost:3000/public/empresa/smart-agenda-barbearia/funcionarios

# 5. Criar agendamento (SEM AUTENTICAÇÃO)
POST http://localhost:3000/public/empresa/smart-agenda-barbearia/agendamento
{
  "servicoId": "...",
  "funcionarioId": "...",
  "clienteNome": "João Cliente",
  "dataHora": "2024-01-20T14:00:00Z"
}
```

---

**Pronto! O link único está funcionando perfeitamente! 🎉**

Qualquer dúvida, consulte a documentação Swagger: `http://localhost:3000/api/docs`

