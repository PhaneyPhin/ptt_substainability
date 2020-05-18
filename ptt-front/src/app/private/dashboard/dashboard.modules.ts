import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { dashboardRoute } from './dashboard-routing';
import { DashboardComponent } from './dashboard.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FilterBoxModule } from '../filter-box/filter-box..modules';
import { PipeModule } from 'src/app/pipes/pipe.modules';

@NgModule({
    imports: [
        RouterModule.forChild(dashboardRoute),
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        FilterBoxModule,
        PipeModule
    ],
    declarations: [
      DashboardComponent
    ]
})
export class DashboardModule { }
