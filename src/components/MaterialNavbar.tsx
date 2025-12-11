// src/components/MaterialNavbar.tsx
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
  label: string;
  path: string;
  onClick?: () => void;
}

interface MaterialNavbarProps {
  logo?: string | React.ReactNode; // Logo circular (emoji, imagem ou componente)
  title: string; // Título grande ao lado do logo
  navItems?: NavItem[]; // Links de navegação
  onSearchClick?: () => void; // Callback para busca
  navigate?: (path: string) => void; // Função de navegação
  isMobile?: boolean; // Se está em mobile
  className?: string; // Classes adicionais
  position?: 'top' | 'bottom'; // Posição fixa da navbar
}

export const MaterialNavbar: React.FC<MaterialNavbarProps> = ({
  logo = '✂️',
  title = 'AGENDAMENTO',
  navItems = [],
  onSearchClick,
  navigate,
  isMobile = false,
  className = '',
  position = 'top'
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detecta scroll para adicionar sombra
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (item: NavItem) => {
    if (item.onClick) {
      item.onClick();
    } else if (navigate && item.path) {
      navigate(item.path);
    }
    setMobileMenuOpen(false);
  };

  const navbarHeight = isMobile ? '64px' : '72px';
  const safeAreaTop = 'env(safe-area-inset-top)';
  const safeAreaBottom = 'env(safe-area-inset-bottom)';
  const isBottom = position === 'bottom';

  const positionClass = position === 'bottom' ? 'fixed bottom-0 left-0 right-0' : 'fixed top-0 left-0 right-0';
  const spacer = (
      <div
        className="w-full flex-shrink-0"
        style={
          isBottom
            ? { height: `calc(${navbarHeight} + max(${safeAreaBottom}, 0px))` }
            : { height: `calc(${navbarHeight} + max(${safeAreaTop}, 0px))` }
        }
      />
  );

  return (
    <>
      {/* Navbar Fixa */}
      <nav
        className={`${isBottom ? 'fixed bottom-0 left-0 right-0' : 'fixed top-0 left-0 right-0'} z-50 bg-[var(--surface)]/90 text-[var(--foreground)] backdrop-blur-sm transition-shadow duration-300 ${
          scrolled ? 'shadow-lg' : 'shadow-md'
        } ${className}`}
        style={
          isBottom
            ? {
                paddingBottom: `max(${safeAreaBottom}, 0px)`,
                height: `calc(${navbarHeight} + max(${safeAreaBottom}, 0px))`
              }
            : {
                paddingTop: `max(${safeAreaTop}, 0px)`,
                height: `calc(${navbarHeight} + max(${safeAreaTop}, 0px))`
              }
        }
      >
        <div className="container mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
          {/* Logo + Título */}
          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0 min-w-0">
            {/* Logo Circular */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[var(--muted)] flex items-center justify-center flex-shrink-0 backdrop-blur-sm border border-[var(--border)]">
              {typeof logo === 'string' ? (
                <span className="text-xl sm:text-2xl">{logo}</span>
              ) : (
                logo
              )}
            </div>
            
            {title && (
              <h1 className={`font-bold tracking-tight truncate ${
                isMobile ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'
              }`}>
                {title}
              </h1>
            )}
          </div>

          {/* Desktop: Navegação */}
          <div className="hidden md:flex items-center gap-6 flex-1 justify-center">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavClick(item)}
                className="px-4 py-2 text-sm font-medium text-[var(--muted-fg)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] rounded-xl transition-all duration-200 active:scale-95"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile: Menu Hambúrguer */}
          <div className="md:hidden flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[var(--muted)] transition-all duration-200 active:scale-95"
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <X size={24} className="text-[var(--foreground)]" />
              ) : (
                <Menu size={24} className="text-[var(--foreground)]" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile: Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-[var(--background)]/80 z-40 md:hidden"
              style={
                isBottom
                  ? { bottom: `calc(${navbarHeight} + max(${safeAreaBottom}, 0px))` }
                  : { top: `calc(${navbarHeight} + max(${safeAreaTop}, 0px))` }
              }
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-64 bg-[var(--background)] z-50 shadow-2xl md:hidden overflow-y-auto"
              style={
                isBottom
                  ? {
                      paddingTop: 'max(env(safe-area-inset-top), 0px)',
                      paddingBottom: `calc(${navbarHeight} + max(${safeAreaBottom}, 0px))`
                    }
                  : {
                      paddingTop: `calc(${navbarHeight} + max(${safeAreaTop}, 0px))`,
                      paddingBottom: 'max(env(safe-area-inset-bottom), 0px)'
                    }
              }
            >
              <div className="px-4 py-6 space-y-2">
                {navItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleNavClick(item)}
                    className="w-full text-left px-4 py-3 text-[var(--muted-fg)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] rounded-lg transition-all duration-200 active:scale-95 font-medium"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {spacer}
    </>
  );
};

export default MaterialNavbar;
