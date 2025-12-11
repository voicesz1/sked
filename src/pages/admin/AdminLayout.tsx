// src/pages/admin/AdminLayout.tsx
import React, { useState } from 'react';
import { 
    Calendar, Scissors, Users, User, Settings, LogOut, LayoutDashboard, TrendingUp, Edit2, Plus, Trash2, Check, ArrowLeft, Sparkles, X
} from 'lucide-react';
import { Card, Button, Input, Modal, ImageUpload } from '../../components/ui';
// Valores usados para alternar nome/slogan/logo sem depender de mocks.ts
const BARBER_THEME = { nome: 'Smart Agenda', slogan: 'Estilo clássico para o homem moderno.', logo: '✂️' };
const SALON_THEME = { nome: 'Belle Époque', slogan: 'Realce sua beleza natural.', logo: '💅' };

// Importa as páginas filhas do Admin
const DashboardPage = ({ store }: any) => {
    const stats = [
        { label: 'Agendamentos Hoje', value: '12', icon: Calendar, color: 'text-[var(--primary)]' },
        { label: 'Faturamento (Mês)', value: 'R$ 4.250', icon: TrendingUp, color: 'text-[var(--primary)]' },
        { label: 'Novos Clientes', value: '+8', icon: Users, color: 'text-[var(--secondary)]' },
      ];
    
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, idx) => (
              <Card key={idx} className="flex items-center gap-4">
                <div className={`p-4 rounded-full bg-[var(--muted)] ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-[var(--muted-fg)] text-sm">{stat.label}</p>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                </div>
              </Card>
            ))}
          </div>
    
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="h-64 flex flex-col justify-center items-center text-[var(--muted-fg)] border-dashed border-2">
               <p>Gráfico de Receita Semanal (Mock)</p>
            </Card>
            <Card>
                <h3 className="font-bold mb-4">Próximos Agendamentos</h3>
                <div className="space-y-3">
                    {store.agendamentos.slice(0,3).map((a: any) => (
                        <div key={a.id} className="flex justify-between items-center p-3 bg-[var(--muted)]/50 rounded-lg">
                            <div>
                                <div className="font-bold">{a.cliente}</div>
                                <div className="text-xs text-[var(--muted-fg)]">{a.servico} com {a.profissional}</div>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs ${a.status === 'confirmado' ? 'bg-[var(--primary)]/20 text-[var(--primary)]' : 'bg-[var(--secondary)]/20 text-[var(--secondary)]'}`}>
                                {a.status}
                            </span>
                        </div>
                    ))}
                </div>
            </Card>
          </div>
        </div>
      );
};

const ServicesPage = ({ store }: any) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const token = typeof window !== 'undefined' ? localStorage.getItem('sked_token') : null;
    const [image, setImage] = useState<string>('');
    const [editImage, setEditImage] = useState<string>('');
    const [query, setQuery] = useState('');
    const [message, setMessage] = useState('');

    React.useEffect(() => {
      (async () => {
        if (!token) return;
        const list = await (await import('../../services/api')).default.listServicos(token);
        if (Array.isArray(list) && list.length) store.setServicos(list);
      })();
    }, []);
    
    const dataUrlToFile = (dataUrl: string, filename: string) => {
      const arr = dataUrl.split(',');
      const mimeMatch = arr[0].match(/:(.*?);/);
      const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
      const bstr = atob(arr[1] || '');
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) u8arr[n] = bstr.charCodeAt(n);
      return new File([u8arr], filename, { type: mime });
    };

    React.useEffect(() => { setEditImage(editing?.foto || ''); }, [editing]);

    const handleAdd = async (e: any) => {
      e.preventDefault();
      const payload: any = {
        nome: e.target.nome.value,
        preco: parseFloat(e.target.preco.value),
        duracao: parseInt(e.target.duracao.value),
        categoria: 'Geral',
      };
      if (token && image) {
        if (image.startsWith('http')) {
          payload.foto = image;
        } else if (image.startsWith('data:')) {
          const file = dataUrlToFile(image, 'servico.jpg');
          const up = await (await import('../../services/api')).default.uploadImage(token, file);
          if (up?.url) {
            payload.foto = up.url;
          } else {
            payload.foto = image;
          }
        }
      } else {
        if (image) payload.foto = image;
      }
      if (token) {
        const created = await (await import('../../services/api')).default.createServico(token, payload);
        if (created?.id) {
          store.setServicos([...store.servicos, created]);
          setMessage('Serviço criado com sucesso');
        }
      } else {
        store.setServicos([...store.servicos, { id: Date.now(), ...payload }]);
        setMessage('Serviço salvo localmente');
      }
      setIsModalOpen(false);
      setImage('');
    };

    const handleEdit = async (e: any) => {
      e.preventDefault();
      const payload: any = {
        nome: e.target.nome.value,
        preco: parseFloat(e.target.preco.value),
        duracao: parseInt(e.target.duracao.value),
        categoria: e.target.categoria.value || 'Geral',
      };
      if (token && editImage) {
        if (editImage.startsWith('http')) {
          payload.foto = editImage;
        } else if (editImage.startsWith('data:')) {
          const file = dataUrlToFile(editImage, 'servico.jpg');
          const up = await (await import('../../services/api')).default.uploadImage(token, file);
          if (up?.url) {
            payload.foto = up.url;
          } else {
            payload.foto = editImage;
          }
        }
      } else {
        payload.foto = editImage || editing?.foto;
      }
      if (token && editing?.id) {
        const updated = await (await import('../../services/api')).default.updateServico(token, editing.id, payload);
        if (updated?.id) {
          store.setServicos(store.servicos.map((s: any) => (s.id === editing.id ? updated : s)));
          setMessage('Serviço atualizado');
        }
      } else if (editing?.id) {
        store.setServicos(store.servicos.map((s: any) => (s.id === editing.id ? { ...s, ...payload } : s)));
        setMessage('Serviço atualizado localmente');
      }
      setIsEditOpen(false);
      setEditing(null);
      setEditImage('');
    };
  
    return (
      <>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Catálogo de Serviços</h2>
          <Button onClick={() => setIsModalOpen(true)}><Plus size={16} /> Novo Serviço</Button>
        </div>
        {message && (
          <Card className="p-3 mb-4 bg-[var(--secondary)]/10 border border-[var(--secondary)]">
            <div className="text-sm">{message}</div>
          </Card>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Input label="Buscar serviços" value={query} onChange={(e: any) => setQuery(e.target.value)} placeholder="Filtrar por nome ou categoria" />
        </div>
  
        <div className="grid gap-4">
          {store.servicos.filter((s: any) => {
            const q = query.trim().toLowerCase();
            if (!q) return true;
            return (
              String(s.nome).toLowerCase().includes(q) ||
              String(s.categoria || '').toLowerCase().includes(q)
            );
          }).map((s: any) => (
            <Card key={s.id} className="flex justify-between items-center p-4">
              <div className="flex items-center gap-4">
                {s.foto ? (
                  <img src={s.foto} alt={s.nome} className="w-16 h-16 md:w-24 md:h-24 rounded-lg object-cover" onError={(e) => {
                    const el = e.target as HTMLImageElement;
                    el.style.display = 'none';
                    const parent = el.parentElement;
                    if (parent) parent.innerHTML = '<div class="w-16 h-16 md:w-24 md:h-24 rounded-lg bg-[var(--muted)] flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" class="text-[var(--muted-fg)]" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.62 3.16a7 7 0 1 1 6.76 11.92"/><path d="M12 12v9"/><path d="M12 12 4.93 14.14"/><path d="M12 12l6.84 2.12"/></svg></div>';
                  }} />
                ) : (
                  <div className="w-16 h-16 md:w-24 md:h-24 rounded-lg bg-[var(--muted)] flex items-center justify-center">
                    <Scissors className="text-[var(--muted-fg)]" />
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-lg">{s.nome}</h3>
                  <p className="text-[var(--muted-fg)]">{s.duracao} min • {s.categoria}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-lg text-[var(--primary)]">R$ {s.preco.toFixed(2)}</span>
                <div className="flex gap-2">
                   <Button variant="ghost" className="p-2" onClick={() => { setEditing(s); setIsEditOpen(true); }}><Edit2 size={16} /></Button>
                   <Button variant="ghost" className="p-2 text-[var(--accent)] hover:bg-[var(--accent)]/10" onClick={async () => {
                     if (token && s.id) {
                       const ok = await (await import('../../services/api')).default.deleteServico(token, s.id);
                       if (ok) { store.setServicos(store.servicos.filter((x: any) => x.id !== s.id)); setMessage('Serviço removido'); }
                     } else {
                       store.setServicos(store.servicos.filter((x: any) => x.id !== s.id)); setMessage('Serviço removido localmente');
                     }
                   }}><Trash2 size={16} /></Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
  
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Adicionar Serviço">
          <form onSubmit={handleAdd} className="space-y-4">
              <Input name="nome" label="Nome do Serviço" placeholder="Ex: Corte Moderno" required />
              <div className="grid grid-cols-2 gap-4">
                  <Input name="preco" label="Preço (R$)" type="number" step="0.01" required />
                  <Input name="duracao" label="Duração (min)" type="number" required />
              </div>
              <ImageUpload label="Foto do Serviço" value={image} onChange={setImage} />
              <div className="flex justify-end gap-2 mt-4">
                  <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                  <Button type="submit">Salvar</Button>
              </div>
          </form>
        </Modal>

        <Modal isOpen={isEditOpen} onClose={() => { setIsEditOpen(false); setEditing(null); }} title="Editar Serviço">
          <form onSubmit={handleEdit} className="space-y-4">
              <Input name="nome" label="Nome do Serviço" defaultValue={editing?.nome} required />
              <div className="grid grid-cols-2 gap-4">
                  <Input name="preco" label="Preço (R$)" type="number" step="0.01" defaultValue={editing?.preco} required />
                  <Input name="duracao" label="Duração (min)" type="number" defaultValue={editing?.duracao} required />
              </div>
              <Input name="categoria" label="Categoria" defaultValue={editing?.categoria || 'Geral'} />
              <ImageUpload label="Foto do Serviço" value={editImage} onChange={setEditImage} />
              <div className="flex justify-end gap-2 mt-4">
                  <Button type="button" variant="ghost" onClick={() => { setIsEditOpen(false); setEditing(null); }}>Cancelar</Button>
                  <Button type="submit">Salvar</Button>
              </div>
          </form>
        </Modal>
      </>
    );
};

const ProsPage = ({ store }: any) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('sked_token') : null;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [image, setImage] = useState<string>('');
  const [editImage, setEditImage] = useState<string>('');
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState('');
  React.useEffect(() => {
    (async () => {
      if (!token) return;
      const list = await (await import('../../services/api')).default.listFuncionarios(token);
      if (Array.isArray(list) && list.length) store.setProfissionais(list);
    })();
  }, []);
  React.useEffect(() => { setEditImage(editing?.foto || ''); }, [editing]);
  const dataUrlToFile = (dataUrl: string, filename: string) => {
    const arr = dataUrl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const bstr = atob(arr[1] || '');
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  };
  const handleAdd = async (e: any) => {
    e.preventDefault();
    const payload: any = { nome: e.target.nome.value, especialidade: e.target.especialidade.value };
    if (token && image) {
      if (image.startsWith('http')) {
        payload.foto = image;
      } else if (image.startsWith('data:')) {
        const file = dataUrlToFile(image, 'profissional.jpg');
        const up = await (await import('../../services/api')).default.uploadImage(token, file);
        if (up?.url) {
          payload.foto = up.url;
        } else {
          payload.foto = image;
        }
      }
    } else {
      if (image) payload.foto = image;
    }
    if (token) {
      const created = await (await import('../../services/api')).default.createFuncionario(token, payload);
      if (created?.id) { store.setProfissionais([...store.profissionais, created]); setMessage('Profissional criado'); }
    } else {
      store.setProfissionais([...store.profissionais, { id: Date.now(), ...payload }]); setMessage('Profissional salvo localmente');
    }
    setIsModalOpen(false);
    setImage('');
  };
  const handleEdit = async (e: any) => {
    e.preventDefault();
    const payload: any = { nome: e.target.nome.value, especialidade: e.target.especialidade.value };
    if (token && editImage) {
      if (editImage.startsWith('http')) {
        payload.foto = editImage;
      } else if (editImage.startsWith('data:')) {
        const file = dataUrlToFile(editImage, 'profissional.jpg');
        const up = await (await import('../../services/api')).default.uploadImage(token, file);
        if (up?.url) {
          payload.foto = up.url;
        } else {
          payload.foto = editImage;
        }
      }
    } else {
      payload.foto = editImage || editing?.foto;
    }
    if (token && editing?.id) {
      const updated = await (await import('../../services/api')).default.updateFuncionario(token, editing.id, payload);
      if (updated?.id) { store.setProfissionais(store.profissionais.map((p: any) => (p.id === editing.id ? updated : p))); setMessage('Profissional atualizado'); }
    } else if (editing?.id) {
      store.setProfissionais(store.profissionais.map((p: any) => (p.id === editing.id ? { ...p, ...payload } : p))); setMessage('Profissional atualizado localmente');
    }
    setIsEditOpen(false);
    setEditing(null);
    setEditImage('');
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="md:col-span-2 lg:col-span-3">
        {message && (
          <Card className="p-3 mb-4 bg-[var(--secondary)]/10 border border-[var(--secondary)]">
            <div className="text-sm">{message}</div>
          </Card>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Input label="Buscar profissionais" value={query} onChange={(e: any) => setQuery(e.target.value)} placeholder="Filtrar por nome ou especialidade" />
        </div>
      </div>
      {store.profissionais.filter((p: any) => {
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return (
          String(p.nome).toLowerCase().includes(q) ||
          String(p.especialidade || '').toLowerCase().includes(q)
        );
      }).map((p: any) => (
         <Card key={p.id} className="flex flex-col items-center p-6 gap-4">
            {p.foto ? (
              <img src={p.foto} alt={p.nome} className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover" onError={(e) => {
                const el = e.target as HTMLImageElement;
                el.style.display = 'none';
                const parent = el.parentElement;
                if (parent) parent.innerHTML = '<div class="w-24 h-24 md:w-32 md:h-32 rounded-full bg-[var(--muted)] flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" class="text-[var(--muted-fg)]" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>';
              }} />
            ) : (
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-[var(--muted)] flex items-center justify-center">
                <User className="text-[var(--muted-fg)]" />
              </div>
            )}
            <div className="text-center">
                <h3 className="font-bold text-lg">{p.nome}</h3>
                <p className="text-[var(--primary)]">{p.especialidade}</p>
            </div>
           <div className="flex gap-2 w-full mt-2">
              <Button variant="outline" className="flex-1" onClick={() => { setEditing(p); setIsEditOpen(true); }}>Editar Perfil</Button>
              <Button variant="ghost" className="p-2 text-[var(--accent)] hover:bg-[var(--accent)]/10" onClick={async () => {
                if (token && p.id) {
                  const ok = await (await import('../../services/api')).default.deleteFuncionario(token, p.id);
                  if (ok) { store.setProfissionais(store.profissionais.filter((x: any) => x.id !== p.id)); setMessage('Profissional removido'); }
                } else {
                  store.setProfissionais(store.profissionais.filter((x: any) => x.id !== p.id)); setMessage('Profissional removido localmente');
                }
              }}><Trash2 size={16} /></Button>
           </div>
         </Card>
      ))}
      <button onClick={() => setIsModalOpen(true)} className="border-2 border-dashed border-[var(--border)] rounded-xl flex flex-col items-center justify-center gap-2 text-[var(--muted-fg)] hover:bg-[var(--muted)] transition-colors min-h-[250px]">
          <Plus size={32} />
          <span>Adicionar Profissional</span>
      </button>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Adicionar Profissional">
        <form onSubmit={handleAdd} className="space-y-4">
          <Input name="nome" label="Nome" required />
          <Input name="especialidade" label="Especialidade" />
          <ImageUpload label="Foto do Profissional" value={image} onChange={setImage} />
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </Modal>
      <Modal isOpen={isEditOpen} onClose={() => { setIsEditOpen(false); setEditing(null); }} title="Editar Profissional">
        <form onSubmit={handleEdit} className="space-y-4">
          <Input name="nome" label="Nome" defaultValue={editing?.nome} required />
          <Input name="especialidade" label="Especialidade" defaultValue={editing?.especialidade} />
          <ImageUpload label="Foto do Profissional" value={editImage} onChange={setEditImage} />
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="ghost" onClick={() => { setIsEditOpen(false); setEditing(null); }}>Cancelar</Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

const SchedulePage = ({ store }: any) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('sked_token') : null;
  const [dataFiltro, setDataFiltro] = useState<string>(() => new Date().toISOString().substring(0,10));
  React.useEffect(() => {
    (async () => {
      if (!token) return;
      const list = await (await import('../../services/api')).default.listAgendamentos(token, dataFiltro);
      if (Array.isArray(list)) store.setAgendamentos(list.map((a: any) => ({
        id: a.id,
        cliente: a.clienteNome,
        servico: a.servico?.nome,
        profissional: a.funcionario?.nome,
        data: new Date(a.dataHora).toISOString().substring(0,10),
        hora: new Date(a.dataHora).toTimeString().substring(0,5),
        status: a.status,
        email: a.clienteEmail,
        telefone: a.clienteTelefone,
      })));
    })();
  }, [dataFiltro]);
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Input type="date" label="Filtrar por data" value={dataFiltro} onChange={(e: any) => setDataFiltro(e.target.value)} />
      </div>
      <div className="space-y-3">
        {store.agendamentos.map((a: any) => (
          <Card key={a.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center font-bold">
                {a.hora}
              </div>
              <div>
                <h4 className="font-bold">{a.cliente}</h4>
                <p className="text-sm text-[var(--muted-fg)]">{a.servico} com {a.profissional}</p>
                {(a.email || a.telefone) && (
                  <p className="text-xs text-[var(--muted-fg)]">{a.email} {a.telefone ? `• ${a.telefone}` : ''}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                a.status === 'confirmado' ? 'bg-[var(--primary)]/10 text-[var(--primary)]' : 
                a.status === 'pendente' ? 'bg-[var(--secondary)]/10 text-[var(--secondary)]' : 'bg-[var(--muted)]/30 text-[var(--muted-fg)]'
              }`}>
                {a.status}
              </span>
              <Button variant="ghost" className="p-2"><Edit2 size={16} /></Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const SettingsPage = ({ store }: any) => {
    const [pixKey, setPixKey] = useState<string>(store.empresa.pixKey || '');
    const [pixName, setPixName] = useState<string>(store.empresa.pixBeneficiaryName || '');
    const [fee, setFee] = useState<number>(store.empresa.paymentFeePercent ?? 0.05);
    const [asaasKey, setAsaasKey] = useState<string>('');

    const toggleTheme = () => {
        const toSalon = store.empresa.tipo === 'barbearia';
        store.setEmpresa({
            ...store.empresa,
            tipo: toSalon ? 'salao' : 'barbearia',
            ...(toSalon ? SALON_THEME : BARBER_THEME),
        });
    };
    const handleSavePayments = async () => {
      const empresaId = store.empresa.id;
      const payload = { pixKey, pixBeneficiaryName: pixName, paymentFeePercent: fee, asaasApiKey: asaasKey || undefined };
      const token = localStorage.getItem('sked_token') || undefined;
      const updated = await (await import('../../services/api')).default.updateEmpresaSettings(empresaId, payload, token || undefined);
      if (updated) {
        store.setEmpresa({ ...store.empresa, pixKey, pixBeneficiaryName: pixName, paymentFeePercent: fee });
        alert('Configurações de pagamento salvas');
      } else {
        store.setEmpresa({ ...store.empresa, pixKey, pixBeneficiaryName: pixName, paymentFeePercent: fee });
        alert('Configurações salvas localmente');
      }
    };
  
    return (
      <div className="max-w-2xl space-y-8">
          <Card className="p-6 border-l-4 border-l-[var(--primary)]">
              <h3 className="text-lg font-bold mb-2">Simulação de Tema Dinâmico</h3>
              <p className="text-[var(--muted-fg)] mb-4">
                  Alternar o tipo da empresa mudará automaticamente toda a paleta de cores (Tailwind variables), fontes e dados mockados (serviços e profissionais).
              </p>
              <div className="flex items-center justify-between bg-[var(--muted)] p-4 rounded-lg">
                  <span className="font-bold">Modo Atual: {store.empresa.tipo.toUpperCase()}</span>
                  <Button onClick={toggleTheme} className="gap-2">
                      <Sparkles size={16} /> Trocar Tema
                  </Button>
              </div>
          </Card>
  
          <form className="space-y-4">
              <h3 className="text-lg font-bold">Dados da Empresa</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Nome Fantasia" value={store.empresa.nome} readOnly />
                  <Input label="Telefone" value={store.empresa.telefone} readOnly />
              </div>
              <Input label="Endereço" value={store.empresa.endereco} readOnly />
              <Input label="Slogan" value={store.empresa.slogan} readOnly />
              <div className="flex justify-end">
                  <Button type="button" variant="primary">Salvar Alterações</Button>
              </div>
          </form>

          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">Pagamentos (PIX + Asaas)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Chave PIX" value={pixKey} onChange={(e: any) => setPixKey(e.target.value)} placeholder="CPF/CNPJ/E-mail/Telefone/Chave Aleatória" />
              <Input label="Beneficiário PIX" value={pixName} onChange={(e: any) => setPixName(e.target.value)} placeholder="Nome do recebedor" />
              <Input label="Taxa extra (%)" type="number" step="0.01" value={fee} onChange={(e: any) => setFee(parseFloat(e.target.value))} placeholder="Ex.: 0.05 = 5%" />
              <Input label="Asaas API Key" value={asaasKey} onChange={(e: any) => setAsaasKey(e.target.value)} placeholder="chave da API (opcional)" />
            </div>
            <div className="flex justify-end mt-4">
              <Button onClick={handleSavePayments}><Check size={16} /> Salvar Pagamentos</Button>
            </div>
          </Card>
      </div>
    );
};
  
// --- Admin Layout Principal ---

export const AdminLayout = ({ navigate, currentPath, store }: any) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Calendar, label: 'Agenda', path: '/admin/agenda' },
    { icon: Scissors, label: 'Serviços', path: '/admin/servicos' },
    { icon: Users, label: 'Profissionais', path: '/admin/profissionais' },
    { icon: Settings, label: 'Configurações', path: '/admin/configuracoes' },
  ];

  const renderContent = () => {
    switch (currentPath) {
      case '/admin/dashboard': return <DashboardPage store={store} />;
      case '/admin/servicos': return <ServicesPage store={store} />;
      case '/admin/profissionais': return <ProsPage store={store} />;
      case '/admin/agenda': return <SchedulePage store={store} />;
      case '/admin/configuracoes': return <SettingsPage store={store} />;
      default: return <DashboardPage store={store} />;
    }
  };


  return (
    <div className="min-h-screen bg-[var(--background)] flex">
      {/* Sidebar */}
      <aside className={`fixed md:relative z-20 h-screen bg-[var(--card)] border-r border-[var(--border)] transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} hidden md:flex flex-col`}>
        <div className="p-6 flex items-center gap-3 border-b border-[var(--border)]">
          <div className="w-8 h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center text-white font-bold">
            {store.empresa.nome.substring(0,1)}
          </div>
          {sidebarOpen && <span className="font-bold truncate">{store.empresa.nome}</span>}
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                currentPath === item.path 
                  ? 'bg-[var(--primary)] text-white' 
                  : 'text-[var(--muted-fg)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]'
              }`}
            >
              <item.icon size={20} />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-[var(--border)]">
          <button onClick={() => { store.setCurrentUser(null); navigate('/login'); }} className="flex items-center gap-3 text-[var(--accent)] hover:bg-[var(--accent)]/10 w-full p-3 rounded-lg">
            <LogOut size={20} />
            {sidebarOpen && <span>Sair</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 border-b border-[var(--border)] flex items-center justify-between px-6 bg-[var(--card)]/50 backdrop-blur">
          <h2 className="font-bold text-xl capitalize">
             {currentPath.split('/').pop()}
          </h2>
          <div className="flex items-center gap-4">
             <div className="text-sm text-right hidden sm:block">
                <div className="font-bold">{store.currentUser?.name}</div>
                <div className="text-[var(--muted-fg)] text-xs">Administrador</div>
             </div>
             <div className="w-10 h-10 rounded-full bg-[var(--muted)] flex items-center justify-center">
                <User size={20} />
             </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};
