import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FuncionariosService } from './funcionarios.service';
import { CreateFuncionarioDto } from './dto/create-funcionario.dto';
import { UpdateFuncionarioDto } from './dto/update-funcionario.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@ApiTags('Funcionários')
@Controller('funcionarios')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class FuncionariosController {
  constructor(private readonly funcionariosService: FuncionariosService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo funcionário' })
  create(@Body() createFuncionarioDto: CreateFuncionarioDto, @GetUser('id') empresaId: string) {
    return this.funcionariosService.create(createFuncionarioDto, empresaId);
  }

  @Get()
  @ApiOperation({ summary: 'Listar funcionários da empresa' })
  findAll(@GetUser('id') empresaId: string) {
    return this.funcionariosService.findAll(empresaId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar funcionário por ID' })
  findOne(@Param('id') id: string, @GetUser('id') empresaId: string) {
    return this.funcionariosService.findOne(id, empresaId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar funcionário' })
  update(
    @Param('id') id: string,
    @Body() updateFuncionarioDto: UpdateFuncionarioDto,
    @GetUser('id') empresaId: string,
  ) {
    return this.funcionariosService.update(id, updateFuncionarioDto, empresaId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir funcionário' })
  remove(@Param('id') id: string, @GetUser('id') empresaId: string) {
    return this.funcionariosService.remove(id, empresaId);
  }
}
