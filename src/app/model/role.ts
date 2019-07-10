import { ModuleList } from './module-list';

export class Role {
    roleId: number = 0;
    roleName: string = '';
    notes: string = '';
    moduleList: ModuleList[] = [];
}