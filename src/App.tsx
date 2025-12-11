import React, { useState, useEffect } from 'react';
import useAppStore from './hooks/useAppStore';
import PublicHomePage from './pages/PublicHomePage';
import BookingPage from './pages/BookingPage';
import LoginPage, { RegisterPage } from './pages/LoginPage';
import { AdminLayout } from './pages/admin/AdminLayout';

interface RouterProps {
    store: ReturnType<typeof useAppStore>;
}

const Router: React.FC<RouterProps> = ({ store }) => {
  const [currentPath, setCurrentPath] = useState(
    typeof window !== 'undefined' ? window.location.pathname || '/' : '/'
  );
  const navigate = (path: string) => {
    window.scrollTo(0, 0);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(path);
  };
  const renderRoute = () => {
    if (currentPath === '/login') return <LoginPage navigate={navigate} store={store} />;
    if (currentPath === '/registro') return <RegisterPage navigate={navigate} store={store} />;
    if (currentPath.startsWith('/admin')) {
      if (!store.currentUser) {
        setTimeout(() => navigate('/login'), 100);
        return <div className="p-10 text-center">Redirecionando para Login...</div>;
      }
      return <AdminLayout navigate={navigate} currentPath={currentPath} store={store} />;
    }
    if (currentPath.includes('/agendar')) return <BookingPage navigate={navigate} store={store} />;
    return <PublicHomePage navigate={navigate} store={store} />;
  };
  return (
    <div className={`min-h-screen font-sans transition-colors duration-500`}>
      {renderRoute()}
    </div>
  );
};

export default function App() {
  const store = useAppStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const params = new URL(window.location.href).searchParams;
      const slug = params.get('empresa');
      if (slug) {
        store.setEmpresa((prev: any) => ({ ...prev, linkUnico: slug }));
      }
      window.addEventListener('popstate', () => {
        setTimeout(() => {
          const p = window.location.pathname || '/';
          setCurrentPath(p);
        }, 0);
      });
    }
  }, []);
  if (!mounted) return null;
  return <Router store={store} />;
}
