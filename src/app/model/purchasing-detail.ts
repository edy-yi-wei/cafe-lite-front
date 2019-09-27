import { Material } from './material';


export class PurchasingDetail {
    purchasingDetailId: number = 0;
    material: Material;
    quantity: number = 0;
    price: number = 0;    
    total: number = 0;
}