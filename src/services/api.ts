const BASE_URL =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_URL) ||
  (typeof window !== 'undefined' ? `${window.location.origin}/api` : 'http://localhost:3000');

const getEmpresa = async (linkUnico: string) => {
  try {
    const res = await fetch(`${BASE_URL}/public/empresa/${encodeURIComponent(linkUnico)}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
};

const getServicos = async (linkUnico: string) => {
  try {
    const res = await fetch(`${BASE_URL}/public/empresa/${encodeURIComponent(linkUnico)}/servicos`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
};

const getFuncionarios = async (linkUnico: string) => {
  try {
    const res = await fetch(`${BASE_URL}/public/empresa/${encodeURIComponent(linkUnico)}/funcionarios`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
};

const createAgendamentoPublic = async (linkUnico: string, payload: any) => {
  try {
    const res = await fetch(`${BASE_URL}/public/empresa/${encodeURIComponent(linkUnico)}/agendamento`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return { ok: false };
    return { ok: true, data: await res.json() };
  } catch {
    return { ok: false };
  }
};

const updateEmpresaSettings = async (empresaId: string, settings: any, token?: string) => {
  try {
    const res = await fetch(`${BASE_URL}/empresas/${empresaId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(settings),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
};

const createPagamentoPix = async (linkUnico: string, agendamentoId: string) => {
  try {
    const res = await fetch(`${BASE_URL}/public/empresa/${encodeURIComponent(linkUnico)}/pagamento`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agendamentoId }),
    });
    return await res.json();
  } catch {
    return { ok: false };
  }
};

const register = async (payload: any) => {
  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch { 
    // Mock registration
    return {
      empresa: { id: 'mock_id', nome: payload.nome, email: payload.email }
    };
  }
};

const login = async (payload: any) => {
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Falha no login');
    return await res.json();
  } catch (error) {
    console.warn("API indisponível ou erro no login, tentando mock...", error);
    // Mock para testes locais quando o backend não está rodando
    if (payload.email === 'barbearia@example.com' && payload.senha === '123456') {
      return {
        access_token: 'mock_token_dev_123',
        empresa: {
          id: '1',
          nome: 'Barbearia Demo',
          email: payload.email
        }
      };
    }
    return null; 
  }
};

const authHeaders = (token?: string) => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

const uploadImage = async (token: string, file: File) => {
  try {
    const form = new FormData();
    form.append('file', file);
    const res = await fetch(`${BASE_URL}/uploads/image`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: form,
    });
    return res.ok ? res.json() : null;
  } catch { return null; }
};

const listServicos = async (token: string) => {
  try {
    const res = await fetch(`${BASE_URL}/servicos`, { headers: authHeaders(token) });
    return res.ok ? res.json() : [];
  } catch { return []; }
};
const createServico = async (token: string, data: any) => {
  try {
    const res = await fetch(`${BASE_URL}/servicos`, { method: 'POST', headers: authHeaders(token), body: JSON.stringify(data) });
    return res.ok ? res.json() : null;
  } catch { return { id: Date.now(), ...data }; }
};
const deleteServico = async (token: string, id: string) => {
  try {
    const res = await fetch(`${BASE_URL}/servicos/${id}`, { method: 'DELETE', headers: authHeaders(token) });
    return res.ok;
  } catch { return true; }
};
const updateServico = async (token: string, id: string, data: any) => {
  try {
    const res = await fetch(`${BASE_URL}/servicos/${id}`, { method: 'PATCH', headers: authHeaders(token), body: JSON.stringify(data) });
    return res.ok ? res.json() : null;
  } catch { return { id, ...data }; }
};

const listFuncionarios = async (token: string) => {
  try {
    const res = await fetch(`${BASE_URL}/funcionarios`, { headers: authHeaders(token) });
    return res.ok ? res.json() : [];
  } catch { return []; }
};
const createFuncionario = async (token: string, data: any) => {
  try {
    const res = await fetch(`${BASE_URL}/funcionarios`, { method: 'POST', headers: authHeaders(token), body: JSON.stringify(data) });
    return res.ok ? res.json() : null;
  } catch { return { id: Date.now(), ...data }; }
};
const deleteFuncionario = async (token: string, id: string) => {
  try {
    const res = await fetch(`${BASE_URL}/funcionarios/${id}`, { method: 'DELETE', headers: authHeaders(token) });
    return res.ok;
  } catch { return true; }
};
const updateFuncionario = async (token: string, id: string, data: any) => {
  try {
    const res = await fetch(`${BASE_URL}/funcionarios/${id}`, { method: 'PATCH', headers: authHeaders(token), body: JSON.stringify(data) });
    return res.ok ? res.json() : null;
  } catch { return { id, ...data }; }
};

const listAgendamentos = async (token: string, data?: string) => {
  try {
    const url = new URL(`${BASE_URL}/agendamentos`);
    if (data) url.searchParams.set('data', data);
    const res = await fetch(url, { headers: authHeaders(token) });
    return res.ok ? res.json() : [];
  } catch { return []; }
};

const getDisponibilidadePublic = async (linkUnico: string, funcionarioId: string, data: string) => {
  try {
    const url = new URL(`${BASE_URL}/public/empresa/${encodeURIComponent(linkUnico)}/disponibilidade`);
    url.searchParams.set('funcionarioId', funcionarioId);
    url.searchParams.set('data', data);
    const res = await fetch(url.toString());
    return res.ok ? res.json() : null;
  } catch { return null; }
};

export default {
  getEmpresa,
  getServicos,
  getFuncionarios,
  createAgendamentoPublic,
  register,
  login,
  listServicos,
  createServico,
  deleteServico,
  listFuncionarios,
  createFuncionario,
  deleteFuncionario,
  updateFuncionario,
  listAgendamentos,
  getDisponibilidadePublic,
  updateEmpresaSettings,
  createPagamentoPix,
  updateServico,
  uploadImage,
};
