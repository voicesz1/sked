import { Controller, Get, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EmpresasService } from './empresas.service';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@ApiTags('Empresas')
@Controller('empresas')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class EmpresasController {
  constructor(private readonly empresasService: EmpresasService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas as empresas' })
  async findAll() {
    return this.empresasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar empresa por ID' })
  async findOne(@Param('id') id: string) {
    return this.empresasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar empresa' })
  async update(
    @Param('id') id: string,
    @Body() updateEmpresaDto: UpdateEmpresaDto,
    @GetUser('id') empresaId: string,
  ) {
    return this.empresasService.update(id, updateEmpresaDto, empresaId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir empresa' })
  async remove(@Param('id') id: string, @GetUser('id') empresaId: string) {
    return this.empresasService.remove(id, empresaId);
  }
}
