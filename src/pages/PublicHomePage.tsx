import React from 'react';
import { motion } from 'framer-motion';
import { Scissors, Clock, Star } from 'lucide-react';
import { Button, Card, ServiceCard, ProfessionalCard } from '../components/ui';
import MaterialNavbar from '../components/MaterialNavbar';
const logoSrc = encodeURI('/logo sked.png');

export const PublicHomePage = ({ navigate, store }: any) => {
  const { empresa, servicos, profissionais } = store;
  const linkUnico = empresa?.linkUnico || 'smart-agenda-barbearia';

  return (
    <div className="flex flex-col min-h-screen pt-16">
      <MaterialNavbar
        logo={<img src={logoSrc} alt="Sked" className="w-full h-full object-contain rounded-full" />}
        title=""
        navItems={[
          { label: 'Login', onClick: () => navigate('/login') },
          { label: 'Agendar Agora', onClick: () => navigate(`/empresa/${encodeURIComponent(linkUnico)}/agendar`) },
        ]}
        className="border-b border-[var(--border)]"
        position="top"
      />

      {/* Hero */}
      <section className="pt-20 pb-20 px-4 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto space-y-6"
        >
          <h2 className="text-5xl font-extrabold tracking-tight leading-tight">
            {empresa.slogan}
          </h2>
          <p className="text-lg text-[var(--muted-fg)]">
            A melhor experiência de {empresa.tipo === 'barbearia' ? 'barbearia' : 'beleza'} da cidade. 
            Profissionais qualificados e ambiente premium.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Button variant="accent" className="h-12 px-8 text-lg" onClick={() => navigate(`/empresa/${encodeURIComponent(linkUnico)}/agendar`)}>
              Marcar Horário
            </Button>
          </div>
        </motion.div>
      </section>

      

      {/* Services */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold mb-10 text-center">Nossos Serviços</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {store.servicos.map((s: any) => (
              <ServiceCard key={s.id} image={s.foto} nome={s.nome} preco={s.preco} duracao={s.duracao} />
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
              <ProfessionalCard key={p.id} image={p.foto} nome={p.nome} especialidade={p.especialidade} />
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
