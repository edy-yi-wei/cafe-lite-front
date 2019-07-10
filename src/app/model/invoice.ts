import { InvoiceDetail } from './invoice-detail';

export class Invoice {
    invoiceId: number = 0;
    invoiceNumber: string = '';
    invoiceDate: Date;
    invoiceType: string = 'Makan';
    customerName: string = '';
    payment: number = 0;
    details: InvoiceDetail[] = [];
}