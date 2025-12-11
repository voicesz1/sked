import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, Matches } from 'class-validator';

export class UpdateHorarioDto {
  @ApiProperty({
    example: '09:00-18:00',
    required: false,
    description: 'Formato: HH:mm-HH:mm ou null para fechado',
  })
  @IsString()
  @IsOptional()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]-([0-1]?[0-9]|2[0-3]):[0-5][0-9]$|^null$/, {
    message: 'Formato inválido. Use HH:mm-HH:mm ou null',
  })
  segunda?: string | null;

  @ApiProperty({ example: '09:00-18:00', required: false })
  @IsString()
  @IsOptional()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]-([0-1]?[0-9]|2[0-3]):[0-5][0-9]$|^null$/, {
    message: 'Formato inválido. Use HH:mm-HH:mm ou null',
  })
  terca?: string | null;

  @ApiProperty({ example: '09:00-18:00', required: false })
  @IsString()
  @IsOptional()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]-([0-1]?[0-9]|2[0-3]):[0-5][0-9]$|^null$/, {
    message: 'Formato inválido. Use HH:mm-HH:mm ou null',
  })
  quarta?: string | null;

  @ApiProperty({ example: '09:00-18:00', required: false })
  @IsString()
  @IsOptional()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]-([0-1]?[0-9]|2[0-3]):[0-5][0-9]$|^null$/, {
    message: 'Formato inválido. Use HH:mm-HH:mm ou null',
  })
  quinta?: string | null;

  @ApiProperty({ example: '09:00-18:00', required: false })
  @IsString()
  @IsOptional()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]-([0-1]?[0-9]|2[0-3]):[0-5][0-9]$|^null$/, {
    message: 'Formato inválido. Use HH:mm-HH:mm ou null',
  })
  sexta?: string | null;

  @ApiProperty({ example: '09:00-17:00', required: false })
  @IsString()
  @IsOptional()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]-([0-1]?[0-9]|2[0-3]):[0-5][0-9]$|^null$/, {
    message: 'Formato inválido. Use HH:mm-HH:mm ou null',
  })
  sabado?: string | null;

  @ApiProperty({ example: null, required: false })
  @IsString()
  @IsOptional()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]-([0-1]?[0-9]|2[0-3]):[0-5][0-9]$|^null$/, {
    message: 'Formato inválido. Use HH:mm-HH:mm ou null',
  })
  domingo?: string | null;
}
