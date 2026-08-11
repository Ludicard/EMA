import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(companyId: string, dto: CreateClientDto) {
    return this.prisma.client.create({
      data: {
        ...dto,
        companyId,
      },
    });
  }

  async findAll(companyId: string) {
    return this.prisma.client.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(companyId: string, id: string) {
    const client = await this.prisma.client.findFirst({
      where: { id, companyId },
    });
    if (!client) throw new NotFoundException('Cliente no encontrado');
    return client;
  }

  async update(companyId: string, id: string, dto: UpdateClientDto) {
    const client = await this.findOne(companyId, id);
    return this.prisma.client.update({
      where: { id: client.id },
      data: dto,
    });
  }

  async remove(companyId: string, id: string) {
    const client = await this.findOne(companyId, id);
    return this.prisma.client.delete({
      where: { id: client.id },
    });
  }
}
