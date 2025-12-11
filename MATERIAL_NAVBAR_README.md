# Material Design Navbar - Guia de Uso

## 📋 Visão Geral

A `MaterialNavbar` é um componente de barra de navegação superior estilo Material Design (Top App Bar) implementado com React + TailwindCSS. Ela oferece uma experiência moderna e responsiva, com suporte completo para mobile e desktop.

## ✨ Características

- ✅ **Estilo Material Design**: Background escuro (#1E1E1E) com texto branco
- ✅ **Logo Circular**: Suporta emoji, imagem ou componente React
- ✅ **Título Grande**: Título em maiúsculas ao lado do logo
- ✅ **Navegação Horizontal**: Links de navegação bem distribuídos (desktop)
- ✅ **Menu Hambúrguer**: Menu lateral no mobile
- ✅ **Ícone de Busca**: Botão de busca à direita
- ✅ **Barra Fixa**: Position fixed no topo, não sobrepõe conteúdo
- ✅ **Responsivo**: Adapta-se automaticamente para mobile e desktop
- ✅ **Safe Area**: Respeita safe areas do iOS/Android
- ✅ **Animações**: Transições suaves com Framer Motion

## 📦 Instalação

O componente já está criado em `src/components/MaterialNavbar.tsx` e importado nas páginas principais.

## 🚀 Como Usar

### Exemplo Básico

```tsx
import { MaterialNavbar } from '../components/MaterialNavbar';

<MaterialNavbar
  logo="✂️"
  title="MINHA APLICAÇÃO"
  navItems={[
    { label: 'Início', path: '/', onClick: () => navigate('/') },
    { label: 'Sobre', path: '/sobre', onClick: () => navigate('/sobre') },
    { label: 'Contato', path: '/contato', onClick: () => navigate('/contato') },
  ]}
  navigate={navigate}
  isMobile={isMobile}
  onSearchClick={() => console.log('Busca clicada')}
/>
```

### Exemplo com Logo Personalizado

```tsx
<MaterialNavbar
  logo={
    <img 
      src="/logo.png" 
      alt="Logo" 
      className="w-full h-full object-cover rounded-full"
    />
  }
  title="MINHA EMPRESA"
  navItems={navItems}
  navigate={navigate}
/>
```

## 📝 Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `logo` | `string \| React.ReactNode` | `'✂️'` | Logo circular (emoji, string ou componente) |
| `title` | `string` | `'AGENDAMENTO'` | Título em maiúsculas ao lado do logo |
| `navItems` | `NavItem[]` | `[]` | Array de itens de navegação |
| `onSearchClick` | `() => void` | `undefined` | Callback quando o botão de busca é clicado |
| `navigate` | `(path: string) => void` | `undefined` | Função de navegação (opcional) |
| `isMobile` | `boolean` | `false` | Se está em modo mobile |
| `className` | `string` | `''` | Classes CSS adicionais |

### Interface NavItem

```typescript
interface NavItem {
  label: string;      // Texto do link
  path: string;       // Caminho/URL
  onClick?: () => void; // Função opcional (tem prioridade sobre navigate)
}
```

## 🎨 Customização

### Alterar Cor de Fundo

No arquivo `src/components/MaterialNavbar.tsx`, linha 52:

```tsx
className={`... bg-[#1E1E1E] ...`}  // Altere para a cor desejada
```

### Alterar Altura

No arquivo `src/components/MaterialNavbar.tsx`, linha 51:

```tsx
const navbarHeight = isMobile ? '64px' : '72px';  // Ajuste conforme necessário
```

### Alterar Tamanho do Logo

No arquivo `src/components/MaterialNavbar.tsx`, linha 60:

```tsx
<div className="w-10 h-10 sm:w-12 sm:h-12 ...">  // Ajuste os tamanhos
```

## 📱 Comportamento Responsivo

### Desktop (md e acima)
- Navegação horizontal com todos os links visíveis
- Ícone de busca à direita
- Altura: 72px

### Mobile (abaixo de md)
- Menu hambúrguer à direita
- Ícone de busca ao lado do menu
- Drawer lateral ao abrir o menu
- Altura: 64px
- Título reduzido

## 🔧 Onde Está Implementado

### 1. Página Pública (`src/pages/PublicHomePage.tsx`)

```tsx
const navItems = [
  { label: 'Início', path: `/empresa/${empresa.id}`, onClick: () => navigate(`/empresa/${empresa.id}`) },
  { label: 'Serviços', path: '#servicos', onClick: () => { /* scroll suave */ }},
  { label: 'Equipe', path: '#equipe', onClick: () => { /* scroll suave */ }},
  { label: 'Agendar', path: `/empresa/${empresa.id}/agendar`, onClick: () => navigate(`/empresa/${empresa.id}/agendar`) },
  { label: 'Login', path: '/login', onClick: () => navigate('/login') },
];
```

### 2. Dashboard Admin (`src/pages/admin/AdminLayout.tsx`)

Apenas no mobile (desktop mantém a sidebar):

```tsx
<MaterialNavbar
  logo={store.empresa.logo}
  title={store.empresa.nome.toUpperCase()}
  navItems={menuItems.map(item => ({
    label: item.label,
    path: item.path,
    onClick: () => navigate(item.path)
  }))}
  navigate={navigate}
  isMobile={true}
/>
```

## 🎯 Funcionalidades

### Scroll Suave para Âncoras

```tsx
{ 
  label: 'Serviços', 
  path: '#servicos', 
  onClick: () => {
    const element = document.getElementById('servicos');
    element?.scrollIntoView({ behavior: 'smooth' });
  }
}
```

### Navegação Programática

```tsx
{ 
  label: 'Dashboard', 
  path: '/admin/dashboard', 
  onClick: () => navigate('/admin/dashboard') 
}
```

### Busca Personalizada

```tsx
onSearchClick={() => {
  // Abrir modal de busca
  // Ou navegar para página de busca
  // Ou executar função de busca
  console.log('Busca clicada');
}}
```

## 🐛 Solução de Problemas

### Conteúdo sendo sobreposto pela navbar

O componente já inclui um spacer automático. Se ainda houver sobreposição, verifique:
1. Se o spacer está sendo renderizado (deve aparecer após a navbar)
2. Se há CSS customizado interferindo

### Menu não abre no mobile

Verifique se `isMobile` está sendo passado corretamente como `true` no mobile.

### Links não funcionam

Certifique-se de passar a função `navigate` ou implementar `onClick` em cada `navItem`.

## 📚 Dependências

- `react`: ^18.3.1
- `framer-motion`: ^10.18.0
- `lucide-react`: ^0.470.0
- `tailwindcss`: ^3.4.15

## 🎨 Estilo Material Design

A navbar segue as diretrizes do Material Design:
- Elevação com sombra
- Transições suaves
- Feedback visual em interações
- Áreas de toque adequadas (mínimo 44px)
- Cores de contraste adequadas

## 📄 Licença

Este componente faz parte do projeto de agendamento de barbearia.



