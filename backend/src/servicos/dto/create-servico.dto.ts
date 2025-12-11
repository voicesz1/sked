import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsBoolean, Min } from 'class-validator';

export class CreateServicoDto {
  @ApiProperty({ example: 'Corte Degradê' })
  @IsString()
  nome: string;

  @ApiProperty({ example: 'Corte moderno com degradê', required: false })
  @IsString()
  @IsOptional()
  descricao?: string;

  @ApiProperty({ example: 45.0 })
  @IsNumber()
  @Min(0)
  preco: number;

  @ApiProperty({ example: 30, description: 'Duração em minutos' })
  @IsNumber()
  @Min(1)
  duracao: number;

  @ApiProperty({ example: 'Cabelo', required: false })
  @IsString()
  @IsOptional()
  categoria?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  foto?: string;

  @ApiProperty({ example: true, required: false, default: true })
  @IsBoolean()
  @IsOptional()
  ativo?: boolean;
}
