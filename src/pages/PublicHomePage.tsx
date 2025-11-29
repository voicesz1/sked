import React from 'react';
import { motion } from 'framer-motion';
import { Scissors, Clock, Star } from 'lucide-react';
import { Button, Card } from '../components/ui';

export const PublicHomePage = ({ navigate, store }: any) => {
  const { empresa, servicos, profissionais } = store;

  return (
    <div className="flex flex-col min-h-screen pt-16">
      {/* Header */}
      <header className="fixed w-full z-40 bg-[var(--background)]/80 backdrop-blur-md border-b border-[var(--border)]">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl">{empresa.logo}</span>
            <h1 className="text-xl font-bold tracking-tight">{empresa.nome}</h1>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" onClick={() => navigate('/login')}>Login</Button>
            <Button onClick={() => navigate('/empresa/1/agendar')}>Agendar Agora</Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto space-y-6"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-[var(--secondary)] text-[var(--secondary-fg)] text-sm font-medium">
            {empresa.tipo === 'barbearia' ? 'Desde 2015' : 'Espaço de Beleza'}
          </span>
          <h2 className="text-5xl font-extrabold tracking-tight leading-tight">
            {empresa.slogan}
          </h2>
          <p className="text-lg text-[var(--muted-fg)]">
            A melhor experiência de {empresa.tipo === 'barbearia' ? 'barbearia' : 'beleza'} da cidade. 
            Profissionais qualificados e ambiente premium.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Button className="h-12 px-8 text-lg" onClick={() => navigate('/empresa/1/agendar')}>
              Marcar Horário
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Services */}
      <section className="py-20 bg-[var(--muted)]/30">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold mb-10 text-center">Nossos Serviços</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {store.servicos.map((s: any) => (
              <Card key={s.id} className="hover:border-[var(--primary)] transition-colors cursor-default">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 rounded-lg bg-[var(--secondary)]">
                    <Scissors size={20} className="text-[var(--primary)]" />
                  </div>
                  <span className="font-bold text-[var(--primary)]">R$ {s.preco.toFixed(2)}</span>
                </div>
                <h4 className="font-bold text-lg mb-2">{s.nome}</h4>
                <p className="text-sm text-[var(--muted-fg)] flex items-center gap-2">
                  <Clock size={14} /> {s.duracao} minutos
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold mb-10 text-center">Equipe</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {store.profissionais.map((p: any) => (
              <Card key={p.id} className="text-center">
                <div className="text-6xl mb-4">{p.avatar}</div>
                <h4 className="font-bold text-lg">{p.nome}</h4>
                <p className="text-[var(--primary)] text-sm">{p.especialidade}</p>
                <div className="flex justify-center gap-1 mt-4 text-yellow-500">
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-8 border-t border-[var(--border)] mt-auto text-center text-[var(--muted-fg)]">
        <p>© 2024 {empresa.nome}. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};
export default PublicHomePage;
