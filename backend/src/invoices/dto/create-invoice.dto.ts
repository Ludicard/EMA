export class CreateInvoiceDto {
  clientId: string;
  number: string;
  issueDate: string;
  dueDate: string;
  estimatedPaymentDate?: string;
  amount: number;
  notes?: string;
}
