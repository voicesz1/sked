import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { HorariosService } from './horarios.service';
import { UpdateHorarioDto } from './dto/update-horario.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@ApiTags('Horários de Funcionamento')
@Controller('horarios')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class HorariosController {
  constructor(private readonly horariosService: HorariosService) {}

  @Get()
  @ApiOperation({ summary: 'Buscar horários de funcionamento da empresa' })
  findOne(@GetUser('id') empresaId: string) {
    return this.horariosService.findOne(empresaId);
  }

  @Patch()
  @ApiOperation({ summary: 'Atualizar horários de funcionamento' })
  update(@Body() updateHorarioDto: UpdateHorarioDto, @GetUser('id') empresaId: string) {
    return this.horariosService.update(empresaId, updateHorarioDto);
  }
}
