import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  NotFoundException,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';
import { AgendamentosService } from '../agendamentos/agendamentos.service';
import { CreateAgendamentoDto } from '../agendamentos/dto/create-agendamento.dto';
import { Public } from '../common/decorators/public.decorator';
import { PaymentsService } from '../payments/payments.service';

@ApiTags('Público')
@Controller('public')
export class PublicController {
  constructor(
    private prisma: PrismaService,
    private agendamentosService: AgendamentosService,
    private paymentsService: PaymentsService,
  ) {}

  @Public()
  @Get('empresa/:linkUnico')
  @ApiOperation({ summary: 'Buscar empresa por link único (público)' })
  async getEmpresa(@Param('linkUnico') linkUnico: string) {
    const empresa = await this.prisma.empresa.findUnique({
      where: { linkUnico },
      select: {
        id: true,
        nome: true,
        endereco: true,
        telefone: true,
        logo: true,
        linkUnico: true,
      },
    });

    if (!empresa) {
      throw new NotFoundException('Empresa não encontrada');
    }

    return empresa;
  }

  @Public()
  @Get('empresa/:linkUnico/servicos')
  @ApiOperation({ summary: 'Listar serviços da empresa (público)' })
  async getServicos(@Param('linkUnico') linkUnico: string) {
    const empresa = await this.prisma.empresa.findUnique({
      where: { linkUnico },
    });

    if (!empresa) {
      throw new NotFoundException('Empresa não encontrada');
    }

    return this.prisma.servico.findMany({
      where: {
        empresaId: empresa.id,
        ativo: true,
      },
      orderBy: { nome: 'asc' },
    });
  }

  @Public()
  @Get('empresa/:linkUnico/funcionarios')
  @ApiOperation({ summary: 'Listar funcionários da empresa (público)' })
  async getFuncionarios(@Param('linkUnico') linkUnico: string) {
    const empresa = await this.prisma.empresa.findUnique({
      where: { linkUnico },
    });

    if (!empresa) {
      throw new NotFoundException('Empresa não encontrada');
    }

    return this.prisma.funcionario.findMany({
      where: {
        empresaId: Number(empresa.id),
        ativo: true,
      },
      orderBy: { nome: 'asc' },
    });
  }

  @Public()
  @Get('empresa/:linkUnico/disponibilidade')
  @ApiOperation({ summary: 'Verificar disponibilidade de horários (público)' })
  @ApiQuery({ name: 'funcionarioId', required: true })
  @ApiQuery({ name: 'data', required: true, description: 'Data no formato YYYY-MM-DD' })
  async getDisponibilidade(
    @Param('linkUnico') linkUnico: string,
    @Query('funcionarioId') funcionarioId: string,
    @Query('data') data: string,
  ) {
    const empresa = await this.prisma.empresa.findUnique({
      where: { linkUnico },
    });

    if (!empresa) {
      throw new NotFoundException('Empresa não encontrada');
    }

    return this.agendamentosService.getDisponibilidade(funcionarioId, data, String(empresa.id));
  }

  @Public()
  @Post('empresa/:linkUnico/agendamento')
  @ApiOperation({ summary: 'Criar agendamento (público)' })
  async createAgendamento(
    @Param('linkUnico') linkUnico: string,
    @Body() createAgendamentoDto: CreateAgendamentoDto,
  ) {
    const empresa = await this.prisma.empresa.findUnique({
      where: { linkUnico },
    });

    if (!empresa) {
      throw new NotFoundException('Empresa não encontrada');
    }

    return this.agendamentosService.create(createAgendamentoDto, String(empresa.id));
  }

  @Public()
  @Post('empresa/:linkUnico/pagamento')
  @ApiOperation({ summary: 'Criar pagamento PIX via Asaas (público)' })
  async createPagamento(
    @Param('linkUnico') linkUnico: string,
    @Body() payload: { agendamentoId: string },
  ) {
    if (!payload?.agendamentoId) {
      return { ok: false, error: 'agendamentoId é obrigatório' };
    }
    return this.paymentsService.createPixPaymentForAgendamento(linkUnico, payload.agendamentoId);
  }

  @Public()
  @Post('asaas/webhook')
  @ApiOperation({ summary: 'Webhook público do Asaas para atualizar pagamentos' })
  async asaasWebhook(
    @Body() body: any,
    @Headers() headers: any,
    @Query('token') tokenParam?: string,
  ) {
    const expected = process.env.ASAAS_WEBHOOK_TOKEN;
    if (expected) {
      const authHeader = headers?.authorization || headers?.Authorization;
      const headerToken = headers?.['x-asaas-token'] || headers?.['asaas-token'];
      let provided = tokenParam || body?.token || headerToken;

      if (!provided && authHeader) {
        const parts = String(authHeader).trim().split(' ');
        if (parts.length === 2) provided = parts[1];
      }

      if (!provided || String(provided) !== String(expected)) {
        throw new UnauthorizedException('Webhook token inválido');
      }
    }
    return this.paymentsService.handleWebhook(body);
  }

  @Public()
  @Post('test/payment-fake')
  @ApiOperation({ summary: 'Criar pagamento fake para testes (dev) com token' })
  async createPaymentFake(
    @Body() payload: { agendamentoId: string; asaasId: string; status?: string },
    @Query('token') token?: string,
  ) {
    if (process.env.NODE_ENV === 'production') {
      throw new UnauthorizedException('Rota indisponível em produção');
    }
    const expected = process.env.ASAAS_WEBHOOK_TOKEN;
    if (!expected || String(token) !== String(expected)) {
      throw new UnauthorizedException('Token inválido');
    }

    const agendamento = await this.prisma.agendamento.findUnique({
      where: { id: Number(payload.agendamentoId) },
    });
    if (!agendamento) throw new NotFoundException('Agendamento inválido');

    const servico = await this.prisma.servico.findUnique({ where: { id: agendamento.servicoId } });
    const valorServico = Number(servico?.preco ?? 0);
    const taxa = 0;
    const valorTotal = valorServico + taxa;
    const pagamento = await this.prisma.pagamento.create({
      data: {
        empresaId: servico?.empresaId || null,
        agendamentoId: agendamento.id,
        asaasId: String(payload.asaasId),
        metodo: 'PIX',
        valorServico,
        taxaAplicada: taxa,
        valorTotal,
        status: payload.status || 'PENDING',
        asaasPayload: {},
      },
    });
    return pagamento;
  }
}
