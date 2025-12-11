import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateEmpresaDto {
  @ApiProperty()
  @IsString()
  nome: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  endereco?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  telefone?: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  logo?: string;

  @ApiProperty({ required: false, description: 'Chave PIX (CPF/CNPJ/email/telefone/Aleatória)' })
  @IsString()
  @IsOptional()
  pixKey?: string;

  @ApiProperty({ required: false, description: 'Nome do beneficiário PIX' })
  @IsString()
  @IsOptional()
  pixBeneficiaryName?: string;

  @ApiProperty({ required: false, description: 'Taxa extra (%) para lucro da empresa', default: 5 })
  @IsOptional()
  paymentFeePercent?: number;

  @ApiProperty({ required: false, description: 'API Key da Asaas' })
  @IsString()
  @IsOptional()
  asaasApiKey?: string;
}
