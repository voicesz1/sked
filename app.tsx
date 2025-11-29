// src/App.tsx
import React, { useState, useEffect } from 'react';
import { useAppStore } from './src/hooks/useAppStore';
import { PublicHomePage } from './src/pages/PublicHomePage';
import { BookingPage } from './src/pages/BookingPage';
import { LoginPage, RegisterPage } from './src/pages/LoginPage';
import { AdminLayout } from './src/pages/admin/AdminLayout';

interface RouterProps {
    store: ReturnType<typeof useAppStore>;
}

const Router: React.FC<RouterProps> = ({ store }) => {
  const [currentPath, setCurrentPath] = useState('/empresa/1');
  
  const navigate = (path: string) => {
    window.scrollTo(0, 0);
    setCurrentPath(path);
  };

  // Helper para renderizar rotas
  const renderRoute = () => {
    if (currentPath === '/login') return <LoginPage navigate={navigate} store={store} />;
    if (currentPath === '/registro') return <RegisterPage navigate={navigate} store={store} />;
    
    // Rotas Admin
    if (currentPath.startsWith('/admin')) {
      if (!store.currentUser) {
        // Redirecionamento simples simulado
        setTimeout(() => navigate('/login'), 100); 
        return <div className="p-10 text-center">Redirecionando para Login...</div>;
      }
      return <AdminLayout navigate={navigate} currentPath={currentPath} store={store} />;
    }

    // Rotas Públicas
    if (currentPath === '/empresa/1/agendar') return <BookingPage navigate={navigate} store={store} />;
    
    // Default Home
    return <PublicHomePage navigate={navigate} store={store} />;
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500
      ${store.empresa.tipo === 'barbearia' ? 'theme-barber' : 'theme-salon'}
    `}>
      {/* Definição de Variáveis CSS Dinâmicas para o Tema */}
      <style>{`
        .theme-barber {
          --background: #09090b;
          --foreground: #fafafa;
          --card: #18181b;
          --input: #27272a;
          --primary: #7c3aed; /* Violeta */
          --primary-fg: #ffffff;
          --secondary: #27272a;
          --secondary-fg: #fafafa;
          --muted: #27272a;
          --muted-fg: #a1a1aa;
          --border: #3f3f46;
        }
        .theme-salon {
          --background: #fdf2f8; /* Rosa bem claro */
          --foreground: #4a044e;
          --card: #ffffff;
          --input: #fce7f3;
          --primary: #db2777; /* Pink */
          --primary-fg: #ffffff;
          --secondary: #fbcfe8;
          --secondary-fg: #831843;
          --muted: #fce7f3;
          --muted-fg: #9d174d;
          --border: #fbcfe8;
        }
        body {
          background-color: var(--background);
          color: var(--foreground);
        }
      `}</style>
      
      {renderRoute()}
    </div>
  );
};

// --- MAIN ENTRY POINT ---

export default function App() {
  const store = useAppStore();
  
  // Solução para hydration no React
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return <Router store={store} />;
}