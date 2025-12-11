import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ServicosService } from './servicos.service';
import { CreateServicoDto } from './dto/create-servico.dto';
import { UpdateServicoDto } from './dto/update-servico.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@ApiTags('Serviços')
@Controller('servicos')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ServicosController {
  constructor(private readonly servicosService: ServicosService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo serviço' })
  create(@Body() createServicoDto: CreateServicoDto, @GetUser('id') empresaId: string) {
    return this.servicosService.create(createServicoDto, empresaId);
  }

  @Get()
  @ApiOperation({ summary: 'Listar serviços da empresa' })
  findAll(@GetUser('id') empresaId: string) {
    return this.servicosService.findAll(empresaId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar serviço por ID' })
  findOne(@Param('id') id: string, @GetUser('id') empresaId: string) {
    return this.servicosService.findOne(id, empresaId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar serviço' })
  update(
    @Param('id') id: string,
    @Body() updateServicoDto: UpdateServicoDto,
    @GetUser('id') empresaId: string,
  ) {
    return this.servicosService.update(id, updateServicoDto, empresaId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir serviço' })
  remove(@Param('id') id: string, @GetUser('id') empresaId: string) {
    return this.servicosService.remove(id, empresaId);
  }
}
