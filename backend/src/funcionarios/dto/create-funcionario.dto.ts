import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsEmail } from 'class-validator';

export class CreateFuncionarioDto {
  @ApiProperty({ example: 'João Silva' })
  @IsString()
  nome: string;

  @ApiProperty({ example: 'Barbeiro Master', required: false })
  @IsString()
  @IsOptional()
  especialidade?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  foto?: string;

  @ApiProperty({ example: '(11) 99999-9999', required: false })
  @IsString()
  @IsOptional()
  telefone?: string;

  @ApiProperty({ example: 'joao@example.com', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'Experiente barbeiro com 10 anos de experiência', required: false })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({ example: true, required: false, default: true })
  @IsBoolean()
  @IsOptional()
  ativo?: boolean;
}
