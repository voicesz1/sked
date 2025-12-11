// src/components/ui.tsx
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, type MotionProps } from 'framer-motion';
import { X, Upload } from 'lucide-react';

// --- BUTTON ---
type MotionButtonProps = React.ComponentPropsWithoutRef<typeof motion.button>;
interface ButtonProps extends MotionButtonProps {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'destructive';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "px-5 sm:px-6 py-3 rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg";

  const variants: any = {
    primary: "bg-[var(--primary)] text-[var(--primary-fg)] hover:brightness-110",
    secondary: "bg-[var(--secondary)] text-[var(--secondary-fg)] hover:brightness-110",
    accent: "bg-[var(--accent)] text-[var(--accent-fg)] hover:brightness-110",
    outline: "border border-[var(--border)] text-[var(--foreground)] bg-[var(--surface)] hover:border-[var(--primary)]",
    ghost: "text-[var(--foreground)] hover:bg-[var(--surface)]/60",
    destructive: "bg-[#ef4444] text-white hover:brightness-110",
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
  <div className={`bg-[var(--card)] border border-[var(--border)]/60 rounded-2xl p-6 sm:p-6 shadow-xl hover:shadow-2xl transition-shadow ${className}`}>
    {children}
  </div>
);

// --- INPUT ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export const Input: React.FC<InputProps> = ({ label, ...props }) => (
  <div className="flex flex-col gap-2 mb-4">
    {label && <label className="text-sm font-medium text-[var(--muted-fg)]">{label}</label>}
    <input
      className="w-full px-4 py-3 rounded-2xl border border-[var(--border)]/60 bg-[var(--input)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
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
          className="fixed inset-0 bg-[var(--background)]/80 z-50 backdrop-blur-sm" onClick={onClose} 
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
        >
          <div className="bg-[var(--card)] w-full max-w-lg p-4 sm:p-6 rounded-2xl shadow-2xl pointer-events-auto border border-[var(--border)] max-h-[90vh] overflow-y-auto mx-4">
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

interface ServiceCardProps {
  image?: string;
  nome: string;
  preco: number;
  duracao: number;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ image, nome, preco, duracao }) => (
  <Card className="p-0 overflow-hidden hover:ring-1 hover:ring-[var(--primary)]/30">
    {image ? (
      <img src={image} alt={nome} className="w-full h-28 sm:h-36 object-cover" />
    ) : (
      <div className="w-full h-28 sm:h-36 bg-[var(--surface)]" />
    )}
    <div className="p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-bold text-lg">{nome}</h4>
        <span className="font-bold text-[var(--accent)]">R$ {preco.toFixed(2)}</span>
      </div>
      <div className="text-sm text-[var(--muted-fg)]">{duracao} minutos</div>
    </div>
  </Card>
);

interface ProfessionalCardProps {
  image?: string;
  nome: string;
  especialidade?: string;
}

export const ProfessionalCard: React.FC<ProfessionalCardProps> = ({ image, nome, especialidade }) => (
  <Card className="flex flex-col items-center p-6 gap-3 hover:ring-1 hover:ring-[var(--primary)]/30">
    {image ? (
      <img src={image} alt={nome} className="w-24 h-24 md:w-28 md:h-28 rounded-2xl object-cover" />
    ) : (
      <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-[var(--surface)]" />
    )}
    <div className="text-center">
      <h3 className="font-bold text-lg">{nome}</h3>
      {especialidade && <p className="text-[var(--primary)] text-sm">{especialidade}</p>}
    </div>
  </Card>
);

// --- IMAGE UPLOAD ---
interface ImageUploadProps {
  label?: string;
  value?: string;
  onChange: (value: string) => void;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ label, value, onChange, className = '' }) => {
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Arquivo muito grande. Máximo 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      if (file.type === 'image/webp') {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            const jpeg = canvas.toDataURL('image/jpeg', 0.9);
            setPreview(jpeg);
            onChange(jpeg);
          } else {
            setPreview(base64);
            onChange(base64);
          }
        };
        img.onerror = () => {
          setPreview(base64);
          onChange(base64);
        };
        img.src = base64;
      } else {
        setPreview(base64);
        onChange(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setPreview(url || null);
    onChange(url);
  };

  const handleRemove = () => {
    setPreview(null);
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`flex flex-col gap-1.5 mb-4 ${className}`}>
      {label && <label className="text-sm font-medium text-[var(--muted-fg)]">{label}</label>}
      
      {preview && (
        <div className="relative mb-2">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-48 object-cover rounded-lg border border-[var(--border)]"
            onError={() => setPreview(null)}
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1 bg-[var(--accent)] text-[var(--accent-fg)] rounded-full hover:brightness-110 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Ou cole a URL da imagem"
          value={value && value.startsWith('http') ? value : ''}
          onChange={handleUrlChange}
          className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--input)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
        />
        
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-[var(--border)] rounded-lg cursor-pointer hover:bg-[var(--muted)] transition-colors text-[var(--muted-fg)]"
          >
            <Upload size={18} />
            <span>Ou faça upload de uma imagem</span>
          </label>
        </div>
      </div>
    </div>
  );
};

