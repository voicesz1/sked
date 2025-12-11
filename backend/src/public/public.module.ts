import { Module } from '@nestjs/common';
import { PublicController } from './public.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AgendamentosModule } from '../agendamentos/agendamentos.module';
import { PaymentsService } from '../payments/payments.service';
import { AsaasService } from '../payments/asaas.service';

@Module({
  imports: [PrismaModule, AgendamentosModule],
  controllers: [PublicController],
  providers: [PaymentsService, AsaasService],
})
export class PublicModule {}
