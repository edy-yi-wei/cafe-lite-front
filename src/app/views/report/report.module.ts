// Angular
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

// Components Routing
import { ReportRoutingModule } from './report-routing.module';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { InvoiceReportComponent } from './invoice-report.component';
import { CashierReportComponent } from './cashier-report.component';
import { SoldMenuReportComponent } from './sold-menu-report.component';
import { SendMailComponent } from './send-mail.component';
import { PurchasingReportComponent } from './purchasing-report.component';
import { AdjustReportComponent } from './adjust-stock-report.component';
import { StockReportComponent } from './stock-report.component';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ReportRoutingModule,    
    PaginationModule.forRoot(),
    NgxMaskModule.forRoot(options),
    BsDatepickerModule.forRoot()
  ],
  declarations: [
    InvoiceReportComponent,
    PurchasingReportComponent,
    AdjustReportComponent,
    CashierReportComponent,
    SoldMenuReportComponent,
    SendMailComponent,
    StockReportComponent
  ]
})
export class ReportModule { }
