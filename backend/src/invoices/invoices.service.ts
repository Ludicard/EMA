import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { PayInvoiceDto } from './dto/pay-invoice.dto';

@Injectable()
export class InvoicesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(companyId: string, dto: CreateInvoiceDto) {
    // Verificar que el cliente existe y pertenece a la misma empresa
    const client = await this.prisma.client.findFirst({
      where: { id: dto.clientId, companyId },
    });
    if (!client) {
      throw new BadRequestException('El cliente no existe o no pertenece a la empresa.');
    }

    return this.prisma.invoice.create({
      data: {
        companyId,
        clientId: dto.clientId,
        number: dto.number,
        issueDate: new Date(dto.issueDate),
        dueDate: new Date(dto.dueDate),
        estimatedPaymentDate: dto.estimatedPaymentDate ? new Date(dto.estimatedPaymentDate) : null,
        amount: dto.amount,
        notes: dto.notes,
        status: 'PENDING',
      },
      include: {
        client: true,
      },
    });
  }

  async findAll(companyId: string) {
    return this.prisma.invoice.findMany({
      where: { companyId },
      include: {
        client: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(companyId: string, id: string) {
    const invoice = await this.prisma.invoice.findFirst({
      where: { id, companyId },
      include: {
        client: true,
      },
    });
    if (!invoice) throw new NotFoundException('Factura no encontrada');
    return invoice;
  }

  async update(companyId: string, id: string, dto: UpdateInvoiceDto) {
    const invoice = await this.findOne(companyId, id);

    if (dto.clientId && dto.clientId !== invoice.clientId) {
      const client = await this.prisma.client.findFirst({
        where: { id: dto.clientId, companyId },
      });
      if (!client) {
        throw new BadRequestException('El cliente no existe o no pertenece a la empresa.');
      }
    }

    return this.prisma.invoice.update({
      where: { id: invoice.id },
      data: {
        ...dto,
        issueDate: dto.issueDate ? new Date(dto.issueDate) : undefined,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        estimatedPaymentDate: dto.estimatedPaymentDate ? new Date(dto.estimatedPaymentDate) : undefined,
      },
      include: { client: true },
    });
  }

  async pay(companyId: string, id: string, dto: PayInvoiceDto) {
    const invoice = await this.findOne(companyId, id);
    if (invoice.status === 'PAID') {
      throw new BadRequestException('La factura ya está pagada.');
    }

    return this.prisma.invoice.update({
      where: { id: invoice.id },
      data: {
        status: 'PAID',
        paidAt: dto.paidAt ? new Date(dto.paidAt) : new Date(),
      },
      include: { client: true },
    });
  }

  async remove(companyId: string, id: string) {
    const invoice = await this.findOne(companyId, id);
    return this.prisma.invoice.delete({
      where: { id: invoice.id },
    });
  }
}
