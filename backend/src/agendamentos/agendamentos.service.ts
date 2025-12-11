import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAgendamentoDto } from './dto/create-agendamento.dto';
import { UpdateAgendamentoDto } from './dto/update-agendamento.dto';

@Injectable()
export class AgendamentosService {
  constructor(private prisma: PrismaService) {}

  async create(createAgendamentoDto: CreateAgendamentoDto, empresaId: string) {
    const { servicoId, funcionarioId, dataHora, ...rest } = createAgendamentoDto;

    // Verificar se serviço existe e pertence à empresa
    const servico = await this.prisma.servico.findFirst({
      where: {
        id: Number(servicoId),
        empresaId: Number(empresaId),
        ativo: true,
      },
    });

    if (!servico) {
      throw new NotFoundException('Serviço não encontrado ou inativo');
    }

    // Verificar se funcionário existe e pertence à empresa
    const funcionario = await this.prisma.funcionario.findFirst({
      where: {
        id: Number(funcionarioId),
        empresaId: Number(empresaId),
        ativo: true,
      },
    });

    if (!funcionario) {
      throw new NotFoundException('Funcionário não encontrado ou inativo');
    }

    // Verificar se já existe agendamento no mesmo horário para o funcionário
    const dataHoraObj = new Date(dataHora);
    const agendamentoExistente = await this.prisma.agendamento.findFirst({
      where: {
        funcionarioId: Number(funcionarioId),
        dataHora: dataHoraObj,
        status: {
          notIn: ['cancelado'],
        },
      },
    });

    if (agendamentoExistente) {
      throw new ConflictException('Já existe um agendamento para este funcionário neste horário');
    }

    // Verificar se o horário não está no passado
    if (dataHoraObj < new Date()) {
      throw new BadRequestException('Não é possível agendar no passado');
    }

    return this.prisma.agendamento.create({
      data: {
        ...rest,
        servicoId: Number(servicoId),
        funcionarioId: Number(funcionarioId),
        empresaId: Number(empresaId),
        dataHora: dataHoraObj,
      },
      include: {
        servico: true,
        funcionario: true,
      },
    });
  }

  async findAll(empresaId: string, data?: string) {
    const where: any = { empresaId: Number(empresaId) };

    if (data) {
      const dataInicio = new Date(data);
      dataInicio.setHours(0, 0, 0, 0);
      const dataFim = new Date(data);
      dataFim.setHours(23, 59, 59, 999);

      where.dataHora = {
        gte: dataInicio,
        lte: dataFim,
      };
    }

    return this.prisma.agendamento.findMany({
      where,
      include: {
        servico: true,
        funcionario: true,
      },
      orderBy: {
        dataHora: 'asc',
      },
    });
  }

  async findOne(id: string, empresaId: string) {
    const agendamento = await this.prisma.agendamento.findFirst({
      where: {
        id: Number(id),
        empresaId: Number(empresaId),
      },
      include: {
        servico: true,
        funcionario: true,
      },
    });

    if (!agendamento) {
      throw new NotFoundException('Agendamento não encontrado');
    }

    return agendamento;
  }

  async update(id: string, updateAgendamentoDto: UpdateAgendamentoDto, empresaId: string) {
    await this.findOne(id, empresaId);

    return this.prisma.agendamento.update({
      where: { id: Number(id) },
      data: updateAgendamentoDto,
      include: {
        servico: true,
        funcionario: true,
      },
    });
  }

  async remove(id: string, empresaId: string) {
    await this.findOne(id, empresaId);

    await this.prisma.agendamento.delete({
      where: { id: Number(id) },
    });

    return { message: 'Agendamento excluído com sucesso' };
  }

  async getDisponibilidade(funcionarioId: string, data: string, empresaId: string) {
    // Verificar se funcionário pertence à empresa
    const funcionario = await this.prisma.funcionario.findFirst({
      where: {
        id: Number(funcionarioId),
        empresaId: Number(empresaId),
        ativo: true,
      },
    });

    if (!funcionario) {
      throw new NotFoundException('Funcionário não encontrado');
    }

    const dataInicio = new Date(data);
    dataInicio.setHours(0, 0, 0, 0);
    const dataFim = new Date(data);
    dataFim.setHours(23, 59, 59, 999);

    // Buscar agendamentos do dia
    const agendamentos = await this.prisma.agendamento.findMany({
      where: {
        funcionarioId: Number(funcionarioId),
        dataHora: {
          gte: dataInicio,
          lte: dataFim,
        },
        status: {
          notIn: ['cancelado'],
        },
      },
      select: {
        dataHora: true,
        servico: {
          select: {
            duracao: true,
          },
        },
      },
    });

    // Gerar horários disponíveis (simplificado - pode ser melhorado)
    const horariosDisponiveis = this.gerarHorariosDisponiveis(agendamentos);

    return {
      funcionario,
      data,
      horariosDisponiveis,
      agendamentos: agendamentos.length,
    };
  }

  private gerarHorariosDisponiveis(agendamentos: any[]): string[] {
    // Implementação simplificada - gera horários das 9h às 18h
    // Em produção, usar os horários de funcionamento da empresa
    const horariosDisponiveis: string[] = [];
    const horariosOcupados = agendamentos.map((a) => {
      const hora = new Date(a.dataHora);
      return hora.toTimeString().substring(0, 5);
    });

    for (let hora = 9; hora < 18; hora++) {
      for (let minuto = 0; minuto < 60; minuto += 30) {
        const horarioStr = `${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`;
        if (!horariosOcupados.includes(horarioStr)) {
          horariosDisponiveis.push(horarioStr);
        }
      }
    }

    return horariosDisponiveis;
  }
}
