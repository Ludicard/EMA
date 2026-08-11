import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException('El correo electrónico ya está en uso');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create Demo Company for testing the MVP
    const company = await this.prisma.company.create({
      data: {
        name: `Empresa Demo - ${dto.name}`,
      },
    });

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: hashedPassword,
        role: 'ADMIN_EMPRESA',
        companyId: company.id,
      },
    });

    return this.generateTokens(user.id, user.email, user.role, user.companyId);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return this.generateTokens(user.id, user.email, user.role, user.companyId);
  }

  private async generateTokens(userId: string, email: string, role: string, companyId: string | null) {
    const payload = { sub: userId, email, role, companyId };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET || 'JWT_ACCESS_SECRET',
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET || 'JWT_REFRESH_SECRET',
        expiresIn: '7d',
      }),
    ]);

    // Opcional: Guardar refresh token hasheado en DB
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
