import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServicoDto } from './dto/create-servico.dto';
import { UpdateServicoDto } from './dto/update-servico.dto';

@Injectable()
export class ServicosService {
  constructor(private prisma: PrismaService) {}

  async create(createServicoDto: CreateServicoDto, empresaId: string) {
    return this.prisma.servico.create({
      data: {
        ...createServicoDto,
        empresaId: Number(empresaId),
      },
    });
  }

  async findAll(empresaId: string) {
    return this.prisma.servico.findMany({
      where: { empresaId: Number(empresaId) },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, empresaId: string) {
    const servico = await this.prisma.servico.findFirst({
      where: {
        id: Number(id),
        empresaId: Number(empresaId),
      },
    });

    if (!servico) {
      throw new NotFoundException('Serviço não encontrado');
    }

    return servico;
  }

  async update(id: string, updateServicoDto: UpdateServicoDto, empresaId: string) {
    await this.findOne(id, empresaId);

    return this.prisma.servico.update({
      where: { id: Number(id) },
      data: updateServicoDto,
    });
  }

  async remove(id: string, empresaId: string) {
    await this.findOne(id, empresaId);

    await this.prisma.servico.delete({
      where: { id: Number(id) },
    });

    return { message: 'Serviço excluído com sucesso' };
  }
}
