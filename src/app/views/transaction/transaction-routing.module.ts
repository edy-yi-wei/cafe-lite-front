import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvoiceComponent } from './invoice.component';
import { RouterGuard } from '../../service/router-guard';
import { PurchasingComponent } from './purchasing.component';
import { AdjustmentComponent } from './adjustment.component';

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
      },
      {
        path: 'adjustment',
        component: AdjustmentComponent, canActivate: [RouterGuard],
        data: {
          title: 'Penyesuaian'
        }
      }
      , {
        path: 'adjustment',
        component: AdjustmentComponent, canActivate: [RouterGuard],
        data: {
          title: 'Penyesuaian Stock'
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
