import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed do banco de dados...');

  // Criar empresas de exemplo
  const senhaHash = await bcrypt.hash('123456', 10);

  const empresa1 = await prisma.empresa.upsert({
    where: { email: 'barbearia@example.com' },
    update: {},
    create: {
      nome: 'Smart Agenda Barbearia',
      endereco: 'Rua Augusta, 123 - São Paulo, SP',
      telefone: '(11) 99999-9999',
      email: 'barbearia@example.com',
      senha: senhaHash,
      logo: '/logo-sked.png',
      linkUnico: 'smart-agenda-barbearia',
      servicos: {
        create: [
          {
            nome: 'Corte Degradê',
            descricao: 'Corte moderno com degradê',
            preco: 45.0,
            duracao: 30,
            categoria: 'Cabelo',
          },
          {
            nome: 'Barba Terapia',
            descricao: 'Tratamento completo para barba',
            preco: 35.0,
            duracao: 30,
            categoria: 'Barba',
          },
          {
            nome: 'Corte + Barba',
            descricao: 'Combo completo',
            preco: 70.0,
            duracao: 60,
            categoria: 'Combo',
          },
        ],
      },
      funcionarios: {
        create: [
          {
            nome: 'João Navalha',
            especialidade: 'Barbeiro Master',
            foto: null,
          },
          {
            nome: 'Carlos Silva',
            especialidade: 'Especialista em Cortes',
            foto: null,
          },
        ],
      },
      
    },
  });

  await prisma.horarioFuncionamento.upsert({
    where: { empresaId: empresa1.id },
    update: {},
    create: {
      empresaId: empresa1.id,
      segunda: '09:00-18:00',
      terca: '09:00-18:00',
      quarta: '09:00-18:00',
      quinta: '09:00-18:00',
      sexta: '09:00-18:00',
      sabado: '09:00-17:00',
      domingo: null,
    },
  });

  const empresa2 = await prisma.empresa.upsert({
    where: { email: 'salao@example.com' },
    update: {},
    create: {
      nome: 'Belle Époque Salão',
      endereco: 'Oscar Freire, 500 - São Paulo, SP',
      telefone: '(11) 98888-8888',
      email: 'salao@example.com',
      senha: senhaHash,
      logo: '/logo-sked.png',
      linkUnico: 'belle-epoque-salao',
      servicos: {
        create: [
          {
            nome: 'Corte Feminino',
            descricao: 'Corte moderno para mulheres',
            preco: 120.0,
            duracao: 60,
            categoria: 'Cabelo',
          },
          {
            nome: 'Manicure',
            descricao: 'Manicure completa',
            preco: 40.0,
            duracao: 40,
            categoria: 'Unhas',
          },
        ],
      },
      funcionarios: {
        create: [
          {
            nome: 'Ana Clara',
            especialidade: 'Hair Stylist',
            foto: null,
          },
          {
            nome: 'Beatriz Costa',
            especialidade: 'Manicure',
            foto: null,
          },
        ],
      },
      
    },
  });

  await prisma.horarioFuncionamento.upsert({
    where: { empresaId: empresa2.id },
    update: {},
    create: {
      empresaId: empresa2.id,
      segunda: '10:00-19:00',
      terca: '10:00-19:00',
      quarta: '10:00-19:00',
      quinta: '10:00-19:00',
      sexta: '10:00-19:00',
      sabado: '09:00-18:00',
      domingo: null,
    },
  });

  console.log('Seed concluído');
  console.log(`Empresa 1 - Email: barbearia@example.com | Senha: 123456`);
  console.log(`Empresa 2 - Email: salao@example.com | Senha: 123456`);
  console.log(`Link Empresa 1: /empresa/smart-agenda-barbearia`);
  console.log(`Link Empresa 2: /empresa/belle-epoque-salao`);
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
