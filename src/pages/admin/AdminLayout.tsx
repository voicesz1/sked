// src/pages/admin/AdminLayout.tsx
import React, { useState } from 'react';
import { 
    Calendar, Scissors, Users, User, Settings, LogOut, LayoutDashboard, TrendingUp, Edit2, Plus, Trash2, Check, ArrowLeft, Sparkles, X
} from 'lucide-react';
import { Card, Button, Input, Modal } from '../../components/ui';
// Valores usados para alternar nome/slogan/logo sem depender de mocks.ts
const BARBER_THEME = { nome: 'Smart Agenda', slogan: 'Estilo clássico para o homem moderno.', logo: '✂️' };
const SALON_THEME = { nome: 'Belle Époque', slogan: 'Realce sua beleza natural.', logo: '💅' };

// Importa as páginas filhas do Admin
const DashboardPage = ({ store }: any) => {
    const stats = [
        { label: 'Agendamentos Hoje', value: '12', icon: Calendar, color: 'text-blue-500' },
        { label: 'Faturamento (Mês)', value: 'R$ 4.250', icon: TrendingUp, color: 'text-green-500' },
        { label: 'Novos Clientes', value: '+8', icon: Users, color: 'text-purple-500' },
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
                            <span className={`px-2 py-1 rounded text-xs ${a.status === 'confirmado' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
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
    
    const handleAdd = (e: any) => {
      e.preventDefault();
      const newService = {
          id: Date.now(),
          nome: e.target.nome.value,
          preco: parseFloat(e.target.preco.value),
          duracao: parseInt(e.target.duracao.value),
          categoria: 'Geral'
      };
      store.setServicos([...store.servicos, newService]);
      setIsModalOpen(false);
    };
  
    return (
      <>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Catálogo de Serviços</h2>
          <Button onClick={() => setIsModalOpen(true)}><Plus size={16} /> Novo Serviço</Button>
        </div>
  
        <div className="grid gap-4">
          {store.servicos.map((s: any) => (
            <Card key={s.id} className="flex justify-between items-center p-4">
              <div>
                <h3 className="font-bold text-lg">{s.nome}</h3>
                <p className="text-[var(--muted-fg)]">{s.duracao} min • {s.categoria}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-lg text-[var(--primary)]">R$ {s.preco.toFixed(2)}</span>
                <div className="flex gap-2">
                   <Button variant="ghost" className="p-2"><Edit2 size={16} /></Button>
                   <Button variant="ghost" className="p-2 text-red-500 hover:bg-red-500/10"><Trash2 size={16} /></Button>
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
              <div className="flex justify-end gap-2 mt-4">
                  <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                  <Button type="submit">Salvar</Button>
              </div>
          </form>
        </Modal>
      </>
    );
};

const ProsPage = ({ store }: any) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {store.profissionais.map((p: any) => (
         <Card key={p.id} className="flex flex-col items-center p-6 gap-4">
             <div className="w-24 h-24 rounded-full bg-[var(--muted)] flex items-center justify-center text-4xl">
                 {p.avatar}
             </div>
             <div className="text-center">
                 <h3 className="font-bold text-lg">{p.nome}</h3>
                 <p className="text-[var(--primary)]">{p.especialidade}</p>
             </div>
             <Button variant="outline" className="w-full mt-2">Editar Perfil</Button>
         </Card>
      ))}
      <button className="border-2 border-dashed border-[var(--border)] rounded-xl flex flex-col items-center justify-center gap-2 text-[var(--muted-fg)] hover:bg-[var(--muted)] transition-colors min-h-[250px]">
          <Plus size={32} />
          <span>Adicionar Profissional</span>
      </button>
    </div>
);

const SchedulePage = ({ store }: any) => (
    <div className="space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
            {['Todos', 'Confirmados', 'Pendentes', 'Concluídos'].map(filter => (
                <button key={filter} className="px-4 py-2 rounded-full border border-[var(--border)] hover:bg-[var(--muted)] text-sm whitespace-nowrap bg-[var(--card)]">
                    {filter}
                </button>
            ))}
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
                            a.status === 'confirmado' ? 'bg-green-500/10 text-green-500' : 
                            a.status === 'pendente' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-gray-500/10 text-gray-500'
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

const SettingsPage = ({ store }: any) => {
    const toggleTheme = () => {
        const toSalon = store.empresa.tipo === 'barbearia';
        store.setEmpresa({
            ...store.empresa,
            tipo: toSalon ? 'salao' : 'barbearia',
            ...(toSalon ? SALON_THEME : BARBER_THEME),
        });
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
          <button onClick={() => { store.setCurrentUser(null); navigate('/login'); }} className="flex items-center gap-3 text-red-500 hover:bg-red-500/10 w-full p-3 rounded-lg">
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
