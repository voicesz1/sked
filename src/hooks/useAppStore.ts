// src/hooks/useAppStore.ts
import { useState, useEffect } from 'react';
import mocks from '../data/mocks';
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
  const [empresa, setEmpresa] = useState<Empresa>(mocks.MOCK_EMPRESA_BARBEARIA);
  const [servicos, setServicos] = useState<Servico[]>(mocks.MOCK_SERVICOS);
  const [profissionais, setProfissionais] = useState<Profissional[]>(mocks.MOCK_PROFISSIONAIS);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>(mocks.MOCK_AGENDAMENTOS);
  const [currentUser, setCurrentUser] = useState<{name: string, email: string} | null>(null);

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
