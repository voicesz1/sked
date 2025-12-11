// src/hooks/useAppStore.ts
import { useState, useEffect } from 'react';
import mocks from '../data/mocks';
import api from '../services/api';
import type { Empresa, Servico, Profissional, Agendamento } from '../data/mocks';

interface AppStore {
    empresa: Empresa;
    setEmpresa: React.Dispatch<React.SetStateAction<Empresa>>;
    servicos: Servico[];
    setServicos: React.Dispatch<React.SetStateAction<Servico[]>>;
    profissionais: Profissional[];
    setProfissionais: React.Dispatch<React.SetStateAction<Profissional[]>>;
    agendamentos: Agendamento[];
    setAgendamentos: React.Dispatch<React.SetStateAction<Agendamento[]>>;
    currentUser: { name: string, email: string } | null;
    setCurrentUser: React.Dispatch<React.SetStateAction<{ name: string, email: string } | null>>;
}

export const useAppStore = (): AppStore => {
  const [empresa, setEmpresa] = useState<Empresa>(() => {
    try {
      const s = localStorage.getItem('sked_empresa');
      return s ? JSON.parse(s) : mocks.MOCK_EMPRESA_BARBEARIA;
    } catch {
      return mocks.MOCK_EMPRESA_BARBEARIA;
    }
  });
  const [servicos, setServicos] = useState<Servico[]>(mocks.MOCK_SERVICOS);
  const [profissionais, setProfissionais] = useState<Profissional[]>(mocks.MOCK_PROFISSIONAIS);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>(mocks.MOCK_AGENDAMENTOS);
  const [currentUser, setCurrentUser] = useState<{name: string, email: string} | null>(() => {
    try {
      const s = localStorage.getItem('sked_user');
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  });

  // Troca os dados mockados quando o tipo da empresa muda (Barbearia <-> Salão)
  useEffect(() => {
    if (empresa.tipo === 'barbearia') {
      setServicos(mocks.MOCK_SERVICOS);
      setProfissionais(mocks.MOCK_PROFISSIONAIS);
    } else {
      setServicos(mocks.MOCK_SERVICOS_SALAO);
      setProfissionais(mocks.MOCK_PROFISSIONAIS_SALAO);
    }
  }, [empresa.tipo]);

  useEffect(() => {
    try {
      localStorage.setItem('sked_empresa', JSON.stringify(empresa));
    } catch {}
  }, [empresa]);

  useEffect(() => {
    try {
      localStorage.setItem('sked_user', JSON.stringify(currentUser));
    } catch {}
  }, [currentUser]);

  useEffect(() => {
    (async () => {
      if (!empresa?.linkUnico) return;
      const data = await api.getEmpresa(empresa.linkUnico);
      if (data && data.nome) {
        setEmpresa(prev => ({
          ...prev,
          nome: data.nome ?? prev.nome,
          endereco: data.endereco ?? prev.endereco,
          telefone: data.telefone ?? prev.telefone,
          logo: data.logo ?? prev.logo,
        }));
      }
    })();
  }, [empresa.linkUnico]);

  return {
    empresa,
    setEmpresa,
    servicos,
    setServicos,
    profissionais,
    setProfissionais,
    agendamentos,
    setAgendamentos,
    currentUser,
    setCurrentUser
  };
};
export default useAppStore;
