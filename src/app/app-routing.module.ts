import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthGuard } from './modelos/auth/auth.guard';
import { FullComponent } from './layouts/full/full.component';
import { LoginComponent } from './login/login.component';

export const Approutes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'sys',
    component: FullComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'facturacion',
        loadChildren: () => import('./facturacion/facturacion.module').then(m => m.FacturacionModule)
      },
      {
        path: 'configuracion',
        loadChildren: () => import('./component/component.module').then(m => m.ComponentsModule)
      },
      {
        path: 'servicio',
        loadChildren: () => import('./component/component.module').then(m => m.ComponentsModule)
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/'
  }
];
