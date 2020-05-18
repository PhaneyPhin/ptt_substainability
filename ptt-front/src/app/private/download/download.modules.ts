import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { downloadRoutes } from './download-routing';
import { DownloadComponent } from './download.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PipeModule } from 'src/app/pipes/pipe.modules';
import { ReportDetailComponent } from './report-detail/report-detail.component';
import { FilterBoxModule } from '../filter-box/filter-box..modules';

@NgModule({
    imports: [
        RouterModule.forChild(downloadRoutes),
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        PipeModule,
        FilterBoxModule
    ],
    declarations: [
        DownloadComponent,
        ReportDetailComponent
    ]
})
export class DownloadModule { }
