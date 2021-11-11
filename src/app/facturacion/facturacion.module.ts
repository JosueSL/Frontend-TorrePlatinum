import { NgModule, NO_ERRORS_SCHEMA   } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common'
import { FacturacionComponent } from './facturacion.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule } from 'ng2-charts';
import { DataTableModule } from 'angular-6-datatable';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { NgSelectModule } from '@ng-select/ng-select';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Facturacion',
      urls: [
        { title: 'Menu', url: '/facturacion' },
        { title: 'Facturacion' }
      ]
    },
    component: FacturacionComponent
  }
];

@NgModule({
  imports: [NgMultiSelectDropDownModule.forRoot(), FormsModule, CommonModule, RouterModule.forChild(routes), NgbModule,
    ChartsModule, DataTableModule, NgSelectModule],
  declarations: [FacturacionComponent],
  providers: [DatePipe]
})
export class FacturacionModule {}
