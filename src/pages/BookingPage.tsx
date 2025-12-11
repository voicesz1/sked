// src/pages/BookingPage.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowLeft } from 'lucide-react';
import { Button, Card } from '../components/ui';
import api from '../services/api';

export const BookingPage = ({ navigate, store, isMobile, initialBookingId }: any) => {
  const [step, setStep] = useState(1);
  const [selection, setSelection] = useState<any>({ service: null, pro: null, date: null, time: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [contact, setContact] = useState<any>({ email: '', telefone: '' });
  const [pixCode, setPixCode] = useState<string>('');
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [shareLink, setShareLink] = useState<string>('');
  const [bookingFromLink, setBookingFromLink] = useState<any | null>(null);

  React.useEffect(() => {
    if (initialBookingId) {
      const found = store.agendamentos.find((a: any) => String(a.id) === String(initialBookingId));
      setBookingFromLink(found || null);
    } else {
      setBookingFromLink(null);
    }
  }, [initialBookingId, store.agendamentos]);

  React.useEffect(() => {
    const link = store.empresa?.linkUnico || 'smart-agenda-barbearia';
    (async () => {
      const servicos = await api.getServicos(link);
      if (Array.isArray(servicos) && servicos.length) {
        const mapped = servicos.map((s: any) => ({ id: s.id, nome: s.nome, preco: s.preco, duracao: s.duracao, categoria: s.categoria || '' }));
        store.setServicos(mapped);
      }
      const funcs = await api.getFuncionarios(link);
      if (Array.isArray(funcs) && funcs.length) {
        const mapped = funcs.map((f: any) => ({ id: f.id, nome: f.nome, especialidade: f.especialidade || '', avatar: '👤', foto: f.foto }));
        store.setProfissionais(mapped);
      }
      setIsLoadingData(false);
    })();
  }, [store.empresa?.linkUnico]);

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);
  

  const finishBooking = () => {
    setIsSubmitting(true);
    setTimeout(async () => {
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
      };
      store.setAgendamentos([...store.agendamentos, newBooking]);
      setIsSubmitting(false);
      const empresa = store.empresa;
      const chavePix = empresa.pixKey || '';
      const code = `PIX|chave:${chavePix}|servico:${selection.service.nome}|valor:${selection.service.preco.toFixed(2)}|hora:${selection.time}`;
      setPixCode(code);
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://smart-agenda.local';
      const link = `${origin}/empresa/${store.empresa.id}/agendar?b=${newBooking.id}`;
      setShareLink(link);
      // Attach to booking object shape
      // @ts-ignore
      newBooking.codigoPix = code;
      try {
        const selectedDate = selection.date || new Date().toISOString().substring(0,10);
        const selectedTime = selection.time || '09:00';
        const dataHora = new Date(`${selectedDate}T${selectedTime}:00`).toISOString();
        const res = await api.createAgendamentoPublic(store.empresa?.linkUnico || 'smart-agenda-barbearia', {
          servicoId: selection.service?.id,
          funcionarioId: selection.pro?.id,
          clienteNome: 'Visitante',
          clienteEmail: contact.email || undefined,
          clienteTelefone: contact.telefone || undefined,
          dataHora,
          observacoes: '',
        });
        if (res?.ok && res.data?.id) {
          const pay = await api.createPagamentoPix(store.empresa?.linkUnico || 'smart-agenda-barbearia', res.data.id);
          setPaymentInfo(pay);
          const chavePix = store.empresa.pixKey || '';
          const value = selection.service.preco * (1 + (store.empresa.paymentFeePercent ?? 0));
          const payCode = `PIX|chave:${chavePix}|servico:${selection.service.nome}|valor:${value.toFixed(2)}|hora:${selection.time}`;
          setPixCode(pay?.payment?.pixQrCode ?? payCode);
        }
      } catch {}
      setStep(4);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      <div className="p-4">
        <Button variant="ghost" onClick={() => navigate(`/empresa/${store.empresa.id}`)}><ArrowLeft size={16} /> Voltar</Button>
      </div>
      
      <div className={`flex-1 ${isMobile ? 'px-4 py-4' : 'container mx-auto px-4 max-w-3xl py-8'}`}>
        {bookingFromLink && (
          <Card className="mb-6">
            <h3 className="font-bold mb-2">Detalhes do Agendamento</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span>Cliente:</span> <b>{bookingFromLink.cliente}</b></div>
              <div className="flex justify-between"><span>Serviço:</span> <b>{bookingFromLink.servico}</b></div>
              <div className="flex justify-between"><span>Profissional:</span> <b>{bookingFromLink.profissional}</b></div>
              <div className="flex justify-between"><span>Data:</span> <b>{bookingFromLink.data}</b></div>
              <div className="flex justify-between"><span>Hora:</span> <b>{bookingFromLink.hora}</b></div>
              <div className="flex justify-between"><span>Status:</span> <b>{bookingFromLink.status}</b></div>
            </div>
            {bookingFromLink.codigoPix && (
              <div className="mt-4 space-y-2">
                <img alt="QR PIX" className="w-full max-w-xs border border-[var(--border)] rounded-lg" src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(bookingFromLink.codigoPix)}`} />
                <div className="p-3 bg-[var(--muted)] rounded-lg break-all text-xs border border-[var(--border)]">{bookingFromLink.codigoPix}</div>
                <Button onClick={() => navigator.clipboard.writeText(bookingFromLink.codigoPix)}>Copiar código PIX</Button>
              </div>
            )}
          </Card>
        )}
        {/* Progress Bar */}
        <div className={`${isMobile ? 'px-2' : ''} flex justify-between mb-8 relative`}>
          <div className="absolute top-1/2 left-0 w-full h-1 bg-[var(--border)] -z-10" />
          {[1, 2, 3].map((i) => (
            <div key={i} className={`${isMobile ? 'w-12 h-12' : 'w-10 h-10'} rounded-full flex items-center justify-center font-bold transition-colors ${
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
              {isLoadingData && <div className="text-sm text-[var(--muted-fg)]">Carregando dados...</div>}
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
              {isLoadingData && <div className="text-sm text-[var(--muted-fg)]">Carregando dados...</div>}
              <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
                {store.profissionais.map((p: any) => (
                  <button 
                    key={p.id} 
                    onClick={async () => {
                      const next = { ...selection, pro: p };
                      setSelection(next);
                      const d = next.date || new Date().toISOString().substring(0,10);
                      const link = store.empresa?.linkUnico || 'smart-agenda-barbearia';
                      const disp = await api.getDisponibilidadePublic(link, String(p.id), d);
                      (window as any)._horariosDisp = disp?.horariosDisponiveis || [];
                    }}
                  className={`p-6 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                    selection.pro?.id === p.id 
                      ? 'border-[var(--primary)] bg-[var(--primary)]/10' 
                      : 'border-[var(--border)] bg-[var(--card)] hover:border-[var(--muted-fg)]'
                  }`}
                  >
                    <div className={`relative w-20 h-20 ${isMobile ? 'w-24 h-24' : ''} rounded-full overflow-hidden border-2 border-[var(--primary)]/20 flex items-center justify-center`}>
                      {p.foto ? (
                        <img 
                          src={p.foto} 
                          alt={p.nome}
                          className="w-full h-full object-cover object-center"
                          style={{ objectPosition: 'center center' }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            (e.target as HTMLImageElement).parentElement!.innerHTML = `<div class="w-full h-full bg-[var(--muted)] flex items-center justify-center ${isMobile ? 'text-5xl' : 'text-4xl'}">${p.avatar}</div>`;
                          }}
                        />
                      ) : (
                        <div className={`w-full h-full bg-[var(--muted)] flex items-center justify-center ${isMobile ? 'text-5xl' : 'text-4xl'}`}>
                          {p.avatar}
                        </div>
                      )}
                    </div>
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
              <div className={`grid ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2'} gap-6`}>
                <Card className="p-4">
                  <div className="space-y-2">
                    <label className="text-sm text-[var(--muted-fg)]">Selecione a data</label>
                    <input type="date" className="w-full border border-[var(--border)] rounded-lg p-2 bg-[var(--input)] text-[var(--foreground)]" value={selection.date || new Date().toISOString().substring(0,10)} onChange={async (e) => {
                      const date = e.target.value;
                      setSelection({ ...selection, date, time: null });
                      if (selection.pro?.id) {
                        const link = store.empresa?.linkUnico || 'smart-agenda-barbearia';
                        const disp = await api.getDisponibilidadePublic(link, String(selection.pro.id), date);
                        (window as any)._horariosDisp = disp?.horariosDisponiveis || [];
                      }
                    }} />
                  </div>
                </Card>
                <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-3'} gap-2 content-start`}>
                  {(((window as any)._horariosDisp) || ['09:00','09:30','10:00']).map((time: string) => (
                    <button 
                      key={time}
                      onClick={() => setSelection({...selection, time})}
                      className={`py-3 rounded-md border ${isMobile ? 'text-base' : 'text-sm'} ${
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
                    <div className="flex justify-between"><span>Horário:</span> <b>{(selection.date || new Date().toISOString().substring(0,10))} às {selection.time}</b></div>
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
              <h2 className="text-2xl font-bold">Pagamento PIX</h2>
              <Card>
                <div className="flex flex-col items-center">
                  <div className="w-full max-w-md">
                    <h3 className="font-bold mb-4 text-center">Realize o pagamento via PIX</h3>
                    {pixCode ? (
                      <div className="space-y-4">
                        <div className="flex justify-center">
                          <img alt="QR PIX" className="w-full max-w-xs border border-[var(--border)] rounded-lg" src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(pixCode)}`} />
                        </div>
                        <div className="text-xs text-[var(--muted-fg)] text-center">Use o QR ou o código abaixo (copia e cola):</div>
                        <div className="p-3 bg-[var(--muted)] rounded-lg break-all text-xs border border-[var(--border)]">{pixCode}</div>
                        <Button className="w-full" onClick={() => navigator.clipboard.writeText(pixCode)}>Copiar código PIX</Button>
                        {shareLink && (
                          <div className="space-y-2 pt-4 border-t border-[var(--border)]">
                            <h4 className="font-bold text-center">Link do Agendamento</h4>
                            <div className="p-3 bg-[var(--muted)] rounded-lg break-all text-xs border border-[var(--border)]">{shareLink}</div>
                            <div className="flex gap-2">
                              <Button variant="outline" className="flex-1" onClick={() => navigator.clipboard.writeText(shareLink)}>Copiar Link</Button>
                              <Button className="flex-1" onClick={() => {
                                if ((navigator as any).share) {
                                  (navigator as any).share({ title: 'Agendamento', text: 'Veja seu agendamento', url: shareLink });
                                } else {
                                  navigator.clipboard.writeText(shareLink);
                                }
                              }}>Compartilhar</Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-[var(--muted-fg)] mb-4">Gerando código PIX...</p>
                        <Button onClick={() => {
                          const empresa = store.empresa;
                          const chavePix = empresa.tipoChavePix === 'cpf' ? empresa.pixCpf :
                                           empresa.tipoChavePix === 'email' ? empresa.pixEmail :
                                           empresa.tipoChavePix === 'cnpj' ? empresa.pixCnpj :
                                           empresa.tipoChavePix === 'telefone' ? empresa.pixTelefone : '';
                          const code = `PIX|chave:${chavePix}|nome:${selection.pro.nome}|servico:${selection.service.nome}|valor:${selection.service.preco.toFixed(2)}|hora:${selection.time}`;
                          setPixCode(code);
                        }}>Gerar PIX</Button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="ghost" onClick={() => navigate(`/empresa/${store.empresa.id}`)}>Cancelar</Button>
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
              <div className="w-20 h-20 rounded-full bg-[var(--secondary)]/20 text-[var(--secondary)] flex items-center justify-center mb-4">
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

        {step < 4 && (
          <div className={`${isMobile ? 'fixed left-0 right-0 bg-[var(--card)]/95 backdrop-blur-md border-t border-[var(--border)] z-40' : 'mt-8 pt-4 border-t border-[var(--border)]'}`} style={isMobile ? { bottom: 'max(env(safe-area-inset-bottom), 0px)' } : {}}>
            <div className={`${isMobile ? 'max-w-md mx-auto px-4 py-3 flex justify-between' : 'flex justify-between'}`} style={isMobile ? { paddingBottom: 'max(env(safe-area-inset-bottom), 8px)' } : {}}>
              <Button variant="ghost" disabled={step === 1} onClick={handleBack}>Voltar</Button>
              <Button 
                variant={step === 3 ? 'accent' : 'primary'}
                disabled={
                  isLoadingData ||
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
          </div>
        )}
      </div>
    </div>
  );
};
export default BookingPage;
