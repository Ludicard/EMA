import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class CompaniesService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  async createCompany(userId: string, userEmail: string, role: string, companyName: string) {
    const company = await this.prisma.company.create({
      data: {
        name: companyName,
      },
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: { companyId: company.id },
    });

    // Generate new tokens
    return this.authService.generateTokens(userId, userEmail, role, company.id);
  }

  async joinCompany(userId: string, userEmail: string, role: string, companyId: string) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException('Empresa no encontrada con ese ID');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { companyId: company.id },
    });

    // Generate new tokens
    return this.authService.generateTokens(userId, userEmail, role, company.id);
  }
}
