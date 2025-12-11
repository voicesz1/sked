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
    <div className={`min-h-screen font-sans transition-colors duration-500`}>
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
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--background)' }}>
        <img src={encodeURI('/logo sked.png')} alt="Sked" style={{ width: 128, height: 128, borderRadius: 24 }} />
      </div>
    );
  }

  return <Router store={store} />;
}
