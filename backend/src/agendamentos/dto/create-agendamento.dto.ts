import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString, IsOptional, IsEmail } from 'class-validator';

export class CreateAgendamentoDto {
  @ApiProperty({ example: '1' })
  @IsString()
  @IsNotEmpty()
  servicoId: string;

  @ApiProperty({ example: '1' })
  @IsString()
  @IsNotEmpty()
  funcionarioId: string;

  @ApiProperty({ example: 'João Silva' })
  @IsString()
  @IsNotEmpty()
  clienteNome: string;

  @ApiProperty({ example: 'joao@example.com', required: false })
  @IsEmail()
  @IsOptional()
  clienteEmail?: string;

  @ApiProperty({ example: '(11) 99999-9999', required: false })
  @IsString()
  @IsOptional()
  clienteTelefone?: string;

  @ApiProperty({ example: '2024-01-20T14:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  dataHora: string;

  @ApiProperty({ example: 'Observações do cliente', required: false })
  @IsString()
  @IsOptional()
  observacoes?: string;
}
