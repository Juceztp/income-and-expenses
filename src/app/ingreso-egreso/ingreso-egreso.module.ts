import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { StoreModule } from '@ngrx/store';

import { SharedModule } from '../shared/shared.module';
import { DashboardRoutingModule } from '../dashboard/dashboard-routing.module';

import { DashboardComponent } from '../dashboard/dashboard.component';
import { IngresoEgresoComponent } from './ingreso-egreso.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { DetailsComponent } from './details/details.component';

import { SortIngresoEgresoPipe } from './sort-ingreso-egreso.pipe';

import { ingresoEgresoReducer } from './ingreso-egreso-reducer';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ChartsModule,
    SharedModule,
    DashboardRoutingModule,
    StoreModule.forFeature('ingresoEgreso', ingresoEgresoReducer),
  ],
  declarations: [
    DashboardComponent,
    IngresoEgresoComponent,
    StatisticsComponent,
    DetailsComponent,
    SortIngresoEgresoPipe
  ]
})
export class IngresoEgresoModule { }
