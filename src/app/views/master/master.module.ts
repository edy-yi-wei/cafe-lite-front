// Angular
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { PaginationModule } from 'ngx-bootstrap/pagination';

// Components Routing
import { MasterRoutingModule } from './master-routing.module';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { ModuleComponent } from './module.component';
import { RoleComponent } from './role.component';
import { UserComponent } from './user.component';
import { MenuComponent } from './menu.component';
import { SupplierComponent } from './supplier.component';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MasterRoutingModule,
    PaginationModule.forRoot(),
    NgxMaskModule.forRoot(options)
  ],
  declarations: [
    ModuleComponent,
    RoleComponent,
    UserComponent,
    MenuComponent,
    SupplierComponent
  ]
})
export class MasterModule { }
