import { MenuMaterial } from './menu-material';

export class Menu {
    menuId: number = 0;
    menuCode: string = '';
    menuName: string = '';
    printoutName: string = '';
    menuPrice: number = 0;    
    materials: MenuMaterial[] = [];
}