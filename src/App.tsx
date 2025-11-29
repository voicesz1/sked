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
  const [currentPath, setCurrentPath] = useState('/empresa/1');
  const navigate = (path: string) => {
    window.scrollTo(0, 0);
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
    if (currentPath === '/empresa/1/agendar') return <BookingPage navigate={navigate} store={store} />;
    return <PublicHomePage navigate={navigate} store={store} />;
  };
  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 ${
      store.empresa.tipo === 'barbearia' ? 'theme-barber' : 'theme-salon'
    }`}>
      <style>{`
        .theme-barber {
          --background: #0b0b0c; /* preto profundo */
          --foreground: #ffffff; /* texto branco legível */
          --card: #141416; /* cartas preto grafite */
          --input: #1c1c20; /* inputs mais claros para contraste */
          --primary: #c9a227; /* dourado */
          --primary-fg: #ffffff; /* texto branco nos botões */
          --secondary: #1b1b1f; /* superfícies secundárias */
          --secondary-fg: #ffffff;
          --muted: #1b1b1f;
          --muted-fg: #d1d1d6; /* texto secundário claro */
          --border: #3a3a40; /* borda visível no tema escuro */
          --bg-gradient: radial-gradient(1200px 600px at 10% -10%, #c9a22726, transparent 60%), radial-gradient(800px 400px at 90% 110%, #c9a2271f, transparent 60%);
        }
        .theme-salon {
          --background: #fdf2f8;
          --foreground: #2b0a33;
          --card: #ffffff;
          --input: #fce7f3;
          --primary: #db2777;
          --primary-fg: #ffffff;
          --secondary: #fbcfe8;
          --secondary-fg: #4a044e;
          --muted: #fce7f3;
          --muted-fg: #5b0f33;
          --border: #e5a4cb;
          --bg-gradient: radial-gradient(1200px 600px at 0% -10%, #db277720, transparent 60%), radial-gradient(800px 400px at 100% 110%, #db277715, transparent 60%);
        }
        body { background-color: var(--background); color: var(--foreground); background-image: var(--bg-gradient); background-attachment: fixed; }
      `}</style>
      {renderRoute()}
    </div>
  );
};

export default function App() {
  const store = useAppStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <Router store={store} />;
}
