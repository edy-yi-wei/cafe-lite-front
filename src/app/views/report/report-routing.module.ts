import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvoiceReportComponent } from './invoice-report.component';
import { CashierReportComponent } from './cashier-report.component';
import { SoldMenuReportComponent } from './sold-menu-report.component';
import { RouterGuard } from '../../service/router-guard';
import { SendMailComponent } from './send-mail.component';
import { PurchasingReportComponent } from './purchasing-report.component';
import { AdjustReportComponent } from './adjust-stock-report.component';
import { StockReportComponent } from './stock-report.component';

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
        path: 'pembelian',
        component: PurchasingReportComponent, canActivate: [RouterGuard],
        data: {
          title: 'Pembelian'
        }
      },
      {
        path: 'adjust-stock',
        component: AdjustReportComponent, canActivate: [RouterGuard],
        data: {
          title: 'Penyesuaian Stok'
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
      },
      {
        path: 'stock',
        component: StockReportComponent, canActivate: [RouterGuard],
        data: {
          title: 'stok'
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
