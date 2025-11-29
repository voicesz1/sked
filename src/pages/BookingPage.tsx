// src/pages/BookingPage.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowLeft } from 'lucide-react';
import { Button, Card } from '../components/ui';

export const BookingPage = ({ navigate, store }: any) => {
  const [step, setStep] = useState(1);
  const [selection, setSelection] = useState<any>({ service: null, pro: null, date: null, time: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contact, setContact] = useState<any>({ email: '', telefone: '', cpf: '', cnpj: '' });
  const [pixCode, setPixCode] = useState<string>('');

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const finishBooking = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      // Add to mock store
      const newBooking = {
        id: Date.now(),
        cliente: "Visitante (Você)",
        servico: selection.service.nome,
        profissional: selection.pro.nome,
        data: "2023-12-01",
        hora: selection.time,
        status: 'pendente',
        email: contact.email || undefined,
        telefone: contact.telefone || undefined,
        cpf: contact.cpf || undefined,
        cnpj: contact.cnpj || undefined,
      };
      store.setAgendamentos([...store.agendamentos, newBooking]);
      setIsSubmitting(false);
      const code = `PIX|chave:${contact.email || contact.telefone}|nome:${selection.pro.nome}|servico:${selection.service.nome}|valor:${selection.service.preco.toFixed(2)}|hora:${selection.time}`;
      setPixCode(code);
      setStep(4);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      <div className="p-4">
        <Button variant="ghost" onClick={() => navigate('/empresa/1')}><ArrowLeft size={16} /> Voltar</Button>
      </div>
      
      <div className="flex-1 container mx-auto px-4 max-w-3xl py-8">
        {/* Progress Bar */}
        <div className="flex justify-between mb-8 relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-[var(--border)] -z-10" />
          {[1, 2, 3].map((i) => (
            <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
              step >= i ? 'bg-[var(--primary)] text-white' : 'bg-[var(--card)] border border-[var(--border)]'
            }`}>
              {i}
            </div>
          ))}
        </div>

        <AnimatePresence mode='wait'>
          {step === 1 && (
            <motion.div 
              key="step1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold">Escolha um serviço</h2>
              <div className="grid gap-3">
                {store.servicos.map((s: any) => (
                  <button 
                    key={s.id} 
                    onClick={() => setSelection({...selection, service: s})}
                    className={`flex justify-between p-4 rounded-xl border transition-all ${
                      selection.service?.id === s.id 
                        ? 'border-[var(--primary)] bg-[var(--primary)]/10' 
                        : 'border-[var(--border)] bg-[var(--card)] hover:border-[var(--muted-fg)]'
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-bold">{s.nome}</div>
                      <div className="text-sm text-[var(--muted-fg)]">{s.duracao} min</div>
                    </div>
                    <div className="font-bold text-[var(--primary)]">R$ {s.preco.toFixed(2)}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold">Escolha o profissional</h2>
              <div className="grid grid-cols-2 gap-4">
                {store.profissionais.map((p: any) => (
                  <button 
                    key={p.id} 
                    onClick={() => setSelection({...selection, pro: p})}
                    className={`p-6 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                      selection.pro?.id === p.id 
                        ? 'border-[var(--primary)] bg-[var(--primary)]/10' 
                        : 'border-[var(--border)] bg-[var(--card)] hover:border-[var(--muted-fg)]'
                    }`}
                  >
                    <div className="text-4xl">{p.avatar}</div>
                    <div className="font-bold">{p.nome}</div>
                    <div className="text-xs text-[var(--muted-fg)]">{p.especialidade}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold">Data e Horário</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="flex items-center justify-center h-64">
                  <div className="text-[var(--muted-fg)]">Calendário Mock</div>
                  {/* Mock Visual Calendar */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none text-9xl">📅</div>
                </Card>
                <div className="grid grid-cols-3 gap-2 content-start">
                  {['09:00', '10:00', '11:00', '14:00', '15:00', '16:30'].map(time => (
                    <button 
                      key={time}
                      onClick={() => setSelection({...selection, time, date: 'Hoje'})}
                      className={`py-2 rounded-md border text-sm ${
                        selection.time === time 
                          ? 'bg-[var(--primary)] text-white border-[var(--primary)]' 
                          : 'border-[var(--border)] hover:bg-[var(--muted)]'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
              
              {selection.time && (
                <Card className="bg-[var(--muted)]/50 border-none">
                  <h3 className="font-bold mb-2">Resumo</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span>Serviço:</span> <b>{selection.service?.nome}</b></div>
                    <div className="flex justify-between"><span>Profissional:</span> <b>{selection.pro?.nome}</b></div>
                    <div className="flex justify-between"><span>Horário:</span> <b>Hoje às {selection.time}</b></div>
                    <div className="flex justify-between text-lg mt-2 pt-2 border-t border-[var(--border)]"><span>Total:</span> <b>R$ {selection.service?.preco.toFixed(2)}</b></div>
                  </div>
                </Card>
              )}
            </motion.div>
          )}

          {step === 4 && (
            <motion.div 
              key="pix" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold">Dados e Pagamento PIX</h2>
              <Card>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-bold mb-2">Contato</h3>
                    <div className="space-y-3">
                      <input className="w-full px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--input)]" placeholder="Email" value={contact.email} onChange={(e) => setContact({...contact, email: e.target.value})} />
                      <input className="w-full px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--input)]" placeholder="Telefone" value={contact.telefone} onChange={(e) => setContact({...contact, telefone: e.target.value})} />
                      <input className="w-full px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--input)]" placeholder="CPF" value={contact.cpf} onChange={(e) => setContact({...contact, cpf: e.target.value})} />
                      <input className="w-full px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--input)]" placeholder="CNPJ (opcional)" value={contact.cnpj} onChange={(e) => setContact({...contact, cnpj: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">PIX</h3>
                    {pixCode ? (
                      <div className="space-y-3">
                        <img alt="QR PIX" className="w-full max-w-xs border border-[var(--border)] rounded-lg" src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(pixCode)}`} />
                        <div className="text-xs text-[var(--muted-fg)]">Use o QR ou o código abaixo (copia e cola):</div>
                        <div className="p-3 bg-[var(--muted)] rounded-lg break-all text-xs border border-[var(--border)]">{pixCode}</div>
                        <Button onClick={() => navigator.clipboard.writeText(pixCode)}>Copiar código PIX</Button>
                      </div>
                    ) : (
                      <Button onClick={() => setPixCode(`PIX|chave:${contact.email || contact.telefone}|nome:${selection.pro.nome}|servico:${selection.service.nome}|valor:${selection.service.preco.toFixed(2)}|hora:${selection.time}`)}>Gerar PIX</Button>
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="ghost" onClick={() => navigate('/empresa/1')}>Cancelar</Button>
                  <Button onClick={() => setStep(5)}>Concluir</Button>
                </div>
              </Card>
            </motion.div>
          )}
          {step === 5 && (
            <motion.div 
              key="success" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center justify-center py-10 text-center space-y-4"
            >
              <div className="w-20 h-20 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mb-4">
                <Check size={40} />
              </div>
              <h2 className="text-3xl font-bold">Agendamento Confirmado!</h2>
              <p className="text-[var(--muted-fg)] max-w-md">
                Enviamos instruções para o pagamento por PIX no seu contato.
              </p>
              <Button onClick={() => navigate('/empresa/1')} className="mt-8">Voltar ao Início</Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Navigation */}
        {step < 4 && (
          <div className="flex justify-between mt-8 pt-4 border-t border-[var(--border)]">
            <Button variant="ghost" disabled={step === 1} onClick={handleBack}>Voltar</Button>
            <Button 
              disabled={
                (step === 1 && !selection.service) ||
                (step === 2 && !selection.pro) ||
                (step === 3 && !selection.time) ||
                isSubmitting
              } 
              onClick={step === 3 ? finishBooking : handleNext}
            >
              {isSubmitting ? 'Confirmando...' : step === 3 ? 'Confirmar Agendamento' : 'Próximo'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
export default BookingPage;
