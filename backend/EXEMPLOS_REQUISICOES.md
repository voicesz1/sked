# 📋 Exemplos de Requisições - Thunder Client / Postman

Este arquivo contém exemplos prontos para importar no Thunder Client (VS Code) ou Postman.

## 🔐 Autenticação

### 1. Cadastrar Empresa

```http
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "nome": "Barbearia Moderna",
  "email": "barbearia@example.com",
  "senha": "123456",
  "endereco": "Rua das Flores, 123 - São Paulo, SP",
  "telefone": "(11) 99999-9999"
}
```

### 2. Login

```http
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "barbearia@example.com",
  "senha": "123456"
}
```

**Resposta esperada:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "empresa": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "nome": "Barbearia Moderna",
    "email": "barbearia@example.com",
    "linkUnico": "550e8400-e29b-41d4-a716-446655440001"
  }
}
```

**⚠️ IMPORTANTE:** Copie o `access_token` para usar nas próximas requisições autenticadas.

---

## 🏢 Empresas (Autenticado)

### Listar Todas as Empresas

```http
GET http://localhost:3000/empresas
Authorization: Bearer {COLE_O_TOKEN_AQUI}
```

### Buscar Empresa por ID

```http
GET http://localhost:3000/empresas/{id}
Authorization: Bearer {COLE_O_TOKEN_AQUI}
```

### Atualizar Empresa

```http
PATCH http://localhost:3000/empresas/{id}
Authorization: Bearer {COLE_O_TOKEN_AQUI}
Content-Type: application/json

{
  "nome": "Barbearia Moderna Atualizada",
  "telefone": "(11) 98888-8888"
}
```

---

## 💇 Serviços (Autenticado)

### Criar Serviço

```http
POST http://localhost:3000/servicos
Authorization: Bearer {COLE_O_TOKEN_AQUI}
Content-Type: application/json

{
  "nome": "Corte Degradê",
  "descricao": "Corte moderno com degradê perfeito",
  "preco": 45.0,
  "duracao": 30,
  "categoria": "Cabelo",
  "foto": "https://example.com/foto.jpg"
}
```

### Listar Serviços da Empresa

```http
GET http://localhost:3000/servicos
Authorization: Bearer {COLE_O_TOKEN_AQUI}
```

### Buscar Serviço por ID

```http
GET http://localhost:3000/servicos/{id}
Authorization: Bearer {COLE_O_TOKEN_AQUI}
```

### Atualizar Serviço

```http
PATCH http://localhost:3000/servicos/{id}
Authorization: Bearer {COLE_O_TOKEN_AQUI}
Content-Type: application/json

{
  "preco": 50.0,
  "descricao": "Corte atualizado com novas técnicas"
}
```

### Excluir Serviço

```http
DELETE http://localhost:3000/servicos/{id}
Authorization: Bearer {COLE_O_TOKEN_AQUI}
```

---

## 👨‍💼 Funcionários (Autenticado)

### Criar Funcionário

```http
POST http://localhost:3000/funcionarios
Authorization: Bearer {COLE_O_TOKEN_AQUI}
Content-Type: application/json

{
  "nome": "João Silva",
  "especialidade": "Barbeiro Master",
  "telefone": "(11) 99999-9999",
  "email": "joao@example.com",
  "bio": "Experiente barbeiro com 10 anos de experiência",
  "foto": "https://example.com/foto-joao.jpg"
}
```

### Listar Funcionários da Empresa

```http
GET http://localhost:3000/funcionarios
Authorization: Bearer {COLE_O_TOKEN_AQUI}
```

### Buscar Funcionário por ID

```http
GET http://localhost:3000/funcionarios/{id}
Authorization: Bearer {COLE_O_TOKEN_AQUI}
```

### Atualizar Funcionário

```http
PATCH http://localhost:3000/funcionarios/{id}
Authorization: Bearer {COLE_O_TOKEN_AQUI}
Content-Type: application/json

{
  "especialidade": "Barbeiro Master e Colorista",
  "bio": "Atualizado: 12 anos de experiência"
}
```

### Excluir Funcionário

```http
DELETE http://localhost:3000/funcionarios/{id}
Authorization: Bearer {COLE_O_TOKEN_AQUI}
```

---

## 📅 Agendamentos (Autenticado)

### Criar Agendamento

```http
POST http://localhost:3000/agendamentos
Authorization: Bearer {COLE_O_TOKEN_AQUI}
Content-Type: application/json

{
  "servicoId": "550e8400-e29b-41d4-a716-446655440010",
  "funcionarioId": "550e8400-e29b-41d4-a716-446655440011",
  "clienteNome": "Roberto Silva",
  "clienteEmail": "roberto@example.com",
  "clienteTelefone": "(11) 98888-8888",
  "dataHora": "2024-01-20T14:00:00Z",
  "observacoes": "Cliente prefere corte mais curto"
}
```

### Listar Agendamentos

```http
GET http://localhost:3000/agendamentos
Authorization: Bearer {COLE_O_TOKEN_AQUI}
```

### Listar Agendamentos do Dia

```http
GET http://localhost:3000/agendamentos?data=2024-01-20
Authorization: Bearer {COLE_O_TOKEN_AQUI}
```

### Buscar Agendamento por ID

```http
GET http://localhost:3000/agendamentos/{id}
Authorization: Bearer {COLE_O_TOKEN_AQUI}
```

### Atualizar Status do Agendamento

```http
PATCH http://localhost:3000/agendamentos/{id}
Authorization: Bearer {COLE_O_TOKEN_AQUI}
Content-Type: application/json

{
  "status": "confirmado"
}
```

**Status possíveis:** `pendente`, `confirmado`, `cancelado`, `concluido`

### Verificar Disponibilidade

```http
GET http://localhost:3000/agendamentos/disponibilidade/{funcionarioId}?data=2024-01-20
Authorization: Bearer {COLE_O_TOKEN_AQUI}
```

### Excluir Agendamento

```http
DELETE http://localhost:3000/agendamentos/{id}
Authorization: Bearer {COLE_O_TOKEN_AQUI}
```

---

## ⏰ Horários de Funcionamento (Autenticado)

### Buscar Horários

```http
GET http://localhost:3000/horarios
Authorization: Bearer {COLE_O_TOKEN_AQUI}
```

### Atualizar Horários

```http
PATCH http://localhost:3000/horarios
Authorization: Bearer {COLE_O_TOKEN_AQUI}
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

**Formato:** `HH:mm-HH:mm` ou `null` para fechado

---

## 🌐 Rotas Públicas (Sem Autenticação)

### Buscar Empresa por Link Único

```http
GET http://localhost:3000/public/empresa/{linkUnico}
```

**Exemplo com dados do seed:**
```http
GET http://localhost:3000/public/empresa/smart-agenda-barbearia
```

### Listar Serviços da Empresa (Público)

```http
GET http://localhost:3000/public/empresa/{linkUnico}/servicos
```

### Listar Funcionários da Empresa (Público)

```http
GET http://localhost:3000/public/empresa/{linkUnico}/funcionarios
```

### Verificar Disponibilidade (Público)

```http
GET http://localhost:3000/public/empresa/{linkUnico}/disponibilidade?funcionarioId={uuid}&data=2024-01-20
```

### Criar Agendamento (Público - Cliente)

```http
POST http://localhost:3000/public/empresa/{linkUnico}/agendamento
Content-Type: application/json

{
  "servicoId": "550e8400-e29b-41d4-a716-446655440010",
  "funcionarioId": "550e8400-e29b-41d4-a716-446655440011",
  "clienteNome": "Maria Santos",
  "clienteEmail": "maria@example.com",
  "clienteTelefone": "(11) 97777-7777",
  "dataHora": "2024-01-20T15:00:00Z",
  "observacoes": "Primeira vez no salão"
}
```

---

## 📝 Notas Importantes

1. **Token JWT:** Após fazer login, copie o `access_token` e use no header `Authorization: Bearer {token}`

2. **UUIDs:** Substitua `{id}`, `{linkUnico}`, `{funcionarioId}`, etc. pelos valores reais retornados nas requisições anteriores.

3. **Datas:** Use formato ISO 8601: `YYYY-MM-DDTHH:mm:ssZ` (ex: `2024-01-20T14:00:00Z`)

4. **Horários:** Formato `HH:mm-HH:mm` (ex: `09:00-18:00`) ou `null` para fechado

5. **Status de Agendamento:** `pendente`, `confirmado`, `cancelado`, `concluido`

6. **Erros Comuns:**
   - `401 Unauthorized`: Token inválido ou expirado
   - `404 Not Found`: Recurso não encontrado
   - `409 Conflict`: Agendamento duplicado no mesmo horário
   - `400 Bad Request`: Dados inválidos

---

## 🧪 Teste Completo - Fluxo de Uso

### Passo 1: Cadastrar Empresa
```http
POST http://localhost:3000/auth/register
```

### Passo 2: Login
```http
POST http://localhost:3000/auth/login
```
**Copie o token!**

### Passo 3: Criar Serviço
```http
POST http://localhost:3000/servicos
Authorization: Bearer {token}
```

### Passo 4: Criar Funcionário
```http
POST http://localhost:3000/funcionarios
Authorization: Bearer {token}
```

### Passo 5: Configurar Horários
```http
PATCH http://localhost:3000/horarios
Authorization: Bearer {token}
```

### Passo 6: Criar Agendamento (Público)
```http
POST http://localhost:3000/public/empresa/{linkUnico}/agendamento
```

### Passo 7: Listar Agendamentos do Dia
```http
GET http://localhost:3000/agendamentos?data=2024-01-20
Authorization: Bearer {token}
```

### Passo 8: Confirmar Agendamento
```http
PATCH http://localhost:3000/agendamentos/{id}
Authorization: Bearer {token}
{
  "status": "confirmado"
}
```

---

**Pronto! Agora você pode testar toda a API! 🚀**

