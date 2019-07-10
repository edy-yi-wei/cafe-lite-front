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
    CashierReportComponent,
    SoldMenuReportComponent,
    SendMailComponent
  ]
})
export class ReportModule { }
