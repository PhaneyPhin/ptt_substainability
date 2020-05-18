import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { aboutSMRoutes } from './about-sm-routing';
import { AboutSmComponent } from './about-sm.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OverviewOfSmManagementComponent } from './overview-of-sm-management/overview-of-sm-management.component';
import { SmFunctionComponent } from './sm-function/sm-function.component';
import { SmGovernanceMechanismComponent } from './sm-governance-mechanism/sm-governance-mechanism.component';
import { SmVisionAndMissionComponent } from './sm-vision-and-mission/sm-vision-and-mission.component';
import { FilterBoxModule } from '../filter-box/filter-box..modules';
import { PipeModule } from 'src/app/pipes/pipe.modules';

@NgModule({
    imports: [
        RouterModule.forChild(aboutSMRoutes),
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        FilterBoxModule,
        PipeModule
    ],
    declarations: [
        AboutSmComponent,
        OverviewOfSmManagementComponent,
        SmFunctionComponent,
        SmGovernanceMechanismComponent,
        SmVisionAndMissionComponent
    ]
})
export class AboutSMModule { }
