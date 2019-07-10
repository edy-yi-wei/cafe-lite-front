import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvoiceComponent } from './invoice.component';
import { RouterGuard } from '../../service/router-guard';

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
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionRoutingModule {}
