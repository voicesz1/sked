# 📱 Guia: Como Testar no Android Studio

## Pré-requisitos

1. **Android Studio** instalado (versão mais recente recomendada)
2. **Java JDK** instalado (versão 11 ou superior)
3. **Android SDK** configurado no Android Studio
4. **Emulador Android** configurado OU dispositivo físico conectado

---

## 🚀 Passo a Passo

### 1. Build do Projeto Web

Primeiro, você precisa fazer o build do projeto React/Vite:

```bash
npm run build
```

Isso gera os arquivos na pasta `dist/` que serão usados pelo app Android.

---

### 2. Sincronizar com Capacitor

Sincronize os arquivos web com o projeto Android:

```bash
npm run mobile:sync
```

Este comando:
- Faz o build do projeto (`vite build`)
- Sincroniza os arquivos com o projeto Android (`npx cap sync android`)
- Copia os arquivos da pasta `dist/` para `android/app/src/main/assets/`

---

### 3. Abrir no Android Studio

Abra o projeto Android no Android Studio:

```bash
npm run mobile:open
```

Ou manualmente:
1. Abra o **Android Studio**
2. Clique em **File > Open**
3. Navegue até a pasta `android/` do seu projeto
4. Selecione a pasta `android/` e clique em **OK**

---

### 4. Configurar o Projeto (Primeira Vez)

Se for a primeira vez abrindo o projeto:

1. **Aguarde o Gradle sincronizar** (pode demorar alguns minutos)
2. Se aparecer algum erro, clique em **Sync Project with Gradle Files** (ícone de elefante)
3. Configure o **SDK** se necessário:
   - **File > Project Structure > SDK Location**
   - Verifique se o Android SDK está configurado

---

### 5. Configurar Emulador ou Dispositivo

#### Opção A: Emulador Android

1. No Android Studio, clique em **Tools > Device Manager**
2. Clique em **Create Device**
3. Escolha um dispositivo (ex: Pixel 5)
4. Escolha uma imagem do sistema (recomendado: API 33 ou superior)
5. Clique em **Finish**

#### Opção B: Dispositivo Físico

1. Conecte seu dispositivo Android via USB
2. Ative **Modo Desenvolvedor** no dispositivo:
   - Vá em **Configurações > Sobre o telefone**
   - Toque 7 vezes em **Número da versão**
3. Ative **Depuração USB**:
   - **Configurações > Opções do desenvolvedor > Depuração USB**
4. No Android Studio, seu dispositivo aparecerá na lista de dispositivos

---

### 6. Executar o App

1. No Android Studio, selecione o dispositivo/emulador no dropdown superior
2. Clique no botão **Run** (▶️) ou pressione `Shift + F10`
3. Aguarde o app compilar e instalar
4. O app será aberto automaticamente no dispositivo/emulador

---

## 🔄 Workflow de Desenvolvimento

### Quando fizer mudanças no código:

1. **Edite os arquivos** em `src/`
2. **Faça o build e sincronize**:
   ```bash
   npm run mobile:sync
   ```
3. **No Android Studio**, clique em **Run** novamente (ou use o botão de atualizar)

### Para ver mudanças em tempo real (Hot Reload):

Infelizmente, o Capacitor não tem hot reload nativo. Você precisa:

1. Fazer as alterações
2. Rodar `npm run mobile:sync`
3. No Android Studio, clique em **Run** novamente

**Dica:** Para desenvolvimento mais rápido, teste primeiro no navegador com `npm run dev`, depois sincronize quando estiver satisfeito.

---

## 🛠️ Comandos Úteis

```bash
# Build do projeto web
npm run build

# Sincronizar com Android
npm run mobile:sync

# Abrir Android Studio
npm run mobile:open

# Desenvolvimento web (para testar antes)
npm run dev
```

---

## ⚠️ Problemas Comuns

### 1. Erro de Gradle Sync

**Solução:**
- Verifique se o Android SDK está instalado
- **File > Invalidate Caches / Restart**
- Tente sincronizar novamente

### 2. App não abre ou dá erro

**Solução:**
- Verifique se rodou `npm run mobile:sync` após mudanças
- Limpe o build: **Build > Clean Project**
- Rebuild: **Build > Rebuild Project**

### 3. Mudanças não aparecem

**Solução:**
- Certifique-se de rodar `npm run mobile:sync` após cada mudança
- Limpe o cache do app no dispositivo
- Reinstale o app

### 4. Erro de permissões

**Solução:**
- Verifique o `AndroidManifest.xml` em `android/app/src/main/`
- Adicione permissões necessárias se precisar

---

## 📝 Dicas Importantes

1. **Sempre sincronize após mudanças**: `npm run mobile:sync`
2. **Teste no navegador primeiro**: Use `npm run dev` para desenvolvimento rápido
3. **Mantenha o Android Studio atualizado**
4. **Use um emulador rápido**: Recomendado API 33+ com x86_64
5. **Para produção**: Use `npm run build` e depois `npm run mobile:sync`

---

## 🎯 Checklist Rápido

- [ ] Build feito: `npm run build`
- [ ] Sincronizado: `npm run mobile:sync`
- [ ] Android Studio aberto
- [ ] Dispositivo/Emulador selecionado
- [ ] App executado com sucesso

---

## 📚 Recursos Adicionais

- [Documentação Capacitor](https://capacitorjs.com/docs)
- [Documentação Android Studio](https://developer.android.com/studio)

