// src/pages/LoginPage.tsx
import React from 'react';
import { Button, Card, Input } from '../components/ui';

export const LoginPage = ({ navigate, store }: any) => {
  const handleLogin = async (e: any) => {
    e.preventDefault();
    const email = e.target.email.value;
    const senha = e.target.senha.value;
    const res = await (await import('../services/api')).default.login({ email, senha });
    if (res?.access_token) {
      localStorage.setItem('sked_token', res.access_token);
      store.setCurrentUser({ name: res?.empresa?.nome || 'Admin', email: res?.empresa?.email || email });
      navigate('/admin/dashboard');
    } else {
      alert('Falha no login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--background)]">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Painel Admin</h1>
          <p className="text-[var(--muted-fg)]">Entre para gerenciar sua empresa</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <Input name="email" label="Email" type="email" placeholder="admin@exemplo.com" defaultValue="barbearia@example.com" />
          <Input name="senha" label="Senha" type="password" placeholder="••••••••" defaultValue="123456" />
          <Button type="submit" className="w-full h-12">Entrar</Button>
        </form>
        <div className="mt-6 text-center text-sm">
          <span className="text-[var(--muted-fg)]">Não tem conta? </span>
          <button onClick={() => navigate('/registro')} className="text-[var(--primary)] font-bold hover:underline">
            Criar conta grátis
          </button>
        </div>
        <div className="mt-4 pt-4 border-t border-[var(--border)] text-center">
            <button onClick={() => navigate('/')} className="text-xs text-[var(--muted-fg)] hover:text-[var(--foreground)]">
                &larr; Voltar ao site público
            </button>
        </div>
      </Card>
    </div>
  );
};

export const RegisterPage = ({ navigate }: any) => (
  <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--background)]">
    <Card className="w-full max-w-md p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Crie sua conta</h1>
        <p className="text-[var(--muted-fg)]">Comece a gerenciar hoje</p>
      </div>
      <form className="space-y-4" onSubmit={async (e: any) => {
        e.preventDefault();
        const nome = e.target.nome.value;
        const email = e.target.email.value;
        const senha = e.target.senha.value;
        const res = await (await import('../services/api')).default.register({ nome, email, senha });
        if (res?.empresa?.id) {
          alert('Cadastro realizado! Faça login.');
          navigate('/login');
        } else {
          alert('Falha no cadastro');
        }
      }}>
        <Input name="nome" label="Nome da Empresa" placeholder="Ex: Viking Cuts" />
        <Input name="email" label="Email" type="email" />
        <Input name="senha" label="Senha" type="password" />
        <Button type="submit" className="w-full h-12">Registrar</Button>
      </form>
      <div className="mt-4 text-center">
        <button onClick={() => navigate('/login')} className="text-sm text-[var(--primary)] hover:underline">
          Já tenho conta
        </button>
      </div>
    </Card>
  </div>
);
export default LoginPage;
