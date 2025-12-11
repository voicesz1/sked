import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFuncionarioDto } from './dto/create-funcionario.dto';
import { UpdateFuncionarioDto } from './dto/update-funcionario.dto';

@Injectable()
export class FuncionariosService {
  constructor(private prisma: PrismaService) {}

  async create(createFuncionarioDto: CreateFuncionarioDto, empresaId: string) {
    return this.prisma.funcionario.create({
      data: {
        ...createFuncionarioDto,
        empresaId: Number(empresaId),
      },
    });
  }

  async findAll(empresaId: string) {
    return this.prisma.funcionario.findMany({
      where: { empresaId: Number(empresaId) },
      orderBy: { nome: 'asc' },
    });
  }

  async findOne(id: string, empresaId: string) {
    const funcionario = await this.prisma.funcionario.findFirst({
      where: {
        id: Number(id),
        empresaId: Number(empresaId),
      },
    });

    if (!funcionario) {
      throw new NotFoundException('Funcionário não encontrado');
    }

    return funcionario;
  }

  async update(id: string, updateFuncionarioDto: UpdateFuncionarioDto, empresaId: string) {
    await this.findOne(id, empresaId);

    return this.prisma.funcionario.update({
      where: { id: Number(id) },
      data: updateFuncionarioDto,
    });
  }

  async remove(id: string, empresaId: string) {
    await this.findOne(id, empresaId);

    await this.prisma.funcionario.delete({
      where: { id: Number(id) },
    });

    return { message: 'Funcionário excluído com sucesso' };
  }
}
