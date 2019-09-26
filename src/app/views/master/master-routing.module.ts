import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModuleComponent } from './module.component';
import { RoleComponent } from './role.component';
import { UserComponent } from './user.component';
import { MenuComponent } from './menu.component';
import { RouterGuard } from '../../service/router-guard';
import { SupplierComponent } from './supplier.component';
import { MaterialComponent } from './material.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Master'
    },
    children: [
      {
        path: 'menu',
        // component: MenuComponent,
        component: MenuComponent, canActivate: [RouterGuard],
        data: {
          title: 'Menu'
        }
      },
      {
        path: 'module',
        component: ModuleComponent, canActivate: [RouterGuard],
        data: {
          title: 'Modul'
        }
      },
      {
        path: 'role',
        component: RoleComponent, canActivate: [RouterGuard],
        data: {
          title: 'Role'
        }
      },
      {
        path: 'user',
        component: UserComponent, canActivate: [RouterGuard],
        data: {
          title: 'User'
        }
      },
      {
        path: 'supplier',
        // component: SupplierComponent,
        component: SupplierComponent, canActivate: [RouterGuard],
        data: {
          title: 'Supplier'
        }
      },
      {
        path: 'material',
        // component: SupplierComponent,
        component: MaterialComponent, canActivate: [RouterGuard],
        data: {
          title: 'Material'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterRoutingModule {}
