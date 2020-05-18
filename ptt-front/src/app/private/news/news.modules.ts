import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { newsRoutes } from './news-routing';
import { NewsComponent } from './news.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AnnouncementComponent } from './announcement/announcement.component';
import { AnnouncementDetailComponent } from './announcement-detail/announcement-detail.component';
import { ActivityComponent } from './activity/activity.component';
import { ActivityDetailComponent } from './activity-detail/activity-detail.component';
import { AwardComponent } from './award/award.component';
import { AwardDetailComponent } from './award-detail/award-detail.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PipeModule } from 'src/app/pipes/pipe.modules';
import { FilterBoxModule } from '../filter-box/filter-box..modules';

@NgModule({
    imports: [
        RouterModule.forChild(newsRoutes),
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        PipeModule,
        FilterBoxModule
    ],
    declarations: [
        NewsComponent,
        AnnouncementComponent,
        AnnouncementDetailComponent,
        ActivityComponent,
        ActivityDetailComponent,
        AwardComponent,
        AwardDetailComponent
    ]
})
export class NewsModule { }
