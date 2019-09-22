import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvoiceComponent } from './invoice.component';
import { RouterGuard } from '../../service/router-guard';
import { PurchasingComponent } from './purchasing.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Transaction'
    },
    children: [      
      {
        path: 'invoice',
        component: InvoiceComponent, canActivate: [RouterGuard],
        data: {
          title: 'Penjualan'
        }
      }
      ,{
        path: 'purchasing',
        component: PurchasingComponent, canActivate: [RouterGuard],
        data: {
          title: 'Pembelian'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionRoutingModule {}
