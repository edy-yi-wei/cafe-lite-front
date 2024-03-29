// Angular
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { PaginationModule } from 'ngx-bootstrap/pagination';

// Components Routing
import { TransactionRoutingModule } from './transaction-routing.module';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { ModalModule } from 'ngx-bootstrap/modal';
import { InvoiceComponent } from './invoice.component';
import { PurchasingComponent } from './purchasing.component';
import { AdjustmentComponent } from './adjustment.component';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TransactionRoutingModule,
    PaginationModule.forRoot(),
    NgxMaskModule.forRoot(options),
    ModalModule.forRoot()
  ],
  declarations: [
    InvoiceComponent,
    PurchasingComponent,
    AdjustmentComponent
  ]
})
export class TransactionModule { }
