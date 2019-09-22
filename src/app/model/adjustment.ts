import { User } from './user';
import { Supplier } from './supplier';
import { AdjustmentDetail } from './adjustment-detail';

export class Adjustment {
    adjustmentId: number = 0;
    adjustmentNumber: string = '';
    adjustmentDate: Date;
    user: User;
    details: AdjustmentDetail[] = [];
}