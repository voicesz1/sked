import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AsaasService } from './asaas.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly FIXED_FEE: number;

  constructor(
    private prisma: PrismaService,
    private asaas: AsaasService,
    private config: ConfigService,
  ) {
    const envVal = this.config.get<string>('DEFAULT_FEE_VALUE');
    this.FIXED_FEE = envVal ? Number(envVal) : 0.5;
  }

  async createPixPaymentForAgendamento(empresaLink: string, agendamentoId: string) {
    const empresa = await this.prisma.empresa.findUnique({ where: { linkUnico: empresaLink } });
    if (!empresa) throw new BadRequestException('Empresa inválida');

    const agendamento = await this.prisma.agendamento.findUnique({
      where: { id: Number(agendamentoId) },
    });
    if (!agendamento) throw new BadRequestException('Agendamento inválido');

    const servico = await this.prisma.servico.findUnique({ where: { id: agendamento.servicoId } });
    const baseValue = Number(servico?.preco || 0);
    const taxa = Math.round(this.FIXED_FEE * 100) / 100;
    const totalValue = Math.round((baseValue + taxa) * 100) / 100;

    const apiKey = empresa.asaasApiKey || process.env.ASAAS_API_KEY;
    if (!apiKey) {
      return {
        ok: false,
        reason: 'ASAAS_API_KEY ausente',
        suggestedValue: totalValue,
      };
    }

    try {
      const payment = await this.asaas.createCharge({
        billingType: 'PIX',
        value: totalValue,
        description: `Agendamento ${agendamento.id}`,
        customer: {
          name: agendamento.clienteNome || 'Cliente',
        },
        apiKeyOverride: apiKey,
      });
      const saved = await this.prisma.pagamento.create({
        data: {
          empresaId: servico?.empresaId || null,
          agendamentoId: agendamento.id,
          asaasId: payment?.id ?? null,
          customerIdAsaas: payment?.customer ?? null,
          metodo: 'PIX',
          valorServico: baseValue,
          taxaAplicada: taxa,
          valorTotal: totalValue,
          status: payment?.status ?? 'PENDING',
          cobrancaUrl: payment?.invoiceUrl ?? payment?.paymentLink ?? payment?.pdf ?? null,
          qrcodeBase64: payment?.qrCode ?? null,
          asaasPayload: payment || {},
        },
      });

      return { ok: true, payment: saved, asaas: payment };
    } catch (e: any) {
      return { ok: false, error: String(e) };
    }
  }

  async createPaymentFromAgendamento({
    agendamentoId,
    billingType,
  }: {
    agendamentoId: string;
    billingType: 'PIX' | 'BOLETO' | 'CREDIT_CARD' | 'BANK_TRANSFER';
  }) {
    if (!agendamentoId) throw new BadRequestException('agendamentoId é obrigatório');
    const agendamento = await this.prisma.agendamento.findUnique({
      where: { id: Number(agendamentoId) },
    });
    if (!agendamento) throw new BadRequestException('Agendamento não encontrado');
    const servico = await this.prisma.servico.findUnique({ where: { id: agendamento.servicoId } });
    const valorServico = Number(servico?.preco ?? 0);
    const taxa = Math.round(this.FIXED_FEE * 100) / 100;
    const valorTotal = Math.round((valorServico + taxa) * 100) / 100;
    const clienteData = { name: agendamento.clienteNome || 'Cliente' };
    const asaasResp = await this.asaas.createCharge({
      customer: clienteData,
      billingType,
      value: valorTotal,
      description: `Agendamento ${agendamento.id}`,
      apiKeyOverride: process.env.ASAAS_API_KEY || undefined,
    });
    const pagamento = await this.prisma.pagamento.create({
      data: {
        empresaId: servico?.empresaId || null,
        agendamentoId: agendamento.id,
        asaasId: asaasResp.id ?? null,
        customerIdAsaas: asaasResp.customer ?? null,
        metodo: billingType,
        valorServico,
        taxaAplicada: taxa,
        valorTotal,
        status: asaasResp.status ?? 'PENDING',
        cobrancaUrl: asaasResp.invoiceUrl ?? asaasResp.paymentLink ?? asaasResp.pdf ?? null,
        qrcodeBase64: asaasResp.qrCode ?? null,
        asaasPayload: asaasResp || {},
      },
    });
    return { pagamento, asaasResp };
  }

  async handleWebhook(event: any) {
    const asaasId = event.id || event.payment?.id || event.data?.id || event.paymentId;
    const statusFromBody = event.status || event.payment?.status || event.data?.status;
    if (!asaasId) {
      this.logger.warn('Webhook recebido sem asaasId');
      return null;
    }
    const pagamento = await this.prisma.pagamento.findFirst({
      where: { asaasId: String(asaasId) },
    });
    if (!pagamento) {
      this.logger.warn(`Pagamento não encontrado para asaasId=${asaasId}`);
      return null;
    }
    let asaasInfo: any = null;
    try {
      asaasInfo = await this.asaas.getPayment(String(asaasId));
    } catch (e: any) {
      this.logger.warn(`Falha ao consultar Asaas para asaasId=${asaasId}: ${String(e)}`);
    }
    const newStatus = (asaasInfo && asaasInfo.status) || statusFromBody || 'PENDING';
    const updated = await this.prisma.pagamento.update({
      where: { id: pagamento.id },
      data: {
        status: String(newStatus),
        cobrancaUrl: asaasInfo?.invoiceUrl ?? pagamento.cobrancaUrl,
        qrcodeBase64: asaasInfo?.qrCode ?? pagamento.qrcodeBase64,
        asaasPayload: asaasInfo || pagamento.asaasPayload,
      },
    });
    const confirmedStatuses = ['CONFIRMED', 'RECEIVED', 'PAID', 'PAID_OFF'];
    if (confirmedStatuses.includes(String(newStatus).toUpperCase())) {
      if (pagamento.agendamentoId) {
        await this.prisma.agendamento.update({
          where: { id: pagamento.agendamentoId },
          data: { pago: true },
        });
      }
    }
    return updated;
  }
}
