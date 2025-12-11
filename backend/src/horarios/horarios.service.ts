import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateHorarioDto } from './dto/update-horario.dto';

@Injectable()
export class HorariosService {
  constructor(private prisma: PrismaService) {}

  async findOne(empresaId: string) {
    const horario = await this.prisma.horarioFuncionamento.findUnique({
      where: { empresaId: Number(empresaId) },
    });

    if (!horario) {
      // Criar horário padrão se não existir
      const data: Prisma.HorarioFuncionamentoCreateInput = {
        empresa: { connect: { id: Number(empresaId) } },
        segunda: '09:00-18:00',
        terca: '09:00-18:00',
        quarta: '09:00-18:00',
        quinta: '09:00-18:00',
        sexta: '09:00-18:00',
        sabado: '09:00-17:00',
        domingo: null,
      };
      return this.prisma.horarioFuncionamento.create({ data });
    }

    return horario;
  }

  async update(empresaId: string, updateHorarioDto: UpdateHorarioDto) {
    const horario = await this.prisma.horarioFuncionamento.findUnique({
      where: { empresaId: Number(empresaId) },
    });

    if (!horario) {
      const data: Prisma.HorarioFuncionamentoCreateInput = {
        empresa: { connect: { id: Number(empresaId) } },
        segunda: updateHorarioDto.segunda ?? '09:00-18:00',
        terca: updateHorarioDto.terca ?? '09:00-18:00',
        quarta: updateHorarioDto.quarta ?? '09:00-18:00',
        quinta: updateHorarioDto.quinta ?? '09:00-18:00',
        sexta: updateHorarioDto.sexta ?? '09:00-18:00',
        sabado: updateHorarioDto.sabado ?? '09:00-17:00',
        domingo: updateHorarioDto.domingo ?? null,
      };
      return this.prisma.horarioFuncionamento.create({ data });
    }

    return this.prisma.horarioFuncionamento.update({
      where: { empresaId: Number(empresaId) },
      data: updateHorarioDto,
    });
  }
}
