// src/data/mocks.ts

export type EmpresaTipo = 'barbearia' | 'salao';

export interface Empresa {
  id: string;
  nome: string;
  tipo: EmpresaTipo;
  slogan: string;
  endereco: string;
  telefone: string;
  logo: string;
}

export interface Servico {
  id: number;
  nome: string;
  preco: number;
  duracao: number;
  categoria: string;
}

export interface Profissional {
  id: number;
  nome: string;
  especialidade: string;
  avatar: string;
}

export interface Agendamento {
  id: number;
  cliente: string;
  servico: string;
  profissional: string;
  data: string;
  hora: string;
  status: 'confirmado' | 'pendente' | 'concluido';
  email?: string;
  telefone?: string;
  cpf?: string;
  cnpj?: string;
}

export const MOCK_EMPRESA_BARBEARIA: Empresa = {
  id: '1',
  nome: 'Viking Cuts',
  tipo: 'barbearia',
  slogan: 'Estilo clássico para o homem moderno.',
  endereco: 'Rua Augusta, 123 - SP',
  telefone: '(11) 99999-9999',
  logo: '🪓'
};

export const MOCK_EMPRESA_SALAO: Empresa = {
  id: '2',
  nome: 'Belle Époque',
  tipo: 'salao',
  slogan: 'Realce sua beleza natural.',
  endereco: 'Oscar Freire, 500 - SP',
  telefone: '(11) 98888-8888',
  logo: '🌸'
};

export const MOCK_SERVICOS: Servico[] = [
  { id: 1, nome: 'Corte Degradê', preco: 45.00, duracao: 30, categoria: 'Cabelo' },
  { id: 2, nome: 'Barba Terapia', preco: 35.00, duracao: 30, categoria: 'Barba' },
  { id: 3, nome: 'Corte + Barba', preco: 70.00, duracao: 60, categoria: 'Combo' },
  { id: 4, nome: 'Sobrancelha', preco: 20.00, duracao: 15, categoria: 'Face' },
];

export const MOCK_SERVICOS_SALAO: Servico[] = [
  { id: 1, nome: 'Corte Feminino', preco: 120.00, duracao: 60, categoria: 'Cabelo' },
  { id: 2, nome: 'Manicure', preco: 40.00, duracao: 40, categoria: 'Unhas' },
  { id: 3, nome: 'Hidratação Profunda', preco: 150.00, duracao: 90, categoria: 'Tratamento' },
  { id: 4, nome: 'Maquiagem Social', preco: 180.00, duracao: 60, categoria: 'Face' },
];

export const MOCK_PROFISSIONAIS: Profissional[] = [
  { id: 1, nome: 'João "Navalha"', especialidade: 'Barbeiro Master', avatar: '🧔🏻‍♂️' },
  { id: 2, nome: 'Carlos Silva', especialidade: 'Especialista em Cortes', avatar: '👨🏼' },
  { id: 3, nome: 'André Santos', especialidade: 'Colorista', avatar: '👨🏾' },
];

export const MOCK_PROFISSIONAIS_SALAO: Profissional[] = [
  { id: 1, nome: 'Ana Clara', especialidade: 'Hair Stylist', avatar: '👩🏻' },
  { id: 2, nome: 'Beatriz Costa', especialidade: 'Manicure', avatar: '👩🏼' },
  { id: 3, nome: 'Carla Dias', especialidade: 'Maquiadora', avatar: '👩🏾' },
];

export const MOCK_AGENDAMENTOS: Agendamento[] = [
  { id: 101, cliente: 'Roberto Firmino', servico: 'Corte Degradê', profissional: 'João "Navalha"', data: '2023-11-20', hora: '14:00', status: 'confirmado' },
  { id: 102, cliente: 'Gabriel Jesus', servico: 'Barba Terapia', profissional: 'Carlos Silva', data: '2023-11-20', hora: '15:30', status: 'pendente' },
  { id: 103, cliente: 'Alisson Becker', servico: 'Corte + Barba', profissional: 'André Santos', data: '2023-11-21', hora: '10:00', status: 'concluido' },
];

const mocks = {
  MOCK_EMPRESA_BARBEARIA,
  MOCK_EMPRESA_SALAO,
  MOCK_SERVICOS,
  MOCK_SERVICOS_SALAO,
  MOCK_PROFISSIONAIS,
  MOCK_PROFISSIONAIS_SALAO,
  MOCK_AGENDAMENTOS,
};

export default mocks;
