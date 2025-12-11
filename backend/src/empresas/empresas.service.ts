import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';

@Injectable()
export class EmpresasService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.empresa.findMany({
      select: {
        id: true,
        nome: true,
        endereco: true,
        telefone: true,
        email: true,
        logo: true,
        linkUnico: true,
        createdAt: true,
      },
    });
  }

  async findOne(id: string) {
    const empresa = await this.prisma.empresa.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        nome: true,
        endereco: true,
        telefone: true,
        email: true,
        logo: true,
        linkUnico: true,
        pixKey: true,
        pixBeneficiaryName: true,
        paymentFeePercent: true,
        asaasApiKey: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!empresa) {
      throw new NotFoundException('Empresa não encontrada');
    }

    return empresa;
  }

  async findByLinkUnico(linkUnico: string) {
    const empresa = await this.prisma.empresa.findUnique({
      where: { linkUnico },
      select: {
        id: true,
        nome: true,
        endereco: true,
        telefone: true,
        logo: true,
        linkUnico: true,
        paymentFeePercent: true,
      },
    });

    if (!empresa) {
      throw new NotFoundException('Empresa não encontrada');
    }

    return empresa;
  }

  async update(id: string, updateEmpresaDto: UpdateEmpresaDto, empresaId: string) {
    // Verificar se a empresa está tentando atualizar seus próprios dados
    if (id !== empresaId) {
      throw new ForbiddenException('Você só pode atualizar seus próprios dados');
    }

    const empresa = await this.prisma.empresa.findUnique({
      where: { id: Number(id) },
    });

    if (!empresa) {
      throw new NotFoundException('Empresa não encontrada');
    }

    return this.prisma.empresa.update({
      where: { id: Number(id) },
      data: updateEmpresaDto,
      select: {
        id: true,
        nome: true,
        endereco: true,
        telefone: true,
        email: true,
        logo: true,
        linkUnico: true,
        pixKey: true,
        pixBeneficiaryName: true,
        paymentFeePercent: true,
        asaasApiKey: true,
        updatedAt: true,
      },
    });
  }

  async remove(id: string, empresaId: string) {
    if (id !== empresaId) {
      throw new ForbiddenException('Você só pode excluir sua própria conta');
    }

    const empresa = await this.prisma.empresa.findUnique({
      where: { id: Number(id) },
    });

    if (!empresa) {
      throw new NotFoundException('Empresa não encontrada');
    }

    await this.prisma.empresa.delete({
      where: { id: Number(id) },
    });

    return { message: 'Empresa excluída com sucesso' };
  }
}
