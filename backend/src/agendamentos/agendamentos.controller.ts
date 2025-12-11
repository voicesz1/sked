import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AgendamentosService } from './agendamentos.service';
import { CreateAgendamentoDto } from './dto/create-agendamento.dto';
import { UpdateAgendamentoDto } from './dto/update-agendamento.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@ApiTags('Agendamentos')
@Controller('agendamentos')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class AgendamentosController {
  constructor(private readonly agendamentosService: AgendamentosService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo agendamento' })
  create(@Body() createAgendamentoDto: CreateAgendamentoDto, @GetUser('id') empresaId: string) {
    return this.agendamentosService.create(createAgendamentoDto, empresaId);
  }

  @Get()
  @ApiOperation({ summary: 'Listar agendamentos da empresa' })
  @ApiQuery({ name: 'data', required: false, description: 'Data no formato YYYY-MM-DD' })
  findAll(@Query('data') data: string, @GetUser('id') empresaId: string) {
    return this.agendamentosService.findAll(empresaId, data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar agendamento por ID' })
  findOne(@Param('id') id: string, @GetUser('id') empresaId: string) {
    return this.agendamentosService.findOne(id, empresaId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar status do agendamento' })
  update(
    @Param('id') id: string,
    @Body() updateAgendamentoDto: UpdateAgendamentoDto,
    @GetUser('id') empresaId: string,
  ) {
    return this.agendamentosService.update(id, updateAgendamentoDto, empresaId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir agendamento' })
  remove(@Param('id') id: string, @GetUser('id') empresaId: string) {
    return this.agendamentosService.remove(id, empresaId);
  }

  @Get('disponibilidade/:funcionarioId')
  @ApiOperation({ summary: 'Verificar disponibilidade de horários' })
  @ApiQuery({ name: 'data', required: true, description: 'Data no formato YYYY-MM-DD' })
  getDisponibilidade(
    @Param('funcionarioId') funcionarioId: string,
    @Query('data') data: string,
    @GetUser('id') empresaId: string,
  ) {
    return this.agendamentosService.getDisponibilidade(funcionarioId, data, empresaId);
  }
}
