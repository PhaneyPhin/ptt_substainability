import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { policyTargetRoutes } from './policy-target-routing';
import { PolicyTargetComponent } from './policy-target.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FilterBoxModule } from '../filter-box/filter-box..modules';


@NgModule({
    imports: [
        RouterModule.forChild(policyTargetRoutes),
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        FilterBoxModule
    ],
    declarations: [
        PolicyTargetComponent
    ]
})
export class PolicyTargetModule { }
