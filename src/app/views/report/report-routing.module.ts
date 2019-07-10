import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvoiceReportComponent } from './invoice-report.component';
import { CashierReportComponent } from './cashier-report.component';
import { SoldMenuReportComponent } from './sold-menu-report.component';
import { RouterGuard } from '../../service/router-guard';
import { SendMailComponent } from './send-mail.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Report'
    },
    children: [      
      {
        path: 'penjualan',
        component: InvoiceReportComponent, canActivate: [RouterGuard],
        data: {
          title: 'Penjualan'
        }
      },
      {
        path: 'cashier-omzet',
        component: CashierReportComponent, canActivate: [RouterGuard],
        data: {
          title: 'Omzet Kasir'
        }
      },
      {
        path: 'sold-menu',
        component: SoldMenuReportComponent, canActivate: [RouterGuard],
        data: {
          title: 'Menu Terjual'
        }
      },
      {
        path: 'send-mail',
        component: SendMailComponent, canActivate: [RouterGuard],
        data: {
          title: 'Kirim Laporan'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule {}
