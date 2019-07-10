import { Module } from './module';

export class ModuleList {
    roleModuleId: number = 0;
    orderNumber: number = 0;
    module: Module = null;
    readOnly: boolean = false;
    active: boolean = false;
}