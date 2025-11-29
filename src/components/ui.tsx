// src/components/ui.tsx
import React from 'react';
import { motion, AnimatePresence, type MotionProps } from 'framer-motion';
import { X } from 'lucide-react';

// --- BUTTON ---
type MotionButtonProps = React.ComponentPropsWithoutRef<typeof motion.button>;
interface ButtonProps extends MotionButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants: any = {
    primary: "bg-gradient-to-r from-[var(--primary)] to-[var(--primary)]/80 text-[var(--primary-fg)] hover:opacity-90 shadow-md",
    secondary: "bg-[var(--secondary)] text-[var(--secondary-fg)] hover:bg-opacity-80",
    outline: "border-2 border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)]",
    ghost: "text-[var(--foreground)] hover:bg-[var(--muted)]",
    destructive: "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <motion.button 
      whileTap={{ scale: 0.98 }}
      className={`${baseStyle} ${variants[variant]} ${className}`} 
      {...props}
    >
      {children}
    </motion.button>
  );
};

// --- CARD ---
interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow ${className}`}>
    {children}
  </div>
);

// --- INPUT ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export const Input: React.FC<InputProps> = ({ label, ...props }) => (
  <div className="flex flex-col gap-1.5 mb-4">
    {label && <label className="text-sm font-medium text-[var(--muted-fg)]">{label}</label>}
    <input 
      className="w-full px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--input)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
      {...props} 
    />
  </div>
);

// --- MODAL ---
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" onClick={onClose} 
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
        >
          <div className="bg-[var(--card)] w-full max-w-md p-6 rounded-xl shadow-2xl pointer-events-auto border border-[var(--border)]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[var(--foreground)]">{title}</h3>
              <button onClick={onClose} className="text-[var(--muted-fg)] hover:text-[var(--foreground)]"><X size={20} /></button>
            </div>
            {children}
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

