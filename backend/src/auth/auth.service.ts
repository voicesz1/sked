import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, senha, ...rest } = registerDto;

    // Verificar se email já existe
    const empresaExistente = await this.prisma.empresa.findUnique({
      where: { email },
    });

    if (empresaExistente) {
      throw new ConflictException('Email já cadastrado');
    }

    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Criar empresa
    const baseSlug =
      String(rest?.nome || email)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'empresa';
    const linkUnico = `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`;

    const empresa = await this.prisma.empresa.create({
      data: {
        ...rest,
        email,
        senha: senhaHash,
        linkUnico,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        linkUnico: true,
        createdAt: true,
      },
    });

    return {
      empresa,
      message: 'Empresa cadastrada com sucesso',
    };
  }

  async login(loginDto: LoginDto) {
    const { email, senha } = loginDto;

    // Buscar empresa
    const empresa = await this.prisma.empresa.findUnique({
      where: { email },
    });

    if (!empresa) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Verificar senha
    const senhaValida = await bcrypt.compare(senha, empresa.senha);

    if (!senhaValida) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Gerar token JWT
    const payload = { sub: empresa.id, email: empresa.email };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      empresa: {
        id: empresa.id,
        nome: empresa.nome,
        email: empresa.email,
        linkUnico: empresa.linkUnico,
      },
    };
  }

  async validateEmpresa(empresaId: string) {
    const empresa = await this.prisma.empresa.findUnique({
      where: { id: Number(empresaId) },
      select: {
        id: true,
        nome: true,
        email: true,
        linkUnico: true,
      },
    });

    if (!empresa) {
      throw new UnauthorizedException('Empresa não encontrada');
    }

    return empresa;
  }
}
