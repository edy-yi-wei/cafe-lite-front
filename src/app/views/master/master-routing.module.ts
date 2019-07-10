import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModuleComponent } from './module.component';
import { RoleComponent } from './role.component';
import { UserComponent } from './user.component';
import { MenuComponent } from './menu.component';
import { RouterGuard } from '../../service/router-guard';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Master'
    },
    children: [
      {
        path: 'menu',
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
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterRoutingModule {}
