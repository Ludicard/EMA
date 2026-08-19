import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats(companyId: string | null) {
    if (!companyId) {
      return { noCompany: true };
    }
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
    let paidCount = 0;
    const now = new Date();

    // Prepare structure for last 6 months
    const monthlyDataMap = new Map<string, { name: string; facturado: number; cobrado: number }>();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const monthName = d.toLocaleString('es-ES', { month: 'short' });
      monthlyDataMap.set(monthKey, { name: monthName.charAt(0).toUpperCase() + monthName.slice(1), facturado: 0, cobrado: 0 });
    }

    invoices.forEach((inv) => {
      const amount = Number(inv.amount);
      totalInvoiced += amount;

      if (inv.status === 'PAID') {
        totalPaid += amount;
        paidCount++;
      } else if (inv.status === 'PENDING') {
        if (new Date(inv.dueDate) < now) {
          totalOverdue += amount;
          overdueCount++;
        } else {
          totalPending += amount;
          pendingCount++;
        }
      }

      // Aggregate for chart
      const invDate = new Date(inv.issueDate);
      const monthKey = `${invDate.getFullYear()}-${String(invDate.getMonth() + 1).padStart(2, '0')}`;
      if (monthlyDataMap.has(monthKey)) {
        const data = monthlyDataMap.get(monthKey)!;
        data.facturado += amount;
        if (inv.status === 'PAID') {
          data.cobrado += amount;
        }
      }
    });

    const monthlyData = Array.from(monthlyDataMap.values());

    return {
      totalClients: clientsCount,
      totalInvoices: invoices.length,
      totalInvoiced,
      totalPending,
      totalPaid,
      totalOverdue,
      pendingCount,
      overdueCount,
      paidCount,
      monthlyData,
    };
  }
}
