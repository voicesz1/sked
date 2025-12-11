import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsIn } from 'class-validator';

export class UpdateAgendamentoDto {
  @ApiProperty({
    example: 'confirmado',
    enum: ['pendente', 'confirmado', 'cancelado', 'concluido'],
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsIn(['pendente', 'confirmado', 'cancelado', 'concluido'])
  status?: string;

  @ApiProperty({ example: 'Observações atualizadas', required: false })
  @IsString()
  @IsOptional()
  observacoes?: string;
}
