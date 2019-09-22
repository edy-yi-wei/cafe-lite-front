import { User } from './user';
import { Supplier } from './supplier';
import { PurchasingDetail } from './purchasing-detail';

export class Purchasing {
    purchasingId: number = 0;
    purchasingNumber: string = '';
    purchasingDate: Date;
    user: User;
    supplier: Supplier;
    amount: number = 0;
    discount: number = 0;
    netto: number = 0;
    details: PurchasingDetail[] = [];
}