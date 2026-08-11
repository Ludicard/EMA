import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats(companyId: string) {
    const clientsCount = await this.prisma.client.count({
      where: { companyId },
    });

    const invoices = await this.prisma.invoice.findMany({
      where: { companyId },
    });

    let totalInvoiced = 0;
    let totalPending = 0;
    let totalPaid = 0;
    let totalOverdue = 0;
    let pendingCount = 0;
    let overdueCount = 0;
    const now = new Date();

    invoices.forEach((inv) => {
      const amount = Number(inv.amount);
      totalInvoiced += amount;

      if (inv.status === 'PAID') {
        totalPaid += amount;
      } else if (inv.status === 'PENDING') {
        if (new Date(inv.dueDate) < now) {
          totalOverdue += amount;
          overdueCount++;
        } else {
          totalPending += amount;
          pendingCount++;
        }
      }
    });

    return {
      totalClients: clientsCount,
      totalInvoices: invoices.length,
      totalInvoiced,
      totalPending,
      totalPaid,
      totalOverdue,
      pendingCount,
      overdueCount,
    };
  }
}
