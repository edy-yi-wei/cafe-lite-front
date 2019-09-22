import { MaterialDetail } from './material-details';

export class Material {
    materialId: number = 0;
    materialCode: string = '';
    materialName: string = '';
    uom: string = '';
    quantity: number = 0;
    stockable: boolean = false;
    deleted: boolean = false;
    details: MaterialDetail[] = [];
}